"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Search, Download, Eye, Printer } from "lucide-react"

// Mock receipt data
const mockReceipts = [
  {
    id: 1,
    receiptNumber: "RCP-2024-001",
    studentName: "John Doe",
    studentId: "STU001",
    amount: 15000,
    paymentMethod: "M-Pesa",
    transactionId: "MPE123456789",
    date: "2024-01-15T10:30:00Z",
    status: "paid",
    description: "Tuition Fee - Semester 1",
  },
  {
    id: 2,
    receiptNumber: "RCP-2024-002",
    studentName: "Jane Smith",
    studentId: "STU002",
    amount: 12000,
    paymentMethod: "M-Pesa",
    transactionId: "MPE987654321",
    date: "2024-01-15T09:15:00Z",
    status: "paid",
    description: "Library Fee + Lab Fee",
  },
  {
    id: 3,
    receiptNumber: "RCP-2024-003",
    studentName: "David Brown",
    studentId: "STU005",
    amount: 14000,
    paymentMethod: "M-Pesa",
    transactionId: "MPE456789123",
    date: "2024-01-14T14:10:00Z",
    status: "paid",
    description: "Examination Fee",
  },
]

export default function ReceiptsPage() {
  const [receipts, setReceipts] = useState(mockReceipts)
  const [filteredReceipts, setFilteredReceipts] = useState(mockReceipts)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedReceipt, setSelectedReceipt] = useState(null)

  const handleSearch = (term) => {
    setSearchTerm(term)
    if (term) {
      const filtered = receipts.filter(
        (receipt) =>
          receipt.receiptNumber.toLowerCase().includes(term.toLowerCase()) ||
          receipt.studentName.toLowerCase().includes(term.toLowerCase()) ||
          receipt.studentId.toLowerCase().includes(term.toLowerCase()) ||
          receipt.transactionId.toLowerCase().includes(term.toLowerCase()),
      )
      setFilteredReceipts(filtered)
    } else {
      setFilteredReceipts(receipts)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const generatePDF = (receipt) => {
    // Mock PDF generation
    alert(`Generating PDF for receipt ${receipt.receiptNumber}`)
  }

  const printReceipt = (receipt) => {
    // Mock print functionality
    const printWindow = window.open("", "_blank")
    printWindow.document.write(`
      <html>
        <head>
          <title>Receipt ${receipt.receiptNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .receipt-details { margin: 20px 0; }
            .amount { font-size: 24px; font-weight: bold; color: #059669; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>EduPay LMS</h1>
            <h2>Payment Receipt</h2>
          </div>
          <div class="receipt-details">
            <p><strong>Receipt Number:</strong> ${receipt.receiptNumber}</p>
            <p><strong>Student:</strong> ${receipt.studentName} (${receipt.studentId})</p>
            <p><strong>Amount:</strong> <span class="amount">KES ${receipt.amount.toLocaleString()}</span></p>
            <p><strong>Payment Method:</strong> ${receipt.paymentMethod}</p>
            <p><strong>Transaction ID:</strong> ${receipt.transactionId}</p>
            <p><strong>Date:</strong> ${formatDate(receipt.date)}</p>
            <p><strong>Description:</strong> ${receipt.description}</p>
          </div>
          <div style="margin-top: 50px; text-align: center; color: #666;">
            <p>Thank you for your payment!</p>
          </div>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Payment Receipts</h2>
        <p className="text-gray-600">View, download, and print payment receipts</p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Label htmlFor="search">Search Receipts</Label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search by receipt number, student name, or transaction ID..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Showing {filteredReceipts.length} of {receipts.length} receipts
            </p>
          </div>

          {/* Receipts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReceipts.map((receipt) => (
              <Card key={receipt.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{receipt.receiptNumber}</CardTitle>
                      <CardDescription>{formatDate(receipt.date)}</CardDescription>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Paid</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="font-semibold text-gray-900">{receipt.studentName}</p>
                    <p className="text-sm text-gray-600">{receipt.studentId}</p>
                  </div>

                  <div>
                    <p className="text-2xl font-bold text-green-600">KES {receipt.amount.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">{receipt.description}</p>
                  </div>

                  <div className="text-sm text-gray-600">
                    <p>
                      <strong>Method:</strong> {receipt.paymentMethod}
                    </p>
                    <p>
                      <strong>Transaction:</strong> {receipt.transactionId}
                    </p>
                  </div>

                  <div className="flex gap-2 pt-4 border-t">
                    <Button variant="outline" size="sm" onClick={() => printReceipt(receipt)} className="flex-1">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => generatePDF(receipt)} className="flex-1">
                      <Download className="w-4 h-4 mr-1" />
                      PDF
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => printReceipt(receipt)}>
                      <Printer className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredReceipts.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No receipts found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
