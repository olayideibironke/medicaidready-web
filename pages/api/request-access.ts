// pages/api/request-access.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

type Payload = {
  name?: string;
  organization?: string;
  email?: string;
  state?: string;
  providerType?: string;
};

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// If your repo already uses a different env var name for read-only mode,
// set READ_ONLY_MODE to "false" in .env.local to allow submissions.
const READ_ONLY_MODE = String(process.env.READ_ONLY_MODE ?? "false").toLowerCase() === "true";

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function clean(value: unknown) {
  return String(value ?? "").trim();
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  if (READ_ONLY_MODE) {
    return res.status(503).json({ ok: false, error: "READ_ONLY_MODE is enabled" });
  }

  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    return res.status(500).json({ ok: false, error: "Server misconfigured (Supabase env vars missing)" });
  }

  const body = (req.body ?? {}) as Payload;

  const name = clean(body.name);
  const organization = clean(body.organization);
  const email = clean(body.email).toLowerCase();
  const state = clean(body.state).toUpperCase();
  const provider_type = clean(body.providerType);

  if (!name || !organization || !email || !state || !provider_type) {
    return res.status(400).json({ ok: false, error: "All fields are required" });
  }

  if (!isEmail(email)) {
    return res.status(400).json({ ok: false, error: "Invalid email address" });
  }

  if (!["MD", "VA", "DC"].includes(state)) {
    return res.status(400).json({ ok: false, error: "Invalid state selection" });
  }

  const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { error } = await supabaseAdmin.from("request_access_submissions").insert([
    {
      name,
      organization,
      email,
      state,
      provider_type,
    },
  ]);

  if (error) {
    return res.status(500).json({ ok: false, error: "Unable to submit request" });
  }

  return res.status(200).json({ ok: true });
}
