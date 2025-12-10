import { supabase } from "@/lib/supabase";

export async function requireAuth() {
  const { data: { session }, error } = await supabase.auth.getSession();

  if (error) {
    console.error("Auth error:", error);
    window.location.href = "/login";
    return false;
  }

  const user = session?.user;

  // Not logged in
  if (!user) {
    window.location.href = "/login";
    return false;
  }

  // Not verified
  if (!user.email_confirmed_at) {
    alert("Please verify your email before listing a property.");
    window.location.href = "/verify-email";
    return false;
  }

  return true;
}
