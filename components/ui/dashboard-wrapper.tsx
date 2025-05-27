"use client"

import type { ReactNode } from "react"
import { useAuth } from "@/lib/auth-context"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { AlertTriangle, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface DashboardWrapperProps {
  children: ReactNode
  requiredRole?: "doctor" | "patient" | "admin"
  title?: string
  description?: string
}

export function DashboardWrapper({
  children,
  requiredRole,
  title = "Loading Dashboard",
  description = "Please wait while we load your dashboard...",
}: DashboardWrapperProps) {
  const { user, profile, loading } = useAuth()

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-8 text-center space-y-4">
            <LoadingSpinner className="mx-auto" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
              <p className="text-gray-600 mt-2">{description}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show authentication error
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-8 text-center space-y-4">
            <Lock className="h-12 w-12 text-red-500 mx-auto" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Authentication Required</h2>
              <p className="text-gray-600 mt-2">Please log in to access this page.</p>
            </div>
            <Button onClick={() => (window.location.href = "/auth")} className="w-full">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show profile error
  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-8 text-center space-y-4">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Profile Setup Required</h2>
              <p className="text-gray-600 mt-2">Your profile needs to be completed before accessing the dashboard.</p>
            </div>
            <Button onClick={() => (window.location.href = "/auth")} className="w-full">
              Complete Setup
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show role access error
  if (requiredRole && profile.role !== requiredRole) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-8 text-center space-y-4">
            <Lock className="h-12 w-12 text-red-500 mx-auto" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Access Denied</h2>
              <p className="text-gray-600 mt-2">
                You don't have permission to access this page. Required role: {requiredRole}
              </p>
            </div>
            <Button onClick={() => (window.location.href = `/${profile.role}/dashboard`)} className="w-full">
              Go to Your Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show clinic ID error
  if (!profile.clinic_id) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-8 text-center space-y-4">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Clinic Setup Required</h2>
              <p className="text-gray-600 mt-2">Your account needs to be associated with a clinic.</p>
            </div>
            <Button onClick={() => (window.location.href = "/auth")} className="w-full">
              Complete Setup
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Render children if all checks pass
  return <>{children}</>
}
