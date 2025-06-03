"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { RoleSelection } from "@/components/auth/role-selection"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { PageWrapper } from "@/components/ui/page-wrapper"

function AuthCallbackContent() {
  const router = useRouter()
  const [needsRoleSelection, setNeedsRoleSelection] = useState(false)
  const [userInfo, setUserInfo] = useState<{ id: string; email: string; full_name?: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const handleAuthCallback = async () => {
      try {
        // Handle the OAuth callback
        const { data, error } = await supabase.auth.getSession()

        if (!mounted) return

        if (error) {
          console.error("Auth callback error:", error)
          setError("Authentication failed. Please try again.")
          setTimeout(() => router.push("/auth"), 3000)
          return
        }

        if (data.session) {
          const user = data.session.user

          // Check if user has a profile
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single()

          if (!mounted) return

          if (profileError && profileError.code !== "PGRST116") {
            console.error("Profile fetch error:", profileError)
            setError("Failed to load user profile. Please try again.")
            setTimeout(() => router.push("/auth"), 3000)
            return
          }

          if (!profile) {
            // User needs to select role and complete profile
            setUserInfo({
              id: user.id,
              email: user.email!,
              full_name: user.user_metadata?.full_name || user.user_metadata?.name || null,
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
          // No session, redirect to auth
          router.push("/auth")
        }
      } catch (error) {
        console.error("Unexpected error:", error)
        if (mounted) {
          setError("An unexpected error occurred. Please try again.")
          setTimeout(() => router.push("/auth"), 3000)
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    handleAuthCallback()

    return () => {
      mounted = false
    }
  }, [router])

  const handleRoleSelectionComplete = () => {
    // Refresh the page to trigger auth state update
    window.location.reload()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">Setting up your account...</h2>
          <p className="text-gray-600">Please wait while we complete your sign-in.</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <h3 className="font-bold">Authentication Error</h3>
            <p>{error}</p>
          </div>
          <p className="text-gray-600">Redirecting you back to the login page...</p>
        </div>
      </div>
    )
  }

  if (needsRoleSelection && userInfo) {
    return (
      <RoleSelection
        userId={userInfo.id}
        userEmail={userInfo.email}
        fullName={userInfo.full_name}
        onComplete={handleRoleSelectionComplete}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" className="mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900">Completing setup...</h2>
        <p className="text-gray-600">Almost done!</p>
      </div>
    </div>
  )
}

export default function AuthCallback() {
  return (
    <PageWrapper requireAuth={false}>
      <AuthCallbackContent />
    </PageWrapper>
  )
}
