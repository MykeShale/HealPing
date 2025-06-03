import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { ExternalLink, Settings, Shield, CheckCircle } from "lucide-react"

export function GoogleSetupGuide() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Google OAuth Setup Guide</h1>
        <p className="text-gray-600">Configure Google authentication for your HealPing application</p>
      </div>

      <Alert className="border-blue-200 bg-blue-50">
        <Shield className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>Important:</strong> You need to configure Google OAuth in your Supabase project for Google login to
          work.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Step 1: Google Cloud Console
            </CardTitle>
            <CardDescription>Set up OAuth credentials in Google Cloud Console</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>
                Go to{" "}
                <a
                  href="https://console.cloud.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Google Cloud Console
                </a>
              </li>
              <li>Create a new project or select existing one</li>
              <li>Enable the Google+ API</li>
              <li>Go to "Credentials" → "Create Credentials" → "OAuth client ID"</li>
              <li>Choose "Web application"</li>
              <li>
                Add authorized redirect URIs:
                <code className="block bg-gray-100 p-2 mt-1 rounded text-xs">
                  https://your-project.supabase.co/auth/v1/callback
                </code>
              </li>
            </ol>
            <Button variant="outline" size="sm" asChild>
              <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer">
                Open Google Console <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Step 2: Supabase Configuration
            </CardTitle>
            <CardDescription>Configure Google OAuth in Supabase</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Go to your Supabase project dashboard</li>
              <li>Navigate to "Authentication" → "Providers"</li>
              <li>Enable "Google" provider</li>
              <li>
                Add your Google OAuth credentials:
                <ul className="list-disc list-inside ml-4 mt-1">
                  <li>Client ID</li>
                  <li>Client Secret</li>
                </ul>
              </li>
              <li>Save the configuration</li>
            </ol>
            <Button variant="outline" size="sm" asChild>
              <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer">
                Open Supabase <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Testing Your Setup
          </CardTitle>
          <CardDescription>Verify that Google OAuth is working correctly</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Once you've completed the setup, test the Google login functionality:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Go to the login page</li>
              <li>Click "Continue with Google"</li>
              <li>Complete the Google OAuth flow</li>
              <li>Verify you're redirected back to the application</li>
              <li>Check that your profile is created correctly</li>
            </ol>
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                If everything is configured correctly, users will be able to sign in with their Google accounts
                seamlessly.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
