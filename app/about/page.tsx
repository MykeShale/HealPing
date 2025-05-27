"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Users, Target, Award, ArrowLeft, Linkedin, Twitter, Mail } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

const team = [
  {
    name: "Dr. Sarah Mitchell",
    role: "CEO & Co-Founder",
    bio: "Former Chief Medical Officer with 15+ years in healthcare technology.",
    image: "/placeholder.svg?height=300&width=300",
    linkedin: "#",
    twitter: "#",
  },
  {
    name: "Michael Chen",
    role: "CTO & Co-Founder",
    bio: "Ex-Google engineer specializing in healthcare AI and machine learning.",
    image: "/placeholder.svg?height=300&width=300",
    linkedin: "#",
    twitter: "#",
  },
  {
    name: "Dr. Emily Rodriguez",
    role: "Chief Medical Officer",
    bio: "Pediatrician and healthcare innovation expert with 20+ years experience.",
    image: "/placeholder.svg?height=300&width=300",
    linkedin: "#",
    twitter: "#",
  },
  {
    name: "David Kim",
    role: "VP of Engineering",
    bio: "Former Microsoft architect with expertise in scalable healthcare systems.",
    image: "/placeholder.svg?height=300&width=300",
    linkedin: "#",
    twitter: "#",
  },
]

const values = [
  {
    icon: Heart,
    title: "Patient-Centered Care",
    description: "Every feature we build puts patient outcomes and experience at the center.",
  },
  {
    icon: Users,
    title: "Healthcare Provider Empowerment",
    description: "We empower healthcare providers with tools that enhance their practice efficiency.",
  },
  {
    icon: Target,
    title: "Innovation & Excellence",
    description: "We continuously innovate to deliver the highest quality healthcare technology.",
  },
  {
    icon: Award,
    title: "Trust & Security",
    description: "We maintain the highest standards of security and compliance in healthcare.",
  },
]

export default function AboutPage() {
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
              About HealPing
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Transforming Healthcare
              <span className="text-blue-600 block">One Follow-up at a Time</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Founded by healthcare professionals and technology experts, HealPing is on a mission to revolutionize
              patient care through intelligent automation and seamless communication.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
            <div className="prose prose-lg mx-auto text-gray-600">
              <p className="mb-6">
                HealPing was born from a simple observation: healthcare providers spend countless hours on
                administrative tasks that could be automated, while patients often miss important follow-ups due to
                communication gaps.
              </p>
              <p className="mb-6">
                Our founders, Dr. Sarah Mitchell and Michael Chen, experienced these challenges firsthand. Dr. Mitchell,
                as a practicing physician, saw how manual follow-up processes led to missed appointments and delayed
                care. Michael, with his background in AI and healthcare technology, knew there had to be a better way.
              </p>
              <p>
                Together, they created HealPing - a comprehensive platform that automates patient follow-ups while
                maintaining the personal touch that makes healthcare special. Today, we're proud to serve over 10,000
                healthcare providers and help manage 2 million+ patients worldwide.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These core values guide everything we do and shape how we build products for the healthcare community.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white text-center">
                  <CardHeader>
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <value.icon className="h-8 w-8 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl font-bold">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 leading-relaxed">{value.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our diverse team combines deep healthcare expertise with cutting-edge technology skills.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
                  <CardContent className="p-6 text-center">
                    <img
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                    />
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                    <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">{member.bio}</p>
                    <div className="flex justify-center space-x-3">
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-blue-600">
                        <Linkedin className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-blue-600">
                        <Twitter className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-blue-600">
                        <Mail className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to join our mission?</h2>
            <p className="text-xl text-blue-100 mb-8">
              Help us transform healthcare by improving patient follow-ups and outcomes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4">
                  Start Free Trial
                </Button>
              </Link>
              <Link href="/careers">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-white border-white hover:bg-white/10 text-lg px-8 py-4"
                >
                  Join Our Team
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
