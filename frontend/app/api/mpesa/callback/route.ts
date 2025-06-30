import { type NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"

// M-Pesa Callback Handler - Updated path to match your callback URL
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    console.log("M-Pesa Callback received:", JSON.stringify(body, null, 2))

    // Extract callback data
    const { Body } = body
    const { stkCallback } = Body

    if (stkCallback) {
      const { MerchantRequestID, CheckoutRequestID, ResultCode, ResultDesc } = stkCallback

      if (ResultCode === 0) {
        // Payment successful
        console.log("Payment successful:", {
          MerchantRequestID,
          CheckoutRequestID,
          ResultDesc,
        })

        // Extract payment details
        const callbackMetadata = stkCallback.CallbackMetadata
        if (callbackMetadata && callbackMetadata.Item) {
          const paymentDetails = {}
          callbackMetadata.Item.forEach((item) => {
            switch (item.Name) {
              case "Amount":
                paymentDetails.amount = item.Value
                break
              case "MpesaReceiptNumber":
                paymentDetails.receiptNumber = item.Value
                break
              case "TransactionDate":
                paymentDetails.transactionDate = item.Value
                break
              case "PhoneNumber":
                paymentDetails.phoneNumber = item.Value
                break
            }
          })

          console.log("Payment details:", paymentDetails)

          // Here you would typically:
          // 1. Save payment details to your database
          // 2. Update student fee records
          // 3. Send confirmation email/SMS
          // 4. Update payment status in your system

          // Example: Update payment status in database
          // await updatePaymentStatus({
          //   merchantRequestId: MerchantRequestID,
          //   checkoutRequestId: CheckoutRequestID,
          //   status: 'completed',
          //   receiptNumber: paymentDetails.receiptNumber,
          //   amount: paymentDetails.amount,
          //   transactionDate: paymentDetails.transactionDate
          // })
        }
      } else {
        // Payment failed or cancelled
        console.log("Payment failed:", {
          MerchantRequestID,
          CheckoutRequestID,
          ResultCode,
          ResultDesc,
        })

        // Handle failed payment
        // await updatePaymentStatus({
        //   merchantRequestId: MerchantRequestID,
        //   checkoutRequestId: CheckoutRequestID,
        //   status: 'failed',
        //   errorMessage: ResultDesc
        // })
      }
    }

    // Always return success to M-Pesa to acknowledge receipt
    return NextResponse.json({
      ResultCode: 0,
      ResultDesc: "Callback received successfully",
    })
  } catch (error) {
    console.error("Callback processing error:", error)

    // Still return success to M-Pesa to avoid retries
    return NextResponse.json({
      ResultCode: 0,
      ResultDesc: "Callback processed with errors",
    })
  }
}
