"use client"

import { useState, useEffect } from "react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getDashboardStats } from "@/lib/supabase-functions"
import {
  Calendar,
  Users,
  Bell,
  Activity,
  Clock,
  TrendingUp,
  AlertTriangle,
  MessageSquare,
  Mail,
  MoreHorizontal,
} from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

interface DashboardStats {
  total_patients: number
  today_appointments: number
  pending_reminders: number
  upcoming_followups: number
  overdue_followups: number
  completed_today: number
  missed_appointments: number
  response_rate: number
}

export function DoctorDashboard() {
  const { user, profile, loading: authLoading } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    total_patients: 0,
    today_appointments: 0,
    pending_reminders: 0,
    upcoming_followups: 0,
    overdue_followups: 0,
    completed_today: 0,
    missed_appointments: 0,
    response_rate: 0,
  })
  const [loading, setLoading] = useState(true)
  const [recentActivity, setRecentActivity] = useState([
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

  useEffect(() => {
    if (profile?.clinic_id) {
      fetchDashboardData()
    }
  }, [profile])

  const fetchDashboardData = async () => {
    try {
      const dashboardStats = await getDashboardStats(profile?.clinic_id!)
      setStats({
        ...dashboardStats,
        completed_today: 8,
        missed_appointments: 2,
        response_rate: 85,
      })
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

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

  if (profile && profile.role !== "doctor") {
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, Dr. {profile?.full_name || user.email}!</h1>
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
              <div className="text-2xl font-bold text-blue-600">{stats.today_appointments}</div>
              <p className="text-xs text-muted-foreground">
                {stats.completed_today} completed, {stats.missed_appointments} missed
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.total_patients}</div>
              <p className="text-xs text-muted-foreground">Active in your practice</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Reminders</CardTitle>
              <Bell className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.pending_reminders}</div>
              <p className="text-xs text-muted-foreground">Scheduled to send</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Follow-ups Due</CardTitle>
              <Activity className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.upcoming_followups}</div>
              <p className="text-xs text-muted-foreground">{stats.overdue_followups} overdue</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Alert Cards */}
        {(stats.overdue_followups > 0 || stats.missed_appointments > 0) && (
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
                  <p className="text-red-600">{stats.overdue_followups} patients have overdue follow-up appointments</p>
                  <Button variant="outline" size="sm" className="mt-2 text-red-700 border-red-300">
                    Review Now
                  </Button>
                </CardContent>
              </Card>
            )}

            {stats.missed_appointments > 0 && (
              <Card className="border-l-4 border-l-yellow-500 bg-yellow-50">
                <CardHeader>
                  <CardTitle className="text-yellow-700 flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Missed Appointments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-yellow-600">{stats.missed_appointments} appointments were missed today</p>
                  <Button variant="outline" size="sm" className="mt-2 text-yellow-700 border-yellow-300">
                    Send Follow-up
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
                  <div className="space-y-4">
                    {[
                      { time: "09:00 AM", patient: "John Doe", type: "Follow-up", status: "completed" },
                      { time: "10:30 AM", patient: "Jane Smith", type: "Consultation", status: "in-progress" },
                      { time: "02:00 PM", patient: "Mike Johnson", type: "Check-up", status: "scheduled" },
                      { time: "03:30 PM", patient: "Sarah Wilson", type: "Follow-up", status: "scheduled" },
                    ].map((appointment, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="text-sm font-medium text-gray-600">{appointment.time}</div>
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {appointment.patient
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{appointment.patient}</p>
                            <p className="text-sm text-gray-600">{appointment.type}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant={
                              appointment.status === "completed"
                                ? "default"
                                : appointment.status === "in-progress"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {appointment.status}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
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
                  <div className="space-y-4">
                    {[
                      { patient: "John Doe", type: "SMS", scheduled: "Today 2:00 PM", status: "pending" },
                      { patient: "Jane Smith", type: "Email", scheduled: "Tomorrow 9:00 AM", status: "scheduled" },
                      { patient: "Mike Johnson", type: "WhatsApp", scheduled: "Today 4:00 PM", status: "sent" },
                    ].map((reminder, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            {reminder.type === "SMS" && <MessageSquare className="h-4 w-4 text-blue-600" />}
                            {reminder.type === "Email" && <Mail className="h-4 w-4 text-green-600" />}
                            {reminder.type === "WhatsApp" && <MessageSquare className="h-4 w-4 text-green-600" />}
                            <Badge variant="outline">{reminder.type}</Badge>
                          </div>
                          <div>
                            <p className="font-medium">{reminder.patient}</p>
                            <p className="text-sm text-gray-600">Scheduled: {reminder.scheduled}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant={
                              reminder.status === "sent"
                                ? "default"
                                : reminder.status === "scheduled"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {reminder.status}
                          </Badge>
                          <Button variant="outline" size="sm">
                            {reminder.status === "pending" ? "Send Now" : "View"}
                          </Button>
                        </div>
                      </div>
                    ))}
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
                    <div className="text-3xl font-bold text-green-600">{stats.response_rate}%</div>
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
        </motion.div>
      </div>
    </div>
  )
}
