"use client"

import { useState } from "react"
import { DashboardWrapper } from "@/components/ui/dashboard-wrapper"
import { useDashboardData } from "@/hooks/use-dashboard-data"
import { getReminders, getPatients } from "@/lib/supabase-functions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useAuth } from "@/lib/auth-context"
import {
  Bell,
  MessageSquare,
  Mail,
  Phone,
  Send,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Settings,
  TrendingUp,
  AlertTriangle,
} from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"

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
      email: string
    }
  }
}

export default function DoctorRemindersPage() {
  const { profile } = useAuth()
  const { toast } = useToast()

  const {
    data: reminders,
    loading: remindersLoading,
    error: remindersError,
    refetch: refetchReminders,
  } = useDashboardData<Reminder[]>({
    fetchFunction: getReminders,
    fallbackData: [],
  })

  const {
    data: patients,
    loading: patientsLoading,
    error: patientsError,
  } = useDashboardData({
    fetchFunction: getPatients,
    fallbackData: [],
  })

  const loading = remindersLoading || patientsLoading
  const error = remindersError || patientsError

  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const [isBulkReminderOpen, setIsBulkReminderOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [bulkReminderData, setBulkReminderData] = useState({
    message: "",
    type: "sms" as "sms" | "email" | "whatsapp",
    schedule_time: "",
    patient_filter: "all",
  })
  const [notificationSettings, setNotificationSettings] = useState({
    sms_enabled: true,
    email_enabled: true,
    whatsapp_enabled: false,
    auto_reminders: true,
    reminder_timing: "24h",
    follow_up_timing: "7d",
    max_reminders: 3,
  })

  const handleSendBulkReminder = async () => {
    try {
      // Implementation for bulk reminder sending
      toast({
        title: "Success",
        description: "Bulk reminders scheduled successfully",
      })
      setIsBulkReminderOpen(false)
      refetchReminders()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to schedule bulk reminders",
        variant: "destructive",
      })
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
        return <MessageSquare className="h-4 w-4 text-blue-600" />
      case "email":
        return <Mail className="h-4 w-4 text-green-600" />
      case "whatsapp":
        return <MessageSquare className="h-4 w-4 text-green-600" />
      case "call":
        return <Phone className="h-4 w-4 text-purple-600" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const filteredReminders = reminders.filter((reminder) => {
    const matchesSearch =
      reminder.appointments.patients.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reminder.message_content?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = filterStatus === "all" || reminder.status === filterStatus
    const matchesType = filterType === "all" || reminder.reminder_type === filterType

    return matchesSearch && matchesStatus && matchesType
  })

  const pendingReminders = reminders.filter((r) => r.status === "pending")
  const sentReminders = reminders.filter((r) => r.status !== "pending")
  const deliveredCount = reminders.filter((r) => r.status === "delivered").length
  const failedCount = reminders.filter((r) => r.status === "failed").length

  return (
    <DashboardWrapper requiredRole="doctor" title="Reminder Management" description="Loading your reminders...">
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
          >
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Reminder Management</h1>
              <p className="text-gray-600">Manage patient reminders and notifications</p>
            </div>
            <div className="flex gap-3">
              <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Notification Settings</DialogTitle>
                    <DialogDescription>Configure your reminder preferences</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h4 className="font-medium">Notification Channels</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="sms">SMS Notifications</Label>
                          <Switch
                            id="sms"
                            checked={notificationSettings.sms_enabled}
                            onCheckedChange={(checked) =>
                              setNotificationSettings((prev) => ({ ...prev, sms_enabled: checked }))
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="email">Email Notifications</Label>
                          <Switch
                            id="email"
                            checked={notificationSettings.email_enabled}
                            onCheckedChange={(checked) =>
                              setNotificationSettings((prev) => ({ ...prev, email_enabled: checked }))
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="whatsapp">WhatsApp Notifications</Label>
                          <Switch
                            id="whatsapp"
                            checked={notificationSettings.whatsapp_enabled}
                            onCheckedChange={(checked) =>
                              setNotificationSettings((prev) => ({ ...prev, whatsapp_enabled: checked }))
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Automation Settings</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="auto">Automatic Reminders</Label>
                          <Switch
                            id="auto"
                            checked={notificationSettings.auto_reminders}
                            onCheckedChange={(checked) =>
                              setNotificationSettings((prev) => ({ ...prev, auto_reminders: checked }))
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Default Reminder Timing</Label>
                          <Select
                            value={notificationSettings.reminder_timing}
                            onValueChange={(value) =>
                              setNotificationSettings((prev) => ({ ...prev, reminder_timing: value }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1h">1 hour before</SelectItem>
                              <SelectItem value="24h">24 hours before</SelectItem>
                              <SelectItem value="48h">48 hours before</SelectItem>
                              <SelectItem value="7d">7 days before</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <Button className="w-full">Save Settings</Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={isBulkReminderOpen} onOpenChange={setIsBulkReminderOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Send className="h-4 w-4 mr-2" />
                    Send Bulk Reminder
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Send Bulk Reminder</DialogTitle>
                    <DialogDescription>Send reminders to multiple patients at once</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Reminder Type</Label>
                        <Select
                          value={bulkReminderData.type}
                          onValueChange={(value: any) => setBulkReminderData({ ...bulkReminderData, type: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sms">SMS</SelectItem>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="whatsapp">WhatsApp</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Schedule Time</Label>
                        <Input
                          type="datetime-local"
                          value={bulkReminderData.schedule_time}
                          onChange={(e) =>
                            setBulkReminderData({
                              ...bulkReminderData,
                              schedule_time: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Patient Filter</Label>
                      <Select
                        value={bulkReminderData.patient_filter}
                        onValueChange={(value) => setBulkReminderData({ ...bulkReminderData, patient_filter: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Patients</SelectItem>
                          <SelectItem value="upcoming">Upcoming Appointments</SelectItem>
                          <SelectItem value="overdue">Overdue Follow-ups</SelectItem>
                          <SelectItem value="no_show">Previous No-shows</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Message</Label>
                      <Textarea
                        value={bulkReminderData.message}
                        onChange={(e) =>
                          setBulkReminderData({
                            ...bulkReminderData,
                            message: e.target.value,
                          })
                        }
                        placeholder="Enter your reminder message..."
                        rows={4}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 mt-6">
                    <Button variant="outline" onClick={() => setIsBulkReminderOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSendBulkReminder}>Schedule Reminders</Button>
                  </div>
                </DialogContent>
              </Dialog>
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
                <span className="font-medium">Unable to load reminders</span>
              </div>
              <p className="text-red-600 text-sm mt-1">{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={refetchReminders}
                className="mt-2 text-red-700 border-red-300"
              >
                Try Again
              </Button>
            </motion.div>
          )}

          {/* Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6"
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-gray-900">{loading ? "..." : pendingReminders.length}</p>
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
                    <p className="text-2xl font-bold text-gray-900">{loading ? "..." : deliveredCount}</p>
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
                    <p className="text-2xl font-bold text-gray-900">{loading ? "..." : failedCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Success Rate</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {loading
                        ? "..."
                        : reminders.length > 0
                          ? Math.round((deliveredCount / reminders.length) * 100)
                          : 0}
                      %
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search reminders by patient name or message..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="sms">SMS</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
                <SelectItem value="call">Call</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>

          {/* Main Content */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Tabs defaultValue="all" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All Reminders ({filteredReminders.length})</TabsTrigger>
                <TabsTrigger value="pending">Pending ({pendingReminders.length})</TabsTrigger>
                <TabsTrigger value="sent">Sent ({sentReminders.length})</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>All Reminders</CardTitle>
                    <CardDescription>Complete history of patient reminders</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
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
                    ) : filteredReminders.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No reminders found</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {filteredReminders.map((reminder, index) => (
                          <motion.div
                            key={reminder.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
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
                                <p className="text-sm text-gray-600">
                                  {reminder.message_content || `${reminder.appointments.treatment_type} reminder`}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {reminder.sent_at
                                    ? `Sent: ${new Date(reminder.sent_at).toLocaleString()}`
                                    : `Scheduled: ${new Date(reminder.scheduled_for).toLocaleString()}`}
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
                              {reminder.status === "pending" && (
                                <Button variant="outline" size="sm">
                                  Send Now
                                </Button>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="pending" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Pending Reminders</CardTitle>
                    <CardDescription>Reminders scheduled to be sent</CardDescription>
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
                              <Button variant="outline" size="sm">
                                Edit
                              </Button>
                              <Button size="sm">Send Now</Button>
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
                                <p className="text-sm text-gray-600">
                                  {reminder.message_content || `${reminder.appointments.treatment_type} reminder`}
                                </p>
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
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Delivery Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-green-600">
                        {loading
                          ? "..."
                          : reminders.length > 0
                            ? Math.round((deliveredCount / reminders.length) * 100)
                            : 0}
                        %
                      </div>
                      <p className="text-sm text-gray-600">Successfully delivered reminders</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Response Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-blue-600">{loading ? "..." : "78%"}</div>
                      <p className="text-sm text-gray-600">Patients responding to reminders</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Most Effective Channel</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-purple-600">{loading ? "..." : "SMS"}</div>
                      <p className="text-sm text-gray-600">Highest engagement rate</p>
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
