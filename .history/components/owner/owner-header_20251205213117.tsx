"use client"

import Link from "next/link"
import { Home } from "lucide-react"
import { Button } from "@/components/ui/button"

interface OwnerHeaderProps {
  showDashboardButton?: boolean
  isSubmitted?: boolean
}

export function OwnerHeader({ showDashboardButton = true, isSubmitted = false }: OwnerHeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center mb-4">
            <Home className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-2xl font-bold text-gray-900">RoomFinder</span>
          </Link>

          {/* SHOW ONLY IF ENABLED */}
          {showDashboardButton && (
            <div className="flex items-center space-x-4">
              {isSubmitted ? (
                <Link href="/owner/dashboard">
                  <Button variant="outline">Dashboard</Button>
                </Link>
              ) : (
                <Button variant="outline" disabled className="opacity-50 cursor-not-allowed">
                  Dashboard
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
