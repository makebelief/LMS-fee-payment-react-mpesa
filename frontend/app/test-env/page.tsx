"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertTriangle, RefreshCw } from "lucide-react"

export default function TestEnvPage() {
  const [envStatus, setEnvStatus] = useState(null)
  const [loading, setLoading] = useState(false)

  const checkEnvironmentVariables = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/test-env")
      const data = await response.json()
      setEnvStatus(data)
    } catch (error) {
      setEnvStatus({ error: "Failed to check environment variables" })
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />
      case "error":
        return <XCircle className="w-5 h-5 text-red-600" />
      default:
        return null
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-100 text-green-800">✓ Set</Badge>
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-800">⚠ Default</Badge>
      case "error":
        return <Badge className="bg-red-100 text-red-800">✗ Missing</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Environment Variables Test</h2>
        <p className="text-gray-600">Check if your M-Pesa credentials are properly configured</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>M-Pesa Configuration Status</CardTitle>
          <CardDescription>
            This page helps you verify that all required environment variables are set correctly
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={checkEnvironmentVariables}
            disabled={loading}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Checking...
              </>
            ) : (
              "Check Environment Variables"
            )}
          </Button>

          {envStatus && (
            <div className="space-y-4">
              {envStatus.error ? (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <XCircle className="w-5 h-5 text-red-600 mr-2" />
                    <span className="text-red-800 font-medium">Error</span>
                  </div>
                  <p className="text-red-700 mt-1">{envStatus.error}</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(envStatus.variables || {}).map(([key, info]) => (
                      <div key={key} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">{key}</span>
                          {getStatusBadge(info.status)}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          {getStatusIcon(info.status)}
                          <span className="ml-2">{info.message}</span>
                        </div>
                        {info.value && (
                          <p className="text-xs text-gray-500 mt-1 font-mono">
                            {info.masked ? "••••••••" : info.value}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Overall Status</h4>
                    <div className="flex items-center">
                      {getStatusIcon(envStatus.overall)}
                      <span className="ml-2 text-blue-700">{envStatus.message}</span>
                    </div>
                  </div>

                  {envStatus.overall !== "success" && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <h4 className="font-semibold text-yellow-800 mb-2">Next Steps</h4>
                      <ul className="text-sm text-yellow-700 space-y-1">
                        <li>1. Create or update your `.env.local` file in the project root</li>
                        <li>2. Add the missing environment variables</li>
                        <li>3. Restart your development server (`npm run dev`)</li>
                        <li>
                          4. Get credentials from{" "}
                          <a href="https://developer.safaricom.co.ke" className="underline">
                            Safaricom Developer Portal
                          </a>
                        </li>
                      </ul>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
