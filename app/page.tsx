"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { MainLayout } from "@/components/layout/main-layout"
import { DashboardOverview } from "@/components/dashboard/dashboard-overview"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Heart, ArrowRight, Users, Calendar, Bell, Mail, AlertCircle, Eye, EyeOff } from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function HomePage() {
  const { user, profile, loading } = useAuth()
  const router = useRouter()
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [authSuccess, setAuthSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && user && profile) {
      router.push("/dashboard")
    }
  }, [user, profile, loading, router])

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthLoading(true)
    setAuthError(null)
    setAuthSuccess(null)

    try {
      if (authMode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        })

        if (error) throw error

        if (data.user && !data.session) {
          setAuthSuccess("Please check your email for a confirmation link!")
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error
      }
    } catch (error: any) {
      console.error("Auth error:", error)
      setAuthError(error.message || "Authentication failed")
    } finally {
      setAuthLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      setAuthError(null)
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
    } catch (error: any) {
      console.error("Google sign in error:", error)
      setAuthError("Google sign-in is not configured. Please use email authentication or contact support.")
    }
  }

  const handleDemoAccess = () => {
    // Redirect to a demo page or set demo mode
    router.push("/demo")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (user && profile) {
    return (
      <MainLayout>
        <DashboardOverview />
      </MainLayout>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Heart className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">HealPing</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleDemoAccess}>
                Try Demo
              </Button>
              <Button onClick={() => setAuthMode(authMode === "signin" ? "signup" : "signin")}>
                {authMode === "signin" ? "Sign Up" : "Sign In"}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Hero content */}
          <div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Revolutionize Your
              <span className="text-blue-600 block">Healthcare Follow-ups</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              HealPing is a comprehensive healthcare follow-up reminder system that helps medical practices manage
              patient care with intelligent scheduling, multi-channel notifications, and exceptional UX.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                onClick={handleDemoAccess}
                className="bg-green-600 hover:bg-green-700 text-lg px-8 py-3"
              >
                Try Demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-3 border-blue-200 hover:bg-blue-50">
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Right side - Auth form */}
          <div className="lg:max-w-md mx-auto w-full">
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-center">
                  {authMode === "signin" ? "Sign In" : "Create Account"}
                </CardTitle>
                <CardDescription className="text-center">
                  {authMode === "signin" ? "Access your HealPing dashboard" : "Start managing your practice today"}
                </CardDescription>
              </CardHeader>
              <div className="p-6 space-y-4">
                {/* Error/Success Messages */}
                {authError && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">{authError}</AlertDescription>
                  </Alert>
                )}

                {authSuccess && (
                  <Alert className="border-green-200 bg-green-50">
                    <AlertCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">{authSuccess}</AlertDescription>
                  </Alert>
                )}

                {/* Email/Password Form */}
                <form onSubmit={handleEmailAuth} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="doctor@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={authLoading}>
                    {authLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : (
                      <Mail className="h-4 w-4 mr-2" />
                    )}
                    {authMode === "signin" ? "Sign In" : "Create Account"}
                  </Button>
                </form>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">Or</span>
                  </div>
                </div>

                {/* Google Sign In */}
                <Button variant="outline" className="w-full" onClick={handleGoogleSignIn}>
                  <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </Button>

                {/* Demo Access */}
                <Button variant="outline" className="w-full" onClick={handleDemoAccess}>
                  <Heart className="h-4 w-4 mr-2" />
                  Try Demo (No Account Required)
                </Button>

                {/* Toggle Auth Mode */}
                <div className="text-center text-sm">
                  <span className="text-gray-600">
                    {authMode === "signin" ? "Don't have an account? " : "Already have an account? "}
                  </span>
                  <Button
                    variant="link"
                    className="p-0 h-auto font-semibold"
                    onClick={() => setAuthMode(authMode === "signin" ? "signup" : "signin")}
                  >
                    {authMode === "signin" ? "Sign up" : "Sign in"}
                  </Button>
                </div>
              </div>
            </Card>

            {/* Google OAuth Setup Instructions */}
            <Card className="mt-6 border-yellow-200 bg-yellow-50">
              <CardHeader>
                <CardTitle className="text-yellow-800 text-lg">Google Sign-In Setup Required</CardTitle>
                <CardDescription className="text-yellow-700">
                  To enable Google authentication, configure it in your Supabase dashboard:
                  <br />
                  <br />
                  1. Go to Authentication → Providers in Supabase
                  <br />
                  2. Enable Google provider
                  <br />
                  3. Add your Google OAuth credentials
                  <br />
                  <br />
                  For now, use email authentication or try the demo.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <Card className="border-blue-100 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>Smart Patient Management</CardTitle>
              <CardDescription>
                Comprehensive patient profiles with medical history, preferences, and intelligent insights.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-green-100 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>AI-Powered Scheduling</CardTitle>
              <CardDescription>
                Intelligent appointment scheduling with conflict resolution and optimal follow-up suggestions.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-orange-100 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Bell className="h-6 w-6 text-orange-600" />
              </div>
              <CardTitle>Multi-Channel Reminders</CardTitle>
              <CardDescription>
                SMS, WhatsApp, email, and in-app notifications with delivery confirmations and smart timing.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  )
}
