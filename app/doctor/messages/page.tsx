"use client"

import { useState } from "react"
import { DashboardWrapper } from "@/components/ui/dashboard-wrapper"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
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
import {
  MessageSquare,
  Send,
  Search,
  Plus,
  Phone,
  Video,
  MoreHorizontal,
  Paperclip,
  Smile,
  Clock,
  CheckCheck,
  AlertTriangle,
} from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"

interface Message {
  id: string
  sender_id: string
  receiver_id: string
  content: string
  message_type: "text" | "image" | "file"
  sent_at: string
  read_at?: string
  is_from_doctor: boolean
}

interface Conversation {
  id: string
  patient_id: string
  patient_name: string
  patient_phone: string
  patient_avatar?: string
  last_message: string
  last_message_time: string
  unread_count: number
  status: "active" | "archived"
  messages: Message[]
}

export default function DoctorMessagesPage() {
  const { profile } = useAuth()
  const { toast } = useToast()

  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [newMessage, setNewMessage] = useState("")
  const [isNewMessageOpen, setIsNewMessageOpen] = useState(false)

  // Mock conversations data
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "1",
      patient_id: "p1",
      patient_name: "John Doe",
      patient_phone: "+1-555-0123",
      last_message: "Thank you for the prescription, Doctor.",
      last_message_time: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      unread_count: 0,
      status: "active",
      messages: [
        {
          id: "m1",
          sender_id: "p1",
          receiver_id: "d1",
          content: "Hello Doctor, I have a question about my medication.",
          message_type: "text",
          sent_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          read_at: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
          is_from_doctor: false,
        },
        {
          id: "m2",
          sender_id: "d1",
          receiver_id: "p1",
          content: "Hello John! What would you like to know about your medication?",
          message_type: "text",
          sent_at: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
          read_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          is_from_doctor: true,
        },
        {
          id: "m3",
          sender_id: "p1",
          receiver_id: "d1",
          content: "Should I take it with food or on an empty stomach?",
          message_type: "text",
          sent_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          read_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
          is_from_doctor: false,
        },
        {
          id: "m4",
          sender_id: "d1",
          receiver_id: "p1",
          content: "Take it with food to avoid stomach upset. Also, make sure to drink plenty of water.",
          message_type: "text",
          sent_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
          read_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          is_from_doctor: true,
        },
        {
          id: "m5",
          sender_id: "p1",
          receiver_id: "d1",
          content: "Thank you for the prescription, Doctor.",
          message_type: "text",
          sent_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          is_from_doctor: false,
        },
      ],
    },
    {
      id: "2",
      patient_id: "p2",
      patient_name: "Jane Smith",
      patient_phone: "+1-555-0124",
      last_message: "When is my next appointment?",
      last_message_time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      unread_count: 2,
      status: "active",
      messages: [
        {
          id: "m6",
          sender_id: "p2",
          receiver_id: "d1",
          content: "Hi Doctor, I'm feeling much better after the treatment.",
          message_type: "text",
          sent_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
          is_from_doctor: false,
        },
        {
          id: "m7",
          sender_id: "p2",
          receiver_id: "d1",
          content: "When is my next appointment?",
          message_type: "text",
          sent_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          is_from_doctor: false,
        },
      ],
    },
  ])

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) || conv.patient_phone.includes(searchTerm),
  )

  const selectedConv = conversations.find((conv) => conv.id === selectedConversation)

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return

    const message: Message = {
      id: `m${Date.now()}`,
      sender_id: "d1",
      receiver_id: selectedConv?.patient_id || "",
      content: newMessage,
      message_type: "text",
      sent_at: new Date().toISOString(),
      is_from_doctor: true,
    }

    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === selectedConversation
          ? {
              ...conv,
              messages: [...conv.messages, message],
              last_message: newMessage,
              last_message_time: new Date().toISOString(),
            }
          : conv,
      ),
    )

    setNewMessage("")
    toast({
      title: "Message sent",
      description: "Your message has been delivered",
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      return `${Math.floor(diffInHours * 60)}m ago`
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unread_count, 0)

  return (
    <DashboardWrapper requiredRole="doctor" title="Messages" description="Loading your messages...">
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
          >
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
              <p className="text-gray-600">Communicate with your patients securely</p>
            </div>
            <div className="flex gap-3">
              <Dialog open={isNewMessageOpen} onOpenChange={setIsNewMessageOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    New Message
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>New Message</DialogTitle>
                    <DialogDescription>Send a message to a patient</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Patient</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select patient" />
                        </SelectTrigger>
                        <SelectContent>
                          {conversations.map((conv) => (
                            <SelectItem key={conv.id} value={conv.patient_id}>
                              {conv.patient_name} - {conv.patient_phone}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Message</label>
                      <Textarea placeholder="Type your message..." rows={4} />
                    </div>
                    <div className="flex justify-end gap-3">
                      <Button variant="outline" onClick={() => setIsNewMessageOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => setIsNewMessageOpen(false)}>Send Message</Button>
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
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Conversations</p>
                    <p className="text-2xl font-bold text-gray-900">{conversations.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Unread Messages</p>
                    <p className="text-2xl font-bold text-gray-900">{totalUnread}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Today</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {
                        conversations.filter(
                          (conv) => new Date(conv.last_message_time) > new Date(Date.now() - 24 * 60 * 60 * 1000),
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
                  <CheckCheck className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Response Rate</p>
                    <p className="text-2xl font-bold text-gray-900">95%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Messages Interface */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="h-[600px]">
              <div className="flex h-full">
                {/* Conversations List */}
                <div className="w-1/3 border-r">
                  <CardHeader className="pb-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search conversations..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </CardHeader>
                  <div className="overflow-y-auto h-[calc(100%-80px)]">
                    {filteredConversations.map((conversation) => (
                      <div
                        key={conversation.id}
                        onClick={() => setSelectedConversation(conversation.id)}
                        className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                          selectedConversation === conversation.id ? "bg-blue-50 border-blue-200" : ""
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={conversation.patient_avatar || "/placeholder.svg"}
                              alt={conversation.patient_name}
                            />
                            <AvatarFallback className="bg-blue-100 text-blue-700">
                              {conversation.patient_name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-gray-900 truncate">{conversation.patient_name}</p>
                              <div className="flex items-center space-x-1">
                                {conversation.unread_count > 0 && (
                                  <Badge variant="destructive" className="text-xs">
                                    {conversation.unread_count}
                                  </Badge>
                                )}
                                <span className="text-xs text-gray-500">
                                  {formatTime(conversation.last_message_time)}
                                </span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-500 truncate">{conversation.last_message}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 flex flex-col">
                  {selectedConv ? (
                    <>
                      {/* Chat Header */}
                      <div className="p-4 border-b bg-white">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage
                                src={selectedConv.patient_avatar || "/placeholder.svg"}
                                alt={selectedConv.patient_name}
                              />
                              <AvatarFallback className="bg-blue-100 text-blue-700">
                                {selectedConv.patient_name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-medium text-gray-900">{selectedConv.patient_name}</h3>
                              <p className="text-sm text-gray-500">{selectedConv.patient_phone}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              <Phone className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Video className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Messages */}
                      <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {selectedConv.messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${message.is_from_doctor ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                message.is_from_doctor ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                              <div className="flex items-center justify-end mt-1 space-x-1">
                                <span
                                  className={`text-xs ${message.is_from_doctor ? "text-blue-100" : "text-gray-500"}`}
                                >
                                  {formatTime(message.sent_at)}
                                </span>
                                {message.is_from_doctor && message.read_at && (
                                  <CheckCheck className="h-3 w-3 text-blue-100" />
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Message Input */}
                      <div className="p-4 border-t bg-white">
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Paperclip className="h-4 w-4" />
                          </Button>
                          <Input
                            placeholder="Type a message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault()
                                sendMessage()
                              }
                            }}
                          />
                          <Button variant="ghost" size="sm">
                            <Smile className="h-4 w-4" />
                          </Button>
                          <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center">
                        <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50 text-gray-400" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No conversation selected</h3>
                        <p className="text-gray-600 mb-4">Select a conversation from the list or start a new one</p>
                        <Button onClick={() => setIsNewMessageOpen(true)}>
                          <Plus className="h-4 w-4 mr-2" />
                          New Message
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </DashboardWrapper>
  )
}
