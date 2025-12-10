"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/lib/supabase";

import {
  Home,
  MapPin,
  Star,
  Phone,
  MessageSquare,
  Share2,
  Heart,
  CheckCircle,
  Calendar,
  ArrowLeft,
  Utensils,
  Users,
  Shield,
  Zap,
  Droplets,
  Wind,
  Car,
  Wifi,
} from "lucide-react";

/* --------------------------------------------------------------------
    Domestic Helper Details Page (Same UI as Room Details Page)
------------------------------------------------------------------------ */

export default function HelperDetailsPage() {
  const { id } = useParams();
  const [helper, setHelper] = useState<any | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  /* ---------------------------------------
        Safe JSON Parser
  ------------------------------------------ */
  const parseMaybeJSON = (value: any) => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    if (typeof value === "object") return Object.values(value);
    if (typeof value === "string") {
      const t = value.trim();
      if ((t.startsWith("[") && t.endsWith("]")) || (t.startsWith("{") && t.endsWith("}"))) {
        try {
          return JSON.parse(t);
        } catch {
          return [];
        }
      }
      if (t.includes(",")) return t.split(",").map((s) => s.trim());
      return [t];
    }
    return [];
  };

  /* ---------------------------------------
        Get Public URL for helper-images bucket
  ------------------------------------------ */
  const publicURL = (raw: string | null | undefined) => {
    if (!raw) return "/placeholder.svg";

    const trimmed = String(raw).trim();
    if (trimmed.startsWith("http")) return trimmed;

    const path = trimmed.startsWith("/") ? trimmed.slice(1) : trimmed;

    try {
      const { data } = supabase.storage.from("helper-images").getPublicUrl(path);
      return data?.publicUrl ?? "/placeholder.svg";
    } catch {
      return "/placeholder.svg";
    }
  };

  /* ---------------------------------------
        Fetch Helper From Supabase
  ------------------------------------------ */
  useEffect(() => {
    if (!id) return;

    const fetchHelper = async () => {
      const { data, error } = await supabase
        .from("domestic_helpers")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) return;

      /* ---- Images ---- */
      const imgRaw =
        parseMaybeJSON(data.images) ||
        parseMaybeJSON(data.photo_urls) ||
        parseMaybeJSON(data.photos) ||
        [];

      const foodImages = parseMaybeJSON(data.food_images);
      const profileImage = data.profile_photo ? [data.profile_photo] : [];

      const allImages = [...foodImages, ...imgRaw, ...profileImage].map(publicURL);

      /* ---- Amenities (From Specialties + Services) ---- */

      const specialties = parseMaybeJSON(data.specialties ?? data.dishes ?? []);
      const services = parseMaybeJSON(data.services ?? data.offerings ?? []);

      const amenityIcons: any = {
        cleaning: Shield,
        cooking: Utensils,
        laundry: Wind,
        water: Droplets,
        electricity: Zap,
        parking: Car,
        wifi: Wifi,
      };

      const mappedAmenities = specialties.concat(services).map((item: any) => {
        const key = String(item || "").toLowerCase();
        return {
          name: item || "Service",
          description: "",
          icon: amenityIcons[key] ?? Shield,
        };
      });

      /* ---- Owner ---- */
      const owner = {
        name: data.owner_name ?? data.full_name ?? "Helper",
        phone: data.phone ?? data.contact ?? "—",
        verified: data.verified ?? true,
        responseTime: data.response_time ?? "Usually responds quickly",
        joinedDate: data.created_at ?? "Joined recently",
      };

      /* ---- Final Normalized Data ---- */
      setHelper({
        id: data.id,
        title: data.full_name ?? data.name ?? "Helper",
        about: data.bio ?? data.description ?? "",
        location: [data.city, data.district, data.state].filter(Boolean).join(", "),
        images: allImages.length ? allImages : ["/placeholder.svg"],
        salary: data.salary_min ?? data.salary ?? "Negotiable",
        experience: data.experience_years ?? data.experience ?? "N/A",
        rating: data.rating ?? 4.8,
        reviews: data.reviews ?? 0,
        specialties,
        services,
        amenities: mappedAmenities,
        nearbyPlaces: parseMaybeJSON(data.nearby ?? []),
        rules: parseMaybeJSON(data.rules ?? []),
        owner,
        availableFrom: data.available_from ?? "Available soon",
        lastUpdated: data.last_updated ?? "Recently",
        verified: data.verified ?? true,
        featured: data.featured ?? false,
      });

      setCurrentImageIndex(0);
    };

    fetchHelper();
  }, [id]);

  if (!helper) return <div className="p-10 text-center">Loading...</div>;

  /* Deep Clone for UI */
  const images = helper.images;

  /* Static Reviews */
  const reviews = [
    { id: 1, user: "Priya Sharma", rating: 5, comment: "Very polite and excellent cook!", date: "2 weeks ago", helpful: 12 },
    { id: 2, user: "Rahul Patnaik", rating: 4, comment: "Good hygiene and skilled helper.", date: "1 month ago", helpful: 8 },
  ];

  /* --------------------------------------------------------------------
    BEGIN UI (Copied 1:1 from RoomDetailsPage) 🎯
  -------------------------------------------------------------------- */

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/maushi-services" className="mr-4">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Search
                </Button>
              </Link>

              <Link href="/" className="flex items-center">
                <Home className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">
                  RoomFinder
                </span>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" /> Share
              </Button>
              <Button variant="outline" size="sm">
                <Heart className="w-4 h-4 mr-2" /> Save
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Page Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <Card className="overflow-hidden">
              <div className="relative w-full h-96 bg-gray-200 rounded-xl overflow-hidden">
                <img
                  src={images[currentImageIndex]}
                  alt={helper.title}
                  className="w-full h-full object-cover transition-all duration-300"
                />

                {/* Left Arrow */}
                <button
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow"
                  onClick={() =>
                    setCurrentImageIndex((prev) =>
                      prev === 0 ? images.length - 1 : prev - 1
                    )
                  }
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>

                {/* Right Arrow */}
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow"
                  onClick={() =>
                    setCurrentImageIndex((prev) =>
                      prev === images.length - 1 ? 0 : prev + 1
                    )
                  }
                >
                  <ArrowLeft className="w-6 h-6 rotate-180" />
                </button>

                {/* Dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                  {images.map((_: any, index: number) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-3 h-3 rounded-full transition ${
                        index === currentImageIndex
                          ? "bg-white"
                          : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>

                {/* Verified Badge */}
                <Badge className="absolute top-4 left-4 bg-green-600">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Verified
                </Badge>

                {/* Featured */}
                {helper.featured && (
                  <Badge className="absolute top-4 right-4 bg-orange-600">
                    Featured
                  </Badge>
                )}
              </div>
            </Card>

            {/* Helper Details */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">{helper.title}</CardTitle>

                    <div className="flex items-center text-gray-600 mt-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{helper.location}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-3xl font-bold text-blue-600">
                      ₹{helper.salary}
                    </span>
                    <span className="text-gray-500">/month</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="flex items-center gap-6 mb-6">
                  <Badge variant="outline">{helper.experience} years exp.</Badge>

                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="ml-1 font-medium">{helper.rating}</span>
                    <span className="ml-1 text-gray-500">
                      ({helper.reviews} reviews)
                    </span>
                  </div>
                </div>

                <p className="text-gray-700 mb-6">{helper.about}</p>

                <Separator />

                {/* Amenities (Specialties + Services) */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Skills & Services</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {helper.amenities.map((a: any, index: number) => (
                      <div key={index} className="flex items-center gap-3">
                        <a.icon className="w-5 h-5 text-blue-600" />
                        <div>
                          <div className="font-medium">{a.name}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Nearby */}
            <Card>
              <CardHeader>
                <CardTitle>Nearby Locations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {helper.nearbyPlaces.map((place: any, i: number) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <div className="font-medium">{place.name}</div>
                        <div className="text-sm text-gray-500">
                          {place.type}
                        </div>
                      </div>

                      <Badge variant="outline">{place.distance}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Rules */}
            <Card>
              <CardHeader>
                <CardTitle>Rules & Policies</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {helper.rules.map((rule: any, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card>
              <CardHeader>
                <CardTitle>Reviews ({helper.reviews})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="border-b border-gray-100 pb-4 last:border-b-0"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">
                              {review.user.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium">{review.user}</div>
                            <div className="text-sm text-gray-500">
                              {review.date}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <p className="text-gray-700 mb-2">{review.comment}</p>
                      <div className="text-sm text-gray-500">
                        {review.helpful} people found this helpful
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-6">
            {/* Contact Helper */}
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Contact Helper</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-lg font-medium text-blue-600">
                      {helper.owner?.name?.charAt(0) ?? "H"}
                    </span>
                  </div>

                  <div>
                    <div className="font-medium flex items-center gap-2">
                      {helper.owner?.name}
                      {helper.owner?.verified && (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      )}
                    </div>

                    <div className="text-sm text-gray-500">
                      {helper.owner?.joinedDate}
                    </div>
                  </div>
                </div>

                <div className="text-sm text-gray-600">
                  {helper.owner?.responseTime}
                </div>

                <div className="space-y-2">
                  <a href={`tel:${helper.owner?.phone}`}>
                    <Button className="w-full" size="lg">
                      <Phone className="w-4 h-4 mr-2" />
                      Call {helper.owner?.phone}
                    </Button>
                  </a>

                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    size="lg"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Available from:</span>
                    <span className="font-medium">{helper.availableFrom}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Last updated:</span>
                    <span className="font-medium">{helper.lastUpdated}</span>
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
                  Schedule Interview
                </Button>

                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Heart className="w-4 h-4 mr-2" />
                  Save to Favorites
                </Button>

                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Profile
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
                  <span>Base Salary</span>
                  <span className="font-medium">₹{helper.salary}</span>
                </div>

                <Separator />

                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-blue-600">₹{helper.salary}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
