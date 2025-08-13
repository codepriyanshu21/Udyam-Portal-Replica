"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { AadhaarVerificationStep } from "@/components/aadhaar-verification-step"
import { PanVerificationStep } from "@/components/pan-verification-step"
import { Badge } from "@/components/ui/badge"

export default function UdyamRegistrationForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    aadhaar_number: "",
    mobile_number: "",
    otp: "",
    pan_number: "",
    name_as_per_pan: "",
    date_of_birth: "",
  })

  const totalSteps = 2
  const progressPercentage = (currentStep / totalSteps) * 100

  const handleStepComplete = (stepData: any) => {
    setFormData((prev) => ({ ...prev, ...stepData }))
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-4 px-4 sm:py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">U</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Udyam Registration</h1>
          </div>
          <p className="text-gray-600 text-sm sm:text-base">Register your micro, small or medium enterprise</p>
        </div>

        {/* Progress Tracker */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Step {currentStep} of {totalSteps}
            </span>
            <Badge variant="secondary" className="text-xs">
              {Math.round(progressPercentage)}% Complete
            </Badge>
          </div>
          <Progress value={progressPercentage} className="h-2" />

          {/* Step indicators */}
          <div className="flex justify-between mt-4">
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                }`}
              >
                1
              </div>
              <span className="text-xs sm:text-sm text-gray-600 hidden sm:inline">Aadhaar Verification</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= 2 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                }`}
              >
                2
              </div>
              <span className="text-xs sm:text-sm text-gray-600 hidden sm:inline">PAN Verification</span>
            </div>
          </div>
        </div>

        {/* Form Steps */}
        <Card className="shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg sm:text-xl">
              {currentStep === 1 ? "Aadhaar Verification" : "PAN Verification"}
            </CardTitle>
            <CardDescription className="text-sm">
              {currentStep === 1
                ? "Enter your Aadhaar number and verify with OTP"
                : "Enter your PAN details for verification"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {currentStep === 1 && <AadhaarVerificationStep formData={formData} onComplete={handleStepComplete} />}
            {currentStep === 2 && (
              <PanVerificationStep formData={formData} onComplete={handleStepComplete} onPrevious={handlePrevStep} />
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-xs text-gray-500">
          <p>© 2024 Government of India. All rights reserved.</p>
          <p className="mt-1">This is a replica for demonstration purposes only.</p>
        </div>
      </div>
    </div>
  )
}
