import { type NextRequest, NextResponse } from "next/server"
import { validateCompleteForm } from "@/lib/validation"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate complete form data
    const validation = validateCompleteForm(body)

    if (!validation.isValid) {
      return NextResponse.json(
        {
          success: false,
          errors: validation.errors,
        },
        { status: 400 },
      )
    }

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Generate mock Udyam registration number
    const registrationNumber = `UDYAM-${Date.now().toString().slice(-8)}`

    // In real implementation, you would:
    // 1. Save to database
    // 2. Generate official registration certificate
    // 3. Send confirmation email/SMS
    // 4. Update government records

    const registrationData = {
      registration_number: registrationNumber,
      status: "APPROVED",
      registered_date: new Date().toISOString(),
      applicant_details: {
        aadhaar_number: body.aadhaar_number.replace(/\d(?=\d{4})/g, "X"),
        mobile_number: body.mobile_number,
        pan_number: body.pan_number,
        name_as_per_pan: body.name_as_per_pan,
        date_of_birth: body.date_of_birth,
      },
    }

    return NextResponse.json({
      success: true,
      message: "Registration completed successfully",
      data: registrationData,
    })
  } catch (error) {
    console.error("Submit registration error:", error)
    return NextResponse.json(
      {
        success: false,
        errors: { general: "Internal server error" },
      },
      { status: 500 },
    )
  }
}
