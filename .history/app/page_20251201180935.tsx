"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, Home, Users, Star, Phone, Utensils, Shield, CheckCircle, Heart } from "lucide-react"
import Link from "next/link"
import Navbar from "@/components/navbar"
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [searchLocation, setSearchLocation] = useState("")
  const [priceRange, setPriceRange] = useState("")
  const [roomType, setRoomType] = useState("")
  const router = useRouter()

  const [featuredRooms, setFeaturedRooms] = useState<any[]>([])

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const res = await fetch("/api/properties");
        const raw = await res.json();

        const properties = Array.isArray(raw.properties) ? raw.properties : [];
        setFeaturedRooms(properties);
      } catch (err) {
        console.error(err);
        setFeaturedRooms([]);
      }
    }

    fetchFeatured();
  }, []);

  const roomTypes = ["1BHK", "2BHK", "3BHK", "Single Room", "Shared Room"]
  const priceRanges = ["Under ₹2000", "₹2000-₹4000", "₹4000-₹6000", "Above ₹6000"]

  const handleSearch = () => {
    const query = new URLSearchParams()

    if (searchLocation) query.set("location", searchLocation)
    if (roomType) query.set("type", roomType)
    if (priceRange) query.set("price", priceRange)

    window.location.href = `/search?${query.toString()}`
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">

        {/* HERO SECTION */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Find Your Perfect <span className="text-blue-600">Room</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Students के लिए बना platform। Perfect room, domestic helper और full details के साथ।
            </p>

            {/* SEARCH BAR */}
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
              <div className="grid md:grid-cols-4 gap-4">

                {/* LOCATION */}
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="State, District, City..."
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* ROOM TYPE */}
                <div className="relative">
                  <Home className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <select
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value)}
                  >
                    <option value="">Room Type</option>
                    {roomTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* PRICE RANGE */}
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-400">₹</span>
                  <select
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                  >
                    <option value="">Price Range</option>
                    {priceRanges.map((range) => (
                      <option key={range} value={range}>{range}</option>
                    ))}
                  </select>
                </div>

                {/* SEARCH BUTTON */}
                <Button className="w-full" onClick={handleSearch}>
                  <Search className="w-4 h-4 mr-2" />
                  Search Rooms
                </Button>

              </div>
            </div>
          </div>
        </section>

        {/* WHY CHOOSE SECTION */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold">Why Choose RoomFinder?</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center p-6">
                <CardContent>
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Smart Search</h3>
                  <p className="text-gray-600">Exact match filters</p>
                </CardContent>
              </Card>

              <Card className="text-center p-6">
                <CardContent>
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Verified Listings</h3>
                  <p className="text-gray-600">No fake listings</p>
                </CardContent>
              </Card>

              <Card className="text-center p-6">
                <CardContent>
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Utensils className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Maushi Services</h3>
                  <p className="text-gray-600">Home-cooked meals available</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* FEATURED ROOMS */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">Featured Rooms</h2>
              <Link href="/search">
                <Button variant="outline">View All Rooms</Button>
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {featuredRooms.map((room) => {
                const id = room.property_id || room.id
                const images = Array.isArray(room.images) ? room.images : []
                const img = images[0] || "/placeholder.svg"

                return (
                  <Card key={id} className="overflow-hidden">
                    <img src={img} className="w-full h-48 object-cover" />

                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-lg">{room.title}</h3>
                        <span className="text-blue-600 font-bold">₹{room.price}</span>
                      </div>

                      <div className="flex items-center text-gray-600 mt-1">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{room.location}</span>
                      </div>

                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline">{room.type}</Badge>
                        <Badge variant="outline">{room.sharing}</Badge>
                      </div>

                      <Link href={`/room/${id}`}>
                        <Button className="mt-4 w-full">View Details</Button>
                      </Link>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4">
            <p className="text-center text-gray-400">
              © 2024 RoomFinder — Made with ❤️ for Students
            </p>
          </div>
        </footer>

      </div>
    </>
  )
}
