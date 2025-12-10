import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const supabase = supabaseServer();

  // 🔐 Login user & set auth cookies
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 }
    );
  }

  // fetch profile
  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", data.user.id)
    .single();

  return NextResponse.json({
    success: true,
    user: data.user,
    profile,
  });
}
