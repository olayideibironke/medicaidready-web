import type { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";

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
  totals: { providers: number; withScore: number; withUpdates: number; withIssues: number };
  riskSummary: { high: number; medium: number; low: number };
  trendSummary: { declining: number; escalationRisk: number };
  stateSummary: StateSummary;
  rows: ProviderRow[];
};

const THEME = {
  bg: "#f7f8fb",
  card: "#ffffff",
  border: "rgba(15, 23, 42, 0.10)",
  text: "#0f172a",
  muted: "#475569",
  link: "#0b3a69",
  shadow: "0 10px 30px rgba(2, 6, 23, 0.08)",
  shadowSoft: "0 6px 18px rgba(2, 6, 23, 0.06)",
  high: "#dc2626",
  medium: "#f59e0b",
  low: "#16a34a",
  warnBg: "#fff7ed",
  warnBorder: "rgba(234, 88, 12, 0.22)",
};

function fmt(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString();
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

function riskColor(level: ProviderRow["riskLevel"]) {
  if (level === "high") return THEME.high;
  if (level === "medium") return THEME.medium;
  return THEME.low;
}

function riskBadge(level: ProviderRow["riskLevel"]) {
  const c = riskColor(level);
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
        fontWeight: 900,
        letterSpacing: 0.3,
        fontSize: 12,
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
      {level.toUpperCase()}
    </span>
  );
}

function trendStyle(trend: ProviderRow["trend"]) {
  if (trend === "↑") return { color: THEME.low, fontWeight: 900 };
  if (trend === "↓") return { color: THEME.high, fontWeight: 900 };
  return { color: "#64748b", fontWeight: 900 };
}

export const getServerSideProps: GetServerSideProps<{ data: AnalyticsPayload }> = async ({ req }) => {
  const proto = (req.headers["x-forwarded-proto"] as string) || "http";
  const host = req.headers.host;
  const baseUrl = `${proto}://${host}`;

  const resp = await fetch(`${baseUrl}/api/providers/analytics`);
  const data = await resp.json();

  return { props: { data } };
};

