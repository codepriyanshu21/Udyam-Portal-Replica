import {
  validateAadhaar,
  validatePAN,
  validateMobile,
  validateEmail,
  validatePincode,
  validateOTP,
} from "@/lib/validation"

describe("Validation Functions", () => {
  describe("validateAadhaar", () => {
    test("should validate correct Aadhaar numbers", () => {
      expect(validateAadhaar("123456789012")).toBe(true)
      expect(validateAadhaar("987654321098")).toBe(true)
    })

    test("should reject invalid Aadhaar numbers", () => {
      expect(validateAadhaar("12345678901")).toBe(false) // 11 digits
      expect(validateAadhaar("1234567890123")).toBe(false) // 13 digits
      expect(validateAadhaar("12345678901a")).toBe(false) // contains letter
      expect(validateAadhaar("")).toBe(false) // empty
    })
  })

  describe("validatePAN", () => {
    test("should validate correct PAN numbers", () => {
      expect(validatePAN("ABCDE1234F")).toBe(true)
      expect(validatePAN("XYZAB9876C")).toBe(true)
    })

    test("should reject invalid PAN numbers", () => {
      expect(validatePAN("ABCDE1234")).toBe(false) // 9 characters
      expect(validatePAN("ABCDE1234FG")).toBe(false) // 11 characters
      expect(validatePAN("12345ABCDE")).toBe(false) // wrong format
      expect(validatePAN("")).toBe(false) // empty
    })
  })

  describe("validateMobile", () => {
    test("should validate correct mobile numbers", () => {
      expect(validateMobile("9876543210")).toBe(true)
      expect(validateMobile("8123456789")).toBe(true)
    })

    test("should reject invalid mobile numbers", () => {
      expect(validateMobile("987654321")).toBe(false) // 9 digits
      expect(validateMobile("98765432101")).toBe(false) // 11 digits
      expect(validateMobile("1234567890")).toBe(false) // starts with 1
      expect(validateMobile("")).toBe(false) // empty
    })
  })

  describe("validateEmail", () => {
    test("should validate correct email addresses", () => {
      expect(validateEmail("test@example.com")).toBe(true)
      expect(validateEmail("user.name@domain.co.in")).toBe(true)
    })

    test("should reject invalid email addresses", () => {
      expect(validateEmail("invalid-email")).toBe(false)
      expect(validateEmail("test@")).toBe(false)
      expect(validateEmail("@example.com")).toBe(false)
      expect(validateEmail("")).toBe(false)
    })
  })

  describe("validatePincode", () => {
    test("should validate correct pincodes", () => {
      expect(validatePincode("110001")).toBe(true)
      expect(validatePincode("400001")).toBe(true)
    })

    test("should reject invalid pincodes", () => {
      expect(validatePincode("11000")).toBe(false) // 5 digits
      expect(validatePincode("1100011")).toBe(false) // 7 digits
      expect(validatePincode("11000a")).toBe(false) // contains letter
      expect(validatePincode("")).toBe(false) // empty
    })
  })

  describe("validateOTP", () => {
    test("should validate correct OTP", () => {
      expect(validateOTP("123456")).toBe(true)
      expect(validateOTP("000000")).toBe(true)
    })

    test("should reject invalid OTP", () => {
      expect(validateOTP("12345")).toBe(false) // 5 digits
      expect(validateOTP("1234567")).toBe(false) // 7 digits
      expect(validateOTP("12345a")).toBe(false) // contains letter
      expect(validateOTP("")).toBe(false) // empty
    })
  })
})
