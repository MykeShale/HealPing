"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useRouter } from "next/navigation"

interface DashboardWrapperProps {
  children: React.ReactNode
  requiredRole?: "doctor" | "patient" | "admin"
  title?: string
  description?: string
}

export function DashboardWrapper({ children, requiredRole, title, description }: DashboardWrapperProps) {
  const { user, profile, loading } = useAuth()
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    if (!loading) {
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
        return
      }

      setIsAuthorized(true)
    }
  }, [user, profile, loading, requiredRole, router])

  if (loading) {
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

  if (!isAuthorized) {
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
