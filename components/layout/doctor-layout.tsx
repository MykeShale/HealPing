"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  MessageSquare,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  Clock,
  User,
} from "lucide-react"

interface DoctorLayoutProps {
  children: React.ReactNode
}

export function DoctorLayout({ children }: DoctorLayoutProps) {
  const { user, profile, signOut, loading } = useAuth()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navigation = [
    {
      name: "Dashboard",
      href: "/doctor/dashboard",
      icon: LayoutDashboard,
      current: pathname === "/doctor/dashboard",
    },
    {
      name: "Patients",
      href: "/doctor/patients",
      icon: Users,
      current: pathname === "/doctor/patients",
    },
    {
      name: "Appointments",
      href: "/doctor/appointments",
      icon: Calendar,
      current: pathname === "/doctor/appointments",
    },
    {
      name: "Medical Records",
      href: "/doctor/records",
      icon: FileText,
      current: pathname === "/doctor/records",
    },
    {
      name: "Schedule",
      href: "/doctor/schedule",
      icon: Clock,
      current: pathname === "/doctor/schedule",
    },
    {
      name: "Messages",
      href: "/doctor/messages",
      icon: MessageSquare,
      current: pathname === "/doctor/messages",
    },
    {
      name: "Reminders",
      href: "/doctor/reminders",
      icon: Bell,
      current: pathname === "/doctor/reminders",
    },
  ]

  const secondaryNavigation = [
    {
      name: "Profile",
      href: "/doctor/profile",
      icon: User,
      current: pathname === "/doctor/profile",
    },
    {
      name: "Settings",
      href: "/doctor/settings",
      icon: Settings,
      current: pathname === "/doctor/settings",
    },
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile menu */}
      <div className="lg:hidden">
        <div className="fixed inset-0 flex z-40">
          {/* Mobile menu backdrop */}
          {isMobileMenuOpen && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setIsMobileMenuOpen(false)}></div>
          )}

          {/* Mobile menu sidebar */}
          <div
            className={`fixed inset-y-0 left-0 flex flex-col w-64 bg-white transform ${
              isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            } transition-transform duration-300 ease-in-out`}
          >
            <div className="flex items-center justify-between h-16 px-4 border-b">
              <div className="flex items-center">
                <span className="text-xl font-semibold text-blue-600">HealPing</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <nav className="px-2 py-4 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-2 py-2 text-base font-medium rounded-md ${
                      item.current ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className={`mr-3 h-6 w-6 ${item.current ? "text-blue-500" : "text-gray-400"}`} />
                    {item.name}
                  </Link>
                ))}
              </nav>
              <div className="border-t border-gray-200 pt-4 pb-3">
                <div className="px-2 space-y-1">
                  {secondaryNavigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center px-2 py-2 text-base font-medium rounded-md ${
                        item.current
                          ? "bg-blue-100 text-blue-700"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <item.icon className={`mr-3 h-6 w-6 ${item.current ? "text-blue-500" : "text-gray-400"}`} />
                      {item.name}
                    </Link>
                  ))}
                  <button
                    onClick={signOut}
                    className="flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900 w-full"
                  >
                    <LogOut className="mr-3 h-6 w-6 text-gray-400" />
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:border-r lg:border-gray-200 lg:bg-white">
        <div className="flex items-center h-16 px-4 border-b border-gray-200">
          <span className="text-xl font-semibold text-blue-600">HealPing</span>
        </div>
        <div className="flex-1 flex flex-col overflow-y-auto">
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  item.current ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <item.icon className={`mr-3 h-5 w-5 ${item.current ? "text-blue-500" : "text-gray-400"}`} />
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="border-t border-gray-200 pt-4 pb-3">
            <div className="px-4 flex items-center">
              <div className="flex-shrink-0">
                <Avatar>
                  <AvatarImage src={profile?.avatar_url || ""} />
                  <AvatarFallback className="bg-blue-100 text-blue-700">
                    {profile?.first_name?.[0] || user?.email?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="ml-3">
                <div className="text-sm font-medium text-gray-700">
                  {profile?.first_name
                    ? `Dr. ${profile.first_name} ${profile.last_name || ""}`
                    : user?.email || "Doctor"}
                </div>
                <div className="text-xs text-gray-500">{user?.email}</div>
              </div>
            </div>
            <div className="mt-3 px-2 space-y-1">
              {secondaryNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    item.current ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <item.icon className={`mr-3 h-5 w-5 ${item.current ? "text-blue-500" : "text-gray-400"}`} />
                  {item.name}
                </Link>
              ))}
              <button
                onClick={signOut}
                className="flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900 w-full"
              >
                <LogOut className="mr-3 h-5 w-5 text-gray-400" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        <div className="sticky top-0 z-10 flex h-16 bg-white border-b border-gray-200 lg:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex items-center justify-between flex-1 px-4">
            <div className="flex-1 flex">
              <span className="text-xl font-semibold text-blue-600">HealPing</span>
            </div>
            <div className="flex items-center">
              <Avatar className="h-8 w-8">
                <AvatarImage src={profile?.avatar_url || ""} />
                <AvatarFallback className="bg-blue-100 text-blue-700">
                  {profile?.first_name?.[0] || user?.email?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
