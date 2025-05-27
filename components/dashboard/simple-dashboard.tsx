"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { Users, Calendar, Bell, TrendingUp, Plus, Heart } from "lucide-react"
import { motion } from "framer-motion"

export function SimpleDashboard() {
  const { profile } = useAuth()

  const statCards = [
    {
      title: "Total Patients",
      value: "247",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      change: "+12%",
      changeType: "positive" as const,
    },
    {
      title: "Today's Appointments",
      value: "12",
      icon: Calendar,
      color: "text-green-600",
      bgColor: "bg-green-100",
      change: "+5%",
      changeType: "positive" as const,
    },
    {
      title: "Pending Reminders",
      value: "8",
      icon: Bell,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      change: "-8%",
      changeType: "negative" as const,
    },
    {
      title: "Completion Rate",
      value: "94%",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      change: "+3%",
      changeType: "positive" as const,
    },
  ]

  return (
    <div className="space-y-6">
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

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              Quick Actions
            </CardTitle>
            <CardDescription>Common tasks for your practice</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Users className="h-4 w-4 mr-2" />
              Add New Patient
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Appointment
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Bell className="h-4 w-4 mr-2" />
              Send Reminder
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-600" />
              Getting Started
            </CardTitle>
            <CardDescription>Set up your HealPing practice</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Complete your profile</span>
              <Badge variant="outline">Pending</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Add your first patient</span>
              <Badge variant="outline">Pending</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Configure notifications</span>
              <Badge variant="outline">Pending</Badge>
            </div>
            <Button className="w-full mt-4">Complete Setup</Button>
          </CardContent>
        </Card>
      </div>

      {/* Demo Notice */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-900">🎯 Demo Data</CardTitle>
          <CardDescription className="text-blue-800">
            You're viewing demo data. In the full version, this would show your actual practice statistics and patient
            information.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}
