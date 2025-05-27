import { ProtectedRoute } from "@/components/auth/protected-route"
import { DoctorDashboard } from "@/components/dashboard/doctor-dashboard"

export default function DoctorDashboardPage() {
  return (
    <ProtectedRoute requiredRole="doctor">
      <DoctorDashboard />
    </ProtectedRoute>
  )
}
