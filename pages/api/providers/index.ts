// pages/api/providers/index.ts
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

  // Node's req.socket.remoteAddress can exist but is not always reliable in proxies
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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const sb = supabaseAdmin();

  // Audit only for GET access checks (Phase 38 focus)
  if (req.method === "GET") {
    const route = req.url ? req.url.split("?")[0] : "/api/providers";
    const method = "GET";
    const ip = getClientIp(req);
    const userAgent = (req.headers["user-agent"] as string | undefined) ?? null;

    const adminGate = requireRole(req, ["admin"]);
    if (!adminGate.ok) {
      const gate = await requireApprovedActiveSubscriber(req);

      // Write audit row for non-admin path ONLY when we have a submissionId
      // (table requires submission_id uuid)
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

    const { data, error } = await sb
      .from("providers")
      .select("id, created_at, updated_at, meta, onboard, checklist")
      .order("updated_at", { ascending: false });

    if (error) {
      return res.status(500).json({
        ok: false,
        error: "providers_fetch_failed",
        message: error.message,
      });
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
    if (process.env.READ_ONLY_MODE === "true") {
      return res.status(503).json({ ok: false, error: "read_only_mode_enabled" });
    }

    const gate = requireRole(req, ["admin"]);
    if (!gate.ok) return res.status(403).json({ ok: false, error: "forbidden", role: gate.role });

    const body = req.body ?? {};
    const requestedId = cleanString(body?.id);
    const name = cleanString(body?.name);
    const provider_type_code = cleanString(body?.provider_type_code);
    const jurisdiction_code = cleanString(body?.jurisdiction_code);

    const id = requestedId ?? slugify(name ?? `provider-${Date.now()}`) + "-" + String(Date.now()).slice(-6);

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
