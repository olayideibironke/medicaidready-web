import { createClient } from "@supabase/supabase-js";

function mustGet(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

/**
 * Server-only Supabase admin client (SERVICE ROLE).
 * Never import this into browser code.
 */
export function supabaseAdmin() {
  const url = mustGet("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRole = mustGet("SUPABASE_SERVICE_ROLE_KEY");

  return createClient(url, serviceRole, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
