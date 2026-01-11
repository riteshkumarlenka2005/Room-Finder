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


import { resolveImageUrl } from "@/utils/image-utils";
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
  Filter,
  Zap,
  Car
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

// Helper for pluralization
const pluralize = (count: number, singular: string, plural?: string) => {
  if (count === 1) return `${count} ${singular}`;
  return `${count} ${plural || singular + 's'}`;
};

const normalizeArray = (val: any) => {
  if (Array.isArray(val)) return val;
  if (typeof val === "string") return val.split(",").map((s) => s.trim());
  return [];
};

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
  const [isLoading, setIsLoading] = useState(true);

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

        fullAddress: r.full_address ?? r.address ?? "",
        location: r.location || `${r.city ?? ""}, ${r.district ?? ""}, ${r.state ?? ""}`,

        price: Number(r.price ?? r.monthly_rent ?? 0),
        type: r.property_type || (r.bhk ? (String(r.bhk).toUpperCase().includes("BHK") ? r.bhk : `${r.bhk}BHK`) : "Room"),
        sharing: r.sharing || "",

        features: normalizeArray(r.amenities),
        image: resolveImageUrl(Array.isArray(r.images) && r.images.length ? r.images[0] : (r.image || null)),

        rating: Number(r.rating ?? 4.5),
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
          electricity: r.electricity ?? "",
          parking: r.parking ?? "",
        },

        created_at: r.created_at ?? 0,
        verified: true,
        featured: false,
      }));

      setRooms(normalized);
      setIsLoading(false);
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
        {/* Search Bar & Mobile Filters */}
        <div className="bg-white rounded-2xl shadow-sm p-4 md:p-6 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by location, room type, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 bg-gray-50/50 border-gray-100 rounded-xl focus:bg-white transition-all"
              />
            </div>

            <div className="flex gap-2">
              {/* Desktop Filter Toggle (syncs with Sidebar) */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="hidden lg:flex flex-1 md:flex-none items-center gap-2 h-12 px-6 rounded-xl border-gray-100 hover:bg-gray-50"
              >
                <SlidersHorizontal className="w-4 h-4" />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </Button>

              {/* Mobile Filter Sheet */}
              <div className="lg:hidden flex-1">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="w-full flex items-center gap-2 h-12 rounded-xl border-gray-100 hover:bg-gray-50">
                      <Filter className="w-4 h-4" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl p-0 overflow-hidden">
                    <SheetHeader className="p-6 border-b">
                      <SheetTitle className="text-xl font-bold flex items-center gap-2">
                        <Filter className="w-5 h-5 text-blue-600" />
                        Refine Search
                      </SheetTitle>
                    </SheetHeader>
                    <div className="overflow-y-auto h-full pb-32 p-6">
                      <FilterContent
                        selectedFilters={selectedFilters}
                        handleFilterChange={handleFilterChange}
                        roomTypes={roomTypes}
                        priceRanges={priceRanges}
                        sharingOptions={sharingOptions}
                        amenitiesList={amenitiesList}
                        setSelectedFilters={setSelectedFilters}
                      />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              <div className="flex-1 lg:flex-none">
                <select
                  className="w-full md:w-auto h-12 border border-gray-100 rounded-xl px-4 py-2 bg-gray-50/50 focus:bg-white text-sm font-medium outline-none transition-all"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option value="relevance">Relevance</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating-high">Rating: High to Low</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar (Desktop) */}
          <aside className={cn(
            "w-80 shrink-0 hidden lg:block transition-all duration-300",
            showFilters ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10 pointer-events-none w-0 -mr-8"
          )}>
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24 border border-gray-100">
              <FilterContent
                selectedFilters={selectedFilters}
                handleFilterChange={handleFilterChange}
                roomTypes={roomTypes}
                priceRanges={priceRanges}
                sharingOptions={sharingOptions}
                amenitiesList={amenitiesList}
                setSelectedFilters={setSelectedFilters}
              />
            </div>
          </aside>

          {/* RESULTS */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-2">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                {filteredRooms.length} Rooms <span className="text-gray-400 font-normal">Found</span>
              </h2>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-500">Loading properties...</p>
              </div>
            ) : filteredRooms.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500 text-lg">No rooms found matching your criteria.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredRooms.map((room) => (
                  <Card key={room.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="md:flex">
                      <div className="md:w-1/3 relative min-h-[250px]">
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
                          {room.sharing && (
                            <Badge variant="outline" className="flex items-center gap-1"><Users className="w-3 h-3" />{room.sharing}</Badge>
                          )}
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="ml-1 text-sm font-medium">{room.rating}</span>
                            <span className="ml-1 text-sm text-gray-500">({room.reviews})</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-4 text-[13px] bg-gray-50/50 p-3 rounded-xl">
                          <div className="flex items-center gap-2"><Bed className="w-4 h-4 text-blue-500/70" /><span>{room.details?.bhk || "—"}</span></div>
                          <div className="flex items-center gap-2"><Square className="w-4 h-4 text-orange-500/70" /><span>{pluralize(room.details?.doors || 0, 'Door')}</span></div>
                          <div className="flex items-center gap-2"><Wind className="w-4 h-4 text-cyan-500/70" /><span>{pluralize(room.details?.windows || 0, 'Window')}</span></div>
                          <div className="flex items-center gap-2"><Droplets className="w-4 h-4 text-blue-400" /><span>{room.details?.waterSystem || "—"}</span></div>
                          <div className="flex items-center gap-2"><Zap className="w-4 h-4 text-yellow-500/70" /><span>{room.details?.electricity || "—"}</span></div>
                          <div className="flex items-center gap-2"><Car className="w-4 h-4 text-emerald-500/70" /><span>{room.details?.parking || "—"}</span></div>
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------
// HOISTED FILTER CONTENT COMPONENT
// ----------------------------------------
function FilterContent({
  selectedFilters,
  handleFilterChange,
  roomTypes,
  priceRanges,
  sharingOptions,
  amenitiesList,
  setSelectedFilters,
}: any) {
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-900">Filters</h3>
        <Button
          variant="ghost"
          size="sm"
          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-semibold h-8 px-2"
          onClick={() => setSelectedFilters({
            roomType: [], priceRange: "", sharing: [], amenities: [], location: ""
          })}
        >
          Reset
        </Button>
      </div>

      <div className="space-y-8">
        {/* ROOM TYPE */}
        <div>
          <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Room Type</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
            {roomTypes.map((type: string) => (
              <label key={type} className="flex items-center gap-3 group cursor-pointer">
                <div className="relative flex items-center">
                  <Checkbox
                    id={`room-${type}`}
                    checked={selectedFilters.roomType.includes(type)}
                    onCheckedChange={(checked) => handleFilterChange("roomType", type, checked)}
                    className="border-gray-200 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                  />
                </div>
                <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* PRICE RANGE */}
        <div>
          <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Price Range</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
            {priceRanges.map((range: any) => (
              <label key={range.value} className="flex items-center gap-3 group cursor-pointer">
                <Checkbox
                  id={`price-${range.value}`}
                  checked={selectedFilters.priceRange === range.value}
                  onCheckedChange={(checked) => handleFilterChange("priceRange", range.value, checked)}
                  className="rounded-full border-gray-200 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                />
                <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">{range.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* SHARING */}
        <div>
          <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Sharing</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
            {sharingOptions.map((option: string) => (
              <label key={option} className="flex items-center gap-3 group cursor-pointer">
                <Checkbox
                  id={`sharing-${option}`}
                  checked={selectedFilters.sharing.includes(option)}
                  onCheckedChange={(checked) => handleFilterChange("sharing", option, checked)}
                  className="border-gray-200 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                />
                <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* AMENITIES */}
        <div>
          <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Amenities</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
            {amenitiesList.map((amenity: string) => (
              <label key={amenity} className="flex items-center gap-3 group cursor-pointer">
                <Checkbox
                  id={`amenity-${amenity}`}
                  checked={selectedFilters.amenities.includes(amenity)}
                  onCheckedChange={(checked) => handleFilterChange("amenities", amenity, checked)}
                  className="border-gray-200 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                />
                <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">{amenity}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
