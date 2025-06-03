"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react"
import type { User } from "@supabase/supabase-js"
import { supabase } from "./supabase"

interface Profile {
  id: string
  role: "doctor" | "patient" | "admin"
  full_name: string | null
  first_name: string | null
  last_name: string | null
  phone: string | null
  avatar_url: string | null
  clinic_id: string | null
  preferences: any
  created_at: string
  updated_at: string
}

interface AuthContextType {
  user: User | null
  profile: Profile | null
  loading: boolean
  initialized: boolean
  error: string | null
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  initialized: false,
  error: null,
  signOut: async () => {},
  refreshProfile: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [initialized, setInitialized] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const mountedRef = useRef(true)

  const fetchProfile = useCallback(async (userId: string): Promise<Profile | null> => {
    try {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

      if (error) {
        if (error.code === "PGRST116") {
          return null
        }
        console.error("Error fetching profile:", error)
        return null
      }

      return data as Profile
    } catch (error) {
      console.error("Unexpected error fetching profile:", error)
      return null
    }
  }, [])

  const refreshProfile = useCallback(async () => {
    if (!user?.id || !mountedRef.current) return

    try {
      const profileData = await fetchProfile(user.id)
      if (mountedRef.current) {
        setProfile(profileData)
      }
    } catch (error) {
      console.error("Error refreshing profile:", error)
    }
  }, [user?.id, fetchProfile])

  const signOut = useCallback(async () => {
    try {
      setLoading(true)
      await supabase.auth.signOut()
      if (mountedRef.current) {
        setUser(null)
        setProfile(null)
        setError(null)
      }
    } catch (error) {
      console.error("Error signing out:", error)
      if (mountedRef.current) {
        setError("Failed to sign out")
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    mountedRef.current = true

    const initializeAuth = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (!mountedRef.current) return

        if (error) {
          console.error("Error getting session:", error)
          setError(error.message)
          return
        }

        if (session?.user) {
          setUser(session.user)
          const profileData = await fetchProfile(session.user.id)
          if (mountedRef.current) {
            setProfile(profileData)
          }
        } else {
          setUser(null)
          setProfile(null)
        }
      } catch (error) {
        console.error("Error initializing auth:", error)
        if (mountedRef.current) {
          setError("Failed to initialize authentication")
        }
      } finally {
        if (mountedRef.current) {
          setLoading(false)
          setInitialized(true)
        }
      }
    }

    initializeAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mountedRef.current) return

      try {
        if (event === "SIGNED_OUT") {
          setUser(null)
          setProfile(null)
          setError(null)
        } else if (session?.user) {
          setUser(session.user)
          const profileData = await fetchProfile(session.user.id)
          if (mountedRef.current) {
            setProfile(profileData)
          }
        } else {
          setUser(null)
          setProfile(null)
        }
      } catch (error) {
        console.error("Error handling auth state change:", error)
        if (mountedRef.current) {
          setError("Authentication error occurred")
        }
      } finally {
        if (mountedRef.current) {
          setLoading(false)
          setInitialized(true)
        }
      }
    })

    return () => {
      mountedRef.current = false
      subscription.unsubscribe()
    }
  }, [fetchProfile])

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        initialized,
        error,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
