"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from "@/lib/auth-context"
import { Calendar, Clock, MapPin, MessageSquare, Phone, Plus } from "lucide-react"
import { motion } from "framer-motion"

interface Appointment {
  id: string
  doctor_name: string
  appointment_date: string
  treatment_type: string
  clinic_name: string
  clinic_address: string
  status: string
  notes?: string
}

export default function PatientAppointmentsPage() {
  const { profile } = useAuth()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data for demonstration
    setAppointments([
      {
        id: "1",
        doctor_name: "Dr. Sarah Johnson",
        appointment_date: new Date(Date.now() + 86400000).toISOString(),
        treatment_type: "Regular Checkup",
        clinic_name: "HealthFirst Clinic",
        clinic_address: "123 Medical Center Dr, City, State 12345",
        status: "confirmed",
        notes: "Annual physical examination",
      },
      {
        id: "2",
        doctor_name: "Dr. Michael Chen",
        appointment_date: new Date(Date.now() + 7 * 86400000).toISOString(),
        treatment_type: "Cardiology Consultation",
        clinic_name: "Heart Care Center",
        clinic_address: "456 Cardiac Ave, City, State 12345",
        status: "scheduled",
      },
      {
        id: "3",
        doctor_name: "Dr. Emily Rodriguez",
        appointment_date: new Date(Date.now() - 14 * 86400000).toISOString(),
        treatment_type: "Follow-up Visit",
        clinic_name: "Kids Health Clinic",
        clinic_address: "789 Pediatric Blvd, City, State 12345",
        status: "completed",
      },
    ])
    setLoading(false)
  }, [])

  const upcomingAppointments = appointments.filter(
    (apt) => new Date(apt.appointment_date) > new Date() && apt.status !== "cancelled",
  )
  const pastAppointments = appointments.filter(
    (apt) => new Date(apt.appointment_date) <= new Date() || apt.status === "completed",
  )

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
        <div className="grid gap-4">
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
      </div>
    )
  }

  return (
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

      {/* Upcoming Appointments */}
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
                {upcomingAppointments.map((appointment, index) => (
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
                            {appointment.doctor_name.split(" ")[1]?.charAt(0) || "D"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{appointment.doctor_name}</h3>
                          <p className="text-gray-600">{appointment.treatment_type}</p>
                          <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {new Date(appointment.appointment_date).toLocaleString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {appointment.clinic_name}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 mt-1">{appointment.clinic_address}</p>
                          {appointment.notes && (
                            <p className="text-sm text-gray-600 mt-2 italic">{appointment.notes}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge variant={appointment.status === "confirmed" ? "default" : "secondary"}>
                          {appointment.status}
                        </Badge>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Reschedule
                          </Button>
                          <Button variant="outline" size="sm">
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Phone className="h-4 w-4" />
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

      {/* Past Appointments */}
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
                {pastAppointments.map((appointment, index) => (
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
                            {appointment.doctor_name.split(" ")[1]?.charAt(0) || "D"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{appointment.doctor_name}</h3>
                          <p className="text-gray-600">{appointment.treatment_type}</p>
                          <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(appointment.appointment_date).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {appointment.clinic_name}
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
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
