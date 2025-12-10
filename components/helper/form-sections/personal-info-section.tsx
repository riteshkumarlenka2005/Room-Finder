"use client"

import { User, MapPin, Calendar, Languages, FileText, Camera } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FormSectionCard } from "@/components/helper/form-section-card"
import { MultiSelect } from "@/components/helper/multi-select"
import { ImageUpload } from "@/components/helper/image-upload"
import type { HelperFormData } from "@/components/helper/domestic-helper-form"

const languageOptions = [
  { value: "hindi", label: "Hindi" },
  { value: "english", label: "English" },
  { value: "tamil", label: "Tamil" },
  { value: "telugu", label: "Telugu" },
  { value: "kannada", label: "Kannada" },
  { value: "malayalam", label: "Malayalam" },
  { value: "marathi", label: "Marathi" },
  { value: "gujarati", label: "Gujarati" },
  { value: "bengali", label: "Bengali" },
  { value: "punjabi", label: "Punjabi" },
  { value: "odia", label: "Odia" },
]

interface PersonalInfoSectionProps {
  formData: HelperFormData
  updateFormData: (updates: Partial<HelperFormData>) => void
}

export function PersonalInfoSection({ formData, updateFormData }: PersonalInfoSectionProps) {
  return (
    <FormSectionCard
      icon={<User className="h-5 w-5" />}
      title="Personal Information"
      description="Tell us about yourself"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-sm font-medium text-foreground">
            Full Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="fullName"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={(e) => updateFormData({ fullName: e.target.value })}
            className="h-11 border-border focus:border-[#2563EB] focus:ring-[#2563EB]/20"
            required
          />
        </div>

        {/* Gender */}
        <div className="space-y-2">
          <Label htmlFor="gender" className="text-sm font-medium text-foreground">
            Gender <span className="text-destructive">*</span>
          </Label>
          <Select value={formData.gender} onValueChange={(value) => updateFormData({ gender: value })}>
            <SelectTrigger className="h-11 border-border focus:border-[#2563EB] focus:ring-[#2563EB]/20">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Age */}
        <div className="space-y-2">
          <Label htmlFor="age" className="text-sm font-medium text-foreground flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            Age <span className="text-destructive">*</span>
          </Label>
          <Input
            id="age"
            type="number"
            placeholder="Enter your age"
            min="18"
            max="65"
            value={formData.age}
            onChange={(e) => updateFormData({ age: e.target.value })}
            className="h-11 border-border focus:border-[#2563EB] focus:ring-[#2563EB]/20"
            required
          />
        </div>

        {/* Experience */}
        <div className="space-y-2">
          <Label htmlFor="experience" className="text-sm font-medium text-foreground">
            Experience (Years) <span className="text-destructive">*</span>
          </Label>
          <Input
            id="experience"
            type="number"
            placeholder="Years of experience"
            min="0"
            max="50"
            value={formData.experience}
            onChange={(e) => updateFormData({ experience: e.target.value })}
            className="h-11 border-border focus:border-[#2563EB] focus:ring-[#2563EB]/20"
            required
          />
        </div>

        {/* City */}
        <div className="space-y-2">
          <Label htmlFor="city" className="text-sm font-medium text-foreground flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            City <span className="text-destructive">*</span>
          </Label>
          <Input
            id="city"
            placeholder="Enter your city"
            value={formData.city}
            onChange={(e) => updateFormData({ city: e.target.value })}
            className="h-11 border-border focus:border-[#2563EB] focus:ring-[#2563EB]/20"
            required
          />
        </div>

        {/* District */}
        <div className="space-y-2">
          <Label htmlFor="district" className="text-sm font-medium text-foreground">
            District
          </Label>
          <Input
            id="district"
            placeholder="Enter your district"
            value={formData.district}
            onChange={(e) => updateFormData({ district: e.target.value })}
            className="h-11 border-border focus:border-[#2563EB] focus:ring-[#2563EB]/20"
          />
        </div>

        {/* State */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="state" className="text-sm font-medium text-foreground">
            State <span className="text-destructive">*</span>
          </Label>
          <Input
            id="state"
            placeholder="Enter your state"
            value={formData.state}
            onChange={(e) => updateFormData({ state: e.target.value })}
            className="h-11 border-border focus:border-[#2563EB] focus:ring-[#2563EB]/20"
            required
          />
        </div>

        {/* Languages */}
        <div className="space-y-2 md:col-span-2">
          <Label className="text-sm font-medium text-foreground flex items-center gap-2">
            <Languages className="h-4 w-4 text-muted-foreground" />
            Languages Known <span className="text-destructive">*</span>
          </Label>
          <MultiSelect
            options={languageOptions}
            selected={formData.languages}
            onChange={(values) => updateFormData({ languages: values })}
            placeholder="Select languages you speak"
          />
        </div>

        {/* Bio */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="bio" className="text-sm font-medium text-foreground flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            About Yourself
          </Label>
          <Textarea
            id="bio"
            placeholder="Tell potential employers about yourself, your work ethic, and why you would be a great fit..."
            value={formData.bio}
            onChange={(e) => updateFormData({ bio: e.target.value })}
            className="min-h-[120px] border-border focus:border-[#2563EB] focus:ring-[#2563EB]/20 resize-none"
          />
        </div>

        {/* Profile Photo */}
        <div className="space-y-2 md:col-span-2">
          <Label className="text-sm font-medium text-foreground flex items-center gap-2">
            <Camera className="h-4 w-4 text-muted-foreground" />
            Profile Photo
          </Label>
          <ImageUpload
            single
            value={formData.profilePhoto ? [formData.profilePhoto] : []}
            onChange={(files) => updateFormData({ profilePhoto: files[0] || null })}
            placeholder="Upload your profile photo"
          />
        </div>
      </div>
    </FormSectionCard>
  )
}
