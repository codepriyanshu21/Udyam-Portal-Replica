import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import UdyamRegistrationForm from "@/app/page"
import jest from "jest"

// Mock all API calls
global.fetch = jest.fn()

describe("Udyam Registration Form Integration", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(fetch as jest.Mock).mockClear()
  })

  test("complete form flow from Aadhaar to PAN verification", async () => {
    const user = userEvent.setup()

    // Mock successful API responses
    ;(fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, message: "OTP sent successfully" }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, message: "OTP verified successfully" }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: { name: "John Doe", dob: "1990-01-01" } }),
      })

    render(<UdyamRegistrationForm />)

    // Step 1: Aadhaar Verification
    expect(screen.getByText("Aadhaar Verification")).toBeInTheDocument()

    const aadhaarInput = screen.getByLabelText(/aadhaar number/i)
    const mobileInput = screen.getByLabelText(/mobile number/i)

    await user.type(aadhaarInput, "123456789012")
    await user.type(mobileInput, "9876543210")

    const sendOtpButton = screen.getByText(/send otp/i)
    await user.click(sendOtpButton)

    // Wait for OTP input to appear
    await waitFor(() => {
      expect(screen.getByLabelText(/enter otp/i)).toBeInTheDocument()
    })

    const otpInput = screen.getByLabelText(/enter otp/i)
    await user.type(otpInput, "123456")

    const verifyOtpButton = screen.getByText(/verify otp/i)
    await user.click(verifyOtpButton)

    // Wait for next step
    await waitFor(() => {
      expect(screen.getByText(/continue to pan verification/i)).toBeInTheDocument()
    })

    const continueButton = screen.getByText(/continue to pan verification/i)
    await user.click(continueButton)

    // Step 2: PAN Verification
    await waitFor(() => {
      expect(screen.getByText("PAN Verification")).toBeInTheDocument()
    })

    const panInput = screen.getByLabelText(/pan number/i)
    await user.type(panInput, "ABCDE1234F")

    const verifyPanButton = screen.getByText(/verify pan/i)
    await user.click(verifyPanButton)

    // Verify API calls were made
    expect(fetch).toHaveBeenCalledTimes(3)
    expect(fetch).toHaveBeenCalledWith("/api/send-otp", expect.any(Object))
    expect(fetch).toHaveBeenCalledWith("/api/verify-otp", expect.any(Object))
    expect(fetch).toHaveBeenCalledWith("/api/verify-pan", expect.any(Object))
  })
})
