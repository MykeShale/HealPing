"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error("Auth callback error:", error)
          router.push("/")
          return
        }

        if (data.session) {
          // Check if user has a profile
          const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.session.user.id).single()

          if (!profile) {
            // Create profile for new user
            const { error: profileError } = await supabase.from("profiles").insert({
              id: data.session.user.id,
              full_name: data.session.user.user_metadata.full_name || "New User",
              role: "doctor", // Default role
              avatar_url: data.session.user.user_metadata.avatar_url,
            })

            if (profileError) {
              console.error("Error creating profile:", profileError)
            }
          }

          router.push("/dashboard")
        } else {
          router.push("/")
        }
      } catch (error) {
        console.error("Unexpected error:", error)
        router.push("/")
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900">Setting up your account...</h2>
        <p className="text-gray-600">Please wait while we complete your sign-in.</p>
      </div>
    </div>
  )
}
