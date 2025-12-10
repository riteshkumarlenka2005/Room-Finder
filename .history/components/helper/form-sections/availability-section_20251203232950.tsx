"use client"

import { Clock, IndianRupee, Sun, Building2, Users } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FormSectionCard } from "@/components/helper/form-section-card"
import { MultiSelect } from "@/components/helper/multi-select"
import type { HelperFormData } from "@/components/helper/domestic-helper-form"

const workingHoursOptions = [
  { value: "morning", label: "Morning (6 AM - 12 PM)" },
  { value: "afternoon", label: "Afternoon (12 PM - 5 PM)" },
  { value: "evening", label: "Evening (5 PM - 9 PM)" },
  { value: "night", label: "Night (9 PM - 6 AM)" },
]

const workTypeOptions = [
  { value: "family-house", label: "Family House" },
  { value: "pg", label: "PG / Hostel" },
  { value: "bachelor", label: "Bachelor Room" },
  { value: "apartment", label: "Apartment Complex" },
  { value: "office", label: "Office / Commercial" },
]

interface AvailabilitySectionProps {
  formData: HelperFormData
  updateFormData: (updates: Partial<HelperFormData>) => void
}

export function AvailabilitySection({ formData, updateFormData }: AvailabilitySectionProps) {
  return (
    <FormSectionCard
      icon={<Clock className="h-5 w-5" />}
      title="Availability & Work Preferences"
      description="Set your work schedule and preferences"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Work Type */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">
            Employment Type <span className="text-destructive">*</span>
          </Label>
          <Select value={formData.workType} onValueChange={(value) => updateFormData({ workType: value })}>
            <SelectTrigger className="h-11 border-border focus:border-[#2563EB] focus:ring-[#2563EB]/20">
              <SelectValue placeholder="Select work type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full-time">Full-time (Live-in)</SelectItem>
              <SelectItem value="full-time-out">Full-time (Non Live-in)</SelectItem>
              <SelectItem value="part-time">Part-time</SelectItem>
              <SelectItem value="hourly">Hourly Basis</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Preferred Employer Gender */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            Preferred Employer Gender
          </Label>
          <Select
            value={formData.preferredEmployerGender}
            onValueChange={(value) => updateFormData({ preferredEmployerGender: value })}
          >
            <SelectTrigger className="h-11 border-border focus:border-[#2563EB] focus:ring-[#2563EB]/20">
              <SelectValue placeholder="Select preference" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Salary Range */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground flex items-center gap-2">
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
            Minimum Salary (₹/month)
          </Label>
          <Input
            type="number"
            placeholder="e.g., 8000"
            value={formData.salaryMin}
            onChange={(e) => updateFormData({ salaryMin: e.target.value })}
            className="h-11 border-border focus:border-[#2563EB] focus:ring-[#2563EB]/20"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground flex items-center gap-2">
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
            Maximum Salary (₹/month)
          </Label>
          <Input
            type="number"
            placeholder="e.g., 15000"
            value={formData.salaryMax}
            onChange={(e) => updateFormData({ salaryMax: e.target.value })}
            className="h-11 border-border focus:border-[#2563EB] focus:ring-[#2563EB]/20"
          />
        </div>

        {/* Working Hours */}
        <div className="space-y-2 md:col-span-2">
          <Label className="text-sm font-medium text-foreground flex items-center gap-2">
            <Sun className="h-4 w-4 text-muted-foreground" />
            Preferred Working Hours
          </Label>
          <MultiSelect
            options={workingHoursOptions}
            selected={formData.workingHours}
            onChange={(values) => updateFormData({ workingHours: values })}
            placeholder="Select your available hours"
          />
        </div>

        {/* Preferred Work Type */}
        <div className="space-y-2 md:col-span-2">
          <Label className="text-sm font-medium text-foreground flex items-center gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            Preferred Work Location Type
          </Label>
          <MultiSelect
            options={workTypeOptions}
            selected={formData.preferredWorkType}
            onChange={(values) => updateFormData({ preferredWorkType: values })}
            placeholder="Select preferred work locations"
          />
        </div>
      </div>
    </FormSectionCard>
  )
}
