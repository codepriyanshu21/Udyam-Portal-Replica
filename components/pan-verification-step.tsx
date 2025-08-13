"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, ArrowLeft, CheckCircle } from "lucide-react"

interface PanVerificationStepProps {
  formData: any
  onComplete: (data: any) => void
  onPrevious: () => void
}

export function PanVerificationStep({ formData, onComplete, onPrevious }: PanVerificationStepProps) {
  const [panNumber, setPanNumber] = useState(formData.pan_number || "")
  const [nameAsPan, setNameAsPan] = useState(formData.name_as_per_pan || "")
  const [dateOfBirth, setDateOfBirth] = useState(formData.date_of_birth || "")
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isVerified, setIsVerified] = useState(false)

  const validatePan = (value: string) => {
    const pattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
    return pattern.test(value.toUpperCase())
  }

  const handlePanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, 10)
    setPanNumber(value)
    if (errors.pan_number) {
      setErrors((prev) => ({ ...prev, pan_number: "" }))
    }
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^a-zA-Z\s]/g, "")
    setNameAsPan(value)
    if (errors.name_as_per_pan) {
      setErrors((prev) => ({ ...prev, name_as_per_pan: "" }))
    }
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateOfBirth(e.target.value)
    if (errors.date_of_birth) {
      setErrors((prev) => ({ ...prev, date_of_birth: "" }))
    }
  }

  const handleVerifyPan = async () => {
    const newErrors: Record<string, string> = {}

    if (!validatePan(panNumber)) {
      newErrors.pan_number = "Please enter a valid PAN number (e.g., ABCDE1234F)"
    }

    if (!nameAsPan.trim()) {
      newErrors.name_as_per_pan = "Please enter name as per PAN card"
    }

    if (!dateOfBirth) {
      newErrors.date_of_birth = "Please select your date of birth"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
    setIsVerified(true)
  }

  const handleComplete = () => {
    onComplete({
      pan_number: panNumber,
      name_as_per_pan: nameAsPan,
      date_of_birth: dateOfBirth,
    })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="pan">PAN Number *</Label>
          <Input
            id="pan"
            type="text"
            value={panNumber}
            onChange={handlePanChange}
            placeholder="Enter PAN number (e.g., ABCDE1234F)"
            maxLength={10}
            className={errors.pan_number ? "border-red-500" : ""}
            disabled={isVerified}
          />
          {errors.pan_number && <p className="text-sm text-red-600">{errors.pan_number}</p>}
          <p className="text-xs text-gray-500">Format: 5 letters + 4 digits + 1 letter</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Name as per PAN *</Label>
          <Input
            id="name"
            type="text"
            value={nameAsPan}
            onChange={handleNameChange}
            placeholder="Enter name exactly as per PAN card"
            className={errors.name_as_per_pan ? "border-red-500" : ""}
            disabled={isVerified}
          />
          {errors.name_as_per_pan && <p className="text-sm text-red-600">{errors.name_as_per_pan}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="dob">Date of Birth *</Label>
          <Input
            id="dob"
            type="date"
            value={dateOfBirth}
            onChange={handleDateChange}
            className={errors.date_of_birth ? "border-red-500" : ""}
            disabled={isVerified}
          />
          {errors.date_of_birth && <p className="text-sm text-red-600">{errors.date_of_birth}</p>}
        </div>

        {isVerified && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <AlertDescription className="text-green-800">
              PAN details verified successfully! You can now proceed to complete your registration.
            </AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col sm:flex-row gap-2 pt-4">
          <Button variant="outline" onClick={onPrevious} className="flex-1 sm:flex-none bg-transparent">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          {!isVerified ? (
            <Button onClick={handleVerifyPan} disabled={isLoading} className="flex-1">
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Verifying PAN...
                </>
              ) : (
                "Verify PAN Details"
              )}
            </Button>
          ) : (
            <Button onClick={handleComplete} className="flex-1">
              Complete Registration
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
