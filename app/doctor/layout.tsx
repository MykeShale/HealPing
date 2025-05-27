import type React from "react"
import { DoctorLayout } from "@/components/layout/doctor-layout"

export default function DoctorLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return <DoctorLayout>{children}</DoctorLayout>
}
