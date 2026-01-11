// app/maushi-services/page.tsx
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
  IndianRupee,
  SlidersHorizontal,
} from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

import Link from "next/link"
import Image from "next/image"
import { resolveImageUrl } from "@/utils/image-utils"

interface Filters {
  priceRange: string
  experience: string
  cuisine: string[]
  availability: string
}

/**
 * MaushiServicesPage
 *
 * - Normalizes DB rows so UI can use consistent fields
 * - Resolves image paths / storage paths to usable public URLs
 * - Does not change UI layout or styling
 */
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
  // Utilities
  // ----------------------------
  const safeParse = (val: any): any => {
    if (val === undefined || val === null) return null
    if (Array.isArray(val)) return val
    if (typeof val === "object") return val
    if (typeof val === "string") {
      const s = val.trim()
      if (!s) return null
      if ((s.startsWith("[") && s.endsWith("]")) || (s.startsWith("{") && s.endsWith("}"))) {
        try {
          return JSON.parse(s)
        } catch {
          // fall through
        }
      }
      if (s.includes(",")) return s.split(",").map((x) => x.trim()).filter(Boolean)
      return s
    }
    return null
  }

  // REMOVED local resolveImageUrl in favor of central utility

  // ----------------------------
  // FETCH HELPERS FROM SUPABASE
  // ----------------------------
  useEffect(() => {
    fetchHelpers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function fetchHelpers() {
    setLoading(true)

    const { data, error } = await supabase
      .from("domestic_helpers")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error(error)
      setLoading(false)
      return
    }

    const normalized = (data || []).map((h: any) => {
      // parse images/food/profile
      const rawImages = safeParse(h.images ?? h.image ?? h.photo_urls ?? h.photos)
      const parsedImages = Array.isArray(rawImages) ? rawImages.map((x: any) => String(x)) : (typeof rawImages === "string" ? [rawImages] : [])

      const rawFood = safeParse(h.food_images ?? h.food_images_json ?? h.foods)
      const parsedFood = Array.isArray(rawFood) ? rawFood.map((x: any) => String(x)) : (typeof rawFood === "string" ? [rawFood] : [])

      const profilePhoto = h.profile_photo ?? h.profilePhoto ?? h.photo ?? null

      const images = parsedImages.map((p: any) => resolveImageUrl(p, "helper-images"))
      const food_images = parsedFood.map((p: any) => resolveImageUrl(p, "helper-images"))
      const profile_photo = resolveImageUrl(profilePhoto, "helper-images")

      const anyImages = [...food_images, ...images, ...(profile_photo ? [profile_photo] : [])].filter(Boolean)
      const mainImage = anyImages.length ? anyImages[0] : "/placeholder.svg"

      // specialties & dishes & cuisine
      const specialtiesA = safeParse(h.specialties) ?? []
      const dishesA = safeParse(h.dishes) ?? []
      const cuisineArr = h.cuisine_type ? (Array.isArray(h.cuisine_type) ? h.cuisine_type : [h.cuisine_type]) : []

      const specialties = ([] as string[]).concat(
        Array.isArray(specialtiesA) ? specialtiesA : (specialtiesA ? [specialtiesA] : []),
        Array.isArray(dishesA) ? dishesA : (dishesA ? [dishesA] : []),
        cuisineArr
      ).filter(Boolean).map((s: any) => String(s))

      // services from json + boolean flags
      const servicesA = safeParse(h.services) ?? []
      const preferredWorkA = safeParse(h.preferred_work ?? h.preferred_work_locations ?? h.preferred_work_location) ?? []

      const booleanServices: string[] = []
      if (h.house_cleaning) booleanServices.push("House Cleaning")
      if (h.child_care) booleanServices.push("Child Care")
      if (h.laundry) booleanServices.push("Laundry")
      if (h.elderly_care) booleanServices.push("Elderly Care")
      if (h.pet_care) booleanServices.push("Pet Care")
      if (h.kitchen_cleaning) booleanServices.push("Kitchen Cleaning")
      if (h.cook_only) booleanServices.push("Cook Only")

      const services = ([] as string[]).concat(
        Array.isArray(servicesA) ? servicesA : (servicesA ? [servicesA] : []),
        Array.isArray(preferredWorkA) ? preferredWorkA : (preferredWorkA ? [preferredWorkA] : []),
        booleanServices
      ).filter(Boolean).map((s: any) => String(s))

      // work hours, preferred employment type, other skills
      const working_hours = safeParse(h.working_hours ?? h.working_hour ?? h.working_time) ?? []
      const preferredEmployment = safeParse(h.preferred_employment_type ?? h.employment_type) ?? []
      const other_skills = h.other_skills ?? h.otherSkills ?? h.skills ?? h.bio ?? ""

      // contact / personal
      const phone = h.phone ?? h.contact ?? ""
      const whatsapp = h.whatsapp ?? h.whatsapp_number ?? ""
      const alternate_phone = h.alternate_phone ?? h.phone_alternate ?? ""

      // final normalized
      return {
        ...h,

        // normalized keys that UI expects
        id: h.id,
        full_name: h.full_name ?? h.name ?? h.owner_name ?? "Helper",
        city: h.city ?? h.location ?? h.area ?? "",
        district: h.district ?? "",
        salaryMin:
          h.salary_min !== null && h.salary_min !== undefined
            ? Number(h.salary_min)
            : "",

        experience_years: h.experience_years ?? h.experience ?? h.years ?? "",
        other_skills,
        images,
        food_images,
        profile_photo,
        _getMainImageUrl: () => mainImage,
        _getAnyImageUrls: () => (anyImages.length ? anyImages : ["/placeholder.svg"]),
        specialties,
        dishes: Array.isArray(dishesA) ? dishesA : (dishesA ? [dishesA] : []),
        cuisine: cuisineArr,
        services,
        working_hours,
        preferredEmployment,
        phone,
        whatsapp,
        alternate_phone,
      }
    })

    setHelpers(normalized)
    setLoading(false)
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

          {/* SEARCH BAR & MOBILE FILTERS */}
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm p-4 border border-gray-100 mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by location..."
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="pl-10 h-12 bg-gray-50/50 border-gray-100 rounded-xl focus:bg-white transition-all"
                />
              </div>
              <div className="flex gap-2">
                <Button className="flex-1 sm:flex-none h-12 rounded-xl bg-purple-600 hover:bg-purple-700 px-8">
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
                <div className="lg:hidden flex-1 sm:flex-none">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="w-full h-12 rounded-xl border-gray-100 hover:bg-gray-50">
                        <SlidersHorizontal className="w-4 h-4" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl p-0 overflow-hidden">
                      <SheetHeader className="p-6 border-b">
                        <SheetTitle className="text-xl font-bold flex items-center gap-2">
                          <Filter className="w-5 h-5 text-purple-600" />
                          Filter Helpers
                        </SheetTitle>
                      </SheetHeader>
                      <div className="overflow-y-auto h-full pb-32 p-6">
                        <FilterContent
                          selectedFilters={selectedFilters}
                          setSelectedFilters={setSelectedFilters}
                          priceRanges={priceRanges}
                          experienceLevels={experienceLevels}
                          cuisineTypes={cuisineTypes}
                          availabilityOptions={availabilityOptions}
                        />
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* STATS SECTION */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
          <Card className="text-center p-2 rounded-2xl border-gray-100 shadow-sm">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-purple-600">500+</div>
              <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">Verified Helpers</div>
            </CardContent>
          </Card>
          <Card className="text-center p-2 rounded-2xl border-gray-100 shadow-sm">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">4.8★</div>
              <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">Average Rating</div>
            </CardContent>
          </Card>
          <Card className="text-center p-2 rounded-2xl border-gray-100 shadow-sm">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-600">2000+</div>
              <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">Happy Students</div>
            </CardContent>
          </Card>
          <Card className="text-center p-2 rounded-2xl border-gray-100 shadow-sm">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-orange-600">₹1200+</div>
              <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">Starting Price</div>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-8">
          {/* FILTER SIDEBAR (Desktop) */}
          <div className="w-80 hidden lg:block shrink-0">
            <Card className="sticky top-24 rounded-2xl border-gray-100 shadow-sm overflow-hidden">
              <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Filter className="w-5 h-5 text-purple-600" />
                  Filters
                </CardTitle>
              </CardHeader>

              <CardContent className="p-6">
                <FilterContent
                  selectedFilters={selectedFilters}
                  setSelectedFilters={setSelectedFilters}
                  priceRanges={priceRanges}
                  experienceLevels={experienceLevels}
                  cuisineTypes={cuisineTypes}
                  availabilityOptions={availabilityOptions}
                />
              </CardContent>
            </Card>
          </div>

          {/* RESULTS SECTION */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                {helpers.length} Helper <span className="text-gray-400 font-normal">Services</span>
              </h2>

              <select className="w-full sm:w-auto border border-gray-100 rounded-xl px-4 py-2 bg-white text-sm font-medium outline-none">
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
                      <div className="md:w-1/4 relative min-h-[200px]">
                        {/* IMAGE FIX — Auto-load food_images → images → profile_photo → fallback */}
                        <div className="relative w-full h-64 md:h-full">
                          <Image
                            src={h._getMainImageUrl ? h._getMainImageUrl() : "/placeholder.svg"}
                            alt={h.full_name}
                            fill
                            className="object-cover"
                          />
                        </div>

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
                                {h.city ?? ""}{h.city && h.district ? ", " : ""}{h.district ?? ""}
                              </span>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-2xl font-bold text-purple-600">
                              {/* salary fallbacks */}
                              {typeof h.salaryMin === "number" || /^\d+$/.test(String(h.salaryMin))
                                ? `₹${h.salaryMin}`
                                : (h.salaryMin ? `₹${h.salaryMin}` : "₹—")}
                            </span>
                            <span className="text-gray-500">/month</span>
                            <div className="text-sm text-gray-500">Negotiable</div>
                          </div>
                        </div>

                        <p className="text-gray-700 mb-2">
                          Experience: {h.experience_years ?? "—"} years
                        </p>

                        {/* Option A placement: below experience -> Add sections */}
                        {/* Specialties */}
                        {h.specialties && h.specialties.length > 0 && (
                          <div className="mb-3">
                            <div className="text-sm font-medium mb-2">Specialties</div>
                            <div className="flex flex-wrap gap-2">
                              {h.specialties.map((s: any, idx: number) => (
                                <Badge key={idx} variant="secondary">{s}</Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Services */}
                        {h.services && h.services.length > 0 && (
                          <div className="mb-3">
                            <div className="text-sm font-medium mb-2">Services</div>
                            <div className="flex flex-wrap gap-2">
                              {h.services.map((s: any, idx: number) => (
                                <Badge key={idx} variant="outline">{s}</Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Cuisine */}
                        {h.cuisine && h.cuisine.length > 0 && (
                          <div className="mb-3">
                            <div className="text-sm font-medium mb-2">Cuisine</div>
                            <div className="flex flex-wrap gap-2">
                              {h.cuisine.map((c: any, idx: number) => (
                                <Badge key={idx} variant="secondary">{c}</Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Working Hours */}
                        {h.working_hours && (Array.isArray(h.working_hours) ? h.working_hours.length > 0 : !!h.working_hours) && (
                          <div className="mb-3">
                            <div className="text-sm font-medium mb-2">Working Hours</div>
                            <div className="text-sm text-gray-600">
                              {Array.isArray(h.working_hours) ? h.working_hours.join(" · ") : String(h.working_hours)}
                            </div>
                          </div>
                        )}

                        {/* Preferred Employment / Other Skills */}
                        {(h.preferredEmployment && h.preferredEmployment.length > 0) || h.other_skills ? (
                          <div className="mb-3">
                            {h.preferredEmployment && h.preferredEmployment.length > 0 && (
                              <>
                                <div className="text-sm font-medium mb-2">Preferred Employment</div>
                                <div className="flex flex-wrap gap-2 mb-2">
                                  {h.preferredEmployment.map((p: any, idx: number) => (
                                    <Badge key={idx} variant="outline">{p}</Badge>
                                  ))}
                                </div>
                              </>
                            )}
                            {h.other_skills && (
                              <>
                                <div className="text-sm font-medium mb-1">Other Skills</div>
                                <div className="text-sm text-gray-700">{String(h.other_skills).slice(0, 140)}</div>
                              </>
                            )}
                          </div>
                        ) : null}

                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-sm text-gray-600">
                            <Users className="w-4 h-4 mr-1" />
                            <span>Available for students</span>
                          </div>

                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" asChild>
                              <a href={`tel:${h.phone ?? ""}`}>
                                <Phone className="w-4 h-4 mr-1" />
                                Call
                              </a>
                            </Button>

                            <Button size="sm" variant="outline" asChild>
                              <a href={`https://wa.me/${h.whatsapp ?? h.phone ?? ""}`}>
                                <MessageSquare className="w-4 h-4 mr-1" />
                                Message
                              </a>
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

// ----------------------------------------
// HOISTED FILTER CONTENT COMPONENT
// ----------------------------------------
function FilterContent({
  selectedFilters,
  setSelectedFilters,
  priceRanges,
  experienceLevels,
  cuisineTypes,
  availabilityOptions
}: any) {
  return (
    <div className="space-y-8">
      {/* PRICE FILTER */}
      <div>
        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Price / Month</h4>
        <div className="space-y-3">
          {priceRanges.map((range: any) => (
            <label key={range.value} className="flex items-center gap-3 group cursor-pointer">
              <input
                type="radio"
                name="priceRangeMob"
                checked={selectedFilters.priceRange === range.value}
                onChange={() =>
                  setSelectedFilters((prev: any) => ({ ...prev, priceRange: range.value }))
                }
                className="w-4 h-4 text-purple-600 focus:ring-purple-500 border-gray-300"
              />
              <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors uppercase">
                {range.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* EXPERIENCE FILTER */}
      <div>
        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Experience</h4>
        <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
          {experienceLevels.map((level: string) => (
            <label key={level} className="flex items-center gap-3 group cursor-pointer">
              <input
                type="radio"
                name="experienceMob"
                checked={selectedFilters.experience === level}
                onChange={() =>
                  setSelectedFilters((prev: any) => ({ ...prev, experience: level }))
                }
                className="w-4 h-4 text-purple-600 focus:ring-purple-500 border-gray-300"
              />
              <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors uppercase">
                {level}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* CUISINE FILTER */}
      <div>
        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Cuisine</h4>
        <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
          {cuisineTypes.map((cuisine: string) => (
            <label key={cuisine} className="flex items-center gap-3 group cursor-pointer">
              <input
                type="checkbox"
                checked={selectedFilters.cuisine.includes(cuisine)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedFilters((prev: any) => ({
                      ...prev,
                      cuisine: [...prev.cuisine, cuisine],
                    }))
                  } else {
                    setSelectedFilters((prev: any) => ({
                      ...prev,
                      cuisine: prev.cuisine.filter((c: any) => c !== cuisine),
                    }))
                  }
                }}
                className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500 border-gray-300"
              />
              <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors uppercase">
                {cuisine}
              </span>
            </label>
          ))}
        </div>
      </div>

      <Button
        variant="ghost"
        className="w-full text-purple-600 hover:text-purple-700 hover:bg-purple-50 font-bold py-6 rounded-xl border border-dashed border-purple-200"
        onClick={() => setSelectedFilters({
          priceRange: "", experience: "", cuisine: [], availability: ""
        })}
      >
        Reset All Filters
      </Button>
    </div>
  )
}
