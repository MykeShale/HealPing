import { getSupabase } from "./supabase"

const TIMEOUT_MS = 10000 // 10 seconds
const MAX_RETRIES = 3

// Helper function for timeout
function withTimeout<T>(promise: Promise<T>, timeoutMs: number = TIMEOUT_MS): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => setTimeout(() => reject(new Error("Request timeout")), timeoutMs)),
  ])
}

// Helper function for retry logic
async function withRetry<T>(fn: () => Promise<T>, maxRetries: number = MAX_RETRIES): Promise<T> {
  let lastError: Error

  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error
      if (i === maxRetries) break

      // Exponential backoff
      const delay = Math.min(1000 * Math.pow(2, i), 5000)
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }

  throw lastError!
}

// Dashboard statistics for doctors
export async function getDashboardStats(clinicId: string) {
  return withRetry(async () => {
    return withTimeout(async () => {
      const supabase = getSupabase()

      try {
        // Get patients count
        const { count: patientsCount, error: patientsError } = await supabase
          .from("patients")
          .select("*", { count: "exact", head: true })
          .eq("clinic_id", clinicId)

        if (patientsError) throw patientsError

        // Get today's appointments
        const today = new Date().toISOString().split("T")[0]
        const { count: todayAppointments, error: appointmentsError } = await supabase
          .from("appointments")
          .select("*", { count: "exact", head: true })
          .eq("clinic_id", clinicId)
          .gte("appointment_date", `${today}T00:00:00`)
          .lt("appointment_date", `${today}T23:59:59`)

        if (appointmentsError) throw appointmentsError

        // Get pending reminders
        const { count: pendingReminders, error: remindersError } = await supabase
          .from("reminders")
          .select("*", { count: "exact", head: true })
          .eq("clinic_id", clinicId)
          .eq("status", "pending")

        if (remindersError) throw remindersError

        // Get upcoming follow-ups (appointments with follow_up_date in the future)
        const { count: upcomingFollowups, error: followupsError } = await supabase
          .from("appointments")
          .select("*", { count: "exact", head: true })
          .eq("clinic_id", clinicId)
          .not("follow_up_date", "is", null)
          .gte("follow_up_date", new Date().toISOString())

        if (followupsError) throw followupsError

        // Get overdue follow-ups
        const { count: overdueFollowups, error: overdueError } = await supabase
          .from("appointments")
          .select("*", { count: "exact", head: true })
          .eq("clinic_id", clinicId)
          .not("follow_up_date", "is", null)
          .lt("follow_up_date", new Date().toISOString())

        if (overdueError) throw overdueError

        return {
          total_patients: patientsCount || 0,
          today_appointments: todayAppointments || 0,
          pending_reminders: pendingReminders || 0,
          upcoming_followups: upcomingFollowups || 0,
          overdue_followups: overdueFollowups || 0,
        }
      } catch (error) {
        console.error("Error in getDashboardStats:", error)
        return {
          total_patients: 0,
          today_appointments: 0,
          pending_reminders: 0,
          upcoming_followups: 0,
          overdue_followups: 0,
        }
      }
    })
  })
}

// Patient management
export async function createPatient(patientData: {
  clinic_id: string
  full_name: string
  phone: string
  email?: string
  date_of_birth?: string
  gender?: string
  address?: string
  user_id?: string
  medical_history?: any
  emergency_contact?: any
  insurance_info?: any
  communication_preferences?: any
}) {
  return withRetry(async () => {
    return withTimeout(async () => {
      const supabase = getSupabase()

      // Ensure proper data structure
      const insertData = {
        clinic_id: patientData.clinic_id,
        full_name: patientData.full_name,
        phone: patientData.phone,
        email: patientData.email || null,
        date_of_birth: patientData.date_of_birth || null,
        gender: patientData.gender || null,
        address: patientData.address || null,
        user_id: patientData.user_id || null,
        medical_history: patientData.medical_history || {},
        emergency_contact: patientData.emergency_contact || {},
        insurance_info: patientData.insurance_info || {},
        communication_preferences: patientData.communication_preferences || {
          sms: true,
          email: !!patientData.email,
          whatsapp: false,
        },
      }

      const { data, error } = await supabase.from("patients").insert([insertData]).select().single()

      if (error) throw error
      return data
    })
  })
}

export async function getPatients(clinicId: string) {
  return withRetry(async () => {
    return withTimeout(async () => {
      const supabase = getSupabase()
      const { data, error } = await supabase
        .from("patients")
        .select("*")
        .eq("clinic_id", clinicId)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching patients:", error)
        return []
      }

      return data || []
    })
  })
}

// Appointment management
export async function scheduleAppointment(appointmentData: {
  patient_id: string
  doctor_id: string
  clinic_id: string
  appointment_date: string
  duration_minutes?: number
  treatment_type?: string
  notes?: string
}) {
  return withRetry(async () => {
    return withTimeout(async () => {
      const supabase = getSupabase()
      const { data, error } = await supabase
        .from("appointments")
        .insert([
          {
            patient_id: appointmentData.patient_id,
            doctor_id: appointmentData.doctor_id,
            clinic_id: appointmentData.clinic_id,
            appointment_date: appointmentData.appointment_date,
            duration_minutes: appointmentData.duration_minutes || 30,
            treatment_type: appointmentData.treatment_type,
            notes: appointmentData.notes,
            status: "scheduled",
          },
        ])
        .select()
        .single()

      if (error) throw error
      return data
    })
  })
}

