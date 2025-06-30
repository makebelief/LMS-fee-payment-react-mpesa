"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Search, Download, Eye } from "lucide-react"

// Mock payment data
const mockPayments = [
  {
    id: 1,
    studentName: "John Doe",
    phoneNumber: "254712345678",
    amount: 15000,
    status: "completed",
    date: "2024-01-15T10:30:00Z",
    receiptNumber: "MPE123456789",
    transactionId: "ws_CO_123456789",
  },
  {
    id: 2,
    studentName: "Jane Smith",
    phoneNumber: "254723456789",
    amount: 12000,
    status: "completed",
    date: "2024-01-15T09:15:00Z",
    receiptNumber: "MPE987654321",
    transactionId: "ws_CO_987654321",
  },
  {
    id: 3,
    studentName: "Mike Johnson",
    phoneNumber: "254734567890",
    amount: 18000,
    status: "pending",
    date: "2024-01-15T08:45:00Z",
    receiptNumber: null,
    transactionId: "ws_CO_456789123",
  },
  {
    id: 4,
    studentName: "Sarah Wilson",
    phoneNumber: "254745678901",
    amount: 20000,
    status: "failed",
    date: "2024-01-14T16:20:00Z",
    receiptNumber: null,
    transactionId: "ws_CO_789123456",
  },
  {
    id: 5,
    studentName: "David Brown",
    phoneNumber: "254756789012",
    amount: 14000,
    status: "completed",
    date: "2024-01-14T14:10:00Z",
    receiptNumber: "MPE456789123",
    transactionId: "ws_CO_321654987",
  },
]

export default function PaymentHistoryPage() {
  const [payments, setPayments] = useState(mockPayments)
  const [filteredPayments, setFilteredPayments] = useState(mockPayments)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Filter payments based on search term and status
    let filtered = payments

    if (searchTerm) {
      filtered = filtered.filter(
        (payment) =>
          payment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.phoneNumber.includes(searchTerm) ||
          payment.receiptNumber?.includes(searchTerm),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((payment) => payment.status === statusFilter)
    }

    setFilteredPayments(filtered)
  }, [searchTerm, statusFilter, payments])

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { variant: "default", className: "bg-green-100 text-green-800", label: "Completed" },
      pending: { variant: "secondary", className: "bg-yellow-100 text-yellow-800", label: "Pending" },
      failed: { variant: "destructive", className: "bg-red-100 text-red-800", label: "Failed" },
    }

    const config = statusConfig[status] || statusConfig.pending
    return <Badge className={config.className}>{config.label}</Badge>
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleExport = () => {
    // Mock export functionality
    const csvContent = [
      ["Student Name", "Phone Number", "Amount", "Status", "Date", "Receipt Number"],
      ...filteredPayments.map((payment) => [
        payment.studentName,
        payment.phoneNumber,
        payment.amount,
        payment.status,
        formatDate(payment.date),
        payment.receiptNumber || "N/A",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "payment-history.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>View and manage all payment transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search by name, phone, or receipt number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="w-full md:w-48">
              <Label htmlFor="status">Status Filter</Label>
              <select
                id="status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            <div className="flex items-end">
              <Button onClick={handleExport} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Showing {filteredPayments.length} of {payments.length} payments
            </p>
          </div>

          {/* Payments Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Student</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Phone</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Amount</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Receipt</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{payment.studentName}</p>
                        <p className="text-sm text-gray-500">ID: {payment.transactionId}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-700">{payment.phoneNumber}</td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-gray-900">KES {payment.amount.toLocaleString()}</span>
                    </td>
                    <td className="py-3 px-4">{getStatusBadge(payment.status)}</td>
                    <td className="py-3 px-4 text-gray-700">{formatDate(payment.date)}</td>
                    <td className="py-3 px-4">
                      {payment.receiptNumber ? (
                        <span className="text-sm font-mono text-gray-600">{payment.receiptNumber}</span>
                      ) : (
                        <span className="text-sm text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredPayments.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No payments found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
