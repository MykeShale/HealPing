"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { useAuth } from "@/lib/auth-context"
import { Bell, Clock, Pill, Calendar, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"
import { getPatientReminders, getPatientProfile } from "@/lib/supabase-functions"
import { useDashboardData } from "@/hooks/use-dashboard-data"
import { DashboardWrapper } from "@/components/ui/dashboard-wrapper"

export default function PatientRemindersPage() {
  const { user } = useAuth()
  const [patientProfile, setPatientProfile] = useState<any>(null)

  // Fetch patient profile
  useEffect(() => {
    if (user?.id) {
      getPatientProfile(user.id).then(setPatientProfile)
    }
  }, [user?.id])

  // Fetch reminders
  const { data: reminders, loading } = useDashboardData({
    fetchFunction: () => getPatientReminders(patientProfile?.id || ""),
    fallbackData: [],
    dependencies: [patientProfile?.id],
  })

  return (
    <DashboardWrapper requiredRole="patient">
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reminders</h1>
            <p className="text-gray-600">Manage your medication and appointment reminders</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Bell className="h-4 w-4 mr-2" />
            Add Reminder
          </Button>
        </motion.div>

        {/* Reminder Settings */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure how you want to receive reminders</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Email Notifications</h4>
                  <p className="text-sm text-gray-600">Receive reminders via email</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">SMS Notifications</h4>
                  <p className="text-sm text-gray-600">Receive reminders via text message</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Push Notifications</h4>
                  <p className="text-sm text-gray-600">Receive reminders in the app</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Active Reminders */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-blue-600" />
                Active Reminders ({reminders.length})
              </CardTitle>
              <CardDescription>Your current medication and appointment reminders</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="border rounded-lg p-4 animate-pulse">
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-48"></div>
                        <div className="h-3 bg-gray-200 rounded w-32"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : reminders.length === 0 ? (
                <div className="text-center py-12">
                  <Bell className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No active reminders</h3>
                  <p className="text-gray-600 mb-4">Set up reminders to stay on top of your health</p>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Bell className="h-4 w-4 mr-2" />
                    Add Reminder
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {reminders.map((reminder: any, index: number) => (
                    <motion.div
                      key={reminder.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            {reminder.reminder_type === "medication" ? (
                              <Pill className="h-5 w-5 text-blue-600" />
                            ) : (
                              <Calendar className="h-5 w-5 text-blue-600" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">
                              {reminder.appointments?.treatment_type || "Appointment Reminder"}
                            </h3>
                            <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {new Date(reminder.scheduled_for).toLocaleString()}
                              </span>
                              <span className="capitalize">{reminder.reminder_type}</span>
                            </div>
                            {reminder.message && <p className="text-sm text-gray-600 mt-2">{reminder.message}</p>}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge variant={reminder.status === "pending" ? "default" : "secondary"}>
                            {reminder.status}
                          </Badge>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardWrapper>
  )
}
