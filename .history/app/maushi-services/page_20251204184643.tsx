"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Navbar from "@/components/navbar"
import { supabase } from "@/lib/supabase"
import { requireAuth } from "@/utils/requireAuth"

import {
  Search,
  MapPin,
  Users,
  Star,
  Phone,
  MessageSquare,
  Utensils,
  CheckCircle,
  Heart,
  Filter,
  Clock,
  IndianRupee,
  Award,
  ChefHat,
} from "lucide-react"

import Link from "next/link"

interface Filters {
  priceRange: string
  experience: string
  cuisine: string[]
  availability: string
}

export default function MaushiServicesPage() {
  // ----------------------------
  // AUTH CHECK
  // ----------------------------
  useEffect(() => {
    requireAuth()
  }, [])

  // ----------------------------
  // STATES
  // ----------------------------
  const [searchLocation, setSearchLocation] = useState("")
  const [helpers, setHelpers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [selectedFilters, setSelectedFilters] = useState<Filters>({
    priceRange: "",
    experience: "",
    cuisine: [],
    availability: "",
  })

  // ----------------------------
  // FETCH HELPERS FROM SUPABASE
  // ----------------------------
  useEffect(() => {
    fetchHelpers()
  }, [])

  async function fetchHelpers() {
  setLoading(true);

  const { data, error } = await supabase
    .from("domestic_helpers")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    setLoading(false);
    return;
  }

  // ⭐ FIX: Normalize column names → UI expected fields
  const normalized = (data || []).map((h: any) => ({
    ...h,

    // Salary fields UI expects
    salaryMin: h.salary_min ?? h.salaryMin ?? "",
    salaryMax: h.salary_max ?? h.salaryMax ?? "",

    // Experience
    experience_years: h.experience_years ?? h.experience ?? 0,

    // Skills
    other_skills: h.other_skills ?? "",

    // Images priority
    images: Array.isArray(h.images) ? h.images : [],
    profile_photo: h.profile_photo ?? null,
    food_images: Array.isArray(h.food_images) ? h.food_images : [],

    // Work type
    workType: h.work_type ?? h.workType ?? "",
  }));

  setHelpers(normalized);
  setLoading(false);
}


  // ----------------------------
  // UI FILTER OPTIONS (UNCHANGED)
  // ----------------------------
  const cuisineTypes = ["Odia Cuisine", "North Indian", "South Indian", "Bengali", "Gujarati", "Chinese", "Continental"]
  const experienceLevels = ["5+ years", "10+ years", "15+ years", "20+ years"]
  const availabilityOptions = ["Full Time", "Part Time", "Morning Only", "Evening Only", "Weekends"]
  const priceRanges = [
    { label: "Under ₹1000", value: "0-1000" },
    { label: "₹1000-₹1500", value: "1000-1500" },
    { label: "₹1500-₹2000", value: "1500-2000" },
    { label: "Above ₹2000", value: "2000-999999" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* HERO HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Find Experienced <span className="text-purple-600">Domestic helper</span>
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Cooking की tension नहीं! Experienced aunties से मिलेगा homestyle खाना
          </p>

          {/* SEARCH BAR */}
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by location..."
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button>
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </div>

        {/* STATS SECTION */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="text-center p-4">
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">500+</div>
              <div className="text-sm text-gray-600">Verified Helpers</div>
            </CardContent>
          </Card>
          <Card className="text-center p-4">
            <CardContent>
              <div className="text-2xl font-bold text-green-600">4.8★</div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </CardContent>
          </Card>
          <Card className="text-center p-4">
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">2000+</div>
              <div className="text-sm text-gray-600">Happy Students</div>
            </CardContent>
          </Card>
          <Card className="text-center p-4">
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">₹1200+</div>
              <div className="text-sm text-gray-600">Starting Price</div>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-8">
          {/* FILTER SIDEBAR — UNCHANGED */}
          <div className="w-80 hidden lg:block">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filters
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                
                {/* PRICE FILTER */}
                <div>
                  <h4 className="font-medium mb-3">Price Range (per person/month)</h4>
                  <div className="space-y-2">
                    {priceRanges.map((range) => (
                      <div key={range.value} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id={`price-${range.value}`}
                          name="priceRange"
                          checked={selectedFilters.priceRange === range.value}
                          onChange={() =>
                            setSelectedFilters((prev) => ({ ...prev, priceRange: range.value }))
                          }
                        />
                        <label htmlFor={`price-${range.value}`} className="text-sm">
                          {range.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* EXPERIENCE FILTER */}
                <div>
                  <h4 className="font-medium mb-3">Experience</h4>
                  <div className="space-y-2">
                    {experienceLevels.map((level) => (
                      <div key={level} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id={`exp-${level}`}
                          name="experience"
                          checked={selectedFilters.experience === level}
                          onChange={() =>
                            setSelectedFilters((prev) => ({ ...prev, experience: level }))
                          }
                        />
                        <label htmlFor={`exp-${level}`} className="text-sm">
                          {level}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CUISINE FILTER */}
                <div>
                  <h4 className="font-medium mb-3">Cuisine Specialties</h4>
                  <div className="space-y-2">
                    {cuisineTypes.map((cuisine) => (
                      <div key={cuisine} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`cuisine-${cuisine}`}
                          checked={selectedFilters.cuisine.includes(cuisine)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedFilters((prev) => ({
                                ...prev,
                                cuisine: [...prev.cuisine, cuisine],
                              }))
                            } else {
                              setSelectedFilters((prev) => ({
                                ...prev,
                                cuisine: prev.cuisine.filter((c) => c !== cuisine),
                              }))
                            }
                          }}
                        />
                        <label htmlFor={`cuisine-${cuisine}`} className="text-sm">
                          {cuisine}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AVAILABILITY FILTER */}
                <div>
                  <h4 className="font-medium mb-3">Availability</h4>
                  <div className="space-y-2">
                    {availabilityOptions.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id={`avail-${option}`}
                          name="availability"
                          checked={selectedFilters.availability === option}
                          onChange={() =>
                            setSelectedFilters((prev) => ({ ...prev, availability: option }))
                          }
                        />
                        <label htmlFor={`avail-${option}`} className="text-sm">
                          {option}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  Clear All Filters
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* RESULTS SECTION */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {helpers.length} Helper Services Available
              </h2>

              <select className="border border-gray-300 rounded-md px-3 py-2">
                <option>Sort by: Rating</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Experience: Most to Least</option>
              </select>
            </div>

            <div className="space-y-6">
              {loading ? (
                <p>Loading helpers...</p>
              ) : (
                helpers.map((h) => (
                  <Card key={h.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="md:flex">
                      <div className="md:w-1/4 relative">
                        {/* IMAGE FIX — Auto-load food_images → images → profile_photo → fallback */}
<img
  src={
    // food images (array)
    Array.isArray(h.food_images) && h.food_images.length > 0
      ? h.food_images[0]
      :
    // images column (array)
    Array.isArray(h.images) && h.images.length > 0
      ? h.images[0]
      :
    // profile photo single
    h.profile_photo
      ? h.profile_photo
      :
    // fallback
    "/placeholder.svg"
  }
  alt={h.full_name}
  className="w-full h-64 md:h-full object-cover"
/>


                        <Badge className="absolute top-2 left-2 bg-green-600">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>

                        <Button size="sm" variant="outline" className="absolute top-2 right-2 bg-white/90">
                          <Heart className="w-4 h-4" />
                        </Button>
                      </div>

                      <CardContent className="md:w-3/4 p-6">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-xl flex items-center gap-2">
                              {h.full_name}
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            </h3>

                            <div className="flex items-center text-gray-600 mt-1">
                              <MapPin className="w-4 h-4 mr-1" />
                              <span className="text-sm">
                                {h.city}, {h.district}
                              </span>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-2xl font-bold text-purple-600">₹{h.salaryMin}</span>
                            <span className="text-gray-500">/month</span>
                            <div className="text-sm text-gray-500">Negotiable</div>
                          </div>
                        </div>

                        <p className="text-gray-700 mb-4">
                          Experience: {h.experience_years} years
                        </p>

                        <p className="text-gray-700 mb-4">{h.other_skills}</p>

                        {/* FEATURES */}
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-2">
                            {h.house_cleaning && <Badge variant="secondary">House Cleaning</Badge>}
                            {h.child_care && <Badge variant="secondary">Child Care</Badge>}
                            {h.laundry && <Badge variant="secondary">Laundry</Badge>}
                            {h.elderly_care && <Badge variant="secondary">Elderly Care</Badge>}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-sm text-gray-600">
                            <Users className="w-4 h-4 mr-1" />
                            <span>Available for students</span>
                          </div>

                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Phone className="w-4 h-4 mr-1" />
                              Call
                            </Button>

                            <Button size="sm" variant="outline">
                              <MessageSquare className="w-4 h-4 mr-1" />
                              Message
                            </Button>

                            <Link href={`/maushi-services/${h.id}`}>
                              <Button size="sm">View Details</Button>
                            </Link>

                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>

        {/* HOW IT WORKS — UNCHANGED */}
        <section className="mt-16 bg-white rounded-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-8">How Maushi Service Works</h2>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">1. Search & Filter</h3>
              <p className="text-sm text-gray-600">अपनी location और requirements के according Maushi search करें</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">2. Contact & Discuss</h3>
              <p className="text-sm text-gray-600">Direct Maushi से contact करें, menu और timing discuss करें</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">3. Finalize Deal</h3>
              <p className="text-sm text-gray-600">Price, timing, और menu finalize करके agreement करें</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Utensils className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">4. Enjoy Meals</h3>
              <p className="text-sm text-gray-600">Fresh, homestyle खाना enjoy करें और studies पर focus करें</p>
            </div>
          </div>
        </section>

        {/* BENEFITS — UNCHANGED */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">Why Choose Our Maushi Services?</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-6">
              <CardContent>
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Verified Providers</h3>
                <p className="text-sm text-gray-600">
                  सभी Maushi aunties verified हैं background check के साथ
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent>
                <Star className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Quality Assured</h3>
                <p className="text-sm text-gray-600">
                  High ratings और positive reviews के साथ quality guarantee
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent>
                <IndianRupee className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Affordable Pricing</h3>
                <p className="text-sm text-gray-600">
                  Student budget के according reasonable pricing
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  )
}
