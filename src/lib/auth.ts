import { createClient } from "@/lib/supabase/server";

export async function requireUser() {
  if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") return { id: "demo-user", email: "demo@dynamis.relay" };
  try { const supabase = await createClient(); const { data, error } = await supabase.auth.getClaims(); if (error || !data?.claims?.sub) return null; return { id: data.claims.sub, email: typeof data.claims.email === "string" ? data.claims.email : undefined }; }
  catch { return null; }
}
