"use client"

import { useState } from "react"
import { DashboardWrapper } from "@/components/ui/dashboard-wrapper"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useAuth } from "@/lib/auth-context"
import { Clock, Calendar, Settings, Save, Coffee, Pause, Play } from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"

interface TimeSlot {
  id: string
  day: string
  start_time: string
  end_time: string
  is_available: boolean
  slot_duration: number
  break_duration: number
}

interface ScheduleSettings {
  consultation_duration: number
  break_duration: number
  lunch_break_start: string
  lunch_break_end: string
  max_patients_per_day: number
  advance_booking_days: number
  emergency_slots: number
}

export default function DoctorSchedulePage() {
  const { profile } = useAuth()
  const { toast } = useToast()

  const [scheduleSettings, setScheduleSettings] = useState<ScheduleSettings>({
    consultation_duration: 30,
    break_duration: 15,
    lunch_break_start: "12:00",
    lunch_break_end: "13:00",
    max_patients_per_day: 20,
    advance_booking_days: 30,
    emergency_slots: 2,
  })

  const [weeklySchedule, setWeeklySchedule] = useState<TimeSlot[]>([
    {
      id: "1",
      day: "Monday",
      start_time: "09:00",
      end_time: "17:00",
      is_available: true,
      slot_duration: 30,
      break_duration: 15,
    },
    {
      id: "2",
      day: "Tuesday",
      start_time: "09:00",
      end_time: "17:00",
      is_available: true,
      slot_duration: 30,
      break_duration: 15,
    },
    {
      id: "3",
      day: "Wednesday",
      start_time: "09:00",
      end_time: "17:00",
      is_available: true,
      slot_duration: 30,
      break_duration: 15,
    },
    {
      id: "4",
      day: "Thursday",
      start_time: "09:00",
      end_time: "17:00",
      is_available: true,
      slot_duration: 30,
      break_duration: 15,
    },
    {
      id: "5",
      day: "Friday",
      start_time: "09:00",
      end_time: "17:00",
      is_available: true,
      slot_duration: 30,
      break_duration: 15,
    },
    {
      id: "6",
      day: "Saturday",
      start_time: "09:00",
      end_time: "13:00",
      is_available: true,
      slot_duration: 30,
      break_duration: 15,
    },
    {
      id: "7",
      day: "Sunday",
      start_time: "09:00",
      end_time: "13:00",
      is_available: false,
      slot_duration: 30,
      break_duration: 15,
    },
  ])

  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isBlockTimeOpen, setIsBlockTimeOpen] = useState(false)
  const [blockTimeData, setBlockTimeData] = useState({
    date: "",
    start_time: "",
    end_time: "",
    reason: "",
    recurring: false,
  })

  const updateScheduleSlot = (id: string, updates: Partial<TimeSlot>) => {
    setWeeklySchedule((prev) => prev.map((slot) => (slot.id === id ? { ...slot, ...updates } : slot)))
  }

  const saveSchedule = async () => {
    try {
      // Implementation for saving schedule
      toast({
        title: "Success",
        description: "Schedule updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update schedule",
        variant: "destructive",
      })
    }
  }

  const blockTime = async () => {
    try {
      // Implementation for blocking time
      toast({
        title: "Success",
        description: "Time blocked successfully",
      })
      setIsBlockTimeOpen(false)
      setBlockTimeData({
        date: "",
        start_time: "",
        end_time: "",
        reason: "",
        recurring: false,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to block time",
        variant: "destructive",
      })
    }
  }

  const calculateAvailableSlots = (slot: TimeSlot) => {
    if (!slot.is_available) return 0
    const start = new Date(`2000-01-01T${slot.start_time}`)
    const end = new Date(`2000-01-01T${slot.end_time}`)
    const totalMinutes = (end.getTime() - start.getTime()) / (1000 * 60)
    const lunchBreakMinutes = 60 // 1 hour lunch break
    const availableMinutes = totalMinutes - lunchBreakMinutes
    return Math.floor(availableMinutes / slot.slot_duration)
  }

  return (
    <DashboardWrapper requiredRole="doctor" title="Schedule Management" description="Loading your schedule...">
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
          >
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Schedule Management</h1>
              <p className="text-gray-600">Manage your availability and appointment slots</p>
            </div>
            <div className="flex gap-3">
              <Dialog open={isBlockTimeOpen} onOpenChange={setIsBlockTimeOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Pause className="h-4 w-4 mr-2" />
                    Block Time
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Block Time Slot</DialogTitle>
                    <DialogDescription>Block specific time slots for breaks or personal time</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Date</Label>
                        <Input
                          type="date"
                          value={blockTimeData.date}
                          onChange={(e) => setBlockTimeData({ ...blockTimeData, date: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Reason</Label>
                        <Select
                          value={blockTimeData.reason}
                          onValueChange={(value) => setBlockTimeData({ ...blockTimeData, reason: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select reason" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="personal">Personal Time</SelectItem>
                            <SelectItem value="meeting">Meeting</SelectItem>
                            <SelectItem value="emergency">Emergency</SelectItem>
                            <SelectItem value="vacation">Vacation</SelectItem>
                            <SelectItem value="training">Training</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Start Time</Label>
                        <Input
                          type="time"
                          value={blockTimeData.start_time}
                          onChange={(e) => setBlockTimeData({ ...blockTimeData, start_time: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>End Time</Label>
                        <Input
                          type="time"
                          value={blockTimeData.end_time}
                          onChange={(e) => setBlockTimeData({ ...blockTimeData, end_time: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="recurring"
                        checked={blockTimeData.recurring}
                        onCheckedChange={(checked) => setBlockTimeData({ ...blockTimeData, recurring: checked })}
                      />
                      <Label htmlFor="recurring">Recurring weekly</Label>
                    </div>
                    <div className="flex justify-end gap-3">
                      <Button variant="outline" onClick={() => setIsBlockTimeOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={blockTime}>Block Time</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Schedule Settings</DialogTitle>
                    <DialogDescription>Configure your default schedule preferences</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Default Consultation Duration (minutes)</Label>
                        <Select
                          value={scheduleSettings.consultation_duration.toString()}
                          onValueChange={(value) =>
                            setScheduleSettings((prev) => ({ ...prev, consultation_duration: Number.parseInt(value) }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="15">15 minutes</SelectItem>
                            <SelectItem value="30">30 minutes</SelectItem>
                            <SelectItem value="45">45 minutes</SelectItem>
                            <SelectItem value="60">60 minutes</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Break Duration (minutes)</Label>
                        <Select
                          value={scheduleSettings.break_duration.toString()}
                          onValueChange={(value) =>
                            setScheduleSettings((prev) => ({ ...prev, break_duration: Number.parseInt(value) }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5">5 minutes</SelectItem>
                            <SelectItem value="10">10 minutes</SelectItem>
                            <SelectItem value="15">15 minutes</SelectItem>
                            <SelectItem value="30">30 minutes</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Lunch Break Start</Label>
                        <Input
                          type="time"
                          value={scheduleSettings.lunch_break_start}
                          onChange={(e) =>
                            setScheduleSettings((prev) => ({ ...prev, lunch_break_start: e.target.value }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Lunch Break End</Label>
                        <Input
                          type="time"
                          value={scheduleSettings.lunch_break_end}
                          onChange={(e) =>
                            setScheduleSettings((prev) => ({ ...prev, lunch_break_end: e.target.value }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Max Patients Per Day</Label>
                        <Input
                          type="number"
                          value={scheduleSettings.max_patients_per_day}
                          onChange={(e) =>
                            setScheduleSettings((prev) => ({
                              ...prev,
                              max_patients_per_day: Number.parseInt(e.target.value),
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Advance Booking (days)</Label>
                        <Input
                          type="number"
                          value={scheduleSettings.advance_booking_days}
                          onChange={(e) =>
                            setScheduleSettings((prev) => ({
                              ...prev,
                              advance_booking_days: Number.parseInt(e.target.value),
                            }))
                          }
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-3">
                      <Button variant="outline" onClick={() => setIsSettingsOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => setIsSettingsOpen(false)}>Save Settings</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Button onClick={saveSchedule} className="bg-blue-600 hover:bg-blue-700">
                <Save className="h-4 w-4 mr-2" />
                Save Schedule
              </Button>
            </div>
          </motion.div>

          {/* Statistics Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6"
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Working Days</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {weeklySchedule.filter((slot) => slot.is_available).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Weekly Slots</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {weeklySchedule.reduce((total, slot) => total + calculateAvailableSlots(slot), 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Coffee className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg. Duration</p>
                    <p className="text-2xl font-bold text-gray-900">{scheduleSettings.consultation_duration}min</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Play className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Emergency Slots</p>
                    <p className="text-2xl font-bold text-gray-900">{scheduleSettings.emergency_slots}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Weekly Schedule */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardHeader>
                <CardTitle>Weekly Schedule</CardTitle>
                <CardDescription>Configure your availability for each day of the week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {weeklySchedule.map((slot) => (
                    <div key={slot.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-20">
                          <Badge variant={slot.is_available ? "default" : "secondary"}>{slot.day}</Badge>
                        </div>
                        <Switch
                          checked={slot.is_available}
                          onCheckedChange={(checked) => updateScheduleSlot(slot.id, { is_available: checked })}
                        />
                      </div>

                      {slot.is_available && (
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <Label className="text-sm">Start:</Label>
                            <Input
                              type="time"
                              value={slot.start_time}
                              onChange={(e) => updateScheduleSlot(slot.id, { start_time: e.target.value })}
                              className="w-24"
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <Label className="text-sm">End:</Label>
                            <Input
                              type="time"
                              value={slot.end_time}
                              onChange={(e) => updateScheduleSlot(slot.id, { end_time: e.target.value })}
                              className="w-24"
                            />
                          </div>
                          <div className="text-sm text-gray-600">{calculateAvailableSlots(slot)} slots</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </DashboardWrapper>
  )
}
