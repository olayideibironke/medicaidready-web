import Head from "next/head";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type ProviderListItem = {
  id: string;
  createdAt: string;
  updatedAt: string;
  meta?: {
    name?: string;
    provider_type_code?: string;
    jurisdiction_code?: string;
  };
  onboardStatus: "not_started" | "in_progress" | "complete";
  progress: {
    total: number;
    complete: number;
    inProgress: number;
    notStarted: number;
    percentComplete: number;
  };
};

type ListResponse = {
  ok: boolean;
  providers: ProviderListItem[];
  error?: string;
};

function pct(n: number) {
  const v = Number.isFinite(n) ? n : 0;
  return Math.max(0, Math.min(100, v));
}

function formatDate(iso: string | null | undefined) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString();
}

const THEME = {
  bg: "#f7f8fb",
  card: "#ffffff",
  border: "rgba(15, 23, 42, 0.10)",
  text: "#0f172a",
  muted: "#475569",
  shadow: "0 12px 34px rgba(2, 6, 23, 0.10)",
  shadowSoft: "0 8px 22px rgba(2, 6, 23, 0.08)",
  brandA: "#0b3a69",
  brandB: "#0284c7",
};

export default function ProvidersIndexPage() {
  const [providers, setProviders] = useState<ProviderListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sorted = useMemo(() => {
    return [...providers].sort((a, b) =>
      (b.updatedAt || "").localeCompare(a.updatedAt || "")
    );
  }, [providers]);

  async function load() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/providers");
      if (!res.ok) {
        throw new Error("Unable to load providers.");
      }
      const json = (await res.json()) as ListResponse;
      setProviders(Array.isArray(json.providers) ? json.providers : []);
    } catch (e: unknown) {
      setProviders([]);
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <>
      <Head>
        <title>Providers • MedicaidReady</title>
        <meta name="description" content="Provider dashboards and readiness tracking." />
      </Head>

      <main
        style={{
          minHeight: "100vh",
          background: THEME.bg,
          padding: 24,
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial',
          color: THEME.text,
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div
            style={{
              border: `1px solid ${THEME.border}`,
              borderRadius: 20,
              padding: 24,
              background: THEME.card,
              boxShadow: THEME.shadowSoft,
              marginBottom: 24,
            }}
          >
            <h1 style={{ margin: 0, fontSize: 30, fontWeight: 900 }}>
              Provider Directory
            </h1>
            <p style={{ marginTop: 8, color: THEME.muted }}>
              Active providers and compliance readiness progress.
            </p>
          </div>

          {error && (
            <div
              style={{
                border: "1px solid rgba(220,38,38,0.3)",
                background: "rgba(220,38,38,0.06)",
                padding: 16,
                borderRadius: 16,
                marginBottom: 20,
                color: "#7f1d1d",
              }}
            >
              {error}
            </div>
          )}

          {loading && <p style={{ color: THEME.muted }}>Loading…</p>}

          {!loading && sorted.length === 0 && (
            <div
              style={{
                border: `1px solid ${THEME.border}`,
                borderRadius: 20,
                padding: 24,
                background: THEME.card,
                boxShadow: THEME.shadowSoft,
              }}
            >
              <p style={{ margin: 0, color: THEME.muted }}>
                No providers available yet. Once access is approved, providers
                will appear here.
              </p>
            </div>
          )}

          {sorted.length > 0 && (
            <div style={{ display: "grid", gap: 16 }}>
              {sorted.map((p) => {
                const percent = pct(p.progress?.percentComplete ?? 0);
                const displayName = p.meta?.name || p.id;

                return (
                  <div
                    key={p.id}
                    style={{
                      border: `1px solid ${THEME.border}`,
                      borderRadius: 20,
                      background: THEME.card,
                      padding: 20,
                      boxShadow: THEME.shadowSoft,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: 12,
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 900 }}>
                          {displayName}
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            color: THEME.muted,
                            marginTop: 4,
                          }}
                        >
                          ID: {p.id}
                        </div>
                      </div>

                      <Link
                        href={`/providers/${encodeURIComponent(p.id)}`}
                        style={{
                          padding: "10px 14px",
                          borderRadius: 999,
                          background: `linear-gradient(135deg, ${THEME.brandA}, ${THEME.brandB})`,
                          color: "white",
                          textDecoration: "none",
                          fontWeight: 800,
                        }}
                      >
                        Open →
                      </Link>
                    </div>

                    <div style={{ marginTop: 16 }}>
                      <div
                        style={{
                          height: 10,
                          background: "rgba(148,163,184,0.2)",
                          borderRadius: 999,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${percent}%`,
                            background: `linear-gradient(135deg, ${THEME.brandA}, ${THEME.brandB})`,
                          }}
                        />
                      </div>

                      <div
                        style={{
                          marginTop: 8,
                          fontSize: 12,
                          color: THEME.muted,
                        }}
                      >
                        {percent}% complete • Updated {formatDate(p.updatedAt)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </>
  );
}