"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { useEffect } from "react";


import {Search,MapPin,Home,Users,Star,Phone,CheckCircle,Heart,SlidersHorizontal,Bed,Square,Droplets,Wind,} from "lucide-react"
import Link from "next/link"


interface Filters {
  priceRange: string;
  roomType: string[];
  sharing: string[];
  amenities: string[];
  location: string;

}
export default function SearchPage() {

    useEffect(() => {
  requireAuth();
}, []);


  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilters, setSelectedFilters] = useState<Filters>({
    roomType: [],
    priceRange: "",
    sharing: [],
    amenities: [],
    location: "",
  })
  const [showFilters, setShowFilters] = useState(false)

  const rooms = [
    {
      id: 1,
      title: "Spacious 2BHK near GIET College",
      location: "Gunupur, Rayagada, Odisha",
      fullAddress: "Plot No. 45, Sector 7, Near GIET University, Gunupur",
      price: 4500,
      type: "2BHK",
      sharing: "2-3 people",
      image: "/placeholder.svg?height=250&width=400",
      features: ["Furnished", "WiFi", "Parking", "Kitchen", "Maushi Available"],
      rating: 4.8,
      reviews: 24,
      owner: {
        name: "Ramesh Kumar",
        phone: "+91 9876543210",
        verified: true,
      },
      details: {
        bhk: "2BHK",
        doors: 4,
        windows: 6,
        flooring: "Tiles",
        waterSystem: "24/7 Supply",
        balcony: true,
        roofAccess: true,
        parking: "2-Wheeler & 4-Wheeler",
        electricity: "Separate Meter",
        furniture: ["Double Bed", "Study Table", "Chair", "Wardrobe", "Fan", "Light"],
        kitchen: "Modular Kitchen",
        maushiAvailable: true,
      },
      verified: true,
      featured: true,
    },
    {
      id: 2,
      title: "Single Room for Serious Students",
      location: "Berhampur, Ganjam, Odisha",
      fullAddress: "Lane 12, Gandhi Nagar, Near Berhampur University",
      price: 2800,
      type: "1BHK",
      sharing: "Single occupancy",
      image: "/placeholder.svg?height=250&width=400",
      features: ["Study Table", "Separate Meter", "Balcony", "24/7 Water"],
      rating: 4.6,
      reviews: 18,
      owner: {
        name: "Sunita Devi",
        phone: "+91 9123456789",
        verified: true,
      },
      details: {
        bhk: "1BHK",
        doors: 2,
        windows: 3,
        flooring: "Cement",
        waterSystem: "Bore Well + Municipal",
        balcony: true,
        roofAccess: false,
        parking: "2-Wheeler Only",
        electricity: "Separate Meter",
        furniture: ["Single Bed", "Study Table", "Chair", "Small Wardrobe", "Fan"],
        kitchen: "Basic Kitchen",
        maushiAvailable: false,
      },
      verified: true,
      featured: false,
    },
    {
      id: 3,
      title: "Group Accommodation - Perfect for Friends",
      location: "Bhubaneswar, Khordha, Odisha",
      fullAddress: "Flat 3B, Sunshine Apartments, Patia, Bhubaneswar",
      price: 1800,
      type: "3BHK",
      sharing: "6 people",
      image: "/placeholder.svg?height=250&width=400",
      features: ["Large Kitchen", "Common Area", "Laundry", "Security", "Maushi Service"],
      rating: 4.9,
      reviews: 42,
      owner: {
        name: "Prakash Sahoo",
        phone: "+91 8765432109",
        verified: true,
      },
      details: {
        bhk: "3BHK",
        doors: 6,
        windows: 8,
        flooring: "Tiles",
        waterSystem: "24/7 Municipal Supply",
        balcony: true,
        roofAccess: true,
        parking: "4-Wheeler Available",
        electricity: "Included in Rent",
        furniture: ["6 Beds", "Study Tables", "Chairs", "Large Wardrobes", "Common TV"],
        kitchen: "Large Modular Kitchen",
        maushiAvailable: true,
      },
      verified: true,
      featured: true,
    },
    {
      id: 4,
      title: "Budget Room near Bus Stand",
      location: "Cuttack, Cuttack, Odisha",
      fullAddress: "Near Badambadi Bus Stand, Link Road, Cuttack",
      price: 2200,
      type: "1BHK",
      sharing: "Single/Double",
      image: "/placeholder.svg?height=250&width=400",
      features: ["Near Transport", "Basic Furniture", "Shared Kitchen"],
      rating: 4.2,
      reviews: 12,
      owner: {
        name: "Bijay Mohanty",
        phone: "+91 7890123456",
        verified: true,
      },
      details: {
        bhk: "1BHK",
        doors: 2,
        windows: 2,
        flooring: "Cement",
        waterSystem: "Municipal Supply",
        balcony: false,
        roofAccess: true,
        parking: "2-Wheeler Only",
        electricity: "Shared Meter",
        furniture: ["Bed", "Small Table", "Chair", "Fan"],
        kitchen: "Shared Kitchen",
        maushiAvailable: false,
      },
      verified: true,
      featured: false,
    },
    {
      id: 5,
      title: "Premium Room with All Amenities",
      location: "Rourkela, Sundargarh, Odisha",
      fullAddress: "Sector 1, Housing Board Colony, Rourkela",
      price: 5500,
      type: "2BHK",
      sharing: "2 people",
      image: "/placeholder.svg?height=250&width=400",
      features: ["AC", "WiFi", "Gym", "Security", "Housekeeping", "Maushi"],
      rating: 4.9,
      reviews: 35,
      owner: {
        name: "Anita Patel",
        phone: "+91 9988776655",
        verified: true,
      },
      details: {
        bhk: "2BHK",
        doors: 4,
        windows: 5,
        flooring: "Premium Tiles",
        waterSystem: "RO + 24/7 Supply",
        balcony: true,
        roofAccess: true,
        parking: "Covered Parking",
        electricity: "Separate Meter",
        furniture: ["Premium Beds", "Study Desks", "AC", "TV", "Fridge", "Wardrobes"],
        kitchen: "Fully Equipped Kitchen",
        maushiAvailable: true,
      },
      verified: true,
      featured: true,
    },
  ]

  const roomTypes = ["1BHK", "2BHK", "3BHK", "Single Room", "Shared Room"]
  const sharingOptions = ["Single occupancy", "2 people", "3-4 people", "5-6 people"]
  const amenities = ["WiFi", "Parking", "Kitchen", "Maushi Available", "AC", "Furnished", "Security", "Laundry"]
  const priceRanges = [
    { label: "Under ₹2000", value: "0-2000" },
    { label: "₹2000-₹4000", value: "2000-4000" },
    { label: "₹4000-₹6000", value: "4000-6000" },
    { label: "Above ₹6000", value: "6000-999999" },
  ]

  const filteredRooms = rooms.filter((room) => {
    // Search query filter
    if (
      searchQuery &&
      !room.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !room.location.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }

    // Room type filter
    if (selectedFilters.roomType.length > 0 && !selectedFilters.roomType.includes(room.type)) {
      return false
    }

    // Price range filter
    if (selectedFilters.priceRange) {
      const [min, max] = selectedFilters.priceRange.split("-").map(Number)
      if (room.price < min || room.price > max) {
        return false
      }
    }

    // Sharing filter
    if (selectedFilters.sharing.length > 0 && !selectedFilters.sharing.includes(room.sharing)) {
      return false
    }

    // Amenities filter
    if (selectedFilters.amenities.length > 0) {
      const hasAllAmenities = selectedFilters.amenities.every((amenity) => room.features.includes(amenity))
      if (!hasAllAmenities) {
        return false
      }
    }

    return true
  })

  type FilterType = "roomType" | "sharing" | "amenities" | "priceRange" | "location";

