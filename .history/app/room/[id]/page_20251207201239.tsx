"use client"

import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { supabase } from "@/lib/supabase";


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


export default function RoomDetailsPage({ params }: { params: { id: string } | any }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);

  // ⭐ REAL PROPERTY STATE (replaces room mock)
  const [property, setProperty] = useState<any>(null);

  // ---------- Helper: safely extract id ----------
  const getIdFromParamsOrPath = () => {
    try {
      // If params is already an object with id (non-thenable), use it
      if (params && typeof params === "object" && !("then" in params) && params.id) {
        return params.id;
      }
      // Otherwise fallback to reading from URL path (client-only)
      if (typeof window !== "undefined") {
        const parts = window.location.pathname.split("/").filter(Boolean);
        // last part should be id (e.g. /room/<id>)
        return parts[parts.length - 1];
      }
    } catch (e) {
      // ignore and return undefined
    }
    return undefined;
  };

  // ---------- Normalize utility helpers ----------
  const parseMaybeJSON = (value: any) => {
    if (value === null || value === undefined) return null;
    if (Array.isArray(value)) return value;
    if (typeof value === "object") return value;
    if (typeof value === "string") {
      // If string looks like JSON array/object, parse it
      const trimmed = value.trim();
      if ((trimmed.startsWith("[") && trimmed.endsWith("]")) || (trimmed.startsWith("{") && trimmed.endsWith("}"))) {
        try {
          return JSON.parse(trimmed);
        } catch {
          return null;
        }
      }
      // not JSON — return as single-element array for images fallback cases
      return value;
    }
    return null;
  };

  // Build a safe details object with defaults for used fields
  const buildSafeDetails = (rawDetails: any) => {
    const parsed = parseMaybeJSON(rawDetails) ?? {};
    return {
      bhk: parsed.bhk ?? parsed.roomType ?? "N/A",
      doors: parsed.doors ?? 0,
      windows: parsed.windows ?? 0,
      flooring: parsed.flooring ?? "N/A",
      waterSystem: parsed.waterSystem ?? parsed.water_system ?? "N/A",
      balcony: typeof parsed.balcony === "boolean" ? parsed.balcony : (parsed.balcony ?? false),
      roofAccess: typeof parsed.roofAccess === "boolean" ? parsed.roofAccess : (parsed.roof_access ?? false),
      parking: parsed.parking ?? "N/A",
      electricity: parsed.electricity ?? "N/A",
      furniture: Array.isArray(parsed.furniture) ? parsed.furniture : (parseMaybeJSON(parsed.furniture) ?? []),
      kitchen: parsed.kitchen ?? parsed.kitchen_type ?? "N/A",
      kitchenItems: Array.isArray(parsed.kitchenItems) ? parsed.kitchenItems : (parseMaybeJSON(parsed.kitchen_items) ?? []),
      maushiAvailable: typeof parsed.maushiAvailable === "boolean" ? parsed.maushiAvailable : (parsed.maushi_avail ?? parsed.maushi_available ?? false),
      maushiDetails: parsed.maushiDetails ? parsed.maushiDetails : (parsed.maushi_details ? parsed.maushi_details : {
        available: false,
        cost: "₹0",
        meals: "—",
        cuisine: "—",
        experience: "—"
      }),
    };
  };

  // ---------- FETCH FROM SUPABASE (based on params.id) ----------
  useEffect(() => {
    let mounted = true;

    const fetchProperty = async () => {
      const id = getIdFromParamsOrPath();
      if (!id) {
        console.warn("RoomDetailsPage: no id available from params or URL");
        return;
      }

      try {
        const { data, error } = await supabase
          .from("properties")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          console.error("Error fetching property:", error);
          return;
        }
        if (!data) {
          console.warn("No property row returned for id:", id);
          return;
        }

        // ---------- Normalize images ----------
        let imgs: string[] = [];
        const parsedImages = parseMaybeJSON(data.images);
        if (Array.isArray(parsedImages)) {
          // ensure all entries are strings
          imgs = parsedImages.map((i: any) => (typeof i === "string" ? i : String(i)));
        } else if (typeof parsedImages === "string") {
          // maybe comma separated or single URL
          imgs = [parsedImages];
        }

        // If still empty, try fallback columns (e.g., room_image_url or house_photo_*)
        if (imgs.length === 0) {
          if (data.room_image_url) imgs.push(data.room_image_url);
          else if (data.house_photo_1) imgs.push(data.house_photo_1);
        }

// ---------- Normalize amenities ----------
let amenitiesArr: any[] = [];
const parsedAmenities = parseMaybeJSON(data.amenities);

// amenity icon mapping
const amenityIcons: any = {
  wifi: Wifi,
  internet: Wifi,
  parking: Car,
  water: Droplets,
  electricity: Zap,
  fan: Wind,
  ac: Wind,
  kitchen: Utensils,
  security: Shield,
};

// Convert to an array of objects UI expects
if (Array.isArray(parsedAmenities)) {
  amenitiesArr = parsedAmenities.map((item: any) => {
    const rawName = typeof item === "string" ? item : item.name;
    const key = String(rawName || "").toLowerCase().trim();

    return {
      icon: amenityIcons[key] ?? Shield, // fallback icon
      name: rawName ?? "Amenity",
      description: item.description ?? "",
    };
  });
} 
else if (typeof parsedAmenities === "object" && parsedAmenities !== null) {
  // Object case → convert every property into amenity
  amenitiesArr = Object.keys(parsedAmenities).map((key) => ({
    icon: amenityIcons[key.toLowerCase()] ?? Shield,
    name: key,
    description: parsedAmenities[key] ?? "",
  }));
} 
else if (typeof parsedAmenities === "string") {
  // CSV string e.g. "wifi, parking, water"
  amenitiesArr = parsedAmenities.split(",").map((item: string) => {
    const key = item.toLowerCase().trim();
    return {
      icon: amenityIcons[key] ?? Shield,
      name: item.trim(),
      description: "",
    };
  });
}



        // ---------- Normalize nearbyPlaces ----------
        let nearbyPlaces = [];
        const parsedNearby = parseMaybeJSON(data.nearbyPlaces ?? data.nearby_places ?? data.nearby);
        if (Array.isArray(parsedNearby)) nearbyPlaces = parsedNearby;
        else nearbyPlaces = [];

        // ---------- Normalize rules ----------
        let rules = [];
        const parsedRules = parseMaybeJSON(data.rules);
        if (Array.isArray(parsedRules)) rules = parsedRules;
        else if (typeof parsedRules === "string" && parsedRules.trim()) rules = [parsedRules];

        // ---------- Normalize owner ---------- (DB may store owner_name separately)
        const ownerName = data.owner_name ?? data.owner?.name ?? data.owner_name_text ?? data.ownerName ?? null;
        const ownerPhone = data.phone ?? data.owner_phone ?? data.owner?.phone ?? null;
        const ownerVerified = (typeof data.owner_verified === "boolean") ? data.owner_verified : (data.owner?.verified ?? true);

        const owner = {
          name: ownerName ?? "Owner",
          phone: ownerPhone ?? "—",
          verified: ownerVerified,
          responseTime: data.owner_response_time ?? data.owner?.responseTime ?? "Usually responds quickly",
          joinedDate: data.owner_joined ?? data.owner?.joinedDate ?? "Member recently",
        };

        // ---------- Normalize details (jsonb or text) ----------
        
const details = {
  bhk: data.bhk ?? "N/A",
  doors: data.doors ?? 0,
  windows: data.windows ?? 0,
  flooring: data.flooring ?? "N/A",

  balcony: data.balcony ?? false,
  roofAccess: data.roof_access ?? false,

  waterSystem: data.water_system ?? "N/A",
  electricity: data.electricity ?? "N/A",
  parking: data.parking ?? "N/A",

  kitchen: data.kitchen_type ?? "N/A",

  furniture: Array.isArray(data.furniture) ? data.furniture : [],
  kitchenItems: Array.isArray(data.kitchen_items) ? data.kitchen_items : [],

  maushiAvailable: data.maushi_availa ?? false,

  maushiDetails: {
    cost: data.maushi_cost ? `₹${data.maushi_cost}` : "N/A",
    meals: "N/A",
    cuisine: "N/A",
    experience: "N/A",
  },
};


        // ---------- final normalized property ----------
        const normalized = {
          id: data.id,
          title: data.title ?? data.house_title ?? data.name ?? "Untitled Property",
          location: data.location ?? data.city ?? data.area ?? "",
          fullAddress: data.full_address ?? data.fullAddress ?? data.house_address ?? data.address ?? "",
          price: data.monthly_rent ?? data.price ?? data.cost ?? 0,
          type: data.property_type ?? data.type ?? details.bhk ?? "N/A",
          sharing: data.sharing ?? "N/A",
          images: imgs.length ? imgs : ["/placeholder.svg"],
          features: parseMaybeJSON(data.features) ?? [],
          rating: data.rating ?? 4.5,
          reviews: data.reviews ?? 0,
          owner,
          details,
          amenities: amenitiesArr,
          nearbyPlaces,
          rules,
          verified: data.verified ?? true,
          featured: data.featured ?? false,
          availableFrom: data.available_from ?? data.availableFrom ?? data.available ?? "Available soon",
          lastUpdated: data.last_updated ?? data.lastUpdated ?? "Recently",
        };

        if (mounted) {
          setProperty(normalized);
          setCurrentImageIndex(0); // Reset slider
        }
      } catch (err) {
        console.error("Unexpected error fetching property:", err);
      }
    };

    fetchProperty();

    return () => {
      mounted = false;
    };
    // NOTE: we intentionally run this effect ONCE on mount because params in client can be a thenable.
  }, []);


  // ⭐ Show loading until property loads
  if (!property) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  // ⭐ Replace reviews (static - same as before)
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
  <div className="relative w-full h-96 bg-gray-200 rounded-xl overflow-hidden">

    {/* Main Image */}
    <img
      src={property.images[currentImageIndex] || "/placeholder.svg"}
      alt={property.title}
      className="w-full h-full object-cover transition-all duration-300"
    />

    {/* Left Arrow */}
    <button
      onClick={() =>
        setCurrentImageIndex((prev) =>
          prev === 0 ? property.images.length - 1 : prev - 1
        )
      }
      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow"
    >
      <ArrowLeft className="w-6 h-6" />
    </button>

    {/* Right Arrow */}
    <button
      onClick={() =>
        setCurrentImageIndex((prev) =>
          prev === property.images.length - 1 ? 0 : prev + 1
        )
      }
      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow"
    >
      <ArrowLeft className="w-6 h-6 rotate-180" />
    </button>

    {/* Dots Indicators */}
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
      {property.images.map((_: any, index: number) => (
        <button
          key={index}
          onClick={() => setCurrentImageIndex(index)}
          className={`w-3 h-3 rounded-full transition ${
            index === currentImageIndex ? "bg-white" : "bg-white/50"
          }`}
        />
      ))}
    </div>

    {/* Verified Badge */}
    <Badge className="absolute top-4 left-4 bg-green-600">
      <CheckCircle className="w-3 h-3 mr-1" />
      Verified
    </Badge>

    {/* Featured Badge */}
    {property.featured && (
      <Badge className="absolute top-4 right-4 bg-orange-600">Featured</Badge>
    )}
  </div>
