"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Heart, UserCheck, Stethoscope, User, AlertCircle } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface RoleSelectionProps {
  userId: string
  userEmail: string
  fullName?: string
  onComplete: () => void
}

export function RoleSelection({ userId, userEmail, fullName, onComplete }: RoleSelectionProps) {
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState<"doctor" | "patient" | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    firstName: fullName?.split(" ")[0] || "",
    lastName: fullName?.split(" ").slice(1).join(" ") || "",
    phone: "",
    specialization: "",
    licenseNumber: "",
    bio: "",
    dateOfBirth: "",
    address: "",
    emergencyContact: "",
  })

  const handleRoleSelect = (role: "doctor" | "patient") => {
    setSelectedRole(role)
    setError(null)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    if (!selectedRole) {
      setError("Please select a role")
      return
    }

    if (!formData.firstName || !formData.lastName) {
      setError("Please enter your first and last name")
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Create profile
      const { error: profileError } = await supabase.from("profiles").insert({
        id: userId,
        email: userEmail,
        role: selectedRole,
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone || null,
        avatar_url: null,
        preferences: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

      if (profileError) throw profileError

      // Get default clinic for doctors
      let clinicId = null
      if (selectedRole === "doctor") {
        const { data: clinic } = await supabase
          .from("clinics")
          .select("id")
          .eq("name", "Default Medical Practice")
          .single()

        clinicId = clinic?.id || null
      }

      // Create role-specific record
      if (selectedRole === "doctor") {
        const { error: doctorError } = await supabase.from("doctors").insert({
          profile_id: userId,
          clinic_id: clinicId,
          specialization: formData.specialization || "General Practice",
          license_number: formData.licenseNumber || null,
          qualifications: [],
          consultation_fee: 0,
          availability: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })

        if (doctorError) throw doctorError
      } else if (selectedRole === "patient") {
        const { error: patientError } = await supabase.from("patients").insert({
          profile_id: userId,
          clinic_id: clinicId,
          date_of_birth: formData.dateOfBirth || null,
          address: formData.address || null,
          emergency_contact: formData.emergencyContact || null,
          medical_history: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })

        if (patientError) throw patientError
      }

      // Update profile with clinic_id if we have one
      if (clinicId) {
        await supabase.from("profiles").update({ clinic_id: clinicId }).eq("id", userId)
      }

      onComplete()
    } catch (error: any) {
      console.error("Error creating profile:", error)
      setError(error.message || "Failed to create profile. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Heart className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">HealPing</span>
            </div>
            <CardTitle className="text-2xl font-bold">Complete Your Profile</CardTitle>
            <CardDescription>Tell us about yourself to personalize your HealPing experience</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            {/* Role Selection */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">I am a:</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    selectedRole === "doctor" ? "ring-2 ring-blue-500 bg-blue-50" : "hover:bg-gray-50"
                  }`}
                  onClick={() => handleRoleSelect("doctor")}
                >
                  <CardContent className="p-6 text-center">
                    <Stethoscope className="h-12 w-12 mx-auto mb-3 text-blue-600" />
                    <h3 className="font-semibold text-lg">Healthcare Provider</h3>
                    <p className="text-sm text-gray-600 mt-1">Doctor, Nurse, or Medical Professional</p>
                  </CardContent>
                </Card>

                <Card
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    selectedRole === "patient" ? "ring-2 ring-green-500 bg-green-50" : "hover:bg-gray-50"
                  }`}
                  onClick={() => handleRoleSelect("patient")}
                >
                  <CardContent className="p-6 text-center">
                    <User className="h-12 w-12 mx-auto mb-3 text-green-600" />
                    <h3 className="font-semibold text-lg">Patient</h3>
                    <p className="text-sm text-gray-600 mt-1">Seeking healthcare services</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Personal Information */}
            {selectedRole && (
              <div className="space-y-4">
                <Label className="text-base font-semibold">Personal Information</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      placeholder="John"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      placeholder="Smith"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                {/* Role-specific fields */}
                {selectedRole === "doctor" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="specialization">Specialization</Label>
                      <Input
                        id="specialization"
                        value={formData.specialization}
                        onChange={(e) => handleInputChange("specialization", e.target.value)}
                        placeholder="e.g., Cardiology, General Practice"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="licenseNumber">License Number</Label>
                      <Input
                        id="licenseNumber"
                        value={formData.licenseNumber}
                        onChange={(e) => handleInputChange("licenseNumber", e.target.value)}
                        placeholder="Medical license number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Professional Bio</Label>
                      <Textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e) => handleInputChange("bio", e.target.value)}
                        placeholder="Brief description of your experience and expertise"
                        rows={3}
                      />
                    </div>
                  </>
                )}

                {selectedRole === "patient" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Textarea
                        id="address"
                        value={formData.address}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                        placeholder="Your home address"
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergencyContact">Emergency Contact</Label>
                      <Input
                        id="emergencyContact"
                        value={formData.emergencyContact}
                        onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                        placeholder="Name and phone number"
                      />
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={!selectedRole || loading}
              className="w-full h-12 text-base font-medium"
            >
              {loading ? <LoadingSpinner size="sm" className="mr-2" /> : <UserCheck className="h-5 w-5 mr-2" />}
              Complete Setup
            </Button>

            <div className="text-center">
              <p className="text-xs text-gray-600">You can update this information later in your profile settings</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
