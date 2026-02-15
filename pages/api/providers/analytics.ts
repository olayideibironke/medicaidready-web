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

function classifyStatus(riskLevel: "low" | "medium" | "high"): "ready" | "in_progress" | "at_risk" {
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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const gate = requireRole(req, ["viewer", "analyst", "admin"]);
  if (!gate.ok) return res.status(403).json({ ok: false, error: "forbidden", role: gate.role });

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ ok: false, error: "method_not_allowed" });
  }

  try {
    const sb = supabaseAdmin();
    const monthKey = getMonthKey();

    const { data: providers, error: pErr } = await sb
      .from("providers")
      .select("id, created_at, updated_at, meta, onboard, checklist");

    if (pErr) {
      return res.status(500).json({ ok: false, error: "db_read_failed", message: pErr.message });
    }

    const rows: AnyRecord[] = [];

    for (const p of providers || []) {
      const checklist = p.checklist ?? [];
      const meta = p.meta ?? {};
      const onboard = p.onboard ?? {};

      const score = computeScore({ checklist });
      const riskLevel = determineRiskLevel(score);
      const status = classifyStatus(riskLevel);
      const state = meta?.jurisdiction_code || "UNASSIGNED";

      // history (best-effort; if table missing, we still return rows)
      let previousScore: number | undefined = undefined;
      let prevPrevScore: number | undefined = undefined;

      try {
        const { data: hist } = await sb
          .from("compliance_history")
          .select("month_key, score")
          .eq("provider_id", p.id)
          .order("month_key", { ascending: false })
          .limit(3);

        const history = (hist || []).map((x: any) => ({ month: String(x.month_key), score: Number(x.score) }));
        const prevEntry = history.find((x) => x.month !== monthKey);
        const prevPrevEntry = history.filter((x) => x.month !== monthKey)[1];

        previousScore = prevEntry?.score;
        prevPrevScore = prevPrevEntry?.score;

        // idempotent upsert (ignore failures so UI never crashes)
        await sb.from("compliance_history").upsert(
          { provider_id: p.id, month_key: monthKey, score },
          { onConflict: "provider_id,month_key" }
        );
      } catch {
        // ignore
      }

      const trend = trendFrom(previousScore, score);
      const declining = trend === "↓";

      const prevTrend = trendFrom(prevPrevScore, previousScore ?? score);
      const escalationRisk =
        previousScore !== undefined &&
        prevPrevScore !== undefined &&
        prevTrend === "↓" &&
        trend === "↓";

      rows.push({
        id: p.id,
        name: onboard?.org?.name || p.id,
        status,
        state,
        updatedAt: p.updated_at || null,
        score,
        riskLevel,
        trend,
        declining,
        escalationRisk,
        issuesCount: riskLevel === "high" ? 1 : 0,
      });
    }

    // ✅ ALWAYS return these objects so frontend never reads undefined.high
    const riskSummary = {
      high: rows.filter((r) => r.riskLevel === "high").length,
      medium: rows.filter((r) => r.riskLevel === "medium").length,
      low: rows.filter((r) => r.riskLevel === "low").length,
    };

    const stateSummary: Record<string, { total: number; high: number; medium: number; low: number }> = {};
    for (const r of rows) {
      if (!stateSummary[r.state]) stateSummary[r.state] = { total: 0, high: 0, medium: 0, low: 0 };
      stateSummary[r.state].total += 1;
      stateSummary[r.state][r.riskLevel] += 1;
    }

    const decliningCount = rows.filter((r) => r.declining).length;
    const escalationRiskCount = rows.filter((r) => r.escalationRisk).length;

    return res.status(200).json({
      ok: true,
      source: "supabase",
      role: gate.role,
      generatedAt: new Date().toISOString(),
      totals: {
        providers: rows.length,
        withScore: rows.length,
        withUpdates: rows.filter((r) => !!r.updatedAt).length,
        withIssues: rows.filter((r) => r.issuesCount > 0).length,
      },
      riskSummary,
      stateSummary,
      trendSummary: { declining: decliningCount, escalationRisk: escalationRiskCount },
      rows,
    });
  } catch (err: any) {
    return res.status(500).json({ ok: false, error: "analytics_failed", message: err?.message ?? String(err) });
  }
}
