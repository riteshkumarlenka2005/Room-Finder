// app/api/properties/route.ts

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

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
// ✅ GET: Fetch ONLY 6 NEWEST properties (SAFE + ERROR-FREE)
// -----------------------------------------
export async function GET() {
  try {
    const cookieStore = await cookies();

    // 🔥 Correct Supabase server client for Route Handlers
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            try {
              cookieStore.set({ name, value, ...options });
            } catch { /* ignore */ }
          },
          remove(name: string, options: any) {
            try {
              cookieStore.set({ name, value: "", maxAge: 0, ...options });
            } catch { /* ignore */ }
          }
        }
      }
    );

    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .order("created_at", { ascending: false }) // newest first
      .limit(6);

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
      rating: 4.5, // Fallback because your DB has no rating column
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
    console.error("Unexpected API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// -----------------------------------------
// ✅ POST: Insert new property (AUTH SAFE + NO ERRORS)
// -----------------------------------------
export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            try {
              cookieStore.set({ name, value, ...options });
            } catch {}
          },
          remove(name: string, options: any) {
            try {
              cookieStore.set({ name, value: "", maxAge: 0, ...options });
            } catch {}
          },
        },
      }
    );

    const body = await req.json();

    // ✅ AUTH READS REAL SESSION FROM COOKIES
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // ✅ FULL PAYLOAD (SAFE MAPPING)
    const payload: any = {
      title: body.title,
      description: body.description,
      property_type: body.propertyType,

      state: body.state,
      district: body.district,
      city: body.city,
      area: body.area,
      full_address: body.fullAddress,
      pincode: body.pincode,

      bhk: body.bhk,
      doors: body.doors,
      windows: body.windows,
      flooring: body.flooring,
      balcony: body.balcony,
      roof_access: body.roofAccess,

      water_system: body.waterSystem,
      electricity: body.electricity,
      parking: body.parking,

      monthly_rent: Number(body.monthlyRent),
      security_deposit: Number(body.securityDeposit),

      amenities: body.amenities ?? [],
      furniture: body.furniture ?? [],

      kitchen_type: body.kitchenType,
      maushi_available: body.maushiAvailable,
      maushi_cost: Number(body.maushiCost),

      images: body.images ?? [],

      owner_name: body.ownerName,
      phone: body.phone,
      alternate_phone: body.alternatePhone,

      preferred_tenants: body.preferredTenants ?? [],
      rules: body.rules ?? [],

      // ✅ SECURE OWNER ID
      owner_id: user.id,

      price: Number(body.monthlyRent),
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("properties")
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error("Insert error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, property: data });

  } catch (err: any) {
    console.error("Unexpected POST error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

