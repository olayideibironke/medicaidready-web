import type { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useMemo, useState } from "react";

type ProviderRow = {
  id: string;
  name: string;
  status: string;
  state: string;
  updatedAt: string | null;
  score: number;
  riskLevel: "low" | "medium" | "high";
  trend: "↑" | "↓" | "→";
  declining: boolean;
  escalationRisk: boolean;
  issuesCount: number;
};

type StateSummary = Record<string, { total: number; high: number; medium: number; low: number }>;

type AnalyticsPayload = {
  generatedAt: string;
  totals: {
    providers: number;
    withScore: number;
    withUpdates: number;
    withIssues: number;
  };
  riskSummary: { high: number; medium: number; low: number };
  trendSummary: { declining: number; escalationRisk: number };
  stateSummary: StateSummary;
  rows: ProviderRow[];
};

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString();
}

export const getServerSideProps: GetServerSideProps<{ data: AnalyticsPayload }> = async ({ req }) => {
  const proto = (req.headers["x-forwarded-proto"] as string) || "http";
  const host = req.headers.host;
  const baseUrl = `${proto}://${host}`;

  const resp = await fetch(`${baseUrl}/api/providers/analytics`);
  const data = await resp.json();

  return { props: { data } };
};

function riskColor(level: string) {
  if (level === "high") return "#dc2626";
  if (level === "medium") return "#f59e0b";
  return "#16a34a";
}

function trendStyle(trend: "↑" | "↓" | "→") {
  if (trend === "↑") return { color: "#16a34a", fontWeight: 800 };
  if (trend === "↓") return { color: "#dc2626", fontWeight: 800 };
  return { color: "#6b7280", fontWeight: 800 };
}

export default function AnalyticsPage({ data }: { data: AnalyticsPayload }) {
  const [sortKey, setSortKey] = useState("risk_desc");

  const processed = useMemo(() => {
    const rows = [...data.rows];

    rows.sort((a, b) => {
      if (sortKey === "escalation_desc") {
        if (b.escalationRisk !== a.escalationRisk) return Number(b.escalationRisk) - Number(a.escalationRisk);
        if (b.declining !== a.declining) return Number(b.declining) - Number(a.declining);
        const order = { high: 3, medium: 2, low: 1 };
        return order[b.riskLevel] - order[a.riskLevel];
      }

      if (sortKey === "risk_desc") {
        const order = { high: 3, medium: 2, low: 1 };
        return order[b.riskLevel] - order[a.riskLevel];
      }

      if (sortKey === "trend_desc") {
        const order = { "↓": 3, "→": 2, "↑": 1 };
        return order[b.trend] - order[a.trend];
      }

      if (sortKey === "score_desc") return b.score - a.score;

      return new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime();
    });

    return rows;
  }, [data.rows, sortKey]);

  return (
    <>
      <Head>
        <title>Analytics Overview • MedicaidReady</title>
      </Head>

      <main style={{ padding: 24, maxWidth: 1300, margin: "0 auto", fontFamily: "system-ui" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <h1 style={{ margin: 0 }}>Analytics Overview</h1>

          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <Link href="/providers/report" style={{ textDecoration: "none" }}>
              <span
                style={{
                  display: "inline-flex",
                  padding: "8px 10px",
                  borderRadius: 10,
                  border: "1px solid #111",
                  background: "#111",
                  color: "#fff",
                  fontWeight: 700,
                }}
              >
                Export Report (Print/PDF)
              </span>
            </Link>

            <Link href="/providers">← Back to Providers</Link>
          </div>
        </div>

        {/* Executive KPIs */}
        <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "repeat(8,1fr)", gap: 12 }}>
          <KPI label="Total Providers" value={data.totals.providers} />
          <KPI label="High Risk" value={data.riskSummary.high} color="#dc2626" />
          <KPI label="Medium Risk" value={data.riskSummary.medium} color="#f59e0b" />
          <KPI label="Low Risk" value={data.riskSummary.low} color="#16a34a" />
          <KPI label="Declining" value={data.trendSummary.declining} color="#dc2626" />
          <KPI label="Escalation Risk" value={data.trendSummary.escalationRisk} color="#7c2d12" />
          <KPI label="With Updates" value={data.totals.withUpdates} />
          <KPI label="Issues" value={data.totals.withIssues} />
        </div>

        {/* Jurisdiction Portfolio */}
        <section style={{ marginTop: 30 }}>
          <h2 style={{ marginBottom: 12 }}>Jurisdiction Portfolio</h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: 16 }}>
            {Object.entries(data.stateSummary).map(([state, summary]) => (
              <div
                key={state}
                style={{
                  border: "1px solid #eee",
                  borderRadius: 12,
                  padding: 16,
                  background: "#fff",
                }}
              >
                <h3 style={{ marginTop: 0 }}>{state}</h3>

                <div style={{ marginTop: 8, fontSize: 14 }}>
                  <div>Total: {summary.total}</div>
                  <div style={{ color: "#dc2626" }}>High: {summary.high}</div>
                  <div style={{ color: "#f59e0b" }}>Medium: {summary.medium}</div>
                  <div style={{ color: "#16a34a" }}>Low: {summary.low}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Sort */}
        <div style={{ marginTop: 30 }}>
          <strong>Sort:</strong>{" "}
          <select value={sortKey} onChange={(e) => setSortKey(e.target.value)} style={{ padding: 6 }}>
            <option value="escalation_desc">Escalation Risk (first)</option>
            <option value="risk_desc">Risk Severity</option>
            <option value="trend_desc">Trend (Declining first)</option>
            <option value="updated_desc">Recently Updated</option>
            <option value="score_desc">Score (High → Low)</option>
          </select>
        </div>

        {/* Table */}
        <div style={{ marginTop: 20 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Provider", "Status", "Risk", "Trend", "Escalation", "State", "Score", "Updated"].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      padding: 10,
                      borderBottom: "1px solid #ddd",
                      fontSize: 12,
                      color: "#555",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {processed.map((p) => (
                <tr key={p.id} style={{ background: p.escalationRisk ? "#fff7ed" : undefined }}>
                  <td style={{ padding: 10 }}>
                    <Link href={`/providers/${p.id}`}>
                      <strong>{p.name}</strong>
                    </Link>
                  </td>
                  <td style={{ padding: 10 }}>{p.status}</td>
                  <td style={{ padding: 10, fontWeight: 700, color: riskColor(p.riskLevel) }}>
                    {p.riskLevel.toUpperCase()}
                  </td>
                  <td style={{ padding: 10, ...trendStyle(p.trend) }}>{p.trend}</td>
                  <td style={{ padding: 10, fontWeight: 800, color: p.escalationRisk ? "#7c2d12" : "#6b7280" }}>
                    {p.escalationRisk ? "YES" : "—"}
                  </td>
                  <td style={{ padding: 10 }}>{p.state}</td>
                  <td style={{ padding: 10 }}>{p.score}</td>
                  <td style={{ padding: 10 }}>{formatDate(p.updatedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <p style={{ marginTop: 10, color: "#6b7280", fontSize: 12 }}>
            Escalation Risk = provider declined for 2 consecutive months (requires at least 3 months of data).
          </p>
        </div>
      </main>
    </>
  );
}

function KPI({ label, value, color }: { label: string; value: number; color?: string }) {
  return (
    <div style={{ padding: 14, borderRadius: 12, border: "1px solid #eee", background: "#fff" }}>
      <div style={{ fontSize: 12, color: "#666" }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 700, marginTop: 6, color: color || "#000" }}>
        {value}
      </div>
    </div>
  );
}
