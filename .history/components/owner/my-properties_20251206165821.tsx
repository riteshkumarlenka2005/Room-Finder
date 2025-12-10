"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchOwnerProperties() {
    setLoading(true);

    try {
      // 1) get currently logged-in user
      const { data: authData, error: authErr } = await supabase.auth.getUser();
      if (authErr) {
        console.error("supabase.auth.getUser error:", authErr);
      }
      const user = authData?.user ?? null;
      console.log("[MyProperties] user:", user?.id ?? null);

      // Helper: normalize rows to UI
      const normalize = (rows: any[]) =>
        (rows || []).map((p: any) => ({
          id: p.id,
          title: p.title ?? p.name ?? "Untitled",
          location: p.full_address ?? `${p.city ?? ""}${p.city && p.district ? ", " : ""}${p.district ?? ""}`.trim(),
          rent: p.monthly_rent ?? p.price ?? p.rent ?? 0,
          deposit: p.security_deposit ?? p.deposit ?? 0,
          bedrooms: p.bhk ?? p.bedrooms ?? 0,
          bathrooms: p.doors ?? p.bathrooms ?? 0,
          area: p.area ?? p.sqft ?? p.size ?? "",
          views: p.views ?? 0,
          status: "available", // fallback — DB has no status column
          verified: p.verified ?? true,
          image: p.room_image_url ?? (Array.isArray(p.images) && p.images[0]) ?? p.image ?? "/placeholder.svg",
          raw: p, // keep raw row for debugging if needed
        }));

      // 2) Try by owner_id (preferred)
      let rows: any[] = [];
      if (user?.id) {
        const { data, error } = await supabase
          .from("properties")
          .select("*")
          .eq("owner_id", user.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("[MyProperties] error fetching by owner_id:", error);
        } else {
          rows = data ?? [];
        }
      }

      // 3) If nothing, try to resolve owner name from users table and fetch by owner_name
      if ((!rows || rows.length === 0) && user?.id) {
        try {
          const { data: profile, error: profileErr } = await supabase
            .from("users")
            .select("full_name, name, phone")
            .eq("id", user.id)
            .single();

          if (profileErr) {
            console.warn("[MyProperties] could not fetch profile:", profileErr);
          } else {
            const ownerName = (profile?.full_name ?? profile?.name ?? "").trim();
            console.log("[MyProperties] profile ownerName:", ownerName);

            if (ownerName) {
              // use ilike for case-insensitive partial match
              const { data: byName, error: byNameErr } = await supabase
                .from("properties")
                .select("*")
                .ilike("owner_name", `%${ownerName}%`)
                .order("created_at", { ascending: false });

              if (byNameErr) {
                console.error("[MyProperties] error fetching by owner_name:", byNameErr);
              } else {
                rows = byName ?? [];
              }
            }
          }
        } catch (e) {
          console.error("[MyProperties] profile lookup exception:", e);
        }
      }

      // 4) Last resort for debugging: fetch small sample (DO NOT keep this permanently if security matters)
      if (!rows || rows.length === 0) {
        console.warn("[MyProperties] No rows found with owner_id/owner_name. Fetching sample for debugging.");
        const { data: sample, error: sampleErr } = await supabase
          .from("properties")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(20);

        if (sampleErr) {
          console.error("[MyProperties] sample fetch error:", sampleErr);
        } else {
          console.log("[MyProperties] sample rows (first 6):", (sample ?? []).slice(0, 6));
          // we do not automatically show all properties to owner in this fallback; keep list empty so it's clear.
          // If you want to see them in UI for debugging, uncomment the next line:
          // rows = sample ?? [];
        }
      }

      const normalized = normalize(rows || []);
      setProperties(normalized);
      console.log("[MyProperties] properties loaded:", normalized.length);
    } catch (e) {
      console.error("[MyProperties] unexpected error:", e);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }

  // Filtering + search (UI unchanged)
  const filteredProperties = properties.filter((p) => {
    if (filter === "all") {
      // search only
    } else {
      if (p.status !== filter) return false;
    }
    if (!searchTerm) return true;
    const s = searchTerm.toLowerCase();
    return (
      String(p.title ?? "").toLowerCase().includes(s) ||
      String(p.location ?? "").toLowerCase().includes(s)
    );
  });

  if (loading) {
    return (
      <div className="min-h-48 flex items-center justify-center py-20">
        <div className="text-muted-foreground">Loading properties...</div>
      </div>
    );
  }

  // If zero but not loading — helpful message with troubleshooting tips
  if (!loading && properties.length === 0) {
    return (
      <div className="space-y-4">
        <div className="text-muted-foreground">
          <p>No properties found for your account.</p>
          <ul className="list-disc pl-5 mt-2 text-sm text-muted-foreground">
            <li>Make sure you're logged in with the owner account that uploaded properties.</li>
            <li>Check `owner_id` on your `properties` rows — it should match your auth user id.</li>
            <li>If properties use `owner_name`, ensure your profile `users.full_name` matches `properties.owner_name`.</li>
            <li>Check Supabase Row Level Security (RLS) - temporarily disable to verify results.</li>
          </ul>
        </div>

        <div className="pt-4">
          <Link href="/list-property">
            <Button className="bg-blue-600 text-white hover:bg-blue-700">Add Property</Button>
          </Link>
        </div>
      </div>
    );
  }

  // UI below is intentionally the same layout as your previous layout (no visual redesign)
  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-1 gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search properties..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 bg-transparent">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFilter("all")}>All Properties</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("available")}>Available</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("occupied")}>Occupied</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("maintenance")}>Maintenance</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex gap-3">
          <Tabs value={view} onValueChange={(v) => setView(v as any)}>
            <TabsList className="h-10">
              <TabsTrigger value="grid" className="px-3">
                <Grid3X3 className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="list" className="px-3">
                <List className="h-4 w-4" />
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Link href="/list-property">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">Add Property</Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-2xl font-bold">{properties.length}</p>
            <p className="text-sm text-muted-foreground">Total Properties</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-green-600">{properties.filter(p => p.status === "available").length}</p>
            <p className="text-sm text-muted-foreground">Available</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-blue-600">{properties.filter(p => p.status === "occupied").length}</p>
            <p className="text-sm text-muted-foreground">Occupied</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-orange-600">{properties.filter(p => p.status === "maintenance").length}</p>
            <p className="text-sm text-muted-foreground">Maintenance</p>
          </CardContent>
        </Card>
      </div>

      {/* Properties Grid/List */}
      {view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <Card key={property.id} className="border-0 shadow-sm overflow-hidden group">
              <div className="relative">
                <img src={property.image || "/placeholder.svg"} alt={property.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
                <Badge className={`absolute top-3 left-3 ${property.status === "available" ? "bg-green-500" : property.status === "occupied" ? "bg-blue-500" : "bg-orange-500"} text-white`}>
                  {property.status}
                </Badge>
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">{property.title}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" />{property.location}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="gap-2"><Eye className="h-4 w-4" /> View</DropdownMenuItem>
                      <DropdownMenuItem className="gap-2"><Edit className="h-4 w-4" /> Edit</DropdownMenuItem>
                      <DropdownMenuItem className="gap-2 text-red-600"><Trash2 className="h-4 w-4" /> Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <span className="flex items-center gap-1"><Bed className="h-4 w-4" /> {property.bedrooms}</span>
                  <span className="flex items-center gap-1"><Bath className="h-4 w-4" /> {property.bathrooms}</span>
                  <span className="flex items-center gap-1"><Square className="h-4 w-4" /> {property.area}</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t">
                  <div>
                    <p className="text-lg font-bold text-blue-600">₹{property.rent}</p>
                    <p className="text-xs text-muted-foreground">Deposit: ₹{property.deposit}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm flex items-center gap-1 text-muted-foreground"><Eye className="h-4 w-4" /> {property.views} views</p>
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
                  <img src={property.image || "/placeholder.svg"} alt={property.title} className="w-full sm:w-48 h-32 object-cover rounded-lg" />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">{property.title}</h3>
                          <Badge className={`${property.status === "available" ? "bg-green-100 text-green-700" : property.status === "occupied" ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"}`}>{property.status}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1"><MapPin className="h-3 w-3" />{property.location}</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="gap-2"><Eye className="h-4 w-4" /> View</DropdownMenuItem>
                          <DropdownMenuItem className="gap-2"><Edit className="h-4 w-4" /> Edit</DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 text-red-600"><Trash2 className="h-4 w-4" /> Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                      <span className="flex items-center gap-1"><Bed className="h-4 w-4" /> {property.bedrooms} Bed</span>
                      <span className="flex items-center gap-1"><Bath className="h-4 w-4" /> {property.bathrooms} Bath</span>
                      <span className="flex items-center gap-1"><Square className="h-4 w-4" /> {property.area}</span>
                      <span className="flex items-center gap-1"><Eye className="h-4 w-4" /> {property.views} views</span>
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <div className="flex items-center gap-4">
                        <p className="text-lg font-bold text-blue-600">₹{property.rent}</p>
                        <p className="text-sm text-muted-foreground">Deposit: ₹{property.deposit}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">Edit</Button>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">View Details</Button>
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
