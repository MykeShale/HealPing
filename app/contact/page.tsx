"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Heart, Mail, Phone, MapPin, ArrowLeft, Clock, Send, MessageSquare, Users, Headphones } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

const contactMethods = [
  {
    icon: Mail,
    title: "Email Support",
    description: "Get help from our support team",
    contact: "support@healping.com",
    availability: "24/7 response within 2 hours",
  },
  {
    icon: Phone,
    title: "Phone Support",
    description: "Speak directly with our team",
    contact: "+1 (555) 123-4567",
    availability: "Mon-Fri, 9 AM - 6 PM EST",
  },
  {
    icon: MessageSquare,
    title: "Live Chat",
    description: "Instant help when you need it",
    contact: "Available in app",
    availability: "24/7 with AI, human backup",
  },
  {
    icon: Headphones,
    title: "Technical Support",
    description: "For integration and technical issues",
    contact: "tech@healping.com",
    availability: "Mon-Fri, 8 AM - 8 PM EST",
  },
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsSubmitting(false)
    // Reset form
    setFormData({
      name: "",
      email: "",
      company: "",
      subject: "",
      message: "",
    })
    alert("Thank you for your message! We'll get back to you within 24 hours.")
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Home</span>
            </Link>
            <div className="flex items-center gap-2">
              <Heart className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">HealPing</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Badge variant="outline" className="mb-6 border-blue-200 text-blue-700">
              Get in Touch
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              We're Here to
              <span className="text-blue-600 block">Help You Succeed</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Have questions about HealPing? Need help getting started? Our team of healthcare technology experts is
              ready to assist you every step of the way.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Multiple Ways to Reach Us</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the contact method that works best for you. We're committed to providing fast, helpful responses to
              all inquiries.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {contactMethods.map((method, index) => (
              <motion.div
                key={method.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white text-center">
                  <CardHeader>
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <method.icon className="h-8 w-8 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl font-bold">{method.title}</CardTitle>
                    <CardDescription className="text-gray-600">{method.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="font-semibold text-gray-900 mb-2">{method.contact}</p>
                    <p className="text-sm text-gray-600">{method.availability}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h3>
              <Card className="shadow-lg border-0">
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Dr. John Smith"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="john@example.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company">Practice/Organization</Label>
                      <Input
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="HealthFirst Medical Center"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="How can we help you?"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us more about your needs..."
                        rows={6}
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                          className="rounded-full h-4 w-4 border-b-2 border-white mr-2"
                        />
                      ) : (
                        <Send className="h-4 w-4 mr-2" />
                      )}
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Visit Our Office</h3>
                <Card className="shadow-lg border-0">
                  <CardContent className="p-8">
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <MapPin className="h-6 w-6 text-blue-600 mt-1" />
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">Headquarters</h4>
                          <p className="text-gray-600">
                            123 Healthcare Innovation Drive
                            <br />
                            San Francisco, CA 94105
                            <br />
                            United States
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <Clock className="h-6 w-6 text-blue-600 mt-1" />
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">Office Hours</h4>
                          <p className="text-gray-600">
                            Monday - Friday: 9:00 AM - 6:00 PM PST
                            <br />
                            Saturday: 10:00 AM - 2:00 PM PST
                            <br />
                            Sunday: Closed
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <Users className="h-6 w-6 text-blue-600 mt-1" />
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">Schedule a Visit</h4>
                          <p className="text-gray-600 mb-3">
                            Want to see HealPing in action? Schedule a demo at our office.
                          </p>
                          <Button variant="outline" size="sm">
                            Book Office Demo
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h3>
                <Card className="shadow-lg border-0">
                  <CardContent className="p-8">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">How quickly can I get started?</h4>
                        <p className="text-gray-600 text-sm">
                          Most practices are up and running within 24 hours. Our onboarding team will guide you through
                          the entire setup process.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Do you offer training?</h4>
                        <p className="text-gray-600 text-sm">
                          Yes! We provide comprehensive training for your entire team, including live sessions and
                          recorded tutorials.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Is my data secure?</h4>
                        <p className="text-gray-600 text-sm">
                          Absolutely. We're HIPAA compliant and use enterprise-grade security measures to protect all
                          patient data.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
