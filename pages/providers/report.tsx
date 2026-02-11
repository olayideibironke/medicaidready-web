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

function fmt(iso: string | null) {
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

      <main style={{ padding: 28, maxWidth: 1100, margin: "0 auto", fontFamily: "system-ui" }}>
        <div className="noPrint" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => window.print()}
              style={{
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid #111",
                background: "#111",
                color: "#fff",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Print / Save as PDF
            </button>

            <Link href="/providers/analytics">← Back to Analytics</Link>
          </div>

          <div style={{ color: "#555", fontSize: 12 }}>Generated: {fmt(data.generatedAt)}</div>
        </div>

        <header style={{ marginTop: 18 }}>
          <h1 style={{ margin: 0 }}>Compliance Portfolio Report</h1>
          <div style={{ marginTop: 6, color: "#555" }}>
            Generated: <strong>{fmt(data.generatedAt)}</strong>
          </div>
        </header>

        {/* KPI Summary */}
        <section style={{ marginTop: 18, border: "1px solid #e5e7eb", borderRadius: 12, padding: 14 }}>
          <h2 style={{ margin: "0 0 10px" }}>Executive Summary</h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
            <Stat label="Total Providers" value={data.totals.providers} />
            <Stat label="High Risk" value={data.riskSummary.high} accent="#dc2626" />
            <Stat label="Medium Risk" value={data.riskSummary.medium} accent="#f59e0b" />
            <Stat label="Low Risk" value={data.riskSummary.low} accent="#16a34a" />
          </div>

          <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
            <Stat label="Declining" value={data.trendSummary.declining} accent="#dc2626" />
            <Stat label="Escalation Risk" value={data.trendSummary.escalationRisk} accent="#7c2d12" />
            <Stat label="With Updates" value={data.totals.withUpdates} />
            <Stat label="Issues" value={data.totals.withIssues} />
          </div>
        </section>

        {/* Jurisdiction Portfolio */}
        <section style={{ marginTop: 18 }}>
          <h2 style={{ margin: "0 0 10px" }}>Jurisdiction Portfolio</h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            {Object.entries(data.stateSummary).map(([state, s]) => (
              <div key={state} style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 12 }}>
                <div style={{ fontWeight: 800, marginBottom: 6 }}>{state}</div>
                <div style={{ fontSize: 12, color: "#111" }}>Total: {s.total}</div>
                <div style={{ fontSize: 12, color: "#dc2626" }}>High: {s.high}</div>
                <div style={{ fontSize: 12, color: "#f59e0b" }}>Medium: {s.medium}</div>
                <div style={{ fontSize: 12, color: "#16a34a" }}>Low: {s.low}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Provider Table */}
        <section style={{ marginTop: 18 }}>
          <h2 style={{ margin: "0 0 10px" }}>Provider Detail</h2>

          <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #e5e7eb" }}>
            <thead>
              <tr>
                {["Provider", "State", "Risk", "Trend", "Escalation", "Score", "Updated"].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      fontSize: 12,
                      color: "#111",
                      padding: 10,
                      borderBottom: "1px solid #e5e7eb",
                      background: "#f9fafb",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.rows.map((p) => (
                <tr key={p.id} style={{ borderTop: "1px solid #f1f5f9" }}>
                  <td style={{ padding: 10, fontWeight: 700 }}>{p.name}</td>
                  <td style={{ padding: 10 }}>{p.state}</td>
                  <td style={{ padding: 10 }}>{p.riskLevel.toUpperCase()}</td>
                  <td style={{ padding: 10 }}>{p.trend}</td>
                  <td style={{ padding: 10 }}>{p.escalationRisk ? "YES" : "—"}</td>
                  <td style={{ padding: 10 }}>{p.score}</td>
                  <td style={{ padding: 10 }}>{fmt(p.updatedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: 10, fontSize: 11, color: "#6b7280" }}>
            Notes: Trend compares current month score vs last recorded month in <code>data/compliance-history.json</code>.
            Escalation Risk requires two consecutive declines (≥3 months of score history).
          </div>
        </section>

        <footer style={{ marginTop: 22, paddingTop: 12, borderTop: "1px solid #e5e7eb", color: "#6b7280", fontSize: 12 }}>
          MedicaidReady • Compliance Portfolio Report
        </footer>
      </main>
    </>
  );
}

function Stat({ label, value, accent }: { label: string; value: number; accent?: string }) {
  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 12 }}>
      <div style={{ fontSize: 12, color: "#6b7280" }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 800, color: accent || "#111", marginTop: 4 }}>{value}</div>
    </div>
  );
}
