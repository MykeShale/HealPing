"use client"

import type React from "react"
import { useAuth } from "@/lib/auth-context"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PageWrapperProps {
  children: React.ReactNode
  requireAuth?: boolean
  requiredRole?: "doctor" | "patient" | "admin"
  allowedRoles?: ("doctor" | "patient" | "admin")[]
  redirectTo?: string
  title?: string
  description?: string
}

export function PageWrapper({
  children,
  requireAuth = false,
  requiredRole,
  allowedRoles,
  redirectTo,
  title,
  description,
}: PageWrapperProps) {
  const { user, profile, loading, initialized, error } = useAuth()
  const router = useRouter()
  const [shouldRender, setShouldRender] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)

  useEffect(() => {
    // Don't do anything until auth is initialized
    if (!initialized) {
      setShouldRender(false)
      return
    }

    // If there's an auth error and we require auth, don't render
    if (error && requireAuth) {
      setShouldRender(false)
      return
    }

    // If auth is required but no user, redirect to auth
    if (requireAuth && !user) {
      setIsRedirecting(true)
      router.push(redirectTo || "/auth")
      return
    }

    // If auth is required and user exists but no profile, redirect to role selection
    if (requireAuth && user && !profile) {
      setIsRedirecting(true)
      router.push("/auth/callback")
      return
    }

    // Check role requirements
    if (requireAuth && profile) {
      // If specific role is required and doesn't match
      if (requiredRole && profile.role !== requiredRole) {
        setIsRedirecting(true)
        // Redirect to appropriate dashboard
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

      // If allowed roles are specified and user role is not in the list
      if (allowedRoles && !allowedRoles.includes(profile.role)) {
        setIsRedirecting(true)
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
    }

    // All checks passed, render the page
    setShouldRender(true)
    setIsRedirecting(false)
  }, [user, profile, initialized, error, requireAuth, requiredRole, allowedRoles, redirectTo, router])

  // Show loading while auth is initializing
  if (!initialized || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4 max-w-md mx-auto p-6">
          <LoadingSpinner size="lg" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{title || "Loading HealPing..."}</h2>
            <p className="text-gray-600 mt-2">{description || "Please wait while we set things up for you."}</p>
          </div>
        </div>
      </div>
    )
  }

  // Show error state if there's an auth error
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4 max-w-md mx-auto p-6">
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <div className="space-y-2">
                <p className="font-medium">Authentication Error</p>
                <p className="text-sm">{error}</p>
              </div>
            </AlertDescription>
          </Alert>
          <div className="flex gap-2 justify-center">
            <Button onClick={() => window.location.reload()} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            <Button onClick={() => router.push("/")} size="sm">
              Go Home
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Show loading while redirecting
  if (isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Redirecting...</h2>
            <p className="text-gray-600">Taking you to the right place.</p>
          </div>
        </div>
      </div>
    )
  }

  // If we don't need to render (failed auth checks), show nothing
  if (!shouldRender) {
    return null
  }

  // All good, render the page
  return <>{children}</>
}
