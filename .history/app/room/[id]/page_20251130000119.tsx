"use client"

import { useState } from "react"
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
  Camera,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"

export default function RoomDetailsPage({ params }: { params: { id: string } }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showContactForm, setShowContactForm] = useState(false)

  // Mock data - in real app, fetch based on params.id
  const room = {
    id: 1,
    title: "Spacious 2BHK near GIET College",
    location: "Gunupur, Rayagada, Odisha",
    fullAddress: "Plot No. 45, Sector 7, Near GIET University, Gunupur, Rayagada - 765022",
    price: 4500,
    type: "2BHK",
    sharing: "2-3 people",
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
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
      furniture: [
        "2 Double Beds with Mattress",
        "2 Study Tables with Chairs",
        "2 Large Wardrobes",
        "Ceiling Fans in all rooms",
        "LED Lights",
        "Dining Table with 4 Chairs",
        "Sofa Set in Living Room",
        "TV Unit",
        "Shoe Rack",
        "Curtains and Blinds",
      ],
      kitchen: "Fully Equipped Modular Kitchen",
      kitchenItems: [
        "Gas Stove with Cylinder",
        "Chimney and Exhaust Fan",
        "Refrigerator",
        "Microwave Oven",
        "Water Purifier (RO)",
        "Kitchen Cabinets",
        "Sink with Hot Water",
        "All Basic Utensils",
      ],
      maushiAvailable: true,
      maushiDetails: {
        available: true,
        cost: "₹1500/month per person",
        meals: "Breakfast, Lunch, Dinner",
        cuisine: "Odia, North Indian",
        experience: "15+ years experience",
      },
    },
    amenities: [
      { icon: Wifi, name: "High Speed WiFi", description: "100 Mbps unlimited" },
      { icon: Car, name: "Parking", description: "Covered parking for 2 & 4 wheeler" },
      { icon: Shield, name: "Security", description: "24/7 security guard" },
      { icon: Droplets, name: "Water Supply", description: "24/7 water with backup" },
      { icon: Zap, name: "Power Backup", description: "Generator backup available" },
      { icon: Utensils, name: "Kitchen", description: "Fully equipped modular kitchen" },
    ],
    nearbyPlaces: [
      { name: "GIET University", distance: "0.5 km", type: "College" },
      { name: "City Hospital", distance: "1.2 km", type: "Hospital" },
      { name: "Big Bazaar", distance: "0.8 km", type: "Shopping" },
      { name: "Bus Stand", distance: "1.5 km", type: "Transport" },
      { name: "Railway Station", distance: "3.2 km", type: "Transport" },
      { name: "ATM", distance: "0.3 km", type: "Banking" },
    ],
    rules: [
      "No smoking inside the premises",
      "No loud music after 10 PM",
      "Visitors allowed till 9 PM",
      "Monthly rent to be paid by 5th of every month",
      "2 months advance + 1 month security deposit",
      "Minimum stay period: 6 months",
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
      comment:
        "Excellent room with all facilities. Owner is very cooperative and Maushi aunty cooks delicious food. Highly recommended for students!",
      helpful: 12,
    },
    {
      id: 2,
      user: "Rahul Patel",
      rating: 4,
      date: "1 month ago",
      comment:
        "Good location near college. Room is spacious and well-furnished. Only issue is parking space is limited during peak hours.",
      helpful: 8,
    },
    {
      id: 3,
      user: "Sneha Das",
      rating: 5,
      date: "2 months ago",
      comment:
        "Perfect for 2 friends sharing. Kitchen is well-equipped and Maushi service is excellent. Owner maintains the property very well.",
      helpful: 15,
    },
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
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Heart className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <Card className="overflow-hidden">
              <div className="relative">
                <img
                  src={room.images[currentImageIndex] || "/placeholder.svg"}
                  alt={room.title}
                  className="w-full h-96 object-cover"
                />
                <div className="absolute bottom-4 left-4 flex space-x-2">
                  {room.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-3 h-3 rounded-full ${index === currentImageIndex ? "bg-white" : "bg-white/50"}`}
                    />
                  ))}
                </div>
                <Badge className="absolute top-4 left-4 bg-green-600">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
                {room.featured && <Badge className="absolute top-4 right-4 bg-orange-600">Featured</Badge>}
                <Button size="sm" variant="outline" className="absolute bottom-4 right-4 bg-white/90 hover:bg-white">
                  <Camera className="w-4 h-4 mr-2" />
                  View All Photos
                </Button>
              </div>
            </Card>

            {/* Room Details */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">{room.title}</CardTitle>
                    <div className="flex items-center text-gray-600 mt-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{room.fullAddress}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-bold text-blue-600">₹{room.price}</span>
                    <span className="text-gray-500">/month</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6 mb-6">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Home className="w-4 h-4" />
                    {room.type}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {room.sharing}
                  </Badge>
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="ml-1 font-medium">{room.rating}</span>
                    <span className="ml-1 text-gray-500">({room.reviews} reviews)</span>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Bed className="w-6 h-6 mx-auto mb-1 text-gray-600" />
                    <div className="font-medium">{room.details.bhk}</div>
                    <div className="text-sm text-gray-500">Bedrooms</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Square className="w-6 h-6 mx-auto mb-1 text-gray-600" />
                    <div className="font-medium">{room.details.doors}</div>
                    <div className="text-sm text-gray-500">Doors</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Wind className="w-6 h-6 mx-auto mb-1 text-gray-600" />
                    <div className="font-medium">{room.details.windows}</div>
                    <div className="text-sm text-gray-500">Windows</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Car className="w-6 h-6 mx-auto mb-1 text-gray-600" />
                    <div className="font-medium">Available</div>
                    <div className="text-sm text-gray-500">Parking</div>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Amenities */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4">Amenities</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {room.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <amenity.icon className="w-5 h-5 text-blue-600" />
                        <div>
                          <div className="font-medium">{amenity.name}</div>
                          <div className="text-sm text-gray-500">{amenity.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Specifications */}
            <Card>
              <CardHeader>
                <CardTitle>Detailed Specifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Room Structure */}
                <div>
                  <h4 className="font-semibold mb-3">Room Structure</h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Room Type:</span>
                      <span className="font-medium">{room.details.bhk}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Doors:</span>
                      <span className="font-medium">{room.details.doors}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Windows:</span>
                      <span className="font-medium">{room.details.windows}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Flooring:</span>
                      <span className="font-medium">{room.details.flooring}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Balcony:</span>
                      <span className="font-medium">{room.details.balcony ? "Available" : "Not Available"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Roof Access:</span>
                      <span className="font-medium">{room.details.roofAccess ? "Available" : "Not Available"}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Utilities */}
                <div>
                  <h4 className="font-semibold mb-3">Utilities & Services</h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Water System:</span>
                      <span className="font-medium">{room.details.waterSystem}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Electricity:</span>
                      <span className="font-medium">{room.details.electricity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Parking:</span>
                      <span className="font-medium">{room.details.parking}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Kitchen Type:</span>
                      <span className="font-medium">{room.details.kitchen}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Furniture */}
                <div>
                  <h4 className="font-semibold mb-3">Furniture & Appliances</h4>
                  <div className="grid md:grid-cols-2 gap-2">
                    {room.details.furniture.map((item, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Kitchen Items */}
                <div>
                  <h4 className="font-semibold mb-3">Kitchen Equipment</h4>
                  <div className="grid md:grid-cols-2 gap-2">
                    {room.details.kitchenItems.map((item, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Maushi Service */}
            {room.details.maushiAvailable && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Utensils className="w-5 h-5 text-purple-600" />
                    Maushi Service Available
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Service Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Cost:</span>
                          <span className="font-medium text-purple-600">{room.details.maushiDetails.cost}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Meals:</span>
                          <span className="font-medium">{room.details.maushiDetails.meals}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Cuisine:</span>
                          <span className="font-medium">{room.details.maushiDetails.cuisine}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Experience:</span>
                          <span className="font-medium">{room.details.maushiDetails.experience}</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2 text-purple-800">What's Included</h4>
                      <ul className="text-sm space-y-1 text-purple-700">
                        <li>• Fresh home-cooked meals</li>
                        <li>• Hygienic food preparation</li>
                        <li>• Customizable menu options</li>
                        <li>• Special dietary requirements</li>
                        <li>• Tiffin service available</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Nearby Places */}
            <Card>
              <CardHeader>
                <CardTitle>Nearby Places</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {room.nearbyPlaces.map((place, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">{place.name}</div>
                        <div className="text-sm text-gray-500">{place.type}</div>
                      </div>
                      <Badge variant="outline">{place.distance}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Rules & Policies */}
            <Card>
              <CardHeader>
                <CardTitle>Rules & Policies</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {room.rules.map((rule, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card>
              <CardHeader>
                <CardTitle>Reviews ({room.reviews})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">{review.user.charAt(0)}</span>
                          </div>
                          <div>
                            <div className="font-medium">{review.user}</div>
                            <div className="text-sm text-gray-500">{review.date}</div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700 mb-2">{review.comment}</p>
                      <div className="text-sm text-gray-500">{review.helpful} people found this helpful</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Contact Owner</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-lg font-medium text-blue-600">{room.owner.name.charAt(0)}</span>
                  </div>
                  <div>
                    <div className="font-medium flex items-center gap-2">
                      {room.owner.name}
                      {room.owner.verified && <CheckCircle className="w-4 h-4 text-green-600" />}
                    </div>
                    <div className="text-sm text-gray-500">{room.owner.joinedDate}</div>
                  </div>
                </div>

                <div className="text-sm text-gray-600">{room.owner.responseTime}</div>

                <div className="space-y-2">
                  <Button className="w-full" size="lg">
                    <Phone className="w-4 h-4 mr-2" />
                    Call {room.owner.phone}
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent" size="lg">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Available from:</span>
                    <span className="font-medium">{room.availableFrom}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Last updated:</span>
                    <span className="font-medium">{room.lastUpdated}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Visit
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Heart className="w-4 h-4 mr-2" />
                  Save to Favorites
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share with Friends
                </Button>
              </CardContent>
            </Card>

            {/* Price Breakdown */}
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
                {room.details.maushiAvailable && (
                  <div className="flex justify-between">
                    <span>Maushi Service (optional)</span>
                    <span className="font-medium">₹1,500</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total Initial Cost</span>
                  <span className="text-blue-600">₹{room.price * 4}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
