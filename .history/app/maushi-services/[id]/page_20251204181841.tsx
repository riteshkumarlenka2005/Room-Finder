// app/maushi-services/[id]/page.tsx
"use client"

import { useEffect, useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
  Calendar,
  Camera,
  ArrowLeft,
  Utensils,
  Wifi,
} from "lucide-react";

export default function HelperDetailsPage({ params }: { params: { id: string } | any }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [helper, setHelper] = useState<any | null>(null);

  // ---------- Helpers ----------
  const getIdFromParamsOrPath = () => {
    try {
      if (params && typeof params === "object" && !("then" in params) && params.id) return params.id;
      if (typeof window !== "undefined") {
        const parts = window.location.pathname.split("/").filter(Boolean);
        return parts[parts.length - 1];
      }
    } catch {
      return undefined;
    }
    return undefined;
  };

  const parseMaybeJSON = (value: any) => {
    if (value === null || value === undefined) return null;
    if (Array.isArray(value)) return value;
    if (typeof value === "object") return value;
    if (typeof value === "string") {
      const trimmed = value.trim();
      if ((trimmed.startsWith("[") && trimmed.endsWith("]")) || (trimmed.startsWith("{") && trimmed.endsWith("}"))) {
        try {
          return JSON.parse(trimmed);
        } catch {
          return null;
        }
      }
      // comma separated fallback
      if (trimmed.includes(",")) return trimmed.split(",").map((s) => s.trim()).filter(Boolean);
      return trimmed;
    }
    return null;
  };

  useEffect(() => {
    let mounted = true;

    const fetchHelper = async () => {
      const id = getIdFromParamsOrPath();
      if (!id) {
        console.warn("HelperDetailsPage: no id available");
        return;
      }

      try {
        const { data, error } = await supabase
          .from("domestic_helpers")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          console.error("Error fetching helper:", error);
          return;
        }
        if (!data) {
          console.warn("No helper row for id:", id);
          return;
        }

        // images normalization: DB should already contain public URLs (as we uploaded)
        let imgs: string[] = [];
        const parsedImages = parseMaybeJSON(data.images ?? data.photo_urls ?? data.photos);
        if (Array.isArray(parsedImages)) imgs = parsedImages.map((i: any) => String(i));
        else if (typeof parsedImages === "string") imgs = [parsedImages];

        // ensure not empty: use profile_photo and/or food_images
        if (!imgs.length && data.profile_photo) imgs.push(data.profile_photo);
        if (!imgs.length && data.food_images) {
          const parsedFood = parseMaybeJSON(data.food_images);
          if (Array.isArray(parsedFood)) imgs.push(...parsedFood.map((i: any) => String(i)));
        }
        if (!imgs.length) imgs = ["/placeholder.svg"];

        // food images (separate)
        let foodImgs: string[] = [];
        const parsedFoodImages = parseMaybeJSON(data.food_images);
        if (Array.isArray(parsedFoodImages)) foodImgs = parsedFoodImages.map((i: any) => String(i));
        else if (typeof parsedFoodImages === "string" && parsedFoodImages) foodImgs = [parsedFoodImages];

        // specialties / services normalization
        const specialtiesArr = parseMaybeJSON(data.specialties ?? data.skills ?? data.cuisines) ?? [];
        const servicesArr = parseMaybeJSON(data.services ?? data.offerings ?? []) ?? [];

        // nearby / rules
        const nearbyPlaces = parseMaybeJSON(data.nearby ?? data.nearby_places) ?? [];
        const rules = parseMaybeJSON(data.rules) ?? [];

        // contact & meta
        const owner = {
          name: data.full_name ?? data.name ?? "Helper",
          phone: data.phone ?? data.contact ?? "—",
          verified: (typeof data.verified === "boolean") ? data.verified : true,
          joinedDate: data.joined_at ?? data.created_at ?? "Member recently",
          responseTime: data.response_time ?? "Usually responds quickly",
        };

        const normalized = {
          id: data.id,
          name: owner.name,
          location: [data.city, data.district, data.state].filter(Boolean).join(", "),
          title: data.title ?? `${owner.name} - Helper`,
          salary: data.salary ?? data.expected_salary ?? "Negotiable",
          experience: data.experience_years ?? data.experience ?? "—",
          rating: data.rating ?? 4.8,
          reviews: data.reviews ?? 0,
          images: imgs,
          foodImages: foodImgs,
          specialties: Array.isArray(specialtiesArr) ? specialtiesArr : (specialtiesArr ? [specialtiesArr] : []),
          services: Array.isArray(servicesArr) ? servicesArr : (servicesArr ? [servicesArr] : []),
          about: data.bio ?? data.description ?? "",
          owner,
          nearbyPlaces,
          rules,
          verified: owner.verified,
          availableFrom: data.available_from ?? "Available soon",
          lastUpdated: data.last_updated ?? "Recently",
        };

        if (mounted) {
          setHelper(normalized);
          setCurrentImageIndex(0);
        }
      } catch (err) {
        console.error("Unexpected error fetching helper:", err);
      }
    };

    fetchHelper();
    return () => {
      mounted = false;
    };
    // intentionally no deps: same approach as your room page
  }, []);

  if (!helper) return <div className="p-10 text-center">Loading...</div>;

  // small static reviews for layout parity
  const reviews = [
    { id: 1, user: "Priya Sharma", rating: 5, date: "2 weeks ago", comment: "Very punctual and excellent food skills.", helpful: 12 },
    { id: 2, user: "Rahul Patel", rating: 4, date: "1 month ago", comment: "Good cook, reliable for tiffin service.", helpful: 8 },
  ];

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
          {/* Main */}
          <div className="lg:col-span-2 space-y-8">
            {/* Gallery */}
            <Card className="overflow-hidden">
              <div className="relative w-full h-96 bg-gray-200 rounded-xl overflow-hidden">
                <img
                  src={helper.images[currentImageIndex] || "/placeholder.svg"}
                  alt={helper.name}
                  className="w-full h-full object-cover transition-all duration-300"
                />

                <button
                  onClick={() =>
                    setCurrentImageIndex((prev) =>
                      prev === 0 ? helper.images.length - 1 : prev - 1
                    )
                  }
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>

                <button
                  onClick={() =>
                    setCurrentImageIndex((prev) =>
                      prev === helper.images.length - 1 ? 0 : prev + 1
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow"
                >
                  <ArrowLeft className="w-6 h-6 rotate-180" />
                </button>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                  {helper.images.map((_: any, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`w-3 h-3 rounded-full transition ${idx === currentImageIndex ? "bg-white" : "bg-white/50"}`}
                    />
                  ))}
                </div>

                <Badge className="absolute top-4 left-4 bg-green-600">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              </div>
            </Card>

            {/* Helper Header */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">{helper.title || helper.name}</CardTitle>
                    <div className="flex items-center text-gray-600 mt-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{helper.location}</span>
                    </div>
                    <div className="mt-2 text-sm text-gray-700">{helper.about}</div>
                  </div>

                  <div className="text-right">
                    <span className="text-3xl font-bold text-purple-600">₹{helper.salary}</span>
                    <div className="text-gray-500 text-sm">/month - {typeof helper.experience === "number" ? `${helper.experience} years` : helper.experience}</div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="flex items-center gap-6 mb-6">
                  <Badge variant="outline" className="flex items-center gap-1"><Utensils className="w-4 h-4" /> Specialties</Badge>
                  <Badge variant="outline" className="flex items-center gap-1"><Utensils className="w-4 h-4" /> Services</Badge>
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="ml-1 font-medium">{helper.rating}</span>
                    <span className="ml-1 text-gray-500">({helper.reviews} reviews)</span>
                  </div>
                </div>

                {/* specialties & services badges */}
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {helper.specialties.map((s: any, i: number) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {s}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {helper.services.map((svc: any, i: number) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {svc}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Detailed Info */}
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <h4 className="font-semibold mb-2">Experience</h4>
                    <div className="text-sm text-gray-700">{helper.experience}</div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Availability</h4>
                    <div className="text-sm text-gray-700">{helper.availableFrom}</div>
                  </div>
                </div>

                <Separator />

                {/* Nearby */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Nearby Places</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {helper.nearbyPlaces.length ? helper.nearbyPlaces.map((place: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium">{place.name ?? place.title ?? "Place"}</div>
                          <div className="text-sm text-gray-500">{place.type ?? place.category ?? ""}</div>
                        </div>
                        <Badge variant="outline">{place.distance ?? ""}</Badge>
                      </div>
                    )) : <div className="text-sm text-gray-500">No nearby places listed.</div>}
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Rules */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Rules & Policies</h3>
                  <ul className="space-y-2">
                    {helper.rules.length ? helper.rules.map((r: any, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>{r}</span>
                      </li>
                    )) : <li className="text-sm text-gray-500">No rules provided.</li>}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card>
              <CardHeader>
                <CardTitle>Reviews ({helper.reviews})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {reviews.map((rev) => (
                    <div key={rev.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">{rev.user.charAt(0)}</span>
                          </div>
                          <div>
                            <div className="font-medium">{rev.user}</div>
                            <div className="text-sm text-gray-500">{rev.date}</div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < rev.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700 mb-2">{rev.comment}</p>
                      <div className="text-sm text-gray-500">{rev.helpful} people found this helpful</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

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
                      {helper.name?.charAt(0) ?? "H"}
                    </span>
                  </div>

                  <div>
                    <div className="font-medium flex items-center gap-2">
                      {helper.name}
                      {helper.verified && <CheckCircle className="w-4 h-4 text-green-600" />}
                    </div>

                    <div className="text-sm text-gray-500">
                      {helper.owner?.joinedDate ?? helper.lastUpdated}
                    </div>
                  </div>
                </div>

                <div className="text-sm text-gray-600">
                  {helper.owner?.responseTime ?? "Usually responds quickly"}
                </div>

                <div className="space-y-2">
                  <a href={`tel:${helper.owner?.phone ?? ""}`}>
                    <Button className="w-full" size="lg">
                      <Phone className="w-4 h-4 mr-2" />
                      Call {helper.owner?.phone ?? ""}
                    </Button>
                  </a>

                  <Button variant="outline" className="w-full bg-transparent" size="lg">
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

            <Card>
              <CardHeader>
                <CardTitle>Price Breakdown</CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">
                {/* Salary */}
                <div className="flex justify-between">
                  <span>Base Salary</span>
                  <span className="font-medium">₹{helper.salary}</span>
                </div>

                {/* Optional Services Cost */}
                {helper.services.includes("Tiffin Service") && (
                  <div className="flex justify-between">
                    <span>Tiffin Service (optional)</span>
                    <span className="font-medium">₹1500</span>
                  </div>
                )}

                {helper.services.includes("Full-Time") && (
                  <div className="flex justify-between">
                    <span>Full-Time Extra Charge</span>
                    <span className="font-medium">₹1000</span>
                  </div>
                )}

                {/* Registration fee */}
                <div className="flex justify-between">
                  <span>Registration Fee</span>
                  <span className="font-medium">₹299</span>
                </div>

                <Separator />

                {/* TOTAL */}
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total Monthly Cost</span>
                  <span className="text-purple-600">
                    ₹
                    {Number(helper.salary || 0) +
                      (helper.services.includes("Full-Time") ? 1000 : 0)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
