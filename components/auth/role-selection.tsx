"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { User, Stethoscope, Building, GraduationCap } from "lucide-react"
import { motion } from "framer-motion"

interface RoleSelectionProps {
  userId: string
  userEmail: string
  onComplete: () => void
}

export function RoleSelection({ userId, userEmail, onComplete }: RoleSelectionProps) {
  const [selectedRole, setSelectedRole] = useState<"doctor" | "patient" | null>(null)
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  // Common profile data
  const [profileData, setProfileData] = useState({
    full_name: "",
    phone: "",
  })

  // Doctor-specific data
  const [doctorData, setDoctorData] = useState({
    license_number: "",
    specialization: "",
    qualifications: "",
    consultation_fee: "",
    clinic_name: "",
    clinic_address: "",
    clinic_phone: "",
  })

  // Patient-specific data
  const [patientData, setPatientData] = useState({
    date_of_birth: "",
    gender: "",
    address: "",
    emergency_contact_name: "",
    emergency_contact_phone: "",
    allergies: "",
    medications: "",
  })

  const handleRoleSelect = (role: "doctor" | "patient") => {
    setSelectedRole(role)
    setStep(2)
  }

  const handleSubmit = async () => {
    if (!selectedRole || !profileData.full_name) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      // Create clinic first if doctor
      let clinicId = null
      if (selectedRole === "doctor") {
        const { data: clinic, error: clinicError } = await supabase
          .from("clinics")
          .insert({
            name: doctorData.clinic_name,
            address: doctorData.clinic_address,
            phone: doctorData.clinic_phone,
            email: userEmail,
          })
          .select()
          .single()

        if (clinicError) throw clinicError
        clinicId = clinic.id
      }

      // Create profile
      const { error: profileError } = await supabase.from("profiles").insert({
        id: userId,
        role: selectedRole,
        full_name: profileData.full_name,
        phone: profileData.phone,
        clinic_id: clinicId,
      })

      if (profileError) throw profileError

      // Create role-specific records
      if (selectedRole === "doctor") {
        const { error: doctorError } = await supabase.from("doctors").insert({
          profile_id: userId,
          clinic_id: clinicId,
          license_number: doctorData.license_number,
          specialization: doctorData.specialization,
          qualifications: doctorData.qualifications.split(",").map((q) => q.trim()),
          consultation_fee: Number.parseFloat(doctorData.consultation_fee) || 0,
        })

        if (doctorError) throw doctorError
      } else {
        // For patients, we'll create the patient record when they're added by a doctor
        // For now, just update preferences
        const { error: updateError } = await supabase
          .from("profiles")
          .update({
            preferences: {
              date_of_birth: patientData.date_of_birth,
              gender: patientData.gender,
              address: patientData.address,
              emergency_contact: {
                name: patientData.emergency_contact_name,
                phone: patientData.emergency_contact_phone,
              },
              medical_info: {
                allergies: patientData.allergies
                  .split(",")
                  .map((a) => a.trim())
                  .filter(Boolean),
                medications: patientData.medications
                  .split(",")
                  .map((m) => m.trim())
                  .filter(Boolean),
              },
            },
          })
          .eq("id", userId)

        if (updateError) throw updateError
      }

      toast({
        title: "Success",
        description: "Your account has been set up successfully!",
      })

      onComplete()
    } catch (error: any) {
      console.error("Error setting up account:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to set up account",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to HealPing!</h1>
            <p className="text-gray-600">Let's set up your account. Are you a healthcare provider or a patient?</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Doctor Option */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Card
                className="cursor-pointer border-2 hover:border-blue-300 hover:shadow-lg transition-all"
                onClick={() => handleRoleSelect("doctor")}
              >
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Stethoscope className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">Healthcare Provider</CardTitle>
                  <CardDescription>I'm a doctor, nurse, or healthcare professional</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                      Manage patient appointments
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                      Send automated reminders
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                      Track patient records
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                      Analytics and insights
                    </li>
                  </ul>
                  <Badge className="w-full justify-center mt-4 bg-blue-600">Choose This Option</Badge>
                </CardContent>
              </Card>
            </motion.div>

            {/* Patient Option */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Card
                className="cursor-pointer border-2 hover:border-green-300 hover:shadow-lg transition-all"
                onClick={() => handleRoleSelect("patient")}
              >
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="h-8 w-8 text-green-600" />
                  </div>
                  <CardTitle className="text-xl">Patient</CardTitle>
                  <CardDescription>I'm seeking healthcare services</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                      View my appointments
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                      Receive appointment reminders
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                      Access medical records
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                      Communicate with providers
                    </li>
                  </ul>
                  <Badge className="w-full justify-center mt-4 bg-green-600">Choose This Option</Badge>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl w-full">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {selectedRole === "doctor" ? (
                <Stethoscope className="h-6 w-6 text-blue-600" />
              ) : (
                <User className="h-6 w-6 text-green-600" />
              )}
              Complete Your {selectedRole === "doctor" ? "Healthcare Provider" : "Patient"} Profile
            </CardTitle>
            <CardDescription>Please provide the following information to set up your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Common Fields */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name *</Label>
                  <Input
                    id="full_name"
                    value={profileData.full_name}
                    onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    placeholder="+1-555-0123"
                  />
                </div>
              </div>
            </div>

            {/* Doctor-specific fields */}
            {selectedRole === "doctor" && (
              <>
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900 flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    Professional Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="license_number">Medical License Number</Label>
                      <Input
                        id="license_number"
                        value={doctorData.license_number}
                        onChange={(e) => setDoctorData({ ...doctorData, license_number: e.target.value })}
                        placeholder="License number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="specialization">Specialization</Label>
                      <Input
                        id="specialization"
                        value={doctorData.specialization}
                        onChange={(e) => setDoctorData({ ...doctorData, specialization: e.target.value })}
                        placeholder="e.g., Cardiology, Family Medicine"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="qualifications">Qualifications</Label>
                      <Input
                        id="qualifications"
                        value={doctorData.qualifications}
                        onChange={(e) => setDoctorData({ ...doctorData, qualifications: e.target.value })}
                        placeholder="MD, MBBS, etc. (comma separated)"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="consultation_fee">Consultation Fee ($)</Label>
                      <Input
                        id="consultation_fee"
                        type="number"
                        value={doctorData.consultation_fee}
                        onChange={(e) => setDoctorData({ ...doctorData, consultation_fee: e.target.value })}
                        placeholder="100"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900 flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    Clinic Information
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="clinic_name">Clinic/Practice Name *</Label>
                      <Input
                        id="clinic_name"
                        value={doctorData.clinic_name}
                        onChange={(e) => setDoctorData({ ...doctorData, clinic_name: e.target.value })}
                        placeholder="Your clinic or practice name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="clinic_address">Clinic Address</Label>
                      <Textarea
                        id="clinic_address"
                        value={doctorData.clinic_address}
                        onChange={(e) => setDoctorData({ ...doctorData, clinic_address: e.target.value })}
                        placeholder="Full clinic address"
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="clinic_phone">Clinic Phone</Label>
                      <Input
                        id="clinic_phone"
                        value={doctorData.clinic_phone}
                        onChange={(e) => setDoctorData({ ...doctorData, clinic_phone: e.target.value })}
                        placeholder="+1-555-0123"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Patient-specific fields */}
            {selectedRole === "patient" && (
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date_of_birth">Date of Birth</Label>
                    <Input
                      id="date_of_birth"
                      type="date"
                      value={patientData.date_of_birth}
                      onChange={(e) => setPatientData({ ...patientData, date_of_birth: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select onValueChange={(value) => setPatientData({ ...patientData, gender: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={patientData.address}
                    onChange={(e) => setPatientData({ ...patientData, address: e.target.value })}
                    placeholder="Your home address"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emergency_contact_name">Emergency Contact Name</Label>
                    <Input
                      id="emergency_contact_name"
                      value={patientData.emergency_contact_name}
                      onChange={(e) => setPatientData({ ...patientData, emergency_contact_name: e.target.value })}
                      placeholder="Contact person name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergency_contact_phone">Emergency Contact Phone</Label>
                    <Input
                      id="emergency_contact_phone"
                      value={patientData.emergency_contact_phone}
                      onChange={(e) => setPatientData({ ...patientData, emergency_contact_phone: e.target.value })}
                      placeholder="+1-555-0123"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="allergies">Known Allergies</Label>
                    <Input
                      id="allergies"
                      value={patientData.allergies}
                      onChange={(e) => setPatientData({ ...patientData, allergies: e.target.value })}
                      placeholder="Penicillin, Peanuts, etc. (comma separated)"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="medications">Current Medications</Label>
                    <Input
                      id="medications"
                      value={patientData.medications}
                      onChange={(e) => setPatientData({ ...patientData, medications: e.target.value })}
                      placeholder="Current medications (comma separated)"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                Back
              </Button>
              <Button onClick={handleSubmit} disabled={loading} className="flex-1">
                {loading ? "Setting up..." : "Complete Setup"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
