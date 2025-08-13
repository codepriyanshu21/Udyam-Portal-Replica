import { type NextRequest, NextResponse } from "next/server"
import { validateOtpData, MOCK_VALID_CREDENTIALS } from "@/lib/validation"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input data
    const validation = validateOtpData(body)

    if (!validation.isValid) {
      return NextResponse.json(
        {
          success: false,
          errors: validation.errors,
        },
        { status: 400 },
      )
    }

    const { aadhaar_number, mobile_number, otp } = body
    const cleanAadhaar = aadhaar_number.replace(/\s/g, "")

    // Check if credentials match
    const validCredential = MOCK_VALID_CREDENTIALS.aadhaar_otp_pairs.find(
      (cred) => cred.aadhaar === cleanAadhaar && cred.mobile === mobile_number && cred.otp === otp,
    )

    if (!validCredential) {
      return NextResponse.json(
        {
          success: false,
          errors: {
            otp: "Invalid OTP or credentials don't match",
          },
        },
        { status: 400 },
      )
    }

    // Simulate verification delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    return NextResponse.json({
      success: true,
      message: "OTP verified successfully",
      data: {
        aadhaar_verified: true,
        mobile_verified: true,
      },
    })
  } catch (error) {
    console.error("Verify OTP error:", error)
    return NextResponse.json(
      {
        success: false,
        errors: { general: "Internal server error" },
      },
      { status: 500 },
    )
  }
}
