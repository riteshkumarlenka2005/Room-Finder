"use client"

import { ChefHat, Utensils, Image as ImageIcon, Award } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FormSectionCard } from "@/components/helper/form-section-card"
import { MultiSelect } from "@/components/helper/multi-select"
import { ImageUpload } from "@/components/helper/image-upload"
import type { HelperFormData } from "@/components/helper/domestic-helper-form"

const dishOptions = [
  { value: "dal", label: "Dal / Lentils" },
  { value: "rice", label: "Rice Dishes" },
  { value: "roti", label: "Roti / Chapati" },
  { value: "paratha", label: "Paratha" },
  { value: "sabzi", label: "Vegetable Curry" },
  { value: "biryani", label: "Biryani" },
  { value: "pulao", label: "Pulao" },
  { value: "paneer", label: "Paneer Dishes" },
  { value: "chicken", label: "Chicken Curry" },
  { value: "fish", label: "Fish Curry" },
  { value: "mutton", label: "Mutton Curry" },
  { value: "egg", label: "Egg Dishes" },
  { value: "south-indian", label: "South Indian (Dosa, Idli)" },
  { value: "chinese", label: "Indo-Chinese" },
  { value: "snacks", label: "Snacks & Pakoras" },
  { value: "desserts", label: "Desserts & Sweets" },
  { value: "breakfast", label: "Breakfast Items" },
  { value: "salads", label: "Salads & Raita" },
]

interface CookingSkillsSectionProps {
  formData: HelperFormData
  updateFormData: (updates: Partial<HelperFormData>) => void
}

export function CookingSkillsSection({ formData, updateFormData }: CookingSkillsSectionProps) {
  return (
    <FormSectionCard
      icon={<ChefHat className="h-5 w-5" />}
      title="Cooking Skills"
      description="Share your culinary expertise"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cuisine Type */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground flex items-center gap-2">
            <Utensils className="h-4 w-4 text-muted-foreground" />
            Cuisine Type
          </Label>
          <Select value={formData.cuisineType} onValueChange={(value) => updateFormData({ cuisineType: value })}>
            <SelectTrigger className="h-11 border-border focus:border-[#2563EB] focus:ring-[#2563EB]/20">
              <SelectValue placeholder="Select cuisine type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="veg">Vegetarian Only</SelectItem>
              <SelectItem value="non-veg">Non-Vegetarian Only</SelectItem>
              <SelectItem value="both">Both Veg & Non-Veg</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Cooking Experience Level */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground flex items-center gap-2">
            <Award className="h-4 w-4 text-muted-foreground" />
            Cooking Experience Level
          </Label>
          <Select value={formData.cookingLevel} onValueChange={(value) => updateFormData({ cookingLevel: value })}>
            <SelectTrigger className="h-11 border-border focus:border-[#2563EB] focus:ring-[#2563EB]/20">
              <SelectValue placeholder="Select experience level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="expert">Expert</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Dishes */}
        <div className="space-y-2 md:col-span-2">
          <Label className="text-sm font-medium text-foreground">Dishes You Can Cook</Label>
          <MultiSelect
            options={dishOptions}
            selected={formData.dishes}
            onChange={(values) => updateFormData({ dishes: values })}
            placeholder="Select dishes you can prepare"
          />
        </div>

        {/* Food Images */}
        <div className="space-y-2 md:col-span-2">
          <Label className="text-sm font-medium text-foreground flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
            Food Images (Showcase your cooking)
          </Label>
          <ImageUpload
            value={formData.foodImages}
            onChange={(files) => updateFormData({ foodImages: files })}
            placeholder="Upload photos of dishes you've prepared"
            maxFiles={6}
          />
        </div>
      </div>
    </FormSectionCard>
  )
}
