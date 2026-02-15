// pages/providers/analytics.tsx
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

const THEME = {
  bg: "#f7f8fb",
  card: "#ffffff",
  border: "rgba(15, 23, 42, 0.10)",
  text: "#0f172a",
  muted: "#475569",
  link: "#0b3a69",
  linkHover: "#062a4e",
  shadow: "0 12px 34px rgba(2, 6, 23, 0.10)",
  shadowSoft: "0 8px 22px rgba(2, 6, 23, 0.08)",
  high: "#dc2626",
  medium: "#f59e0b",
  low: "#16a34a",
  warnBg: "#fff7ed",
  warnBorder: "rgba(234, 88, 12, 0.22)",
};

function riskColor(level: ProviderRow["riskLevel"]) {
  if (level === "high") return THEME.high;
  if (level === "medium") return THEME.medium;
  return THEME.low;
}

function riskBadge(level: ProviderRow["riskLevel"]) {
  const c = riskColor(level);
  const label = level.toUpperCase();
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 10px",
        borderRadius: 999,
        border: `1px solid ${hexToRgba(c, 0.25)}`,
        background: hexToRgba(c, 0.08),
        color: c,
        fontWeight: 800,
        letterSpacing: 0.3,
        fontSize: 12,
        whiteSpace: "nowrap",
      }}
    >
      <span
        aria-hidden
        style={{
          width: 8,
          height: 8,
          borderRadius: 999,
          background: c,
          boxShadow: `0 0 0 3px ${hexToRgba(c, 0.18)}`,
        }}
      />
      {label}
    </span>
  );
}

function trendStyle(trend: "↑" | "↓" | "→") {
  if (trend === "↑") return { color: THEME.low, fontWeight: 950 };
  if (trend === "↓") return { color: THEME.high, fontWeight: 950 };
  return { color: "#64748b", fontWeight: 950 };
}

