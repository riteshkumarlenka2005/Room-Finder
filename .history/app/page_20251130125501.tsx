"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, Home, Users, Star, Phone, Utensils, Shield, CheckCircle, Heart } from "lucide-react"
import Link from "next/link"
import Navbar from "@/components/navbar"


export default function HomePage() {
  const [searchLocation, setSearchLocation] = useState("")
  const [priceRange, setPriceRange] = useState("")
  const [roomType, setRoomType] = useState("")

  const featuredRooms = [
    {
      id: 1,
      title: "Spacious 2BHK near GIET College",
      location: "Gunupur, Rayagada, Odisha",
      price: "₹4,500/month",
      type: "2BHK",
      sharing: "2-3 people",
      image: "/placeholder.svg?height=200&width=300",
      features: ["Furnished", "WiFi", "Parking", "Kitchen", "Maushi Available"],
      rating: 4.8,
      reviews: 24,
      owner: "Ramesh Kumar",
      phone: "+91 9876543210",
      verified: true,
    },
    {
      id: 2,
      title: "Single Room for Students",
      location: "Berhampur, Ganjam, Odisha",
      price: "₹2,800/month",
      type: "1BHK",
      sharing: "Single occupancy",
      image: "/placeholder.svg?height=200&width=300",
      features: ["Study Table", "Separate Meter", "Balcony", "24/7 Water"],
      rating: 4.6,
      reviews: 18,
      owner: "Sunita Devi",
      phone: "+91 9123456789",
      verified: true,
    },
    {
      id: 3,
      title: "Group Accommodation - 6 Members",
      location: "Bhubaneswar, Khordha, Odisha",
      price: "₹1,800/person",
      type: "3BHK",
      sharing: "6 people",
      image: "/placeholder.svg?height=200&width=300",
      features: ["Large Kitchen", "Common Area", "Laundry", "Security", "Maushi Service"],
      rating: 4.9,
      reviews: 42,
      owner: "Prakash Sahoo",
      phone: "+91 8765432109",
      verified: true,
    },
  ]

  const states = ["Odisha", "West Bengal", "Andhra Pradesh", "Telangana", "Jharkhand", "Chhattisgarh"]

  const roomTypes = ["1BHK", "2BHK", "3BHK", "Single Room", "Shared Room"]
  const priceRanges = ["Under ₹2000", "₹2000-₹4000", "₹4000-₹6000", "Above ₹6000"]

  return (
    <>
    
    <Navbar />

    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Find Your Perfect
            <span className="text-blue-600"> Room</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Students के लिए बनाया गया platform। घर बैठे मिलेगा perfect room, Domestic helper, और सब कुछ detailed information के
            साथ।
          </p>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="State, District, City..."
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="relative">
                <Home className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <select
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value)}
                >
                  <option value="">Room Type</option>
                  {roomTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-400">₹</span>
                <select
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                >
                  <option value="">Price Range</option>
                  {priceRanges.map((range) => (
                    <option key={range} value={range}>
                      {range}
                    </option>
                  ))}
                </select>
              </div>
              <Link href="/search">
                <Button className="w-full">
                  <Search className="w-4 h-4 mr-2" />
                  Search Rooms
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose RoomFinder?</h2>
            <p className="text-lg text-gray-600">Students के लिए specially designed features</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-6">
              <CardContent>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Smart Search</h3>
                <p className="text-gray-600">
                  Location, price, room type, sharing options - सब कुछ filter करके exact match पाएं
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Verified Listings</h3>
                <p className="text-gray-600">सभी properties और owners verified हैं। Fake listings की कोई tension नहीं</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Utensils className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Maushi Services</h3>
                <p className="text-gray-600">Cooking की problem? Experienced Maushi aunties available हैं</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Rooms */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Featured Rooms</h2>
            <Link href="/search">
              <Button variant="outline">View All Rooms</Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredRooms.map((room) => (
              <Card key={room.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img src={room.image || "/placeholder.svg"} alt={room.title} className="w-full h-48 object-cover" />
                  <Button size="sm" variant="outline" className="absolute top-2 right-2 bg-white/90 hover:bg-white">
                    <Heart className="w-4 h-4" />
                  </Button>
                  {room.verified && (
                    <Badge className="absolute top-2 left-2 bg-green-600">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>

                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{room.title}</h3>
                    <span className="text-lg font-bold text-blue-600">{room.price}</span>
                  </div>

                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">{room.location}</span>
                  </div>

                  <div className="flex items-center gap-4 mb-3">
                    <Badge variant="outline">{room.type}</Badge>
                    <Badge variant="outline">{room.sharing}</Badge>
                  </div>

                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm font-medium">{room.rating}</span>
                      <span className="ml-1 text-sm text-gray-500">({room.reviews} reviews)</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {room.features.slice(0, 3).map((feature, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                    {room.features.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{room.features.length - 3} more
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-1" />
                      <span>{room.owner}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Phone className="w-4 h-4" />
                      </Button>
                      <Link href={`/room/${room.id}`}>
                        <Button size="sm">View Details</Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600">3 simple steps में मिल जाएगा perfect room</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Search & Filter</h3>
              <p className="text-gray-600">अपनी location, budget, और preferences के according search करें</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Contact Owner</h3>
              <p className="text-gray-600">Direct owner से contact करें, room visit करें, सब details confirm करें</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Book & Move In</h3>
              <p className="text-gray-600">Secure payment करें और अपने नए room में move in करें</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Perfect Room?</h2>
          <p className="text-xl mb-8 opacity-90">हजारों verified rooms और Domestic helper available हैं</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/search">
              <Button size="lg" variant="secondary">
                <Search className="w-5 h-5 mr-2" />
                Start Searching
              </Button>
            </Link>
            <Link href="/list-property">
              <Button
                size="lg"
                variant="outline"
                className="text-white border-white hover:bg-white hover:text-blue-600 bg-transparent"
              >
                <Home className="w-5 h-5 mr-2" />
                List Your Property
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Home className="h-8 w-8 text-blue-400" />
                <span className="ml-2 text-xl font-bold">RoomFinder</span>
              </div>
              <p className="text-gray-400">Students के लिए बनाया गया trusted room rental platform</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">For Students</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/search" className="hover:text-white">
                    Search Rooms
                  </Link>
                </li>
                <li>
                  <Link href="/saved" className="hover:text-white">
                    Saved Rooms
                  </Link>
                </li>
                <li>
                  <Link href="/maushi-services" className="hover:text-white">
                    Domestic helper
                  </Link>
                </li>
                <li>
                  <Link href="/help" className="hover:text-white">
                    Help & Support
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">For Owners</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/list-property" className="hover:text-white">
                    List Property
                  </Link>
                </li>
                <li>
                  <Link href="/manage-listings" className="hover:text-white">
                    Manage Listings
                  </Link>
                </li>
                <li>
                  <Link href="/analytics" className="hover:text-white">
                    Analytics
                  </Link>
                </li>
                <li>
                  <Link href="/owner-support" className="hover:text-white">
                    Owner Support
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/about" className="hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 RoomFinder. All rights reserved. Made with ❤️ for Students</p>
          </div>
        </div>
      </footer>
    </div>
    </>
  )
}
