"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { supabase } from "./supabase"

type Profile = {
  id: string
  first_name: string | null
  last_name: string | null
  full_name?: string | null
  role: "doctor" | "patient" | "admin" | null
  avatar_url: string | null
  preferences: any | null
  clinic_id: string | null
}

type AuthContextType = {
  user: User | null
  profile: Profile | null
  loading: boolean
  signOut: () => Promise<void>
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    // Get initial session
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (!mounted) return

        if (error) {
          console.error("Auth session error:", error)
          setError(error.message)
          setLoading(false)
          return
        }

        setUser(session?.user ?? null)

        if (session?.user) {
          await fetchProfile(session.user.id)
        } else {
          setProfile(null)
          setLoading(false)
        }
      } catch (err) {
        if (!mounted) return
        console.error("Session fetch error:", err)
        setError("Failed to load session")
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return

      console.log("Auth state changed:", event, session?.user?.id)

      if (event === "SIGNED_OUT") {
        setUser(null)
        setProfile(null)
        setError(null)
        setLoading(false)
        return
      }

      if (event === "SIGNED_IN") {
        setUser(session?.user ?? null)

        if (session?.user) {
          await fetchProfile(session.user.id)
        } else {
          setProfile(null)
          setLoading(false)
        }
      }

      if (event === "TOKEN_REFRESHED") {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const fetchProfile = async (userId: string) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

      if (error) {
        if (error.code === "PGRST116") {
          console.log("No profile found for user, this is normal for new users")
          setProfile(null)
        } else {
          console.error("Profile fetch error:", error)
          setError(error.message)
        }
      } else {
        setProfile(data as Profile)
        setError(null)
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
      setError(error instanceof Error ? error.message : "Failed to fetch profile")
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error("Error signing out:", error)
        setError(error.message)
      } else {
        setUser(null)
        setProfile(null)
        setError(null)
        window.location.href = "/"
      }
    } catch (error) {
      console.error("Logout error:", error)
      setError("Failed to sign out")
    } finally {
      setLoading(false)
    }
  }

  return <AuthContext.Provider value={{ user, profile, loading, signOut, error }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
