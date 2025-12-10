import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export async function supabaseServer() {
  const cookieStore = await cookies(); // ⬅ REQUIRED in Next.js 15
  return createRouteHandlerClient({ cookies: () => cookieStore });
}
