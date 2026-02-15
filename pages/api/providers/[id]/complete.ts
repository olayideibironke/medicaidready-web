import type { NextApiRequest, NextApiResponse } from "next";
import { requireRole } from "../../../../lib/access";
import { supabaseAdmin } from "../../../../lib/supabaseAdmin";

type ChecklistItemStatus = "not_started" | "in_progress" | "complete";

type ChecklistItem = {
  key: string;
  title: string;
  status: ChecklistItemStatus;
  updatedAt: string;
  completedAt?: string;
  notes?: string;
};

type OnboardStatus = "not_started" | "in_progress" | "complete";
type Onboard = {
  status: OnboardStatus;
  startedAt?: string;
  completedAt?: string;
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

function getId(req: NextApiRequest): string | null {
  const raw = req.query?.id;
  if (typeof raw === "string" && raw.trim()) return raw.trim();
  if (Array.isArray(raw) && raw[0]?.trim()) return raw[0].trim();
  return null;
}

function cleanString(v: unknown): string | undefined {
  if (typeof v !== "string") return undefined;
  const s = v.trim();
  return s ? s : undefined;
}

type AccessGateResult =
  | { ok: true; submissionId: string }
  | { ok: false; status: number; error: string; message?: string; submissionId?: string };

function getSubmissionId(req: NextApiRequest): string | undefined {
  const q = cleanString((req.query as any)?.submission_id);
  if (q) return q;

  const h = cleanString(req.headers["x-submission-id"]);
  if (h) return h;

  const c1 = cleanString((req as any).cookies?.submission_id);
  if (c1) return c1;

  const c2 = cleanString((req as any).cookies?.mr_submission_id);
  if (c2) return c2;

  const c3 = cleanString((req as any).cookies?.medicaidready_submission_id);
  if (c3) return c3;

  return undefined;
}

function parsePeriodEndToMs(v: unknown): number | null {
  if (v == null) return null;

  if (typeof v === "number" && Number.isFinite(v)) {
    if (v > 1e12) return v; // ms
    if (v > 1e9) return v * 1000; // seconds
    return null;
  }

  if (typeof v === "string") {
    const s = v.trim();
    if (!s) return null;

    if (/^\d+$/.test(s)) {
      const n = Number(s);
      if (!Number.isFinite(n)) return null;
      if (n > 1e12) return n;
      if (n > 1e9) return n * 1000;
      return null;
    }

    const d = new Date(s);
    const ms = d.getTime();
    return Number.isFinite(ms) ? ms : null;
  }

  return null;
}

function getClientIp(req: NextApiRequest): string | null {
  const xfwd = req.headers["x-forwarded-for"];
  if (typeof xfwd === "string" && xfwd.trim()) return xfwd.split(",")[0].trim();
  if (Array.isArray(xfwd) && xfwd.length > 0) return String(xfwd[0]).trim();

  const xreal = req.headers["x-real-ip"];
  if (typeof xreal === "string" && xreal.trim()) return xreal.trim();

  const ra = (req.socket as any)?.remoteAddress;
  if (typeof ra === "string" && ra.trim()) return ra.trim();

  return null;
}

async function writeAccessAudit(args: {
  submissionId: string;
  route: string;
  method: string;
  allowed: boolean;
  reason?: string;
  ip?: string | null;
  userAgent?: string | null;
}) {
  try {
    const sb = supabaseAdmin();
    const { error } = await sb.from("provider_access_audit").insert({
      submission_id: args.submissionId,
      route: args.route,
      method: args.method,
      allowed: args.allowed,
      reason: args.reason ?? null,
      ip: args.ip ?? null,
      user_agent: args.userAgent ?? null,
    });

    if (error) {
      // eslint-disable-next-line no-console
      console.error("provider_access_audit insert failed:", error.message, {
        submissionId: args.submissionId,
        route: args.route,
        method: args.method,
        allowed: args.allowed,
        reason: args.reason,
      });
    }
  } catch (e: any) {
    // eslint-disable-next-line no-console
    console.error("provider_access_audit insert crashed:", e?.message ?? String(e));
  }
}

async function revokeSubmissionAccess(args: { submissionId: string; reason: string }) {
  const sb = supabaseAdmin();
  const t = nowIso();

  const { error } = await sb
    .from("request_access_submissions")
    .update({
      access_revoked_at: t,
      access_revoked_reason: args.reason,
    })
    .eq("id", args.submissionId)
    .is("access_revoked_at", null);

  return { ok: !error, error };
}

async function requireApprovedActiveSubscriber(req: NextApiRequest): Promise<AccessGateResult> {
  const submissionId = getSubmissionId(req);

  if (!submissionId) {
    return {
      ok: false,
      status: 403,
      error: "missing_submission_id",
      message: "A valid submission_id is required for provider access.",
    };
  }

  const sb = supabaseAdmin();

  const { data, error } = await sb
    .from("request_access_submissions")
    .select("id, status, stripe_subscription_status, stripe_current_period_end, access_revoked_at")
    .eq("id", submissionId)
    .maybeSingle();

  if (error) {
    return {
      ok: false,
      status: 500,
      error: "access_gate_lookup_failed",
      message: error.message,
      submissionId,
    };
  }

  if (!data) {
    return {
      ok: false,
      status: 403,
      error: "submission_not_found",
      message: "submission_id not found.",
      submissionId,
    };
  }

  const status = String((data as any).status ?? "").toLowerCase();
  const subStatus = String((data as any).stripe_subscription_status ?? "").toLowerCase();
  const revokedAt = (data as any).access_revoked_at;

  if (revokedAt) {
    return {
      ok: false,
      status: 403,
      error: "access_revoked",
      message: "Access is revoked.",
      submissionId,
    };
  }

  if (status !== "approved") {
    return {
      ok: false,
      status: 403,
      error: "not_approved",
      message: "Access is not approved.",
      submissionId,
    };
  }

  // Phase 38: auto-expiry hardening
  if (subStatus === "active" || subStatus === "trialing") {
    const periodEndMs = parsePeriodEndToMs((data as any).stripe_current_period_end);
    if (periodEndMs != null) {
      const nowMs = Date.now();
      if (periodEndMs < nowMs) {
        const revoke = await revokeSubmissionAccess({
          submissionId,
          reason: "period_end_elapsed",
        });

        if (!revoke.ok) {
          return {
            ok: false,
            status: 500,
            error: "access_auto_revoke_failed",
            message: (revoke as any).error?.message ?? "Failed to auto-revoke expired access.",
            submissionId,
          };
        }

        return {
          ok: false,
          status: 403,
          error: "subscription_period_ended",
          message: "Subscription period ended. Access revoked.",
          submissionId,
        };
      }
    }
  }

  if (!(subStatus === "active" || subStatus === "trialing")) {
    return {
      ok: false,
      status: 403,
      error: "subscription_inactive",
      message: "Subscription must be active or trialing.",
      submissionId,
    };
  }

  return { ok: true, submissionId };
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

async function ensureProviderRow(sb: ReturnType<typeof supabaseAdmin>, providerId: string) {
  const { data: existing, error: exErr } = await sb
    .from("providers")
    .select("id, onboard, checklist, updated_at")
    .eq("id", providerId)
    .maybeSingle();

  if (exErr) throw new Error(exErr.message);

  if (existing) {
    return {
      exists: true,
      onboard: ((existing as any).onboard ?? { status: "not_started" }) as Onboard,
      checklist: Array.isArray((existing as any).checklist) ? ((existing as any).checklist as ChecklistItem[]) : [],
      updatedAt: (existing as any).updated_at as string,
    };
  }

  const t = nowIso();
  const onboard: Onboard = { status: "not_started" };
  const checklist = buildDefaultChecklist();

  const { data: inserted, error: insErr } = await sb
    .from("providers")
    .insert({
      id: providerId,
      name: "Unknown Provider",
      meta: {},
      onboard,
      checklist,
      created_at: t,
      updated_at: t,
    })
    .select("id, onboard, checklist, updated_at")
    .single();

  if (insErr) throw new Error(insErr.message);

  return {
    exists: false,
    onboard: ((inserted as any).onboard ?? onboard) as Onboard,
    checklist: Array.isArray((inserted as any).checklist) ? ((inserted as any).checklist as ChecklistItem[]) : checklist,
    updatedAt: (inserted as any).updated_at as string,
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const providerId = getId(req);
  if (!providerId) {
    return res.status(400).json({
      ok: false,
      error: "missing_provider_id",
      message: "Provider id is required in the URL path.",
    });
  }

  const sb = supabaseAdmin();

  // Phase 38: Add GET access-check endpoint with gate + audit (POST remains admin-only mutate)
  if (req.method === "GET") {
    const route = req.url ? req.url.split("?")[0] : `/api/providers/${providerId}/complete`;
    const method = "GET";
    const ip = getClientIp(req);
    const userAgent = (req.headers["user-agent"] as string | undefined) ?? null;

    const adminGate = requireRole(req, ["admin"]);
    if (!adminGate.ok) {
      const gate = await requireApprovedActiveSubscriber(req);

      if ((gate as any).submissionId) {
        await writeAccessAudit({
          submissionId: (gate as any).submissionId,
          route,
          method,
          allowed: gate.ok,
          reason: gate.ok ? "allowed" : gate.error,
          ip,
          userAgent,
        });
      }

      if (!gate.ok) {
        return res.status(gate.status).json({
          ok: false,
          error: gate.error,
          message: gate.message,
        });
      }
    }

    try {
      const row = await ensureProviderRow(sb, providerId);
      const onboard: Onboard = row.onboard ?? { status: "not_started" };
      const checklist: ChecklistItem[] = Array.isArray(row.checklist) ? row.checklist : [];
      const progress = computeProgress(checklist);

      return res.status(200).json({
        ok: true,
        providerId,
        onboard,
        progress,
        updatedAt: row.updatedAt,
      });
    } catch (e: any) {
      return res.status(500).json({ ok: false, error: "providers_fetch_failed", message: e?.message });
    }
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({
      ok: false,
      error: "method_not_allowed",
      message: "Use GET or POST.",
    });
  }

  if (process.env.READ_ONLY_MODE === "true") {
    return res.status(503).json({ ok: false, error: "read_only_mode_enabled" });
  }

  const gate = requireRole(req, ["admin"]);
  if (!gate.ok) return res.status(403).json({ ok: false, error: "forbidden", role: gate.role });

  // POST body:
  // { key: "credentialing", notes?: "..." }
  // OR { completeOnboarding: true }
  const body = req.body ?? {};
  const t = nowIso();

  try {
    const row = await ensureProviderRow(sb, providerId);

    // Option A: complete onboarding
    if (body?.completeOnboarding === true) {
      const onboard: Onboard = row.onboard ?? { status: "not_started" };
      onboard.status = "complete";
      onboard.startedAt = onboard.startedAt ?? t;
      onboard.completedAt = onboard.completedAt ?? t;

      const { error: upErr } = await sb.from("providers").update({ onboard, updated_at: t }).eq("id", providerId);

      if (upErr) {
        return res.status(500).json({ ok: false, error: "providers_update_failed", message: upErr.message });
      }

      return res.status(200).json({
        ok: true,
        providerId,
        action: "onboarding_completed",
        onboard,
        updatedAt: t,
      });
    }

    // Option B: complete a checklist item
    const key = cleanString(body?.key);
    if (!key) {
      return res.status(400).json({
        ok: false,
        error: "invalid_body",
        message: "Provide { key: '<checklist_item_key>' } or { completeOnboarding: true }.",
      });
    }

    const checklist: ChecklistItem[] = Array.isArray(row.checklist) ? row.checklist : [];
    const item = checklist.find((i) => i.key === key);
    if (!item) {
      return res.status(404).json({
        ok: false,
        error: "checklist_item_not_found",
        message: `No checklist item found for key '${key}'.`,
      });
    }

    item.status = "complete";
    item.updatedAt = t;
    item.completedAt = item.completedAt ?? t;
    if (typeof body?.notes === "string") item.notes = body.notes;

    const { error: upErr } = await sb.from("providers").update({ checklist, updated_at: t }).eq("id", providerId);

    if (upErr) {
      return res.status(500).json({ ok: false, error: "providers_update_failed", message: upErr.message });
    }

    return res.status(200).json({
      ok: true,
      providerId,
      action: "checklist_item_completed",
      completedKey: key,
      checklist,
      updatedAt: t,
    });
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: "providers_update_failed", message: e?.message });
  }
}
