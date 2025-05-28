"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/lib/auth-context"
import { Calendar, Clock, MapPin, MessageSquare, Plus, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"
import {
  getPatientAppointments,
  getPatientProfile,
  rescheduleAppointment,
  cancelAppointment,
} from "@/lib/supabase-functions"
import { useDashboardData } from "@/hooks/use-dashboard-data"
import { DashboardWrapper } from "@/components/ui/dashboard-wrapper"
import { toast } from "sonner"

interface Appointment {
  id: string
  appointment_date: string
  treatment_type: string
  status: string
  notes?: string
  duration_minutes: number
  profiles?: {
    first_name: string
    last_name: string
  }
  clinic_name?: string
  clinic_address?: string
}

export default function PatientAppointmentsPage() {
  const { user } = useAuth()
  const [patientProfile, setPatientProfile] = useState<any>(null)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [rescheduleDate, setRescheduleDate] = useState("")
  const [cancelReason, setCancelReason] = useState("")
  const [actionLoading, setActionLoading] = useState(false)

  // Fetch patient profile
  useEffect(() => {
    if (user?.id) {
      getPatientProfile(user.id).then(setPatientProfile)
    }
  }, [user?.id])

  // Fetch appointments
  const {
    data: appointments,
    loading,
    refetch,
  } = useDashboardData({
    fetchFunction: () => getPatientAppointments(patientProfile?.id || ""),
    fallbackData: [],
    dependencies: [patientProfile?.id],
  })

  const upcomingAppointments = appointments.filter(
    (apt: Appointment) => new Date(apt.appointment_date) > new Date() && apt.status !== "cancelled",
  )

  const pastAppointments = appointments.filter(
    (apt: Appointment) => new Date(apt.appointment_date) <= new Date() || apt.status === "completed",
  )

  const handleReschedule = async () => {
    if (!selectedAppointment || !rescheduleDate) return

    setActionLoading(true)
    try {
      await rescheduleAppointment(selectedAppointment.id, rescheduleDate)
      toast.success("Appointment rescheduled successfully!")
      setShowRescheduleDialog(false)
      setRescheduleDate("")
      setSelectedAppointment(null)
      refetch()
    } catch (error) {
      toast.error("Failed to reschedule appointment")
      console.error("Reschedule error:", error)
    } finally {
      setActionLoading(false)
    }
  }

  const handleCancel = async () => {
    if (!selectedAppointment) return

    setActionLoading(true)
    try {
      await cancelAppointment(selectedAppointment.id, cancelReason)
      toast.success("Appointment cancelled successfully!")
      setShowCancelDialog(false)
      setCancelReason("")
      setSelectedAppointment(null)
      refetch()
    } catch (error) {
      toast.error("Failed to cancel appointment")
      console.error("Cancel error:", error)
    } finally {
      setActionLoading(false)
    }
  }

  const formatAppointmentDate = (dateString: string) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      full: date.toLocaleString(),
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "default"
      case "completed":
        return "secondary"
      case "cancelled":
        return "destructive"
      case "rescheduled":
        return "outline"
      default:
        return "secondary"
    }
  }

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
            <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
            <p className="text-gray-600">Manage your healthcare appointments</p>
          </div>
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Book Appointment
          </Button>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                    <div className="h-6 bg-gray-200 rounded w-48"></div>
                    <div className="h-4 bg-gray-200 rounded w-64"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Upcoming Appointments */}
        {!loading && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  Upcoming Appointments ({upcomingAppointments.length})
                </CardTitle>
                <CardDescription>Your scheduled healthcare visits</CardDescription>
              </CardHeader>
              <CardContent>
                {upcomingAppointments.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming appointments</h3>
                    <p className="text-gray-600 mb-4">Schedule your next healthcare visit</p>
                    <Button className="bg-green-600 hover:bg-green-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Book Appointment
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcomingAppointments.map((appointment: Appointment, index: number) => {
                      const dateInfo = formatAppointmentDate(appointment.appointment_date)
                      const doctorName = appointment.profiles
                        ? `Dr. ${appointment.profiles.first_name} ${appointment.profiles.last_name}`
                        : "Doctor"

                      return (
                        <motion.div
                          key={appointment.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-4">
                              <Avatar className="h-12 w-12">
                                <AvatarFallback className="bg-blue-100 text-blue-700">
                                  {doctorName.split(" ")[1]?.charAt(0) || "D"}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <h3 className="font-semibold text-gray-900">{doctorName}</h3>
                                <p className="text-gray-600">{appointment.treatment_type}</p>
                                <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    {dateInfo.full}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    {appointment.clinic_name || "Healthcare Clinic"}
                                  </span>
                                </div>
                                {appointment.clinic_address && (
                                  <p className="text-xs text-gray-400 mt-1">{appointment.clinic_address}</p>
                                )}
                                {appointment.notes && (
                                  <p className="text-sm text-gray-600 mt-2 italic">{appointment.notes}</p>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <Badge variant={getStatusColor(appointment.status)}>{appointment.status}</Badge>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedAppointment(appointment)
                                    setShowRescheduleDialog(true)
                                  }}
                                >
                                  Reschedule
                                </Button>
                                <Button variant="outline" size="sm">
                                  <MessageSquare className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedAppointment(appointment)
                                    setShowCancelDialog(true)
                                  }}
                                >
                                  <AlertCircle className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Past Appointments */}
        {!loading && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-gray-600" />
                  Past Appointments ({pastAppointments.length})
                </CardTitle>
                <CardDescription>Your appointment history</CardDescription>
              </CardHeader>
              <CardContent>
                {pastAppointments.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No past appointments</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pastAppointments.map((appointment: Appointment, index: number) => {
                      const dateInfo = formatAppointmentDate(appointment.appointment_date)
                      const doctorName = appointment.profiles
                        ? `Dr. ${appointment.profiles.first_name} ${appointment.profiles.last_name}`
                        : "Doctor"

                      return (
                        <motion.div
                          key={appointment.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="border rounded-lg p-4 bg-gray-50"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-4">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback className="bg-gray-200 text-gray-600">
                                  {doctorName.split(" ")[1]?.charAt(0) || "D"}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <h3 className="font-medium text-gray-900">{doctorName}</h3>
                                <p className="text-gray-600">{appointment.treatment_type}</p>
                                <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {dateInfo.date}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {appointment.clinic_name || "Healthcare Clinic"}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <Badge variant="outline">{appointment.status}</Badge>
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Reschedule Dialog */}
        <Dialog open={showRescheduleDialog} onOpenChange={setShowRescheduleDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reschedule Appointment</DialogTitle>
              <DialogDescription>Select a new date and time for your appointment</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="reschedule-date">New Date & Time</Label>
                <Input
                  id="reschedule-date"
                  type="datetime-local"
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleReschedule} disabled={!rescheduleDate || actionLoading} className="flex-1">
                  {actionLoading ? "Rescheduling..." : "Reschedule"}
                </Button>
                <Button variant="outline" onClick={() => setShowRescheduleDialog(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Cancel Dialog */}
        <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cancel Appointment</DialogTitle>
              <DialogDescription>Are you sure you want to cancel this appointment?</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="cancel-reason">Reason (Optional)</Label>
                <Textarea
                  id="cancel-reason"
                  placeholder="Please let us know why you're cancelling..."
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="destructive" onClick={handleCancel} disabled={actionLoading} className="flex-1">
                  {actionLoading ? "Cancelling..." : "Cancel Appointment"}
                </Button>
                <Button variant="outline" onClick={() => setShowCancelDialog(false)} className="flex-1">
                  Keep Appointment
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardWrapper>
  )
}
