import Head from "next/head";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { GetServerSideProps } from "next";

type ProviderRow = {
  id: string;
  name?: string | null;
  status?: string | null;
  state?: string | null;
  updatedAt?: string | null;
  score?: number | null;
  riskLevel?: "low" | "medium" | "high" | string | null;
  trend?: "↑" | "↓" | "→" | string | null;
  issuesCount?: number | null;
};

type ProvidersApiResponse =
  | ProviderRow[]
  | {
      providers?: ProviderRow[];
      data?: ProviderRow[];
      items?: ProviderRow[];
      rows?: ProviderRow[];
      results?: ProviderRow[];
      [key: string]: unknown;
    };

type PageProps = {
  initialProviders: ProviderRow[];
};

function safeText(v: unknown): string {
  if (v === null || v === undefined) return "";
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  return "";
}

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString();
}

function normalizeProviders(payload: ProvidersApiResponse): ProviderRow[] {
  if (Array.isArray(payload)) return payload;

  const candidates = [payload.providers, payload.data, payload.items, payload.rows, payload.results].filter(
    Boolean
  ) as ProviderRow[][];

  if (candidates.length > 0 && Array.isArray(candidates[0])) return candidates[0];
  return [];
}

function riskTone(risk: ProviderRow["riskLevel"]) {
  const r = (risk || "").toString().toLowerCase();
  if (r === "high") return "badge badge-red";
  if (r === "medium") return "badge badge-amber";
  if (r === "low") return "badge badge-green";
  return "badge badge-gray";
}

function statusTone(status: ProviderRow["status"]) {
  const s = (status || "").toString().toLowerCase();
  if (s.includes("active")) return "badge badge-green";
  if (s.includes("pending")) return "badge badge-amber";
  if (s.includes("paused") || s.includes("hold")) return "badge badge-gray";
  if (s.includes("inactive") || s.includes("disabled")) return "badge badge-red";
  return "badge badge-gray";
}

/**
 * Admin route protection (frontend-only):
 * We check /api/providers server-side using the incoming cookies.
 * If the API is protected and returns 401/403, we redirect to /signin.
 * No backend logic changes.
 */
export const getServerSideProps: GetServerSideProps<PageProps> = async (ctx) => {
  const req = ctx.req;
  const host = req.headers["x-forwarded-host"] || req.headers.host || "localhost:3000";
  const proto = (req.headers["x-forwarded-proto"] as string) || "http";

  const url = `${proto}://${host}/api/providers`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        // pass cookies through so the API can auth the request
        cookie: req.headers.cookie || "",
      },
    });

    if (res.status === 401 || res.status === 403) {
      return {
        redirect: {
          destination: `/signin?next=${encodeURIComponent("/admin/providers")}`,
          permanent: false,
        },
      };
    }

    // If API is down or returns unexpected error, allow page to render
    // (still read-only) and client fetch will show error box.
    if (!res.ok) {
      return { props: { initialProviders: [] } };
    }

    const json = (await res.json()) as ProvidersApiResponse;
    const providers = normalizeProviders(json);

    return { props: { initialProviders: providers } };
  } catch {
    return { props: { initialProviders: [] } };
  }
};

