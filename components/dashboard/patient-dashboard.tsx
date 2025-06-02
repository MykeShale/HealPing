"use client"

import { useState, useEffect } from "react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Calendar, Heart, Bell, FileText, Clock } from "lucide-react"
import {
  getPatientAppointments,
  getPatientByUserId,
  getPatientMedicalRecords,
  getPatientReminders,
} from "@/lib/supabase-functions"
import Link from "next/link"

interface PatientStats {
  nextAppointment: any
  healthScore: number
  pendingReminders: number
  totalRecords: number
}

export function PatientDashboard() {
  const { user, profile, loading: authLoading } = useAuth()
  const [patientProfile, setPatientProfile] = useState<any>(null)
  const [appointments, setAppointments] = useState<any[]>([])
  const [medicalRecords, setMedicalRecords] = useState<any[]>([])
  const [reminders, setReminders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showBookingDialog, setShowBookingDialog] = useState(false)

  // Fetch patient data
  useEffect(() => {
    const fetchPatientData = async () => {
      if (!user?.id) return

      try {
        setLoading(true)

        // Get patient profile
        const patient = await getPatientByUserId(user.id)
        setPatientProfile(patient)

        if (patient?.id) {
          // Fetch all patient data
          const [appointmentsData, recordsData, remindersData] = await Promise.all([
            getPatientAppointments(patient.id),
            getPatientMedicalRecords(patient.id),
            getPatientReminders(patient.id),
          ])

          setAppointments(appointmentsData)
          setMedicalRecords(recordsData)
          setReminders(remindersData)
        }
      } catch (error) {
        console.error("Error fetching patient data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPatientData()
  }, [user?.id])

  // Calculate dashboard stats
  const stats: PatientStats = {
    nextAppointment: appointments.find(
      (apt) => new Date(apt.appointment_date) > new Date() && apt.status !== "cancelled",
    ),
    healthScore: 85, // This would be calculated based on various health metrics
    pendingReminders: reminders.length,
    totalRecords: medicalRecords.length,
  }

  // Get recent activity
  const recentActivity = [
    ...appointments.slice(0, 2).map((apt) => ({
      type: "appointment",
      title: apt.status === "completed" ? "Appointment completed" : "Appointment confirmed",
      description: `${new Date(apt.appointment_date).toLocaleDateString()} at ${new Date(apt.appointment_date).toLocaleTimeString()}`,
      color: apt.status === "completed" ? "bg-green-500" : "bg-blue-500",
    })),
    ...medicalRecords.slice(0, 1).map((record) => ({
      type: "record",
      title: "Lab results available",
      description: record.diagnosis || "Medical record updated",
      color: "bg-green-500",
    })),
    ...reminders.slice(0, 1).map((reminder) => ({
      type: "reminder",
      title: "Medication reminder",
      description: "Take your prescribed medication",
      color: "bg-yellow-500",
    })),
  ].slice(0, 3)

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading your dashboard..." />
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

  if (profile && profile.role !== "patient") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    )
  }

  if (!patientProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Patient Profile Not Found</h2>
          <p className="text-gray-600">Please contact your healthcare provider to set up your patient profile.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {patientProfile?.full_name || profile?.first_name || user.email}!
          </h1>
          <p className="text-gray-600 mt-2">Your health dashboard</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Appointment</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {stats.nextAppointment ? (
                <>
                  <div className="text-2xl font-bold">
                    {new Date(stats.nextAppointment.appointment_date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(stats.nextAppointment.appointment_date).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                    })}{" "}
                    - {stats.nextAppointment.treatment_type}
                  </p>
                </>
              ) : (
                <>
                  <div className="text-2xl font-bold">None</div>
                  <p className="text-xs text-muted-foreground">No upcoming appointments</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Health Score</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.healthScore}%</div>
              <p className="text-xs text-muted-foreground">
                {stats.healthScore >= 80 ? "Excellent" : stats.healthScore >= 60 ? "Good" : "Needs attention"} overall
                health
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reminders</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingReminders}</div>
              <p className="text-xs text-muted-foreground">Pending actions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Records</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRecords}</div>
              <p className="text-xs text-muted-foreground">Medical records</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage your health easily</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
                <DialogTrigger asChild>
                  <Button className="w-full justify-start" variant="outline">
                    <Calendar className="mr-2 h-4 w-4" />
                    Book Appointment
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Book New Appointment</DialogTitle>
                    <DialogDescription>Schedule your next healthcare visit</DialogDescription>
                  </DialogHeader>
                  <div className="p-4 text-center">
                    <p className="text-gray-600 mb-4">Appointment booking form will be available soon.</p>
                    <Button asChild>
                      <Link href="/patient/appointments">View Appointments</Link>
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Button className="w-full justify-start" variant="outline" asChild>
                <Link href="/patient/records">
                  <FileText className="mr-2 h-4 w-4" />
                  View Medical Records
                </Link>
              </Button>

              <Button className="w-full justify-start" variant="outline" asChild>
                <Link href="/patient/reminders">
                  <Bell className="mr-2 h-4 w-4" />
                  Medication Reminders
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest health updates</CardDescription>
            </CardHeader>
            <CardContent>
              {recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className={`w-2 h-2 ${activity.color} rounded-full`}></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.title}</p>
                        <p className="text-xs text-muted-foreground">{activity.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <Clock className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-500">No recent activity</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
