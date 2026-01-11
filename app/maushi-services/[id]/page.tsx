// app/maushi-services/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";


import {
  MapPin,
  Home,
  Phone,
  MessageSquare,
  CheckCircle,
  Heart,
  Share2,
  Calendar,
  ArrowLeft,
} from "lucide-react";

// ----------------------------------------
// SAFE JSON PARSER
// ----------------------------------------
const parseMaybeJSON = (value: any): any[] => {
  if (value === null || value === undefined) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === "object") {
    // return array values (handles map/object shapes)
    try {
      return Object.values(value);
    } catch {
      return [];
    }
  }

  if (typeof value === "string") {
    const t = value.trim();
    // try parse json
    if ((t.startsWith("[") && t.endsWith("]")) || (t.startsWith("{") && t.endsWith("}"))) {
      try {
        const parsed = JSON.parse(t);
        if (Array.isArray(parsed)) return parsed;
        if (typeof parsed === "object") return Object.values(parsed);
      } catch {
        // continue to csv fallback
      }
    }
    if (t.includes(",")) return t.split(",").map((s) => s.trim()).filter(Boolean);
    if (t) return [t];
    return [];
  }
  return [];
};

// ----------------------------------------
// PUBLIC URL RESOLVER (Supabase storage)
// ----------------------------------------
const publicURL = (raw: string | null | undefined) => {
  if (!raw) return "/placeholder.svg";
  const str = String(raw).trim();
  if (!str) return "/placeholder.svg";
  if (str.startsWith("http")) return str;

  const path = str.startsWith("/") ? str.slice(1) : str;
  try {
    const { data } = supabase.storage.from("helper-images").getPublicUrl(path);
    return data?.publicUrl ?? "/placeholder.svg";
  } catch {
    return "/placeholder.svg";
  }
};

