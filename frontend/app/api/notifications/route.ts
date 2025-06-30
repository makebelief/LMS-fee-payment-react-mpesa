import { NextResponse } from "next/server"

// Mock database - replace with actual database
let notifications = [
  {
    id: 1,
    title: "New Payment",
    message: "John Doe made a payment of KES 15,000",
    time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    unread: true,
  },
  {
    id: 2,
    title: "Payment Due",
    message: "Fee payment deadline approaching for 5 students",
    time: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    unread: true,
  },
  {
    id: 3,
    title: "System Update",
    message: "New features have been added to the system",
    time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    unread: false,
  },
]

// GET /api/notifications
export async function GET() {
  return NextResponse.json(notifications)
}

// PATCH /api/notifications/:id
export async function PATCH(request: Request) {
  const id = parseInt(request.url.split('/').pop() || '')
  const { unread } = await request.json()

  notifications = notifications.map(notification =>
    notification.id === id ? { ...notification, unread } : notification
  )

  return NextResponse.json({ success: true })
} 