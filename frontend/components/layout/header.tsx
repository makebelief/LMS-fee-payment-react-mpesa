"use client"

import { useState, useEffect, useRef } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Bell, Search, User, X, LogOut, Settings, UserCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import Link from "next/link"

const pageNames = {
  "/": "Dashboard",
  "/dashboard": "Dashboard",
  "/payment": "Make Payment",
  "/history": "Payment History",
  "/students": "Students",
  "/receipts": "Receipts",
  "/settings": "Settings",
}

export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const searchRef = useRef<HTMLDivElement>(null)
  const currentPage = pageNames[pathname] || "Dashboard"
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  useEffect(() => {
    fetchNotifications()
    // Close dropdowns when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchResults(null)
        setSearchQuery("")
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications')
      const data = await response.json()
      setNotifications(data)
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    }
  }

  const markNotificationAsRead = async (id: number) => {
    try {
      await fetch(`/api/notifications/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ unread: false }),
      })
      await fetchNotifications() // Refresh notifications
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    if (query.trim().length === 0) {
      setSearchResults(null)
      return
    }

    setIsSearching(true)
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
      const data = await response.json()

      if (response.ok) {
        setSearchResults(data)
      } else {
        console.error("Search failed:", data.error)
        setSearchResults({ students: [], payments: [] })
      }
    } catch (error) {
      console.error("Search error:", error)
      setSearchResults({ students: [], payments: [] })
    } finally {
      setIsSearching(false)
    }
  }

  const handleDirectSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
      const data = await response.json()

      if (response.ok) {
        if (data.students.length > 0) {
          router.push(`/students/${data.students[0].id}`)
          clearSearch()
        } else if (data.payments.length > 0) {
          router.push(`/history/${data.payments[0].id}`)
          clearSearch()
        }
      }
    } catch (error) {
      console.error("Direct search error:", error)
    } finally {
      setIsSearching(false)
    }
  }

  const clearSearch = () => {
    setSearchQuery("")
    setSearchResults(null)
  }

  const handleLogout = () => {
    // Implement logout logic here
    router.push('/login')
  }

  return (
    <header className="bg-white shadow-sm border-b px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{currentPage}</h2>
          <p className="text-sm text-gray-600">
            {pathname === "/" || pathname === "/dashboard"
              ? "Welcome to your fee management dashboard"
              : `Manage ${currentPage.toLowerCase()}`}
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative" ref={searchRef}>
            <div className="flex items-center">
              <div className="relative flex-1">
                <Input
                  placeholder="Search students or payments..."
                  className="pl-10 pr-10 w-80"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleDirectSearch()
                    }
                  }}
                />
                {isSearching ? (
                  <Loader2 className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 animate-spin" />
                ) : (
                  <Search 
                    className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer hover:text-gray-600"
                    onClick={handleDirectSearch}
                  />
                )}
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Search Results Dropdown */}
            {searchResults && (
              <Card className="absolute mt-2 w-full bg-white shadow-lg rounded-md overflow-hidden z-50">
                <div className="max-h-96 overflow-y-auto">
                  {/* Students Section */}
                  {searchResults.students.length > 0 && (
                    <div className="p-2">
                      <h3 className="text-sm font-semibold text-gray-600 px-2 py-1">Students</h3>
                      {searchResults.students.map((student: any) => (
                        <Link
                          key={student.id}
                          href={`/students/${student.id}`}
                          className="block px-4 py-2 hover:bg-gray-50 rounded-md"
                          onClick={clearSearch}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="font-medium">{student.name}</span>
                              <div className="text-sm text-gray-500">{student.admissionNo}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm">{student.class}</div>
                              <div className={`text-sm ${student.balance > 0 ? 'text-red-500' : 'text-green-500'}`}>
                                {student.balance > 0 ? `Balance: ${student.balance}` : 'Cleared'}
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Payments Section */}
                  {searchResults.payments.length > 0 && (
                    <div className="p-2 border-t">
                      <h3 className="text-sm font-semibold text-gray-600 px-2 py-1">Payments</h3>
                      {searchResults.payments.map((payment: any) => (
                        <Link
                          key={payment.id}
                          href={`/history/${payment.id}`}
                          className="block px-4 py-2 hover:bg-gray-50 rounded-md"
                          onClick={clearSearch}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="font-medium">{payment.student}</span>
                              <div className="text-sm text-gray-500">{payment.admissionNo}</div>
                              <div className="text-xs text-gray-400">Ref: {payment.reference}</div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">KES {payment.amount.toLocaleString()}</div>
                              <div className="text-sm text-gray-500">{payment.method}</div>
                              <div className="text-xs text-gray-400">{new Date(payment.date).toLocaleDateString()}</div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Loading State */}
                  {isSearching && (
                    <div className="p-4 text-center text-gray-500">
                      <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />
                      Searching...
                    </div>
                  )}

                  {/* No Results */}
                  {!isSearching && searchResults.students.length === 0 && searchResults.payments.length === 0 && (
                    <div className="p-4 text-center text-gray-500">
                      No results found for "{searchQuery}"
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>

          {/* Notifications Button and Dropdown */}
          <div className="relative">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => {
                setShowNotifications(!showNotifications)
                setShowProfileMenu(false)
              }}
              className="relative"
            >
              <Bell className="w-5 h-5" />
              {notifications.some((n: any) => n.unread) && (
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full" />
              )}
            </Button>

            {showNotifications && (
              <Card className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-md overflow-hidden z-50">
                <div className="p-2">
                  <h3 className="text-sm font-semibold text-gray-600 px-2 py-1 border-b">
                    Notifications
                  </h3>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notification: any) => (
                        <div
                          key={notification.id}
                          className={`p-3 hover:bg-gray-50 cursor-pointer ${
                            notification.unread ? 'bg-blue-50' : ''
                          }`}
                          onClick={() => markNotificationAsRead(notification.id)}
                        >
                          <div className="font-medium text-sm">{notification.title}</div>
                          <div className="text-sm text-gray-600">{notification.message}</div>
                          <div className="text-xs text-gray-400 mt-1">
                            {new Date(notification.time).toLocaleString()}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        No notifications
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Profile Button and Dropdown */}
          <div className="relative">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => {
                setShowProfileMenu(!showProfileMenu)
                setShowNotifications(false)
              }}
            >
              <User className="w-5 h-5" />
            </Button>

            {showProfileMenu && (
              <Card className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md overflow-hidden z-50">
                <div className="py-1">
                  <Link
                    href="/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <UserCircle className="w-4 h-4 mr-2" />
                    Your Profile
                  </Link>
                  <Link
                    href="/settings"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
