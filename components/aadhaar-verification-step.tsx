"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Send, Shield } from "lucide-react"

interface AadhaarVerificationStepProps {
  formData: any
  onComplete: (data: any) => void
}

export function AadhaarVerificationStep({ formData, onComplete }: AadhaarVerificationStepProps) {
  const [aadhaarNumber, setAadhaarNumber] = useState(formData.aadhaar_number || "")
  const [mobileNumber, setMobileNumber] = useState(formData.mobile_number || "")
  const [otp, setOtp] = useState(formData.otp || "")
  const [otpSent, setOtpSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateAadhaar = (value: string) => {
    const pattern = /^\d{4}\s?\d{4}\s?\d{4}$/
    return pattern.test(value.replace(/\s/g, ""))
  }

  const validateMobile = (value: string) => {
    const pattern = /^[6-9]\d{9}$/
    return pattern.test(value)
  }

  const validateOtp = (value: string) => {
    const pattern = /^\d{6}$/
    return pattern.test(value)
  }

  const formatAadhaar = (value: string) => {
    const digits = value.replace(/\D/g, "")
    if (digits.length <= 4) return digits
    if (digits.length <= 8) return `${digits.slice(0, 4)} ${digits.slice(4)}`
    return `${digits.slice(0, 4)} ${digits.slice(4, 8)} ${digits.slice(8, 12)}`
  }

  const handleAadhaarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatAadhaar(e.target.value)
    setAadhaarNumber(formatted)
    if (errors.aadhaar_number) {
      setErrors((prev) => ({ ...prev, aadhaar_number: "" }))
    }
  }

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10)
    setMobileNumber(value)
    if (errors.mobile_number) {
      setErrors((prev) => ({ ...prev, mobile_number: "" }))
    }
  }

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6)
    setOtp(value)
    if (errors.otp) {
      setErrors((prev) => ({ ...prev, otp: "" }))
    }
  }

  const handleSendOtp = async () => {
    const newErrors: Record<string, string> = {}

    if (!validateAadhaar(aadhaarNumber)) {
      newErrors.aadhaar_number = "Please enter a valid 12-digit Aadhaar number"
    }

    if (!validateMobile(mobileNumber)) {
      newErrors.mobile_number = "Please enter a valid 10-digit mobile number"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
    setOtpSent(true)
  }

  const handleVerifyOtp = async () => {
    const newErrors: Record<string, string> = {}

    if (!validateOtp(otp)) {
      newErrors.otp = "Please enter a valid 6-digit OTP"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)

    onComplete({
      aadhaar_number: aadhaarNumber,
      mobile_number: mobileNumber,
      otp: otp,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
        <Shield className="w-5 h-5 text-blue-600" />
        <p className="text-sm text-blue-800">Your Aadhaar information is secure and encrypted</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="aadhaar">Aadhaar Number *</Label>
          <Input
            id="aadhaar"
            type="text"
            value={aadhaarNumber}
            onChange={handleAadhaarChange}
            placeholder="Enter 12-digit Aadhaar number"
            maxLength={14}
            className={errors.aadhaar_number ? "border-red-500" : ""}
            disabled={otpSent}
          />
          {errors.aadhaar_number && <p className="text-sm text-red-600">{errors.aadhaar_number}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="mobile">Mobile Number *</Label>
          <Input
            id="mobile"
            type="tel"
            value={mobileNumber}
            onChange={handleMobileChange}
            placeholder="Enter 10-digit mobile number"
            maxLength={10}
            className={errors.mobile_number ? "border-red-500" : ""}
            disabled={otpSent}
          />
          {errors.mobile_number && <p className="text-sm text-red-600">{errors.mobile_number}</p>}
        </div>

        {!otpSent ? (
          <Button onClick={handleSendOtp} disabled={isLoading} className="w-full sm:w-auto">
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending OTP...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send OTP
              </>
            )}
          </Button>
        ) : (
          <div className="space-y-4">
            <Alert>
              <AlertDescription>
                OTP has been sent to your mobile number ending with ****{mobileNumber.slice(-4)}
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="otp">Enter OTP *</Label>
              <Input
                id="otp"
                type="text"
                value={otp}
                onChange={handleOtpChange}
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                className={errors.otp ? "border-red-500" : ""}
              />
              {errors.otp && <p className="text-sm text-red-600">{errors.otp}</p>}
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <Button onClick={handleVerifyOtp} disabled={isLoading} className="flex-1">
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify & Continue"
                )}
              </Button>
              <Button variant="outline" onClick={() => setOtpSent(false)} className="flex-1 sm:flex-none">
                Resend OTP
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
