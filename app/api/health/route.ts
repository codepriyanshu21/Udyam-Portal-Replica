import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    endpoints: {
      "POST /api/send-otp": "Send OTP to mobile number",
      "POST /api/verify-otp": "Verify OTP for Aadhaar",
      "POST /api/verify-pan": "Verify PAN details",
      "POST /api/submit-registration": "Submit complete registration",
    },
    mock_credentials: {
      aadhaar_otp: [
        { aadhaar: "123456789012", mobile: "9876543210", otp: "123456" },
        { aadhaar: "987654321098", mobile: "8765432109", otp: "654321" },
      ],
      pan_details: [
        { pan: "ABCDE1234F", name: "John Doe", dob: "1990-01-01" },
        { pan: "FGHIJ5678K", name: "Jane Smith", dob: "1985-05-15" },
      ],
    },
  })
}
