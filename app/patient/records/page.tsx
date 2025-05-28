"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useAuth } from "@/lib/auth-context"
import { FileText, Download, Eye, Calendar, User } from "lucide-react"
import { motion } from "framer-motion"
import { getPatientMedicalRecords, getPatientProfile } from "@/lib/supabase-functions"
import { useDashboardData } from "@/hooks/use-dashboard-data"
import { DashboardWrapper } from "@/components/ui/dashboard-wrapper"

export default function PatientRecordsPage() {
  const { user } = useAuth()
  const [patientProfile, setPatientProfile] = useState<any>(null)
  const [selectedRecord, setSelectedRecord] = useState<any>(null)

  // Fetch patient profile
  useEffect(() => {
    if (user?.id) {
      getPatientProfile(user.id).then(setPatientProfile)
    }
  }, [user?.id])

  // Fetch medical records
  const { data: records, loading } = useDashboardData({
    fetchFunction: () => getPatientMedicalRecords(patientProfile?.id || ""),
    fallbackData: [],
    dependencies: [patientProfile?.id],
  })

  return (
    <DashboardWrapper requiredRole="patient">
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Medical Records</h1>
            <p className="text-gray-600">View and manage your health records</p>
          </div>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download All
          </Button>
        </motion.div>

        {/* Records List */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Your Medical Records ({records.length})
              </CardTitle>
              <CardDescription>Complete history of your medical visits and treatments</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="border rounded-lg p-4 animate-pulse">
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-48"></div>
                        <div className="h-3 bg-gray-200 rounded w-32"></div>
                        <div className="h-3 bg-gray-200 rounded w-64"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : records.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No medical records</h3>
                  <p className="text-gray-600">Your medical records will appear here after your visits</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {records.map((record: any, index: number) => (
                    <motion.div
                      key={record.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">
                            {record.diagnosis || record.appointments?.treatment_type || "Medical Record"}
                          </h3>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(record.created_at).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              {record.appointments?.treatment_type || "General"}
                            </span>
                          </div>
                          {record.notes && <p className="text-sm text-gray-600 mt-2">{record.notes}</p>}
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge variant="outline">{record.record_type || "Medical"}</Badge>
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Medical Record Details</DialogTitle>
                                  <DialogDescription>
                                    {new Date(record.created_at).toLocaleDateString()}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <h4 className="font-medium text-gray-900">Diagnosis</h4>
                                    <p className="text-gray-600">{record.diagnosis || "Not specified"}</p>
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-gray-900">Treatment</h4>
                                    <p className="text-gray-600">{record.treatment || "Not specified"}</p>
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-gray-900">Notes</h4>
                                    <p className="text-gray-600">{record.notes || "No additional notes"}</p>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardWrapper>
  )
}
