// app/api/properties/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

/**
 * Helper: read a value from body trying multiple key styles.
 * preferKeys order: ['fullAddress', 'full_address', 'fulladdress']
 */
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

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // quick debug log (useful while developing)
    console.log("/api/properties POST body:", JSON.stringify(body));

    // Basic required fields (try both naming styles)
    const title = pick(body, "title", "Title");
    const ownerName = pick(body, "ownerName", "owner_name", "ownername");
    const monthlyRent = pick(body, "monthlyRent", "monthly_rent", "rent");

    if (!title || !ownerName || !monthlyRent) {
      return NextResponse.json(
        { error: "Missing required fields: title, ownerName and monthlyRent are required" },
        { status: 400 }
      );
    }

    // Build payload mapping camelCase -> snake_case for DB
    const payload: any = {
      title: title,
      description: pick(body, "description", "desc") ?? null,
      property_type: pick(body, "propertyType", "property_type", "property") ?? null,
      state: pick(body, "state") ?? null,
      district: pick(body, "district") ?? null,
      city: pick(body, "city") ?? null,
      area: pick(body, "area") ?? null,
      full_address: pick(body, "fullAddress", "full_address", "address") ?? null,
      pincode: pick(body, "pincode", "pin", "postalCode") ?? null,
      bhk: pick(body, "bhk") ?? null,
      doors: toNumber(pick(body, "doors")),
      windows: toNumber(pick(body, "windows")),
      flooring: pick(body, "flooring") ?? null,
      balcony: toBool(pick(body, "balcony")),
      roof_access: toBool(pick(body, "roofAccess", "roof_access")),
      water_system: pick(body, "waterSystem", "water_system") ?? null,
      electricity: pick(body, "electricity") ?? null,
      parking: pick(body, "parking") ?? null,
      monthly_rent: toNumber(monthlyRent),
      security_deposit: toNumber(pick(body, "securityDeposit", "security_deposit")),
      amenities: Array.isArray(pick(body, "amenities")) ? pick(body, "amenities") : (pick(body, "amenities") ? [pick(body, "amenities")] : []),
      furniture: Array.isArray(pick(body, "furniture")) ? pick(body, "furniture") : (pick(body, "furniture") ? [pick(body, "furniture")] : []),
      kitchen_type: pick(body, "kitchenType", "kitchen_type") ?? null,
      maushi_available: toBool(pick(body, "maushiAvailable", "maushi_available")),
      maushi_cost: toNumber(pick(body, "maushiCost", "maushi_cost")),
      images: Array.isArray(pick(body, "images")) ? pick(body, "images") : (pick(body, "images") ? [pick(body, "images")] : []),
      owner_name: ownerName,
      phone: pick(body, "phone") ?? null,
      alternate_phone: pick(body, "alternatePhone", "alternate_phone") ?? null,
      preferred_tenants: Array.isArray(pick(body, "preferredTenants")) ? pick(body, "preferredTenants") : (pick(body, "preferredTenants") ? [pick(body, "preferredTenants")] : []),
      rules: Array.isArray(pick(body, "rules")) ? pick(body, "rules") : (pick(body, "rules") ? [pick(body, "rules")] : []),
      owner_id: pick(body, "ownerId", "owner_id") ?? null,
      price: toNumber(monthlyRent),
      room_image_url: (Array.isArray(pick(body, "images")) && pick(body, "images").length > 0) ? pick(body, "images")[0] : (pick(body, "images") ?? null),
      created_at: new Date().toISOString()
    };

    // Remove fields that are undefined to avoid DB errors
    Object.keys(payload).forEach((k) => {
      if (payload[k] === undefined) delete payload[k];
    });

    // Insert into the properties table (change to "rooms" if you prefer that)
    const { data, error } = await supabase
      .from("properties")
      .insert([payload])
      .select();

    if (error) {
      console.error("Supabase insert error:", error);
      // Send DB error message to client
      return NextResponse.json({ error: error.message ?? "Database insert error" }, { status: 500 });
    }

    return NextResponse.json({ success: true, property: data?.[0] ?? null });
  } catch (err: any) {
    console.error("Server error in /api/properties:", err);
    return NextResponse.json({ error: err.message ?? "Server Error" }, { status: 500 });
  }
}