const handleFilterChange = (
  filterType: FilterType,
  value: string,
  checked: boolean
) => {
  setSelectedFilters((prev) => {
    if (filterType === "priceRange" || filterType === "location") {
      return {
        ...prev,
        [filterType]: checked ? value : ""
      };
    } else {
      const currentValues = prev[filterType] as string[];
      if (checked) {
        return {
          ...prev,
          [filterType]: [...currentValues, value]
        };
      } else {
        return {
          ...prev,
          [filterType]: currentValues.filter((v) => v !== value)
        };
      }
    }
  });
};


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <Home className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">RoomFinder</span>
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link href="/search" className="text-blue-600 font-medium">
                Search Rooms
              </Link>
              <Link href="/list-property" className="text-gray-700 hover:text-blue-600">
                List Property
              </Link>
              <Link href="/maushi-services" className="text-gray-700 hover:text-blue-600">
                Maushi Services
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
        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by location, room type, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </Button>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className={`w-80 ${showFilters ? "block" : "hidden"} lg:block`}>
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h3 className="text-lg font-semibold mb-4">Filters</h3>

              {/* Room Type */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Room Type</h4>
                <div className="space-y-2">
                  {roomTypes.map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={`room-${type}`}
                        checked={selectedFilters.roomType.includes(type)}
                        onCheckedChange={(checked: boolean) => handleFilterChange("roomType", type, checked)}

                      />
                      <label htmlFor={`room-${type}`} className="text-sm">
                        {type}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Price Range</h4>
                <div className="space-y-2">
                  {priceRanges.map((range) => (
                    <div key={range.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`price-${range.value}`}
                        checked={selectedFilters.priceRange === range.value}
                        onCheckedChange={(checked: boolean) => handleFilterChange("priceRange", range.value, checked)}

                      />
                      <label htmlFor={`price-${range.value}`} className="text-sm">
                        {range.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sharing Options */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Sharing</h4>
                <div className="space-y-2">
                  {sharingOptions.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox
                        id={`sharing-${option}`}
                        checked={selectedFilters.sharing.includes(option)}
                        onCheckedChange={(checked: boolean) => handleFilterChange("sharing", option, checked)}

                      />
                      <label htmlFor={`sharing-${option}`} className="text-sm">
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Amenities</h4>
                <div className="space-y-2">
                  {amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center space-x-2">
                      <Checkbox
                        id={`amenity-${amenity}`}
                        checked={selectedFilters.amenities.includes(amenity)}
                        onCheckedChange={(checked: boolean) => handleFilterChange("amenities", amenity, checked)}

                      />
                      <label htmlFor={`amenity-${amenity}`} className="text-sm">
                        {amenity}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={() =>
                  setSelectedFilters({ roomType: [], priceRange: "", sharing: [], amenities: [], location: "" })
                }
              >
                Clear All Filters
              </Button>
            </div>
          </div>

          {/* Results */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{filteredRooms.length} Rooms Found</h2>
              <select className="border border-gray-300 rounded-md px-3 py-2">
                <option>Sort by: Relevance</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Rating: High to Low</option>
                <option>Newest First</option>
              </select>
            </div>

            <div className="space-y-6">
              {filteredRooms.map((room) => (
                <Card key={room.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="md:flex">
                    <div className="md:w-1/3 relative">
                      <img
                        src={room.image || "/placeholder.svg"}
                        alt={room.title}
                        className="w-full h-64 md:h-full object-cover"
                      />
                      <Button size="sm" variant="outline" className="absolute top-2 right-2 bg-white/90 hover:bg-white">
                        <Heart className="w-4 h-4" />
                      </Button>
                      {room.verified && (
                        <Badge className="absolute top-2 left-2 bg-green-600">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                      {room.featured && <Badge className="absolute bottom-2 left-2 bg-orange-600">Featured</Badge>}
                    </div>

                    <CardContent className="md:w-2/3 p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-xl">{room.title}</h3>
                        <div className="text-right">
                          <span className="text-2xl font-bold text-blue-600">₹{room.price}</span>
                          <span className="text-gray-500">/month</span>
                        </div>
                      </div>

                      <div className="flex items-center text-gray-600 mb-3">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span className="text-sm">{room.fullAddress}</span>
                      </div>

                      <div className="flex items-center gap-4 mb-4">
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Home className="w-3 h-3" />
                          {room.type}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {room.sharing}
                        </Badge>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="ml-1 text-sm font-medium">{room.rating}</span>
                          <span className="ml-1 text-sm text-gray-500">({room.reviews})</span>
                        </div>
                      </div>

                      {/* Room Details */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Bed className="w-4 h-4 text-gray-500" />
                          <span>{room.details.bhk}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Square className="w-4 h-4 text-gray-500" />
                          <span>{room.details.doors} Doors</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Wind className="w-4 h-4 text-gray-500" />
                          <span>{room.details.windows} Windows</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Droplets className="w-4 h-4 text-gray-500" />
                          <span>{room.details.waterSystem}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {room.features.map((feature, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-600">
                          <Users className="w-4 h-4 mr-1" />
                          <span>{room.owner.name}</span>
                          {room.owner.verified && <CheckCircle className="w-4 h-4 ml-1 text-green-600" />}
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Phone className="w-4 h-4 mr-1" />
                            Call
                          </Button>
                          <Link href={`/room/${room.id}`}>
                            <Button size="sm">View Details</Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>

            {filteredRooms.length === 0 && (
              <div className="text-center py-12">
                <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No rooms found</h3>
                <p className="text-gray-500">Try adjusting your filters or search criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