export default function AdminProvidersPage({ initialProviders }: PageProps) {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<ProviderRow[]>(initialProviders || []);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState<"all" | "low" | "medium" | "high">("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [logoOk, setLogoOk] = useState(true);

  async function refresh() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/providers", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      // If someone loses session while on page, send them to sign in.
      if (res.status === 401 || res.status === 403) {
        window.location.href = `/signin?next=${encodeURIComponent("/admin/providers")}`;
        return;
      }

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`GET /api/providers failed (${res.status})${text ? `: ${text}` : ""}`);
      }

      const json = (await res.json()) as ProvidersApiResponse;
      setRows(normalizeProviders(json));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load providers.");
    } finally {
      setLoading(false);
    }
  }

  // If SSR gave no data, try client load once (still read-only).
  useEffect(() => {
    if (rows.length > 0) return;
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const statusOptions = useMemo(() => {
    const set = new Set<string>();
    for (const r of rows) {
      const s = safeText(r.status).trim();
      if (s) set.add(s);
    }
    return ["all", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [rows]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows
      .filter((r) => {
        if (riskFilter !== "all") {
          const rr = (r.riskLevel || "").toString().toLowerCase();
          if (rr !== riskFilter) return false;
        }
        if (statusFilter !== "all") {
          if ((r.status || "").toString() !== statusFilter) return false;
        }
        if (!q) return true;

        const hay = [r.id, r.name || "", r.state || "", r.status || "", r.riskLevel || ""].join(" ").toLowerCase();

        return hay.includes(q);
      })
      .sort((a, b) => {
        const ad = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
        const bd = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
        return bd - ad;
      });
  }, [rows, query, riskFilter, statusFilter]);

  const totals = useMemo(() => {
    const total = rows.length;
    const high = rows.filter((r) => (r.riskLevel || "").toString().toLowerCase() === "high").length;
    const medium = rows.filter((r) => (r.riskLevel || "").toString().toLowerCase() === "medium").length;
    const low = rows.filter((r) => (r.riskLevel || "").toString().toLowerCase() === "low").length;
    return { total, high, medium, low };
  }, [rows]);

  return (
    <>
      <Head>
        <title>Admin Providers — MedicaidReady</title>
        <meta name="description" content="Admin providers overview dashboard." />
      </Head>

      <div className="page">
        <header className="topbar">
          <div className="topbar-inner">
            <div className="brand">
              <div className="brand-mark" aria-hidden="true">
                {logoOk ? (
                  <img
                    src="/favicon.svg"
                    alt=""
                    className="brand-logo"
                    onError={() => setLogoOk(false)}
                  />
                ) : (
                  <span className="brand-fallback">MR</span>
                )}
              </div>

              <div className="brand-text">
                <div className="brand-title">MedicaidReady Admin</div>
                <div className="brand-subtitle">Providers Overview</div>
              </div>
            </div>

            <nav className="nav">
              <Link className="btn btn-ghost" href="/">
                Home
              </Link>
              <Link className="btn btn-primary" href="/pricing">
                Pricing
              </Link>
            </nav>
          </div>
        </header>

        <main className="container">
          <div className="header">
            <div>
              <h1 className="h1">Providers</h1>
              <p className="muted">Read-only operational overview. Click a provider to open the dashboard.</p>
            </div>

            <button className="btn btn-ghost" onClick={refresh} type="button" disabled={loading}>
              {loading ? "Refreshing…" : "Refresh"}
            </button>
          </div>

          <section className="stats">
            <div className="card">
              <div className="label">Total</div>
              <div className="value">{totals.total}</div>
            </div>
            <div className="card">
              <div className="label">High Risk</div>
              <div className="value">{totals.high}</div>
            </div>
            <div className="card">
              <div className="label">Medium Risk</div>
              <div className="value">{totals.medium}</div>
            </div>
            <div className="card">
              <div className="label">Low Risk</div>
              <div className="value">{totals.low}</div>
            </div>
          </section>

          <section className="card pad">
            <div className="controls">
              <div className="field span-6">
                <label className="field-label">Search</label>
                <input
                  className="input"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by provider name, id, state, status..."
                />
              </div>

              <div className="field span-3">
                <label className="field-label">Risk</label>
                <select
                  className="select"
                  value={riskFilter}
                  onChange={(e) => setRiskFilter(e.target.value as "all" | "low" | "medium" | "high")}
                >
                  <option value="all">All</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              <div className="field span-3">
                <label className="field-label">Status</label>
                <select className="select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>
                      {s === "all" ? "All" : s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <section className="card">
            <div className="table-head">
              <div className="table-title">Providers ({filtered.length})</div>
              <div className="table-meta">
                Data source: <span className="mono">GET /api/providers</span>
              </div>
            </div>

            {error ? (
              <div className="empty">
                <div className="error-box">
                  <div className="error-title">Failed to load providers</div>
                  <div className="error-msg">{error}</div>
                  <div className="error-note">No backend changes were made. This page is read-only.</div>
                </div>
              </div>
            ) : filtered.length === 0 ? (
              <div className="empty">{loading ? "Loading providers…" : "No providers match your filters."}</div>
            ) : (
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Provider</th>
                      <th>State</th>
                      <th>Status</th>
                      <th>Risk</th>
                      <th>Score</th>
                      <th>Trend</th>
                      <th>Issues</th>
                      <th>Last Updated</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((r) => (
                      <tr key={r.id}>
                        <td>
                          <div className="prov">
                            <div className="prov-name">{safeText(r.name) || "—"}</div>
                            <div className="prov-id mono">{r.id}</div>
                          </div>
                        </td>
                        <td>{safeText(r.state) || "—"}</td>
                        <td>
                          <span className={statusTone(r.status)}>{safeText(r.status) || "—"}</span>
                        </td>
                        <td>
                          <span className={riskTone(r.riskLevel)}>{safeText(r.riskLevel) || "—"}</span>
                        </td>
                        <td>{typeof r.score === "number" ? r.score : "—"}</td>
                        <td>{safeText(r.trend) || "—"}</td>
                        <td>{typeof r.issuesCount === "number" ? r.issuesCount : "—"}</td>
                        <td>{formatDate(r.updatedAt)}</td>
                        <td className="right">
                          <Link className="btn btn-primary" href={`/providers/${encodeURIComponent(r.id)}`}>
                            Open
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <div className="footnote">Tip: This page is intentionally read-only to avoid changing backend behavior.</div>
        </main>
      </div>

      <style jsx global>{`
        :root {
          --bg: #ffffff;
          --text: #0f172a;
          --muted: #64748b;
          --border: #e2e8f0;
          --shadow: 0 1px 2px rgba(15, 23, 42, 0.06);
          --radius: 16px;
          --radius-sm: 12px;
          --primary: #0f172a;
          --primaryHover: #1f2937;
          --danger: #b91c1c;
          --dangerBg: #fef2f2;
          --amber: #b45309;
          --amberBg: #fffbeb;
          --green: #047857;
          --greenBg: #ecfdf5;
          --gray: #334155;
          --grayBg: #f8fafc;
        }

        .page {
          min-height: 100vh;
          background: var(--bg);
          color: var(--text);
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial,
            "Apple Color Emoji", "Segoe UI Emoji";
        }

        .topbar {
          border-bottom: 1px solid var(--border);
          background: #fff;
        }

        .topbar-inner {
          max-width: 1120px;
          margin: 0 auto;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .brand-mark {
          width: 40px;
          height: 40px;
          border-radius: 14px;
          background: var(--primary);
          display: grid;
          place-items: center;
          overflow: hidden;
        }

        .brand-logo {
          width: 28px;
          height: 28px;
          display: block;
        }

        .brand-fallback {
          color: #fff;
          font-weight: 900;
          letter-spacing: -0.02em;
        }

        .brand-title {
          font-size: 14px;
          font-weight: 700;
          line-height: 1.1;
        }

        .brand-subtitle {
          font-size: 12px;
          color: var(--muted);
          margin-top: 2px;
        }

        .nav {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .container {
          max-width: 1120px;
          margin: 0 auto;
          padding: 28px 20px 36px;
        }

        .header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 18px;
        }

        .h1 {
          font-size: 28px;
          font-weight: 800;
          letter-spacing: -0.03em;
          margin: 0;
        }

        .muted {
          margin: 6px 0 0;
          color: var(--muted);
          font-size: 14px;
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
          margin-bottom: 14px;
        }

        .card {
          border: 1px solid var(--border);
          border-radius: var(--radius);
          background: #fff;
          box-shadow: var(--shadow);
        }

        .pad {
          padding: 14px;
        }

        .label {
          font-size: 12px;
          color: var(--muted);
          font-weight: 700;
          padding: 14px 14px 0;
        }

        .value {
          font-size: 26px;
          font-weight: 800;
          padding: 6px 14px 14px;
          letter-spacing: -0.03em;
        }

        .controls {
          display: grid;
          grid-template-columns: repeat(12, minmax(0, 1fr));
          gap: 12px;
        }

        .field {
          display: flex;
          flex-direction: column;
        }

        .span-6 {
          grid-column: span 6 / span 6;
        }
        .span-3 {
          grid-column: span 3 / span 3;
        }

        .field-label {
          font-size: 12px;
          color: var(--muted);
          font-weight: 700;
          margin-bottom: 6px;
        }

        .input,
        .select {
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 10px 12px;
          font-size: 14px;
          outline: none;
          box-shadow: var(--shadow);
          background: #fff;
        }

        .input:focus,
        .select:focus {
          border-color: #cbd5e1;
        }

        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 14px;
          padding: 10px 12px;
          font-size: 14px;
          font-weight: 700;
          text-decoration: none;
          border: 1px solid transparent;
          cursor: pointer;
          user-select: none;
          box-shadow: var(--shadow);
          white-space: nowrap;
        }

        .btn-ghost {
          background: #fff;
          border-color: var(--border);
          color: var(--text);
        }

        .btn-ghost:hover {
          background: #f8fafc;
        }

        .btn-primary {
          background: var(--primary);
          color: #fff;
        }

        .btn-primary:hover {
          background: var(--primaryHover);
        }

        .table-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 12px 14px;
          border-bottom: 1px solid var(--border);
        }

        .table-title {
          font-weight: 800;
        }

        .table-meta {
          font-size: 12px;
          color: var(--muted);
        }

        .mono {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono",
            "Courier New", monospace;
          font-weight: 600;
        }

        .table-wrap {
          overflow-x: auto;
        }

        .table {
          width: 100%;
          min-width: 980px;
          border-collapse: collapse;
        }

        .table thead th {
          text-align: left;
          font-size: 12px;
          color: var(--muted);
          font-weight: 800;
          background: #f8fafc;
          padding: 10px 14px;
          border-bottom: 1px solid var(--border);
        }

        .table tbody td {
          padding: 12px 14px;
          border-bottom: 1px solid var(--border);
          font-size: 14px;
          color: var(--text);
          vertical-align: top;
        }

        .table tbody tr:hover td {
          background: #fafcff;
        }

        .right {
          text-align: right;
        }

        .prov {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .prov-name {
          font-weight: 800;
        }

        .prov-id {
          font-size: 12px;
          color: var(--muted);
        }

        .badge {
          display: inline-flex;
          align-items: center;
          border-radius: 999px;
          padding: 6px 10px;
          font-size: 12px;
          font-weight: 800;
          border: 1px solid var(--border);
          background: var(--grayBg);
          color: var(--gray);
        }

        .badge-red {
          background: var(--dangerBg);
          color: var(--danger);
          border-color: #fecaca;
        }

        .badge-amber {
          background: var(--amberBg);
          color: var(--amber);
          border-color: #fde68a;
        }

        .badge-green {
          background: var(--greenBg);
          color: var(--green);
          border-color: #a7f3d0;
        }

        .badge-gray {
          background: var(--grayBg);
          color: var(--gray);
          border-color: var(--border);
        }

        .empty {
          padding: 28px 14px;
          text-align: center;
          color: var(--muted);
          font-size: 14px;
        }

        .error-box {
          max-width: 720px;
          margin: 0 auto;
          border: 1px solid #fecaca;
          background: var(--dangerBg);
          color: var(--danger);
          border-radius: var(--radius-sm);
          padding: 14px;
          text-align: left;
        }

        .error-title {
          font-weight: 900;
        }

        .error-msg {
          margin-top: 6px;
          word-break: break-word;
        }

        .error-note {
          margin-top: 10px;
          font-size: 12px;
          color: #991b1b;
        }

        .footnote {
          margin-top: 12px;
          font-size: 12px;
          color: var(--muted);
        }

        @media (max-width: 900px) {
          .stats {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 640px) {
          .header {
            flex-direction: column;
            align-items: flex-start;
          }
          .span-6,
          .span-3 {
            grid-column: span 12 / span 12;
          }
        }
      `}</style>
    </>
  );
}
