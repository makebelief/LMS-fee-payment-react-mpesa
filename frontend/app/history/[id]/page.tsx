"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UserCircle, Calendar, CreditCard, Receipt, CheckCircle2 } from "lucide-react"
import Link from "next/link"

interface PaymentDetails {
  id: number
  student: string
  admissionNo: string
  amount: number
  date: string
  method: string
  reference: string
  status: "completed" | "pending" | "failed"
}

export default function PaymentDetailsPage({ params }: { params: { id: string } }) {
  const [payment, setPayment] = useState<PaymentDetails | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // For now, we'll use mock data. Later, this should fetch from your API
    const mockPayment = {
      id: parseInt(params.id),
      student: "John Doe",
      admissionNo: "STD001",
      amount: 15000,
      date: "2024-03-20",
      method: "M-PESA",
      reference: "QWE123",
      status: "completed" as const,
    }
    setPayment(mockPayment)
    setLoading(false)
  }, [params.id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2">Loading payment details...</p>
        </div>
      </div>
    )
  }

  if (!payment) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Payment Not Found</h2>
          <p className="text-gray-600 mt-2">The payment record you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Status Banner */}
        <div className={`mb-6 p-4 rounded-lg ${
          payment.status === 'completed' ? 'bg-green-50 border border-green-200' :
          payment.status === 'pending' ? 'bg-yellow-50 border border-yellow-200' :
          'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-center">
            <CheckCircle2 className={`w-6 h-6 ${
              payment.status === 'completed' ? 'text-green-500' :
              payment.status === 'pending' ? 'text-yellow-500' :
              'text-red-500'
            }`} />
            <div className="ml-3">
              <h3 className="text-sm font-medium capitalize">
                Payment {payment.status}
              </h3>
              <p className="text-sm text-gray-500">
                Reference: {payment.reference}
              </p>
            </div>
          </div>
        </div>

        <Card className="p-6">
          <div className="space-y-6">
            {/* Student Information */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Student Information</h2>
              <div className="flex items-center">
                <UserCircle className="w-5 h-5 text-gray-500 mr-2" />
                <div>
                  <Link 
                    href={`/students/${payment.admissionNo}`}
                    className="font-medium text-blue-600 hover:text-blue-800"
                  >
                    {payment.student}
                  </Link>
                  <p className="text-sm text-gray-500">{payment.admissionNo}</p>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <CreditCard className="w-5 h-5 text-gray-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Amount</p>
                    <p className="font-medium">KES {payment.amount.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-gray-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium">{new Date(payment.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Receipt className="w-5 h-5 text-gray-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Payment Method</p>
                    <p className="font-medium">{payment.method}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            <Button variant="outline">Download Receipt</Button>
            <Button>Print Receipt</Button>
          </div>
        </Card>
      </div>
    </div>
  )
} 