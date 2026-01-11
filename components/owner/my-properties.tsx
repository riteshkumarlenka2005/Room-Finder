"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import Image from "next/image";
import { resolveImageUrl } from "@/utils/image-utils";

import {
  Search,
  Filter,
  MoreVertical,
  MapPin,
  Bed,
  Bath,
  Square,
  Eye,
  Edit,
  Trash2,
  Grid3X3,
  List,
  CheckCircle,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function MyProperties() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [filter, setFilter] = useState("all");
  const [properties, setProperties] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchOwnerProperties();
  }, []);

  // --------------------------------------------------
  // FETCH OWNER PROPERTIES
  // --------------------------------------------------
  async function fetchOwnerProperties() {
    setLoading(true);

    try {
      // 1) Logged-in user
      const { data: authData } = await supabase.auth.getUser();
      const user = authData?.user ?? null;

      if (!user) {
        setProperties([]);
        return;
      }

      let rows: any[] = [];

      // 2) Fetch using owner_id (correct way)
      const { data: ownerRows, error: ownerErr } = await supabase
        .from("properties")
        .select("*")
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false });

      if (!ownerErr && ownerRows?.length > 0) {
        rows = ownerRows;
      }

      // 3) If no rows, try owner_name fallback
      if (rows.length === 0) {
        const { data: profile } = await supabase
          .from("users")
          .select("full_name, name")
          .eq("id", user.id)
          .single();

        const ownerName = (profile?.full_name || profile?.name || "").trim();

        if (ownerName.length > 0) {
          const { data: nameRows } = await supabase
            .from("properties")
            .select("*")
            .ilike("owner_name", `%${ownerName}%`)
            .order("created_at", { ascending: false });

          if (nameRows && nameRows.length > 0) {

            rows = nameRows;
          }
        }
      }

      // 4) Normalize for UI
      const normalized = (rows || []).map((p: any) => ({
        id: p.id,
        title: p.title,
        location:
          p.full_address ??
          `${p.city ?? ""}${p.city && p.district ? ", " : ""}${p.district ?? ""}`,
        rent: p.monthly_rent ?? p.price ?? 0,
        deposit: p.security_deposit ?? 0,
        bedrooms: p.bhk ?? 0,
        bathrooms: p.doors ?? 0,
        area: p.area ?? "",
        views: p.views ?? 0,
        status: p.status ?? "available", // REAL STATUS
        verified: p.verified ?? true,
        image: resolveImageUrl(
          p.room_image_url ||
          (Array.isArray(p.images) && p.images[0]) ||
          p.image ||
          null
        ),
      }));

      setProperties(normalized);
    } catch (e) {
      console.error("Error loading properties:", e);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }

  // --------------------------------------------------
  // FILTERING + SEARCH
  // --------------------------------------------------
  const filteredProperties = properties.filter((p) => {
    if (filter !== "all" && p.status !== filter) return false;

    if (!searchTerm) return true;

    const s = searchTerm.toLowerCase();
    return (
      p.title.toLowerCase().includes(s) ||
      p.location.toLowerCase().includes(s)
    );
  });

  // --------------------------------------------------
  // LOADING UI
  // --------------------------------------------------
  if (loading) {
    return (
      <div className="min-h-48 flex items-center justify-center py-20">
        <div className="text-muted-foreground">Loading properties...</div>
      </div>
    );
  }

  // --------------------------------------------------
  // NO PROPERTIES UI
  // --------------------------------------------------
  if (!loading && properties.length === 0) {
    return (
      <div className="space-y-4">
        <p className="text-muted-foreground">
          No properties found linked to your owner account.
        </p>
        <Link href="/list-property">
          <Button className="bg-blue-600 text-white">Add Property</Button>
        </Link>
      </div>
    );
  }

  // --------------------------------------------------
  // MAIN UI
  // --------------------------------------------------
  return (
    <div className="space-y-6">
      {/* SEARCH & FILTERS */}
      <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex flex-1 gap-3">
            <div className="relative flex-1 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
              <Input
                placeholder="Search properties..."
                className="pl-10 h-12 bg-gray-50/50 border-gray-100 rounded-xl focus:bg-white transition-all focus:ring-2 focus:ring-blue-100"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-12 px-6 rounded-xl border-gray-100 hover:bg-gray-50 gap-2 font-bold text-gray-700">
                  <Filter className="h-4 w-4" />
                  <span className="hidden sm:inline">Filter</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-xl p-2 border-gray-100 shadow-xl">
                <DropdownMenuItem onClick={() => setFilter("all")} className="rounded-lg font-medium">
                  All Properties
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("available")} className="rounded-lg font-medium text-green-600">
                  Available
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("occupied")} className="rounded-lg font-medium text-blue-600">
                  Occupied
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("maintenance")} className="rounded-lg font-medium text-orange-600">
                  Maintenance
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex gap-3 justify-between sm:justify-end">
            <Tabs value={view} onValueChange={(v) => setView(v as any)} className="bg-gray-50/80 p-1 rounded-xl border border-gray-100">
              <TabsList className="h-10 bg-transparent gap-1">
                <TabsTrigger value="grid" className="px-4 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <Grid3X3 className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="list" className="px-4 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <List className="h-4 w-4" />
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>

      {/* STATS OVERVIEW */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <Card className="border-0 shadow-sm rounded-2xl bg-white border border-gray-50">
          <CardContent className="p-6">
            <div className="text-2xl font-black text-gray-900">{properties.length}</div>
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Total Properties</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm rounded-2xl bg-white border border-gray-50">
          <CardContent className="p-6">
            <div className="text-2xl font-black text-green-600">
              {properties.filter((p) => p.status === "available").length}
            </div>
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Available Units</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm rounded-2xl bg-white border border-gray-50">
          <CardContent className="p-6">
            <div className="text-2xl font-black text-blue-600">
              {properties.filter((p) => p.status === "occupied").length}
            </div>
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Occupied Units</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm rounded-2xl bg-white border border-gray-50">
          <CardContent className="p-6">
            <div className="text-2xl font-black text-orange-600">
              {properties.filter((p) => p.status === "maintenance").length}
            </div>
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">In Maintenance</div>
          </CardContent>
        </Card>
      </div>

      {/* GRID / LIST VIEW */}
      {view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <Card
              key={property.id}
              className="border border-gray-100 shadow-sm rounded-2xl overflow-hidden group hover:shadow-xl transition-all duration-300"
            >
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={property.image}
                  alt={property.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  unoptimized
                />
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
                <Badge
                  className={`absolute top-4 left-4 border-none px-3 py-1 font-bold text-[10px] uppercase tracking-wider ${property.status === "available"
                    ? "bg-green-500 hover:bg-green-600 shadow-lg shadow-green-200"
                    : property.status === "occupied"
                      ? "bg-blue-500 hover:bg-blue-600 shadow-lg shadow-blue-200"
                      : "bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-200"
                    } text-white`}
                >
                  {property.status}
                </Badge>
                {property.verified && (
                  <Badge className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-blue-600 hover:bg-white border-none px-2 py-1 font-bold">
                    <CheckCircle className="h-3 w-3 mr-1" /> Verified
                  </Badge>
                )}
              </div>

              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="min-w-0">
                    <h3 className="font-bold text-lg text-gray-900 truncate leading-tight mb-1">{property.title}</h3>
                    <div className="flex items-center text-gray-400 group-hover:text-blue-500 transition-colors">
                      <MapPin className="h-3.5 w-3.5 mr-1 shrink-0" />
                      <p className="text-xs font-medium truncate">{property.location}</p>
                    </div>
                  </div>

                  <div className="shrink-0 ml-4">
                    <PropertyActions />
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-bold text-gray-500 mb-6 bg-gray-50/80 px-4 py-2.5 rounded-xl border border-gray-100">
                  <span className="flex items-center gap-1.5">
                    <Bed className="h-3.5 w-3.5 text-blue-500" /> {property.bedrooms} BHK
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Bath className="h-3.5 w-3.5 text-blue-500" /> {property.bathrooms} Bath
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Square className="h-3.5 w-3.5 text-blue-500" /> {property.area}
                  </span>
                </div>

                <div className="flex justify-between items-end">
                  <div className="space-y-0.5">
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Monthly Rent</div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-black text-blue-600 leading-none">₹{property.rent}</span>
                    </div>
                    {property.deposit > 0 && (
                      <div className="text-[10px] font-bold text-gray-400">Deposit: ₹{property.deposit}</div>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 text-gray-400 font-bold text-[11px]">
                    <Eye className="h-3.5 w-3.5" />
                    {property.views} <span className="uppercase tracking-widest font-black opacity-50">views</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProperties.map((property) => (
            <Card key={property.id} className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative w-full sm:w-48 h-32 flex-shrink-0">
                    <Image
                      src={property.image}
                      alt={property.title}
                      fill
                      className="object-cover rounded-lg"
                      unoptimized
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">
                            {property.title}
                          </h3>
                          <Badge
                            className={`${property.status === "available"
                              ? "bg-green-100 text-green-700"
                              : property.status === "occupied"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-orange-100 text-orange-700"
                              }`}
                          >
                            {property.status}
                          </Badge>
                        </div>

                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3" />
                          {property.location}
                        </p>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="gap-2">
                            <Eye className="h-4 w-4" /> View
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            <Edit className="h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 text-red-600">
                            <Trash2 className="h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                      <span className="flex items-center gap-1">
                        <Bed className="h-4 w-4" /> {property.bedrooms} Bed
                      </span>
                      <span className="flex items-center gap-1">
                        <Bath className="h-4 w-4" /> {property.bathrooms} Bath
                      </span>
                      <span className="flex items-center gap-1">
                        <Square className="h-4 w-4" /> {property.area}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" /> {property.views} views
                      </span>
                    </div>

                    <div className="flex justify-between items-center mt-3">
                      <div className="flex items-center gap-4">
                        <p className="text-lg font-bold text-blue-600">
                          ₹{property.rent}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Deposit: ₹{property.deposit}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// --------------------------------------------------
// HOISTED PROPERTY ACTIONS
// --------------------------------------------------
function PropertyActions() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100">
          <MoreVertical className="h-5 w-5 text-gray-500" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 rounded-xl p-2 border-gray-100 shadow-xl">
        <DropdownMenuItem className="gap-2 rounded-lg py-2.5 font-medium">
          <Eye className="h-4 w-4 text-gray-400" /> View Live
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2 rounded-lg py-2.5 font-medium">
          <Edit className="h-4 w-4 text-gray-400" /> Edit Details
        </DropdownMenuItem>
        <Separator className="my-1 opacity-50" />
        <DropdownMenuItem className="gap-2 rounded-lg py-2.5 font-medium text-red-600 hover:text-red-700 hover:bg-red-50">
          <Trash2 className="h-4 w-4" /> Delete Listing
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
