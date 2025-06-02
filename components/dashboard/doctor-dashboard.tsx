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
import { motion } from "framer-motion"
import Link from "next/link"

interface DashboardStats {
  total_patients: number
  today_appointments: number
  pending_reminders: number
  upcoming_followups: number
  overdue_followups: number
}

export function DoctorDashboard() {
  const { profile } = useAuth()

  const {
    data: stats,
    loading,
    error,
    refetch,
  } = useDashboardData<DashboardStats>({
    fetchFunction: getDashboardStats,
    fallbackData: {
      total_patients: 0,
      today_appointments: 0,
      pending_reminders: 0,
      upcoming_followups: 0,
      overdue_followups: 0,
    },
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

  // Add a refresh function that can be called from child components
  const refreshDashboard = () => {
    refetch()
  }

  return (
    <DashboardWrapper requiredRole="doctor" title="Doctor Dashboard" description="Loading your practice overview...">
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
          >
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, Dr. {profile?.full_name || profile?.first_name || "Doctor"}!
              </h1>
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
          </motion.div>

          {/* Error State */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 rounded-lg p-4"
            >
              <div className="flex items-center gap-2 text-red-800">
                <AlertTriangle className="h-5 w-5" />
                <span className="font-medium">Unable to load some data</span>
              </div>
              <p className="text-red-600 text-sm mt-1">{error}. Showing cached data where available.</p>
              <Button variant="outline" size="sm" onClick={refetch} className="mt-2 text-red-700 border-red-300">
                Try Again
              </Button>
            </motion.div>
          )}

          {/* Key Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
                <Calendar className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{loading ? "..." : stats.today_appointments}</div>
                <p className="text-xs text-muted-foreground">{loading ? "Loading..." : "Scheduled for today"}</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
                <Users className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{loading ? "..." : stats.total_patients}</div>
                <p className="text-xs text-muted-foreground">{loading ? "Loading..." : "Active in your practice"}</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Reminders</CardTitle>
                <Bell className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{loading ? "..." : stats.pending_reminders}</div>
                <p className="text-xs text-muted-foreground">{loading ? "Loading..." : "Scheduled to send"}</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Follow-ups Due</CardTitle>
                <Activity className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{loading ? "..." : stats.upcoming_followups}</div>
                <p className="text-xs text-muted-foreground">
                  {loading ? "Loading..." : `${stats.overdue_followups} overdue`}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Alert Cards */}
          {!loading && (stats.overdue_followups > 0 || stats.today_appointments > 5) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {stats.overdue_followups > 0 && (
                <Card className="border-l-4 border-l-red-500 bg-red-50">
                  <CardHeader>
                    <CardTitle className="text-red-700 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Overdue Follow-ups
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-red-600">
                      {stats.overdue_followups} patients have overdue follow-up appointments
                    </p>
                    <Button variant="outline" size="sm" className="mt-2 text-red-700 border-red-300" asChild>
                      <Link href="/doctor/patients?filter=overdue">Review Now</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}

              {stats.today_appointments > 5 && (
                <Card className="border-l-4 border-l-blue-500 bg-blue-50">
                  <CardHeader>
                    <CardTitle className="text-blue-700 flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Busy Day Ahead
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-blue-600">You have {stats.today_appointments} appointments scheduled today</p>
                    <Button variant="outline" size="sm" className="mt-2 text-blue-700 border-blue-300" asChild>
                      <Link href="/doctor/appointments?view=today">View Schedule</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          )}

          {/* Main Content Tabs */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
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
                        <Link href="/doctor/appointments" onClick={() => refreshDashboard()}>
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
                    {loading ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="animate-pulse flex items-center space-x-4 p-4 border rounded-lg">
                            <div className="w-16 h-4 bg-gray-200 rounded"></div>
                            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                            <div className="flex-1 space-y-2">
                              <div className="w-32 h-4 bg-gray-200 rounded"></div>
                              <div className="w-24 h-3 bg-gray-200 rounded"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No appointments scheduled for today</p>
                        <Button asChild className="mt-4">
                          <Link href="/doctor/appointments">View Full Calendar</Link>
                        </Button>
                      </div>
                    )}
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
                    {loading ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="animate-pulse flex items-center space-x-4 p-4 border rounded-lg">
                            <div className="w-4 h-4 bg-gray-200 rounded"></div>
                            <div className="w-16 h-4 bg-gray-200 rounded"></div>
                            <div className="flex-1 space-y-2">
                              <div className="w-32 h-4 bg-gray-200 rounded"></div>
                              <div className="w-48 h-3 bg-gray-200 rounded"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No pending reminders</p>
                        <Button asChild className="mt-4">
                          <Link href="/doctor/reminders">Manage Reminders</Link>
                        </Button>
                      </div>
                    )}
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
                      <div className="text-3xl font-bold text-green-600">{loading ? "..." : "85%"}</div>
                      <p className="text-sm text-gray-600">Patient reminder response rate</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Appointment Completion</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-blue-600">{loading ? "..." : "92%"}</div>
                      <p className="text-sm text-gray-600">Appointments completed on time</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Follow-up Compliance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-purple-600">{loading ? "..." : "78%"}</div>
                      <p className="text-sm text-gray-600">Patients attending follow-ups</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </DashboardWrapper>
  )
}
