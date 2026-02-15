import Head from "next/head";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

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

function riskBadge(risk: ProviderRow["riskLevel"]) {
  const r = (risk || "").toString().toLowerCase();
  const base =
    "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium";
  if (r === "high")
    return `${base} border-red-200 bg-red-50 text-red-700`;
  if (r === "medium")
    return `${base} border-amber-200 bg-amber-50 text-amber-700`;
  if (r === "low")
    return `${base} border-emerald-200 bg-emerald-50 text-emerald-700`;
  return `${base} border-slate-200 bg-slate-50 text-slate-700`;
}

function statusBadge(status: ProviderRow["status"]) {
  const s = (status || "").toString().toLowerCase();
  const base =
    "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium";
  if (s.includes("active"))
    return `${base} border-emerald-200 bg-emerald-50 text-emerald-700`;
  if (s.includes("pending"))
    return `${base} border-amber-200 bg-amber-50 text-amber-700`;
  if (s.includes("paused") || s.includes("hold"))
    return `${base} border-slate-200 bg-slate-50 text-slate-700`;
  if (s.includes("inactive") || s.includes("disabled"))
    return `${base} border-red-200 bg-red-50 text-red-700`;
  return `${base} border-slate-200 bg-white text-slate-700`;
}

function normalizeProviders(payload: ProvidersApiResponse): ProviderRow[] {
  if (Array.isArray(payload)) return payload;

  const candidates = [
    payload.providers,
    payload.data,
    payload.items,
    payload.rows,
    payload.results,
  ].filter(Boolean) as ProviderRow[][];

  if (candidates.length > 0 && Array.isArray(candidates[0])) {
    return candidates[0];
  }

  return [];
}

export default function AdminProvidersPage() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<ProviderRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState<"all" | "low" | "medium" | "high">(
    "all"
  );
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/providers", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(
            `GET /api/providers failed (${res.status})${text ? `: ${text}` : ""}`
          );
        }

        const json = (await res.json()) as ProvidersApiResponse;
        const providers = normalizeProviders(json);

        if (!alive) return;
        setRows(providers);
      } catch (e: unknown) {
        if (!alive) return;
        setError(e instanceof Error ? e.message : "Failed to load providers.");
        setRows([]);
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
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

        const hay = [
          r.id,
          r.name || "",
          r.state || "",
          r.status || "",
          r.riskLevel || "",
        ]
          .join(" ")
          .toLowerCase();

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
    const high = rows.filter((r) => (r.riskLevel || "").toString().toLowerCase() === "high")
      .length;
    const medium = rows.filter((r) => (r.riskLevel || "").toString().toLowerCase() === "medium")
      .length;
    const low = rows.filter((r) => (r.riskLevel || "").toString().toLowerCase() === "low")
      .length;
    return { total, high, medium, low };
  }, [rows]);

  return (
    <>
      <Head>
        <title>Admin Providers — MedicaidReady</title>
        <meta name="description" content="Admin providers overview dashboard." />
      </Head>

      <div className="min-h-screen bg-white">
        {/* Top bar */}
        <div className="border-b border-slate-200">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white">
                MR
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-900">
                  MedicaidReady Admin
                </div>
                <div className="text-xs text-slate-500">Providers Overview</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
              >
                Home
              </Link>
              <Link
                href="/pricing"
                className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800"
              >
                Pricing
              </Link>
            </div>
          </div>
        </div>

        <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
          {/* Header */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                Providers
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Read-only operational overview. Click a provider to open the dashboard.
              </p>
            </div>

            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
              type="button"
            >
              Refresh
            </button>
          </div>

          {/* Summary cards */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="text-xs font-medium text-slate-500">Total</div>
              <div className="mt-1 text-2xl font-semibold text-slate-900">
                {totals.total}
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="text-xs font-medium text-slate-500">High Risk</div>
              <div className="mt-1 text-2xl font-semibold text-slate-900">
                {totals.high}
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="text-xs font-medium text-slate-500">Medium Risk</div>
              <div className="mt-1 text-2xl font-semibold text-slate-900">
                {totals.medium}
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="text-xs font-medium text-slate-500">Low Risk</div>
              <div className="mt-1 text-2xl font-semibold text-slate-900">
                {totals.low}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-12 sm:items-end">
              <div className="sm:col-span-6">
                <label className="block text-xs font-medium text-slate-600">
                  Search
                </label>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by provider name, id, state, status..."
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none ring-0 placeholder:text-slate-400 focus:border-slate-300"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-medium text-slate-600">
                  Risk
                </label>
                <select
                  value={riskFilter}
                  onChange={(e) =>
                    setRiskFilter(e.target.value as "all" | "low" | "medium" | "high")
                  }
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-slate-300"
                >
                  <option value="all">All</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-medium text-slate-600">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-slate-300"
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>
                      {s === "all" ? "All" : s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-slate-900">
                  Providers ({filtered.length})
                </div>
                <div className="text-xs text-slate-500">
                  Data source: <span className="font-medium">GET /api/providers</span>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="px-4 py-10 text-center text-sm text-slate-600">
                Loading providers…
              </div>
            ) : error ? (
              <div className="px-4 py-10">
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                  <div className="font-semibold">Failed to load providers</div>
                  <div className="mt-1 break-words">{error}</div>
                  <div className="mt-3 text-xs text-red-700">
                    No backend changes were made. This is a read-only page.
                  </div>
                </div>
              </div>
            ) : filtered.length === 0 ? (
              <div className="px-4 py-10 text-center text-sm text-slate-600">
                No providers match your filters.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] table-auto">
                  <thead className="bg-slate-50">
                    <tr className="text-left text-xs font-semibold text-slate-600">
                      <th className="px-4 py-3">Provider</th>
                      <th className="px-4 py-3">State</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Risk</th>
                      <th className="px-4 py-3">Score</th>
                      <th className="px-4 py-3">Trend</th>
                      <th className="px-4 py-3">Issues</th>
                      <th className="px-4 py-3">Last Updated</th>
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filtered.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3">
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-slate-900">
                              {safeText(r.name) || "—"}
                            </span>
                            <span className="text-xs text-slate-500">{r.id}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-700">
                          {safeText(r.state) || "—"}
                        </td>
                        <td className="px-4 py-3">
                          <span className={statusBadge(r.status)}>{safeText(r.status) || "—"}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={riskBadge(r.riskLevel)}>
                            {safeText(r.riskLevel) || "—"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-700">
                          {typeof r.score === "number" ? r.score : "—"}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-700">
                          {safeText(r.trend) || "—"}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-700">
                          {typeof r.issuesCount === "number" ? r.issuesCount : "—"}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-700">
                          {formatDate(r.updatedAt)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Link
                            href={`/providers/${encodeURIComponent(r.id)}`}
                            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
                          >
                            Open
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Footer note */}
          <div className="mt-6 text-xs text-slate-500">
            Tip: This page is intentionally read-only to avoid changing backend behavior.
          </div>
        </main>
      </div>
    </>
  );
}
