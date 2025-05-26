"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/auth-context"
import { getReminders } from "@/lib/supabase-functions"
import { Bell, MessageSquare, Mail, Phone, Send, Clock, CheckCircle, XCircle } from "lucide-react"
import { motion } from "framer-motion"

interface Reminder {
  id: string
  reminder_type: "sms" | "whatsapp" | "email" | "call"
  scheduled_for: string
  sent_at: string | null
  status: "pending" | "sent" | "delivered" | "failed"
  message_content: string | null
  appointments: {
    appointment_date: string
    treatment_type: string
    patients: {
      full_name: string
      phone: string
    }
  }
}

export function NotificationCenter() {
  const { profile } = useAuth()
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [loading, setLoading] = useState(true)
  const [notificationSettings, setNotificationSettings] = useState({
    sms: true,
    email: true,
    whatsapp: false,
    autoReminders: true,
    reminderTiming: "24h",
  })

  useEffect(() => {
    if (profile?.clinic_id) {
      fetchReminders()
    }
  }, [profile])

  const fetchReminders = async () => {
    try {
      const remindersData = await getReminders(profile?.clinic_id!)
      setReminders(remindersData)
    } catch (error) {
      console.error("Error fetching reminders:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "sent":
        return <Send className="h-4 w-4 text-blue-600" />
      default:
        return <Clock className="h-4 w-4 text-orange-600" />
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "sms":
        return <MessageSquare className="h-4 w-4" />
      case "email":
        return <Mail className="h-4 w-4" />
      case "whatsapp":
        return <MessageSquare className="h-4 w-4" />
      case "call":
        return <Phone className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const pendingReminders = reminders.filter((r) => r.status === "pending")
  const sentReminders = reminders.filter((r) => r.status !== "pending")

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Notification Center</CardTitle>
          <CardDescription>Loading notifications...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Notification Center</h2>
          <p className="text-gray-600">Manage patient reminders and notifications</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Send className="h-4 w-4 mr-2" />
          Send Bulk Reminder
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{pendingReminders.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Delivered</p>
                <p className="text-2xl font-bold text-gray-900">
                  {reminders.filter((r) => r.status === "delivered").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Failed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {reminders.filter((r) => r.status === "failed").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{reminders.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">Pending ({pendingReminders.length})</TabsTrigger>
          <TabsTrigger value="sent">Sent ({sentReminders.length})</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Reminders</CardTitle>
              <CardDescription>Reminders scheduled to be sent</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingReminders.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No pending reminders</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingReminders.map((reminder, index) => (
                    <motion.div
                      key={reminder.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(reminder.reminder_type)}
                          <Badge variant="outline" className="capitalize">
                            {reminder.reminder_type}
                          </Badge>
                        </div>
                        <div>
                          <p className="font-medium">{reminder.appointments.patients.full_name}</p>
                          <p className="text-sm text-gray-600">{reminder.appointments.treatment_type}</p>
                          <p className="text-xs text-gray-500">
                            Scheduled for: {new Date(reminder.scheduled_for).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(reminder.status)}
                        <Button variant="outline" size="sm">
                          Send Now
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sent Reminders</CardTitle>
              <CardDescription>History of sent notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sentReminders.map((reminder, index) => (
                  <motion.div
                    key={reminder.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(reminder.reminder_type)}
                        <Badge variant="outline" className="capitalize">
                          {reminder.reminder_type}
                        </Badge>
                      </div>
                      <div>
                        <p className="font-medium">{reminder.appointments.patients.full_name}</p>
                        <p className="text-sm text-gray-600">{reminder.message_content}</p>
                        <p className="text-xs text-gray-500">
                          Sent: {reminder.sent_at ? new Date(reminder.sent_at).toLocaleString() : "Not sent"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(reminder.status)}
                      <Badge
                        variant={
                          reminder.status === "delivered"
                            ? "default"
                            : reminder.status === "failed"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {reminder.status}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure your notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Notification Channels</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sms">SMS Notifications</Label>
                    <Switch
                      id="sms"
                      checked={notificationSettings.sms}
                      onCheckedChange={(checked) => setNotificationSettings((prev) => ({ ...prev, sms: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email">Email Notifications</Label>
                    <Switch
                      id="email"
                      checked={notificationSettings.email}
                      onCheckedChange={(checked) => setNotificationSettings((prev) => ({ ...prev, email: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="whatsapp">WhatsApp Notifications</Label>
                    <Switch
                      id="whatsapp"
                      checked={notificationSettings.whatsapp}
                      onCheckedChange={(checked) => setNotificationSettings((prev) => ({ ...prev, whatsapp: checked }))}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Automation</h4>
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto">Automatic Reminders</Label>
                  <Switch
                    id="auto"
                    checked={notificationSettings.autoReminders}
                    onCheckedChange={(checked) =>
                      setNotificationSettings((prev) => ({ ...prev, autoReminders: checked }))
                    }
                  />
                </div>
              </div>

              <Button className="w-full">Save Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
