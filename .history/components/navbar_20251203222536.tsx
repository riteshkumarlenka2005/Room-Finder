"use client"

import Link from "next/link"
import { useState } from "react"
import { Home, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm border-b relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Home className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">RoomFinder</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8 items-center">

            <Link href="/search" className="text-gray-700 hover:text-blue-600">
              Search Rooms
            </Link>

            {/* Dropdown for List Property */}
            <div className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center text-gray-700 hover:text-blue-600 focus:outline-none"
              >
                List Property
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>

              {open && (
                <div className="absolute mt-2 w-44 bg-white border rounded-md shadow-lg z-50">
                  <Link
                    href="/list-property"
                    className="block px-4 py-2 hover:bg-gray-100 text-gray-700"
                    onClick={() => setOpen(false)}
                  >
                    Owner
                  </Link>
                  <Link
                    href="/list-helper"
                    className="block px-4 py-2 hover:bg-gray-100 text-gray-700"
                    onClick={() => setOpen(false)}
                  >
                    Domestic Helper
                  </Link>
                </div>
              )}
            </div>

            <Link href="/maushi-services" className="text-gray-700 hover:text-blue-600">
              Domestic helper
            </Link>

            <Link href="/about" className="text-gray-700 hover:text-blue-600">
              About
            </Link>
          </nav>

          {/* Auth */}
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>

        </div>
      </div>
    </header>
  )
}
