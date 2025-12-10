// app/api/properties/route.ts

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

// ---------- helpers ----------
const pick = (body: any, ...preferKeys: string[]) => {
  for (const k of preferKeys) {
    if (body[k] !== undefined) return body[k];
  }
  return undefined;
};

const toNumber = (v: any) => {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

// -----------------------------------------
// ✅ GET: Fetch ONLY Top 6 Newest + High Rated (SAFE VERSION)
// -----------------------------------------
export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // ✅ First priority: newest
    // ✅ Second priority: rating (but allow NULL safely)
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .order("created_at", { ascending: false })   // ✅ Always works
      .order("rating", { ascending: false })       // ✅ Optional priority
      .limit(6);                                   // ✅ Only 6 items

    if (error) {
      console.error("Homepage fetch error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const cleaned = (data ?? []).map((p: any) => ({
      id: p.id,
      title: p.title ?? "",
      price: p.price ?? p.monthly_rent ?? "",
      location: p.full_address ?? p.city ?? "",
      type: p.bhk ? `${p.bhk}BHK` : "Room",
      sharing: Array.isArray(p.preferred_tenants)
        ? p.preferred_tenants.join(", ")
        : "",
      owner: p.owner_name ?? "",
      rating: p.rating ?? 4.5,          // ✅ Safe fallback rating
      reviews: p.reviews ?? 0,
      features: [
        ...(p.amenities || []),
        ...(p.furniture || []),
      ],
      images: Array.isArray(p.images)
        ? p.images
        : p.images
        ? [p.images]
        : [],
      verified: true,
      property_id: p.id,
    }));

    return NextResponse.json({ properties: cleaned });

  } catch (err: any) {
    console.error("Homepage unexpected error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// -----------------------------------------
// ✅ POST: Insert new property (AUTH SAFE)
// -----------------------------------------
export async function POST(req: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const body = await req.json();

    // ✅ AUTH READS REAL SESSION
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const payload: any = {
      title: pick(body, "title"),
      description: pick(body, "description"),
      property_type: pick(body, "propertyType", "property_type"),

      state: pick(body, "state"),
      district: pick(body, "district"),
      city: pick(body, "city"),
      area: pick(body, "area"),
      full_address: pick(body, "fullAddress", "full_address"),
      pincode: pick(body, "pincode"),

      bhk: pick(body, "bhk"),
      doors: toNumber(pick(body, "doors")),
      windows: toNumber(pick(body, "windows")),
      flooring: pick(body, "flooring"),
      balcony: !!pick(body, "balcony"),
      roof_access: !!pick(body, "roofAccess", "roof_access"),

      water_system: pick(body, "waterSystem", "water_system"),
      electricity: pick(body, "electricity"),
      parking: pick(body, "parking"),

      monthly_rent: toNumber(pick(body, "monthlyRent", "monthly_rent")),
      security_deposit: toNumber(
        pick(body, "securityDeposit", "security_deposit")
      ),

      amenities: pick(body, "amenities") ?? [],
      furniture: pick(body, "furniture") ?? [],

      kitchen_type: pick(body, "kitchenType", "kitchen_type"),
      maushi_available: !!pick(body, "maushiAvailable", "maushi_available"),
      maushi_cost: toNumber(pick(body, "maushiCost", "maushi_cost")),

      images: pick(body, "images") ?? [],

      owner_name: pick(body, "ownerName", "owner_name"),
      phone: pick(body, "phone"),
      alternate_phone: pick(body, "alternatePhone", "alternate_phone"),

      preferred_tenants: pick(body, "preferredTenants") ?? [],
      rules: pick(body, "rules") ?? [],

      // ✅ SECURE OWNER LINK
      owner_id: user.id,

      price: toNumber(pick(body, "monthlyRent")),
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("properties")
      .insert([payload])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, property: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
