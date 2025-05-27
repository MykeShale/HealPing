import { DashboardWrapper } from "@/components/ui/dashboard-wrapper"
import { PatientDashboard } from "@/components/dashboard/patient-dashboard"

export default function PatientDashboardPage() {
  return (
    <DashboardWrapper requiredRole="patient">
      <PatientDashboard />
    </DashboardWrapper>
  )
}
