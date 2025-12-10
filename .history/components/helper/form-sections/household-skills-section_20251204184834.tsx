"use client"

import { Sparkles, Baby, Shirt, Heart, Dog, ChefHat, MoreHorizontal } from "lucide-react"


import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { FormSectionCard } from "@/components/helper/form-section-card"
import type { HelperFormData } from "@/components/helper/domestic-helper-form"

interface HouseholdSkillsSectionProps {
  formData: HelperFormData
  updateFormData: (updates: Partial<HelperFormData>) => void
}

const skills = [
  { id: "houseCleaning", label: "House Cleaning", icon: Sparkles },
  { id: "childCare", label: "Child Care", icon: Baby },
  { id: "laundry", label: "Laundry & Ironing", icon: Shirt },
  { id: "elderlyCare", label: "Elderly Care", icon: Heart },
  { id: "petCare", label: "Pet Care", icon: Dog },
  { id: "kitchenCleaning", label: "Kitchen Cleaning", icon: ChefHat },
] as const


export function HouseholdSkillsSection({ formData, updateFormData }: HouseholdSkillsSectionProps) {
  return (
    <FormSectionCard
      icon={<Sparkles className="h-5 w-5" />}
      title="Household Skills"
      description="Select the services you can provide"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map((skill) => {
            const Icon = skill.icon
            const isChecked = formData[skill.id as keyof HelperFormData] as boolean

            return (
              <label
                key={skill.id}
                className={`relative flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:border-[#2563EB]/50 hover:bg-accent/50 ${
                  isChecked ? "border-[#2563EB] bg-[#2563EB]/5 shadow-sm" : "border-border bg-card"
                }`}
              >
                <Checkbox
                  checked={isChecked}
                  onCheckedChange={(checked) => updateFormData({ [skill.id]: checked as boolean })}
                  className="data-[state=checked]:bg-[#2563EB] data-[state=checked]:border-[#2563EB]"
                />
                <Icon className={`h-5 w-5 ${isChecked ? "text-[#2563EB]" : "text-muted-foreground"}`} />
                <span className={`text-sm font-medium ${isChecked ? "text-foreground" : "text-muted-foreground"}`}>
                  {skill.label}
                </span>
              </label>
            )
          })}
        </div>

        {/* Other Skills */}
        <div className="space-y-2">
          <Label htmlFor="otherSkills" className="text-sm font-medium text-foreground flex items-center gap-2">
            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
            Other Skills
          </Label>
          <Input
            id="otherSkills"
            placeholder="Any other skills? (e.g., Gardening, Driving, etc.)"
            value={formData.otherSkills}
            onChange={(e) => updateFormData({ otherSkills: e.target.value })}
            className="h-11 border-border focus:border-[#2563EB] focus:ring-[#2563EB]/20"
          />
        </div>
      </div>
    </FormSectionCard>
  )
}
