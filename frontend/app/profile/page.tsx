"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { UserCircle, Mail, Phone, Building } from "lucide-react"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: "Admin User",
    email: "admin@school.com",
    phone: "+254 712 345 678",
    department: "Administration",
    role: "System Administrator"
  })

  const handleSave = () => {
    // TODO: Implement API call to save profile changes
    setIsEditing(false)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-8">Profile Settings</h1>
      
      <Card className="max-w-2xl mx-auto p-6">
        <div className="flex items-center mb-8">
          <div className="bg-gray-100 p-4 rounded-full">
            <UserCircle className="w-16 h-16 text-gray-600" />
          </div>
          <div className="ml-4">
            <h2 className="text-xl font-semibold">{profile.name}</h2>
            <p className="text-gray-600">{profile.role}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid gap-4">
            <div className="flex items-center space-x-2">
              <Mail className="w-5 h-5 text-gray-500" />
              {isEditing ? (
                <Input
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="flex-1"
                />
              ) : (
                <span className="text-gray-700">{profile.email}</span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Phone className="w-5 h-5 text-gray-500" />
              {isEditing ? (
                <Input
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="flex-1"
                />
              ) : (
                <span className="text-gray-700">{profile.phone}</span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Building className="w-5 h-5 text-gray-500" />
              {isEditing ? (
                <Input
                  value={profile.department}
                  onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                  className="flex-1"
                />
              ) : (
                <span className="text-gray-700">{profile.department}</span>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  Save Changes
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
} 