import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import AadhaarVerificationStep from "@/components/aadhaar-verification-step"
import jest from "jest" // Import jest to declare the variable

// Mock fetch
global.fetch = jest.fn()

describe("AadhaarVerificationStep", () => {
  const mockProps = {
    formData: {
      aadhaar: "",
      mobile: "",
      otp: "",
      isOtpSent: false,
      isOtpVerified: false,
    },
    updateFormData: jest.fn(),
    onNext: jest.fn(),
    isLoading: false,
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(fetch as jest.Mock).mockClear()
  })

  test("renders Aadhaar verification form", () => {
    render(<AadhaarVerificationStep {...mockProps} />)

    expect(screen.getByText("Aadhaar Verification")).toBeInTheDocument()
    expect(screen.getByLabelText(/aadhaar number/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/mobile number/i)).toBeInTheDocument()
  })

  test("validates Aadhaar number format", async () => {
    const user = userEvent.setup()
    render(<AadhaarVerificationStep {...mockProps} />)

    const aadhaarInput = screen.getByLabelText(/aadhaar number/i)
    await user.type(aadhaarInput, "12345")

    expect(screen.getByText(/aadhaar number must be 12 digits/i)).toBeInTheDocument()
  })

  test("validates mobile number format", async () => {
    const user = userEvent.setup()
    render(<AadhaarVerificationStep {...mockProps} />)

    const mobileInput = screen.getByLabelText(/mobile number/i)
    await user.type(mobileInput, "12345")

    expect(screen.getByText(/mobile number must be 10 digits/i)).toBeInTheDocument()
  })

  test("sends OTP when valid data is entered", async () => {
    const user = userEvent.setup()
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    })

    render(<AadhaarVerificationStep {...mockProps} />)

    const aadhaarInput = screen.getByLabelText(/aadhaar number/i)
    const mobileInput = screen.getByLabelText(/mobile number/i)

    await user.type(aadhaarInput, "123456789012")
    await user.type(mobileInput, "9876543210")

    const sendOtpButton = screen.getByText(/send otp/i)
    await user.click(sendOtpButton)

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith("/api/send-otp", expect.any(Object))
    })
  })

  test("shows OTP input after OTP is sent", () => {
    const propsWithOtpSent = {
      ...mockProps,
      formData: { ...mockProps.formData, isOtpSent: true },
    }

    render(<AadhaarVerificationStep {...propsWithOtpSent} />)

    expect(screen.getByLabelText(/enter otp/i)).toBeInTheDocument()
    expect(screen.getByText(/verify otp/i)).toBeInTheDocument()
  })
})
