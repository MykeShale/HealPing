import { ProtectedRoute } from "@/components/auth/protected-route"
import { PatientDashboard } from "@/components/dashboard/patient-dashboard"

export default function PatientDashboardPage() {
  return (
    <ProtectedRoute requiredRole="patient">
      <PatientDashboard />
    </ProtectedRoute>
  )
}