export default function ProviderReportPage({ data }: { data: AnalyticsPayload }) {
  return (
    <>
      <Head>
        <title>Compliance Portfolio Report • MedicaidReady</title>
      </Head>

      <style>{`
        @media print {
          .noPrint { display: none !important; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          a { color: #000 !important; text-decoration: none !important; }
          table { page-break-inside: auto; }
          tr { page-break-inside: avoid; page-break-after: auto; }
          thead { display: table-header-group; }
        }
      `}</style>

      <main
        style={{
          minHeight: "100vh",
          background: `radial-gradient(1200px 500px at 15% 10%, rgba(11, 58, 105, 0.10), transparent 60%),
                       radial-gradient(900px 420px at 90% 0%, rgba(2, 132, 199, 0.08), transparent 55%),
                       ${THEME.bg}`,
          padding: 24,
          fontFamily: `ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"`,
          color: THEME.text,
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          {/* Top controls */}
          <div
            className="noPrint"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
              padding: "8px 0 14px",
            }}
          >
            <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
              <button
                onClick={() => window.print()}
                style={{
                  padding: "10px 14px",
                  borderRadius: 999,
                  border: `1px solid rgba(15, 23, 42, 0.18)`,
                  background: "#0b1220",
                  color: "#fff",
                  fontWeight: 900,
                  cursor: "pointer",
                  boxShadow: THEME.shadowSoft,
                }}
              >
                Print / Save as PDF
              </button>

              <Link
                href="/providers/analytics"
                style={{
                  color: THEME.link,
                  fontWeight: 900,
                  textDecoration: "none",
                  padding: "10px 12px",
                  borderRadius: 999,
                  border: `1px solid ${THEME.border}`,
                  background: THEME.card,
                  boxShadow: THEME.shadowSoft,
                }}
              >
                ← Back to Analytics
              </Link>
            </div>

            <div style={{ color: THEME.muted, fontSize: 12, fontWeight: 800 }}>Generated: {fmt(data.generatedAt)}</div>
          </div>

          {/* Header */}
          <header
            style={{
              borderRadius: 18,
              border: `1px solid ${THEME.border}`,
              background: THEME.card,
              boxShadow: THEME.shadow,
              padding: "18px 18px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 14, flexWrap: "wrap" }}>
              <div>
                <h1 style={{ margin: 0, fontSize: 34, lineHeight: 1.15, letterSpacing: -0.6 }}>
                  Compliance Portfolio Report
                </h1>
                <div style={{ marginTop: 8, color: THEME.muted, fontSize: 13 }}>
                  Generated: <strong style={{ color: THEME.text }}>{fmt(data.generatedAt)}</strong>
                </div>
              </div>

              <div
                style={{
                  display: "inline-flex",
                  gap: 8,
                  alignItems: "center",
                  padding: "10px 12px",
                  borderRadius: 16,
                  border: `1px solid ${THEME.border}`,
                  background: "rgba(248, 250, 252, 0.9)",
                }}
              >
                <span style={{ fontSize: 12, color: THEME.muted, fontWeight: 900, letterSpacing: 0.4, textTransform: "uppercase" }}>
                  Portfolio
                </span>
                <span style={{ fontWeight: 950, fontSize: 18 }}>{data.totals.providers}</span>
              </div>
            </div>
          </header>

          {/* Executive Summary */}
          <section style={{ marginTop: 16 }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <h2 style={{ margin: 0, fontSize: 18, letterSpacing: -0.2 }}>Executive Summary</h2>
              <div style={{ color: THEME.muted, fontSize: 13 }}>Risk posture & key signals</div>
            </div>

            <div
              style={{
                marginTop: 12,
                borderRadius: 18,
                border: `1px solid ${THEME.border}`,
                background: THEME.card,
                boxShadow: THEME.shadowSoft,
                padding: 16,
              }}
            >
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
                <Stat label="Total Providers" value={data.totals.providers} />
                <Stat label="High Risk" value={data.riskSummary.high} accent={THEME.high} />
                <Stat label="Medium Risk" value={data.riskSummary.medium} accent={THEME.medium} />
                <Stat label="Low Risk" value={data.riskSummary.low} accent={THEME.low} />
                <Stat label="Declining" value={data.trendSummary.declining} accent={THEME.high} />
                <Stat label="Escalation Risk" value={data.trendSummary.escalationRisk} accent="#7c2d12" />
                <Stat label="With Updates" value={data.totals.withUpdates} />
                <Stat label="Issues" value={data.totals.withIssues} />
              </div>
            </div>
          </section>

          {/* Jurisdiction Portfolio */}
          <section style={{ marginTop: 16 }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <h2 style={{ margin: 0, fontSize: 18, letterSpacing: -0.2 }}>Jurisdiction Portfolio</h2>
              <div style={{ color: THEME.muted, fontSize: 13 }}>Distribution by state / jurisdiction</div>
            </div>

            <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
              {Object.entries(data.stateSummary).map(([state, s]) => (
                <div
                  key={state}
                  style={{
                    borderRadius: 16,
                    border: `1px solid ${THEME.border}`,
                    background: THEME.card,
                    boxShadow: THEME.shadowSoft,
                    padding: 14,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                    <div style={{ fontWeight: 950, letterSpacing: -0.2 }}>{state}</div>
                    <div style={{ fontSize: 12, color: THEME.muted, fontWeight: 900 }}>Total: {s.total}</div>
                  </div>

                  <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                    <MiniStat label="High" value={s.high} color={THEME.high} />
                    <MiniStat label="Medium" value={s.medium} color={THEME.medium} />
                    <MiniStat label="Low" value={s.low} color={THEME.low} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Provider Detail */}
          <section style={{ marginTop: 16 }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <h2 style={{ margin: 0, fontSize: 18, letterSpacing: -0.2 }}>Provider Detail</h2>
              <div style={{ color: THEME.muted, fontSize: 13 }}>Provider-by-provider view</div>
            </div>

            <div
              style={{
                marginTop: 12,
                borderRadius: 18,
                border: `1px solid ${THEME.border}`,
                background: THEME.card,
                boxShadow: THEME.shadow,
                overflow: "hidden",
              }}
            >
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, minWidth: 900 }}>
                  <thead>
                    <tr>
                      {["Provider", "State", "Risk", "Trend", "Escalation", "Score", "Updated"].map((h) => (
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
                            background: "rgba(248, 250, 252, 0.9)",
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {data.rows.map((p, idx) => {
                      const zebra = idx % 2 === 0 ? "#ffffff" : "rgba(248, 250, 252, 0.7)";
                      const rowBg = p.escalationRisk ? THEME.warnBg : zebra;
                      const rowBorder = p.escalationRisk ? THEME.warnBorder : "rgba(15, 23, 42, 0.06)";

                      return (
                        <tr key={p.id} style={{ background: rowBg }}>
                          <td style={{ padding: "14px 14px", borderBottom: `1px solid ${rowBorder}` }}>
                            <div style={{ fontWeight: 950, color: THEME.text }}>{p.name}</div>
                            <div style={{ marginTop: 4, fontSize: 12, color: THEME.muted }}>{p.id}</div>
                          </td>

                          <td style={{ padding: "14px 14px", borderBottom: `1px solid ${rowBorder}`, fontWeight: 900 }}>
                            {p.state}
                          </td>

                          <td style={{ padding: "14px 14px", borderBottom: `1px solid ${rowBorder}` }}>{riskBadge(p.riskLevel)}</td>

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
                              }}
                            >
                              {p.escalationRisk ? "YES" : "—"}
                            </span>
                          </td>

                          <td style={{ padding: "14px 14px", borderBottom: `1px solid ${rowBorder}`, fontWeight: 950 }}>
                            {p.score}
                          </td>

                          <td style={{ padding: "14px 14px", borderBottom: `1px solid ${rowBorder}`, color: THEME.muted }}>
                            {fmt(p.updatedAt)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div style={{ padding: "14px 16px", color: THEME.muted, fontSize: 12, borderTop: `1px solid ${THEME.border}` }}>
                Notes: Trend compares current month score vs the last recorded month in the provider history dataset. Escalation Risk
                requires two consecutive declines (≥3 months of score history).
              </div>
            </div>
          </section>

          <footer style={{ marginTop: 18, paddingTop: 12, borderTop: `1px solid ${THEME.border}`, color: THEME.muted, fontSize: 12 }}>
            MedicaidReady • Compliance Portfolio Report
          </footer>

          <div style={{ height: 22 }} />
        </div>
      </main>
    </>
  );
}

function Stat({ label, value, accent }: { label: string; value: number; accent?: string }) {
  const bar = accent ? `linear-gradient(90deg, ${hexToRgba(accent, 0.95)}, ${hexToRgba(accent, 0.55)})` : "transparent";

  return (
    <div
      style={{
        position: "relative",
        border: `1px solid ${THEME.border}`,
        borderRadius: 16,
        padding: 14,
        background: THEME.card,
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
          width: accent ? 4 : 0,
          background: accent ? bar : "transparent",
        }}
      />
      <div style={{ fontSize: 12, color: THEME.muted, fontWeight: 900, letterSpacing: 0.2 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 950, color: accent || THEME.text, marginTop: 8 }}>{value}</div>
    </div>
  );
}

function MiniStat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div
      style={{
        borderRadius: 14,
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
