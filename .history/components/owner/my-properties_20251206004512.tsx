"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Search,
  Filter,
  MoreVertical,
  MapPin,
  Bed,
  Bath,
  Square,
  Eye,
  Edit,
  Trash2,
  Plus,
  Grid3X3,
  List,
} from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const properties = [
  {
    id: 1,
    title: "2BHK Apartment",
    location: "Koramangala, Bangalore",
    type: "Apartment",
    rent: "₹15,000/mo",
    deposit: "₹30,000",
    bedrooms: 2,
    bathrooms: 2,
    area: "900 sq.ft",
    status: "available",
    views: 245,
    image: "/modern-apartment.png",
    verified: true,
  },
  {
    id: 2,
    title: "Single Room",
    location: "Indiranagar, Bangalore",
    type: "Room",
    rent: "₹8,000/mo",
    deposit: "₹16,000",
    bedrooms: 1,
    bathrooms: 1,
    area: "250 sq.ft",
    status: "occupied",
    views: 189,
    image: "/cozy-single-room.jpg",
    verified: true,
  },
  {
    id: 3,
    title: "PG Room",
    location: "HSR Layout, Bangalore",
    type: "PG",
    rent: "₹6,500/mo",
    deposit: "₹13,000",
    bedrooms: 1,
    bathrooms: 1,
    area: "150 sq.ft",
    status: "available",
    views: 156,
    image: "/pg-room-hostel.jpg",
    verified: false,
  },
  {
    id: 4,
    title: "3BHK House",
    location: "Whitefield, Bangalore",
    type: "House",
    rent: "₹25,000/mo",
    deposit: "₹50,000",
    bedrooms: 3,
    bathrooms: 2,
    area: "1400 sq.ft",
    status: "available",
    views: 312,
    image: "/3bhk-house-exterior.jpg",
    verified: true,
  },
  {
    id: 5,
    title: "Studio Apartment",
    location: "MG Road, Bangalore",
    type: "Studio",
    rent: "₹12,000/mo",
    deposit: "₹24,000",
    bedrooms: 1,
    bathrooms: 1,
    area: "450 sq.ft",
    status: "maintenance",
    views: 98,
    image: "/studio-apartment-modern.jpg",
    verified: true,
  },
  {
    id: 6,
    title: "Shared Room",
    location: "Electronic City, Bangalore",
    type: "Sharing",
    rent: "₹4,500/mo",
    deposit: "₹9,000",
    bedrooms: 1,
    bathrooms: 1,
    area: "200 sq.ft",
    status: "occupied",
    views: 67,
    image: "/shared-room-hostel.jpg",
    verified: false,
  },
]

export function MyProperties() {
  const [view, setView] = useState<"grid" | "list">("grid")
  const [filter, setFilter] = useState("all")

  const filteredProperties = properties.filter((p) => {
    if (filter === "all") return true
    return p.status === filter
  })

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-1 gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search properties..." className="pl-10" />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 bg-transparent">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFilter("all")}>All Properties</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("available")}>Available</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("occupied")}>Occupied</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("maintenance")}>Maintenance</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex gap-3">
          <Tabs value={view} onValueChange={(v) => setView(v as "grid" | "list")}>
            <TabsList className="h-10">
              <TabsTrigger value="grid" className="px-3">
                <Grid3X3 className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="list" className="px-3">
                <List className="h-4 w-4" />
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
            <Link href="/list-property">
            Add Property
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-2xl font-bold">12</p>
            <p className="text-sm text-muted-foreground">Total Properties</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-green-600">8</p>
            <p className="text-sm text-muted-foreground">Available</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-blue-600">3</p>
            <p className="text-sm text-muted-foreground">Occupied</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-orange-600">1</p>
            <p className="text-sm text-muted-foreground">Maintenance</p>
          </CardContent>
        </Card>
      </div>

      {/* Properties Grid/List */}
      {view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <Card key={property.id} className="border-0 shadow-sm overflow-hidden group">
              <div className="relative">
                <img
                  src={property.image || "/placeholder.svg"}
                  alt={property.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Badge
                  className={`absolute top-3 left-3 ${
                    property.status === "available"
                      ? "bg-green-500"
                      : property.status === "occupied"
                        ? "bg-blue-500"
                        : "bg-orange-500"
                  } text-white`}
                >
                  {property.status}
                </Badge>
                {property.verified && (
                  <Badge className="absolute top-3 right-3 bg-green-100 text-green-700">✓ Verified</Badge>
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">{property.title}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {property.location}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="gap-2">
                        <Eye className="h-4 w-4" /> View
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2">
                        <Edit className="h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2 text-red-600">
                        <Trash2 className="h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <span className="flex items-center gap-1">
                    <Bed className="h-4 w-4" /> {property.bedrooms}
                  </span>
                  <span className="flex items-center gap-1">
                    <Bath className="h-4 w-4" /> {property.bathrooms}
                  </span>
                  <span className="flex items-center gap-1">
                    <Square className="h-4 w-4" /> {property.area}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t">
                  <div>
                    <p className="text-lg font-bold text-blue-600">{property.rent}</p>
                    <p className="text-xs text-muted-foreground">Deposit: {property.deposit}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm flex items-center gap-1 text-muted-foreground">
                      <Eye className="h-4 w-4" /> {property.views} views
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProperties.map((property) => (
            <Card key={property.id} className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <img
                    src={property.image || "/placeholder.svg"}
                    alt={property.title}
                    className="w-full sm:w-48 h-32 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">{property.title}</h3>
                          <Badge
                            className={`${
                              property.status === "available"
                                ? "bg-green-100 text-green-700"
                                : property.status === "occupied"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-orange-100 text-orange-700"
                            }`}
                          >
                            {property.status}
                          </Badge>
                          {property.verified && <Badge className="bg-green-100 text-green-700">✓ Verified</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3" />
                          {property.location}
                        </p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="gap-2">
                            <Eye className="h-4 w-4" /> View
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            <Edit className="h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 text-red-600">
                            <Trash2 className="h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                      <span className="flex items-center gap-1">
                        <Bed className="h-4 w-4" /> {property.bedrooms} Bed
                      </span>
                      <span className="flex items-center gap-1">
                        <Bath className="h-4 w-4" /> {property.bathrooms} Bath
                      </span>
                      <span className="flex items-center gap-1">
                        <Square className="h-4 w-4" /> {property.area}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" /> {property.views} views
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <div className="flex items-center gap-4">
                        <p className="text-lg font-bold text-blue-600">{property.rent}</p>
                        <p className="text-sm text-muted-foreground">Deposit: {property.deposit}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
