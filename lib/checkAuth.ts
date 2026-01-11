"use client";

import { supabase } from "./supabase";

export async function requireAuth() {
  const { data, error } = await supabase.auth.getSession();

  const session = data?.session;

  // Not logged in → redirect
  if (!session) {
    window.location.href = "/login";
    return false;
  }

  return true;
}
