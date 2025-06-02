"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/lib/auth-context"
import { createPatient } from "@/lib/supabase-functions"
import { useToast } from "@/hooks/use-toast"
import { Loader2, UserPlus } from "lucide-react"

const patientSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  date_of_birth: z.string().optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  address: z.string().optional(),
  emergency_contact_name: z.string().optional(),
  emergency_contact_phone: z.string().optional(),
  insurance_provider: z.string().optional(),
  insurance_number: z.string().optional(),
  medical_conditions: z.string().optional(),
  allergies: z.string().optional(),
  current_medications: z.string().optional(),
})

type PatientFormData = z.infer<typeof patientSchema>

export function AddPatientForm({ onSuccess }: { onSuccess?: () => void }) {
  const { profile } = useAuth()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      full_name: "",
      phone: "",
      email: "",
      date_of_birth: "",
      address: "",
      emergency_contact_name: "",
      emergency_contact_phone: "",
      insurance_provider: "",
      insurance_number: "",
      medical_conditions: "",
      allergies: "",
      current_medications: "",
    },
  })

  const onSubmit = async (data: PatientFormData) => {
    if (!profile?.clinic_id) {
      toast({
        title: "Error",
        description: "No clinic associated with your account",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      // Prepare patient data with proper structure
      const patientData = {
        clinic_id: profile.clinic_id,
        full_name: data.full_name,
        phone: data.phone,
        email: data.email || undefined,
        date_of_birth: data.date_of_birth || undefined,
        gender: data.gender,
        address: data.address || undefined,
        medical_history: {
          conditions: data.medical_conditions || "",
          allergies: data.allergies || "",
          current_medications: data.current_medications || "",
        },
        emergency_contact: {
          name: data.emergency_contact_name || "",
          phone: data.emergency_contact_phone || "",
        },
        insurance_info: {
          provider: data.insurance_provider || "",
          number: data.insurance_number || "",
        },
        communication_preferences: {
          sms: true,
          email: !!data.email,
          whatsapp: false,
        },
      }

      await createPatient(patientData)

      toast({
        title: "Success",
        description: "Patient added successfully",
      })

      form.reset()
      onSuccess?.()
    } catch (error) {
      console.error("Error creating patient:", error)
      toast({
        title: "Error",
        description: "Failed to add patient. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Add New Patient
        </CardTitle>
        <CardDescription>Enter patient information to add them to your practice</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-medium mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name *</Label>
                <Input id="full_name" {...form.register("full_name")} placeholder="John Doe" />
                {form.formState.errors.full_name && (
                  <p className="text-sm text-red-600">{form.formState.errors.full_name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input id="phone" {...form.register("phone")} placeholder="+1-555-0123" />
                {form.formState.errors.phone && (
                  <p className="text-sm text-red-600">{form.formState.errors.phone.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...form.register("email")} placeholder="john@example.com" />
                {form.formState.errors.email && (
                  <p className="text-sm text-red-600">{form.formState.errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="date_of_birth">Date of Birth</Label>
                <Input id="date_of_birth" type="date" {...form.register("date_of_birth")} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select onValueChange={(value) => form.setValue("gender", value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2 mt-4">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                {...form.register("address")}
                placeholder="123 Main St, City, State 12345"
                rows={2}
              />
            </div>
          </div>

          {/* Emergency Contact */}
          <div>
            <h3 className="text-lg font-medium mb-4">Emergency Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emergency_contact_name">Contact Name</Label>
                <Input
                  id="emergency_contact_name"
                  {...form.register("emergency_contact_name")}
                  placeholder="Jane Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergency_contact_phone">Contact Phone</Label>
                <Input
                  id="emergency_contact_phone"
                  {...form.register("emergency_contact_phone")}
                  placeholder="+1-555-0124"
                />
              </div>
            </div>
          </div>

          {/* Insurance Information */}
          <div>
            <h3 className="text-lg font-medium mb-4">Insurance Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="insurance_provider">Insurance Provider</Label>
                <Input
                  id="insurance_provider"
                  {...form.register("insurance_provider")}
                  placeholder="Blue Cross Blue Shield"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="insurance_number">Insurance Number</Label>
                <Input id="insurance_number" {...form.register("insurance_number")} placeholder="ABC123456789" />
              </div>
            </div>
          </div>

          {/* Medical History */}
          <div>
            <h3 className="text-lg font-medium mb-4">Medical History</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="medical_conditions">Medical Conditions</Label>
                <Textarea
                  id="medical_conditions"
                  {...form.register("medical_conditions")}
                  placeholder="Diabetes, Hypertension, etc."
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="allergies">Allergies</Label>
                <Textarea
                  id="allergies"
                  {...form.register("allergies")}
                  placeholder="Penicillin, Peanuts, etc."
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="current_medications">Current Medications</Label>
                <Textarea
                  id="current_medications"
                  {...form.register("current_medications")}
                  placeholder="Metformin 500mg, Lisinopril 10mg, etc."
                  rows={2}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => form.reset()} disabled={isSubmitting}>
              Reset
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Patient
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
