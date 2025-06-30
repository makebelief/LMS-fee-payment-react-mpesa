"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UserCircle, Mail, Phone, School, CreditCard } from "lucide-react"

interface StudentDetails {
  id: number
  name: string
  admissionNo: string
  class: string
  balance: number
  email?: string
  phone?: string
  guardian?: string
  guardianPhone?: string
}

export default function StudentDetailsPage({ params }: { params: { id: string } }) {
  const [student, setStudent] = useState<StudentDetails | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // For now, we'll use the mock data. Later, this should fetch from your API
    const mockStudent = {
      id: parseInt(params.id),
      name: "John Doe",
      admissionNo: "STD001",
      class: "Form 4",
      balance: 25000,
      email: "john.doe@student.com",
      phone: "+254 712 345 678",
      guardian: "Jane Doe",
      guardianPhone: "+254 723 456 789"
    }
    setStudent(mockStudent)
    setLoading(false)
  }, [params.id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2">Loading student details...</p>
        </div>
      </div>
    )
  }

  if (!student) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Student Not Found</h2>
          <p className="text-gray-600 mt-2">The student you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="flex items-center mb-6">
          <div className="bg-gray-100 p-4 rounded-full">
            <UserCircle className="w-16 h-16 text-gray-600" />
          </div>
          <div className="ml-4">
            <h1 className="text-2xl font-bold text-gray-800">{student.name}</h1>
            <p className="text-gray-600">{student.admissionNo}</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <School className="w-5 h-5 text-gray-500 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Class</p>
                  <p className="font-medium">{student.class}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-gray-500 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{student.email}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 text-gray-500 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{student.phone}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Fee Information */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Fee Information</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <CreditCard className="w-5 h-5 text-gray-500 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Current Balance</p>
                  <p className={`font-medium ${student.balance > 0 ? 'text-red-500' : 'text-green-500'}`}>
                    KES {student.balance.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <Button className="w-full">Make Payment</Button>
            </div>
          </Card>

          {/* Guardian Information */}
          <Card className="p-6 md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Guardian Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <UserCircle className="w-5 h-5 text-gray-500 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Guardian Name</p>
                  <p className="font-medium">{student.guardian}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 text-gray-500 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Guardian Phone</p>
                  <p className="font-medium">{student.guardianPhone}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
} 