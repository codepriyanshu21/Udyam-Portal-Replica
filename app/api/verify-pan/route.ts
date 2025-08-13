import { type NextRequest, NextResponse } from "next/server"
import { validatePanData, MOCK_VALID_CREDENTIALS } from "@/lib/validation"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input data
    const validation = validatePanData(body)

    if (!validation.isValid) {
      return NextResponse.json(
        {
          success: false,
          errors: validation.errors,
        },
        { status: 400 },
      )
    }

    const { pan_number, name_as_per_pan, date_of_birth } = body

    // Check if PAN details match
    const validPan = MOCK_VALID_CREDENTIALS.pan_details.find(
      (pan) =>
        pan.pan.toLowerCase() === pan_number.toLowerCase() &&
        pan.name.toLowerCase() === name_as_per_pan.toLowerCase() &&
        pan.dob === date_of_birth,
    )

    if (!validPan) {
      return NextResponse.json(
        {
          success: false,
          errors: {
            pan_number: "PAN details don't match our records",
          },
        },
        { status: 400 },
      )
    }

    // Simulate PAN verification delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    return NextResponse.json({
      success: true,
      message: "PAN verified successfully",
      data: {
        pan_verified: true,
        name_verified: true,
        dob_verified: true,
      },
    })
  } catch (error) {
    console.error("Verify PAN error:", error)
    return NextResponse.json(
      {
        success: false,
        errors: { general: "Internal server error" },
      },
      { status: 500 },
    )
  }
}
