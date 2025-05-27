"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { RoleSelection } from "@/components/auth/role-selection"

export default function AuthCallback() {
  const router = useRouter()
  const [needsRoleSelection, setNeedsRoleSelection] = useState(false)
  const [userInfo, setUserInfo] = useState<{ id: string; email: string } | null>(null)

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
            // User needs to select role and complete profile
            setUserInfo({
              id: data.session.user.id,
              email: data.session.user.email!,
            })
            setNeedsRoleSelection(true)
          } else {
            // User has profile, redirect to appropriate dashboard
            if (profile.role === "doctor") {
              router.push("/doctor/dashboard")
            } else if (profile.role === "patient") {
              router.push("/patient/dashboard")
            } else {
              router.push("/dashboard")
            }
          }
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

  const handleRoleSelectionComplete = () => {
    // Refresh the page to trigger auth state update
    window.location.reload()
  }

  if (needsRoleSelection && userInfo) {
    return <RoleSelection userId={userInfo.id} userEmail={userInfo.email} onComplete={handleRoleSelectionComplete} />
  }

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
