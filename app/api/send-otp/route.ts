import { type NextRequest, NextResponse } from "next/server"
import { validateAadhaarData, MOCK_VALID_CREDENTIALS } from "@/lib/validation"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input data
    const validation = validateAadhaarData(body)

    if (!validation.isValid) {
      return NextResponse.json(
        {
          success: false,
          errors: validation.errors,
        },
        { status: 400 },
      )
    }

    const { aadhaar_number, mobile_number } = body
    const cleanAadhaar = aadhaar_number.replace(/\s/g, "")

    // Check if Aadhaar exists in mock database
    const validCredential = MOCK_VALID_CREDENTIALS.aadhaar_otp_pairs.find(
      (cred) => cred.aadhaar === cleanAadhaar && cred.mobile === mobile_number,
    )

    if (!validCredential) {
      return NextResponse.json(
        {
          success: false,
          errors: {
            aadhaar_number: "Aadhaar number not found or mobile number doesn't match",
          },
        },
        { status: 400 },
      )
    }

    // Simulate OTP sending delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In real implementation, you would:
    // 1. Generate random OTP
    // 2. Store OTP with expiration time
    // 3. Send SMS via SMS gateway
    // 4. Return success without revealing OTP

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully",
      // In production, never return the OTP
      debug_otp: process.env.NODE_ENV === "development" ? validCredential.otp : undefined,
    })
  } catch (error) {
    console.error("Send OTP error:", error)
    return NextResponse.json(
      {
        success: false,
        errors: { general: "Internal server error" },
      },
      { status: 500 },
    )
  }
}
