export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          role: "doctor" | "patient" | "admin"
          clinic_id: string | null
          first_name: string | null
          last_name: string | null
          avatar_url: string | null
          preferences: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          role: "doctor" | "patient" | "admin"
          clinic_id?: string | null
          first_name?: string | null
          last_name?: string | null
          avatar_url?: string | null
          preferences?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          role?: "doctor" | "patient" | "admin"
          clinic_id?: string | null
          first_name?: string | null
          last_name?: string | null
          avatar_url?: string | null
          preferences?: Json
          created_at?: string
          updated_at?: string
        }
      }
      clinics: {
        Row: {
          id: string
          name: string
          address: string | null
          phone: string | null
          email: string | null
          settings: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          address?: string | null
          phone?: string | null
          email?: string | null
          settings?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          address?: string | null
          phone?: string | null
          email?: string | null
          settings?: Json
          created_at?: string
          updated_at?: string
        }
      }
      patients: {
        Row: {
          id: string
          user_id: string | null
          clinic_id: string
          full_name: string
          phone: string
          email: string | null
          date_of_birth: string | null
          gender: string | null
          address: string | null
          medical_history: Json
          emergency_contact: Json
          insurance_info: Json
          communication_preferences: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          clinic_id: string
          full_name: string
          phone: string
          email?: string | null
          date_of_birth?: string | null
          gender?: string | null
          address?: string | null
          medical_history?: Json
          emergency_contact?: Json
          insurance_info?: Json
          communication_preferences?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          clinic_id?: string
          full_name?: string
          phone?: string
          email?: string | null
          date_of_birth?: string | null
          gender?: string | null
          address?: string | null
          medical_history?: Json
          emergency_contact?: Json
          insurance_info?: Json
          communication_preferences?: Json
          created_at?: string
          updated_at?: string
        }
      }
      doctors: {
        Row: {
          id: string
          profile_id: string | null
          clinic_id: string | null
          license_number: string | null
          specialization: string | null
          qualifications: string[] | null
          consultation_fee: number | null
          availability: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id?: string | null
          clinic_id?: string | null
          license_number?: string | null
          specialization?: string | null
          qualifications?: string[] | null
          consultation_fee?: number | null
          availability?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          profile_id?: string | null
          clinic_id?: string | null
          license_number?: string | null
          specialization?: string | null
          qualifications?: string[] | null
          consultation_fee?: number | null
          availability?: Json
          created_at?: string
          updated_at?: string
        }
      }
      appointments: {
        Row: {
          id: string
          patient_id: string | null
          doctor_id: string | null
          clinic_id: string | null
          appointment_date: string
          duration_minutes: number | null
          treatment_type: string | null
          notes: string | null
          status: string | null
          diagnosis: string | null
          prescription: string | null
          follow_up_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          patient_id?: string | null
          doctor_id?: string | null
          clinic_id?: string | null
          appointment_date: string
          duration_minutes?: number | null
          treatment_type?: string | null
          notes?: string | null
          status?: string | null
          diagnosis?: string | null
          prescription?: string | null
          follow_up_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          patient_id?: string | null
          doctor_id?: string | null
          clinic_id?: string | null
          appointment_date?: string
          duration_minutes?: number | null
          treatment_type?: string | null
          notes?: string | null
          status?: string | null
          diagnosis?: string | null
          prescription?: string | null
          follow_up_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      medical_records: {
        Row: {
          id: string
          patient_id: string | null
          appointment_id: string | null
          diagnosis: string | null
          treatment: string | null
          medications: Json
          notes: string | null
          attachments: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          patient_id?: string | null
          appointment_id?: string | null
          diagnosis?: string | null
          treatment?: string | null
          medications?: Json
          notes?: string | null
          attachments?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          patient_id?: string | null
          appointment_id?: string | null
          diagnosis?: string | null
          treatment?: string | null
          medications?: Json
          notes?: string | null
          attachments?: Json
          created_at?: string
          updated_at?: string
        }
      }
      reminders: {
        Row: {
          id: string
          patient_id: string | null
          appointment_id: string | null
          clinic_id: string | null
          reminder_type: string | null
          message_content: string | null
          scheduled_for: string | null
          sent_at: string | null
          status: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          patient_id?: string | null
          appointment_id?: string | null
          clinic_id?: string | null
          reminder_type?: string | null
          message_content?: string | null
          scheduled_for?: string | null
          sent_at?: string | null
          status?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          patient_id?: string | null
          appointment_id?: string | null
          clinic_id?: string | null
          reminder_type?: string | null
          message_content?: string | null
          scheduled_for?: string | null
          sent_at?: string | null
          status?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    ? (Database["public"]["Tables"] & Database["public"]["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never