export async function getAppointments(clinicId: string) {
  return withRetry(async () => {
    return withTimeout(async () => {
      const supabase = getSupabase()
      const { data, error } = await supabase
        .from("appointments")
        .select(`
          *,
          patients (
            id,
            full_name,
            phone,
            email
          ),
          profiles!appointments_doctor_id_fkey (
            first_name,
            last_name
          )
        `)
        .eq("clinic_id", clinicId)
        .order("appointment_date", { ascending: true })

      if (error) {
        console.error("Error fetching appointments:", error)
        return []
      }

      return data || []
    })
  })
}

// Patient-specific functions
export async function getPatientAppointments(patientId: string) {
  return withRetry(async () => {
    return withTimeout(async () => {
      const supabase = getSupabase()
      const { data, error } = await supabase
        .from("appointments")
        .select(`
          *,
          profiles!appointments_doctor_id_fkey (
            first_name,
            last_name
          ),
          clinics (
            name,
            address
          )
        `)
        .eq("patient_id", patientId)
        .order("appointment_date", { ascending: true })

      if (error) {
        console.error("Error fetching patient appointments:", error)
        return []
      }

      return data || []
    })
  })
}

export async function getPatientByUserId(userId: string) {
  return withRetry(async () => {
    return withTimeout(async () => {
      const supabase = getSupabase()
      const { data, error } = await supabase.from("patients").select("*").eq("user_id", userId).single()

      if (error) {
        console.error("Error fetching patient profile:", error)
        return null
      }

      return data
    })
  })
}

export async function getPatientMedicalRecords(patientId: string) {
  return withRetry(async () => {
    return withTimeout(async () => {
      const supabase = getSupabase()
      const { data, error } = await supabase
        .from("medical_records")
        .select(`
          *,
          appointments (
            appointment_date,
            treatment_type
          )
        `)
        .eq("patient_id", patientId)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching medical records:", error)
        return []
      }

      return data || []
    })
  })
}

export async function getPatientReminders(patientId: string) {
  return withRetry(async () => {
    return withTimeout(async () => {
      const supabase = getSupabase()
      const { data, error } = await supabase
        .from("reminders")
        .select(`
          *,
          appointments (
            appointment_date,
            treatment_type
          )
        `)
        .eq("patient_id", patientId)
        .eq("status", "pending")
        .order("scheduled_for", { ascending: true })

      if (error) {
        console.error("Error fetching patient reminders:", error)
        return []
      }

      return data || []
    })
  })
}

export async function rescheduleAppointment(appointmentId: string, newDate: string) {
  return withRetry(async () => {
    return withTimeout(async () => {
      const supabase = getSupabase()
      const { data, error } = await supabase
        .from("appointments")
        .update({
          appointment_date: newDate,
          status: "rescheduled",
          updated_at: new Date().toISOString(),
        })
        .eq("id", appointmentId)
        .select()
        .single()

      if (error) throw error
      return data
    })
  })
}

export async function cancelAppointment(appointmentId: string, reason?: string) {
  return withRetry(async () => {
    return withTimeout(async () => {
      const supabase = getSupabase()
      const { data, error } = await supabase
        .from("appointments")
        .update({
          status: "cancelled",
          notes: reason ? `Cancelled: ${reason}` : "Cancelled by patient",
          updated_at: new Date().toISOString(),
        })
        .eq("id", appointmentId)
        .select()
        .single()

      if (error) throw error
      return data
    })
  })
}

// Reminder management
export async function createReminders(appointmentId: string, reminderTypes: string[] = ["sms", "email"]) {
  return withRetry(async () => {
    return withTimeout(async () => {
      const supabase = getSupabase()

      // Get appointment details first
      const { data: appointment, error: appointmentError } = await supabase
        .from("appointments")
        .select("*")
        .eq("id", appointmentId)
        .single()

      if (appointmentError) throw appointmentError

      // Create reminders for each type
      const reminderPromises = reminderTypes.map((type) => {
        const scheduledFor = new Date(appointment.appointment_date)
        scheduledFor.setHours(scheduledFor.getHours() - 24) // 24 hours before

        return supabase.from("reminders").insert([
          {
            appointment_id: appointmentId,
            patient_id: appointment.patient_id,
            clinic_id: appointment.clinic_id,
            reminder_type: type,
            scheduled_for: scheduledFor.toISOString(),
            status: "pending",
            message_content: `Reminder: You have an appointment tomorrow at ${new Date(appointment.appointment_date).toLocaleString()}`,
          },
        ])
      })

      const results = await Promise.all(reminderPromises)
      const errors = results.filter((result) => result.error)

      if (errors.length > 0) {
        throw new Error(`Failed to create some reminders: ${errors.map((e) => e.error?.message).join(", ")}`)
      }

      return results.flatMap((result) => result.data)
    })
  })
}

export async function getReminders(clinicId: string) {
  return withRetry(async () => {
    return withTimeout(async () => {
      const supabase = getSupabase()
      const { data, error } = await supabase
        .from("reminders")
        .select(`
          *,
          appointments (
            appointment_date,
            treatment_type
          ),
          patients (
            full_name,
            phone,
            email
          )
        `)
        .eq("clinic_id", clinicId)
        .order("scheduled_for", { ascending: false })

      if (error) {
        console.error("Error fetching reminders:", error)
        return []
      }

      return data || []
    })
  })
}

// Real-time subscriptions
export function subscribeToAppointments(clinicId: string, callback: (payload: any) => void) {
  const supabase = getSupabase()
  return supabase
    .channel("appointments")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "appointments",
        filter: `clinic_id=eq.${clinicId}`,
      },
      callback,
    )
    .subscribe()
}

export function subscribeToReminders(callback: (payload: any) => void) {
  const supabase = getSupabase()
  return supabase
    .channel("reminders")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "reminders",
      },
      callback,
    )
    .subscribe()
}
