"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import type { Database } from "./database.types"

type Profile = {
  id: string
  first_name: string | null
  last_name: string | null
  role: "doctor" | "patient" | "admin" | null
  avatar_url: string | null
  preferences: any | null
}

type AuthContextType = {
  user: any | null
  profile: Profile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<any>
  signUp: (email: string, password: string) => Promise<any>
  signOut: () => Promise<void>
  updateProfile: (profile: Partial<Profile>) => Promise<void>
  setRole: (role: "doctor" | "patient" | "admin") => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    const getSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        setUser(session?.user || null)

        if (session?.user) {
          const { data, error } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

          if (error) {
            console.error("Error fetching profile:", error)
          } else {
            setProfile(data as Profile)
          }
        }
      } catch (error) {
        console.error("Error getting session:", error)
      } finally {
        setLoading(false)
      }
    }

    getSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user || null)

      if (session?.user) {
        const { data, error } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

        if (error) {
          console.error("Error fetching profile:", error)
        } else {
          setProfile(data as Profile)
        }
      } else {
        setProfile(null)
      }

      setLoading(false)
      router.refresh()
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, router])

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      console.error("Error signing in:", error)
      throw error
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      console.error("Error signing up:", error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      router.push("/auth")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const updateProfile = async (profileData: Partial<Profile>) => {
    try {
      if (!user) throw new Error("No user logged in")

      const { error } = await supabase.from("profiles").update(profileData).eq("id", user.id)

      if (error) throw error

      setProfile((prev) => (prev ? { ...prev, ...profileData } : null))
    } catch (error) {
      console.error("Error updating profile:", error)
      throw error
    }
  }

  const setRole = async (role: "doctor" | "patient" | "admin") => {
    try {
      if (!user) throw new Error("No user logged in")

      const { error } = await supabase.from("profiles").update({ role }).eq("id", user.id)

      if (error) throw error

      setProfile((prev) => (prev ? { ...prev, role } : null))

      // Redirect based on role
      if (role === "doctor") {
        router.push("/doctor/dashboard")
      } else if (role === "patient") {
        router.push("/patient/dashboard")
      } else {
        router.push("/dashboard")
      }
    } catch (error) {
      console.error("Error setting role:", error)
      throw error
    }
  }

  const value = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    setRole,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
