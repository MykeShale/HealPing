"use client"

import type React from "react"
import { useAuth } from "@/lib/auth-context"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface DashboardWrapperProps {
  children: React.ReactNode
  requiredRole?: "doctor" | "patient" | "admin"
  title?: string
  description?: string
}

export function DashboardWrapper({ children, requiredRole, title, description }: DashboardWrapperProps) {
  const { user, profile, loading, initialized } = useAuth()
  const router = useRouter()
  const [shouldRender, setShouldRender] = useState(false)
  const [redirecting, setRedirecting] = useState(false)

  useEffect(() => {
    // Only proceed if auth is initialized
    if (!initialized) return

    // If no user, redirect to auth
    if (!user) {
      setRedirecting(true)
      router.push("/auth")
      return
    }

    // If user exists but no profile, they might need to complete setup
    if (user && !profile) {
      setRedirecting(true)
      router.push("/auth/role-selection")
      return
    }

    // If role is required and doesn't match, redirect to appropriate dashboard
    if (requiredRole && profile && profile.role !== requiredRole) {
      setRedirecting(true)
      switch (profile.role) {
        case "doctor":
          router.push("/doctor/dashboard")
          break
        case "patient":
          router.push("/patient/dashboard")
          break
        default:
          router.push("/dashboard")
      }
      return
    }

    // All checks passed, render the component
    setShouldRender(true)
    setRedirecting(false)
  }, [user, profile, initialized, requiredRole, router])

  // Show loading while auth is initializing
  if (!initialized || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" />
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{title || "Loading..."}</h2>
            <p className="text-gray-600">{description || "Please wait while we load your dashboard."}</p>
          </div>
        </div>
      </div>
    )
  }

  // Show loading while redirecting
  if (redirecting || !shouldRender) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" />
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Redirecting...</h2>
            <p className="text-gray-600">Taking you to the right place.</p>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
