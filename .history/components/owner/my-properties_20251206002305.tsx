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

// ----------------------------------------------
// MAIN COMPONENT
// ----------------------------------------------
export default function MyProperties() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [filter, setFilter] = useState("all");
  const [properties, setProperties] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // FETCH OWNER PROPERTIES
  useEffect(() => {
    fetchOwnerProperties();
  }, []);

  const fetchOwnerProperties = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching properties:", error);
      return;
    }

    // Normalize Supabase → UI fields
    const normalized = (data || []).map((p) => ({
      id: p.id,
      title: p.title,
      location: p.full_address || `${p.city}, ${p.district}`,
      rent: p.monthly_rent,
      deposit: p.security_deposit,
      bedrooms: p.bhk,
      bathrooms: p.doors,
      area: p.area,
      views: p.views ?? 0,
      status: "available", // default because DB has no status column
      verified: true, // you can change later
      image: p.room_image_url,
    }));

    setProperties(normalized);
  };

  // FILTER + SEARCH
  const filtered = properties.filter((p) => {
    const matchesFilter = filter === "all" || p.status === filter;
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.location.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  // ---------------------------------------
  // EMPTY STATE (No Properties Found)
  // ---------------------------------------
  if (properties.length === 0) {
    return (
      <div className="text-center mt-20 text-muted-foreground">
        <p>No property uploaded yet.</p>
        <Link href="/list-property">
          <Button className="mt-4 bg-blue-600 text-white hover:bg-blue-700">
            Upload Your First Property
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* HEADER ACTIONS */}
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
              <TabsTrigger value="grid">
                <Grid3X3 className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="list">
                <List className="h-4 w-4" />
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Link href="/list-property">
            <Button className="bg-blue-600 text-white hover:bg-blue-700">
              Add Property
            </Button>
          </Link>
        </div>
      </div>

      {/* GRID VIEW */}
      {view === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((property) => (
            <Card key={property.id} className="border-0 shadow-sm overflow-hidden group">
              <div className="relative">
                <img
                  src={property.image || "/placeholder.svg"}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Badge className="absolute top-3 left-3 bg-green-500 text-white">
                  {property.status}
                </Badge>
              </div>

              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">{property.title}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
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
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4" /> View
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <span className="flex items-center gap-1">
                    <Bed className="h-4 w-4" /> {property.bedrooms}
                  </span>
                  <span className="flex items-center gap-1">
                    <Bath className="h-4 w-4" /> {property.bathrooms}
                  </span>
                  <span className="flex items-center gap-1">
                    <Square className="h-4 w-4" /> {property.area}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-3 border-t">
                  <div>
                    <p className="text-lg font-bold text-blue-600">₹{property.rent}</p>
                    <p className="text-xs text-muted-foreground">Deposit: ₹{property.deposit}</p>
                  </div>

                  <p className="text-sm flex items-center gap-1 text-muted-foreground">
                    <Eye className="h-4 w-4" /> {property.views} views
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* LIST VIEW */}
      {view === "list" && (
        <div className="space-y-4">
          {filtered.map((property) => (
            <Card key={property.id} className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <img
                    src={property.image || "/placeholder.svg"}
                    className="w-full sm:w-48 h-32 object-cover rounded-lg"
                  />

                  <div className="flex-1">
                    <div className="flex justify-between items-start">

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">{property.title}</h3>
                          <Badge className="bg-green-100 text-green-700">
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
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4" /> View
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                      <span className="flex items-center gap-1">
                        <Bed className="h-4 w-4" />
                        {property.bedrooms} Bed
                      </span>

                      <span className="flex items-center gap-1">
                        <Bath className="h-4 w-4" />
                        {property.bathrooms} Bath
                      </span>

                      <span className="flex items-center gap-1">
                        <Square className="h-4 w-4" />
                        {property.area}
                      </span>

                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {property.views} views
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
                        <Button size="sm" className="bg-blue-600 text-white hover:bg-blue-700">
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
