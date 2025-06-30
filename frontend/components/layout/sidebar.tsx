"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, CreditCard, History, Users, FileText, Settings, GraduationCap, TestTube } from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Make Payment", href: "/payment", icon: CreditCard },
  { name: "Payment History", href: "/history", icon: History },
  { name: "Students", href: "/students", icon: Users },
  { name: "Receipts", href: "/receipts", icon: FileText },
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "Test Environment", href: "/test-env", icon: TestTube },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-white shadow-lg h-screen">
      <div className="p-6 border-b">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">EduPay LMS</h1>
            <p className="text-sm text-gray-600">Fee Management</p>
          </div>
        </div>
      </div>

      <nav className="mt-6">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-orange-50 text-orange-600 border-r-2 border-orange-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
