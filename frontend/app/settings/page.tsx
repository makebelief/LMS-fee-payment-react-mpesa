"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Bell, Moon, Sun, Globe } from "lucide-react"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      payments: true,
      system: false,
    },
    appearance: {
      darkMode: false,
      compactMode: false,
    },
    preferences: {
      language: "English",
      timezone: "Africa/Nairobi",
    }
  })

  const handleNotificationToggle = (key: keyof typeof settings.notifications) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key]
      }
    }))
  }

  const handleAppearanceToggle = (key: keyof typeof settings.appearance) => {
    setSettings(prev => ({
      ...prev,
      appearance: {
        ...prev.appearance,
        [key]: !prev.appearance[key]
      }
    }))
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-8">Settings</h1>

      <div className="space-y-6 max-w-2xl mx-auto">
        {/* Notifications Settings */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Bell className="w-5 h-5 mr-2" />
            Notifications
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-gray-500">Receive notifications via email</p>
              </div>
              <Switch
                checked={settings.notifications.email}
                onCheckedChange={() => handleNotificationToggle('email')}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Push Notifications</p>
                <p className="text-sm text-gray-500">Receive push notifications</p>
              </div>
              <Switch
                checked={settings.notifications.push}
                onCheckedChange={() => handleNotificationToggle('push')}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Payment Alerts</p>
                <p className="text-sm text-gray-500">Get notified about new payments</p>
              </div>
              <Switch
                checked={settings.notifications.payments}
                onCheckedChange={() => handleNotificationToggle('payments')}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">System Updates</p>
                <p className="text-sm text-gray-500">Get notified about system changes</p>
              </div>
              <Switch
                checked={settings.notifications.system}
                onCheckedChange={() => handleNotificationToggle('system')}
              />
            </div>
          </div>
        </Card>

        {/* Appearance Settings */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            {settings.appearance.darkMode ? (
              <Moon className="w-5 h-5 mr-2" />
            ) : (
              <Sun className="w-5 h-5 mr-2" />
            )}
            Appearance
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Dark Mode</p>
                <p className="text-sm text-gray-500">Toggle dark mode theme</p>
              </div>
              <Switch
                checked={settings.appearance.darkMode}
                onCheckedChange={() => handleAppearanceToggle('darkMode')}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Compact Mode</p>
                <p className="text-sm text-gray-500">Use compact view for lists</p>
              </div>
              <Switch
                checked={settings.appearance.compactMode}
                onCheckedChange={() => handleAppearanceToggle('compactMode')}
              />
            </div>
          </div>
        </Card>

        {/* Regional Settings */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Globe className="w-5 h-5 mr-2" />
            Regional
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Language
              </label>
              <select
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                value={settings.preferences.language}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  preferences: { ...prev.preferences, language: e.target.value }
                }))}
              >
                <option>English</option>
                <option>Swahili</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time Zone
              </label>
              <select
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                value={settings.preferences.timezone}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  preferences: { ...prev.preferences, timezone: e.target.value }
                }))}
              >
                <option>Africa/Nairobi</option>
                <option>UTC</option>
              </select>
            </div>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  )
}
