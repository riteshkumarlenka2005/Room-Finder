// app/maushi-services/[id]/page.tsx
"use client";

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
  Star,
  Phone,
  MessageSquare,
  CheckCircle,
  Heart,
  Share2,
  Calendar,
  ArrowLeft,
  Utensils,
} from "lucide-react";

export default function HelperDetailsPage({ params }: { params?: { id?: string } }) {
  const [helper, setHelper] = useState<any | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // -----------------------
  // Utility: safe JSON / CSV parser -> always returns array (possibly empty)
  // -----------------------
  const parseMaybeJSON = (value: any): string[] => {
    if (value === null || value === undefined) return [];
    if (Array.isArray(value)) return value.map((v) => (v === null || v === undefined ? "" : String(v)));
    if (typeof value === "object") {
      // if object: try to extract values (rare)
      try {
        return Object.values(value).map((v) => (v === null || v === undefined ? "" : String(v)));
      } catch {
        return [];
      }
    }
    if (typeof value === "string") {
      const t = value.trim();
      // JSON-like string
      if ((t.startsWith("[") && t.endsWith("]")) || (t.startsWith("{") && t.endsWith("}"))) {
        try {
          const parsed = JSON.parse(t);
          if (Array.isArray(parsed)) return parsed.map((v) => String(v));
          if (typeof parsed === "object") return Object.values(parsed).map((v) => String(v));
        } catch {
          // fallback to CSV/ single value
        }
      }
      // CSV fallback
      if (t.includes(",")) return t.split(",").map((s) => s.trim()).filter(Boolean);
      // single value
      return [t];
    }
    return [];
  };

  // -----------------------
  // Utility: convert bucket path/filename to public URL
  // - if it's already a full URL (http/https) return as-is
  // - if it's a bucket path, call supabase.storage.getPublicUrl
  // - if something fails, return placeholder
  // -----------------------
  const publicURL = (raw: string | undefined | null) => {
    const placeholder = "/placeholder.svg";
    if (!raw) return placeholder;
    const trimmed = String(raw).trim();
    if (!trimmed) return placeholder;
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;

    // remove leading slash if present (Supabase expects path without starting slash)
    const path = trimmed.startsWith("/") ? trimmed.slice(1) : trimmed;

    try {
      const { data } = supabase.storage.from("helper-images").getPublicUrl(path);
      // getPublicUrl returns { data: { publicUrl } }
      return data?.publicUrl ?? placeholder;
    } catch (err) {
      console.warn("publicURL() error", err);
      return placeholder;
    }
  };

  // -----------------------
  // Fetch & normalize helper row
  // -----------------------
  useEffect(() => {
    let mounted = true;

    const fetchHelper = async () => {
      const id = params?.id ?? null;
      if (!id) {
        console.warn("HelperDetailsPage: no id in params");
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
          console.warn("No helper found for id:", id);
          return;
        }

        // parse fields safely
        const parsedImages = parseMaybeJSON(data.images ?? data.photo_urls ?? data.photos);
        const parsedFoodImages = parseMaybeJSON(data.food_images ?? data.food_images_text);
        const parsedProfile = data.profile_photo ? [String(data.profile_photo)] : [];

        // Convert to public urls (first convert arrays safely)
        const foodImgsUrls = parsedFoodImages.map(publicURL).filter(Boolean);
        const imagesUrls = parsedImages.map(publicURL).filter(Boolean);
        const profileUrls = parsedProfile.map(publicURL).filter(Boolean);

        // Final image list priority: food images first (show attractive food), then images, then profile
        const finalImages = [...foodImgsUrls, ...imagesUrls, ...profileUrls];
        const imagesForUI = finalImages.length ? finalImages : ["/placeholder.svg"];

        // specialties & services: accept multiple column name variants
        const specialties = parseMaybeJSON(data.dishes ?? data.specialties ?? data.skills ?? data.cuisines);
        const services = parseMaybeJSON(data.services ?? data.offerings ?? data.preferredWorkType ?? data.work_type);

        // safety for numeric fields
        const experience = data.experience_years ?? data.experience ?? "—";
        const salary = data.salary_min ?? data.salary ?? data.expected_salary ?? "Negotiable";

        // owner/contact
        const owner = {
          phone: data.phone ?? data.contact ?? "",
          responseTime: data.response_time ?? "Usually responds quickly",
          joinedDate: data.created_at ?? data.joined_at ?? "",
          verified: typeof data.verified === "boolean" ? data.verified : true,
        };

        const normalized = {
          id: data.id,
          name: data.full_name ?? data.name ?? "Helper",
          title: data.title ?? `${data.full_name ?? data.name ?? "Helper"} - Helper`,
          about: data.bio ?? data.description ?? "",
          location: [data.city, data.district, data.state].filter(Boolean).join(", "),
          experience,
          salary,
          rating: data.rating ?? 4.8,
          reviews: data.reviews ?? 0,
          specialties: specialties.length ? specialties : [],
          services: services.length ? services : [],
          images: imagesForUI,
          foodImages: foodImgsUrls,
          owner,
          availableFrom: data.available_from ?? "Available soon",
          lastUpdated: data.last_updated ?? "Recently",
          nearbyPlaces: parseMaybeJSON(data.nearby ?? data.nearby_places),
          rules: parseMaybeJSON(data.rules),
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
  }, [params]);

  if (!helper) {
    return <div className="text-center p-10 text-gray-500">Loading...</div>;
  }

  // Dummy reviews for UI parity
  const reviews = [
    { id: 1, user: "Priya Sharma", rating: 5, comment: "Very good cook and polite.", date: "2 weeks ago" },
    { id: 2, user: "Rohan Patnaik", rating: 4, comment: "Food tastes homely!", date: "1 month ago" },
  ];

  // safe helpers for rendering
  const images = Array.isArray(helper.images) ? helper.images : ["/placeholder.svg"];
  const specialties = Array.isArray(helper.specialties) ? helper.specialties : [];
  const services = Array.isArray(helper.services) ? helper.services : [];

  // -----------------------
  // Render
  // -----------------------
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
                <Share2 className="w-4 h-4 mr-2" /> Share
              </Button>
              <Button variant="outline" size="sm">
                <Heart className="w-4 h-4 mr-2" /> Save
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* BODY */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-8">
            {/* Carousel */}
            <Card className="overflow-hidden">
              <div className="relative w-full h-96 bg-gray-200 rounded-xl overflow-hidden">
                <img src={images[currentImageIndex] ?? "/placeholder.svg"} alt={helper.name} className="w-full h-full object-cover" />

                {/* Prev */}
                <button
                  type="button"
                  onClick={() =>
                    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
                  }
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-3 rounded-full shadow"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>

                {/* Next */}
                <button
                  type="button"
                  onClick={() =>
                    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-3 rounded-full shadow"
                >
                  <ArrowLeft className="w-6 h-6 rotate-180" />
                </button>

                {/* Dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                  {Array.isArray(images) && images.length > 0 ? (
                    images.map((img: string, idx: number) => (
                      <button
                        key={idx}
                        type="button"
                        aria-label={`Go to image ${idx + 1}`}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`w-3 h-3 rounded-full ${currentImageIndex === idx ? "bg-white" : "bg-white/50"}`}
                      />
                    ))
                  ) : (
                    <div className="w-3 h-3 rounded-full bg-white" />
                  )}
                </div>

                <Badge className="absolute top-4 left-4 bg-green-600">
                  <CheckCircle className="w-3 h-3 mr-1" /> Verified
                </Badge>
              </div>
            </Card>

            {/* Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{helper.title}</CardTitle>
              </CardHeader>

              <CardContent>
                <div className="flex justify-between">
                  <div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-1" />
                      {helper.location}
                    </div>
                    <p className="text-gray-700 mt-2">{helper.about}</p>
                  </div>

                  <div className="text-right">
                    <span className="text-3xl font-bold text-purple-600">₹{helper.salary}</span>
                    <div className="text-gray-500 text-sm">/month - {helper.experience} years</div>
                  </div>
                </div>

                {/* Specialties */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">Specialties</h3>
                  <div className="flex flex-wrap gap-2">
                    {specialties.length ? specialties.map((s: any, idx: number) => <Badge key={idx} variant="secondary">{s}</Badge>) : <div className="text-sm text-gray-500">No specialties listed.</div>}
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Services */}
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">Services</h3>
                  <div className="flex flex-wrap gap-2">
                    {services.length ? services.map((s: any, idx: number) => <Badge key={idx} variant="outline">{s}</Badge>) : <div className="text-sm text-gray-500">No services listed.</div>}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card>
              <CardHeader>
                <CardTitle>Reviews ({helper.reviews})</CardTitle>
              </CardHeader>
              <CardContent>
                {reviews.map((rev) => (
                  <div key={rev.id} className="mb-4 pb-4 border-b">
                    <div className="font-medium">{rev.user}</div>
                    <div className="text-sm text-gray-500">{rev.date}</div>
                    <p className="mt-2">{rev.comment}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* RIGHT */}
          <div className="space-y-6">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Contact Helper</CardTitle>
              </CardHeader>
              <CardContent>
                <a href={`tel:${helper.owner?.phone ?? ""}`}>
                  <Button className="w-full mb-3" size="lg">
                    <Phone className="w-4 h-4 mr-2" />
                    Call {helper.owner?.phone ?? ""}
                  </Button>
                </a>

                <Button variant="outline" className="w-full bg-transparent" size="lg">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Send Message
                </Button>

                <Separator className="my-4" />

                <div className="text-sm">
                  <div className="flex justify-between">
                    <span>Available from:</span>
                    <span>{helper.availableFrom}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Last updated:</span>
                    <span>{helper.lastUpdated}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Price Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Price Breakdown</CardTitle>
              </CardHeader>

              <CardContent>
                <div className="flex justify-between">
                  <span>Base Salary</span>
                  <span>₹{helper.salary}</span>
                </div>

                <Separator className="my-3" />

                <div className="flex justify-between font-semibold text-lg text-purple-600">
                  <span>Total</span>
                  <span>₹{helper.salary}</span>
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
          </div>
        </div>
      </div>
    </div>
  );
}
