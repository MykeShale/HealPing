export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          role: "doctor" | "staff" | "patient"
          full_name: string
          phone: string | null
          avatar_url: string | null
          clinic_id: string | null
          preferences: Record<string, any>
          created_at: string
        }
        Insert: {
          id: string
          role: "doctor" | "staff" | "patient"
          full_name: string
          phone?: string | null
          avatar_url?: string | null
          clinic_id?: string | null
          preferences?: Record<string, any>
          created_at?: string
        }
        Update: {
          id?: string
          role?: "doctor" | "staff" | "patient"
          full_name?: string
          phone?: string | null
          avatar_url?: string | null
          clinic_id?: string | null
          preferences?: Record<string, any>
          created_at?: string
        }
      }
      clinics: {
        Row: {
          id: string
          name: string
          address: string | null
          phone: string | null
          email: string | null
          settings: Record<string, any>
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          address?: string | null
          phone?: string | null
          email?: string | null
          settings?: Record<string, any>
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          address?: string | null
          phone?: string | null
          email?: string | null
          settings?: Record<string, any>
          created_at?: string
        }
      }
      patients: {
        Row: {
          id: string
          clinic_id: string
          full_name: string
          phone: string
          email: string | null
          date_of_birth: string | null
          medical_history: Record<string, any>
          communication_preferences: Record<string, any>
          created_at: string
        }
        Insert: {
          id?: string
          clinic_id: string
          full_name: string
          phone: string
          email?: string | null
          date_of_birth?: string | null
          medical_history?: Record<string, any>
          communication_preferences?: Record<string, any>
          created_at?: string
        }
        Update: {
          id?: string
          clinic_id?: string
          full_name?: string
          phone?: string
          email?: string | null
          date_of_birth?: string | null
          medical_history?: Record<string, any>
          communication_preferences?: Record<string, any>
          created_at?: string
        }
      }
      appointments: {
        Row: {
          id: string
          patient_id: string
          doctor_id: string
          clinic_id: string
          appointment_date: string
          follow_up_date: string | null
          status: "scheduled" | "completed" | "cancelled" | "no_show"
          treatment_type: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          doctor_id: string
          clinic_id: string
          appointment_date: string
          follow_up_date?: string | null
          status?: "scheduled" | "completed" | "cancelled" | "no_show"
          treatment_type?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          doctor_id?: string
          clinic_id?: string
          appointment_date?: string
          follow_up_date?: string | null
          status?: "scheduled" | "completed" | "cancelled" | "no_show"
          treatment_type?: string | null
          notes?: string | null
          created_at?: string
        }
      }
      reminders: {
        Row: {
          id: string
          appointment_id: string
          reminder_type: "sms" | "whatsapp" | "email" | "call"
          scheduled_for: string
          sent_at: string | null
          status: "pending" | "sent" | "delivered" | "failed"
          message_content: string | null
          created_at: string
        }
        Insert: {
          id?: string
          appointment_id: string
          reminder_type: "sms" | "whatsapp" | "email" | "call"
          scheduled_for: string
          sent_at?: string | null
          status?: "pending" | "sent" | "delivered" | "failed"
          message_content?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          appointment_id?: string
          reminder_type?: "sms" | "whatsapp" | "email" | "call"
          scheduled_for?: string
          sent_at?: string | null
          status?: "pending" | "sent" | "delivered" | "failed"
          message_content?: string | null
          created_at?: string
        }
      }
    }
  }
}
