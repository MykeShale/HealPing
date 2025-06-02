"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { scheduleAppointment, createReminders } from "@/lib/supabase-functions"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Calendar, Clock } from "lucide-react"
import { format, addMinutes } from "date-fns"

const appointmentSchema = z.object({
  patient_id: z.string().min(1, "Please select a patient"),
  appointment_date: z.string().min(1, "Please select date and time"),
  treatment_type: z.string().min(1, "Please select treatment type"),
  duration_minutes: z.number().min(15, "Duration must be at least 15 minutes"),
  notes: z.string().optional(),
  send_reminders: z.boolean().default(true),
  reminder_types: z.array(z.string()).default(["sms", "email"]),
})

type AppointmentFormData = z.infer<typeof appointmentSchema>

interface BookAppointmentFormProps {
  patients: any[]
  selectedSlot?: { start: Date; end: Date } | null
  onSuccess?: () => void
  onCancel?: () => void
}

export function BookAppointmentForm({ patients, selectedSlot, onSuccess, onCancel }: BookAppointmentFormProps) {
  const { profile } = useAuth()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      patient_id: "",
      appointment_date: selectedSlot ? selectedSlot.start.toISOString().slice(0, 16) : "",
      treatment_type: "",
      duration_minutes: 30,
      notes: "",
      send_reminders: true,
      reminder_types: ["sms", "email"],
    },
  })

  const watchedDuration = form.watch("duration_minutes")
  const watchedDate = form.watch("appointment_date")

  const getEndTime = () => {
    if (!watchedDate || !watchedDuration) return ""
    const startDate = new Date(watchedDate)
    const endDate = addMinutes(startDate, watchedDuration)
    return format(endDate, "HH:mm")
  }

  const onSubmit = async (data: AppointmentFormData) => {
    if (!profile?.id || !profile?.clinic_id) {
      toast({
        title: "Error",
        description: "Missing doctor or clinic information",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      // Schedule the appointment
      const appointment = await scheduleAppointment({
        patient_id: data.patient_id,
        doctor_id: profile.id,
        clinic_id: profile.clinic_id,
        appointment_date: data.appointment_date,
        duration_minutes: data.duration_minutes,
        treatment_type: data.treatment_type,
        notes: data.notes,
      })

      // Create reminders if requested
      if (data.send_reminders && data.reminder_types.length > 0) {
        try {
          await createReminders(appointment.id, data.reminder_types)
        } catch (reminderError) {
          console.warn("Failed to create reminders:", reminderError)
          // Don't fail the appointment creation if reminders fail
        }
      }

      toast({
        title: "Success",
        description: "Appointment scheduled successfully",
      })

      form.reset()
      onSuccess?.()
    } catch (error) {
      console.error("Error scheduling appointment:", error)
      toast({
        title: "Error",
        description: "Failed to schedule appointment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Schedule New Appointment
        </CardTitle>
        <CardDescription>Book an appointment for a patient</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Patient Selection */}
          <div className="space-y-2">
            <Label htmlFor="patient_id">Patient *</Label>
            <Select value={form.watch("patient_id")} onValueChange={(value) => form.setValue("patient_id", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a patient" />
              </SelectTrigger>
              <SelectContent>
                {patients.map((patient) => (
                  <SelectItem key={patient.id} value={patient.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{patient.full_name}</span>
                      <span className="text-sm text-gray-500">{patient.phone}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.patient_id && (
              <p className="text-sm text-red-600">{form.formState.errors.patient_id.message}</p>
            )}
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="appointment_date">Date & Time *</Label>
              <Input
                id="appointment_date"
                type="datetime-local"
                {...form.register("appointment_date")}
                min={new Date().toISOString().slice(0, 16)}
              />
              {form.formState.errors.appointment_date && (
                <p className="text-sm text-red-600">{form.formState.errors.appointment_date.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration_minutes">Duration *</Label>
              <Select
                value={watchedDuration?.toString()}
                onValueChange={(value) => form.setValue("duration_minutes", Number.parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="90">1.5 hours</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                </SelectContent>
              </Select>
              {watchedDate && watchedDuration && (
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Ends at {getEndTime()}
                </p>
              )}
            </div>
          </div>

          {/* Treatment Type */}
          <div className="space-y-2">
            <Label htmlFor="treatment_type">Treatment Type *</Label>
            <Select
              value={form.watch("treatment_type")}
              onValueChange={(value) => form.setValue("treatment_type", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select treatment type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="consultation">General Consultation</SelectItem>
                <SelectItem value="follow-up">Follow-up Visit</SelectItem>
                <SelectItem value="check-up">Routine Check-up</SelectItem>
                <SelectItem value="procedure">Medical Procedure</SelectItem>
                <SelectItem value="emergency">Emergency Visit</SelectItem>
                <SelectItem value="vaccination">Vaccination</SelectItem>
                <SelectItem value="lab-review">Lab Results Review</SelectItem>
                <SelectItem value="physical-exam">Physical Examination</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.treatment_type && (
              <p className="text-sm text-red-600">{form.formState.errors.treatment_type.message}</p>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              {...form.register("notes")}
              placeholder="Additional notes or special instructions..."
              rows={3}
            />
          </div>

          {/* Reminder Settings */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="send_reminders"
                {...form.register("send_reminders")}
                className="rounded border-gray-300"
              />
              <Label htmlFor="send_reminders">Send appointment reminders</Label>
            </div>

            {form.watch("send_reminders") && (
              <div className="ml-6 space-y-2">
                <Label>Reminder Methods</Label>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="sms_reminder"
                      checked={form.watch("reminder_types")?.includes("sms")}
                      onChange={(e) => {
                        const current = form.watch("reminder_types") || []
                        if (e.target.checked) {
                          form.setValue("reminder_types", [...current, "sms"])
                        } else {
                          form.setValue(
                            "reminder_types",
                            current.filter((t) => t !== "sms"),
                          )
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="sms_reminder">SMS</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="email_reminder"
                      checked={form.watch("reminder_types")?.includes("email")}
                      onChange={(e) => {
                        const current = form.watch("reminder_types") || []
                        if (e.target.checked) {
                          form.setValue("reminder_types", [...current, "email"])
                        } else {
                          form.setValue(
                            "reminder_types",
                            current.filter((t) => t !== "email"),
                          )
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="email_reminder">Email</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="whatsapp_reminder"
                      checked={form.watch("reminder_types")?.includes("whatsapp")}
                      onChange={(e) => {
                        const current = form.watch("reminder_types") || []
                        if (e.target.checked) {
                          form.setValue("reminder_types", [...current, "whatsapp"])
                        } else {
                          form.setValue(
                            "reminder_types",
                            current.filter((t) => t !== "whatsapp"),
                          )
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="whatsapp_reminder">WhatsApp</Label>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Schedule Appointment
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
