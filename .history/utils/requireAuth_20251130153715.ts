import { supabase } from "@/supabase";

export async function requireAuth() {
  // Get session instead of user (FASTER + RELIABLE)
  const { data: { session } } = await supabase.auth.getSession();

  const user = session?.user;

  // Not logged in
  if (!user) {
    window.location.href = "/login";
    return false;
  }

  // Email not verified
  if (!user.email_confirmed_at) {
    alert("Please verify your email before listing a property.");
    window.location.href = "/verify-email";
    return false;
  }

  return true;
}
