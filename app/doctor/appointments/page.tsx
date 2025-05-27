"use client"

import { useState, useEffect } from "react"
import { Calendar, dateFnsLocalizer, type View } from "react-big-calendar"
import { format, parse, startOfWeek, getDay } from "date-fns"
import { enUS } from "date-fns/locale"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/auth-context"
import { getAppointments, getPatients, scheduleAppointment } from "@/lib/supabase-functions"
import {
  CalendarDays,
  Clock,
  User,
  Plus,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Phone,
  MessageSquare,
  Mail,
} from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import "react-big-calendar/lib/css/react-big-calendar.css"

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: {
    "en-US": enUS,
  },
})

interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  resource: {
    patient: any
    status: string
    treatment_type: string
    notes: string
    phone: string
  }
}

interface NewAppointment {
  patient_id: string
  appointment_date: string
  treatment_type: string
  duration_minutes: number
  notes: string
}

export default function DoctorAppointmentsPage() {
  const { profile } = useAuth()
  const { toast } = useToast()
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [patients, setPatients] = useState<any[]>([])
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<View>("week")
  const [date, setDate] = useState(new Date())
  const [isScheduleOpen, setIsScheduleOpen] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null)
  const [newAppointment, setNewAppointment] = useState<NewAppointment>({
    patient_id: "",
    appointment_date: "",
    treatment_type: "",
    duration_minutes: 30,
    notes: "",
  })

  useEffect(() => {
    if (profile?.clinic_id) {
      fetchAppointments()
      fetchPatients()
    }
  }, [profile])

  const fetchAppointments = async () => {
    try {
      const appointments = await getAppointments(profile?.clinic_id!)
      const calendarEvents: CalendarEvent[] = appointments.map((apt) => ({
        id: apt.id,
        title: `${apt.patients?.full_name} - ${apt.treatment_type || "Appointment"}`,
        start: new Date(apt.appointment_date),
        end: new Date(new Date(apt.appointment_date).getTime() + 30 * 60000),
        resource: {
          patient: apt.patients,
          status: apt.status,
          treatment_type: apt.treatment_type,
          notes: apt.notes,
          phone: apt.patients?.phone || "",
        },
      }))
      setEvents(calendarEvents)
    } catch (error) {
      console.error("Error fetching appointments:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchPatients = async () => {
    try {
      const patientsData = await getPatients(profile?.clinic_id!)
      setPatients(patientsData)
    } catch (error) {
      console.error("Error fetching patients:", error)
    }
  }

  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    setSelectedSlot({ start, end })
    setNewAppointment({
      ...newAppointment,
      appointment_date: start.toISOString(),
    })
    setIsScheduleOpen(true)
  }

  const handleScheduleAppointment = async () => {
    if (!profile?.id || !newAppointment.patient_id) return

    try {
      await scheduleAppointment({
        patient_id: newAppointment.patient_id,
        doctor_id: profile.id,
        clinic_id: profile.clinic_id!,
        appointment_date: newAppointment.appointment_date,
        duration_minutes: newAppointment.duration_minutes,
        treatment_type: newAppointment.treatment_type,
        notes: newAppointment.notes,
      })

      toast({
        title: "Success",
        description: "Appointment scheduled successfully",
      })

      setIsScheduleOpen(false)
      setNewAppointment({
        patient_id: "",
        appointment_date: "",
        treatment_type: "",
        duration_minutes: 30,
        notes: "",
      })
      fetchAppointments()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to schedule appointment",
        variant: "destructive",
      })
    }
  }

  const eventStyleGetter = (event: CalendarEvent) => {
    let backgroundColor = "#3174ad"

    switch (event.resource.status) {
      case "completed":
        backgroundColor = "#10b981"
        break
      case "cancelled":
        backgroundColor = "#ef4444"
        break
      case "no_show":
        backgroundColor = "#f59e0b"
        break
      default:
        backgroundColor = "#3b82f6"
    }

    return {
      style: {
        backgroundColor,
        borderRadius: "6px",
        opacity: 0.8,
        color: "white",
        border: "0px",
        display: "block",
      },
    }
  }

  const todayAppointments = events.filter(
    (event) => format(event.start, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd"),
  )

  const upcomingAppointments = events
    .filter(
      (event) => event.start > new Date() && format(event.start, "yyyy-MM-dd") !== format(new Date(), "yyyy-MM-dd"),
    )
    .slice(0, 5)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
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
            <h1 className="text-3xl font-bold text-gray-900">Appointment Management</h1>
            <p className="text-gray-600">Manage your practice schedule and patient appointments</p>
          </div>
          <Dialog open={isScheduleOpen} onOpenChange={setIsScheduleOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Schedule Appointment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Schedule New Appointment</DialogTitle>
                <DialogDescription>Book an appointment for a patient</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Patient *</Label>
                    <Select
                      value={newAppointment.patient_id}
                      onValueChange={(value) => setNewAppointment({ ...newAppointment, patient_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select patient" />
                      </SelectTrigger>
                      <SelectContent>
                        {patients.map((patient) => (
                          <SelectItem key={patient.id} value={patient.id}>
                            {patient.full_name} - {patient.phone}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Date & Time *</Label>
                    <Input
                      type="datetime-local"
                      value={
                        newAppointment.appointment_date
                          ? format(new Date(newAppointment.appointment_date), "yyyy-MM-dd'T'HH:mm")
                          : ""
                      }
                      onChange={(e) =>
                        setNewAppointment({
                          ...newAppointment,
                          appointment_date: new Date(e.target.value).toISOString(),
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Treatment Type</Label>
                    <Select
                      value={newAppointment.treatment_type}
                      onValueChange={(value) => setNewAppointment({ ...newAppointment, treatment_type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select treatment type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="consultation">Consultation</SelectItem>
                        <SelectItem value="follow-up">Follow-up</SelectItem>
                        <SelectItem value="check-up">Check-up</SelectItem>
                        <SelectItem value="procedure">Procedure</SelectItem>
                        <SelectItem value="emergency">Emergency</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Duration (minutes)</Label>
                    <Select
                      value={newAppointment.duration_minutes.toString()}
                      onValueChange={(value) =>
                        setNewAppointment({ ...newAppointment, duration_minutes: Number.parseInt(value) })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="45">45 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="90">1.5 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea
                    value={newAppointment.notes}
                    onChange={(e) => setNewAppointment({ ...newAppointment, notes: e.target.value })}
                    placeholder="Additional notes or instructions..."
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <Button variant="outline" onClick={() => setIsScheduleOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleScheduleAppointment}>Schedule Appointment</Button>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Statistics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CalendarDays className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Today</p>
                  <p className="text-2xl font-bold text-gray-900">{todayAppointments.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">This Week</p>
                  <p className="text-2xl font-bold text-gray-900">{events.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {events.filter((e) => e.resource.status === "completed").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Patients</p>
                  <p className="text-2xl font-bold text-gray-900">{patients.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Tabs defaultValue="calendar" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="calendar">Calendar View</TabsTrigger>
              <TabsTrigger value="today">Today's Schedule</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            </TabsList>

            <TabsContent value="calendar" className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div style={{ height: "600px" }}>
                    <Calendar
                      localizer={localizer}
                      events={events}
                      startAccessor="start"
                      endAccessor="end"
                      style={{ height: "100%" }}
                      eventPropGetter={eventStyleGetter}
                      onSelectEvent={(event) => setSelectedEvent(event)}
                      onSelectSlot={handleSelectSlot}
                      selectable
                      views={["month", "week", "day"]}
                      view={view}
                      onView={setView}
                      date={date}
                      onNavigate={setDate}
                      step={15}
                      showMultiDayTimes
                      components={{
                        event: ({ event }) => (
                          <div className="p-1">
                            <div className="font-medium text-xs">{event.resource.patient?.full_name}</div>
                            <div className="text-xs opacity-75">{event.resource.treatment_type}</div>
                          </div>
                        ),
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="today" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Today's Appointments</CardTitle>
                  <CardDescription>{format(new Date(), "EEEE, MMMM do, yyyy")}</CardDescription>
                </CardHeader>
                <CardContent>
                  {todayAppointments.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <CalendarDays className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No appointments scheduled for today</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {todayAppointments.map((appointment) => (
                        <div
                          key={appointment.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="text-sm font-medium text-gray-600 w-20">
                              {format(appointment.start, "HH:mm")}
                            </div>
                            <div>
                              <p className="font-medium">{appointment.resource.patient?.full_name}</p>
                              <p className="text-sm text-gray-600">{appointment.resource.treatment_type}</p>
                              <p className="text-xs text-gray-500">{appointment.resource.phone}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant={
                                appointment.resource.status === "completed"
                                  ? "default"
                                  : appointment.resource.status === "cancelled"
                                    ? "destructive"
                                    : "secondary"
                              }
                            >
                              {appointment.resource.status}
                            </Badge>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm">
                                <Phone className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <MessageSquare className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="upcoming" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Appointments</CardTitle>
                  <CardDescription>Next appointments in your schedule</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingAppointments.map((appointment) => (
                      <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="text-sm font-medium text-gray-600">
                            <div>{format(appointment.start, "MMM dd")}</div>
                            <div>{format(appointment.start, "HH:mm")}</div>
                          </div>
                          <div>
                            <p className="font-medium">{appointment.resource.patient?.full_name}</p>
                            <p className="text-sm text-gray-600">{appointment.resource.treatment_type}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{appointment.resource.status}</Badge>
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
          </Tabs>
        </motion.div>

        {/* Event Details Modal */}
        {selectedEvent && (
          <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Appointment Details</DialogTitle>
                <DialogDescription>{format(selectedEvent.start, "EEEE, MMMM do, yyyy 'at' h:mm a")}</DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Patient Information</h4>
                    <div className="space-y-2">
                      <p className="text-gray-600">
                        <strong>Name:</strong> {selectedEvent.resource.patient?.full_name}
                      </p>
                      <p className="text-gray-600">
                        <strong>Phone:</strong> {selectedEvent.resource.phone}
                      </p>
                      <p className="text-gray-600">
                        <strong>Email:</strong> {selectedEvent.resource.patient?.email || "Not provided"}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Appointment Details</h4>
                    <div className="space-y-2">
                      <p className="text-gray-600">
                        <strong>Type:</strong> {selectedEvent.resource.treatment_type || "General Consultation"}
                      </p>
                      <p className="text-gray-600">
                        <strong>Duration:</strong> 30 minutes
                      </p>
                      <div className="flex items-center gap-2">
                        <strong>Status:</strong>
                        <Badge
                          variant={
                            selectedEvent.resource.status === "completed"
                              ? "default"
                              : selectedEvent.resource.status === "cancelled"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {selectedEvent.resource.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedEvent.resource.notes && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Notes</h4>
                    <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedEvent.resource.notes}</p>
                  </div>
                )}

                <div className="flex flex-wrap gap-3">
                  <Button>
                    <Phone className="h-4 w-4 mr-2" />
                    Call Patient
                  </Button>
                  <Button variant="outline">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Send SMS
                  </Button>
                  <Button variant="outline">
                    <Mail className="h-4 w-4 mr-2" />
                    Send Email
                  </Button>
                  <Button variant="outline">
                    <CalendarDays className="h-4 w-4 mr-2" />
                    Reschedule
                  </Button>
                  <Button variant="destructive">
                    <XCircle className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}
