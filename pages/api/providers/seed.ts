// pages/api/providers/seed.ts
import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs/promises";
import path from "path";
import { requireRole } from "../../../lib/access";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";

// 🔒 Seed now reads ONLY from archive
const PROVIDERS_FILE = path.join(process.cwd(), "data", "_archive", "providers.json");
const HISTORY_FILE = path.join(process.cwd(), "data", "_archive", "compliance-history.json");

function asArray(maybe: any): any[] {
  if (Array.isArray(maybe)) return maybe;
  if (!maybe) return [];
  if (typeof maybe === "object") return Object.values(maybe);
  return [];
}

function normalizeProviders(raw: any): any[] {
  if (Array.isArray(raw)) return raw;

  if (raw && typeof raw === "object") {
    if (Array.isArray(raw.providers)) return raw.providers;
    if (raw.providers && typeof raw.providers === "object") return asArray(raw.providers);
    return asArray(raw);
  }

  return [];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({
      ok: false,
      error: "method_not_allowed",
      allow: ["POST"],
    });
  }

  // 🚫 READ-ONLY MODE BLOCK
  if (process.env.READ_ONLY_MODE === "true") {
    return res.status(503).json({
      ok: false,
      error: "read_only_mode_enabled",
    });
  }

  // 🔐 ADMIN ROLE REQUIRED
  const gate = requireRole(req, ["admin"]);
  if (!gate.ok) {
    return res.status(403).json({
      ok: false,
      error: "forbidden",
      role: gate.role,
    });
  }

  try {
    const sb = supabaseAdmin();

    const providersRaw = JSON.parse(await fs.readFile(PROVIDERS_FILE, "utf8"));
    const providers = normalizeProviders(providersRaw);

    const historyRaw = JSON.parse(await fs.readFile(HISTORY_FILE, "utf8"));
    const history = historyRaw?.history || {};

    const nowIso = new Date().toISOString();

    const providerRows = providers.map((p: any) => ({
      id: String(p.id),
      name: p.name ?? "Unknown Provider",
      provider_type_id: p.providerTypeId ?? null,
      jurisdiction_id: p.jurisdictionId ?? null,
      created_at: nowIso,
      updated_at: nowIso,
      meta: p.meta || {},
      onboard: p.onboard || {},
      checklist: p.checklist || [],
    }));

    const { error: upProvidersErr } = await sb
      .from("providers")
      .upsert(providerRows, { onConflict: "id" });

    if (upProvidersErr) {
      return res.status(500).json({
        ok: false,
        error: "providers_upsert_failed",
        message: upProvidersErr.message,
      });
    }

    const histRows: any[] = [];
    for (const providerId of Object.keys(history)) {
      const months = history[providerId] || {};
      for (const monthKey of Object.keys(months)) {
        histRows.push({
          provider_id: String(providerId),
          month_key: monthKey,
          score: Number(months[monthKey]),
        });
      }
    }

    if (histRows.length > 0) {
      const { error: upHistErr } = await sb
        .from("compliance_history")
        .upsert(histRows, { onConflict: "provider_id,month_key" });

      if (upHistErr) {
        return res.status(500).json({
          ok: false,
          error: "history_upsert_failed",
          message: upHistErr.message,
        });
      }
    }

    return res.status(200).json({
      ok: true,
      seeded: true,
      providersUpserted: providerRows.length,
      historyUpserted: histRows.length,
    });
  } catch (err: any) {
    return res.status(500).json({
      ok: false,
      error: "seed_failed",
      message: err?.message,
    });
  }
}
