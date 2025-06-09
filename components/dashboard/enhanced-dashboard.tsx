"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { getDashboardStats, subscribeToAppointments, subscribeToReminders } from "@/lib/supabase-functions"
import { Users, Calendar, Bell, TrendingUp, Clock, AlertCircle, Plus, Activity } from "lucide-react"
import { motion } from "framer-motion"

interface DashboardStats {
  total_patients: number
  today_appointments: number
  pending_reminders: number
  upcoming_followups: number
  overdue_followups: number
}

export function EnhancedDashboard() {
  const { profile, initialized } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    total_patients: 0,
    today_appointments: 0,
    pending_reminders: 0,
    upcoming_followups: 0,
    overdue_followups: 0,
  })
  const [loading, setLoading] = useState(true)
  const [realTimeUpdates, setRealTimeUpdates] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const mountedRef = useRef(true)
  const fetchingRef = useRef(false)

  const fetchStats = useCallback(async () => {
    if (!profile?.clinic_id || fetchingRef.current || !mountedRef.current) {
      setLoading(false)
      return
    }

    try {
      fetchingRef.current = true
      setError(null)

      const data = await getDashboardStats(profile.clinic_id)

      if (mountedRef.current) {
        setStats(data)
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error)
      if (mountedRef.current) {
        setError("Failed to load dashboard data")
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false)
      }
      fetchingRef.current = false
    }
  }, [profile?.clinic_id])

  const setupRealTimeSubscriptions = useCallback(() => {
    if (!profile?.clinic_id) return () => {}

    // Subscribe to appointment changes
    const appointmentSub = subscribeToAppointments(profile.clinic_id, () => {
      if (mountedRef.current) {
        setRealTimeUpdates((prev) => prev + 1)
        fetchStats() // Refresh stats when appointments change
      }
    })

    // Subscribe to reminder changes
    const reminderSub = subscribeToReminders(() => {
      if (mountedRef.current) {
        setRealTimeUpdates((prev) => prev + 1)
        fetchStats() // Refresh stats when reminders change
      }
    })

    return () => {
      appointmentSub.unsubscribe()
      reminderSub.unsubscribe()
    }
  }, [profile?.clinic_id, fetchStats])

  useEffect(() => {
    mountedRef.current = true

    if (initialized) {
      if (profile?.clinic_id) {
        fetchStats()
        const cleanup = setupRealTimeSubscriptions()
        return cleanup
      } else {
        // No clinic_id, stop loading
        setLoading(false)
        if (profile && !profile.clinic_id) {
          setError("No clinic associated with your account. Please contact support.")
        }
      }
    }

    return () => {
      mountedRef.current = false
    }
  }, [initialized, profile, fetchStats, setupRealTimeSubscriptions])

  const statCards = [
    {
      title: "Total Patients",
      value: stats.total_patients,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      change: "+12%",
      changeType: "positive" as const,
    },
    {
      title: "Today's Appointments",
      value: stats.today_appointments,
      icon: Calendar,
      color: "text-green-600",
      bgColor: "bg-green-100",
      change: "+5%",
      changeType: "positive" as const,
    },
    {
      title: "Pending Reminders",
      value: stats.pending_reminders,
      icon: Bell,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      change: "-8%",
      changeType: "negative" as const,
    },
    {
      title: "Upcoming Follow-ups",
      value: stats.upcoming_followups,
      icon: Clock,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      change: "+3%",
      changeType: "positive" as const,
    },
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
          <div className="animate-pulse">
            <div className="h-6 bg-blue-500 rounded w-64 mb-2"></div>
            <div className="h-4 bg-blue-500 rounded w-96 mb-4"></div>
            <div className="flex gap-3">
              <div className="h-8 bg-blue-500 rounded w-24"></div>
              <div className="h-8 bg-blue-500 rounded w-32"></div>
            </div>
          </div>
        </div>

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

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 mb-4">
            <AlertCircle className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load dashboard</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={fetchStats} className="bg-blue-600 hover:bg-blue-700">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Real-time indicator */}
      {realTimeUpdates > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2"
        >
          <Activity className="h-4 w-4 text-green-600 animate-pulse" />
          <span className="text-sm text-green-700">Live updates active • {realTimeUpdates} changes detected</span>
        </motion.div>
      )}

      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white"
      >
        <h1 className="text-2xl font-bold mb-2">Welcome back, {profile?.full_name?.split(" ")[0] || "Doctor"}!</h1>
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

      {/* Alert Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-700">
              <AlertCircle className="h-5 w-5" />
              Overdue Follow-ups
            </CardTitle>
            <CardDescription>Patients with missed follow-up appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-orange-600">{stats.overdue_followups}</div>
              <Button variant="outline" size="sm" className="border-orange-200 text-orange-700">
                Review Now
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <TrendingUp className="h-5 w-5" />
              Practice Growth
            </CardTitle>
            <CardDescription>Your practice is growing steadily</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-green-600">+15%</div>
              <Button variant="outline" size="sm" className="border-green-200 text-green-700">
                View Analytics
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
