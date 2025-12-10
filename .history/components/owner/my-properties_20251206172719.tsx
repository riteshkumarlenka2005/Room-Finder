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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProperties();
  }, []);

  async function loadProperties() {
    setLoading(true);

    try {
      // 1️⃣ Get logged-in user
      const { data: auth, error: authErr } = await supabase.auth.getUser();

      if (authErr || !auth?.user) {
        console.error("Auth error:", authErr);
        setProperties([]);
        return;
      }

      const userId = auth.user.id;

      // 2️⃣ Fetch ONLY properties owned by this user
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("owner_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Fetch error:", error);
        setProperties([]);
        return;
      }

      // 3️⃣ Normalize UI structure
      const normalized = (data || []).map((p: any) => ({
        id: p.id,
        title: p.title ?? "Untitled",
        location: p.full_address ?? p.city ?? "Unknown location",
        rent: p.monthly_rent ?? p.price ?? 0,
        deposit: p.security_deposit ?? 0,
        bedrooms: p.bhk ?? 0,
        bathrooms: p.doors ?? 0,
        area: p.area ?? "",
        views: p.views ?? 0,
        status: "available",
        verified: true,
        image:
          p.room_image_url ||
          (Array.isArray(p.images) ? p.images[0] : null) ||
          "/placeholder.svg",
      }));

      setProperties(normalized);
    } catch (e) {
      console.error("Unexpected error:", e);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }

  const filtered = properties.filter((p) => {
    if (filter !== "all" && p.status !== filter) return false;

    if (!searchTerm) return true;
    const s = searchTerm.toLowerCase();

    return (
      p.title.toLowerCase().includes(s) ||
      p.location.toLowerCase().includes(s)
    );
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 text-muted-foreground">
        Loading properties...
      </div>
    );
  }

  if (!loading && properties.length === 0) {
    return (
      <div className="space-y-3 text-muted-foreground">
        <p>No properties found for your account.</p>

        <Link href="/list-property">
          <Button className="bg-blue-600 text-white">Add Property</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-1 gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search properties..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 bg-transparent">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFilter("all")}>
                All Properties
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("available")}>
                Available
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("occupied")}>
                Occupied
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("maintenance")}>
                Maintenance
              </DropdownMenuItem>
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
            <Button className="bg-blue-600 text-white">Add Property</Button>
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
            <p className="text-2xl font-bold text-green-600">
              {properties.length}
            </p>
            <p className="text-sm text-muted-foreground">Available</p>
          </CardContent>
        </Card>
      </div>

      {/* GRID VIEW */}
      {view === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((p) => (
            <Card key={p.id} className="border-0 shadow-sm overflow-hidden">
              <div className="relative">
                <img
                  src={p.image}
                  className="w-full h-48 object-cover"
                  alt={p.title}
                />
                <Badge className="absolute top-3 left-3 bg-green-500 text-white">
                  {p.status}
                </Badge>
              </div>

              <CardContent className="p-4">
                <h3 className="font-semibold text-lg">{p.title}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {p.location}
                </p>

                <div className="flex justify-between items-center pt-3 border-t mt-3">
                  <div>
                    <p className="text-lg font-bold text-blue-600">
                      ₹{p.rent}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Deposit: ₹{p.deposit}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* LIST VIEW */}
      {view === "list" && (
        <div className="space-y-4">
          {filtered.map((p) => (
            <Card key={p.id} className="border-0 shadow-sm">
              <CardContent className="p-4 flex gap-4">
                <img
                  src={p.image}
                  className="w-48 h-32 object-cover rounded"
                  alt={p.title}
                />

                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{p.title}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {p.location}
                  </p>

                  <p className="text-blue-600 font-bold mt-2">₹{p.rent}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
