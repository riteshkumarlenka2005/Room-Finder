"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/navbar"


import {
  Search,
  MapPin,
  Home,
  Users,
  Star,
  Phone,
  CheckCircle,
  Heart,
  SlidersHorizontal,
  Bed,
  Square,
  Droplets,
  Wind,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Filters {
  priceRange: string;
  roomType: string[];
  sharing: string[];
  amenities: string[];
  location: string;
}

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortOption, setSortOption] = useState("relevance");

  const [rooms, setRooms] = useState<any[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<Filters>({
    roomType: [],
    priceRange: "",
    sharing: [],
    amenities: [],
    location: "",
  });

  const searchParams = useSearchParams();

  // ----------------------------------------
  // NORMALIZATION UTIL
  // ----------------------------------------
  function normalizeArray(val: any): string[] {
    if (!val) return [];
    if (Array.isArray(val)) return val.map((x) => String(x));

    if (typeof val === "string") {
      try {
        const parsed = JSON.parse(val);
        if (Array.isArray(parsed)) return parsed.map((x) => String(x));
      } catch (err) {
        return val
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }
    }
    return [String(val)];
  }

  // ----------------------------------------
  // READ FILTERS FROM URL
  // ----------------------------------------
  useEffect(() => {
    const qRoom = searchParams?.get("roomType") || searchParams?.get("type") || "";
    const qLocation = searchParams?.get("location") || "";
    const qPrice = searchParams?.get("priceRange") || searchParams?.get("price") || "";

    setSelectedFilters((prev) => ({
      ...prev,
      roomType: qRoom ? [qRoom] : [],
      location: qLocation,
      priceRange: qPrice,
    }));

    if (qLocation) setSearchQuery(qLocation);
  }, [searchParams]);

  // ----------------------------------------
  // FETCH FROM SUPABASE
  // ----------------------------------------
  useEffect(() => {
    async function load() {
      const { data, error } = await supabase.from("properties").select("*");

      if (error) {
        console.error("Supabase Error:", error);
        return;
      }

      const normalized = data.map((r: any) => ({
        id: r.id,
        title: r.title ?? "Untitled Room",

        fullAddress: r.full_address ?? "",
        location: `${r.city ?? ""}, ${r.district ?? ""}, ${r.state ?? ""}`,

        price: Number(r.price ?? r.monthly_rent ?? 0),
        type: r.property_type ?? "",
        sharing: r.sharing ?? "",

        features: normalizeArray(r.amenities),
        image: Array.isArray(r.images) ? r.images[0] : "/placeholder.svg",

        rating: Number(r.rating ?? 0),
        reviews: Number(r.reviews ?? 0),

        owner: {
          name: r.owner_name ?? "Owner",
          phone: r.phone ?? "",
          verified: true,
        },

        details: {
          bhk: r.bhk ?? "",
          doors: r.doors ?? 0,
          windows: r.windows ?? 0,
          waterSystem: r.water_system ?? "",
        },

        created_at: r.created_at ?? 0,
        verified: true,
        featured: false,
      }));

      setRooms(normalized);
    }

    load();
  }, []);

  // ----------------------------------------
  // FILTER OPTIONS
  // ----------------------------------------
  const roomTypes = ["1BHK", "2BHK", "3BHK", "Single Room", "Shared Room"];
  const sharingOptions = ["Single occupancy", "2 people", "3-4 people", "5-6 people"];
  const amenitiesList = [
    "WiFi",
    "Parking",
    "Kitchen",
    "Maushi Available",
    "AC",
    "Furnished",
    "Security",
    "Laundry",
  ];

  const priceRanges = [
    { label: "Under ₹2000", value: "0-2000" },
    { label: "₹2000-₹4000", value: "2000-4000" },
    { label: "₹4000-₹6000", value: "4000-6000" },
    { label: "Above ₹6000", value: "6000-999999" },
  ];

  // ----------------------------------------
  // FILTER + SORT
  // ----------------------------------------
  const filteredRooms = rooms
    .filter((room) => {
      const q = searchQuery.toLowerCase().trim();

      if (
        q &&
        !room.title.toLowerCase().includes(q) &&
        !room.location.toLowerCase().includes(q) &&
        !room.fullAddress.toLowerCase().includes(q)
      )
        return false;

      if (selectedFilters.roomType.length > 0 && !selectedFilters.roomType.includes(room.type))
        return false;

      if (selectedFilters.priceRange) {
        const [min, max] = selectedFilters.priceRange.split("-").map(Number);
        if (room.price < min || room.price > max) return false;
      }

      if (selectedFilters.sharing.length > 0) {
        const ok = selectedFilters.sharing.some((s) =>
          room.sharing.toLowerCase().includes(s.toLowerCase())
        );
        if (!ok) return false;
      }

      if (selectedFilters.amenities.length > 0) {
        const feats = room.features.map((f: any) => String(f).toLowerCase());
        const ok = selectedFilters.amenities.every((a) =>
          feats.includes(a.toLowerCase())
        );
        if (!ok) return false;
      }

      if (selectedFilters.location) {
        const loc = selectedFilters.location.toLowerCase();
        if (
          !room.location.toLowerCase().includes(loc) &&
          !room.fullAddress.toLowerCase().includes(loc)
        )
          return false;
      }

      return true;
    })
    .sort((a, b) => {
      switch (sortOption) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating-high":
          return b.rating - a.rating;
        case "newest":
          return (
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime()
          );
        default:
          return 0;
      }
    });

  // ----------------------------------------
  // FILTER HANDLER
  // ----------------------------------------
  type FilterType = "roomType" | "sharing" | "amenities" | "priceRange" | "location";

  const handleFilterChange = (
    filterType: FilterType,
    value: string,
    checkedRaw: boolean | "indeterminate"
  ) => {
    const checked = Boolean(checkedRaw);

    setSelectedFilters((prev) => {
      if (filterType === "priceRange" || filterType === "location") {
        return { ...prev, [filterType]: checked ? value : "" };
      }

      const arr = prev[filterType] as string[];

      return {
        ...prev,
        [filterType]: checked
          ? [...arr, value]
          : arr.filter((v) => v !== value),
      };
    });
  };


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by location, room type, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </Button>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className={`w-80 ${showFilters ? "block" : "hidden"} lg:block`}>
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h3 className="text-lg font-semibold mb-4">Filters</h3>

              {/* ROOM TYPE */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Room Type</h4>
                <div className="space-y-2">
                  {roomTypes.map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox id={`room-${type}`} checked={selectedFilters.roomType.includes(type)}
                        onCheckedChange={(checked) => handleFilterChange("roomType", type, checked)} />
                      <label htmlFor={`room-${type}`} className="text-sm">{type}</label>
                    </div>
                  ))}
                </div>
              </div>

              {/* PRICE RANGE */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Price Range</h4>
                <div className="space-y-2">
                  {priceRanges.map((range) => (
                    <div key={range.value} className="flex items-center space-x-2">
                      <Checkbox id={`price-${range.value}`} checked={selectedFilters.priceRange === range.value}
                        onCheckedChange={(checked) => handleFilterChange("priceRange", range.value, checked)} />
                      <label htmlFor={`price-${range.value}`} className="text-sm">{range.label}</label>
                    </div>
                  ))}
                </div>
              </div>

              {/* SHARING */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Sharing</h4>
                <div className="space-y-2">
                  {sharingOptions.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox id={`sharing-${option}`} checked={selectedFilters.sharing.includes(option)}
                        onCheckedChange={(checked) => handleFilterChange("sharing", option, checked)} />
                      <label htmlFor={`sharing-${option}`} className="text-sm">{option}</label>
                    </div>
                  ))}
                </div>
              </div>

              {/* AMENITIES */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Amenities</h4>
                <div className="space-y-2">
                  {amenitiesList.map((amenity) => (
                    <div key={amenity} className="flex items-center space-x-2">
                      <Checkbox
                        id={`amenity-${amenity}`}
                        checked={selectedFilters.amenities.includes(amenity)}
                        onCheckedChange={(checked) =>
                          handleFilterChange("amenities", amenity, checked)
                        }
                      />
                      <label htmlFor={`amenity-${amenity}`} className="text-sm">
                        {amenity}
                      </label>
                    </div>
                  ))}
                </div>
              </div>


              <Button variant="outline" className="w-full bg-transparent" onClick={() => setSelectedFilters({
                roomType: [], priceRange: "", sharing: [], amenities: [], location: ""
              })}>
                Clear All Filters
              </Button>
            </div>
          </div>

          {/* RESULTS */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{filteredRooms.length} Rooms Found</h2>
              <select className="border border-gray-300 rounded-md px-3 py-2" value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}>
                <option value="relevance">Sort by: Relevance</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating-high">Rating: High to Low</option>
                <option value="newest">Newest First</option>
              </select>
            </div>

            <div className="space-y-6">
              {filteredRooms.map((room) => (
                <Card key={room.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="md:flex">
                    <div className="md:w-1/3 relative">
                      <div className="relative w-full h-64 md:h-full">
                        <Image
                          src={room.image || "/placeholder.svg"}
                          alt={room.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <Button size="sm" variant="outline" className="absolute top-2 right-2 bg-white/90 hover:bg-white">
                        <Heart className="w-4 h-4" />
                      </Button>

                      {room.verified && (
                        <Badge className="absolute top-2 left-2 bg-green-600">
                          <CheckCircle className="w-3 h-3 mr-1" /> Verified
                        </Badge>
                      )}

                      {room.featured && (
                        <Badge className="absolute bottom-2 left-2 bg-orange-600">Featured</Badge>
                      )}
                    </div>

                    <CardContent className="md:w-2/3 p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-xl">{room.title}</h3>
                        <div className="text-right">
                          <span className="text-2xl font-bold text-blue-600">₹{room.price}</span>
                          <span className="text-gray-500">/month</span>
                        </div>
                      </div>

                      <div className="flex items-center text-gray-600 mb-3">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span className="text-sm">{room.fullAddress}</span>
                      </div>

                      <div className="flex items-center gap-4 mb-4">
                        <Badge variant="outline" className="flex items-center gap-1"><Home className="w-3 h-3" />{room.type}</Badge>
                        <Badge variant="outline" className="flex items-center gap-1"><Users className="w-3 h-3" />{room.sharing}</Badge>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="ml-1 text-sm font-medium">{room.rating}</span>
                          <span className="ml-1 text-sm text-gray-500">({room.reviews})</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                        <div className="flex items-center gap-1"><Bed className="w-4 h-4 text-gray-500" /><span>{room.details?.bhk}</span></div>
                        <div className="flex items-center gap-1"><Square className="w-4 h-4 text-gray-500" /><span>{room.details?.doors} Doors</span></div>
                        <div className="flex items-center gap-1"><Wind className="w-4 h-4 text-gray-500" /><span>{room.details?.windows} Windows</span></div>
                        <div className="flex items-center gap-1"><Droplets className="w-4 h-4 text-gray-500" /><span>{room.details?.waterSystem}</span></div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {room.features?.map((feature: any, index: number) => (
                          <Badge key={index} variant="secondary" className="text-xs">{feature}</Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-600">
                          <Users className="w-4 h-4 mr-1" />
                          <span>{room.owner?.name}</span>
                          {room.owner?.verified && <CheckCircle className="w-4 h-4 ml-1 text-green-600" />}
                        </div>

                        <div className="flex gap-2">
                          <Button size="sm" variant="outline"><Phone className="w-4 h-4 mr-1" />Call</Button>
                          <Link href={`/room/${room.id}`}><Button size="sm">View Details</Button></Link>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>

            {filteredRooms.length === 0 && (
              <div className="text-center py-12">
                <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No rooms found</h3>
                <p className="text-gray-500">Try adjusting your filters or search criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
