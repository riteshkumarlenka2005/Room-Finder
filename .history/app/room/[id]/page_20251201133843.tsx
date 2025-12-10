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

  let startX = 0
  const handleTouchStart = (e: any) => {
    startX = e.touches[0].clientX
  }
  const handleTouchEnd = (e: any) => {
    const endX = e.changedTouches[0].clientX
    if (startX - endX > 50) {
      setCurrentImageIndex((prev) =>
        prev === room.images.length - 1 ? 0 : prev + 1
      )
    } else if (endX - startX > 50) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? room.images.length - 1 : prev - 1
      )
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) =>
        prev === room.images.length - 1 ? 0 : prev + 1
      )
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const room = {
    id: 1,
    title: "Spacious 2BHK near GIET College",
    location: "Gunupur, Rayagada, Odisha",
    fullAddress: "Plot No. 45, Sector 7, Near GIET University",
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
      waterSystem: "24/7 Municipal Supply",
      balcony: true,
      roofAccess: true,
      parking: "Available",
      electricity: "Separate Meter",
      furniture: ["Beds", "Wardrobes", "Study Tables"],
      kitchen: "Modular Kitchen",
      kitchenItems: ["Gas Stove", "RO Water", "Fridge"],
      maushiAvailable: true,
      maushiDetails: {
        cost: "₹1500/month",
        meals: "Full meals",
        cuisine: "Odia + North Indian",
        experience: "15+ years",
      },
    },
    amenities: [
      { icon: Wifi, name: "WiFi", description: "100 Mbps unlimited" },
      { icon: Car, name: "Parking", description: "Covered" },
      { icon: Shield, name: "Security", description: "24/7 guard" },
    ],
    rules: ["No smoking", "No loud music after 10 PM"],
    nearbyPlaces: [
      { name: "GIET University", distance: "0.5 km", type: "College" },
      { name: "ATM", distance: "0.3 km", type: "Banking" },
    ],
    verified: true,
    featured: true,
    availableFrom: "15th January 2024",
    lastUpdated: "2 days ago",
  }

  const reviews = [
    {
      id: 1,
      user: "Priya Sharma",
      rating: 5,
      date: "2 weeks ago",
      comment: "Great room and supportive owner.",
      helpful: 12,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link href="/search">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Search
              </Button>
            </Link>

            <Link href="/" className="flex items-center">
              <Home className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold">RoomFinder</span>
            </Link>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 py-8 grid lg:grid-cols-3 gap-8">

        {/* LEFT CONTENT */}
        <div className="lg:col-span-2 space-y-8">

          {/* ⭐ IMAGE SLIDER ⭐ */}
          <Card className="overflow-hidden">
            <div
              className="relative w-full h-96 bg-gray-200 rounded-xl overflow-hidden group"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <img
                src={room.images[currentImageIndex]}
                alt={room.title}
                className="w-full h-full object-cover transition-all duration-700 ease-in-out"
              />

              {/* LEFT ARROW */}
              <button
                onClick={() =>
                  setCurrentImageIndex((prev) =>
                    prev === 0 ? room.images.length - 1 : prev - 1
                  )
                }
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow"
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
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow"
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
                      index === currentImageIndex
                        ? "bg-white"
                        : "bg-white/50"
                    }`}
                  />
                ))}
              </div>

              {/* BADGES */}
              <Badge className="absolute top-4 left-4 bg-green-600">
                <CheckCircle className="w-3 h-3 mr-1" /> Verified
              </Badge>

              {room.featured && (
                <Badge className="absolute top-4 right-4 bg-orange-600">
                  Featured
                </Badge>
              )}
            </div>
          </Card>

          {/* ROOM DETAILS */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{room.title}</CardTitle>
              <div className="mt-2 flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-1" />
                {room.fullAddress}
              </div>
            </CardHeader>

            <CardContent>

              <div className="flex items-center gap-6 mb-6">
                <Badge variant="outline">{room.type}</Badge>
                <Badge variant="outline">{room.sharing}</Badge>

                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span className="ml-1">{room.rating}</span>
                  <span className="ml-1 text-gray-500">({room.reviews})</span>
                </div>
              </div>

              {/* QUICK STATS */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center bg-gray-50 p-3 rounded">
                  <Bed className="w-6 h-6 mx-auto mb-1" />
                  {room.details.bhk}
                  <div className="text-sm text-gray-500">Bedrooms</div>
                </div>

                <div className="text-center bg-gray-50 p-3 rounded">
                  <Square className="w-6 h-6 mx-auto mb-1" />
                  {room.details.doors}
                  <div className="text-sm text-gray-500">Doors</div>
                </div>

                <div className="text-center bg-gray-50 p-3 rounded">
                  <Wind className="w-6 h-6 mx-auto mb-1" />
                  {room.details.windows}
                  <div className="text-sm text-gray-500">Windows</div>
                </div>
              </div>

              <Separator className="my-6" />

              {/* AMENITIES */}
              <h3 className="text-lg font-semibold mb-3">Amenities</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {room.amenities.map((a, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <a.icon className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="font-medium">{a.name}</div>
                      <div className="text-sm text-gray-500">{a.description}</div>
                    </div>
                  </div>
                ))}
              </div>

            </CardContent>
          </Card>

          {/* RULES */}
          <Card>
            <CardHeader>
              <CardTitle>Rules & Policies</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {room.rules.map((rule, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    {rule}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* REVIEWS */}
          <Card>
            <CardHeader>
              <CardTitle>Reviews ({room.reviews})</CardTitle>
            </CardHeader>
            <CardContent>
              {reviews.map((r) => (
                <div key={r.id} className="border-b py-4">
                  <div className="flex justify-between items-center">
                    <div className="font-medium">{r.user}</div>
                    <Star className="w-4 h-4 text-yellow-500" />
                  </div>
                  <p className="text-gray-600">{r.comment}</p>
                </div>
              ))}
            </CardContent>
          </Card>

        </div>

        {/* RIGHT SIDEBAR */}
        <div className="space-y-6">

          {/* CONTACT CARD */}
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Contact Owner</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  {room.owner.name.charAt(0)}
                </div>
                <div>
                  <div className="font-medium flex items-center gap-2">
                    {room.owner.name}
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="text-gray-500 text-sm">
                    {room.owner.joinedDate}
                  </div>
                </div>
              </div>

              <Button className="w-full mb-3">
                <Phone className="mr-2 w-4 h-4" /> Call {room.owner.phone}
              </Button>

              <Button variant="outline" className="w-full">
                <MessageSquare className="mr-2 w-4 h-4" /> Send Message
              </Button>

              <Separator className="my-4" />

              <div className="flex justify-between text-sm">
                <span>Available from:</span>
                <span className="font-medium">{room.availableFrom}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span>Last updated:</span>
                <span className="font-medium">{room.lastUpdated}</span>
              </div>

            </CardContent>
          </Card>

          {/* QUICK ACTIONS */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full">
                <Calendar className="mr-2 w-4 h-4" /> Schedule Visit
              </Button>

              <Button variant="outline" className="w-full">
                <Heart className="mr-2 w-4 h-4" /> Save to Favorites
              </Button>

              <Button variant="outline" className="w-full">
                <Share2 className="mr-2 w-4 h-4" /> Share
              </Button>
            </CardContent>
          </Card>

          {/* PRICE BREAKDOWN */}
          <Card>
            <CardHeader>
              <CardTitle>Price Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>Monthly Rent</span>
                <span className="font-medium">₹{room.price}</span>
              </div>

              <div className="flex justify-between">
                <span>Security Deposit</span>
                <span className="font-medium">₹{room.price}</span>
              </div>

              <div className="flex justify-between">
                <span>Advance (2 months)</span>
                <span className="font-medium">₹{room.price * 2}</span>
              </div>

              <Separator />

              <div className="flex justify-between text-lg font-semibold">
                <span>Total Initial Cost</span>
                <span className="text-blue-600">₹{room.price * 4}</span>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  )
}
