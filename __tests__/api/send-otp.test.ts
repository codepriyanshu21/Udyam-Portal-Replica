import { POST } from "@/app/api/send-otp/route"
import { NextRequest } from "next/server"
import jest from "jest"

// Mock Supabase
jest.mock("@/lib/supabase/client", () => ({
  supabase: {
    from: jest.fn(() => ({
      insert: jest.fn(() => Promise.resolve({ data: null, error: null })),
      select: jest.fn(() => Promise.resolve({ data: [], error: null })),
    })),
  },
}))

describe("/api/send-otp", () => {
  test("should send OTP for valid mobile number", async () => {
    const request = new NextRequest("http://localhost:3000/api/send-otp", {
      method: "POST",
      body: JSON.stringify({ mobile: "9876543210" }),
      headers: { "Content-Type": "application/json" },
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.message).toContain("OTP sent successfully")
  })

  test("should reject invalid mobile number", async () => {
    const request = new NextRequest("http://localhost:3000/api/send-otp", {
      method: "POST",
      body: JSON.stringify({ mobile: "12345" }),
      headers: { "Content-Type": "application/json" },
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.success).toBe(false)
    expect(data.error).toContain("Invalid mobile number")
  })

  test("should handle missing mobile number", async () => {
    const request = new NextRequest("http://localhost:3000/api/send-otp", {
      method: "POST",
      body: JSON.stringify({}),
      headers: { "Content-Type": "application/json" },
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.success).toBe(false)
    expect(data.error).toContain("Mobile number is required")
  })
})
