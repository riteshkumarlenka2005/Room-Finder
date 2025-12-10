"use client"

import { Phone, MessageCircle, MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FormSectionCard } from "@/components/helper/form-section-card"
import type { HelperFormData } from "@/components/helper/domestic-helper-form"

interface ContactInfoSectionProps {
  formData: HelperFormData
  updateFormData: (updates: Partial<HelperFormData>) => void
}

export function ContactInfoSection({ formData, updateFormData }: ContactInfoSectionProps) {
  return (
    <FormSectionCard
      icon={<Phone className="h-5 w-5" />}
      title="Contact Information"
      description="How can employers reach you?"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Phone Number */}
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-medium text-foreground flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            Phone Number <span className="text-destructive">*</span>
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="Enter phone number"
            value={formData.phone}
            onChange={(e) => updateFormData({ phone: e.target.value })}
            className="h-11 border-border focus:border-[#2563EB] focus:ring-[#2563EB]/20"
            required
          />
        </div>

        {/* Alternate Phone */}
        <div className="space-y-2">
          <Label htmlFor="alternatePhone" className="text-sm font-medium text-foreground">
            Alternate Phone Number
          </Label>
          <Input
            id="alternatePhone"
            type="tel"
            placeholder="Enter alternate number"
            value={formData.alternatePhone}
            onChange={(e) => updateFormData({ alternatePhone: e.target.value })}
            className="h-11 border-border focus:border-[#2563EB] focus:ring-[#2563EB]/20"
          />
        </div>

        {/* WhatsApp */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="whatsapp" className="text-sm font-medium text-foreground flex items-center gap-2">
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
            WhatsApp Number
          </Label>
          <Input
            id="whatsapp"
            type="tel"
            placeholder="Enter WhatsApp number"
            value={formData.whatsapp}
            onChange={(e) => updateFormData({ whatsapp: e.target.value })}
            className="h-11 border-border focus:border-[#2563EB] focus:ring-[#2563EB]/20"
          />
        </div>

        {/* Address */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="address" className="text-sm font-medium text-foreground flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            Full Address
          </Label>
          <Textarea
            id="address"
            placeholder="Enter your complete address..."
            value={formData.address}
            onChange={(e) => updateFormData({ address: e.target.value })}
            className="min-h-[100px] border-border focus:border-[#2563EB] focus:ring-[#2563EB]/20 resize-none"
          />
        </div>
      </div>
    </FormSectionCard>
  )
}
