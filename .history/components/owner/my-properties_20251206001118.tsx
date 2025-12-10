"use client";

import { useState, useEffect } from "react";
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
  const [loading, setLoading] = useState(true);

  // 🟦 Fetch owner properties
  const fetchProperties = async () => {
    setLoading(true);

    // 1️⃣ Get logged-in user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.log("No user logged in");
      setLoading(false);
      return;
    }

    // 2️⃣ Fetch rooms where owner_id matches logged-in user id
    const { data, error } = await supabase
      .from("rooms")
      .select("*")
      .eq("owner_id", user.id);

    if (error) {
      console.log("Error fetching properties:", error);
    } else {
      setProperties(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const filteredProperties = properties.filter((p) => {
    if (filter === "all") return true;
    return p.status === filter;
  });

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-1 gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search properties..." className="pl-10" />
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
              <TabsTrigger value="grid">
                <Grid3X3 className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="list">
                <List className="h-4 w-4" />
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
            <Link href="/list-property">Add Property</Link>
          </Button>
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
              {properties.filter((p) => p.status === "available").length}
            </p>
            <p className="text-sm text-muted-foreground">Available</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-blue-600">
              {properties.filter((p) => p.status === "occupied").length}
            </p>
            <p className="text-sm text-muted-foreground">Occupied</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-orange-600">
              {properties.filter((p) => p.status === "maintenance").length}
            </p>
            <p className="text-sm text-muted-foreground">Maintenance</p>
          </CardContent>
        </Card>
      </div>

      {/* Loading state */}
      {loading && <p className="text-center mt-10 text-muted-foreground">Loading properties...</p>}

      {/* No properties */}
      {!loading && properties.length === 0 && (
        <p className="text-center mt-10 text-muted-foreground">
          No properties uploaded yet.
        </p>
      )}

      {/* Properties Grid */}
      {!loading && view === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProperties.map((p) => (
            <Card key={p.id} className="border-0 shadow-sm overflow-hidden group">
              <div className="relative">
                <img
                  src={p.image || "/placeholder.svg"}
                  className="w-full h-48 object-cover"
                />

                <Badge
                  className={`absolute top-3 left-3 ${
                    p.status === "available"
                      ? "bg-green-500"
                      : p.status === "occupied"
                      ? "bg-blue-500"
                      : "bg-orange-500"
                  } text-white`}
                >
                  {p.status}
                </Badge>
              </div>

              <CardContent className="p-4">
                <h3 className="font-semibold text-lg">{p.title}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {p.location}
                </p>

                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                  <span className="flex items-center gap-1">
                    <Bed className="h-4 w-4" /> {p.bedrooms}
                  </span>
                  <span className="flex items-center gap-1">
                    <Bath className="h-4 w-4" /> {p.bathrooms}
                  </span>
                  <span className="flex items-center gap-1">
                    <Square className="h-4 w-4" /> {p.area}
                  </span>
                </div>

                <div className="flex justify-between items-center mt-4 border-t pt-3">
                  <p className="text-lg font-bold text-blue-600">{p.rent}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Eye className="h-4 w-4" /> {p.views || 0} views
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
