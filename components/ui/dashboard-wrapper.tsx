"use client"

import type { ReactNode } from "react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useAuth } from "@/lib/auth-context"

interface DashboardWrapperProps {
  children: ReactNode
  requiredRole?: "doctor" | "patient" | "admin"
  title?: string
  description?: string
}

export function DashboardWrapper({
  children,
  requiredRole,
  title = "Loading...",
  description = "Please wait while we load your data...",
}: DashboardWrapperProps) {
  const { user, profile, loading: authLoading } = useAuth()

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text={description} />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Please Sign In</h2>
          <p className="text-gray-600">You need to be signed in to access this page.</p>
        </div>
      </div>
    )
  }

  if (requiredRole && profile?.role !== requiredRole) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
