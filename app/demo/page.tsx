"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Calendar, Bell, TrendingUp, AlertCircle, Plus, Activity, Heart, ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

// Demo data
const demoStats = {
  totalPatients: 247,
  todayAppointments: 12,
  pendingReminders: 8,
  completionRate: 94,
  upcomingFollowUps: 15,
  overdueFollowUps: 3,
}

const demoPatients = [
  { name: "John Anderson", phone: "+1-555-0101", lastVisit: "2024-01-20", status: "Active" },
  { name: "Maria Rodriguez", phone: "+1-555-0102", lastVisit: "2024-01-18", status: "Follow-up Due" },
  { name: "Robert Chen", phone: "+1-555-0103", lastVisit: "2024-01-15", status: "Active" },
  { name: "Sarah Johnson", phone: "+1-555-0104", lastVisit: "2024-01-22", status: "Active" },
]

const demoAppointments = [
  { time: "09:00 AM", patient: "John Anderson", type: "Regular Checkup", status: "Scheduled" },
  { time: "10:30 AM", patient: "Maria Rodriguez", type: "Follow-up", status: "Confirmed" },
  { time: "02:00 PM", patient: "Robert Chen", type: "Consultation", status: "Scheduled" },
  { time: "03:30 PM", patient: "Sarah Johnson", type: "Treatment", status: "Confirmed" },
]

export default function DemoPage() {
  const [realTimeUpdates] = useState(5)

  const statCards = [
    {
      title: "Total Patients",
      value: demoStats.totalPatients,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      change: "+12%",
      changeType: "positive" as const,
    },
    {
      title: "Today's Appointments",
      value: demoStats.todayAppointments,
      icon: Calendar,
      color: "text-green-600",
      bgColor: "bg-green-100",
      change: "+5%",
      changeType: "positive" as const,
    },
    {
      title: "Pending Reminders",
      value: demoStats.pendingReminders,
      icon: Bell,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      change: "-8%",
      changeType: "negative" as const,
    },
    {
      title: "Completion Rate",
      value: `${demoStats.completionRate}%`,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      change: "+3%",
      changeType: "positive" as const,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <Heart className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">HealPing</span>
                <Badge variant="secondary" className="ml-2">
                  Demo Mode
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Welcome, Dr. Sarah Smith</span>
              <Link href="/">
                <Button variant="outline" size="sm">
                  Exit Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Real-time indicator */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2"
          >
            <Activity className="h-4 w-4 text-green-600 animate-pulse" />
            <span className="text-sm text-green-700">Demo mode active • {realTimeUpdates} simulated updates</span>
          </motion.div>

          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white"
          >
            <h1 className="text-2xl font-bold mb-2">Welcome back, Dr. Smith!</h1>
            <p className="text-blue-100 mb-4">Here's what's happening at HealPing Medical Center today.</p>
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

          {/* Dashboard Content */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Today's Appointments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  Today's Appointments
                </CardTitle>
                <CardDescription>Scheduled appointments for today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {demoAppointments.map((apt, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{apt.patient}</p>
                        <p className="text-sm text-gray-600">{apt.type}</p>
                        <p className="text-xs text-gray-500">{apt.time}</p>
                      </div>
                      <Badge variant={apt.status === "Confirmed" ? "default" : "secondary"}>{apt.status}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Patients */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-600" />
                  Recent Patients
                </CardTitle>
                <CardDescription>Recently registered patients</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {demoPatients.map((patient, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{patient.name}</p>
                        <p className="text-sm text-gray-600">{patient.phone}</p>
                        <p className="text-xs text-gray-500">Last visit: {patient.lastVisit}</p>
                      </div>
                      <Badge variant={patient.status === "Follow-up Due" ? "destructive" : "default"}>
                        {patient.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Alerts */}
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
                  <div className="text-3xl font-bold text-orange-600">{demoStats.overdueFollowUps}</div>
                  <Button variant="outline" size="sm" className="border-orange-200 text-orange-700">
                    Review Now
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Growth */}
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

          {/* Demo Info */}
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-900">🎯 Demo Features Available</CardTitle>
              <CardDescription className="text-blue-800">
                This is a fully functional demo of HealPing. All data shown is simulated for demonstration purposes. In
                the full version, you would have access to real patient data, appointment scheduling, and notification
                systems.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span>Patient Management</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span>Appointment Scheduling</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-blue-600" />
                  <span>Smart Reminders</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  <span>Analytics Dashboard</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-blue-200">
                <Link href="/">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Create Your Account
                    <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
