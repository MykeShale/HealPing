"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Home, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center">
        <CardHeader className="space-y-6">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Heart className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl mb-2">Page Not Found</CardTitle>
            <CardDescription className="text-base">
              The page you're looking for doesn't exist or has been moved.
            </CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Link>
            </Button>
            <Button variant="outline" onClick={() => window.history.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </div>
        </CardHeader>
      </Card>
    </div>
  )
}
