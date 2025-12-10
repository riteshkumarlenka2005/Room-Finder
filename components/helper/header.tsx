"use client"

import { Home, Menu, X } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full bg-card border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2563EB] text-primary-foreground">
              <Home className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold text-foreground">RoomFinder</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Home
            </Link>

            <Link
              href="/search"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Search Rooms
            </Link>

            <Link
              href="/list-helper"
              className="text-sm font-medium text-[#2563EB]"
            >
              Domestic Helpers
            </Link>

            <Link
              href="/about"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </Link>
          </nav>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login">
              <Button variant="outline" size="sm" className="border-border hover:bg-accent bg-transparent">
                Sign In
              </Button>
            </Link>

            <Link href="/list-helper">
              <Button size="sm" className="bg-[#2563EB] hover:bg-[#1d4ed8] text-primary-foreground shadow-sm">
                Post Free Ad
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-3">
              <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground py-2">
                Home
              </Link>

              <Link href="/search" className="text-sm font-medium text-muted-foreground hover:text-foreground py-2">
                Search Rooms
              </Link>

              <Link href="/list-helper" className="text-sm font-medium text-[#2563EB] py-2">
                Domestic Helpers
              </Link>

              <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground py-2">
                About
              </Link>

              <div className="flex gap-3 pt-3">
                <Link href="/login" className="flex-1">
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    Sign In
                  </Button>
                </Link>

                <Link href="/list-helper" className="flex-1">
                  <Button size="sm" className="w-full bg-[#2563EB] hover:bg-[#1d4ed8]">
                    Post Free Ad
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
