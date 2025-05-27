"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, ArrowLeft, FileText, Scale, AlertTriangle, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

export default function TermsPage() {
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
              <FileText className="h-4 w-4 mr-2" />
              Terms of Service
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Terms of
              <span className="text-blue-600 block">Service</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              Please read these terms carefully before using HealPing. By using our service, you agree to these terms.
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
                  <CheckCircle className="h-6 w-6 text-blue-600 mr-3" />
                  Acceptance of Terms
                </h2>
                <p className="text-gray-600 mb-8">
                  By accessing and using HealPing ("Service"), you accept and agree to be bound by the terms and
                  provision of this agreement. If you do not agree to abide by the above, please do not use this
                  service.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mb-6">Service Description</h2>
                <p className="text-gray-600 mb-6">
                  HealPing is a healthcare follow-up management platform that provides:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-8 space-y-2">
                  <li>Patient appointment scheduling and management</li>
                  <li>Automated reminder systems via multiple channels</li>
                  <li>Patient communication tools</li>
                  <li>Analytics and reporting features</li>
                  <li>Integration with healthcare systems</li>
                </ul>

                <h2 className="text-2xl font-bold text-gray-900 mb-6">User Responsibilities</h2>
                <p className="text-gray-600 mb-6">As a user of HealPing, you agree to:</p>
                <ul className="list-disc pl-6 text-gray-600 mb-8 space-y-2">
                  <li>Provide accurate and complete information</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Use the service in compliance with applicable laws and regulations</li>
                  <li>Respect patient privacy and confidentiality</li>
                  <li>Not use the service for any unlawful purposes</li>
                </ul>

                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Scale className="h-6 w-6 text-blue-600 mr-3" />
                  Healthcare Compliance
                </h2>
                <p className="text-gray-600 mb-6">
                  HealPing is designed to be HIPAA compliant. However, users are responsible for:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-8 space-y-2">
                  <li>Ensuring proper patient consent for communications</li>
                  <li>Following their organization's privacy policies</li>
                  <li>Reporting any suspected security incidents</li>
                  <li>Maintaining appropriate access controls</li>
                </ul>

                <h2 className="text-2xl font-bold text-gray-900 mb-6">Data Ownership and Usage</h2>
                <p className="text-gray-600 mb-6">
                  You retain ownership of all data you input into HealPing. We use your data solely to:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-8 space-y-2">
                  <li>Provide the requested services</li>
                  <li>Improve our platform (with anonymized data)</li>
                  <li>Comply with legal requirements</li>
                  <li>Ensure platform security and integrity</li>
                </ul>

                <h2 className="text-2xl font-bold text-gray-900 mb-6">Service Availability</h2>
                <p className="text-gray-600 mb-8">
                  We strive to maintain 99.9% uptime but cannot guarantee uninterrupted service. We may perform
                  maintenance that temporarily affects service availability, and we will provide advance notice when
                  possible.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Terms</h2>
                <p className="text-gray-600 mb-6">For paid subscriptions:</p>
                <ul className="list-disc pl-6 text-gray-600 mb-8 space-y-2">
                  <li>Payments are processed monthly or annually as selected</li>
                  <li>All fees are non-refundable unless otherwise stated</li>
                  <li>We may change pricing with 30 days notice</li>
                  <li>Accounts may be suspended for non-payment</li>
                </ul>

                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <AlertTriangle className="h-6 w-6 text-orange-600 mr-3" />
                  Limitation of Liability
                </h2>
                <p className="text-gray-600 mb-8">
                  HealPing shall not be liable for any indirect, incidental, special, consequential, or punitive
                  damages, including without limitation, loss of profits, data, use, goodwill, or other intangible
                  losses, resulting from your use of the service.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mb-6">Termination</h2>
                <p className="text-gray-600 mb-6">Either party may terminate this agreement at any time:</p>
                <ul className="list-disc pl-6 text-gray-600 mb-8 space-y-2">
                  <li>You may cancel your account at any time</li>
                  <li>We may terminate accounts for violations of these terms</li>
                  <li>Upon termination, you may export your data for 30 days</li>
                  <li>We will delete your data after the retention period</li>
                </ul>

                <h2 className="text-2xl font-bold text-gray-900 mb-6">Changes to Terms</h2>
                <p className="text-gray-600 mb-8">
                  We reserve the right to modify these terms at any time. We will notify users of material changes via
                  email or through the platform. Continued use of the service after changes constitutes acceptance of
                  the new terms.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
                <p className="text-gray-600 mb-6">For questions about these Terms of Service, please contact us:</p>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="text-gray-700">
                    <strong>Legal Department</strong>
                    <br />
                    HealPing, Inc.
                    <br />
                    123 Healthcare Innovation Drive
                    <br />
                    San Francisco, CA 94105
                    <br />
                    Email: legal@healping.com
                    <br />
                    Phone: +1 (555) 123-4567
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
