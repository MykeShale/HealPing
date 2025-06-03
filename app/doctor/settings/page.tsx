"use client"

import { useState } from "react"
import { DashboardWrapper } from "@/components/ui/dashboard-wrapper"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/auth-context"
import { Settings, Moon, Sun, Globe, Shield, Key, Save, Trash2, LogOut } from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"

export default function DoctorSettingsPage() {
  const { user, profile } = useAuth()
  const { toast } = useToast()

  const [settingsData, setSettingsData] = useState({
    appearance: {
      theme: "system",
      fontSize: "medium",
      reducedMotion: false,
      highContrast: false,
    },
    language: {
      preferred: "en",
      dateFormat: "MM/DD/YYYY",
      timeFormat: "12h",
    },
    privacy: {
      showOnlineStatus: true,
      allowDataCollection: true,
      allowProfileDiscovery: true,
    },
    notifications: {
      email: {
        appointments: true,
        reminders: true,
        messages: true,
        updates: false,
      },
      push: {
        appointments: true,
        reminders: true,
        messages: true,
        updates: false,
      },
    },
  })

  const handleAppearanceChange = (field: string, value: any) => {
    setSettingsData((prev) => ({
      ...prev,
      appearance: {
        ...prev.appearance,
        [field]: value,
      },
    }))
  }

  const handleLanguageChange = (field: string, value: string) => {
    setSettingsData((prev) => ({
      ...prev,
      language: {
        ...prev.language,
        [field]: value,
      },
    }))
  }

  const handlePrivacyChange = (field: string, value: boolean) => {
    setSettingsData((prev) => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [field]: value,
      },
    }))
  }

  const handleNotificationChange = (type: "email" | "push", field: string, value: boolean) => {
    setSettingsData((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: {
          ...prev.notifications[type],
          [field]: value,
        },
      },
    }))
  }

  const saveSettings = async () => {
    try {
      // Implementation for saving settings
      toast({
        title: "Success",
        description: "Settings updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive",
      })
    }
  }

  return (
    <DashboardWrapper requiredRole="doctor" title="Settings" description="Loading your settings...">
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
          >
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600">Customize your application preferences</p>
            </div>
            <div className="flex gap-3">
              <Button onClick={saveSettings} className="bg-blue-600 hover:bg-blue-700">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </motion.div>

          {/* Settings Content */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardHeader>
                <Tabs defaultValue="appearance">
                  <TabsList>
                    <TabsTrigger value="appearance">Appearance</TabsTrigger>
                    <TabsTrigger value="language">Language & Region</TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                    <TabsTrigger value="privacy">Privacy & Security</TabsTrigger>
                    <TabsTrigger value="account">Account</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              <CardContent>
                <TabsContent value="appearance" className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="theme">Theme</Label>
                      <div className="flex items-center space-x-2">
                        <Select
                          value={settingsData.appearance.theme}
                          onValueChange={(value) => handleAppearanceChange("theme", value)}
                        >
                          <SelectTrigger id="theme" className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="light">
                              <div className="flex items-center">
                                <Sun className="h-4 w-4 mr-2" />
                                Light
                              </div>
                            </SelectItem>
                            <SelectItem value="dark">
                              <div className="flex items-center">
                                <Moon className="h-4 w-4 mr-2" />
                                Dark
                              </div>
                            </SelectItem>
                            <SelectItem value="system">
                              <div className="flex items-center">
                                <Settings className="h-4 w-4 mr-2" />
                                System
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fontSize">Font Size</Label>
                      <Select
                        value={settingsData.appearance.fontSize}
                        onValueChange={(value) => handleAppearanceChange("fontSize", value)}
                      >
                        <SelectTrigger id="fontSize">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">Small</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="large">Large</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Reduced Motion</Label>
                        <p className="text-sm text-gray-500">Minimize animations</p>
                      </div>
                      <Switch
                        checked={settingsData.appearance.reducedMotion}
                        onCheckedChange={(checked) => handleAppearanceChange("reducedMotion", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">High Contrast</Label>
                        <p className="text-sm text-gray-500">Increase contrast for better visibility</p>
                      </div>
                      <Switch
                        checked={settingsData.appearance.highContrast}
                        onCheckedChange={(checked) => handleAppearanceChange("highContrast", checked)}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="language" className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <div className="flex items-center space-x-2">
                        <Globe className="h-4 w-4 text-gray-500" />
                        <Select
                          value={settingsData.language.preferred}
                          onValueChange={(value) => handleLanguageChange("preferred", value)}
                        >
                          <SelectTrigger id="language" className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Español</SelectItem>
                            <SelectItem value="fr">Français</SelectItem>
                            <SelectItem value="de">Deutsch</SelectItem>
                            <SelectItem value="zh">中文</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dateFormat">Date Format</Label>
                      <Select
                        value={settingsData.language.dateFormat}
                        onValueChange={(value) => handleLanguageChange("dateFormat", value)}
                      >
                        <SelectTrigger id="dateFormat">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                          <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                          <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timeFormat">Time Format</Label>
                      <Select
                        value={settingsData.language.timeFormat}
                        onValueChange={(value) => handleLanguageChange("timeFormat", value)}
                      >
                        <SelectTrigger id="timeFormat">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="12h">12-hour (1:30 PM)</SelectItem>
                          <SelectItem value="24h">24-hour (13:30)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="notifications" className="space-y-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Email Notifications</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-base">Appointments</Label>
                            <p className="text-sm text-gray-500">Notifications about new and updated appointments</p>
                          </div>
                          <Switch
                            checked={settingsData.notifications.email.appointments}
                            onCheckedChange={(checked) => handleNotificationChange("email", "appointments", checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-base">Reminders</Label>
                            <p className="text-sm text-gray-500">Reminders about upcoming appointments</p>
                          </div>
                          <Switch
                            checked={settingsData.notifications.email.reminders}
                            onCheckedChange={(checked) => handleNotificationChange("email", "reminders", checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-base">Messages</Label>
                            <p className="text-sm text-gray-500">Notifications about new messages</p>
                          </div>
                          <Switch
                            checked={settingsData.notifications.email.messages}
                            onCheckedChange={(checked) => handleNotificationChange("email", "messages", checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-base">System Updates</Label>
                            <p className="text-sm text-gray-500">Notifications about system updates and new features</p>
                          </div>
                          <Switch
                            checked={settingsData.notifications.email.updates}
                            onCheckedChange={(checked) => handleNotificationChange("email", "updates", checked)}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-4">Push Notifications</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-base">Appointments</Label>
                            <p className="text-sm text-gray-500">Notifications about new and updated appointments</p>
                          </div>
                          <Switch
                            checked={settingsData.notifications.push.appointments}
                            onCheckedChange={(checked) => handleNotificationChange("push", "appointments", checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-base">Reminders</Label>
                            <p className="text-sm text-gray-500">Reminders about upcoming appointments</p>
                          </div>
                          <Switch
                            checked={settingsData.notifications.push.reminders}
                            onCheckedChange={(checked) => handleNotificationChange("push", "reminders", checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-base">Messages</Label>
                            <p className="text-sm text-gray-500">Notifications about new messages</p>
                          </div>
                          <Switch
                            checked={settingsData.notifications.push.messages}
                            onCheckedChange={(checked) => handleNotificationChange("push", "messages", checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-base">System Updates</Label>
                            <p className="text-sm text-gray-500">Notifications about system updates and new features</p>
                          </div>
                          <Switch
                            checked={settingsData.notifications.push.updates}
                            onCheckedChange={(checked) => handleNotificationChange("push", "updates", checked)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="privacy" className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Show Online Status</Label>
                        <p className="text-sm text-gray-500">Allow others to see when you're online</p>
                      </div>
                      <Switch
                        checked={settingsData.privacy.showOnlineStatus}
                        onCheckedChange={(checked) => handlePrivacyChange("showOnlineStatus", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Allow Data Collection</Label>
                        <p className="text-sm text-gray-500">
                          Allow us to collect anonymous usage data to improve the service
                        </p>
                      </div>
                      <Switch
                        checked={settingsData.privacy.allowDataCollection}
                        onCheckedChange={(checked) => handlePrivacyChange("allowDataCollection", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Profile Discovery</Label>
                        <p className="text-sm text-gray-500">Allow patients to find your profile in search results</p>
                      </div>
                      <Switch
                        checked={settingsData.privacy.allowProfileDiscovery}
                        onCheckedChange={(checked) => handlePrivacyChange("allowProfileDiscovery", checked)}
                      />
                    </div>
                    <div className="pt-4 border-t">
                      <Button variant="outline" className="w-full">
                        <Shield className="h-4 w-4 mr-2" />
                        Privacy Policy
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="account" className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" value="sarah.johnson@example.com" disabled />
                    </div>
                    <div className="pt-4 border-t space-y-4">
                      <Button variant="outline" className="w-full">
                        <Key className="h-4 w-4 mr-2" />
                        Change Password
                      </Button>
                      <Button variant="outline" className="w-full">
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out of All Devices
                      </Button>
                      <Button variant="destructive" className="w-full">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Account
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
