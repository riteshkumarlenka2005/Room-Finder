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
  // useParams unwraps promise params on client in Next 13+.
  const params = useParams();
  const id = params?.id;

  const [helper, setHelper] = useState<any | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // ---------- utilities ----------
  const parseMaybeJSON = (value: any): any[] => {
    if (value === null || value === undefined) return [];
    if (Array.isArray(value)) return value;
    if (typeof value === "object") return Object.values(value);
    if (typeof value === "string") {
      const t = value.trim();
      if (!t) return [];
      if ((t.startsWith("[") && t.endsWith("]")) || (t.startsWith("{") && t.endsWith("}"))) {
        try {
          const parsed = JSON.parse(t);
          if (Array.isArray(parsed)) return parsed;
          if (typeof parsed === "object") return Object.values(parsed);
        } catch {
          // continue
        }
      }
      if (t.includes(",")) return t.split(",").map((s) => s.trim()).filter(Boolean);
      return [t];
    }
    return [];
  };

  const publicURL = (raw: string | undefined | null) => {
    const placeholder = "/placeholder.svg";
    if (!raw) return placeholder;
    const trimmed = String(raw).trim();
    if (!trimmed) return placeholder;
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;

    const path = trimmed.startsWith("/") ? trimmed.slice(1) : trimmed;

    try {
      const { data } = supabase.storage.from("helper-images").getPublicUrl(path);
      return data?.publicUrl ?? placeholder;
    } catch (err) {
      console.warn("publicURL() error", err);
      return placeholder;
    }
  };

  // ---------- fetch helper ----------
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

        if (error) {
          console.error("Error fetching helper:", error);
          return;
        }
        if (!data) {
          console.warn("No helper found for id:", id);
          return;
        }

        // Normalize images & fields
        const parsedImages = parseMaybeJSON(data.images ?? data.photo_urls ?? data.photos);
        const parsedFoodImages = parseMaybeJSON(data.food_images ?? data.food_images_json ?? data.foods);
        const parsedProfile = data.profile_photo ? [String(data.profile_photo)] : [];

        const imagesUrls = [...parsedFoodImages, ...parsedImages, ...parsedProfile].map((x) => publicURL(String(x)));
        const imagesForUI = imagesUrls.length ? imagesUrls : ["/placeholder.svg"];

        const specialties = [...parseMaybeJSON(data.specialties), ...parseMaybeJSON(data.dishes)];
        const services = [...parseMaybeJSON(data.services), ...parseMaybeJSON(data.preferred_work), ...(data.preferred_employment_type ? [data.preferred_employment_type] : [])];

        const booleanSkills = [];
        if (data.house_cleanin || data.house_cleaning) booleanSkills.push("House Cleaning");
        if (data.child_care) booleanSkills.push("Child Care");
        if (data.laundry) booleanSkills.push("Laundry");
        if (data.elderly_care) booleanSkills.push("Elderly Care");
        if (data.pet_care) booleanSkills.push("Pet Care");
        if (data.kitchen_cleani || data.kitchen_cleaning) booleanSkills.push("Kitchen Cleaning");

        const normalized = {
          id: data.id,
          name: data.full_name ?? data.name ?? "Helper",
          title: data.title ?? `${data.full_name ?? data.name ?? "Helper"} - Helper`,
          about: data.bio ?? data.other_skills ?? data.description ?? "",
          location: [data.city, data.district, data.state].filter(Boolean).join(", "),
          experience: data.experience_ye ?? data.experience_years ?? data.experience ?? "—",
          salary: data.salary_min ?? data.salary ?? data.expected_salary ?? "Negotiable",
          rating: data.rating ?? 4.8,
          reviews: data.reviews ?? 0,
          specialties: specialties.map((s: any) => String(s).trim()).filter(Boolean),
          services: [...services.map((s: any) => String(s).trim()).filter(Boolean), ...booleanSkills],
          images: imagesForUI,
          foodImages: parsedFoodImages.map((x) => publicURL(String(x))),
          profileUrl: parsedProfile.length ? publicURL(parsedProfile[0]) : null,
          personal: {
            gender: data.gender ?? null,
            age: data.age ?? null,
            phone: data.phone ?? null,
            whatsapp: data.whatsapp ?? null,
            alternate_phone: data.alternate_phone ?? null,
            address: data.address ?? null,
          },
          workingHours: parseMaybeJSON(data.working_hours ?? data.working_hour),
          preferredWork: parseMaybeJSON(data.preferred_work ?? data.preferred_work_locations ?? data.preferred_work_location),
          cuisine_type: data.cuisine_type ?? null,
          dishes: parseMaybeJSON(data.dishes),
          nearbyPlaces: parseMaybeJSON(data.nearby ?? data.nearby_places),
          rules: parseMaybeJSON(data.rules),
          created_at: data.created_at ?? null,
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
  }, [id]);

  if (!helper) {
    return <div className="text-center p-10 text-gray-500">Loading...</div>;
  }

  const images = Array.isArray(helper.images) ? helper.images : ["/placeholder.svg"];
  const specialties = Array.isArray(helper.specialties) ? helper.specialties : [];
  const services = Array.isArray(helper.services) ? helper.services : [];

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

                <button type="button" onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-3 rounded-full shadow">
                  <ArrowLeft className="w-6 h-6" />
                </button>

                <button type="button" onClick={() => setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-3 rounded-full shadow">
                  <ArrowLeft className="w-6 h-6 rotate-180" />
                </button>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                  {images.map((img: string, idx: number) => (
                    <button key={idx} type="button" aria-label={`Go to image ${idx + 1}`} onClick={() => setCurrentImageIndex(idx)} className={`w-3 h-3 rounded-full ${currentImageIndex === idx ? "bg-white" : "bg-white/50"}`} />
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

                    <Separator className="my-6" />

                    {/* Cooking / Dishes */}
                    <div className="mt-4">
                      <h3 className="text-lg font-semibold mb-2">Cooking & Cuisine</h3>
                      <div className="flex flex-wrap gap-2">
                        {(helper.cuisine_type ? [helper.cuisine_type] : []).map((c: any, idx: number) => <Badge key={idx} variant="secondary">{c}</Badge>)}
                        {helper.dishes && helper.dishes.length > 0 ? helper.dishes.map((d: any, idx: number) => <Badge key={`d-${idx}`} variant="outline">{d}</Badge>) : null}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-3xl font-bold text-purple-600">₹{helper.salary}</span>
                    <div className="text-gray-500 text-sm">/month - {helper.experience} years</div>
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
                {/* static/dummy reviews for now */}
                <div className="mb-4 pb-4 border-b">
                  <div className="font-medium">Priya Sharma</div>
                  <div className="text-sm text-gray-500">2 weeks ago</div>
                  <p className="mt-2">Very good cook and polite.</p>
                </div>
                <div className="mb-4 pb-4 border-b">
                  <div className="font-medium">Rohan Patnaik</div>
                  <div className="text-sm text-gray-500">1 month ago</div>
                  <p className="mt-2">Food tastes homely!</p>
                </div>
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
                <a href={`tel:${helper.personal?.phone ?? ""}`}>
                  <Button className="w-full mb-3" size="lg">
                    <Phone className="w-4 h-4 mr-2" />
                    Call {helper.personal?.phone ?? "—"}
                  </Button>
                </a>

                <a href={helper.personal?.whatsapp ? `https://wa.me/${helper.personal.whatsapp}` : "#"}>
                  <Button variant="outline" className="w-full bg-transparent mb-3" size="lg">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    WhatsApp
                  </Button>
                </a>

                <Separator className="my-4" />

                <div className="text-sm">
                  <div className="flex justify-between">
                    <span>Available from:</span>
                    <span>{helper.availableFrom ?? "Available soon"}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Last updated:</span>
                    <span>{helper.lastUpdated}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

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

            <Card>
              <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start bg-transparent"><Calendar className="w-4 h-4 mr-2" /> Schedule Interview</Button>
                <Button variant="outline" className="w-full justify-start bg-transparent"><Heart className="w-4 h-4 mr-2" /> Save to Favorites</Button>
                <Button variant="outline" className="w-full justify-start bg-transparent"><Share2 className="w-4 h-4 mr-2" /> Share Profile</Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Nearby Places */}
        {helper.nearbyPlaces && helper.nearbyPlaces.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Nearby Places</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {helper.nearbyPlaces.map((place: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">{place.name ?? place}</div>
                      <div className="text-sm text-gray-500">{place.type ?? ""}</div>
                    </div>
                    <Badge variant="outline">{place.distance ?? ""}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Rules */}
        {helper.rules && helper.rules.length > 0 && (
          <Card className="mt-6">
            <CardHeader><CardTitle>Rules & Policies</CardTitle></CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {helper.rules.map((rule: any, idx: number) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
