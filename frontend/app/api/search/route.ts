import { NextResponse } from "next/server"

// Mock data - replace with actual database queries
const mockStudents = [
  { id: 1, name: "John Doe", admissionNo: "STD001", class: "Form 4", balance: 25000 },
  { id: 2, name: "Jane Smith", admissionNo: "STD002", class: "Form 3", balance: 15000 },
  { id: 3, name: "Mike Johnson", admissionNo: "STD003", class: "Form 4", balance: 0 },
  { id: 4, name: "Sarah Williams", admissionNo: "STD004", class: "Form 2", balance: 5000 },
  { id: 5, name: "David Brown", admissionNo: "STD005", class: "Form 1", balance: 10000 },
]

const mockPayments = [
  { 
    id: 1, 
    student: "John Doe",
    admissionNo: "STD001",
    amount: 15000,
    date: "2024-03-20",
    method: "M-PESA",
    reference: "QWE123",
  },
  { 
    id: 2, 
    student: "Jane Smith",
    admissionNo: "STD002",
    amount: 12000,
    date: "2024-03-19",
    method: "M-PESA",
    reference: "ASD456",
  },
  { 
    id: 3, 
    student: "Mike Johnson",
    admissionNo: "STD003",
    amount: 18000,
    date: "2024-03-18",
    method: "Bank Transfer",
    reference: "ZXC789",
  },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")?.toLowerCase()

  if (!query) {
    return NextResponse.json({ students: [], payments: [] })
  }

  try {
    // Search in students
    const students = mockStudents.filter(student =>
      student.name.toLowerCase().includes(query) ||
      student.admissionNo.toLowerCase().includes(query) ||
      student.class.toLowerCase().includes(query)
    )

    // Search in payments
    const payments = mockPayments.filter(payment =>
      payment.student.toLowerCase().includes(query) ||
      payment.admissionNo.toLowerCase().includes(query) ||
      payment.reference.toLowerCase().includes(query) ||
      payment.amount.toString().includes(query)
    )

    return NextResponse.json({
      students: students.map(student => ({
        id: student.id,
        name: student.name,
        admissionNo: student.admissionNo,
        class: student.class,
        balance: student.balance,
      })),
      payments: payments.map(payment => ({
        id: payment.id,
        student: payment.student,
        admissionNo: payment.admissionNo,
        amount: payment.amount,
        date: payment.date,
        method: payment.method,
        reference: payment.reference,
      })),
    })
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json(
      { error: "An error occurred while searching" },
      { status: 500 }
    )
  }
} 