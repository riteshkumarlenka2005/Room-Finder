// import { createClient } from '@supabase/supabase-js';

// export const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//   {
//     auth: {
//       persistSession: true,
//       autoRefreshToken: true,
//       detectSessionInUrl: true,
//     }
//   }
// );

// lib/supabase.ts
"use client";

import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Single browser client reused everywhere
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

