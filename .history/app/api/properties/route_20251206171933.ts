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
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const cleaned = data.map((p) => {
      return {
        id: p.id,
        title: p.title ?? "",
        price: p.price ?? p.monthly_rent ?? "",
        location: p.full_address ?? p.city ?? "",
        type: p.bhk ? `${p.bhk}BHK` : "Room",
        sharing: p.preferred_tenants?.join(", ") ?? "",
        owner: p.owner_name ?? "",
        rating: p.rating ?? 4.5,
        reviews: p.reviews ?? 0,
        features: [
          ...(p.amenities || []),
          ...(p.furniture || []),
        ],

        // ❤️ FIX: ALWAYS RETURN ARRAY
        images:
          Array.isArray(p.images)
            ? p.images
            : p.images
            ? [p.images]
            : [],

        // Verified
        verified: true,

        // Fallback
        property_id: p.id,
      };
    });

    return NextResponse.json({ properties: cleaned });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// -----------------------------------------
// POST: Insert new property
// -----------------------------------------
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // ❤️ Get Logged-in owner
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const payload: any = {
      title: pick(body, "title"),
      owner_name: pick(body, "ownerName", "owner_name"),
      monthly_rent: toNumber(pick(body, "monthlyRent", "monthly_rent")),

      // ⭐ Correct owner_id assignment
      owner_id: user.id,

      // other fields...
      images: pick(body, "images") || [],
      price: toNumber(pick(body, "monthlyRent")),
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("properties")
      .insert([payload])
      .select();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true, property: data[0] });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

