"use client"

import { useState } from "react"
import { DashboardWrapper } from "@/components/ui/dashboard-wrapper"
import { useDashboardData } from "@/hooks/use-dashboard-data"
import { getPatients } from "@/lib/supabase-functions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/lib/auth-context"
import { Search, Plus, FileText, Download, Calendar, User, Stethoscope, Pill, Eye, Edit } from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"

interface MedicalRecord {
  id: string
  patient_id: string
  appointment_id: string
  diagnosis: string
  treatment: string
  medications: any[]
  notes: string
  created_at: string
  patient: {
    full_name: string
    phone: string
    email: string
  }
  appointment: {
    appointment_date: string
    treatment_type: string
  }
}

export default function DoctorRecordsPage() {
  const { profile } = useAuth()
  const { toast } = useToast()

  const {
    data: patients,
    loading,
    error,
    refetch,
  } = useDashboardData({
    fetchFunction: getPatients,
    fallbackData: [],
  })

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPatient, setSelectedPatient] = useState<any>(null)
  const [isAddRecordOpen, setIsAddRecordOpen] = useState(false)
  const [newRecord, setNewRecord] = useState({
    patient_id: "",
    diagnosis: "",
    treatment: "",
    medications: "",
    notes: "",
    vital_signs: {
      blood_pressure: "",
      heart_rate: "",
      temperature: "",
      weight: "",
      height: "",
    },
  })

  // Mock medical records data
  const medicalRecords: MedicalRecord[] = [
    {
      id: "1",
      patient_id: "p1",
      appointment_id: "a1",
      diagnosis: "Hypertension",
      treatment: "Lifestyle changes and medication",
      medications: [
        { name: "Lisinopril", dosage: "10mg", frequency: "Once daily" },
        { name: "Hydrochlorothiazide", dosage: "25mg", frequency: "Once daily" },
      ],
      notes: "Patient shows good response to treatment. Blood pressure improving.",
      created_at: new Date().toISOString(),
      patient: {
        full_name: "John Doe",
        phone: "+1-555-0123",
        email: "john@example.com",
      },
      appointment: {
        appointment_date: new Date().toISOString(),
        treatment_type: "Follow-up",
      },
    },
    {
      id: "2",
      patient_id: "p2",
      appointment_id: "a2",
      diagnosis: "Type 2 Diabetes",
      treatment: "Metformin therapy and dietary counseling",
      medications: [{ name: "Metformin", dosage: "500mg", frequency: "Twice daily" }],
      notes: "HbA1c levels improving. Continue current treatment plan.",
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      patient: {
        full_name: "Jane Smith",
        phone: "+1-555-0124",
        email: "jane@example.com",
      },
      appointment: {
        appointment_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        treatment_type: "Consultation",
      },
    },
  ]

  const filteredRecords = medicalRecords.filter(
    (record) =>
      record.patient.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddRecord = async () => {
    try {
      // Implementation for adding medical record
      toast({
        title: "Success",
        description: "Medical record added successfully",
      })
      setIsAddRecordOpen(false)
      setNewRecord({
        patient_id: "",
        diagnosis: "",
        treatment: "",
        medications: "",
        notes: "",
        vital_signs: {
          blood_pressure: "",
          heart_rate: "",
          temperature: "",
          weight: "",
          height: "",
        },
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add medical record",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <DashboardWrapper requiredRole="doctor" title="Medical Records" description="Loading medical records...">
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
          >
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Medical Records</h1>
              <p className="text-gray-600">Manage patient medical records and treatment history</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Records
              </Button>
              <Dialog open={isAddRecordOpen} onOpenChange={setIsAddRecordOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Record
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add Medical Record</DialogTitle>
                    <DialogDescription>Create a new medical record for a patient</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Patient *</Label>
                        <Select
                          value={newRecord.patient_id}
                          onValueChange={(value) => setNewRecord({ ...newRecord, patient_id: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select patient" />
                          </SelectTrigger>
                          <SelectContent>
                            {patients.map((patient) => (
                              <SelectItem key={patient.id} value={patient.id}>
                                {patient.full_name} - {patient.phone}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Diagnosis *</Label>
                        <Input
                          value={newRecord.diagnosis}
                          onChange={(e) => setNewRecord({ ...newRecord, diagnosis: e.target.value })}
                          placeholder="Primary diagnosis"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Treatment Plan</Label>
                      <Textarea
                        value={newRecord.treatment}
                        onChange={(e) => setNewRecord({ ...newRecord, treatment: e.target.value })}
                        placeholder="Describe the treatment plan..."
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Medications</Label>
                      <Textarea
                        value={newRecord.medications}
                        onChange={(e) => setNewRecord({ ...newRecord, medications: e.target.value })}
                        placeholder="List medications, dosages, and frequencies..."
                        rows={3}
                      />
                    </div>

                    <div className="space-y-4">
                      <Label className="text-base font-medium">Vital Signs</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Blood Pressure</Label>
                          <Input
                            value={newRecord.vital_signs.blood_pressure}
                            onChange={(e) =>
                              setNewRecord({
                                ...newRecord,
                                vital_signs: { ...newRecord.vital_signs, blood_pressure: e.target.value },
                              })
                            }
                            placeholder="120/80"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Heart Rate</Label>
                          <Input
                            value={newRecord.vital_signs.heart_rate}
                            onChange={(e) =>
                              setNewRecord({
                                ...newRecord,
                                vital_signs: { ...newRecord.vital_signs, heart_rate: e.target.value },
                              })
                            }
                            placeholder="72 bpm"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Temperature</Label>
                          <Input
                            value={newRecord.vital_signs.temperature}
                            onChange={(e) =>
                              setNewRecord({
                                ...newRecord,
                                vital_signs: { ...newRecord.vital_signs, temperature: e.target.value },
                              })
                            }
                            placeholder="98.6°F"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Weight</Label>
                          <Input
                            value={newRecord.vital_signs.weight}
                            onChange={(e) =>
                              setNewRecord({
                                ...newRecord,
                                vital_signs: { ...newRecord.vital_signs, weight: e.target.value },
                              })
                            }
                            placeholder="70 kg"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Height</Label>
                          <Input
                            value={newRecord.vital_signs.height}
                            onChange={(e) =>
                              setNewRecord({
                                ...newRecord,
                                vital_signs: { ...newRecord.vital_signs, height: e.target.value },
                              })
                            }
                            placeholder="175 cm"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Additional Notes</Label>
                      <Textarea
                        value={newRecord.notes}
                        onChange={(e) => setNewRecord({ ...newRecord, notes: e.target.value })}
                        placeholder="Additional observations, recommendations, or notes..."
                        rows={4}
                      />
                    </div>

                    <div className="flex justify-end gap-3">
                      <Button variant="outline" onClick={() => setIsAddRecordOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddRecord}>Save Record</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
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
                  <FileText className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Records</p>
                    <p className="text-2xl font-bold text-gray-900">{medicalRecords.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">This Week</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {
                        medicalRecords.filter(
                          (r) => new Date(r.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                        ).length
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Stethoscope className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Diagnoses</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {new Set(medicalRecords.map((r) => r.diagnosis)).size}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Patients</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {new Set(medicalRecords.map((r) => r.patient_id)).size}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search records by patient name or diagnosis..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </motion.div>

          {/* Records List */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card>
              <CardHeader>
                <CardTitle>Medical Records ({filteredRecords.length})</CardTitle>
                <CardDescription>Complete medical history and treatment records</CardDescription>
              </CardHeader>
              <CardContent>
                {filteredRecords.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50 text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No records found</h3>
                    <p className="text-gray-600 mb-4">
                      {searchTerm ? "Try adjusting your search terms" : "Start by adding your first medical record"}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Patient</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Diagnosis</TableHead>
                          <TableHead>Treatment</TableHead>
                          <TableHead>Medications</TableHead>
                          <TableHead className="w-[100px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredRecords.map((record) => (
                          <TableRow key={record.id} className="hover:bg-gray-50">
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src="/placeholder.svg" alt={record.patient.full_name} />
                                  <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                                    {record.patient.full_name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium text-sm">{record.patient.full_name}</div>
                                  <div className="text-xs text-gray-500">{record.patient.phone}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">{formatDate(record.created_at)}</div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-xs">
                                {record.diagnosis}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm max-w-xs truncate">{record.treatment}</div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Pill className="h-3 w-3 text-green-600" />
                                <span className="text-xs">{record.medications.length} meds</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-3 w-3" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Edit className="h-3 w-3" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </DashboardWrapper>
  )
}
