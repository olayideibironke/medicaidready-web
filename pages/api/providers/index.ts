import type { NextApiRequest, NextApiResponse } from "next";
import { requireRole } from "../../../lib/access";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";

type ChecklistItemStatus = "not_started" | "in_progress" | "complete";

type ChecklistItem = {
  key: string;
  title: string;
  status: ChecklistItemStatus;
  updatedAt: string;
  completedAt?: string;
  notes?: string;
};

const DEFAULT_CHECKLIST: Array<Pick<ChecklistItem, "key" | "title">> = [
  { key: "provider_profile", title: "Provider profile completed" },
  { key: "credentialing", title: "Credentialing verified" },
  { key: "enrollment", title: "Enrollment documents submitted" },
  { key: "compliance_training", title: "Compliance training completed" },
  { key: "attestation", title: "Attestation signed" },
];

function nowIso() {
  return new Date().toISOString();
}

function cleanString(v: unknown): string | undefined {
  if (typeof v !== "string") return undefined;
  const s = v.trim();
  return s ? s : undefined;
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function buildDefaultChecklist(): ChecklistItem[] {
  const t = nowIso();
  return DEFAULT_CHECKLIST.map((x) => ({
    key: x.key,
    title: x.title,
    status: "not_started" as const,
    updatedAt: t,
  }));
}

function computeProgress(items: ChecklistItem[]) {
  const total = items.length || 0;
  const complete = items.filter((i) => i.status === "complete").length;
  const inProgress = items.filter((i) => i.status === "in_progress").length;
  const notStarted = items.filter((i) => i.status === "not_started").length;
  const pct = total === 0 ? 0 : Math.round((complete / total) * 100);
  return { total, complete, inProgress, notStarted, percentComplete: pct };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const sb = supabaseAdmin();

  if (req.method === "GET") {
    const { data, error } = await sb
      .from("providers")
      .select("id, created_at, updated_at, meta, onboard, checklist")
      .order("updated_at", { ascending: false });

    if (error) {
      return res.status(500).json({ ok: false, error: "providers_fetch_failed", message: error.message });
    }

    const providers = (data ?? []).map((p: any) => {
      const checklist: ChecklistItem[] = Array.isArray(p.checklist) ? p.checklist : [];
      const progress = computeProgress(checklist);

      return {
        id: p.id,
        createdAt: p.created_at,
        updatedAt: p.updated_at,
        meta: p.meta ?? {},
        onboardStatus: p.onboard?.status ?? "not_started",
        progress,
      };
    });

    return res.status(200).json({ ok: true, providers });
  }

  if (req.method === "POST") {
    // Write protection
    if (process.env.READ_ONLY_MODE === "true") {
      return res.status(503).json({ ok: false, error: "read_only_mode_enabled" });
    }

    // Role protection
    const gate = requireRole(req, ["admin"]);
    if (!gate.ok) return res.status(403).json({ ok: false, error: "forbidden", role: gate.role });

    // Accepts:
    // { id?: string, name?: string, provider_type_code?: string, jurisdiction_code?: string }
    const body = req.body ?? {};
    const requestedId = cleanString(body?.id);
    const name = cleanString(body?.name);
    const provider_type_code = cleanString(body?.provider_type_code);
    const jurisdiction_code = cleanString(body?.jurisdiction_code);

    const id =
      requestedId ??
      slugify(name ?? `provider-${Date.now()}`) + "-" + String(Date.now()).slice(-6);

    // If exists, return it (keep UI behavior)
    const { data: existing, error: exErr } = await sb
      .from("providers")
      .select("id, created_at, updated_at, meta, onboard, checklist")
      .eq("id", id)
      .maybeSingle();

    if (exErr) {
      return res.status(500).json({ ok: false, error: "providers_fetch_failed", message: exErr.message });
    }

    if (existing) {
      const checklist: ChecklistItem[] = Array.isArray((existing as any).checklist) ? (existing as any).checklist : [];
      return res.status(200).json({
        ok: true,
        provider: {
          id: (existing as any).id,
          createdAt: (existing as any).created_at,
          updatedAt: (existing as any).updated_at,
          meta: (existing as any).meta ?? {},
          onboardStatus: (existing as any).onboard?.status ?? "not_started",
          progress: computeProgress(checklist),
        },
        created: false,
      });
    }

    const t = nowIso();
    const meta = {
      name,
      provider_type_code,
      jurisdiction_code,
    };

    const onboard = { status: "not_started" as const };
    const checklist = buildDefaultChecklist();

    const { data: inserted, error: insErr } = await sb
      .from("providers")
      .insert({
        id,
        name: name ?? "Unknown Provider",
        meta,
        onboard,
        checklist,
        created_at: t,
        updated_at: t,
      })
      .select("id, created_at, updated_at, meta, onboard, checklist")
      .single();

    if (insErr) {
      return res.status(500).json({ ok: false, error: "providers_insert_failed", message: insErr.message });
    }

    const checklistInserted: ChecklistItem[] = Array.isArray((inserted as any).checklist) ? (inserted as any).checklist : [];
    return res.status(201).json({
      ok: true,
      provider: {
        id: (inserted as any).id,
        createdAt: (inserted as any).created_at,
        updatedAt: (inserted as any).updated_at,
        meta: (inserted as any).meta ?? {},
        onboardStatus: (inserted as any).onboard?.status ?? "not_started",
        progress: computeProgress(checklistInserted),
      },
      created: true,
    });
  }

  res.setHeader("Allow", "GET, POST");
  return res.status(405).json({
    ok: false,
    error: "method_not_allowed",
    message: "Use GET or POST.",
  });
}
