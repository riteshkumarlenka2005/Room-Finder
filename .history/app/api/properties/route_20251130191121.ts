// app/api/properties/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Helper functions
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

const toBool = (v: any) => {
  if (v === true || v === "true" || v === 1 || v === "1") return true;
  if (v === false || v === "false" || v === 0 || v === "0") return false;
  return false;
};

// -----------------------------------------
// ✅ GET: Fetch all properties (for homepage)
// -----------------------------------------
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch properties" },
        { status: 500 }
      );
    }

    const cleaned = data.map((p) => ({
      ...p,
      images: Array.isArray(p.images)
        ? p.images
        : p.images
        ? [p.images]
        : [],

      // frontend expects price (string)
      price: p.price ?? p.monthly_rent ?? 0,

      // frontend needs location
      location: p.full_address ?? p.city ?? p.state ?? "",

      // frontend needs owner
      owner: p.owner_name ?? "",

      // frontend needs type (bhk)
      type: p.bhk ? `${p.bhk}BHK` : "Room",

      // frontend needs sharing info
      sharing: p.preferred_tenants?.join(", ") ?? "—",

      // features (amenities + furniture)
      features: [
        ...(p.amenities || []),
        ...(p.furniture || []),
      ],

      // fallback rating
      rating: p.rating ?? 4.5,
      reviews: p.reviews ?? 0,
    }));

    return NextResponse.json({ properties: cleaned });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


// -----------------------------------------
// ✅ POST: Insert new property
// -----------------------------------------
export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("/api/properties POST body:", JSON.stringify(body));

    const title = pick(body, "title");
    const ownerName = pick(body, "ownerName", "owner_name");
    const monthlyRent = pick(body, "monthlyRent", "monthly_rent");

    if (!title || !ownerName || !monthlyRent) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const payload: any = {
      title,
      description: pick(body, "description") ?? null,
      property_type: pick(body, "propertyType") ?? null,
      state: pick(body, "state") ?? null,
      district: pick(body, "district") ?? null,
      city: pick(body, "city") ?? null,
      area: pick(body, "area") ?? null,
      full_address: pick(body, "fullAddress") ?? null,
      pincode: pick(body, "pincode") ?? null,
      bhk: pick(body, "bhk") ?? null,
      doors: toNumber(pick(body, "doors")),
      windows: toNumber(pick(body, "windows")),
      flooring: pick(body, "flooring") ?? null,
      balcony: toBool(pick(body, "balcony")),
      roof_access: toBool(pick(body, "roofAccess")),
      water_system: pick(body, "waterSystem") ?? null,
      electricity: pick(body, "electricity") ?? null,
      parking: pick(body, "parking") ?? null,
      monthly_rent: toNumber(monthlyRent),
      security_deposit: toNumber(pick(body, "securityDeposit")),
      amenities: pick(body, "amenities") || [],
      furniture: pick(body, "furniture") || [],
      kitchen_type: pick(body, "kitchenType") ?? null,
      maushi_available: toBool(pick(body, "maushiAvailable")),
      maushi_cost: toNumber(pick(body, "maushiCost")),
      images: pick(body, "images") || [],
      owner_name: ownerName,
      phone: pick(body, "phone") ?? null,
      alternate_phone: pick(body, "alternatePhone") ?? null,
      preferred_tenants: pick(body, "preferredTenants") || [],
      rules: pick(body, "rules") || [],
      owner_id: pick(body, "ownerId") ?? null,
      price: toNumber(monthlyRent),
      room_image_url:
        Array.isArray(pick(body, "images")) &&
        pick(body, "images").length > 0
          ? pick(body, "images")[0]
          : null,
      created_at: new Date().toISOString(),
    };

    Object.keys(payload).forEach((k) => {
      if (payload[k] === undefined) delete payload[k];
    });

    const { data, error } = await supabase
      .from("properties")
      .insert([payload])
      .select();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      property: data?.[0] ?? null,
    });
  } catch (err: any) {
    console.error("POST /properties error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
