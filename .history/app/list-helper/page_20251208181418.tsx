"use client"

import { DomesticHelperForm } from "@/components/helper/domestic-helper-form"
import { OwnerHeader } from "@/components/owner/owner-header"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function ListDomesticHelperPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
  async function checkAuth() {
    const { data, error } = await supabase.auth.getUser()

    // ✅ FULLY SAFE LOGGING (NO TYPE ERROR)
    console.log("USER METADATA:", data?.user?.user_metadata)

    // ✅ LOGIN CHECK
    if (!data?.user) {
      router.replace("/login?redirect=/list-helper")
      return
    }

    const role = data.user.user_metadata?.role

    // ✅ ONLY MAUSHI / HELPER ALLOWED
    if (role !== "maushi") {
      alert("❌ Only domestic helpers can access this page.")
      router.replace("/")
      return
    }

    setUser(data.user)
  }

  checkAuth()
}, [router])


  // 🚫 Block UI until auth is confirmed
  if (!user) {
    return <div className="p-10 text-center">Checking authentication...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hide dashboard button here */}
      <OwnerHeader showDashboardButton={false} />

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

