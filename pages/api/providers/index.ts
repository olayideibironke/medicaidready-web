import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

type Body = {
  name: string;
  provider_type_code: string; // e.g. "home_health"
  jurisdiction_code: string;  // e.g. "MD"
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  try {
    const { name, provider_type_code, jurisdiction_code } = (req.body || {}) as Body;
    if (!name || !provider_type_code || !jurisdiction_code) {
      return res.status(400).json({ error: "Missing required fields: name, provider_type_code, jurisdiction_code" });
    }

    const { data: pt, error: ptErr } = await supabaseAdmin
      .from("provider_types")
      .select("id")
      .eq("code", provider_type_code)
      .single();

    if (ptErr || !pt) return res.status(400).json({ error: "Invalid provider_type_code" });

    const { data: j, error: jErr } = await supabaseAdmin
      .from("jurisdictions")
      .select("id")
      .eq("code", jurisdiction_code)
      .single();

    if (jErr || !j) return res.status(400).json({ error: "Invalid jurisdiction_code" });

    const { data: provider, error } = await supabaseAdmin
      .from("providers")
      .insert({
        name,
        provider_type_id: pt.id,
        jurisdiction_id: j.id,
      })
      .select("id,name,provider_type_id,jurisdiction_id,created_at")
      .single();

    if (error) return res.status(500).json({ error: error.message });

    return res.status(201).json({ provider });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || "Unknown error" });
  }
}
