export interface ValidationResult {
  isValid: boolean
  errors: Record<string, string>
}

export interface AadhaarData {
  aadhaar_number: string
  mobile_number: string
}

export interface OtpData {
  aadhaar_number: string
  mobile_number: string
  otp: string
}

export interface PanData {
  pan_number: string
  name_as_per_pan: string
  date_of_birth: string
}

export interface UdyamFormData extends AadhaarData, PanData {
  otp: string
}

// Validation patterns from scraped schema
const VALIDATION_PATTERNS = {
  aadhaar: /^\d{12}$/,
  pan: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
  otp: /^\d{6}$/,
  mobile: /^[6-9]\d{9}$/,
  name: /^[a-zA-Z\s]{2,50}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  pincode: /^\d{6}$/,
}

export function validateAadhaarNumber(aadhaar: string): boolean {
  const cleanAadhaar = aadhaar.replace(/\s/g, "")
  return VALIDATION_PATTERNS.aadhaar.test(cleanAadhaar)
}

export function validateMobileNumber(mobile: string): boolean {
  return VALIDATION_PATTERNS.mobile.test(mobile)
}

export function validateOtp(otp: string): boolean {
  return VALIDATION_PATTERNS.otp.test(otp)
}

export function validatePanNumber(pan: string): boolean {
  return VALIDATION_PATTERNS.pan.test(pan.toUpperCase())
}

export function validateName(name: string): boolean {
  return VALIDATION_PATTERNS.name.test(name.trim())
}

export function validateDateOfBirth(dob: string): boolean {
  if (!dob) return false

  const date = new Date(dob)
  const today = new Date()
  const age = today.getFullYear() - date.getFullYear()

  // Must be between 18 and 100 years old
  return age >= 18 && age <= 100 && date <= today
}

// Individual validation functions (required exports)
export function validateAadhaar(aadhaar: string): boolean {
  return validateAadhaarNumber(aadhaar)
}

export function validatePAN(pan: string): boolean {
  return validatePanNumber(pan)
}

export function validateMobile(mobile: string): boolean {
  return validateMobileNumber(mobile)
}

export function validateEmail(email: string): boolean {
  return VALIDATION_PATTERNS.email.test(email.trim())
}

export function validatePincode(pincode: string): boolean {
  return VALIDATION_PATTERNS.pincode.test(pincode)
}

export function validateOTP(otp: string): boolean {
  return validateOtp(otp)
}

export function validateAadhaarData(data: AadhaarData): ValidationResult {
  const errors: Record<string, string> = {}

  if (!validateAadhaarNumber(data.aadhaar_number)) {
    errors.aadhaar_number = "Invalid Aadhaar number format. Must be 12 digits."
  }

  if (!validateMobileNumber(data.mobile_number)) {
    errors.mobile_number = "Invalid mobile number. Must be 10 digits starting with 6-9."
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

export function validateOtpData(data: OtpData): ValidationResult {
  const errors: Record<string, string> = {}

  if (!validateAadhaarNumber(data.aadhaar_number)) {
    errors.aadhaar_number = "Invalid Aadhaar number format."
  }

  if (!validateMobileNumber(data.mobile_number)) {
    errors.mobile_number = "Invalid mobile number format."
  }

  if (!validateOtp(data.otp)) {
    errors.otp = "Invalid OTP format. Must be 6 digits."
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

export function validatePanData(data: PanData): ValidationResult {
  const errors: Record<string, string> = {}

  if (!validatePanNumber(data.pan_number)) {
    errors.pan_number = "Invalid PAN format. Must be 5 letters + 4 digits + 1 letter (e.g., ABCDE1234F)."
  }

  if (!validateName(data.name_as_per_pan)) {
    errors.name_as_per_pan = "Invalid name format. Must be 2-50 characters, letters and spaces only."
  }

  if (!validateDateOfBirth(data.date_of_birth)) {
    errors.date_of_birth = "Invalid date of birth. Must be between 18-100 years old."
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

export function validateCompleteForm(data: UdyamFormData): ValidationResult {
  const errors: Record<string, string> = {}

  // Validate all fields
  const aadhaarValidation = validateAadhaarData({
    aadhaar_number: data.aadhaar_number,
    mobile_number: data.mobile_number,
  })

  const otpValidation = validateOtpData({
    aadhaar_number: data.aadhaar_number,
    mobile_number: data.mobile_number,
    otp: data.otp,
  })

  const panValidation = validatePanData({
    pan_number: data.pan_number,
    name_as_per_pan: data.name_as_per_pan,
    date_of_birth: data.date_of_birth,
  })

  // Combine all errors
  Object.assign(errors, aadhaarValidation.errors, otpValidation.errors, panValidation.errors)

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

// Mock data for testing
export const MOCK_VALID_CREDENTIALS = {
  aadhaar_otp_pairs: [
    { aadhaar: "123456789012", mobile: "9876543210", otp: "123456" },
    { aadhaar: "987654321098", mobile: "8765432109", otp: "654321" },
  ],
  pan_details: [
    { pan: "ABCDE1234F", name: "John Doe", dob: "1990-01-01" },
    { pan: "FGHIJ5678K", name: "Jane Smith", dob: "1985-05-15" },
  ],
}
