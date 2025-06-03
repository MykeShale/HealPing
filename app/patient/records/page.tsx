"use client"

import { useState } from "react"
import { DashboardWrapper } from "@/components/ui/dashboard-wrapper"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/auth-context"
import { FileText, Download, Search, Calendar, Pill, Activity, Clipboard, Eye } from "lucide-react"
import { motion } from "framer-motion"

interface MedicalRecord {
  id: string
  date: string
  doctor: {
    name: string
    specialty: string
    avatar?: string
  }
  diagnosis: string
  treatment: string
  medications: {
    name: string
    dosage: string
    frequency: string
  }[]
  notes: string
  type: "consultation" | "test" | "procedure"
}

export default function PatientRecordsPage() {
  const { user, profile } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  // Mock medical records data
  const medicalRecords: MedicalRecord[] = [
    {
      id: "1",
      date: new Date().toISOString(),
      doctor: {
        name: "Dr. Sarah Johnson",
        specialty: "Cardiology",
      },
      diagnosis: "Hypertension",
      treatment: "Lifestyle changes and medication",
      medications: [
        { name: "Lisinopril", dosage: "10mg", frequency: "Once daily" },
        { name: "Hydrochlorothiazide", dosage: "25mg", frequency: "Once daily" },
      ],
      notes: "Blood pressure readings have been consistently high. Recommended dietary changes and regular exercise.",
      type: "consultation",
    },
    {
      id: "2",
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      doctor: {
        name: "Dr. Michael Chen",
        specialty: "Radiology",
      },
      diagnosis: "Normal chest X-ray",
      treatment: "No treatment required",
      medications: [],
      notes:
        "Chest X-ray shows normal heart size and clear lung fields. No evidence of pneumonia or other abnormalities.",
      type: "test",
    },
    {
      id: "3",
      date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      doctor: {
        name: "Dr. Emily Wilson",
        specialty: "General Practice",
      },
      diagnosis: "Upper respiratory infection",
      treatment: "Symptomatic treatment",
      medications: [
        { name: "Acetaminophen", dosage: "500mg", frequency: "Every 6 hours as needed" },
        { name: "Guaifenesin", dosage: "400mg", frequency: "Every 12 hours" },
      ],
      notes: "Symptoms include cough, congestion, and low-grade fever. Should resolve within 7-10 days.",
      type: "consultation",
    },
  ]

  const filteredRecords = medicalRecords
    .filter((record) => {
      if (activeTab !== "all" && record.type !== activeTab) return false
      return (
        record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.treatment.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <DashboardWrapper requiredRole="patient" title="Medical Records" description="Loading your medical records...">
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
              <p className="text-gray-600">View and manage your medical history</p>
            </div>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Records
            </Button>
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
                    <p className="text-sm font-medium text-gray-600">Consultations</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {medicalRecords.filter((r) => r.type === "consultation").length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Tests</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {medicalRecords.filter((r) => r.type === "test").length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Pill className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Medications</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {medicalRecords.reduce((total, record) => total + record.medications.length, 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search records by diagnosis, doctor, or treatment..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="consultation">Consultations</TabsTrigger>
                <TabsTrigger value="test">Tests</TabsTrigger>
                <TabsTrigger value="procedure">Procedures</TabsTrigger>
              </TabsList>
            </Tabs>
          </motion.div>

          {/* Records List */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            {filteredRecords.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <FileText className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No records found</h3>
                  <p className="text-gray-600 text-center max-w-md">
                    {searchTerm
                      ? "Try adjusting your search or filters to find what you're looking for."
                      : "You don't have any medical records yet. They will appear here once created by your healthcare provider."}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredRecords.map((record) => (
                  <Card key={record.id} className="overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/4 bg-gray-50 p-4 border-r border-gray-200">
                        <div className="flex items-center space-x-3 mb-4">
                          <Avatar>
                            <AvatarImage src={record.doctor.avatar || "/placeholder.svg"} />
                            <AvatarFallback className="bg-blue-100 text-blue-700">
                              {record.doctor.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-gray-900">{record.doctor.name}</p>
                            <p className="text-sm text-gray-500">{record.doctor.specialty}</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600">{formatDate(record.date)}</span>
                          </div>
                          <div>
                            <Badge
                              variant="outline"
                              className={`${
                                record.type === "consultation"
                                  ? "bg-blue-50 text-blue-700 border-blue-200"
                                  : record.type === "test"
                                    ? "bg-green-50 text-green-700 border-green-200"
                                    : "bg-purple-50 text-purple-700 border-purple-200"
                              }`}
                            >
                              {record.type === "consultation"
                                ? "Consultation"
                                : record.type === "test"
                                  ? "Test"
                                  : "Procedure"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="md:w-3/4 p-4">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">{record.diagnosis}</h3>
                            <p className="text-gray-600">{record.treatment}</p>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </div>
                        {record.medications.length > 0 && (
                          <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                              <Pill className="h-4 w-4 mr-1 text-gray-500" />
                              Medications
                            </h4>
                            <div className="space-y-1">
                              {record.medications.map((med, idx) => (
                                <div key={idx} className="text-sm">
                                  <span className="font-medium">{med.name}</span> - {med.dosage}, {med.frequency}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {record.notes && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                              <Clipboard className="h-4 w-4 mr-1 text-gray-500" />
                              Notes
                            </h4>
                            <p className="text-sm text-gray-600">{record.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </DashboardWrapper>
  )
}
