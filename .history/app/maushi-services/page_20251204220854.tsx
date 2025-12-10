// app/maushi-services/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/navbar";
import { supabase } from "@/lib/supabase";
import { requireAuth } from "@/utils/requireAuth";

import {
  Search,
  MapPin,
  Users,
  Star,
  Phone,
  MessageSquare,
  Utensils,
  CheckCircle,
  Heart,
  Filter,
  IndianRupee,
} from "lucide-react";

import Link from "next/link";

interface Filters {
  priceRange: string;
  experience: string;
  cuisine: string[];
  availability: string;
}

/**
 * MaushiServicesPage
 *
 * - Normalizes DB rows so UI can use consistent fields
 * - Resolves image paths / storage paths to usable public URLs
 * - Does not change UI layout or styling (only enriches card data)
 */
export default function MaushiServicesPage() {
  useEffect(() => {
    requireAuth();
  }, []);

  const [searchLocation, setSearchLocation] = useState("");
  const [helpers, setHelpers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedFilters, setSelectedFilters] = useState<Filters>({
    priceRange: "",
    experience: "",
    cuisine: [],
    availability: "",
  });

  // ---------- utilities ----------
  const parseMaybeJSON = (val: any) => {
    if (val === undefined || val === null) return null;
    if (Array.isArray(val)) return val;
    if (typeof val === "object") return val;
    if (typeof val === "string") {
      const s = val.trim();
      if (!s) return null;
      if ((s.startsWith("[") && s.endsWith("]")) || (s.startsWith("{") && s.endsWith("}"))) {
        try {
          return JSON.parse(s);
        } catch {
          return s;
        }
      }
      if (s.includes(",")) return s.split(",").map((x) => x.trim()).filter(Boolean);
      return s;
    }
    return null;
  };

  const resolveImageUrl = (path: any) => {
    if (!path) return "/placeholder.svg";

    if (Array.isArray(path)) {
      if (path.length === 0) return "/placeholder.svg";
      return resolveImageUrl(path[0]);
    }

    if (typeof path === "object" && path !== null) {
      const maybe = (path.publicUrl ?? path.url ?? path.path ?? path.file ?? null);
      if (maybe) return resolveImageUrl(maybe);
      return "/placeholder.svg";
    }

    if (typeof path !== "string") return "/placeholder.svg";

    const s = path.trim();
    if (!s) return "/placeholder.svg";

    if (s.startsWith("http://") || s.startsWith("https://")) return s;

    try {
      const res: any = supabase.storage.from("helper-images").getPublicUrl(s);
      const publicUrl = res?.data?.publicUrl ?? res?.publicURL ?? res?.publicUrl ?? null;
      if (publicUrl) return publicUrl;
    } catch {
      // ignore
    }

    if (s.includes("/")) return s;
    return s;
  };

  // ---------- fetch + normalize ----------
  useEffect(() => {
    fetchHelpers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchHelpers() {
    setLoading(true);

    const { data, error } = await supabase
      .from("domestic_helpers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    // Normalize rows so UI can rely on consistent field names
    const normalized = (data || []).map((h: any) => {
      // Safe parse helpers
      const asArray = (v: any) => {
        const p = parseMaybeJSON(v);
        if (p === null || p === undefined) return [];
        if (Array.isArray(p)) return p;
        if (typeof p === "object") return Object.values(p);
        return [p];
      };

      // images
      const rawImages = asArray(h.images ?? h.image ?? h.photo_urls ?? h.photos);
      const rawFood = asArray(h.food_images ?? h.food_images_json ?? h.foods);
      const profilePhoto = h.profile_photo ?? h.profilePhoto ?? h.photo ?? null;

      const imagesResolved = [
        ...rawFood.map(resolveImageUrl),
        ...rawImages.map(resolveImageUrl),
        ...(profilePhoto ? [resolveImageUrl(profilePhoto)] : []),
      ];

      // specialties/cooking/dishes/cuisines
      const specialtiesArr = [
        ...asArray(h.specialties),
        ...asArray(h.dishes),
        ...(h.cuisine_type ? (Array.isArray(h.cuisine_type) ? h.cuisine_type : [h.cuisine_type]) : []),
      ]
        .flat()
        .filter(Boolean)
        .map((x: any) => String(x).trim());

      // services / work-related
      const servicesArr = [
        ...asArray(h.services),
        ...asArray(h.preferred_work ?? h.preferred_work_locations ?? h.preferred_work_location),
        ...(h.preferred_employment_type ? [h.preferred_employment_type] : []),
      ]
        .flat()
        .filter(Boolean)
        .map((x: any) => String(x).trim());

      // boolean skill badges
      const booleanSkills: string[] = [];
      if (h.house_cleanin || h.house_cleaning) booleanSkills.push("House Cleaning");
      if (h.child_care) booleanSkills.push("Child Care");
      if (h.laundry) booleanSkills.push("Laundry");
      if (h.elderly_care) booleanSkills.push("Elderly Care");
      if (h.pet_care) booleanSkills.push("Pet Care");
      if (h.kitchen_cleani || h.kitchen_cleaning) booleanSkills.push("Kitchen Cleaning");

      // personal details
      const personal = {
        gender: h.gender ?? null,
        age: h.age ?? null,
        phone: h.phone ?? h.contact ?? null,
        alternate_phone: h.alternate_phone ?? h.alternate_ph ?? h.alternate_phone_number ?? null,
        whatsapp: h.whatsapp ?? null,
        bio: h.bio ?? h.other_skills ?? h.otherSkills ?? h.skills ?? "",
      };

      const salary = h.salary_min ?? h.salaryMin ?? h.salary ?? h.expected_salary ?? "";
      const experience = h.experience_ye ?? h.experience_years ?? h.experience ?? h.years ?? "";

      const location = [h.city, h.district, h.state].filter(Boolean).join(", ");

      // compact card data (Option A) - limit badges for card to keep it clean
      const cardSpecialties = specialtiesArr.slice(0, 8);
      const cardServices = [...servicesArr, ...booleanSkills].slice(0, 3);

      // working hours / preferred work
      const workingHours = asArray(h.working_hours ?? h.working_hour ?? h.workingHours);

      return {
        ...h,
        // normalized
        salary,
        experience,
        location,
        profilePhoto,
        imagesResolved,
        mainImage: imagesResolved.length ? imagesResolved[0] : "/placeholder.svg",
        allImages: imagesResolved.length ? imagesResolved : ["/placeholder.svg"],
        specialtiesArr,
        servicesArr,
        booleanSkills,
        cardSpecialties,
        cardServices,
        cuisine_type: h.cuisine_type ?? null,
        personal,
        workingHours,
        raw: h,
      };
    });

    setHelpers(normalized);
    setLoading(false);
  }

  // ---------- UI constants (unchanged) ----------
  const cuisineTypes = ["Odia Cuisine", "North Indian", "South Indian", "Bengali", "Gujarati", "Chinese", "Continental"];
  const experienceLevels = ["5+ years", "10+ years", "15+ years", "20+ years"];
  const availabilityOptions = ["Full Time", "Part Time", "Morning Only", "Evening Only", "Weekends"];
  const priceRanges = [
    { label: "Under ₹1000", value: "0-1000" },
    { label: "₹1000-₹1500", value: "1000-1500" },
    { label: "₹1500-₹2000", value: "1500-2000" },
    { label: "Above ₹2000", value: "2000-999999" },
  ];

  // ---------- helpers ----------
  const truncate = (s: string, n = 100) => {
    if (!s) return "";
    if (s.length <= n) return s;
    return s.slice(0, n).trim() + "...";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* HERO */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Find Experienced <span className="text-purple-600">Domestic helper</span>
          </h1>
          <p className="text-lg text-gray-600 mb-6">Cooking की tension नहीं! Experienced aunties से मिलेगा homestyle खाना</p>

          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input placeholder="Search by location..." value={searchLocation} onChange={(e) => setSearchLocation(e.target.value)} className="pl-10" />
              </div>
              <Button>
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </div>

        {/* MAIN */}
        <div className="flex gap-8">
          {/* Sidebar filters (unchanged) */}
          <div className="w-80 hidden lg:block">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filters
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Price Range (per person/month)</h4>
                  <div className="space-y-2">
                    {priceRanges.map((range) => (
                      <div key={range.value} className="flex items-center space-x-2">
                        <input type="radio" id={`price-${range.value}`} name="priceRange" checked={selectedFilters.priceRange === range.value} onChange={() => setSelectedFilters((prev) => ({ ...prev, priceRange: range.value }))} />
                        <label htmlFor={`price-${range.value}`} className="text-sm">{range.label}</label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Experience</h4>
                  <div className="space-y-2">
                    {experienceLevels.map((level) => (
                      <div key={level} className="flex items-center space-x-2">
                        <input type="radio" id={`exp-${level}`} name="experience" checked={selectedFilters.experience === level} onChange={() => setSelectedFilters((prev) => ({ ...prev, experience: level }))} />
                        <label htmlFor={`exp-${level}`} className="text-sm">{level}</label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Cuisine Specialties</h4>
                  <div className="space-y-2">
                    {cuisineTypes.map((cuisine) => (
                      <div key={cuisine} className="flex items-center space-x-2">
                        <input type="checkbox" id={`cuisine-${cuisine}`} checked={selectedFilters.cuisine.includes(cuisine)} onChange={(e) => {
                          if (e.target.checked) setSelectedFilters((prev) => ({ ...prev, cuisine: [...prev.cuisine, cuisine] }));
                          else setSelectedFilters((prev) => ({ ...prev, cuisine: prev.cuisine.filter((c) => c !== cuisine) }));
                        }} />
                        <label htmlFor={`cuisine-${cuisine}`} className="text-sm">{cuisine}</label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Availability</h4>
                  <div className="space-y-2">
                    {availabilityOptions.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <input type="radio" id={`avail-${option}`} name="availability" checked={selectedFilters.availability === option} onChange={() => setSelectedFilters((prev) => ({ ...prev, availability: option }))} />
                        <label htmlFor={`avail-${option}`} className="text-sm">{option}</label>
                      </div>
                    ))}
                  </div>
                </div>

                <Button variant="outline" className="w-full">Clear All Filters</Button>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{helpers.length} Helper Services Available</h2>

              <select className="border border-gray-300 rounded-md px-3 py-2">
                <option>Sort by: Rating</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Experience: Most to Least</option>
              </select>
            </div>

            <div className="space-y-6">
              {loading ? (
                <p>Loading helpers...</p>
              ) : (
                helpers.map((h) => (
                  <Card key={h.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="md:flex">
                      <div className="md:w-1/4 relative">
                        <img src={h.mainImage || "/placeholder.svg"} alt={h.full_name} className="w-full h-64 md:h-full object-cover" />

                        <Badge className="absolute top-2 left-2 bg-green-600">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>

                        <Button size="sm" variant="outline" className="absolute top-2 right-2 bg-white/90">
                          <Heart className="w-4 h-4" />
                        </Button>
                      </div>

                      <CardContent className="md:w-3/4 p-6">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-xl flex items-center gap-2">
                              {h.full_name}
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            </h3>

                            <div className="flex items-center text-gray-600 mt-1">
                              <MapPin className="w-4 h-4 mr-1" />
                              <span className="text-sm">{h.location}</span>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-2xl font-bold text-purple-600">
                              {typeof h.salary === "number" || /^\d+$/.test(String(h.salary)) ? `₹${h.salary}` : (h.salary ? `₹${h.salary}` : "₹—")}
                            </span>
                            <span className="text-gray-500">/month</span>
                            <div className="text-sm text-gray-500">Negotiable</div>
                          </div>
                        </div>

                        <p className="text-gray-700 mb-2">Experience: {h.experience ?? h.experience_years ?? "—"} years</p>

                        {/* compact: show a short bio */}
                        {h.personal?.bio ? <p className="text-gray-700 mb-4">{truncate(String(h.personal.bio), 120)}</p> : null}

                        {/* SPECIALTIES - show up to 8 */}
                        <div className="mb-3">
                          <div className="flex flex-wrap gap-2">
                            {h.cardSpecialties && h.cardSpecialties.length > 0
                              ? h.cardSpecialties.map((s: string, idx: number) => <Badge key={idx} variant="secondary">{s}</Badge>)
                              : <div className="text-sm text-gray-500">No specialties listed.</div>}
                          </div>
                        </div>

                        {/* SERVICES (compact - up to 3) */}
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-2">
                            {h.cardServices && h.cardServices.length > 0
                              ? h.cardServices.map((s: string, idx: number) => <Badge key={idx} variant="outline">{s}</Badge>)
                              : null}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-sm text-gray-600">
                            <Users className="w-4 h-4 mr-1" />
                            <span>Available for students</span>
                          </div>

                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Phone className="w-4 h-4 mr-1" />
                              Call
                            </Button>

                            <Button size="sm" variant="outline">
                              <MessageSquare className="w-4 h-4 mr-1" />
                              Message
                            </Button>

                            <Link href={`/maushi-services/${h.id}`}>
                              <Button size="sm">View Details</Button>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>

        {/* How it works + benefits (unchanged) */}
        {/* ... copied unchanged from your file ... */}
        <section className="mt-16 bg-white rounded-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-8">How Maushi Service Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">1. Search & Filter</h3>
              <p className="text-sm text-gray-600">अपनी location और requirements के according Maushi search करें</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">2. Contact & Discuss</h3>
              <p className="text-sm text-gray-600">Direct Maushi से contact करें, menu और timing discuss करें</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">3. Finalize Deal</h3>
              <p className="text-sm text-gray-600">Price, timing, और menu finalize करके agreement करें</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Utensils className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">4. Enjoy Meals</h3>
              <p className="text-sm text-gray-600">Fresh, homestyle खाना enjoy करें और studies पर focus करें</p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
