// app/api/owners/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    // fetch owners + optional user fields via single query
    const { data, error } = await supabase
      .from("owners")
      .select(`*, users:users(id, name, email, phone, profile_url)`)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, owners: data });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch owners" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { user_id, house_title, house_address, house_photo_url } = body;

    // basic validation
    if (!user_id || !house_title || !house_address) {
      return NextResponse.json(
        { error: "user_id, house_title and house_address are required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("owners")
      .insert([
        {
          user_id,
          house_title,
          house_address,
          house_photo_url: house_photo_url ?? null,
        },
      ])
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, owner: data[0] });
  } catch (err) {
    return NextResponse.json({ error: "Failed to create owner" }, { status: 500 });
  }
}
