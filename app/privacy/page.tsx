"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, ArrowLeft, Shield, Lock, Eye, Users } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

export default function PrivacyPage() {
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
              <Shield className="h-4 w-4 mr-2" />
              Privacy Policy
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Your Privacy is
              <span className="text-blue-600 block">Our Priority</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              We are committed to protecting your privacy and ensuring the security of your personal and health
              information.
            </p>
            <p className="text-sm text-gray-500">Last updated: December 15, 2024</p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-lg border-0">
            <CardContent className="p-12">
              <div className="prose prose-lg max-w-none">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Users className="h-6 w-6 text-blue-600 mr-3" />
                  Information We Collect
                </h2>
                <p className="text-gray-600 mb-6">
                  We collect information you provide directly to us, such as when you create an account, use our
                  services, or contact us for support. This may include:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-8 space-y-2">
                  <li>Personal information (name, email address, phone number)</li>
                  <li>Professional information (medical license, practice details)</li>
                  <li>Patient information (with proper consent and authorization)</li>
                  <li>Usage data and analytics</li>
                  <li>Communication preferences</li>
                </ul>

                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Eye className="h-6 w-6 text-blue-600 mr-3" />
                  How We Use Your Information
                </h2>
                <p className="text-gray-600 mb-6">
                  We use the information we collect to provide, maintain, and improve our services:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-8 space-y-2">
                  <li>Provide and operate the HealPing platform</li>
                  <li>Send appointment reminders and notifications</li>
                  <li>Analyze usage patterns to improve our services</li>
                  <li>Provide customer support and respond to inquiries</li>
                  <li>Comply with legal obligations and healthcare regulations</li>
                </ul>

                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Lock className="h-6 w-6 text-blue-600 mr-3" />
                  Data Security and Protection
                </h2>
                <p className="text-gray-600 mb-6">
                  We implement industry-standard security measures to protect your information:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-8 space-y-2">
                  <li>End-to-end encryption for all data transmission</li>
                  <li>Secure data storage with regular backups</li>
                  <li>Multi-factor authentication for account access</li>
                  <li>Regular security audits and penetration testing</li>
                  <li>HIPAA-compliant infrastructure and processes</li>
                </ul>

                <h2 className="text-2xl font-bold text-gray-900 mb-6">HIPAA Compliance</h2>
                <p className="text-gray-600 mb-6">
                  As a healthcare technology provider, we are fully committed to HIPAA compliance. We have implemented
                  appropriate administrative, physical, and technical safeguards to protect the privacy and security of
                  protected health information (PHI).
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mb-6">Information Sharing</h2>
                <p className="text-gray-600 mb-6">
                  We do not sell, trade, or otherwise transfer your personal information to third parties without your
                  consent, except in the following circumstances:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-8 space-y-2">
                  <li>With your explicit consent</li>
                  <li>To comply with legal obligations</li>
                  <li>To protect the rights and safety of our users</li>
                  <li>With trusted service providers who assist in our operations</li>
                </ul>

                <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Rights</h2>
                <p className="text-gray-600 mb-6">You have the right to:</p>
                <ul className="list-disc pl-6 text-gray-600 mb-8 space-y-2">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate information</li>
                  <li>Request deletion of your information</li>
                  <li>Opt-out of certain communications</li>
                  <li>Data portability</li>
                </ul>

                <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Us</h2>
                <p className="text-gray-600 mb-6">
                  If you have any questions about this Privacy Policy or our privacy practices, please contact us at:
                </p>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="text-gray-700">
                    <strong>Privacy Officer</strong>
                    <br />
                    HealPing, Inc.
                    <br />
                    123 Healthcare Innovation Drive
                    <br />
                    San Francisco, CA 94105
                    <br />
                    Email: privacy@healping.com
                    <br />
                    Phone: +1 (555) 123-4567
                  </p>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-6 mt-8">Changes to This Policy</h2>
                <p className="text-gray-600">
                  We may update this Privacy Policy from time to time. We will notify you of any material changes by
                  posting the new Privacy Policy on this page and updating the "Last updated" date at the top of this
                  policy.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
