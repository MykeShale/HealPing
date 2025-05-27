"use client"

import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useAuth } from "@/lib/auth-context"

const DoctorDashboard = () => {
  const { user, profile, loading: authLoading } = useAuth()

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading your dashboard..." />
      </div>
    )
  }

  if (!user || !profile || profile.role !== "doctor") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1>Doctor Dashboard</h1>
      <p>
        Welcome, Dr. {profile.firstName} {profile.lastName}!
      </p>
    </div>
  )
}

export default DoctorDashboard
