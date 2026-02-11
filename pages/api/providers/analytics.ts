import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs/promises";
import path from "path";
import { requireRole } from "../../../lib/access";
import { writeJsonAtomic } from "../../../lib/safeFile";

type AnyRecord = Record<string, any>;

const PROVIDERS_FILE = path.join(process.cwd(), "data", "providers.json");
const HISTORY_FILE = path.join(process.cwd(), "data", "compliance-history.json");

function asArray<T = any>(value: any): T[] {
  return Array.isArray(value) ? value : [];
}

function readProviders(parsed: any): AnyRecord[] {
  if (!parsed) return [];
  if (Array.isArray(parsed)) return parsed;
  if (Array.isArray(parsed.providers)) return parsed.providers;
  if (parsed.providers && typeof parsed.providers === "object") return Object.values(parsed.providers);
  return [];
}

async function readJson(filePath: string) {
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw);
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

function getLastTwoMonthScores(providerHistory: Record<string, number>, currentMonthKey: string) {
  const keys = Object.keys(providerHistory)
    .filter((k) => k !== currentMonthKey)
    .sort();

  const lastKey = keys[keys.length - 1];
  const prevKey = keys[keys.length - 2];

  const last = lastKey ? providerHistory[lastKey] : undefined;
  const prev = prevKey ? providerHistory[prevKey] : undefined;

  return { lastKey, prevKey, last, prev };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const gate = requireRole(req, ["viewer", "analyst", "admin"]);
  if (!gate.ok) return res.status(403).json({ ok: false, error: "forbidden", role: gate.role });

  try {
    const providersRaw = await readJson(PROVIDERS_FILE);
    const providers = readProviders(providersRaw);

    const historyData = await readJson(HISTORY_FILE);
    if (!historyData.history) historyData.history = {};

    const monthKey = getMonthKey();
    const rows: AnyRecord[] = [];

    for (const p of providers) {
      const score = computeScore(p);
      const riskLevel = determineRiskLevel(score);
      const status = classifyStatus(riskLevel);
      const state = p.meta?.jurisdiction_code || "UNASSIGNED";

      if (!historyData.history[p.id]) historyData.history[p.id] = {};
      const providerHistory: Record<string, number> = historyData.history[p.id];

      const { last, prev } = getLastTwoMonthScores(providerHistory, monthKey);

      const trend = trendFrom(last, score);

      const lastTrend = trendFrom(prev, last ?? score);
      const escalationRisk = last !== undefined && prev !== undefined && lastTrend === "↓" && trend === "↓";
      const declining = trend === "↓";

      providerHistory[monthKey] = score;

      rows.push({
        id: p.id,
        name: p.onboard?.org?.name || p.id,
        status,
        state,
        updatedAt: p.updatedAt || null,
        score,
        riskLevel,
        trend,
        declining,
        escalationRisk,
        issuesCount: riskLevel === "high" ? 1 : 0,
      });
    }

    // Atomic write (prevents corruption)
    await writeJsonAtomic(HISTORY_FILE, historyData);

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
    return res.status(500).json({
      ok: false,
      error: "deterioration_engine_failed",
      message: err?.message,
    });
  }
}