</Card>


            {/* Room Details */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">{property.title}</CardTitle>
                    <div className="flex items-center text-gray-600 mt-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{property.fullAddress}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-bold text-blue-600">₹{property.price}</span>
                    <span className="text-gray-500">/month</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6 mb-6">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Home className="w-4 h-4" />
                    {property.type}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {property.sharing}
                  </Badge>
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="ml-1 font-medium">{property.rating}</span>
                    <span className="ml-1 text-gray-500">({property.reviews} reviews)</span>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Bed className="w-6 h-6 mx-auto mb-1 text-gray-600" />
                    <div className="font-medium">{property.details.bhk}</div>
                    <div className="text-sm text-gray-500">Bedrooms</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Square className="w-6 h-6 mx-auto mb-1 text-gray-600" />
                    <div className="font-medium">{property.details.doors}</div>
                    <div className="text-sm text-gray-500">Doors</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Wind className="w-6 h-6 mx-auto mb-1 text-gray-600" />
                    <div className="font-medium">{property.details.windows}</div>
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
                    {property.amenities.map((amenity: any, index: number) => (
                      <div key={index} className="flex items-center gap-3">
                        {/* amenity.icon may be a component or not; if it's a component, render it */}
                        {amenity.icon ? (
                          // @ts-ignore - we don't know the shape precisely, but if it's a component it will render
                          <amenity.icon className="w-5 h-5 text-blue-600" />
                        ) : (
                          <Wifi className="w-5 h-5 text-blue-600" />
                        )}
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
                      <span className="font-medium">{property.details.bhk}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Doors:</span>
                      <span className="font-medium">{property.details.doors}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Windows:</span>
                      <span className="font-medium">{property.details.windows}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Flooring:</span>
                      <span className="font-medium">{property.details.flooring}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Balcony:</span>
                      <span className="font-medium">{property.details.balcony ? "Available" : "Not Available"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Roof Access:</span>
                      <span className="font-medium">{property.details.roofAccess ? "Available" : "Not Available"}</span>
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
                      <span className="font-medium">{property.details.waterSystem}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Electricity:</span>
                      <span className="font-medium">{property.details.electricity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Parking:</span>
                      <span className="font-medium">{property.details.parking}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Kitchen Type:</span>
                      <span className="font-medium">{property.details.kitchen}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Furniture */}
                <div>
                  <h4 className="font-semibold mb-3">Furniture & Appliances</h4>
                  <div className="grid md:grid-cols-2 gap-2">
                    {property.details.furniture.map((item: any, index: number) => (
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
                    {property.details.kitchenItems.map((item: any, index: number) => (
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
            {property.details.maushiAvailable && (
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
                          <span className="font-medium text-purple-600">{property.details.maushiDetails.cost}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Meals:</span>
                          <span className="font-medium">{property.details.maushiDetails.meals}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Cuisine:</span>
                          <span className="font-medium">{property.details.maushiDetails.cuisine}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Experience:</span>
                          <span className="font-medium">{property.details.maushiDetails.experience}</span>
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
                  {property.nearbyPlaces.map((place: any, index: number) => (
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
                  {property.rules.map((rule: any, index: number) => (
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
                <CardTitle>Reviews ({property.reviews})</CardTitle>
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
        <span className="text-lg font-medium text-blue-600">
          {property.owner?.name?.charAt(0) ?? "O"}
        </span>
      </div>

      <div>
        <div className="font-medium flex items-center gap-2">
          {property.owner?.name ?? "Owner"}
          {property.owner?.verified && <CheckCircle className="w-4 h-4 text-green-600" />}
        </div>

        <div className="text-sm text-gray-500">{property.owner?.joinedDate ?? "Joined recently"}</div>
      </div>
    </div>

    <div className="text-sm text-gray-600">{property.owner?.responseTime ?? "Usually responds quickly"}</div>

    <div className="space-y-2">
      <Button className="w-full" size="lg">
        <Phone className="w-4 h-4 mr-2" />
        Call {property.owner?.phone ?? "Owner"}
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
        <span className="font-medium">{property.availableFrom}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-gray-600">Last updated:</span>
        <span className="font-medium">{property.lastUpdated}</span>
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
                  <span className="font-medium">₹{property.price}</span>
                </div>
                <div className="flex justify-between">
                  <span>Security Deposit</span>
                  <span className="font-medium">₹{property.price}</span>
                </div>
                <div className="flex justify-between">
                  <span>Advance (2 months)</span>
                  <span className="font-medium">₹{property.price * 2}</span>
                </div>
                {property.details.maushiAvailable && (
                  <div className="flex justify-between">
                    <span>Maushi Service (optional)</span>
                    <span className="font-medium">₹1,500</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total Initial Cost</span>
                  <span className="text-blue-600">₹{property.price * 4}</span>
                </div>
                <Link href={`/payment?property_id=${property.id}`}>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-6 mt-4">
                      Book Now
                  </Button>
                </Link>

              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
