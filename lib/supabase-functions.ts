import { getSupabase } from "./supabase"

// Dashboard statistics
export async function getDashboardStats(clinicId: string) {
  if (!clinicId) {
    throw new Error("Clinic ID is required")
  }

  const supabase = getSupabase()

  try {
    // Try to use the RPC function first
    const { data, error } = await supabase.rpc("get_dashboard_stats", {
      clinic_uuid: clinicId,
    })

    if (error) {
      console.warn("RPC function failed, falling back to manual queries:", error)
      // Fallback to manual queries if RPC doesn't exist
      return await getDashboardStatsManual(clinicId)
    }

    return (
      data || {
        total_patients: 0,
        today_appointments: 0,
        pending_reminders: 0,
        upcoming_followups: 0,
        overdue_followups: 0,
      }
    )
  } catch (error) {
    console.error("Dashboard stats error:", error)
    // Return fallback data instead of throwing
    return {
      total_patients: 0,
      today_appointments: 0,
      pending_reminders: 0,
      upcoming_followups: 0,
      overdue_followups: 0,
    }
  }
}

// Fallback function for manual queries
async function getDashboardStatsManual(clinicId: string) {
  const supabase = getSupabase()
  const today = new Date().toISOString().split("T")[0]

  try {
    // Get total patients
    const { count: totalPatients } = await supabase
      .from("patients")
      .select("*", { count: "exact", head: true })
      .eq("clinic_id", clinicId)

    // Get today's appointments
    const { count: todayAppointments } = await supabase
      .from("appointments")
      .select("*", { count: "exact", head: true })
      .eq("clinic_id", clinicId)
      .gte("appointment_date", today)
      .lt("appointment_date", `${today}T23:59:59`)

    // Get pending reminders
    const { count: pendingReminders } = await supabase
      .from("reminders")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending")

    return {
      total_patients: totalPatients || 0,
      today_appointments: todayAppointments || 0,
      pending_reminders: pendingReminders || 0,
      upcoming_followups: 0, // Simplified for now
      overdue_followups: 0, // Simplified for now
    }
  } catch (error) {
    console.error("Manual stats query failed:", error)
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
  clinic_id: string
  full_name: string
  phone: string
  email?: string
  date_of_birth?: string
  gender?: string
  address?: string
}) {
  const supabase = getSupabase()
  const { data, error } = await supabase.rpc("create_patient", {
    p_clinic_id: patientData.clinic_id,
    p_full_name: patientData.full_name,
    p_phone: patientData.phone,
    p_email: patientData.email,
    p_date_of_birth: patientData.date_of_birth,
    p_gender: patientData.gender,
    p_address: patientData.address,
  })

  if (error) throw error
  return data
}

export async function getPatients(clinicId: string) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from("patients")
    .select("*")
    .eq("clinic_id", clinicId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data
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
  const supabase = getSupabase()
  const { data, error } = await supabase.rpc("schedule_appointment", {
    p_patient_id: appointmentData.patient_id,
    p_doctor_id: appointmentData.doctor_id,
    p_clinic_id: appointmentData.clinic_id,
    p_appointment_date: appointmentData.appointment_date,
    p_duration_minutes: appointmentData.duration_minutes,
    p_treatment_type: appointmentData.treatment_type,
    p_notes: appointmentData.notes,
  })

  if (error) throw error
  return data
}

export async function getAppointments(clinicId: string) {
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
      )
    `)
    .eq("clinic_id", clinicId)
    .order("appointment_date", { ascending: true })

  if (error) throw error
  return data
}

// Reminder management
export async function createReminders(appointmentId: string, reminderTypes: string[] = ["sms", "email"]) {
  const supabase = getSupabase()
  const { data, error } = await supabase.rpc("create_appointment_reminders", {
    p_appointment_id: appointmentId,
    p_reminder_types: reminderTypes,
  })

  if (error) throw error
  return data
}

export async function getReminders(clinicId: string) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from("reminders")
    .select(`
      *,
      appointments (
        id,
        appointment_date,
        treatment_type,
        patients (
          full_name,
          phone
        )
      )
    `)
    .eq("appointments.clinic_id", clinicId)
    .order("scheduled_for", { ascending: true })

  if (error) throw error
  return data
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
