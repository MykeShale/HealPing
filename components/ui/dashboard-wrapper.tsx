"use client"

import type React from "react"
import { useAuth } from "@/lib/auth-context"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface DashboardWrapperProps {
  children: React.ReactNode
  requiredRole?: "doctor" | "patient" | "admin"
  title?: string
  description?: string
}

export function DashboardWrapper({ children, requiredRole, title, description }: DashboardWrapperProps) {
  const { user, profile, loading, error } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth")
      return
    }

    if (!loading && user && profile && requiredRole && profile.role !== requiredRole) {
      // Redirect to appropriate dashboard based on role
      if (profile.role === "doctor") {
        router.push("/doctor/dashboard")
      } else if (profile.role === "patient") {
        router.push("/patient/dashboard")
      } else {
        router.push("/dashboard")
      }
      return
    }
  }, [user, profile, loading, requiredRole, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          {title && <h2 className="mt-4 text-lg font-medium text-gray-900">{title}</h2>}
          {description && <p className="mt-2 text-sm text-gray-600">{description}</p>}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-lg font-medium text-gray-900">Something went wrong</h2>
          <p className="mt-2 text-sm text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to auth
  }

  if (requiredRole && (!profile || profile.role !== requiredRole)) {
    return null // Will redirect to appropriate dashboard
  }

  return <>{children}</>
}
