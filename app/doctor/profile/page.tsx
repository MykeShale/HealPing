"use client"

import { useState } from "react"
import { DashboardWrapper } from "@/components/ui/dashboard-wrapper"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/lib/auth-context"
import { User, Mail, Phone, MapPin, Award, Clock, Shield, Key, Save, Upload, Trash2, Plus } from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"

export default function DoctorProfilePage() {
  const { user, profile } = useAuth()
  const { toast } = useToast()

  const [profileData, setProfileData] = useState({
    first_name: "Dr. Sarah",
    last_name: "Johnson",
    email: "sarah.johnson@example.com",
    phone: "+1-555-0123",
    specialization: "Cardiology",
    license_number: "MD12345678",
    years_of_experience: "15",
    education: "Harvard Medical School",
    bio: "Board-certified cardiologist with over 15 years of experience in treating cardiovascular diseases. Specializing in preventive cardiology and heart failure management.",
    address: "123 Medical Center Dr, Suite 456, Boston, MA 02115",
    profile_image: "/placeholder.svg",
    notification_preferences: {
      email_notifications: true,
      sms_notifications: true,
      appointment_reminders: true,
      system_updates: false,
    },
    security: {
      two_factor_auth: false,
      login_notifications: true,
    },
  })

  const [isEditing, setIsEditing] = useState(false)
  const [selectedTab, setSelectedTab] = useState("personal")

  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleNotificationChange = (field: string, value: boolean) => {
    setProfileData((prev) => ({
      ...prev,
      notification_preferences: {
        ...prev.notification_preferences,
        [field]: value,
      },
    }))
  }

  const handleSecurityChange = (field: string, value: boolean) => {
    setProfileData((prev) => ({
      ...prev,
      security: {
        ...prev.security,
        [field]: value,
      },
    }))
  }

  const saveProfile = async () => {
    try {
      // Implementation for saving profile
      toast({
        title: "Success",
        description: "Profile updated successfully",
      })
      setIsEditing(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      })
    }
  }

  return (
    <DashboardWrapper requiredRole="doctor" title="Doctor Profile" description="Loading your profile...">
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
          >
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Doctor Profile</h1>
              <p className="text-gray-600">Manage your personal and professional information</p>
            </div>
            <div className="flex gap-3">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={saveProfile} className="bg-blue-600 hover:bg-blue-700">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
              )}
            </div>
          </motion.div>

          {/* Profile Content */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardHeader>
                <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                  <TabsList>
                    <TabsTrigger value="personal">Personal Info</TabsTrigger>
                    <TabsTrigger value="professional">Professional Info</TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              <CardContent>
                <TabsContent value="personal" className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/3 flex flex-col items-center space-y-4">
                      <Avatar className="h-32 w-32">
                        <AvatarImage
                          src={profileData.profile_image || "/placeholder.svg"}
                          alt={`${profileData.first_name} ${profileData.last_name}`}
                        />
                        <AvatarFallback className="text-2xl bg-blue-100 text-blue-700">
                          {profileData.first_name[0]}
                          {profileData.last_name[0]}
                        </AvatarFallback>
                      </Avatar>
                      {isEditing && (
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Upload className="h-4 w-4 mr-2" />
                            Upload
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="md:w-2/3 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="first_name">First Name</Label>
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2 text-gray-500" />
                            <Input
                              id="first_name"
                              value={profileData.first_name}
                              onChange={(e) => handleInputChange("first_name", e.target.value)}
                              disabled={!isEditing}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="last_name">Last Name</Label>
                          <Input
                            id="last_name"
                            value={profileData.last_name}
                            onChange={(e) => handleInputChange("last_name", e.target.value)}
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-2 text-gray-500" />
                            <Input
                              id="email"
                              type="email"
                              value={profileData.email}
                              onChange={(e) => handleInputChange("email", e.target.value)}
                              disabled={!isEditing}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone</Label>
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-2 text-gray-500" />
                            <Input
                              id="phone"
                              value={profileData.phone}
                              onChange={(e) => handleInputChange("phone", e.target.value)}
                              disabled={!isEditing}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-gray-500 self-start mt-2" />
                          <Textarea
                            id="address"
                            value={profileData.address}
                            onChange={(e) => handleInputChange("address", e.target.value)}
                            disabled={!isEditing}
                            rows={2}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          value={profileData.bio}
                          onChange={(e) => handleInputChange("bio", e.target.value)}
                          disabled={!isEditing}
                          rows={4}
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="professional" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="specialization">Specialization</Label>
                        <div className="flex items-center">
                          <Award className="h-4 w-4 mr-2 text-gray-500" />
                          {isEditing ? (
                            <Select
                              value={profileData.specialization}
                              onValueChange={(value) => handleInputChange("specialization", value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Cardiology">Cardiology</SelectItem>
                                <SelectItem value="Dermatology">Dermatology</SelectItem>
                                <SelectItem value="Neurology">Neurology</SelectItem>
                                <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                                <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                                <SelectItem value="Psychiatry">Psychiatry</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <Input value={profileData.specialization} disabled />
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="license_number">License Number</Label>
                        <div className="flex items-center">
                          <Shield className="h-4 w-4 mr-2 text-gray-500" />
                          <Input
                            id="license_number"
                            value={profileData.license_number}
                            onChange={(e) => handleInputChange("license_number", e.target.value)}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="years_of_experience">Years of Experience</Label>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-gray-500" />
                          <Input
                            id="years_of_experience"
                            value={profileData.years_of_experience}
                            onChange={(e) => handleInputChange("years_of_experience", e.target.value)}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="education">Education</Label>
                        <Textarea
                          id="education"
                          value={profileData.education}
                          onChange={(e) => handleInputChange("education", e.target.value)}
                          disabled={!isEditing}
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Certifications</Label>
                        <div className="p-4 border rounded-md bg-gray-50">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">Board Certification in Cardiology</span>
                            <span className="text-sm text-gray-500">2015 - Present</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Advanced Cardiac Life Support</span>
                            <span className="text-sm text-gray-500">2018 - 2023</span>
                          </div>
                          {isEditing && (
                            <Button variant="outline" size="sm" className="mt-4 w-full">
                              <Plus className="h-4 w-4 mr-2" />
                              Add Certification
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="notifications" className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Email Notifications</Label>
                        <p className="text-sm text-gray-500">Receive notifications via email</p>
                      </div>
                      <Switch
                        checked={profileData.notification_preferences.email_notifications}
                        onCheckedChange={(checked) => handleNotificationChange("email_notifications", checked)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">SMS Notifications</Label>
                        <p className="text-sm text-gray-500">Receive notifications via text message</p>
                      </div>
                      <Switch
                        checked={profileData.notification_preferences.sms_notifications}
                        onCheckedChange={(checked) => handleNotificationChange("sms_notifications", checked)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Appointment Reminders</Label>
                        <p className="text-sm text-gray-500">Receive reminders about upcoming appointments</p>
                      </div>
                      <Switch
                        checked={profileData.notification_preferences.appointment_reminders}
                        onCheckedChange={(checked) => handleNotificationChange("appointment_reminders", checked)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">System Updates</Label>
                        <p className="text-sm text-gray-500">Receive notifications about system updates</p>
                      </div>
                      <Switch
                        checked={profileData.notification_preferences.system_updates}
                        onCheckedChange={(checked) => handleNotificationChange("system_updates", checked)}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="security" className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Two-Factor Authentication</Label>
                        <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                      </div>
                      <Switch
                        checked={profileData.security.two_factor_auth}
                        onCheckedChange={(checked) => handleSecurityChange("two_factor_auth", checked)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Login Notifications</Label>
                        <p className="text-sm text-gray-500">Receive notifications about new logins to your account</p>
                      </div>
                      <Switch
                        checked={profileData.security.login_notifications}
                        onCheckedChange={(checked) => handleSecurityChange("login_notifications", checked)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="pt-4 border-t">
                      <Button variant="outline" className="w-full">
                        <Key className="h-4 w-4 mr-2" />
                        Change Password
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </DashboardWrapper>
  )
}
