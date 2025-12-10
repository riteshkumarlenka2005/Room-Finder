"use client"

import { useState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  MapPin,
  Home,
  Users,
  Star,
  Phone,
  MessageSquare,
  CheckCircle,
  Heart,
  Share2,
  Bed,
  Square,
  Zap,
  Droplets,
  Wind,
  Car,
  Utensils,
  Wifi,
  Shield,
  Calendar,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"

export default function RoomDetailsPage({ params }: { params: { id: string } }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showContactForm, setShowContactForm] = useState(false)

  // -------------------
  // TOUCH SWIPE SUPPORT
  // -------------------
  let startX = 0

  const handleTouchStart = (e: any) => {
    startX = e.touches[0].clientX
  }

  const handleTouchEnd = (e: any) => {
    const endX = e.changedTouches[0].clientX

    if (startX - endX > 50) {
      // swipe left
      setCurrentImageIndex((prev) =>
        prev === room.images.length - 1 ? 0 : prev + 1
      )
    } else if (endX - startX > 50) {
      // swipe right
      setCurrentImageIndex((prev) =>
        prev === 0 ? room.images.length - 1 : prev - 1
      )
    }
  }

  // -------------------
  // AUTO SLIDER EVERY 4 SECONDS
  // -------------------
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) =>
        prev === room.images.length - 1 ? 0 : prev + 1
      )
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  // PLEASE IGNORE MOCK DATA (YOU WILL REPLACE LATER)
  const room = {
    id: 1,
    title: "Spacious 2BHK near GIET College",
    location: "Gunupur, Rayagada, Odisha",
    fullAddress: "Plot No. 45, Sector 7, Near GIET University, Gunupur, Rayagada - 765022",
    price: 4500,
    type: "2BHK",
    sharing: "2-3 people",
    images: [
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
    ],
    features: ["Furnished", "WiFi", "Parking", "Kitchen", "Maushi Available"],
    rating: 4.8,
    reviews: 24,
    owner: {
      name: "Ramesh Kumar",
      phone: "+91 9876543210",
      verified: true,
      responseTime: "Usually responds within 2 hours",
      joinedDate: "Member since 2022",
    },
    details: {
      bhk: "2BHK",
      doors: 4,
      windows: 6,
      flooring: "Premium Tiles",
      waterSystem: "24/7 Municipal Supply + Backup",
      balcony: true,
      roofAccess: true,
      parking: "2-Wheeler & 4-Wheeler Available",
      electricity: "Separate Meter",
      furniture: ["2 Double Beds", "Wardrobes", "Study Tables"],
      kitchen: "Modular Kitchen",
      kitchenItems: ["Gas Stove", "RO Water", "Fridge"],
      maushiAvailable: true,
      maushiDetails: {
        available: true,
        cost: "₹1500/month per person",
        meals: "Breakfast + Lunch + Dinner",
        cuisine: "Odia + North Indian",
        experience: "15+ years experience",
      },
    },
    amenities: [
      { icon: Wifi, name: "High Speed WiFi", description: "100 Mbps unlimited" },
      { icon: Car, name: "Parking", description: "Covered parking" },
      { icon: Shield, name: "Security", description: "24/7 guard" },
    ],
    nearbyPlaces: [
      { name: "GIET University", distance: "0.5 km", type: "College" },
      { name: "ATM", distance: "0.3 km", type: "Banking" },
    ],
    rules: ["No smoking", "No loud music"],
    verified: true,
    featured: true,
    availableFrom: "15th January 2024",
    lastUpdated: "2 days ago",
  }

  const reviews = [
    { id: 1, user: "Priya Sharma", rating: 5, date: "2 weeks ago", comment: "Great place!", helpful: 12 },
  ]

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/search" className="mr-4">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Search
                </Button>
              </Link>
              <Link href="/" className="flex items-center">
                <Home className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">RoomFinder</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 grid lg:grid-cols-3 gap-8">

        {/* LEFT SIDE — MAIN CONTENT */}
        <div className="lg:col-span-2 space-y-8">

          {/* ⭐ PREMIUM IMAGE SLIDER ⭐ */}
          <Card className="overflow-hidden">
            <div
              className="relative w-full h-96 bg-gray-200 rounded-xl overflow-hidden group"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >

              {/* MAIN IMAGE */}
              <img
                src={room.images[currentImageIndex]}
                alt={room.title}
                className="w-full h-full object-cover transition-all duration-700 ease-in-out group-hover:scale-105"
              />

              {/* LEFT ARROW */}
              <button
                onClick={() =>
                  setCurrentImageIndex((prev) =>
                    prev === 0 ? room.images.length - 1 : prev - 1
                  )
                }
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow opacity-0 group-hover:opacity-100 transition"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>

              {/* RIGHT ARROW */}
              <button
                onClick={() =>
                  setCurrentImageIndex((prev) =>
                    prev === room.images.length - 1 ? 0 : prev + 1
                  )
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow opacity-0 group-hover:opacity-100 transition"
              >
                <ArrowLeft className="w-6 h-6 rotate-180" />
              </button>

              {/* DOTS */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                {room.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-3 h-3 rounded-full ${
                      index === currentImageIndex ? "bg-white" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>

              {/* VERIFIED */}
              <Badge className="absolute top-4 left-4 bg-green-600">
                <CheckCircle className="w-3 h-3 mr-1" />
                Verified
              </Badge>

              {/* FEATURED */}
              {room.featured && (
                <Badge className="absolute top-4 right-4 bg-orange-600">
                  Featured
                </Badge>
              )}
            </div>
          </Card>

          {/* ALL OTHER UI REMAINS SAME — NO CHANGES BELOW */}
          {/* Baby, I will not rewrite rest since nothing was modified. */}

        </div>
      </div>
    </div>
  )
}
