import { getSupabase } from "./supabase"

const TIMEOUT_MS = 5000 // Reduced to 5 seconds
const MAX_RETRIES = 2 // Reduced retries

// Helper function for timeout
function withTimeout<T>(promise: Promise<T>, timeoutMs: number = TIMEOUT_MS): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => setTimeout(() => reject(new Error("Request timeout")), timeoutMs)),
  ])
}

// Helper function for retry logic with exponential backoff
async function withRetry<T>(fn: () => Promise<T>, maxRetries: number = MAX_RETRIES): Promise<T> {
  let lastError: Error

  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error
      if (i === maxRetries) break

      // Exponential backoff with jitter
      const delay = Math.min(500 * Math.pow(2, i) + Math.random() * 100, 2000)
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }

  throw lastError!
}

// Helper function to safely handle API responses
function safeApiCall<T>(data: T | null, fallback: T): T {
  return data ?? fallback
}

// Dashboard statistics for doctors
export async function getDashboardStats(clinicId?: string) {
  if (!clinicId) {
    return {
      total_patients: 0,
      today_appointments: 0,
      pending_reminders: 0,
      upcoming_followups: 0,
      overdue_followups: 0,
    }
  }

  try {
    return await withTimeout(async () => {
      const supabase = getSupabase()

      // Use Promise.allSettled to prevent one failure from blocking others
      const [patientsResult, appointmentsResult, remindersResult, followupsResult, overdueResult] =
        await Promise.allSettled([
          // Get patients count
          supabase
            .from("patients")
            .select("*", { count: "exact", head: true })
            .eq("clinic_id", clinicId),

          // Get today's appointments
          (() => {
            const today = new Date().toISOString().split("T")[0]
            return supabase
              .from("appointments")
              .select("*", { count: "exact", head: true })
              .eq("clinic_id", clinicId)
              .gte("appointment_date", `${today}T00:00:00`)
              .lt("appointment_date", `${today}T23:59:59`)
          })(),

          // Get pending reminders
          supabase
            .from("reminders")
            .select("*", { count: "exact", head: true })
            .eq("clinic_id", clinicId)
            .eq("status", "pending"),

          // Get upcoming follow-ups
          supabase
            .from("appointments")
            .select("*", { count: "exact", head: true })
            .eq("clinic_id", clinicId)
            .not("follow_up_date", "is", null)
            .gte("follow_up_date", new Date().toISOString()),

          // Get overdue follow-ups
          supabase
            .from("appointments")
            .select("*", { count: "exact", head: true })
            .eq("clinic_id", clinicId)
            .not("follow_up_date", "is", null)
            .lt("follow_up_date", new Date().toISOString()),
        ])

      return {
        total_patients: patientsResult.status === "fulfilled" ? patientsResult.value.count || 0 : 0,
        today_appointments: appointmentsResult.status === "fulfilled" ? appointmentsResult.value.count || 0 : 0,
        pending_reminders: remindersResult.status === "fulfilled" ? remindersResult.value.count || 0 : 0,
        upcoming_followups: followupsResult.status === "fulfilled" ? followupsResult.value.count || 0 : 0,
        overdue_followups: overdueResult.status === "fulfilled" ? overdueResult.value.count || 0 : 0,
      }
    }, 8000) // Longer timeout for dashboard stats
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
}

// Patient management
export async function createPatient(patientData: {
  clinic_id?: string
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

      // If no clinic_id provided, try to get/create one
      let clinicId = patientData.clinic_id
      if (!clinicId) {
        // Get the default clinic
        const { data: clinic, error: clinicError } = await supabase
          .from("clinics")
          .select("id")
          .eq("name", "Default Medical Practice")
          .single()

        if (clinicError || !clinic) {
          throw new Error("No clinic found. Please contact support.")
        }
        clinicId = clinic.id
      }

      // Ensure proper data structure
      const insertData = {
        clinic_id: clinicId,
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

export async function getPatients(clinicId?: string) {
  if (!clinicId) {
    return []
  }

  try {
    return await withTimeout(async () => {
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

      return safeApiCall(data, [])
    })
  } catch (error) {
    console.error("Error in getPatients:", error)
    return []
  }
}

// Appointment management
export async function scheduleAppointment(appointmentData: {
  patient_id: string
  doctor_id: string
  clinic_id?: string
  appointment_date: string
  duration_minutes?: number
  treatment_type?: string
  notes?: string
}) {
  return withRetry(async () => {
    return withTimeout(async () => {
      const supabase = getSupabase()

      // If no clinic_id provided, get it from the doctor's profile
      let clinicId = appointmentData.clinic_id
      if (!clinicId) {
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("clinic_id")
          .eq("id", appointmentData.doctor_id)
          .single()

        if (profileError || !profile.clinic_id) {
          throw new Error("Doctor's clinic not found")
        }
        clinicId = profile.clinic_id
      }

      const { data, error } = await supabase
        .from("appointments")
        .insert([
          {
            patient_id: appointmentData.patient_id,
            doctor_id: appointmentData.doctor_id,
            clinic_id: clinicId,
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

export async function getAppointments(clinicId?: string) {
  if (!clinicId) {
    return []
  }

  try {
    return await withTimeout(async () => {
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

      return safeApiCall(data, [])
    })
  } catch (error) {
    console.error("Error in getAppointments:", error)
    return []
  }
}

// Reminder management
export async function getReminders(clinicId?: string) {
  if (!clinicId) {
    return []
  }

  try {
    return await withTimeout(async () => {
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

      return safeApiCall(data, [])
    })
  } catch (error) {
    console.error("Error in getReminders:", error)
    return []
  }
}

// Real-time subscriptions with error handling
export function subscribeToAppointments(clinicId: string, callback: (payload: any) => void) {
  const supabase = getSupabase()

  const channel = supabase
    .channel("appointments")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "appointments",
        filter: `clinic_id=eq.${clinicId}`,
      },
      (payload) => {
        try {
          callback(payload)
        } catch (error) {
          console.error("Error in appointment subscription callback:", error)
        }
      },
    )
    .subscribe((status) => {
      if (status === "SUBSCRIBED") {
        console.log("Subscribed to appointments")
      } else if (status === "CHANNEL_ERROR") {
        console.error("Failed to subscribe to appointments")
      }
    })

  return channel
}

export function subscribeToReminders(callback: (payload: any) => void) {
  const supabase = getSupabase()

  const channel = supabase
    .channel("reminders")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "reminders",
      },
      (payload) => {
        try {
          callback(payload)
        } catch (error) {
          console.error("Error in reminder subscription callback:", error)
        }
      },
    )
    .subscribe((status) => {
      if (status === "SUBSCRIBED") {
        console.log("Subscribed to reminders")
      } else if (status === "CHANNEL_ERROR") {
        console.error("Failed to subscribe to reminders")
      }
    })

  return channel
}

// Patient-specific functions with better error handling
export async function getPatientByUserId(userId: string) {
  try {
    return await withTimeout(async () => {
      const supabase = getSupabase()

      const { data, error } = await supabase.from("patients").select("*").eq("user_id", userId).single()

      if (error) {
        if (error.code === "PGRST116") {
          return null // No patient found
        }
        console.error("Error fetching patient profile:", error)
        return null
      }

      return data
    })
  } catch (error) {
    console.error("Error in getPatientByUserId:", error)
    return null
  }
}

export async function getPatientAppointments(patientId: string) {
  try {
    return await withTimeout(async () => {
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

      return safeApiCall(data, [])
    })
  } catch (error) {
    console.error("Error in getPatientAppointments:", error)
    return []
  }
}

export async function getPatientMedicalRecords(patientId: string) {
  try {
    return await withTimeout(async () => {
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

      return safeApiCall(data, [])
    })
  } catch (error) {
    console.error("Error in getPatientMedicalRecords:", error)
    return []
  }
}

export async function getPatientReminders(patientId: string) {
  try {
    return await withTimeout(async () => {
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

      return safeApiCall(data, [])
    })
  } catch (error) {
    console.error("Error in getPatientReminders:", error)
    return []
  }
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

export async function createReminders(appointmentId: string, reminderTypes: string[] = ["sms", "email"]) {
  try {
    return await withTimeout(async () => {
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

      const results = await Promise.allSettled(reminderPromises)
      const errors = results.filter((result) => result.status === "rejected")

      if (errors.length > 0) {
        console.warn(`Failed to create some reminders:`, errors)
      }

      return results.filter((result) => result.status === "fulfilled").flatMap((result: any) => result.value.data || [])
    })
  } catch (error) {
    console.error("Error in createReminders:", error)
    return []
  }
}
