"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Users, CreditCard, Clock, ArrowRight, DollarSign } from "lucide-react"

// Mock data - replace with actual API calls
const mockDashboardData = {
  totalStudents: 1247,
  totalPaymentsToday: 23,
  pendingPayments: 8,
  totalRevenue: 2450000,
  recentPayments: [
    { id: 1, student: "John Doe", amount: 15000, status: "completed", time: "2 hours ago" },
    { id: 2, student: "Jane Smith", amount: 12000, status: "completed", time: "3 hours ago" },
    { id: 3, student: "Mike Johnson", amount: 18000, status: "pending", time: "5 hours ago" },
  ],
}

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState(mockDashboardData)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    const fetchDashboardData = async () => {
      try {
        setTimeout(() => {
          setDashboardData(mockDashboardData)
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Students</p>
                <p className="text-3xl font-bold">{dashboardData.totalStudents.toLocaleString()}</p>
              </div>
              <Users className="w-8 h-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Payments Today</p>
                <p className="text-3xl font-bold">{dashboardData.totalPaymentsToday}</p>
              </div>
              <CreditCard className="w-8 h-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Pending Payments</p>
                <p className="text-3xl font-bold">{dashboardData.pendingPayments}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Total Revenue</p>
                <p className="text-3xl font-bold">KES {(dashboardData.totalRevenue / 1000000).toFixed(1)}M</p>
              </div>
              <DollarSign className="w-8 h-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/payment">
              <Button className="w-full justify-between bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
                Process New Payment
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/students">
              <Button variant="outline" className="w-full justify-between bg-transparent">
                View All Students
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/history">
              <Button variant="outline" className="w-full justify-between bg-transparent">
                Payment History
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Payments</CardTitle>
            <CardDescription>Latest payment transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.recentPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{payment.student}</p>
                    <p className="text-sm text-gray-600">{payment.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">KES {payment.amount.toLocaleString()}</p>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        payment.status === "completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {payment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/history">
              <Button variant="ghost" className="w-full mt-4">
                View All Payments
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
