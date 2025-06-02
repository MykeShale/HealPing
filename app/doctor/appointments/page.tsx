"use client";

import { useState } from "react";
import { DashboardWrapper } from "@/components/ui/dashboard-wrapper";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { getAppointments, getPatients } from "@/lib/supabase-functions";
import { Calendar, dateFnsLocalizer, type View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/lib/auth-context";
import {
  CalendarDays,
  Clock,
  User,
  Plus,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Phone,
  MessageSquare,
  Mail,
  AlertTriangle,
} from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { BookAppointmentForm } from "@/components/appointments/book-appointment-form";

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: {
    "en-US": enUS,
  },
});

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: {
    patient: any;
    status: string;
    treatment_type: string;
    notes: string;
    phone: string;
  };
}

interface NewAppointment {
  patient_id: string;
  appointment_date: string;
  treatment_type: string;
  duration_minutes: number;
  notes: string;
}

export default function DoctorAppointmentsPage() {
  const { profile } = useAuth();
  const { toast } = useToast();

  const {
    data: appointments,
    loading: appointmentsLoading,
    error: appointmentsError,
    refetch: refetchAppointments,
  } = useDashboardData({
    fetchFunction: getAppointments,
    fallbackData: [],
  });

  const {
    data: patients,
    loading: patientsLoading,
    error: patientsError,
  } = useDashboardData({
    fetchFunction: getPatients,
    fallbackData: [],
  });

  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [view, setView] = useState<View>("week");
  const [date, setDate] = useState(new Date());
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{
    start: Date;
    end: Date;
  } | null>(null);

  const loading = appointmentsLoading || patientsLoading;
  const error = appointmentsError || patientsError;

  const events: CalendarEvent[] = appointments.map((apt) => ({
    id: apt.id,
    title: `${apt.patients?.full_name} - ${
      apt.treatment_type || "Appointment"
    }`,
    start: new Date(apt.appointment_date),
    end: new Date(new Date(apt.appointment_date).getTime() + 30 * 60000),
    resource: {
      patient: apt.patients,
      status: apt.status,
      treatment_type: apt.treatment_type,
      notes: apt.notes,
      phone: apt.patients?.phone || "",
    },
  }));

  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    setSelectedSlot({ start, end });
    setIsScheduleOpen(true);
  };

  const eventStyleGetter = (event: CalendarEvent) => {
    let backgroundColor = "#3174ad";

    switch (event.resource.status) {
      case "completed":
        backgroundColor = "#10b981";
        break;
      case "cancelled":
        backgroundColor = "#ef4444";
        break;
      case "no_show":
        backgroundColor = "#f59e0b";
        break;
      default:
        backgroundColor = "#3b82f6";
    }

    return {
      style: {
        backgroundColor,
        borderRadius: "6px",
        opacity: 0.8,
        color: "white",
        border: "0px",
        display: "block",
      },
    };
  };

  const todayAppointments = events.filter(
    (event) =>
      format(event.start, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")
  );

  const upcomingAppointments = events
    .filter(
      (event) =>
        event.start > new Date() &&
        format(event.start, "yyyy-MM-dd") !== format(new Date(), "yyyy-MM-dd")
    )
    .slice(0, 5);

  return (
    <DashboardWrapper
      requiredRole="doctor"
      title="Appointment Management"
      description="Loading your appointments..."
    >
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
          >
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Appointment Management
              </h1>
              <p className="text-gray-600">
                Manage your practice schedule and patient appointments
              </p>
            </div>
            <Dialog open={isScheduleOpen} onOpenChange={setIsScheduleOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule Appointment
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <BookAppointmentForm
                  patients={patients}
                  selectedSlot={selectedSlot}
                  onSuccess={() => {
                    setIsScheduleOpen(false);
                    setSelectedSlot(null);
                    refetchAppointments();
                  }}
                  onCancel={() => {
                    setIsScheduleOpen(false);
                    setSelectedSlot(null);
                  }}
                />
              </DialogContent>
            </Dialog>
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
                <span className="font-medium">Unable to load appointments</span>
              </div>
              <p className="text-red-600 text-sm mt-1">{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={refetchAppointments}
                className="mt-2 text-red-700 border-red-300"
              >
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
                  <CalendarDays className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Today</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {loading ? "..." : todayAppointments.length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      This Week
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {loading ? "..." : events.length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Completed
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {loading
                        ? "..."
                        : events.filter(
                            (e) => e.resource.status === "completed"
                          ).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Patients
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {loading ? "..." : patients.length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Tabs defaultValue="calendar" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="calendar">Calendar View</TabsTrigger>
                <TabsTrigger value="today">Today's Schedule</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              </TabsList>

              <TabsContent value="calendar" className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    {loading ? (
                      <div className="h-96 flex items-center justify-center">
                        <div className="text-center space-y-4">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                          <p className="text-gray-600">Loading calendar...</p>
                        </div>
                      </div>
                    ) : (
                      <div style={{ height: "600px" }}>
                        <Calendar
                          localizer={localizer}
                          events={events}
                          startAccessor="start"
                          endAccessor="end"
                          style={{ height: "100%" }}
                          eventPropGetter={eventStyleGetter}
                          onSelectEvent={(event) => setSelectedEvent(event)}
                          onSelectSlot={handleSelectSlot}
                          selectable
                          views={["month", "week", "day"]}
                          view={view}
                          onView={setView}
                          date={date}
                          onNavigate={setDate}
                          step={15}
                          showMultiDayTimes
                          components={{
                            event: ({ event }) => (
                              <div className="p-1">
                                <div className="font-medium text-xs">
                                  {event.resource.patient?.full_name}
                                </div>
                                <div className="text-xs opacity-75">
                                  {event.resource.treatment_type}
                                </div>
                              </div>
                            ),
                          }}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="today" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Today's Appointments</CardTitle>
                    <CardDescription>
                      {format(new Date(), "EEEE, MMMM do, yyyy")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className="animate-pulse flex items-center space-x-4 p-4 border rounded-lg"
                          >
                            <div className="w-20 h-4 bg-gray-200 rounded"></div>
                            <div className="flex-1 space-y-2">
                              <div className="w-32 h-4 bg-gray-200 rounded"></div>
                              <div className="w-24 h-3 bg-gray-200 rounded"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : todayAppointments.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <CalendarDays className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No appointments scheduled for today</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {todayAppointments.map((appointment) => (
                          <div
                            key={appointment.id}
                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="text-sm font-medium text-gray-600 w-20">
                                {format(appointment.start, "HH:mm")}
                              </div>
                              <div>
                                <p className="font-medium">
                                  {appointment.resource.patient?.full_name}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {appointment.resource.treatment_type}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {appointment.resource.phone}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge
                                variant={
                                  appointment.resource.status === "completed"
                                    ? "default"
                                    : appointment.resource.status ===
                                      "cancelled"
                                    ? "destructive"
                                    : "secondary"
                                }
                              >
                                {appointment.resource.status}
                              </Badge>
                              <div className="flex gap-1">
                                <Button variant="ghost" size="sm">
                                  <Phone className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <MessageSquare className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="upcoming" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Appointments</CardTitle>
                    <CardDescription>
                      Next appointments in your schedule
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className="animate-pulse flex items-center space-x-4 p-4 border rounded-lg"
                          >
                            <div className="w-16 h-8 bg-gray-200 rounded"></div>
                            <div className="flex-1 space-y-2">
                              <div className="w-32 h-4 bg-gray-200 rounded"></div>
                              <div className="w-24 h-3 bg-gray-200 rounded"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {upcomingAppointments.map((appointment) => (
                          <div
                            key={appointment.id}
                            className="flex items-center justify-between p-4 border rounded-lg"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="text-sm font-medium text-gray-600">
                                <div>{format(appointment.start, "MMM dd")}</div>
                                <div>{format(appointment.start, "HH:mm")}</div>
                              </div>
                              <div>
                                <p className="font-medium">
                                  {appointment.resource.patient?.full_name}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {appointment.resource.treatment_type}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline">
                                {appointment.resource.status}
                              </Badge>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Event Details Modal */}
              {selectedEvent && (
                <Dialog
                  open={!!selectedEvent}
                  onOpenChange={() => setSelectedEvent(null)}
                >
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Appointment Details</DialogTitle>
                      <DialogDescription>
                        {format(
                          selectedEvent.start,
                          "EEEE, MMMM do, yyyy 'at' h:mm a"
                        )}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">
                            Patient Information
                          </h4>
                          <div className="space-y-2">
                            <p className="text-gray-600">
                              <strong>Name:</strong>{" "}
                              {selectedEvent.resource.patient?.full_name}
                            </p>
                            <p className="text-gray-600">
                              <strong>Phone:</strong>{" "}
                              {selectedEvent.resource.phone}
                            </p>
                            <p className="text-gray-600">
                              <strong>Email:</strong>{" "}
                              {selectedEvent.resource.patient?.email ||
                                "Not provided"}
                            </p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">
                            Appointment Details
                          </h4>
                          <div className="space-y-2">
                            <p className="text-gray-600">
                              <strong>Type:</strong>{" "}
                              {selectedEvent.resource.treatment_type ||
                                "General Consultation"}
                            </p>
                            <p className="text-gray-600">
                              <strong>Duration:</strong> 30 minutes
                            </p>
                            <div className="flex items-center gap-2">
                              <strong>Status:</strong>
                              <Badge
                                variant={
                                  selectedEvent.resource.status === "completed"
                                    ? "default"
                                    : selectedEvent.resource.status ===
                                      "cancelled"
                                    ? "destructive"
                                    : "secondary"
                                }
                              >
                                {selectedEvent.resource.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>

                      {selectedEvent.resource.notes && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">
                            Notes
                          </h4>
                          <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                            {selectedEvent.resource.notes}
                          </p>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-3">
                        <Button>
                          <Phone className="h-4 w-4 mr-2" />
                          Call Patient
                        </Button>
                        <Button variant="outline">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Send SMS
                        </Button>
                        <Button variant="outline">
                          <Mail className="h-4 w-4 mr-2" />
                          Send Email
                        </Button>
                        <Button variant="outline">
                          <CalendarDays className="h-4 w-4 mr-2" />
                          Reschedule
                        </Button>
                        <Button variant="destructive">
                          <XCircle className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </Tabs>
          </motion.div>
        </div>
      </div>
    </DashboardWrapper>
  );
}
