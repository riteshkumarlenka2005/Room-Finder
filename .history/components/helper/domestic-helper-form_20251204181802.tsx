// components/helper/domestic-helper-form.tsx
"use client"

import { useEffect, useState } from "react"
import { PersonalInfoSection } from "@/components/helper/form-sections/personal-info-section"
import { CookingSkillsSection } from "@/components/helper/form-sections/cooking-skills-section"
import { HouseholdSkillsSection } from "@/components/helper/form-sections/household-skills-section"
import { AvailabilitySection } from "@/components/helper/form-sections/availability-section"
import { ContactInfoSection } from "@/components/helper/form-sections/contact-info-section"
import { Button } from "@/components/ui/button"
import { Loader2, Send } from "lucide-react"
import { supabase } from "@/lib/supabase"

// --------------------------------------------------
// FORM DATA INTERFACE
// --------------------------------------------------
export interface HelperFormData {
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

  cuisineType: string
  dishes: string[]
  foodImages: File[]
  cookingLevel: string

  houseCleaning: boolean
  childCare: boolean
  laundry: boolean
  elderlyCare: boolean
  petCare: boolean
  kitchenCleaning: boolean
  otherSkills: string

  workType: string
  salaryMin: string
  salaryMax: string
  workingHours: string[]
  preferredWorkType: string[]
  preferredEmployerGender: string

  phone: string
  alternatePhone: string
  whatsapp: string
  address: string
}

// --------------------------------------------------
// INITIAL FORM DATA
// --------------------------------------------------
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

// --------------------------------------------------
// Helper: upload file to Supabase storage and return public URL
// --------------------------------------------------
async function uploadFileToBucket(bucket: string, path: string, file: File) {
  // path should include filename (no leading slash)
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(path, file, { upsert: true })

  if (uploadError) throw uploadError

  // get public URL
  const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(path)
  return publicData.publicUrl
}

// --------------------------------------------------
// MAIN COMPONENT
// --------------------------------------------------
export function DomesticHelperForm() {
  const [formData, setFormData] = useState<HelperFormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const updateFormData = (updates: Partial<HelperFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }))
  }

  // --------------------------------------------------
  // SUBMIT HANDLER
  // --------------------------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // generate helper id locally so we can upload into helper-specific folder
      const helperId = (crypto && typeof crypto.randomUUID === "function")
        ? crypto.randomUUID()
        : `helper-${Date.now()}`

      const bucket = "helper-images" // your bucket

      // 1) upload profile photo (if any)
      let profilePhotoUrl: string | null = null
      if (formData.profilePhoto) {
        const file = formData.profilePhoto
        const safeName = `${helperId}/profile/${Date.now()}-${file.name.replace(/\s/g, "-")}`
        profilePhotoUrl = await uploadFileToBucket(bucket, safeName, file)
      }

      // 2) upload foodImages (if any)
      const foodImageUrls: string[] = []
      if (formData.foodImages && formData.foodImages.length) {
        for (const f of formData.foodImages) {
          const safeName = `${helperId}/food/${Date.now()}-${f.name.replace(/\s/g, "-")}`
          const url = await uploadFileToBucket(bucket, safeName, f)
          foodImageUrls.push(url)
        }
      }

      // 3) optionally, if you want to also upload a gallery 'images' (we'll create from foodImages + profile)
      // create images array from profile + foodImages
      const imagesUrls: string[] = []
      if (profilePhotoUrl) imagesUrls.push(profilePhotoUrl)
      imagesUrls.push(...foodImageUrls)

      // 4) insert into DB
      const insertPayload: any = {
        full_name: formData.fullName,
        gender: formData.gender,
        age: formData.age ? Number(formData.age) : null,
        experience_years: formData.experience ? Number(formData.experience) : null,
        city: formData.city,
        district: formData.district,
        state: formData.state,
        address: formData.address,
        house_cleaning: formData.houseCleaning,
        child_care: formData.childCare,
        laundry: formData.laundry,
        elderly_care: formData.elderlyCare,
        pet_care: formData.petCare,
        kitchen_cleaning: formData.kitchenCleaning,
        other_skills: formData.otherSkills,
        phone: formData.phone,
        alternate_phone: formData.alternatePhone,
        whatsapp: formData.whatsapp,
        // store arrays as JSON (supabase text[] or jsonb column depending on your schema)
        images: imagesUrls.length ? imagesUrls : null,
        food_images: foodImageUrls.length ? foodImageUrls : null,
        profile_photo: profilePhotoUrl,
        bio: formData.bio,
        // optional convenience fields
        specialties: formData.cuisineType ? [formData.cuisineType] : null,
        dishes: formData.dishes.length ? formData.dishes : null,
      }

      const { data, error } = await supabase.from("domestic_helpers").insert([insertPayload])

      if (error) throw error

      setSubmitted(true)
    } catch (err: any) {
      console.error("Submit error:", err)
      alert("Something went wrong while submitting! See console.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // --------------------------------------------------
  // SUCCESS SCREEN
  // --------------------------------------------------
  if (submitted) {
    return (
      <div className="text-center py-20">
        <div className="mx-auto w-20 h-20 bg-green-100 text-green-600 flex items-center justify-center rounded-full mb-6">
          <svg
            className="w-12 h-12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-green-700 mb-2">
          Congratulations!
        </h1>

        <p className="text-gray-600 mb-8">
          Your helper listing has been submitted successfully.
        </p>

        <button
          onClick={() => (window.location.href = "/")}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Go to Home Page
        </button>
      </div>
    )
  }

  // --------------------------------------------------
  // MAIN FORM UI
  // --------------------------------------------------
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
          className="w-full h-12 bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-semibold text-base shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-70"
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
