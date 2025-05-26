"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/lib/auth-context"
import { Users, Calendar, Bell, TrendingUp, Clock, AlertCircle, Plus } from "lucide-react"
import { motion } from "framer-motion"

interface DashboardStats {
  totalPatients: number
  todayAppointments: number
  pendingReminders: number
  completionRate: number
  upcomingFollowUps: number
  overdueFollowUps: number
}

export function DashboardOverview() {
  const { profile } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    totalPatients: 0,
    todayAppointments: 0,
    pendingReminders: 0,
    completionRate: 0,
    upcomingFollowUps: 0,
    overdueFollowUps: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (profile?.clinic_id) {
      fetchDashboardStats()
    }
  }, [profile])

  const fetchDashboardStats = async () => {
    try {
      const today = new Date().toISOString().split("T")[0]

      // Fetch total patients
      const { count: totalPatients } = await supabase
        .from("patients")
        .select("*", { count: "exact", head: true })
        .eq("clinic_id", profile?.clinic_id!)

      // Fetch today's appointments
      const { count: todayAppointments } = await supabase
        .from("appointments")
        .select("*", { count: "exact", head: true })
        .eq("clinic_id", profile?.clinic_id!)
        .gte("appointment_date", today)
        .lt("appointment_date", `${today}T23:59:59`)

      // Fetch pending reminders
      const { count: pendingReminders } = await supabase
        .from("reminders")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending")

      // Fetch upcoming follow-ups (next 7 days)
      const nextWeek = new Date()
      nextWeek.setDate(nextWeek.getDate() + 7)

      const { count: upcomingFollowUps } = await supabase
        .from("appointments")
        .select("*", { count: "exact", head: true })
        .eq("clinic_id", profile?.clinic_id!)
        .not("follow_up_date", "is", null)
        .gte("follow_up_date", new Date().toISOString())
        .lte("follow_up_date", nextWeek.toISOString())

      // Fetch overdue follow-ups
      const { count: overdueFollowUps } = await supabase
        .from("appointments")
        .select("*", { count: "exact", head: true })
        .eq("clinic_id", profile?.clinic_id!)
        .not("follow_up_date", "is", null)
        .lt("follow_up_date", new Date().toISOString())

      setStats({
        totalPatients: totalPatients || 0,
        todayAppointments: todayAppointments || 0,
        pendingReminders: pendingReminders || 0,
        completionRate: 85, // This would be calculated based on actual data
        upcomingFollowUps: upcomingFollowUps || 0,
        overdueFollowUps: overdueFollowUps || 0,
      })
    } catch (error) {
      console.error("Error fetching dashboard stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: "Total Patients",
      value: stats.totalPatients,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      change: "+12%",
      changeType: "positive" as const,
    },
    {
      title: "Today's Appointments",
      value: stats.todayAppointments,
      icon: Calendar,
      color: "text-green-600",
      bgColor: "bg-green-100",
      change: "+5%",
      changeType: "positive" as const,
    },
    {
      title: "Pending Reminders",
      value: stats.pendingReminders,
      icon: Bell,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      change: "-8%",
      changeType: "negative" as const,
    },
    {
      title: "Completion Rate",
      value: `${stats.completionRate}%`,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      change: "+3%",
      changeType: "positive" as const,
    },
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-4 w-4 bg-gray-200 rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-20"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white"
      >
        <h1 className="text-2xl font-bold mb-2">Welcome back, Dr. {profile?.full_name?.split(" ")[0]}!</h1>
        <p className="text-blue-100 mb-4">Here's what's happening with your practice today.</p>
        <div className="flex gap-3">
          <Button variant="secondary" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Patient
          </Button>
          <Button variant="outline" size="sm" className="text-white border-white hover:bg-white/10">
            Schedule Appointment
          </Button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="flex items-center text-xs">
                  <Badge variant={stat.changeType === "positive" ? "default" : "destructive"} className="text-xs">
                    {stat.change}
                  </Badge>
                  <span className="text-gray-500 ml-2">from last month</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              Upcoming Follow-ups
            </CardTitle>
            <CardDescription>Patients requiring follow-up care in the next 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-green-600">{stats.upcomingFollowUps}</div>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              Overdue Follow-ups
            </CardTitle>
            <CardDescription>Patients with missed follow-up appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-red-600">{stats.overdueFollowUps}</div>
              <Button variant="outline" size="sm">
                Take Action
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
