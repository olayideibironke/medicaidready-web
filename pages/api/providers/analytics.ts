import type { NextApiRequest, NextApiResponse } from "next";
import { requireRole } from "../../../lib/access";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";

type AnyRecord = Record<string, any>;

function asArray<T = any>(value: any): T[] {
  return Array.isArray(value) ? value : [];
}

function computeScore(provider: AnyRecord): number {
  const checklist = asArray(provider.checklist);
  if (!checklist.length) return 0;

  const complete = checklist.filter((c: AnyRecord) =>
    ["complete", "completed"].includes(String(c.status).toLowerCase())
  ).length;

  return Math.round((complete / checklist.length) * 100);
}

function determineRiskLevel(score: number): "low" | "medium" | "high" {
  if (score >= 80) return "low";
  if (score >= 60) return "medium";
  return "high";
}

function classifyStatus(riskLevel: string): string {
  if (riskLevel === "low") return "ready";
  if (riskLevel === "medium") return "in_progress";
  return "at_risk";
}

function getMonthKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function trendFrom(prev: number | undefined, curr: number): "↑" | "↓" | "→" {
  if (prev === undefined) return "→";
  if (curr > prev) return "↑";
  if (curr < prev) return "↓";
  return "→";
}

function cleanString(v: unknown): string | undefined {
  if (typeof v !== "string") return undefined;
  const s = v.trim();
  return s ? s : undefined;
}

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
    if (v > 1e12) return v;
    if (v > 1e9) return v * 1000;
    return null;
  }

  if (typeof v === "string") {
    if (/^\d+$/.test(v)) {
      const n = Number(v);
      if (n > 1e12) return n;
      if (n > 1e9) return n * 1000;
      return null;
    }
    const d = new Date(v);
    return Number.isFinite(d.getTime()) ? d.getTime() : null;
  }

  return null;
}

async function revokeSubmissionAccess(submissionId: string, reason: string) {
  const sb = supabaseAdmin();
  const t = new Date().toISOString();

  await sb
    .from("request_access_submissions")
    .update({
      access_revoked_at: t,
      access_revoked_reason: reason,
    })
    .eq("id", submissionId)
    .is("access_revoked_at", null);
}

async function requireApprovedActiveSubscriber(req: NextApiRequest) {
  const submissionId = getSubmissionId(req);
  if (!submissionId) {
    return { ok: false, status: 403, error: "missing_submission_id" };
  }

  const sb = supabaseAdmin();

  const { data } = await sb
    .from("request_access_submissions")
    .select("status, stripe_subscription_status, stripe_current_period_end, access_revoked_at")
    .eq("id", submissionId)
    .maybeSingle();

  if (!data) {
    return { ok: false, status: 403, error: "submission_not_found", submissionId };
  }

  if (data.access_revoked_at) {
    return { ok: false, status: 403, error: "access_revoked", submissionId };
  }

  if (String(data.status).toLowerCase() !== "approved") {
    return { ok: false, status: 403, error: "not_approved", submissionId };
  }

  const subStatus = String(data.stripe_subscription_status).toLowerCase();

  if (subStatus === "active" || subStatus === "trialing") {
    const periodEndMs = parsePeriodEndToMs(data.stripe_current_period_end);
    if (periodEndMs && periodEndMs < Date.now()) {
      await revokeSubmissionAccess(submissionId, "period_end_elapsed");
      return { ok: false, status: 403, error: "subscription_period_ended", submissionId };
    }
  }

  if (!(subStatus === "active" || subStatus === "trialing")) {
    return { ok: false, status: 403, error: "subscription_inactive", submissionId };
  }

  return { ok: true, submissionId };
}

async function writeAccessAudit(submissionId: string, allowed: boolean, reason?: string) {
  const sb = supabaseAdmin();
  await sb.from("provider_access_audit").insert({
    submission_id: submissionId,
    route: "/api/providers/analytics",
    method: "GET",
    allowed,
    reason: reason ?? null,
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ ok: false, error: "method_not_allowed" });
  }

  const roleGate = requireRole(req, ["viewer", "analyst", "admin"]);
  if (!roleGate.ok) return res.status(403).json({ ok: false, error: "forbidden" });

  if (roleGate.role !== "admin") {
    const subGate = await requireApprovedActiveSubscriber(req);

    if ((subGate as any).submissionId) {
      await writeAccessAudit(
        (subGate as any).submissionId,
        subGate.ok,
        subGate.ok ? "allowed" : (subGate as any).error
      );
    }

    if (!subGate.ok) {
      return res.status((subGate as any).status ?? 403).json({
        ok: false,
        error: (subGate as any).error,
      });
    }
  }

  try {
    const sb = supabaseAdmin();
    const monthKey = getMonthKey();

    const { data: providers } = await sb
      .from("providers")
      .select("id, created_at, updated_at, meta, onboard, checklist");

    const rows: AnyRecord[] = [];

    for (const p of providers || []) {
      const checklist = p.checklist ?? [];
      const meta = p.meta ?? {};
      const onboard = p.onboard ?? {};

      const score = computeScore({ checklist });
      const riskLevel = determineRiskLevel(score);
      const status = classifyStatus(riskLevel);
      const state = meta?.jurisdiction_code || "UNASSIGNED";

      await sb.from("compliance_history").upsert(
        { provider_id: p.id, month_key: monthKey, score },
        { onConflict: "provider_id,month_key" }
      );

      rows.push({
        id: p.id,
        name: onboard?.org?.name || p.id,
        status,
        state,
        updatedAt: p.updated_at || null,
        score,
        riskLevel,
      });
    }

    return res.status(200).json({
      ok: true,
      role: roleGate.role,
      generatedAt: new Date().toISOString(),
      totals: { providers: rows.length },
      rows,
    });
  } catch (err: any) {
    return res.status(500).json({ ok: false, error: "analytics_failed", message: err?.message });
  }
}