function hexToRgba(hex: string, alpha: number) {
  const h = hex.replace("#", "").trim();
  const full = h.length === 3 ? h.split("").map((x) => x + x).join("") : h;
  const num = parseInt(full, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function AnalyticsPage({ data }: { data: AnalyticsPayload }) {
  const [sortKey, setSortKey] = useState("risk_desc");

  const processed = useMemo(() => {
    const rows = [...data.rows];

    rows.sort((a, b) => {
      if (sortKey === "escalation_desc") {
        if (b.escalationRisk !== a.escalationRisk) return Number(b.escalationRisk) - Number(a.escalationRisk);
        if (b.declining !== a.declining) return Number(b.declining) - Number(a.declining);
        const order: Record<ProviderRow["riskLevel"], number> = { high: 3, medium: 2, low: 1 };
        return order[b.riskLevel] - order[a.riskLevel];
      }

      if (sortKey === "risk_desc") {
        const order: Record<ProviderRow["riskLevel"], number> = { high: 3, medium: 2, low: 1 };
        return order[b.riskLevel] - order[a.riskLevel];
      }

      if (sortKey === "trend_desc") {
        const order: Record<ProviderRow["trend"], number> = { "↓": 3, "→": 2, "↑": 1 };
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

      <main
        style={{
          minHeight: "100vh",
          background: `radial-gradient(1200px 520px at 14% 10%, rgba(11, 58, 105, 0.12), transparent 60%),
                       radial-gradient(900px 420px at 90% 0%, rgba(2, 132, 199, 0.10), transparent 55%),
                       linear-gradient(180deg, rgba(255,255,255,0.65), rgba(255,255,255,0.0) 42%),
                       ${THEME.bg}`,
          padding: 24,
          fontFamily: `ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"`,
          color: THEME.text,
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
          textRendering: "optimizeLegibility",
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          {/* Top Header Card */}
          <div
            style={{
              position: "sticky",
              top: 16,
              zIndex: 20,
              marginBottom: 16,
            }}
          >
            <div
              style={{
                borderRadius: 18,
                border: `1px solid ${THEME.border}`,
                background: "rgba(255,255,255,0.82)",
                backdropFilter: "blur(12px)",
                boxShadow: THEME.shadowSoft,
                padding: "14px 14px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 14,
                  flexWrap: "wrap",
                }}
              >
                <div style={{ minWidth: 260 }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
                    <h1 style={{ margin: 0, fontSize: 34, lineHeight: 1.08, letterSpacing: -0.9, fontWeight: 950 }}>
                      Analytics Overview
                    </h1>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "6px 10px",
                        borderRadius: 999,
                        border: `1px solid rgba(15, 23, 42, 0.12)`,
                        background: "rgba(248,250,252,0.75)",
                        color: "#334155",
                        fontSize: 12,
                        fontWeight: 800,
                      }}
                    >
                      Generated{" "}
                      <strong style={{ color: THEME.text, fontWeight: 950 }}>{formatDate(data.generatedAt)}</strong>
                    </span>
                  </div>
                  <div style={{ marginTop: 6, color: THEME.muted, fontSize: 13, lineHeight: 1.5 }}>
                    Portfolio-level view across risk, trends, and jurisdictions.
                  </div>
                </div>

                <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                  <Link href="/providers/report" style={{ textDecoration: "none" }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "10px 14px",
                        borderRadius: 999,
                        border: `1px solid rgba(11, 58, 105, 0.32)`,
                        background: "linear-gradient(135deg, #0b3a69, #0284c7)",
                        color: "#fff",
                        fontWeight: 900,
                        boxShadow: THEME.shadowSoft,
                        whiteSpace: "nowrap",
                      }}
                    >
                      Export Report (Print/PDF)
                    </span>
                  </Link>

                  <Link
                    href="/providers"
                    style={{
                      color: "#0f172a",
                      fontWeight: 900,
                      textDecoration: "none",
                      padding: "10px 12px",
                      borderRadius: 999,
                      border: `1px solid ${THEME.border}`,
                      background: "rgba(255,255,255,0.95)",
                      boxShadow: THEME.shadowSoft,
                      whiteSpace: "nowrap",
                    }}
                  >
                    ← Back to Providers
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* KPI Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: 12,
            }}
          >
            <KPI label="Total Providers" value={data.totals.providers} />
            <KPI label="High Risk" value={data.riskSummary.high} accent={THEME.high} />
            <KPI label="Medium Risk" value={data.riskSummary.medium} accent={THEME.medium} />
            <KPI label="Low Risk" value={data.riskSummary.low} accent={THEME.low} />
            <KPI label="Declining" value={data.trendSummary.declining} accent={THEME.high} />
            <KPI label="Escalation Risk" value={data.trendSummary.escalationRisk} accent="#7c2d12" />
            <KPI label="With Updates" value={data.totals.withUpdates} />
            <KPI label="Issues" value={data.totals.withIssues} />
          </div>

          {/* Jurisdiction Portfolio */}
          <section style={{ marginTop: 26 }}>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <h2 style={{ margin: 0, fontSize: 22, letterSpacing: -0.3, fontWeight: 950 }}>Jurisdiction Portfolio</h2>
              <div style={{ color: THEME.muted, fontSize: 13 }}>Distribution by state / jurisdiction</div>
            </div>

            <div
              style={{
                marginTop: 12,
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
                gap: 14,
              }}
            >
              {Object.entries(data.stateSummary).map(([state, summary]) => (
                <div
                  key={state}
                  style={{
                    border: `1px solid ${THEME.border}`,
                    borderRadius: 18,
                    padding: 16,
                    background: "rgba(255,255,255,0.95)",
                    boxShadow: THEME.shadowSoft,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                    <h3 style={{ margin: 0, fontSize: 16, letterSpacing: -0.3, fontWeight: 950 }}>{state}</h3>
                    <span style={{ fontSize: 12, color: THEME.muted, fontWeight: 900 }}>Total: {summary.total}</span>
                  </div>

                  <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                    <MiniStat label="High" value={summary.high} color={THEME.high} />
                    <MiniStat label="Medium" value={summary.medium} color={THEME.medium} />
                    <MiniStat label="Low" value={summary.low} color={THEME.low} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Sort + Legend */}
          <div
            style={{
              marginTop: 22,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <span style={{ fontWeight: 950, letterSpacing: -0.2 }}>Sort</span>
              <select
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value)}
                style={{
                  padding: "10px 12px",
                  borderRadius: 12,
                  border: `1px solid ${THEME.border}`,
                  background: "rgba(255,255,255,0.96)",
                  color: THEME.text,
                  fontWeight: 800,
                  boxShadow: THEME.shadowSoft,
                  outline: "none",
                }}
              >
                <option value="escalation_desc">Escalation Risk (first)</option>
                <option value="risk_desc">Risk Severity</option>
                <option value="trend_desc">Trend (Declining first)</option>
                <option value="updated_desc">Recently Updated</option>
                <option value="score_desc">Score (High → Low)</option>
              </select>

              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 10px",
                  borderRadius: 999,
                  border: `1px solid rgba(234, 88, 12, 0.22)`,
                  background: "rgba(255, 247, 237, 0.85)",
                  color: "#7c2d12",
                  fontWeight: 900,
                  fontSize: 12,
                }}
              >
                Escalation Risk = 2 declining months
              </span>
            </div>

            <div style={{ color: THEME.muted, fontSize: 13 }}>
              Escalation Risk needs <strong>3+ months</strong> of data to compute
            </div>
          </div>

          {/* Table */}
          <div
            style={{
              marginTop: 14,
              borderRadius: 20,
              border: `1px solid ${THEME.border}`,
              background: "rgba(255,255,255,0.95)",
              boxShadow: THEME.shadow,
              overflow: "hidden",
            }}
          >
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, minWidth: 900 }}>
                <thead>
                  <tr>
                    {["Provider", "Status", "Risk", "Trend", "Escalation", "State", "Score", "Updated"].map((h) => (
                      <th
                        key={h}
                        style={{
                          textAlign: "left",
                          padding: "14px 14px",
                          fontSize: 12,
                          letterSpacing: 0.6,
                          textTransform: "uppercase",
                          color: "#64748b",
                          borderBottom: `1px solid ${THEME.border}`,
                          background: "rgba(248, 250, 252, 0.92)",
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {processed.map((p, idx) => {
                    const zebra = idx % 2 === 0 ? "rgba(255,255,255,0.98)" : "rgba(248, 250, 252, 0.75)";
                    const rowBg = p.escalationRisk ? "rgba(255, 247, 237, 0.72)" : zebra;
                    const rowBorder = p.escalationRisk ? THEME.warnBorder : "rgba(15, 23, 42, 0.06)";

                    return (
                      <tr key={p.id} style={{ background: rowBg }}>
                        <td style={{ padding: "14px 14px", borderBottom: `1px solid ${rowBorder}` }}>
                          <Link
                            href={`/providers/${p.id}`}
                            style={{
                              color: THEME.link,
                              fontWeight: 950,
                              textDecoration: "none",
                            }}
                            onMouseEnter={(e) => {
                              (e.currentTarget as HTMLAnchorElement).style.color = THEME.linkHover;
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLAnchorElement).style.color = THEME.link;
                            }}
                          >
                            {p.name}
                          </Link>
                          <div style={{ marginTop: 4, fontSize: 12, color: THEME.muted }}>{p.id}</div>
                        </td>

                        <td style={{ padding: "14px 14px", borderBottom: `1px solid ${rowBorder}` }}>
                          <span style={{ fontWeight: 900, color: "#0f172a" }}>{p.status}</span>
                        </td>

                        <td style={{ padding: "14px 14px", borderBottom: `1px solid ${rowBorder}` }}>
                          {riskBadge(p.riskLevel)}
                        </td>

                        <td style={{ padding: "14px 14px", borderBottom: `1px solid ${rowBorder}` }}>
                          <span style={{ ...trendStyle(p.trend), fontSize: 16 }}>{p.trend}</span>
                        </td>

                        <td style={{ padding: "14px 14px", borderBottom: `1px solid ${rowBorder}` }}>
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              padding: "6px 10px",
                              borderRadius: 999,
                              border: `1px solid ${p.escalationRisk ? THEME.warnBorder : THEME.border}`,
                              background: p.escalationRisk ? "rgba(234, 88, 12, 0.10)" : "rgba(148, 163, 184, 0.12)",
                              color: p.escalationRisk ? "#7c2d12" : "#64748b",
                              fontWeight: 950,
                              fontSize: 12,
                              whiteSpace: "nowrap",
                            }}
                          >
                            {p.escalationRisk ? "YES" : "—"}
                          </span>
                        </td>

                        <td style={{ padding: "14px 14px", borderBottom: `1px solid ${rowBorder}` }}>
                          <span style={{ fontWeight: 900 }}>{p.state}</span>
                        </td>

                        <td style={{ padding: "14px 14px", borderBottom: `1px solid ${rowBorder}` }}>
                          <span style={{ fontWeight: 950 }}>{p.score}</span>
                        </td>

                        <td style={{ padding: "14px 14px", borderBottom: `1px solid ${rowBorder}`, color: THEME.muted }}>
                          {formatDate(p.updatedAt)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div
              style={{
                padding: "14px 16px",
                color: THEME.muted,
                fontSize: 12,
                borderTop: `1px solid ${THEME.border}`,
                background: "rgba(248,250,252,0.75)",
              }}
            >
              Tip: click a provider name to open the provider dashboard.
            </div>
          </div>

          <div style={{ height: 28 }} />
        </div>
      </main>
    </>
  );
}

function KPI({ label, value, accent }: { label: string; value: number; accent?: string }) {
  const bar = accent ? `linear-gradient(180deg, ${hexToRgba(accent, 0.95)}, ${hexToRgba(accent, 0.55)})` : "transparent";

  return (
    <div
      style={{
        position: "relative",
        padding: 16,
        borderRadius: 18,
        border: `1px solid ${THEME.border}`,
        background: "rgba(255,255,255,0.95)",
        boxShadow: THEME.shadowSoft,
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: accent ? 5 : 0,
          background: accent ? bar : "transparent",
        }}
      />
      <div style={{ fontSize: 12, color: THEME.muted, fontWeight: 900, letterSpacing: 0.3 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 950, marginTop: 8, color: accent || THEME.text }}>{value}</div>
    </div>
  );
}

function MiniStat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div
      style={{
        borderRadius: 16,
        border: `1px solid ${hexToRgba(color, 0.22)}`,
        background: hexToRgba(color, 0.08),
        padding: "10px 12px",
      }}
    >
      <div style={{ fontSize: 12, color: "#475569", fontWeight: 950 }}>{label}</div>
      <div style={{ marginTop: 4, fontSize: 18, fontWeight: 950, color }}>{value}</div>
    </div>
  );
}
