"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle, XCircle, Smartphone } from "lucide-react"
import Link from "next/link"

export default function StudentPaymentPage() {
  const [formData, setFormData] = useState({
    studentName: "",
    phoneNumber: "",
    amount: "",
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: "", content: "" })
  const [errors, setErrors] = useState({})

  // Form validation
  const validateForm = () => {
    const newErrors = {}

    if (!formData.studentName.trim()) {
      newErrors.studentName = "Student name is required"
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required"
    } else if (!/^254\d{9}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be in format 254XXXXXXXXX"
    }

    if (!formData.amount.trim()) {
      newErrors.amount = "Amount is required"
    } else if (isNaN(formData.amount) || Number.parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Amount must be a valid positive number"
    } else if (Number.parseFloat(formData.amount) < 1) {
      newErrors.amount = "Minimum amount is KES 1"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  // Handle M-Pesa payment
  const handlePayment = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)
    setMessage({ type: "", content: "" })

    try {
      const response = await fetch("/api/pay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentName: formData.studentName,
          phoneNumber: formData.phoneNumber,
          amount: Number.parseFloat(formData.amount),
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({
          type: "success",
          content: `Payment request sent successfully! Check your phone (${formData.phoneNumber}) for M-Pesa prompt.`,
        })
        // Reset form on success
        setFormData({ studentName: "", phoneNumber: "", amount: "" })
      } else {
        setMessage({
          type: "error",
          content: data.error || "Payment failed. Please try again.",
        })
      }
    } catch (error) {
      console.error("Payment error:", error)
      setMessage({
        type: "error",
        content: "Network error. Please check your connection and try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link href="/dashboard" className="flex items-center text-sm text-gray-600 hover:text-gray-900">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Dashboard
        </Link>
      </div>

      <Card className="shadow-lg">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mb-4">
            <Smartphone className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">Student Fee Payment</CardTitle>
          <CardDescription className="text-gray-600">Pay your school fees securely with M-Pesa</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handlePayment} className="space-y-4">
            {/* Student Name */}
            <div className="space-y-2">
              <Label htmlFor="studentName" className="text-sm font-medium text-gray-700">
                Student Name
              </Label>
              <Input
                id="studentName"
                name="studentName"
                type="text"
                placeholder="Enter full name"
                value={formData.studentName}
                onChange={handleInputChange}
                className={`${errors.studentName ? "border-red-500" : "border-gray-300"} focus:border-orange-500 focus:ring-orange-500`}
                disabled={loading}
              />
              {errors.studentName && <p className="text-sm text-red-600">{errors.studentName}</p>}
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">
                M-Pesa Phone Number
              </Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                placeholder="254712345678"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className={`${errors.phoneNumber ? "border-red-500" : "border-gray-300"} focus:border-orange-500 focus:ring-orange-500`}
                disabled={loading}
              />
              {errors.phoneNumber && <p className="text-sm text-red-600">{errors.phoneNumber}</p>}
              <p className="text-xs text-gray-500">Format: 254XXXXXXXXX</p>
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-sm font-medium text-gray-700">
                Amount (KES)
              </Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                placeholder="0.00"
                min="1"
                step="0.01"
                value={formData.amount}
                onChange={handleInputChange}
                className={`${errors.amount ? "border-red-500" : "border-gray-300"} focus:border-orange-500 focus:ring-orange-500`}
                disabled={loading}
              />
              {errors.amount && <p className="text-sm text-red-600">{errors.amount}</p>}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing Payment...
                </>
              ) : (
                <>
                  <Smartphone className="w-4 h-4 mr-2" />
                  Pay with M-Pesa
                </>
              )}
            </Button>
          </form>

          {/* Status Messages */}
          {message.content && (
            <Alert
              className={`${message.type === "success" ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"}`}
            >
              {message.type === "success" ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600" />
              )}
              <AlertDescription className={`${message.type === "success" ? "text-green-800" : "text-red-800"}`}>
                {message.content}
              </AlertDescription>
            </Alert>
          )}

          {/* Info Section */}
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <h3 className="font-semibold text-orange-800 mb-2">How it works:</h3>
            <ol className="text-sm text-orange-700 space-y-1">
              <li>1. Enter your details and amount</li>
              <li>2. Click "Pay with M-Pesa"</li>
              <li>3. Check your phone for M-Pesa prompt</li>
              <li>4. Enter your M-Pesa PIN to complete</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