export default function HelperDetailsPage() {
  const params = useParams();
  const id = params?.id;

  const [helper, setHelper] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const router = useRouter();

  useEffect(() => {
    const checkAuthAndRole = async () => {
      const { data } = await supabase.auth.getUser();
      const user = data.user;

      // ❌ Not logged in → go to login
      if (!user) {
        router.replace("/login?redirect=/maushi-services");
        return;
      }

      const role = user.user_metadata?.role;

      // ❌ Helpers should not view other helpers
      if (role === "maushi" || role === "helper") {
        alert("❌ Helpers are not allowed to view other helper profiles.");
        router.replace("/");
        return;
      }

      // ✅ Student & Owner allowed
    };

    checkAuthAndRole();
  }, [router]);


  // ----------------------------------------
  // FETCH + NORMALIZE HELPER DATA
  // ----------------------------------------
  useEffect(() => {
    if (!id) return;

    let mounted = true;

    const fetchHelper = async () => {
      const { data, error } = await supabase
        .from("domestic_helpers")
        .select("*")
        .eq("id", id)
        .single()

        ;

      if (error || !data) {
        console.error("Error fetching helper:", error);
        return;
      }

      // ---- Images ----
      const imagesArr = parseMaybeJSON(data.images ?? data.photo_urls ?? data.photos);
      const images = imagesArr.map(publicURL);

      const foodArr = parseMaybeJSON(data.food_images ?? data.food_images_json ?? data.foods);
      const foodImages = foodArr.map(publicURL);

      const profilePhoto = data.profile_photo ? publicURL(data.profile_photo) : null;

      const finalImages = [...foodImages, ...images];
      if (profilePhoto) finalImages.push(profilePhoto);
      if (finalImages.length === 0) finalImages.push("/placeholder.svg");

      // ---- Specialties / dishes / cuisine ----
      const specialties = [
        ...parseMaybeJSON(data.specialties),
        ...parseMaybeJSON(data.dishes),
        ...(data.cuisine_type ? (Array.isArray(data.cuisine_type) ? data.cuisine_type : [data.cuisine_type]) : [])
      ].filter(Boolean).map((s: any) => String(s));

      // ---- Boolean Skills → badges ----
      const booleanSkills: any[] = [];
      if (data.house_cleaning) booleanSkills.push("House Cleaning");
      if (data.child_care) booleanSkills.push("Child Care");
      if (data.laundry) booleanSkills.push("Laundry");
      if (data.elderly_care) booleanSkills.push("Elderly Care");
      if (data.pet_care) booleanSkills.push("Pet Care");
      if (data.kitchen_cleaning) booleanSkills.push("Kitchen Cleaning");
      if (data.cook_only) booleanSkills.push("Cook Only");

      // ---- Services ----
      const services = [
        ...(Array.isArray(parseMaybeJSON(data.services)) ? parseMaybeJSON(data.services) : (parseMaybeJSON(data.services) ? [parseMaybeJSON(data.services)] : [])),
        ...(Array.isArray(parseMaybeJSON(data.preferred_work ?? data.preferred_work_locations)) ? parseMaybeJSON(data.preferred_work ?? data.preferred_work_locations) : (parseMaybeJSON(data.preferred_work ?? data.preferred_work_locations) ? [parseMaybeJSON(data.preferred_work ?? data.preferred_work_locations)] : [])),
        ...booleanSkills,
      ].filter(Boolean).map((s: any) => String(s));

      // ---- Working Hours / Preferred Employment ----
      const workingHours = parseMaybeJSON(data.working_hours ?? data.working_hour ?? data.working_time);
      const preferredEmployment = parseMaybeJSON(data.preferred_employment_type ?? data.employment_type);

      // ---- Nearby / Rules ----
      const nearby = parseMaybeJSON(data.nearby_places ?? data.nearby);
      const rules = parseMaybeJSON(data.rules);

      // ---- Contact / personal ----
      const phone = data.phone ?? data.contact ?? "";
      const whatsapp = data.whatsapp ?? data.whatsapp_number ?? "";
      const alternate_phone = data.alternate_phone ?? data.phone_alternate ?? "";

      // ---- final normalized object ----
      const normalized = {
        id: data.id,
        name: data.full_name ?? data.name ?? "Helper",
        gender: data.gender ?? "",
        age: data.age ?? "",
        bio: data.bio ?? data.description ?? "",
        location: [data.city, data.district, data.state].filter(Boolean).join(", "),

        experience: data.experience_years ?? data.experience ?? "0",
        salary:
          data.salary_min !== null && data.salary_min !== undefined
            ? Number(data.salary_min)
            : "Negotiable",

        phone,
        alternate_phone,
        whatsapp,

        images: finalImages,
        foodImages,
        profilePhoto,

        specialties,
        services,

        workingHours,
        preferredEmployment,

        nearby,
        rules,

        createdAt: data.created_at,
        lastUpdated: data.last_updated ?? "Recently",
        verified: typeof data.verified === "boolean" ? data.verified : true,
      };

      if (mounted) {
        setHelper(normalized);
        setCurrentImageIndex(0);
      }
    };

    fetchHelper();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!helper) {
    return <div className="text-center p-10 text-gray-500">Loading...</div>;
  }

  // Dummy reviews (kept same as UI)
  const reviews = [
    { id: 1, user: "Priya Sharma", rating: 5, comment: "Very good cook and polite.", date: "2 weeks ago" },
    { id: 2, user: "Rohan Patnaik", rating: 4, comment: "Food tastes homely!", date: "1 month ago" },
  ];

  const images = helper.images;

  // ----------------------------------------
  // UI BELOW — UNTOUCHED (only added small sections where appropriate)
  // ----------------------------------------
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

            {/* Image Carousel */}
            <Card className="overflow-hidden">
              <div className="relative w-full h-96 bg-gray-200 rounded-xl overflow-hidden">
                <Image
                  src={images[currentImageIndex]}
                  alt={helper.name}
                  fill
                  className="object-cover"
                  unoptimized
                />

                {/* Prev */}
                <button
                  type="button"
                  onClick={() =>
                    setCurrentImageIndex((prev) =>
                      prev === 0 ? images.length - 1 : prev - 1
                    )
                  }
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-3 rounded-full shadow"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>

                {/* Next */}
                <button
                  type="button"
                  onClick={() =>
                    setCurrentImageIndex((prev) =>
                      prev === images.length - 1 ? 0 : prev + 1
                    )
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
                      className={`w-3 h-3 rounded-full ${currentImageIndex === idx ? "bg-white" : "bg-white/50"
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
                <CardTitle className="text-2xl">{helper.name}</CardTitle>
              </CardHeader>

              <CardContent>
                <div className="flex justify-between">
                  <div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-1" />
                      {helper.location}
                    </div>

                    <p className="text-gray-700 mt-2">{helper.bio}</p>

                    {/* Personal info (age/gender) */}
                    <div className="mt-3 text-sm text-gray-700">
                      {helper.gender && <span className="mr-4">Gender: {helper.gender}</span>}
                      {helper.age && <span>Age: {helper.age}</span>}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-3xl font-bold text-purple-600">₹{helper.salary}</span>
                    <div className="text-gray-500 text-sm">
                      /month — {helper.experience} years exp.
                    </div>
                  </div>
                </div>

                {/* Specialties */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">Specialties</h3>
                  <div className="flex flex-wrap gap-2">
                    {helper.specialties && helper.specialties.length
                      ? helper.specialties.map((s: any, idx: number) => <Badge key={idx} variant="secondary">{s}</Badge>)
                      : <div className="text-sm text-gray-500">No specialties listed.</div>}
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Services */}
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">Services</h3>
                  <div className="flex flex-wrap gap-2">
                    {helper.services && helper.services.length
                      ? helper.services.map((s: any, idx: number) => <Badge key={idx} variant="outline">{s}</Badge>)
                      : <div className="text-sm text-gray-500">No services listed.</div>}
                  </div>
                </div>

                {/* Additional Sections — Cuisine, Dishes, Work Hours, Preferred Employment */}
                <div className="mt-6 space-y-4">
                  {helper.cuisine && helper.cuisine.length > 0 && (
                    <div>
                      <div className="text-sm font-medium mb-2">Cuisine Types</div>
                      <div className="flex flex-wrap gap-2">
                        {helper.cuisine.map((c: any, idx: number) => <Badge key={idx} variant="secondary">{c}</Badge>)}
                      </div>
                    </div>
                  )}

                  {helper.dishes && helper.dishes.length > 0 && (
                    <div>
                      <div className="text-sm font-medium mb-2">Dishes</div>
                      <div className="flex flex-wrap gap-2">
                        {helper.dishes.map((d: any, idx: number) => <Badge key={idx} variant="outline">{d}</Badge>)}
                      </div>
                    </div>
                  )}

                  {helper.workingHours && (Array.isArray(helper.workingHours) ? helper.workingHours.length > 0 : !!helper.workingHours) && (
                    <div>
                      <div className="text-sm font-medium mb-2">Working Hours</div>
                      <div className="text-sm text-gray-700">{Array.isArray(helper.workingHours) ? helper.workingHours.join(" · ") : String(helper.workingHours)}</div>
                    </div>
                  )}

                  {helper.preferredEmployment && helper.preferredEmployment.length > 0 && (
                    <div>
                      <div className="text-sm font-medium mb-2">Preferred Employment</div>
                      <div className="flex flex-wrap gap-2">
                        {helper.preferredEmployment.map((p: any, idx: number) => <Badge key={idx} variant="outline">{p}</Badge>)}
                      </div>
                    </div>
                  )}
                </div>

              </CardContent>
            </Card>

            {/* Reviews */}
            <Card>
              <CardHeader>
                <CardTitle>Reviews (0)</CardTitle>
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
                <a href={`tel:${helper.phone}`}>
                  <Button className="w-full mb-3" size="lg">
                    <Phone className="w-4 h-4 mr-2" />
                    Call {helper.phone}
                  </Button>
                </a>

                <Button variant="outline" className="w-full bg-transparent" size="lg" asChild>
                  <a href={`https://wa.me/${helper.whatsapp ?? helper.phone ?? ""}`}>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Message
                  </a>
                </Button>

                <Separator className="my-4" />

                <div className="text-sm">
                  <div className="flex justify-between">
                    <span>Available from:</span>
                    <span>Anytime</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Last updated:</span>
                    <span>{helper.lastUpdated}</span>
                  </div>

                  {helper.alternate_phone && (
                    <div className="flex justify-between mt-2">
                      <span>Alternate phone:</span>
                      <span>{helper.alternate_phone}</span>
                    </div>
                  )}
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
                  <span>Salary</span>
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
