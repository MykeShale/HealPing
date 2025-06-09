import { createClient } from "@supabase/supabase-js"
import type { Database } from "./database.types"

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Validate required environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase configuration error:", {
    url: !!supabaseUrl,
    key: !!supabaseAnonKey,
    urlValue: supabaseUrl?.slice(0, 30) + "...",
    keyValue: supabaseAnonKey?.slice(0, 30) + "...",
  })
  throw new Error("Missing Supabase environment variables")
}

// Create Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: "pkce",
  },
})

// Helper function to check if Supabase is configured
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey)
}

// Safe Supabase client getter
export const getSupabase = () => {
  return supabase
}

// Check if Google OAuth is enabled
export const isGoogleOAuthEnabled = async () => {
  try {
    // Try to get the auth providers configuration
    const { data, error } = await supabase.auth.getSession()
    if (error) return false

    // For now, we'll assume it's enabled and handle errors gracefully
    return true
  } catch (error) {
    console.error("Error checking Google OAuth status:", error)
    return false
  }
}

// Google OAuth helper with better error handling
export const signInWithGoogle = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    })

    if (error) {
      console.error("Google OAuth error:", error)

      // Handle specific error cases
      if (error.message?.includes("provider is not enabled") || error.message?.includes("Unsupported provider")) {
        throw new Error("Google login is not configured. Please contact support or use email authentication.")
      }

      if (error.message?.includes("popup")) {
        throw new Error("Popup was blocked. Please allow popups and try again.")
      }

      throw new Error(error.message || "Google sign-in failed. Please try again.")
    }

    return data
  } catch (error: any) {
    console.error("Error signing in with Google:", error)
    throw error
  }
}

export type Tables<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Row"]
export type Inserts<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Insert"]
export type Updates<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Update"]
