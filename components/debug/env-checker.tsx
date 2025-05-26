"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertCircle } from "lucide-react"

export function EnvChecker() {
  const envVars = [
    {
      name: "NEXT_PUBLIC_SUPABASE_URL",
      value: process.env.NEXT_PUBLIC_SUPABASE_URL,
      required: true,
    },
    {
      name: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      value: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      required: true,
    },
    {
      name: "SUPABASE_URL",
      value: process.env.SUPABASE_URL,
      required: false,
    },
    {
      name: "SUPABASE_ANON_KEY",
      value: process.env.SUPABASE_ANON_KEY,
      required: false,
    },
  ]

  const getStatusIcon = (hasValue: boolean, required: boolean) => {
    if (hasValue) return <CheckCircle className="h-4 w-4 text-green-600" />
    if (required) return <XCircle className="h-4 w-4 text-red-600" />
    return <AlertCircle className="h-4 w-4 text-yellow-600" />
  }

  const getStatusBadge = (hasValue: boolean, required: boolean) => {
    if (hasValue)
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          Set
        </Badge>
      )
    if (required) return <Badge variant="destructive">Missing</Badge>
    return <Badge variant="secondary">Optional</Badge>
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Environment Variables Status
        </CardTitle>
        <CardDescription>Check the status of your Supabase configuration</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {envVars.map((envVar) => (
            <div key={envVar.name} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(!!envVar.value, envVar.required)}
                <div>
                  <p className="font-medium">{envVar.name}</p>
                  <p className="text-sm text-gray-500">
                    {envVar.value ? `${envVar.value.slice(0, 20)}...` : "Not set"}
                  </p>
                </div>
              </div>
              {getStatusBadge(!!envVar.value, envVar.required)}
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Quick Fix:</h4>
          <p className="text-sm text-blue-800">
            If you see missing environment variables, they should already be configured in your Vercel project. Try
            refreshing the page or redeploying your application.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
