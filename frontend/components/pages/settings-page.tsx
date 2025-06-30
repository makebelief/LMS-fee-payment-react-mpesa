"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, CheckCircle, Building, CreditCard, Bell } from "lucide-react"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    // School Information
    schoolName: "EduPay Learning Management System",
    schoolAddress: "123 Education Street, Nairobi, Kenya",
    schoolPhone: "254700000000",
    schoolEmail: "admin@edupay.edu",
    schoolLogo: "",

    // M-Pesa Configuration
    mpesaConsumerKey: "",
    mpesaConsumerSecret: "",
    mpesaBusinessShortcode: "174379",
    mpesaPasskey: "",
    mpesaCallbackUrl: "https://yourdomain.com/api/mpesa/callback",
    mpesaEnvironment: "sandbox",

    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    paymentReminders: true,
    adminAlerts: true,
  })

  const [message, setMessage] = useState({ type: "", content: "" })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Load settings from localStorage or API
    const savedSettings = localStorage.getItem("edupay-settings")
    if (savedSettings) {
      setSettings({ ...settings, ...JSON.parse(savedSettings) })
    }
  }, [])

  const handleInputChange = (section, field, value) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const saveSettings = async (section) => {
    setLoading(true)
    setMessage({ type: "", content: "" })

    try {
      // Save to localStorage (in real app, save to backend)
      localStorage.setItem("edupay-settings", JSON.stringify(settings))

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setMessage({
        type: "success",
        content: `${section} settings saved successfully!`,
      })
    } catch (error) {
      setMessage({
        type: "error",
        content: "Failed to save settings. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
        <p className="text-gray-600">Manage your system configuration and preferences</p>
      </div>

      {message.content && (
        <Alert
          className={`${message.type === "success" ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"}`}
        >
          {message.type === "success" ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <CheckCircle className="h-4 w-4 text-red-600" />
          )}
          <AlertDescription className={`${message.type === "success" ? "text-green-800" : "text-red-800"}`}>
            {message.content}
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="school" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="school" className="flex items-center gap-2">
            <Building className="w-4 h-4" />
            School Info
          </TabsTrigger>
          <TabsTrigger value="mpesa" className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            M-Pesa Config
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Notifications
          </TabsTrigger>
        </TabsList>

        {/* School Information */}
        <TabsContent value="school">
          <Card>
            <CardHeader>
              <CardTitle>School Information</CardTitle>
              <CardDescription>Update your institution's basic information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="schoolName">School Name</Label>
                  <Input
                    id="schoolName"
                    value={settings.schoolName}
                    onChange={(e) => handleInputChange("school", "schoolName", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="schoolEmail">Email Address</Label>
                  <Input
                    id="schoolEmail"
                    type="email"
                    value={settings.schoolEmail}
                    onChange={(e) => handleInputChange("school", "schoolEmail", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="schoolAddress">Address</Label>
                <Textarea
                  id="schoolAddress"
                  value={settings.schoolAddress}
                  onChange={(e) => handleInputChange("school", "schoolAddress", e.target.value)}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="schoolPhone">Phone Number</Label>
                <Input
                  id="schoolPhone"
                  value={settings.schoolPhone}
                  onChange={(e) => handleInputChange("school", "schoolPhone", e.target.value)}
                />
              </div>

              <Button
                onClick={() => saveSettings("School")}
                disabled={loading}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
              >
                {loading ? (
                  <>
                    <Save className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save School Information
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* M-Pesa Configuration */}
        <TabsContent value="mpesa">
          <Card>
            <CardHeader>
              <CardTitle>M-Pesa Configuration</CardTitle>
              <CardDescription>Configure your M-Pesa Daraja API settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="mpesaConsumerKey">Consumer Key</Label>
                  <Input
                    id="mpesaConsumerKey"
                    type="password"
                    value={settings.mpesaConsumerKey}
                    onChange={(e) => handleInputChange("mpesa", "mpesaConsumerKey", e.target.value)}
                    placeholder="Enter your M-Pesa consumer key"
                  />
                </div>
                <div>
                  <Label htmlFor="mpesaConsumerSecret">Consumer Secret</Label>
                  <Input
                    id="mpesaConsumerSecret"
                    type="password"
                    value={settings.mpesaConsumerSecret}
                    onChange={(e) => handleInputChange("mpesa", "mpesaConsumerSecret", e.target.value)}
                    placeholder="Enter your M-Pesa consumer secret"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="mpesaBusinessShortcode">Business Shortcode</Label>
                  <Input
                    id="mpesaBusinessShortcode"
                    value={settings.mpesaBusinessShortcode}
                    onChange={(e) => handleInputChange("mpesa", "mpesaBusinessShortcode", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="mpesaEnvironment">Environment</Label>
                  <select
                    id="mpesaEnvironment"
                    value={settings.mpesaEnvironment}
                    onChange={(e) => handleInputChange("mpesa", "mpesaEnvironment", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="sandbox">Sandbox</option>
                    <option value="production">Production</option>
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="mpesaPasskey">Passkey</Label>
                <Input
                  id="mpesaPasskey"
                  type="password"
                  value={settings.mpesaPasskey}
                  onChange={(e) => handleInputChange("mpesa", "mpesaPasskey", e.target.value)}
                  placeholder="Enter your M-Pesa passkey"
                />
              </div>

              <div>
                <Label htmlFor="mpesaCallbackUrl">Callback URL</Label>
                <Input
                  id="mpesaCallbackUrl"
                  value={settings.mpesaCallbackUrl}
                  onChange={(e) => handleInputChange("mpesa", "mpesaCallbackUrl", e.target.value)}
                  placeholder="https://yourdomain.com/api/mpesa/callback"
                />
                <p className="text-xs text-gray-500 mt-1">This URL will receive payment notifications from M-Pesa</p>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h4 className="font-semibold text-yellow-800 mb-2">Important Notes:</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Keep your credentials secure and never share them</li>
                  <li>• Use sandbox for testing, production for live payments</li>
                  <li>• Callback URL must be publicly accessible (use ngrok for local testing)</li>
                  <li>• Test with sandbox numbers: 254708374149, 254711XXXXXX</li>
                </ul>
              </div>

              <Button
                onClick={() => saveSettings("M-Pesa")}
                disabled={loading}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
              >
                {loading ? (
                  <>
                    <Save className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save M-Pesa Configuration
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure how you receive alerts and notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Email Notifications</h4>
                    <p className="text-sm text-gray-600">Receive payment confirmations via email</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.emailNotifications}
                      onChange={(e) => handleInputChange("notifications", "emailNotifications", e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">SMS Notifications</h4>
                    <p className="text-sm text-gray-600">Receive payment alerts via SMS</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.smsNotifications}
                      onChange={(e) => handleInputChange("notifications", "smsNotifications", e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Payment Reminders</h4>
                    <p className="text-sm text-gray-600">Send reminders for pending payments</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.paymentReminders}
                      onChange={(e) => handleInputChange("notifications", "paymentReminders", e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Admin Alerts</h4>
                    <p className="text-sm text-gray-600">Receive system alerts and updates</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.adminAlerts}
                      onChange={(e) => handleInputChange("notifications", "adminAlerts", e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                  </label>
                </div>
              </div>

              <Button
                onClick={() => saveSettings("Notification")}
                disabled={loading}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
              >
                {loading ? (
                  <>
                    <Save className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Notification Settings
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
