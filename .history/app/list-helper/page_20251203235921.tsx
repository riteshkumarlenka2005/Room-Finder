"use client"

import { DomesticHelperForm } from "@/components/helper/domestic-helper-form"
import { OwnerHeader } from "@/components/owner/owner-header"

export default function ListDomesticHelperPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Owner-style header */}
      <OwnerHeader isSubmitted={false} />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            List Domestic Helper
          </h1>
          <p className="text-muted-foreground">
            Fill out the form below to create your helper profile and connect with potential employers.
          </p>
        </div>

        <DomesticHelperForm />
      </main>
    </div>
  )
}
