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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/lib/auth-context"
import {
  Search,
  Plus,
  Phone,
  Mail,
  Calendar,
  MoreHorizontal,
  Users,
  Download,
  Upload,
  Activity,
  Clock,
  AlertTriangle,
} from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import { AddPatientForm } from "@/components/patients/add-patient-form"

interface Patient {
  id: string
  full_name: string
  phone: string
  email?: string
  date_of_birth?: string
  medical_history?: any
  communication_preferences?: any
  created_at: string
  last_appointment?: string
  next_followup?: string
  status: "active" | "inactive" | "overdue"
}

export default function DoctorPatientsPage() {
  const { profile } = useAuth()
  const { toast } = useToast()

  const {
    data: patients,
    loading,
    error,
    refetch,
  } = useDashboardData<Patient[]>({
    fetchFunction: getPatients,
    fallbackData: [],
  })

  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)

  // Add mock status for demonstration
  const enhancedPatients = patients.map((patient) => ({
    ...patient,
    status: Math.random() > 0.8 ? "overdue" : Math.random() > 0.1 ? "active" : "inactive",
    last_appointment: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    next_followup:
      Math.random() > 0.5 ? new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString() : undefined,
  }))

  const filteredPatients = enhancedPatients.filter((patient) => {
    const matchesSearch =
      patient.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm) ||
      patient.email?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = filterStatus === "all" || patient.status === filterStatus

    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "overdue":
        return "bg-red-100 text-red-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <DashboardWrapper requiredRole="doctor" title="Patient Management" description="Loading your patients...">
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
          >
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Patient Management</h1>
              <p className="text-gray-600">Manage your patient database and medical records</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
              <Dialog open={isAddPatientOpen} onOpenChange={setIsAddPatientOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Patient
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Patient</DialogTitle>
                    <DialogDescription>Enter patient information to add them to your practice</DialogDescription>
                  </DialogHeader>
                  <AddPatientForm
                    onSuccess={() => {
                      setIsAddPatientOpen(false)
                      refetch()
                    }}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </motion.div>

          {/* Error State */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 rounded-lg p-4"
            >
              <div className="flex items-center gap-2 text-red-800">
                <AlertTriangle className="h-5 w-5" />
                <span className="font-medium">Unable to load patients</span>
              </div>
              <p className="text-red-600 text-sm mt-1">{error}</p>
              <Button variant="outline" size="sm" onClick={refetch} className="mt-2 text-red-700 border-red-300">
                Try Again
              </Button>
            </motion.div>
          )}

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
                  <Users className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Patients</p>
                    <p className="text-2xl font-bold text-gray-900">{loading ? "..." : enhancedPatients.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {loading ? "..." : enhancedPatients.filter((p) => p.status === "active").length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Follow-ups Due</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {loading ? "..." : enhancedPatients.filter((p) => p.next_followup).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Overdue</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {loading ? "..." : enhancedPatients.filter((p) => p.status === "overdue").length}
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
                placeholder="Search patients by name, phone, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Patients</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>

          {/* Patient List */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card>
              <CardHeader>
                <CardTitle>All Patients ({filteredPatients.length})</CardTitle>
                <CardDescription>Complete list of patients in your practice</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="animate-pulse flex items-center space-x-4 p-4 border rounded-lg">
                        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                        <div className="flex-1 space-y-2">
                          <div className="w-32 h-4 bg-gray-200 rounded"></div>
                          <div className="w-24 h-3 bg-gray-200 rounded"></div>
                        </div>
                        <div className="w-16 h-6 bg-gray-200 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : filteredPatients.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <Users className="h-12 w-12 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {searchTerm ? "No patients found" : "No patients yet"}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {searchTerm ? "Try adjusting your search terms" : "Get started by adding your first patient"}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Patient</TableHead>
                          <TableHead>Contact</TableHead>
                          <TableHead>Last Visit</TableHead>
                          <TableHead>Next Follow-up</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredPatients.map((patient, index) => (
                          <TableRow key={patient.id} className="hover:bg-gray-50">
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage src="/placeholder.svg" alt={patient.full_name} />
                                  <AvatarFallback className="bg-blue-100 text-blue-700">
                                    {getInitials(patient.full_name)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium text-gray-900">{patient.full_name}</div>
                                  <div className="text-sm text-gray-500">
                                    {patient.date_of_birth && `DOB: ${formatDate(patient.date_of_birth)}`}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="flex items-center text-sm text-gray-600">
                                  <Phone className="h-3 w-3 mr-1" />
                                  {patient.phone}
                                </div>
                                {patient.email && (
                                  <div className="flex items-center text-sm text-gray-600">
                                    <Mail className="h-3 w-3 mr-1" />
                                    {patient.email}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              {patient.last_appointment ? (
                                <div className="flex items-center text-sm text-gray-600">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {formatDate(patient.last_appointment)}
                                </div>
                              ) : (
                                <span className="text-gray-400">No visits</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {patient.next_followup ? (
                                <div className="flex items-center text-sm text-gray-600">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {formatDate(patient.next_followup)}
                                </div>
                              ) : (
                                <span className="text-gray-400">Not scheduled</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(patient.status)}>{patient.status}</Badge>
                            </TableCell>
                            <TableCell>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="sm" onClick={() => setSelectedPatient(patient)}>
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                  <DialogHeader>
                                    <DialogTitle>Patient Details</DialogTitle>
                                    <DialogDescription>View and manage patient information</DialogDescription>
                                  </DialogHeader>
                                  {selectedPatient && (
                                    <div className="space-y-4">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <Label>Full Name</Label>
                                          <p className="font-medium">{selectedPatient.full_name}</p>
                                        </div>
                                        <div>
                                          <Label>Phone</Label>
                                          <p className="font-medium">{selectedPatient.phone}</p>
                                        </div>
                                        <div>
                                          <Label>Email</Label>
                                          <p className="font-medium">{selectedPatient.email || "Not provided"}</p>
                                        </div>
                                        <div>
                                          <Label>Date of Birth</Label>
                                          <p className="font-medium">
                                            {selectedPatient.date_of_birth
                                              ? formatDate(selectedPatient.date_of_birth)
                                              : "Not provided"}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="flex gap-3">
                                        <Button>Schedule Appointment</Button>
                                        <Button variant="outline">Send Reminder</Button>
                                        <Button variant="outline">Edit Patient</Button>
                                      </div>
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>
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
