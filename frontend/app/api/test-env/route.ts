import { NextResponse } from "next/server"

export const runtime = "nodejs"

export async function GET() {
  try {
    const requiredVars = {
      MPESA_CONSUMER_KEY: {
        value: process.env.MPESA_CONSUMER_KEY,
        masked: true,
        required: true,
      },
      MPESA_CONSUMER_SECRET: {
        value: process.env.MPESA_CONSUMER_SECRET,
        masked: true,
        required: true,
      },
      MPESA_PASSKEY: {
        value: process.env.MPESA_PASSKEY,
        masked: true,
        required: true,
      },
      MPESA_BUSINESS_SHORT_CODE: {
        value: process.env.MPESA_BUSINESS_SHORT_CODE || process.env.MPESA_BUSINESS_SHORTCODE,
        masked: false,
        required: false,
        default: "174379",
      },
      MPESA_CALLBACK_URL: {
        value: process.env.MPESA_CALLBACK_URL,
        masked: false,
        required: false,
        default: "https://yourdomain.com/api/mpesa/callback",
      },
      MPESA_ENVIRONMENT: {
        value: process.env.MPESA_ENVIRONMENT,
        masked: false,
        required: false,
        default: "sandbox",
      },
    }

    const results = {}
    let hasErrors = false
    let hasWarnings = false

    for (const [key, config] of Object.entries(requiredVars)) {
      const value = config.value
      const hasValue = value && value.trim() !== ""

      if (!hasValue && config.required) {
        results[key] = {
          status: "error",
          message: "Required variable is missing",
          value: null,
        }
        hasErrors = true
      } else if (!hasValue && config.default) {
        results[key] = {
          status: "warning",
          message: `Using default value: ${config.default}`,
          value: config.default,
          masked: config.masked,
        }
        hasWarnings = true
      } else if (hasValue) {
        results[key] = {
          status: "success",
          message: "Variable is set",
          value: config.masked ? value.substring(0, 8) + "..." : value,
          masked: config.masked,
        }
      } else {
        results[key] = {
          status: "error",
          message: "Variable is not set",
          value: null,
        }
        hasErrors = true
      }
    }

    let overall = "success"
    let message = "All environment variables are properly configured"

    if (hasErrors) {
      overall = "error"
      message = "Some required environment variables are missing"
    } else if (hasWarnings) {
      overall = "warning"
      message = "Some variables are using default values"
    }

    return NextResponse.json({
      overall,
      message,
      variables: results,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Environment check error:", error)
    return NextResponse.json({ error: "Failed to check environment variables" }, { status: 500 })
  }
}
