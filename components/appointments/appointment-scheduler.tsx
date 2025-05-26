"use client"

import { useState, useEffect } from "react"
import { Calendar, dateFnsLocalizer } from "react-big-calendar"
import { format, parse, startOfWeek, getDay } from "date-fns"
import { enUS } from "date-fns/locale"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useAuth } from "@/lib/auth-context"
import { getAppointments, getPatients } from "@/lib/supabase-functions"
import { CalendarDays, Clock, User, Plus } from "lucide-react"
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
  }
}

export function AppointmentScheduler() {
  const { profile } = useAuth()
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [patients, setPatients] = useState<any[]>([])
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [loading, setLoading] = useState(true)

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
        end: new Date(new Date(apt.appointment_date).getTime() + (apt.duration_minutes || 30) * 60000),
        resource: {
          patient: apt.patients,
          status: apt.status,
          treatment_type: apt.treatment_type,
          notes: apt.notes,
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

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Appointment Calendar</CardTitle>
          <CardDescription>Loading appointments...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96 flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
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
          <h2 className="text-2xl font-bold text-gray-900">Appointment Calendar</h2>
          <p className="text-gray-600">Manage your practice schedule</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              New Appointment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Schedule New Appointment</DialogTitle>
              <DialogDescription>Select a patient and time slot</DialogDescription>
            </DialogHeader>
            {/* Add appointment form here */}
            <div className="p-4 text-center text-gray-500">Appointment scheduling form will be implemented here</div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CalendarDays className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Today</p>
                <p className="text-2xl font-bold text-gray-900">
                  {events.filter((e) => format(e.start, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")).length}
                </p>
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
              <User className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Patients</p>
                <p className="text-2xl font-bold text-gray-900">{patients.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-orange-600 border-orange-200">
                Pending
              </Badge>
              <div>
                <p className="text-sm font-medium text-gray-600">Follow-ups</p>
                <p className="text-2xl font-bold text-gray-900">
                  {events.filter((e) => e.resource.status === "scheduled").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calendar */}
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
              views={["month", "week", "day"]}
              defaultView="week"
              step={30}
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

      {/* Event Details Modal */}
      {selectedEvent && (
        <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Appointment Details</DialogTitle>
              <DialogDescription>{format(selectedEvent.start, "EEEE, MMMM do, yyyy 'at' h:mm a")}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900">Patient</h4>
                <p className="text-gray-600">{selectedEvent.resource.patient?.full_name}</p>
                <p className="text-sm text-gray-500">{selectedEvent.resource.patient?.phone}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Treatment Type</h4>
                <p className="text-gray-600">{selectedEvent.resource.treatment_type || "General Consultation"}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Status</h4>
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
              {selectedEvent.resource.notes && (
                <div>
                  <h4 className="font-medium text-gray-900">Notes</h4>
                  <p className="text-gray-600">{selectedEvent.resource.notes}</p>
                </div>
              )}
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Edit
                </Button>
                <Button variant="outline" size="sm">
                  Reschedule
                </Button>
                <Button variant="destructive" size="sm">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
