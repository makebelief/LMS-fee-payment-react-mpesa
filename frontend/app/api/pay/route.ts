import { type NextRequest, NextResponse } from "next/server"

// Ensure we have full Node APIs (Buffer, env, etc.)
export const runtime = "nodejs"

// M-Pesa API Configuration with better error handling
const MPESA_CONFIG = {
  consumerKey: process.env.MPESA_CONSUMER_KEY || "",
  consumerSecret: process.env.MPESA_CONSUMER_SECRET || "",
  businessShortCode: process.env.MPESA_BUSINESS_SHORT_CODE || process.env.MPESA_BUSINESS_SHORTCODE || "174379",
  passkey: process.env.MPESA_PASSKEY || "",
  // Using a valid HTTPS callback URL for sandbox
  callbackUrl: "https://mydomain.com/callback",
  environment: process.env.MPESA_ENVIRONMENT || "sandbox",
  baseUrl: process.env.MPESA_BASE_URL || "https://sandbox.safaricom.co.ke",
  transactionType: "CustomerPayBillOnline"
}

// Debug logging (remove in production)
console.log("M-Pesa Config Check:", {
  hasConsumerKey: !!MPESA_CONFIG.consumerKey,
  hasConsumerSecret: !!MPESA_CONFIG.consumerSecret,
  businessShortCode: MPESA_CONFIG.businessShortCode,
  environment: MPESA_CONFIG.environment,
  baseUrl: MPESA_CONFIG.baseUrl,
})

// M-Pesa API URLs
const MPESA_URLS = {
  sandbox: {
    auth: `${MPESA_CONFIG.baseUrl}/oauth/v1/generate?grant_type=client_credentials`,
    stkPush: `${MPESA_CONFIG.baseUrl}/mpesa/stkpush/v1/processrequest`,
  },
  production: {
    auth: "https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
    stkPush: "https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
  },
}

// Get M-Pesa Access Token (now returns detailed errors)
async function getMpesaAccessToken(): Promise<string> {
  const auth = Buffer.from(`${MPESA_CONFIG.consumerKey}:${MPESA_CONFIG.consumerSecret}`).toString("base64")

  const res = await fetch(MPESA_URLS[MPESA_CONFIG.environment].auth, {
    method: "GET",
    headers: {
      // Basic auth per Daraja docs – no Content-Type header needed on GET
      Authorization: `Basic ${auth}`,
      Accept: "application/json",
    },
  })

  // If Safaricom returns an error (400/401/403) read the body to surface it
  if (!res.ok) {
    let bodyText = ""
    try {
      bodyText = await res.text()
    } catch {
      /* ignore */
    }
    throw new Error(`Failed to get access token (${res.status}): ${bodyText || res.statusText || "Unknown error"}`)
  }

  const data = (await res.json()) as { access_token?: string }
  if (!data?.access_token) {
    throw new Error("No access_token field returned from Daraja")
  }
  return data.access_token
}

// Generate M-Pesa Password
function generateMpesaPassword(): { password: string; timestamp: string } {
  const timestamp = new Date()
    .toISOString()
    .replace(/[^0-9]/g, "")
    .slice(0, -3)
  const password = Buffer.from(`${MPESA_CONFIG.businessShortCode}${MPESA_CONFIG.passkey}${timestamp}`).toString(
    "base64",
  )

  return { password, timestamp }
}

// Initiate STK Push with simplified payload
async function initiateSTKPush(accessToken: string, paymentData: any) {
  const { password, timestamp } = generateMpesaPassword()

  const stkPushData = {
    BusinessShortCode: MPESA_CONFIG.businessShortCode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: MPESA_CONFIG.transactionType,
    Amount: parseInt(paymentData.amount),
    PartyA: paymentData.phoneNumber,
    PartyB: MPESA_CONFIG.businessShortCode,
    PhoneNumber: paymentData.phoneNumber,
    CallBackURL: MPESA_CONFIG.callbackUrl,
    AccountReference: paymentData.studentName,
    TransactionDesc: "Fee Payment"
  }

  try {
    console.log("STK Push Data:", stkPushData)
    const response = await fetch(MPESA_URLS[MPESA_CONFIG.environment].stkPush, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(stkPushData),
    })

    const responseData = await response.json()
    console.log("STK Push Response:", responseData)

    if (!response.ok) {
      console.error("STK Push Error Response:", JSON.stringify(responseData, null, 2))
      throw new Error(`STK Push failed: ${response.statusText} - ${JSON.stringify(responseData)}`)
    }

    return responseData
  } catch (error) {
    console.error("Error initiating STK Push:", error)
    throw error
  }
}

// Validate phone number format
function validatePhoneNumber(phoneNumber: string): boolean {
  const phoneRegex = /^254\d{9}$/
  return phoneRegex.test(phoneNumber)
}

// Main API handler
export async function POST(request: NextRequest) {
  try {
    // Check if M-Pesa credentials are configured
    if (!MPESA_CONFIG.consumerKey || !MPESA_CONFIG.consumerSecret || !MPESA_CONFIG.passkey) {
      console.error("Missing M-Pesa credentials:", {
        hasConsumerKey: !!MPESA_CONFIG.consumerKey,
        hasConsumerSecret: !!MPESA_CONFIG.consumerSecret,
        hasPasskey: !!MPESA_CONFIG.passkey,
      })

      return NextResponse.json(
        {
          error: "M-Pesa credentials not configured. Please check your environment variables.",
          details:
            "Missing: " +
            [
              !MPESA_CONFIG.consumerKey && "MPESA_CONSUMER_KEY",
              !MPESA_CONFIG.consumerSecret && "MPESA_CONSUMER_SECRET",
              !MPESA_CONFIG.passkey && "MPESA_PASSKEY",
            ]
              .filter(Boolean)
              .join(", "),
        },
        { status: 500 },
      )
    }

    const body = await request.json()
    const { studentName, phoneNumber, amount } = body

    // Validate required fields
    if (!studentName || !phoneNumber || !amount) {
      return NextResponse.json(
        { error: "Missing required fields: studentName, phoneNumber, and amount are required" },
        { status: 400 },
      )
    }

    // Validate phone number format
    if (!validatePhoneNumber(phoneNumber)) {
      return NextResponse.json({ error: "Invalid phone number format. Use format: 254XXXXXXXXX" }, { status: 400 })
    }

    // Validate amount
    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount. Amount must be a positive number" }, { status: 400 })
    }

    // Get M-Pesa access token
    console.log("Getting M-Pesa access token...")
    const accessToken = await getMpesaAccessToken()

    // Initiate STK Push
    console.log("Initiating STK Push...")
    const stkPushResponse = await initiateSTKPush(accessToken, {
      studentName,
      phoneNumber,
      amount,
    })

    // Check if STK Push was successful
    if (stkPushResponse.ResponseCode === "0") {
      return NextResponse.json({
        success: true,
        message: "Payment request sent successfully",
        checkoutRequestId: stkPushResponse.CheckoutRequestID,
        merchantRequestId: stkPushResponse.MerchantRequestID,
      })
    } else {
      return NextResponse.json(
        { error: stkPushResponse.ResponseDescription || "Payment request failed" },
        { status: 400 },
      )
    }
  } catch (error) {
    console.error("Payment API error:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
