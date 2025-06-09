"use client"

import type React from "react"
import { useAuth } from "@/lib/auth-context"
import { LoadingSpinner } from "./loading-spinner"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface PageWrapperProps {
  children: React.ReactNode
  requireAuth?: boolean
  requiredRole?: "doctor" | "patient" | "admin"
}

export function PageWrapper({ children, requireAuth = true, requiredRole }: PageWrapperProps) {
  const { user, profile, loading, initialized } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (initialized && requireAuth) {
      if (!user) {
        router.push("/auth")
        return
      }

      if (requiredRole && profile?.role !== requiredRole) {
        // Redirect to appropriate dashboard based on role
        if (profile?.role === "doctor") {
          router.push("/doctor/dashboard")
        } else if (profile?.role === "patient") {
          router.push("/patient/dashboard")
        } else {
          router.push("/auth")
        }
      }
    }
  }, [user, profile, loading, initialized, requireAuth, requiredRole, router])

  // Show loading while auth is initializing
  if (!initialized || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">Loading...</h2>
          <p className="text-gray-600">Please wait while we load your content.</p>
        </div>
      </div>
    )
  }

  // If auth is required but user is not authenticated
  if (requireAuth && !user) {
    return null // Will redirect in useEffect
  }

  // If specific role is required but user doesn't have it
  if (requiredRole && profile?.role !== requiredRole) {
    return null // Will redirect in useEffect
  }

  return <>{children}</>
}
