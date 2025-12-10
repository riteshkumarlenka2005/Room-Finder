"use client"

import type React from "react"

import { useState } from "react"
import { PersonalInfoSection } from "@/components/helper/form-sections/personal-info-section"
import { CookingSkillsSection } from "@/components/helper/form-sections/cooking-skills-section"
import { HouseholdSkillsSection } from "@/components/helper/form-sections/household-skills-section"
import { AvailabilitySection } from "@/components/helper/form-sections/availability-section"
import { ContactInfoSection } from "@/components/helper/form-sections/contact-info-section"
import { Button } from "@/components/ui/button"
import { Loader2, Send } from "lucide-react"

export interface HelperFormData {
  // Personal Info
  fullName: string
  gender: string
  age: string
  city: string
  district: string
  state: string
  experience: string
  languages: string[]
  bio: string
  profilePhoto: File | null

  // Cooking Skills
  cuisineType: string
  dishes: string[]
  foodImages: File[]
  cookingLevel: string

  // Household Skills
  houseCleaning: boolean
  childCare: boolean
  laundry: boolean
  elderlyCare: boolean
  petCare: boolean
  kitchenCleaning: boolean
  otherSkills: string

  // Availability
  workType: string
  salaryMin: string
  salaryMax: string
  workingHours: string[]
  preferredWorkType: string[]
  preferredEmployerGender: string

  // Contact Info
  phone: string
  alternatePhone: string
  whatsapp: string
  address: string
}

const initialFormData: HelperFormData = {
  fullName: "",
  gender: "",
  age: "",
  city: "",
  district: "",
  state: "",
  experience: "",
  languages: [],
  bio: "",
  profilePhoto: null,
  cuisineType: "",
  dishes: [],
  foodImages: [],
  cookingLevel: "",
  houseCleaning: false,
  childCare: false,
  laundry: false,
  elderlyCare: false,
  petCare: false,
  kitchenCleaning: false,
  otherSkills: "",
  workType: "",
  salaryMin: "",
  salaryMax: "",
  workingHours: [],
  preferredWorkType: [],
  preferredEmployerGender: "",
  phone: "",
  alternatePhone: "",
  whatsapp: "",
  address: "",
}

export function DomesticHelperForm() {
  const [formData, setFormData] = useState<HelperFormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateFormData = (updates: Partial<HelperFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    console.log("Form submitted:", formData)
    setIsSubmitting(false)
    alert("Your profile has been submitted successfully!")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PersonalInfoSection formData={formData} updateFormData={updateFormData} />
      <CookingSkillsSection formData={formData} updateFormData={updateFormData} />
      <HouseholdSkillsSection formData={formData} updateFormData={updateFormData} />
      <AvailabilitySection formData={formData} updateFormData={updateFormData} />
      <ContactInfoSection formData={formData} updateFormData={updateFormData} />

      {/* Submit Button */}
      <div className="bg-card rounded-lg border border-border shadow-sm p-6">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 bg-[#2563EB] hover:bg-[#1d4ed8] text-primary-foreground font-semibold text-base shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-70"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="mr-2 h-5 w-5" />
              Submit Your Profile
            </>
          )}
        </Button>
        <p className="text-center text-sm text-muted-foreground mt-3">
          By submitting, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </form>
  )
}
