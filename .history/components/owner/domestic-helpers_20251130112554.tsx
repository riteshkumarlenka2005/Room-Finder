"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Star, MapPin, Phone, IndianRupee, ChefHat, Sparkles, Baby, Heart, Plus } from "lucide-react"

const helpers = [
  {
    id: 1,
    name: "Lakshmi Devi",
    role: "Cook",
    experience: "8 years",
    rating: 4.8,
    reviews: 45,
    location: "Koramangala",
    availability: "Available",
    salary: "₹8,000-12,000/mo",
    skills: ["North Indian", "South Indian", "Chinese"],
    languages: ["Hindi", "Kannada", "English"],
    image: "/indian-woman-cook.jpg",
    verified: true,
    hired: true,
  },
  {
    id: 2,
    name: "Sunita Kumari",
    role: "House Cleaner",
    experience: "5 years",
    rating: 4.6,
    reviews: 32,
    location: "Indiranagar",
    availability: "Available",
    salary: "₹6,000-9,000/mo",
    skills: ["Deep Cleaning", "Laundry", "Utensils"],
    languages: ["Hindi", "Tamil"],
    image: "/indian-woman-cleaner.jpg",
    verified: true,
    hired: false,
  },
  {
    id: 3,
    name: "Meera Bai",
    role: "Babysitter",
    experience: "10 years",
    rating: 4.9,
    reviews: 67,
    location: "HSR Layout",
    availability: "Busy",
    salary: "₹10,000-15,000/mo",
    skills: ["Child Care", "First Aid", "Teaching"],
    languages: ["Hindi", "English", "Kannada"],
    image: "/indian-woman-nanny.jpg",
    verified: true,
    hired: true,
  },
  {
    id: 4,
    name: "Kamala Devi",
    role: "Elderly Care",
    experience: "12 years",
    rating: 4.7,
    reviews: 28,
    location: "Whitefield",
    availability: "Available",
    salary: "₹12,000-18,000/mo",
    skills: ["Patient Care", "Medicine Management", "Physiotherapy Assist"],
    languages: ["Hindi", "Telugu", "English"],
    image: "/indian-woman-caretaker.jpg",
    verified: true,
    hired: false,
  },
]

const myHelpers = helpers.filter((h) => h.hired)

export function DomesticHelpers() {
  const [activeTab, setActiveTab] = useState("my-helpers")
  const [searchQuery, setSearchQuery] = useState("")

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "Cook":
        return <ChefHat className="h-4 w-4" />
      case "House Cleaner":
        return <Sparkles className="h-4 w-4" />
      case "Babysitter":
        return <Baby className="h-4 w-4" />
      case "Elderly Care":
        return <Heart className="h-4 w-4" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-2xl font-bold">2</p>
            <p className="text-sm text-muted-foreground">My Helpers</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-green-600">150+</p>
            <p className="text-sm text-muted-foreground">Available Helpers</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-blue-600">₹18,000</p>
            <p className="text-sm text-muted-foreground">Monthly Expense</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-yellow-600">4.8</p>
            <p className="text-sm text-muted-foreground">Avg. Rating</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <TabsList>
            <TabsTrigger value="my-helpers">My Helpers</TabsTrigger>
            <TabsTrigger value="browse">Browse Helpers</TabsTrigger>
          </TabsList>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
            <Plus className="h-4 w-4" />
            Post Requirement
          </Button>
        </div>

        <TabsContent value="my-helpers" className="mt-6">
          {myHelpers.length === 0 ? (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No helpers hired yet</h3>
                <p className="text-muted-foreground mb-4">
                  Browse and hire domestic helpers for cooking, cleaning, and more.
                </p>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setActiveTab("browse")}>
                  Browse Helpers
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myHelpers.map((helper) => (
                <Card key={helper.id} className="border-0 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={helper.image || "/placeholder.svg"} />
                        <AvatarFallback className="bg-blue-100 text-blue-600 text-lg">
                          {helper.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">{helper.name}</h3>
                          {helper.verified && <Badge className="bg-green-100 text-green-700">✓ Verified</Badge>}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          {getRoleIcon(helper.role)}
                          <span className="text-sm font-medium">{helper.role}</span>
                          <span className="text-muted-foreground">•</span>
                          <span className="text-sm text-muted-foreground">{helper.experience}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{helper.rating}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">({helper.reviews} reviews)</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex flex-wrap gap-2">
                        {helper.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {helper.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <IndianRupee className="h-4 w-4" />
                          {helper.salary}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" className="flex-1 gap-2 bg-transparent">
                        <Phone className="h-4 w-4" />
                        Call
                      </Button>
                      <Button variant="outline" className="flex-1 bg-transparent">
                        View Profile
                      </Button>
                      <Button variant="outline" className="text-red-600 hover:bg-red-50 bg-transparent">
                        Release
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="browse" className="mt-6">
          <div className="space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, role, or location..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <ChefHat className="h-4 w-4 mr-2" /> Cook
                </Button>
                <Button variant="outline" size="sm">
                  <Sparkles className="h-4 w-4 mr-2" /> Cleaner
                </Button>
                <Button variant="outline" size="sm">
                  <Baby className="h-4 w-4 mr-2" /> Babysitter
                </Button>
              </div>
            </div>

            {/* Helpers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {helpers.map((helper) => (
                <Card key={helper.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-14 w-14">
                        <AvatarImage src={helper.image || "/placeholder.svg"} />
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          {helper.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{helper.name}</h3>
                          {helper.verified && <Badge className="bg-green-100 text-green-700 text-xs">✓</Badge>}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          {getRoleIcon(helper.role)}
                          <span className="text-sm">{helper.role}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{helper.rating}</span>
                          <span className="text-xs text-muted-foreground">({helper.reviews})</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex flex-wrap gap-1">
                        {helper.skills.slice(0, 3).map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {helper.location}
                        </span>
                        <Badge
                          className={
                            helper.availability === "Available"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }
                        >
                          {helper.availability}
                        </Badge>
                      </div>
                      <p className="text-sm font-semibold text-blue-600">{helper.salary}</p>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" className="flex-1 bg-transparent">
                        View Profile
                      </Button>
                      <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white" disabled={helper.hired}>
                        {helper.hired ? "Hired" : "Hire Now"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
