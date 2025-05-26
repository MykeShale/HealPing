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

export type Tables<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Row"]
export type Inserts<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Insert"]
export type Updates<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Update"]
