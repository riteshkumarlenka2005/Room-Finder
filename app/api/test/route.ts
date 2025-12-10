import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET: Fetch all rooms
export async function GET() {
  const { data, error } = await supabase
    .from("rooms")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// POST: Create a new room
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { 
      title, 
      description, 
      location, 
      price, 
      image_url, 
      available, 
      owner_id 
    } = body;

    const { data, error } = await supabase
      .from("rooms")
      .insert([
        {
          title,
          description,
          location,
          price,
          image_url,
          available,
          owner_id,
        },
      ])
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data[0]);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create room" },
      { status: 500 }
    );
  }
}
