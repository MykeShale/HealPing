"use client"

import { useState } from "react"
import { DashboardWrapper } from "@/components/ui/dashboard-wrapper"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useDashboardData } from "@/hooks/use-dashboard-data"
import { getDashboardStats } from "@/lib/supabase-functions"
import { useAuth } from "@/lib/auth-context"
import { Calendar, Users, Bell, Activity, TrendingUp, AlertTriangle } from "lucide-react"
import Link from "next/link"

interface DashboardStats {
  total_patients: number
  today_appointments: number
  pending_reminders: number
  upcoming_followups: number
  overdue_followups: number
}

export function DoctorDashboard() {
  const { profile, initialized } = useAuth()

  const {
    data: stats,
    loading,
    error,
    refetch,
  } = useDashboardData<DashboardStats>({
    fetchFunction: (clinicId) => getDashboardStats(clinicId),
    fallbackData: {
      total_patients: 0,
      today_appointments: 0,
      pending_reminders: 0,
      upcoming_followups: 0,
      overdue_followups: 0,
    },
    enabled: initialized && !!profile?.clinic_id,
  })

  const [recentActivity] = useState([
    {
      id: 1,
      type: "appointment",
      patient: "John Doe",
      action: "Appointment completed",
      time: "2 hours ago",
      status: "completed",
    },
    {
      id: 2,
      type: "reminder",
      patient: "Jane Smith",
      action: "Follow-up reminder sent",
      time: "4 hours ago",
      status: "sent",
    },
    {
      id: 3,
      type: "followup",
      patient: "Mike Johnson",
      action: "Follow-up scheduled",
      time: "6 hours ago",
      status: "scheduled",
    },
  ])

  return (
    <DashboardWrapper requiredRole="doctor" title="Doctor Dashboard" description="Loading your practice overview...">
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome back, Dr. {profile?.first_name || "Doctor"}!</h1>
              <p className="text-gray-600 mt-2">Here's your practice overview for today</p>
            </div>
            <div className="flex gap-3">
              <Button asChild>
                <Link href="/doctor/appointments">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Appointment
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/doctor/patients">
                  <Users className="mr-2 h-4 w-4" />
                  Add Patient
                </Link>
              </Button>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-red-800">
                <AlertTriangle className="h-5 w-5" />
                <span className="font-medium">Unable to load dashboard data</span>
              </div>
              <p className="text-red-600 text-sm mt-1">{error}</p>
              <Button variant="outline" size="sm" onClick={refetch} className="mt-2 text-red-700 border-red-300">
                Try Again
              </Button>
            </div>
          )}

          {/* No Clinic Warning */}
          {!profile?.clinic_id && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-yellow-800">
                <AlertTriangle className="h-5 w-5" />
                <span className="font-medium">Clinic Setup Required</span>
              </div>
              <p className="text-yellow-700 text-sm mt-1">
                Your account needs to be associated with a clinic to access dashboard features.
              </p>
              <Button variant="outline" size="sm" className="mt-2 text-yellow-700 border-yellow-300">
                Contact Support
              </Button>
            </div>
          )}

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
                <Calendar className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {loading ? (
                    <div className="animate-pulse bg-gray-200 h-8 w-12 rounded"></div>
                  ) : (
                    stats.today_appointments
                  )}
                </div>
                <p className="text-xs text-muted-foreground">Scheduled for today</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
                <Users className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {loading ? <div className="animate-pulse bg-gray-200 h-8 w-12 rounded"></div> : stats.total_patients}
                </div>
                <p className="text-xs text-muted-foreground">Active in your practice</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Reminders</CardTitle>
                <Bell className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {loading ? (
                    <div className="animate-pulse bg-gray-200 h-8 w-12 rounded"></div>
                  ) : (
                    stats.pending_reminders
                  )}
                </div>
                <p className="text-xs text-muted-foreground">Scheduled to send</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Follow-ups Due</CardTitle>
                <Activity className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {loading ? (
                    <div className="animate-pulse bg-gray-200 h-8 w-12 rounded"></div>
                  ) : (
                    stats.upcoming_followups
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {loading ? "Loading..." : `${stats.overdue_followups} overdue`}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="appointments">Today's Schedule</TabsTrigger>
              <TabsTrigger value="reminders">Reminders</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Common tasks for your practice</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full justify-start" variant="outline" asChild>
                      <Link href="/doctor/appointments">
                        <Calendar className="mr-2 h-4 w-4" />
                        Schedule New Appointment
                      </Link>
                    </Button>
                    <Button className="w-full justify-start" variant="outline" asChild>
                      <Link href="/doctor/patients">
                        <Users className="mr-2 h-4 w-4" />
                        Add New Patient
                      </Link>
                    </Button>
                    <Button className="w-full justify-start" variant="outline" asChild>
                      <Link href="/doctor/reminders">
                        <Bell className="mr-2 h-4 w-4" />
                        Send Bulk Reminder
                      </Link>
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <TrendingUp className="mr-2 h-4 w-4" />
                      View Practice Analytics
                    </Button>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest updates from your practice</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-center space-x-4">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              activity.status === "completed"
                                ? "bg-green-500"
                                : activity.status === "sent"
                                  ? "bg-blue-500"
                                  : "bg-yellow-500"
                            }`}
                          ></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{activity.action}</p>
                            <p className="text-xs text-muted-foreground">
                              {activity.patient} • {activity.time}
                            </p>
                          </div>
                          <Badge
                            variant={
                              activity.status === "completed"
                                ? "default"
                                : activity.status === "sent"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {activity.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="appointments" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Today's Appointments</CardTitle>
                  <CardDescription>Your schedule for {new Date().toLocaleDateString()}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No appointments scheduled for today</p>
                    <Button asChild className="mt-4">
                      <Link href="/doctor/appointments">View Full Calendar</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reminders" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Reminder Management</CardTitle>
                  <CardDescription>Manage patient follow-up reminders</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500">
                    <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No pending reminders</p>
                    <Button asChild className="mt-4">
                      <Link href="/doctor/reminders">Manage Reminders</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Response Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600">85%</div>
                    <p className="text-sm text-gray-600">Patient reminder response rate</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Appointment Completion</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-600">92%</div>
                    <p className="text-sm text-gray-600">Appointments completed on time</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Follow-up Compliance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-purple-600">78%</div>
                    <p className="text-sm text-gray-600">Patients attending follow-ups</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardWrapper>
  )
}
