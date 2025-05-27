import type React from "react"
import { PatientLayout } from "@/components/layout/patient-layout"

export default function PatientLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return <PatientLayout>{children}</PatientLayout>
}
