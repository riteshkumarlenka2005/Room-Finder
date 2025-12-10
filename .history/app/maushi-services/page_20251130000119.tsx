"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { requireAuth } from "@/lib/checkAuth";
import { useEffect } from "react";


import {Search,MapPin,Home,Users,Star,Phone,MessageSquare,Utensils,CheckCircle,Heart,Filter,Clock,IndianRupee,Award,ChefHat,
} from "lucide-react"
import Link from "next/link"

interface Filters {
  priceRange: string;
  experience: string;
  cuisine: string[];
  availability: string;
}

export default function MaushiServicesPage() {

  useEffect(() => {
  requireAuth();
}, []);



  const [searchLocation, setSearchLocation] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<Filters>({
    priceRange: "",
    experience: "",
    cuisine: [],
    availability: "",
  });


  const maushiProviders = [
    {
      id: 1,
      name: "Kamala Devi",
      location: "Gunupur, Rayagada",
      experience: "15+ years",
      rating: 4.9,
      reviews: 45,
      image: "/placeholder.svg?height=200&width=200",
      specialties: ["Odia Cuisine", "North Indian", "South Indian"],
      services: ["Breakfast", "Lunch", "Dinner", "Tiffin Service"],
      pricing: {
        perPerson: 1500,
        perMeal: 50,
      },
      availability: "Full Time",
      verified: true,
      description:
        "Experienced cook with 15+ years. Specializes in healthy, homestyle cooking. Very hygienic and punctual.",
      phone: "+91 9876543210",
      features: ["Hygienic Cooking", "On-time Service", "Customizable Menu", "Special Diet Options"],
    },
    {
      id: 2,
      name: "Sunita Sahoo",
      location: "Berhampur, Ganjam",
      experience: "10+ years",
      rating: 4.7,
      reviews: 32,
      image: "/placeholder.svg?height=200&width=200",
      specialties: ["Odia Traditional", "Bengali", "Gujarati"],
      services: ["Lunch", "Dinner", "Festival Cooking"],
      pricing: {
        perPerson: 1200,
        perMeal: 40,
      },
      availability: "Part Time",
      verified: true,
      description: "Traditional Odia cooking expert. Known for authentic flavors and variety in daily meals.",
      phone: "+91 9123456789",
      features: ["Traditional Recipes", "Festival Specials", "Variety in Menu", "Budget Friendly"],
    },
    {
      id: 3,
      name: "Rekha Patel",
      location: "Bhubaneswar, Khordha",
      experience: "12+ years",
      rating: 4.8,
      reviews: 38,
      image: "/placeholder.svg?height=200&width=200",
      specialties: ["North Indian", "Chinese", "Continental"],
      services: ["All Meals", "Tiffin", "Party Catering"],
      pricing: {
        perPerson: 1800,
        perMeal: 60,
      },
      availability: "Full Time",
      verified: true,
      description: "Professional cook with hotel experience. Excellent in multiple cuisines and presentation.",
      phone: "+91 8765432109",
      features: ["Multi-cuisine Expert", "Professional Training", "Presentation Skills", "Party Catering"],
    },
    {
      id: 4,
      name: "Laxmi Jena",
      location: "Cuttack, Cuttack",
      experience: "8+ years",
      rating: 4.5,
      reviews: 28,
      image: "/placeholder.svg?height=200&width=200",
      specialties: ["Healthy Cooking", "Diet Food", "Odia Cuisine"],
      services: ["Breakfast", "Lunch", "Diet Meals"],
      pricing: {
        perPerson: 1300,
        perMeal: 45,
      },
      availability: "Morning & Afternoon",
      verified: true,
      description: "Specializes in healthy and diet-conscious cooking. Perfect for health-conscious students.",
      phone: "+91 7890123456",
      features: ["Health Conscious", "Diet Specialist", "Fresh Ingredients", "Nutritious Meals"],
    },
  ]

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
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <Home className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">RoomFinder</span>
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link href="/search" className="text-gray-700 hover:text-blue-600">
                Search Rooms
              </Link>
              <Link href="/list-property" className="text-gray-700 hover:text-blue-600">
                List Property
              </Link>
              <Link href="/maushi-services" className="text-blue-600 font-medium">
                Domestic helper
              </Link>
            </nav>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Find Experienced <span className="text-purple-600">Domestic helper</span>
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Cooking की tension नहीं! Experienced  aunties से मिलेगा homestyle खाना
          </p>

          {/* Search Bar */}
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

        {/* Stats */}
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
          {/* Filters Sidebar */}
          <div className="w-80 hidden lg:block">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Price Range */}
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
                          onChange={() => setSelectedFilters((prev) => ({ ...prev, priceRange: range.value }))}
                          className="text-purple-600"
                        />
                        <label htmlFor={`price-${range.value}`} className="text-sm">
                          {range.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Experience */}
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
                          onChange={() => setSelectedFilters((prev) => ({ ...prev, experience: level }))}
                          className="text-purple-600"
                        />
                        <label htmlFor={`exp-${level}`} className="text-sm">
                          {level}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cuisine */}
                <div>
                  <h4 className="font-medium mb-3">Cuisine Specialties</h4>
                  <div className="space-y-2">
                    {cuisineTypes.map((cuisine) => (
                      <div key={cuisine} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`cuisine-${cuisine}`}
                          checked={selectedFilters.cuisine.includes(cuisine)}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {

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
                          className="text-purple-600"
                        />
                        <label htmlFor={`cuisine-${cuisine}`} className="text-sm">
                          {cuisine}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Availability */}
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
                          onChange={() => setSelectedFilters((prev) => ({ ...prev, availability: option }))}
                          className="text-purple-600"
                        />
                        <label htmlFor={`avail-${option}`} className="text-sm">
                          {option}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <Button variant="outline" className="w-full bg-transparent">
                  Clear All Filters
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{maushiProviders.length} Helper Services Available</h2>
              <select className="border border-gray-300 rounded-md px-3 py-2">
                <option>Sort by: Rating</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Experience: Most to Least</option>
              </select>
            </div>

            <div className="space-y-6">
              {maushiProviders.map((maushi) => (
                <Card key={maushi.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="md:flex">
                    <div className="md:w-1/4 relative">
                      <img
                        src={maushi.image || "/placeholder.svg"}
                        alt={maushi.name}
                        className="w-full h-64 md:h-full object-cover"
                      />
                      {maushi.verified && (
                        <Badge className="absolute top-2 left-2 bg-green-600">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                      <Button size="sm" variant="outline" className="absolute top-2 right-2 bg-white/90 hover:bg-white">
                        <Heart className="w-4 h-4" />
                      </Button>
                    </div>

                    <CardContent className="md:w-3/4 p-6">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-xl flex items-center gap-2">
                            {maushi.name}
                            {maushi.verified && <CheckCircle className="w-5 h-5 text-green-600" />}
                          </h3>
                          <div className="flex items-center text-gray-600 mt-1">
                            <MapPin className="w-4 h-4 mr-1" />
                            <span className="text-sm">{maushi.location}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-bold text-purple-600">₹{maushi.pricing.perPerson}</span>
                          <span className="text-gray-500">/month</span>
                          <div className="text-sm text-gray-500">₹{maushi.pricing.perMeal} per meal</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="ml-1 font-medium">{maushi.rating}</span>
                          <span className="ml-1 text-gray-500 text-sm">({maushi.reviews} reviews)</span>
                        </div>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Award className="w-3 h-3" />
                          {maushi.experience}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {maushi.availability}
                        </Badge>
                      </div>

                      <p className="text-gray-700 mb-4">{maushi.description}</p>

                      {/* Specialties */}
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Specialties:</h4>
                        <div className="flex flex-wrap gap-2">
                          {maushi.specialties.map((specialty, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              <ChefHat className="w-3 h-3 mr-1" />
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Services */}
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Services:</h4>
                        <div className="flex flex-wrap gap-2">
                          {maushi.services.map((service, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              <Utensils className="w-3 h-3 mr-1" />
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Features */}
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {maushi.features.map((feature, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
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
                          <Button size="sm">View Details</Button>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* How It Works */}
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

        {/* Benefits */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">Why Choose Our Maushi Services?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-6">
              <CardContent>
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Verified Providers</h3>
                <p className="text-sm text-gray-600">सभी Maushi aunties verified हैं background check के साथ</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6">
              <CardContent>
                <Star className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Quality Assured</h3>
                <p className="text-sm text-gray-600">High ratings और positive reviews के साथ quality guarantee</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6">
              <CardContent>
                <IndianRupee className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Affordable Pricing</h3>
                <p className="text-sm text-gray-600">Student budget के according reasonable pricing</p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  )
}
