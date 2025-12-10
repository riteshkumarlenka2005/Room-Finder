import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fullName, email, phone, password, userType } = body;

    // 1️⃣ Create Supabase Auth User
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone: phone,
          user_type: userType,
        },
      },
    });

    if (signUpError) {
      return NextResponse.json(
        { error: signUpError.message },
        { status: 400 }
      );
    }

    const userId = signUpData.user?.id;

    // 2️⃣ Create Profile Row in Custom "users" Table
    await supabase.from("users").insert([
      {
        id: userId,
        full_name: fullName,
        email,
        phone,
        user_type: userType,
      },
    ]);

    return NextResponse.json({
      success: true,
      message: "Account created. Please verify your email.",
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Server error while creating account" },
      { status: 500 }
    );
  }
}
