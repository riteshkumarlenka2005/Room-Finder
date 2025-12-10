// app/maushi-services/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/lib/supabase";
import { useParams } from "next/navigation";

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

export default function HelperDetailsPage() {
  const params = useParams(); // ✅ FIX — automatically unwraps promise params
  const id = params?.id;      // now 100% safe

  const [helper, setHelper] = useState<any | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // -----------------------
  // Utility: safe JSON / CSV parser
  // -----------------------
  const parseMaybeJSON = (value: any): string[] => {
    if (!value) return [];
    if (Array.isArray(value)) return value.map(String);
    if (typeof value === "object") return Object.values(value).map(String);

    if (typeof value === "string") {
      const t = value.trim();
      if ((t.startsWith("[") && t.endsWith("]")) || (t.startsWith("{") && t.endsWith("}"))) {
        try {
          const parsed = JSON.parse(t);
          if (Array.isArray(parsed)) return parsed.map(String);
          if (typeof parsed === "object") return Object.values(parsed).map(String);
        } catch {}
      }
      if (t.includes(",")) return t.split(",").map((s) => s.trim());
      return [t];
    }
    return [];
  };

  // -----------------------
  // Utility: convert bucket path/filename to public URL
  // -----------------------
  const publicURL = (raw: string | undefined | null) => {
    const placeholder = "/placeholder.svg";
    if (!raw) return placeholder;

    const trimmed = String(raw).trim();
    if (trimmed.startsWith("http")) return trimmed;

    const path = trimmed.startsWith("/") ? trimmed.slice(1) : trimmed;

    try {
      const { data } = supabase.storage.from("helper-images").getPublicUrl(path);
      return data?.publicUrl ?? placeholder;
    } catch {
      return placeholder;
    }
  };

  // -----------------------
  // Fetch & normalize helper row
  // -----------------------
  useEffect(() => {
    if (!id) return;

    let mounted = true;

    const fetchHelper = async () => {
      try {
        const { data, error } = await supabase
          .from("domestic_helpers")
          .select("*")
          .eq("id", id)
          .single();

        if (error || !data) return;

        const parsedImages = parseMaybeJSON(data.images ?? data.photo_urls ?? data.photos);
        const parsedFoodImages = parseMaybeJSON(data.food_images ?? data.food_images_text);
        const parsedProfile = data.profile_photo ? [String(data.profile_photo)] : [];

        const foodImgsUrls = parsedFoodImages.map(publicURL);
        const imagesUrls = parsedImages.map(publicURL);
        const profileUrls = parsedProfile.map(publicURL);

        const finalImages = [...foodImgsUrls, ...imagesUrls, ...profileUrls];
        const imagesForUI = finalImages.length ? finalImages : ["/placeholder.svg"];

        const specialties = parseMaybeJSON(
          data.dishes ?? data.specialties ?? data.skills ?? data.cuisines
        );
        const services = parseMaybeJSON(
          data.services ?? data.offerings ?? data.preferredWorkType ?? data.work_type
        );

        const normalized = {
          id: data.id,
          name: data.full_name ?? data.name ?? "Helper",
          title: data.title ?? `${data.full_name ?? data.name ?? "Helper"} - Helper`,
          about: data.bio ?? data.description ?? "",
          location: [data.city, data.district, data.state].filter(Boolean).join(", "),
          experience: data.experience_years ?? data.experience ?? "—",
          salary: data.salary_min ?? data.salary ?? data.expected_salary ?? "Negotiable",
          rating: data.rating ?? 4.8,
          reviews: data.reviews ?? 0,
          specialties,
          services,
          images: imagesForUI,
          owner: {
            phone: data.phone ?? data.contact ?? "",
            responseTime: data.response_time ?? "Usually responds quickly",
            joinedDate: data.created_at ?? data.joined_at ?? "",
            verified: data.verified ?? true,
          },
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
        console.error("Unexpected error:", err);
      }
    };

    fetchHelper();
    return () => {
      mounted = false;
    };
  }, [id]);

  if (!helper) {
    return <div className="text-center p-10 text-gray-500">Loading...</div>;
  }

  // Dummy reviews
  const reviews = [
    { id: 1, user: "Priya Sharma", rating: 5, comment: "Very good cook and polite.", date: "2 weeks ago" },
    { id: 2, user: "Rohan Patnaik", rating: 4, comment: "Food tastes homely!", date: "1 month ago" },
  ];

  const images = helper.images ?? [];
  const specialties = helper.specialties ?? [];
  const services = helper.services ?? [];

  // -----------------------
  // Render (UI untouched)
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
                <img
                  src={images[currentImageIndex]}
                  alt={helper.name}
                  className="w-full h-full object-cover"
                />

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
  {images.map((img: string, idx: number) => (
    <button
      key={idx}
      onClick={() => setCurrentImageIndex(idx)}
      className={`w-3 h-3 rounded-full ${
        currentImageIndex === idx ? "bg-white" : "bg-white/50"
      }`}
    />
  ))}
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
                    <div className="text-gray-500 text-sm">
                      /month - {helper.experience} years
                    </div>
                  </div>
                </div>

                {/* Specialties */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">Specialties</h3>
                  <div className="flex flex-wrap gap-2">
                    {specialties.length
                      ? specialties.map((s: any, idx: number) => (
                          <Badge key={idx} variant="secondary">
                            {s}
                          </Badge>
                        ))
                      : "No specialties listed"}
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Services */}
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">Services</h3>
                  <div className="flex flex-wrap gap-2">
                    {services.length
                      ? services.map((s: any, idx: number) => (
                          <Badge key={idx} variant="outline">
                            {s}
                          </Badge>
                        ))
                      : "No services listed"}
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
                <a href={`tel:${helper.owner?.phone}`}>
                  <Button className="w-full mb-3" size="lg">
                    <Phone className="w-4 h-4 mr-2" />
                    Call {helper.owner?.phone}
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
