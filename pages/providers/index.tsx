// pages/providers/index.tsx
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
};

type CreateResponse = {
  ok: boolean;
  created: boolean;
  provider: ProviderListItem;
};

function pct(n: number) {
  const v = Number.isFinite(n) ? n : 0;
  return Math.max(0, Math.min(100, v));
}

function formatDate(iso: string | null | undefined) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString();
}

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
  brandA: "#0b3a69",
  brandB: "#0284c7",
  high: "#dc2626",
  medium: "#f59e0b",
  low: "#16a34a",
  warnBg: "#fff7ed",
  warnBorder: "rgba(234, 88, 12, 0.22)",
};

function hexToRgba(hex: string, alpha: number) {
  const h = hex.replace("#", "").trim();
  const full = h.length === 3 ? h.split("").map((x) => x + x).join("") : h;
  const num = parseInt(full, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function statusPill(status: ProviderListItem["onboardStatus"]) {
  const map: Record<
    ProviderListItem["onboardStatus"],
    { label: string; color: string; bg: string; border: string }
  > = {
    not_started: {
      label: "NOT STARTED",
      color: "#64748b",
      bg: "rgba(148, 163, 184, 0.12)",
      border: "rgba(148, 163, 184, 0.26)",
    },
    in_progress: {
      label: "IN PROGRESS",
      color: "#b54708",
      bg: "rgba(245, 158, 11, 0.12)",
      border: "rgba(245, 158, 11, 0.28)",
    },
    complete: {
      label: "COMPLETE",
      color: "#067647",
      bg: "rgba(22, 163, 74, 0.10)",
      border: "rgba(22, 163, 74, 0.24)",
    },
  };

  const s = map[status];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 10px",
        borderRadius: 999,
        border: `1px solid ${s.border}`,
        background: s.bg,
        color: s.color,
        fontWeight: 900,
        fontSize: 12,
        letterSpacing: 0.4,
        whiteSpace: "nowrap",
      }}
    >
      <span
        aria-hidden
        style={{
          width: 8,
          height: 8,
          borderRadius: 999,
          background: s.color,
          boxShadow: `0 0 0 3px ${hexToRgba(s.color, 0.14)}`,
        }}
      />
      {s.label}
    </span>
  );
}

export default function ProvidersIndexPage() {
  const [providers, setProviders] = useState<ProviderListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [id, setId] = useState("test-provider");
  const [name, setName] = useState("");
  const [providerType, setProviderType] = useState("");
  const [jurisdiction, setJurisdiction] = useState("");

  const sorted = useMemo(() => {
    return [...providers].sort((a, b) => (b.updatedAt || "").localeCompare(a.updatedAt || ""));
  }, [providers]);

  async function load() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/providers");
      if (!res.ok) throw new Error(`API Error ${res.status}: ${await res.text()}`);
      const json = (await res.json()) as ListResponse;
      setProviders(Array.isArray(json.providers) ? json.providers : []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  async function createProvider() {
    setError(null);
    setLoading(true);
    try {
      const payload = {
        id: id.trim() ? id.trim() : undefined,
        name: name.trim() ? name.trim() : undefined,
        provider_type_code: providerType.trim() ? providerType.trim() : undefined,
        jurisdiction_code: jurisdiction.trim() ? jurisdiction.trim() : undefined,
      };

      const res = await fetch("/api/providers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`API Error ${res.status}: ${await res.text()}`);

      const json = (await res.json()) as CreateResponse;

      // Upsert into list
      setProviders((prev) => {
        const idx = prev.findIndex((p) => p.id === json.provider.id);
        if (idx === -1) return [json.provider, ...prev];
        const copy = [...prev];
        copy[idx] = json.provider;
        return copy;
      });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const openDashboardHref = `/providers/${encodeURIComponent(id.trim() || "test-provider")}`;

  return (
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
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        {/* Sticky Header Card */}
        <div style={{ position: "sticky", top: 16, zIndex: 20, marginBottom: 16 }}>
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
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <div style={{ minWidth: 260 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  <h1 style={{ margin: 0, fontSize: 34, lineHeight: 1.08, letterSpacing: -0.9, fontWeight: 950 }}>
                    Providers
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
                      fontWeight: 900,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {sorted.length} provider(s)
                  </span>
                </div>

                <div style={{ marginTop: 6, color: THEME.muted, fontSize: 13, lineHeight: 1.5 }}>
                  Create a provider, then open the dashboard.
                </div>
              </div>

              <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                <Link href="/providers/analytics" style={{ textDecoration: "none" }}>
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
                      fontWeight: 950,
                      boxShadow: THEME.shadowSoft,
                      whiteSpace: "nowrap",
                    }}
                  >
                    Analytics Overview →
                  </span>
                </Link>

                <button
                  onClick={load}
                  disabled={loading}
                  style={{
                    padding: "10px 12px",
                    borderRadius: 999,
                    border: `1px solid ${THEME.border}`,
                    background: "rgba(255,255,255,0.95)",
                    color: "#0f172a",
                    fontWeight: 950,
                    boxShadow: THEME.shadowSoft,
                    cursor: loading ? "not-allowed" : "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  {loading ? "Loading…" : "Refresh"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Credentialed Access CTA */}
        <section
          style={{
            border: `1px solid ${THEME.border}`,
            background: "rgba(255,255,255,0.95)",
            borderRadius: 20,
            padding: 18,
            marginBottom: 16,
            boxShadow: THEME.shadowSoft,
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              background: `radial-gradient(520px 180px at 10% 20%, rgba(11, 58, 105, 0.10), transparent 60%),
                           radial-gradient(520px 180px at 90% 30%, rgba(2, 132, 199, 0.10), transparent 60%)`,
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <div>
              <div style={{ fontSize: 12, fontWeight: 950, color: "rgba(11, 58, 105, 0.78)", letterSpacing: 0.35 }}>
                MedicaidReady — DMV Region
              </div>
              <div style={{ fontSize: 16, fontWeight: 950, marginTop: 6, color: "#0b1f3a" }}>
                Access is credentialed. Review pricing or request access.
              </div>
              <div style={{ fontSize: 13, color: "rgba(11, 31, 58, 0.72)", marginTop: 6, lineHeight: 1.55 }}>
                Continuous Medicaid compliance monitoring for providers in Maryland, Virginia &amp; Washington, DC.
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link
                href="/pricing"
                style={{
                  padding: "10px 12px",
                  borderRadius: 999,
                  border: `1px solid ${THEME.border}`,
                  background: "rgba(255,255,255,0.95)",
                  textDecoration: "none",
                  color: "#0b2a4a",
                  fontWeight: 950,
                  display: "inline-flex",
                  alignItems: "center",
                  boxShadow: THEME.shadowSoft,
                  whiteSpace: "nowrap",
                }}
              >
                Pricing
              </Link>

              <Link
                href="/request-access"
                style={{
                  padding: "10px 14px",
                  borderRadius: 999,
                  border: `1px solid rgba(11, 58, 105, 0.32)`,
                  background: "linear-gradient(135deg, #0b3a69, #0284c7)",
                  textDecoration: "none",
                  color: "white",
                  fontWeight: 950,
                  display: "inline-flex",
                  alignItems: "center",
                  boxShadow: THEME.shadowSoft,
                  whiteSpace: "nowrap",
                }}
              >
                Request Access
              </Link>
            </div>
          </div>
        </section>

        {/* Errors */}
        {error && (
          <div
            style={{
              border: `1px solid rgba(220, 38, 38, 0.25)`,
              background: "rgba(220, 38, 38, 0.06)",
              padding: 14,
              borderRadius: 16,
              marginBottom: 16,
              boxShadow: THEME.shadowSoft,
            }}
          >
            <strong style={{ display: "block", marginBottom: 6, color: "#7f1d1d" }}>Error</strong>
            <div style={{ whiteSpace: "pre-wrap", color: "#7f1d1d" }}>{error}</div>
          </div>
        )}

        {/* Create / Upsert */}
        <section
          style={{
            border: `1px solid ${THEME.border}`,
            borderRadius: 20,
            padding: 18,
            marginBottom: 16,
            background: "rgba(255,255,255,0.95)",
            boxShadow: THEME.shadow,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <div>
              <h2 style={{ fontSize: 18, margin: 0, fontWeight: 950, letterSpacing: -0.2 }}>Create / Upsert Provider</h2>
              <div style={{ marginTop: 6, color: THEME.muted, fontSize: 13, lineHeight: 1.5 }}>
                Use a stable Provider ID for repeatable dashboards and updates.
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link
                href={openDashboardHref}
                style={{
                  padding: "10px 12px",
                  borderRadius: 999,
                  border: `1px solid ${THEME.border}`,
                  background: "rgba(255,255,255,0.95)",
                  textDecoration: "none",
                  color: "#0f172a",
                  display: "inline-flex",
                  alignItems: "center",
                  fontWeight: 950,
                  boxShadow: THEME.shadowSoft,
                  whiteSpace: "nowrap",
                }}
              >
                Open dashboard
              </Link>

              <button
                onClick={createProvider}
                disabled={loading}
                style={{
                  padding: "10px 14px",
                  borderRadius: 999,
                  border: `1px solid rgba(11, 58, 105, 0.32)`,
                  background: "linear-gradient(135deg, #0b3a69, #0284c7)",
                  color: "white",
                  fontWeight: 950,
                  cursor: loading ? "not-allowed" : "pointer",
                  boxShadow: THEME.shadowSoft,
                  whiteSpace: "nowrap",
                }}
              >
                {loading ? "Saving…" : "Create / Upsert"}
              </button>
            </div>
          </div>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            <Field label="Provider ID (recommended)" hint="e.g. test-provider">
              <input
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="e.g. test-provider"
                style={inputStyle()}
              />
            </Field>

            <Field label="Name (optional)" hint="e.g. ACME Home Health">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. ACME Home Health"
                style={inputStyle()}
              />
            </Field>

            <Field label="Provider Type Code (optional)" hint='e.g. "home_health"'>
              <input
                value={providerType}
                onChange={(e) => setProviderType(e.target.value)}
                placeholder='e.g. "home_health"'
                style={inputStyle()}
              />
            </Field>

            <Field label="Jurisdiction Code (optional)" hint='e.g. "MD"'>
              <input
                value={jurisdiction}
                onChange={(e) => setJurisdiction(e.target.value)}
                placeholder='e.g. "MD"'
                style={inputStyle()}
              />
            </Field>
          </div>

          <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              onClick={load}
              disabled={loading}
              style={{
                padding: "10px 12px",
                borderRadius: 999,
                border: `1px solid ${THEME.border}`,
                background: "rgba(255,255,255,0.95)",
                color: "#0f172a",
                fontWeight: 950,
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: THEME.shadowSoft,
                whiteSpace: "nowrap",
              }}
            >
              {loading ? "Loading…" : "Refresh list"}
            </button>

            <span style={{ color: THEME.muted, fontSize: 13, alignSelf: "center" }}>
              Tip: you can upsert the same Provider ID to update metadata.
            </span>
          </div>
        </section>

        {/* List */}
        <section
          style={{
            border: `1px solid ${THEME.border}`,
            borderRadius: 20,
            padding: 18,
            background: "rgba(255,255,255,0.95)",
            boxShadow: THEME.shadow,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <div>
              <h2 style={{ fontSize: 18, margin: 0, fontWeight: 950, letterSpacing: -0.2 }}>All Providers</h2>
              <p style={{ margin: "6px 0 0", color: THEME.muted, fontSize: 13 }}>
                Sorted by most recently updated.
              </p>
            </div>

            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 10px",
                borderRadius: 999,
                border: `1px solid ${THEME.border}`,
                background: "rgba(248,250,252,0.75)",
                color: "#334155",
                fontWeight: 950,
                fontSize: 12,
                whiteSpace: "nowrap",
              }}
            >
              {sorted.length} provider(s)
            </span>
          </div>

          <div style={{ height: 14 }} />

          {loading && sorted.length === 0 && <p style={{ color: THEME.muted, margin: 0 }}>Loading…</p>}

          {sorted.length === 0 && !loading && (
            <p style={{ color: THEME.muted, margin: 0 }}>No providers yet. Create one above.</p>
          )}

          {sorted.length > 0 && (
            <div style={{ display: "grid", gap: 12 }}>
              {sorted.map((p) => {
                const percent = pct(p.progress?.percentComplete ?? 0);
                const displayName = p.meta?.name || p.id;

                return (
                  <div
                    key={p.id}
                    style={{
                      border: `1px solid ${THEME.border}`,
                      borderRadius: 20,
                      background: "rgba(255,255,255,0.96)",
                      boxShadow: THEME.shadowSoft,
                      overflow: "hidden",
                    }}
                  >
                    <div style={{ padding: 16 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                        <div style={{ minWidth: 260 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                            <div style={{ fontSize: 15, fontWeight: 950, letterSpacing: -0.2 }}>{displayName}</div>
                            {statusPill(p.onboardStatus)}
                          </div>

                          <div style={{ marginTop: 6, fontSize: 12, color: THEME.muted, lineHeight: 1.55 }}>
                            <span style={{ fontWeight: 900, color: "#334155" }}>ID:</span> {p.id}
                            {p.meta?.provider_type_code ? (
                              <>
                                {" "}
                                • <span style={{ fontWeight: 900, color: "#334155" }}>Type:</span>{" "}
                                {p.meta.provider_type_code}
                              </>
                            ) : null}
                            {p.meta?.jurisdiction_code ? (
                              <>
                                {" "}
                                • <span style={{ fontWeight: 900, color: "#334155" }}>Jurisdiction:</span>{" "}
                                {p.meta.jurisdiction_code}
                              </>
                            ) : null}
                          </div>
                        </div>

                        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                          <Link
                            href={`/providers/${encodeURIComponent(p.id)}`}
                            style={{
                              padding: "10px 12px",
                              borderRadius: 999,
                              border: `1px solid ${THEME.border}`,
                              background: "rgba(255,255,255,0.95)",
                              textDecoration: "none",
                              color: "#0f172a",
                              fontWeight: 950,
                              boxShadow: THEME.shadowSoft,
                              whiteSpace: "nowrap",
                            }}
                          >
                            Open →
                          </Link>
                        </div>
                      </div>

                      <div style={{ marginTop: 14 }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: 12,
                            flexWrap: "wrap",
                            alignItems: "baseline",
                          }}
                        >
                          <div style={{ fontSize: 12, color: THEME.muted, fontWeight: 900 }}>
                            Readiness Progress
                          </div>
                          <div style={{ fontSize: 12, color: THEME.muted }}>
                            Updated: <strong style={{ color: THEME.text }}>{formatDate(p.updatedAt)}</strong>
                          </div>
                        </div>

                        <div style={{ height: 10 }} />

                        <div
                          style={{
                            height: 12,
                            background: "rgba(148, 163, 184, 0.18)",
                            borderRadius: 999,
                            overflow: "hidden",
                            border: `1px solid rgba(148, 163, 184, 0.22)`,
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              width: `${percent}%`,
                              background: `linear-gradient(135deg, ${THEME.brandA}, ${THEME.brandB})`,
                              boxShadow: "0 10px 22px rgba(2, 6, 23, 0.12)",
                            }}
                          />
                        </div>

                        <div
                          style={{
                            marginTop: 10,
                            display: "flex",
                            justifyContent: "space-between",
                            gap: 12,
                            flexWrap: "wrap",
                          }}
                        >
                          <div style={{ fontSize: 12, color: THEME.muted }}>
                            <strong style={{ color: THEME.text }}>{percent}%</strong> complete •{" "}
                            <strong style={{ color: THEME.text }}>{p.progress.complete}</strong> complete •{" "}
                            <strong style={{ color: THEME.text }}>{p.progress.inProgress}</strong> in progress
                          </div>

                          <div style={{ fontSize: 12, color: THEME.muted }}>
                            Total items: <strong style={{ color: THEME.text }}>{p.progress.total}</strong>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        borderTop: `1px solid rgba(15, 23, 42, 0.06)`,
                        background: "rgba(248, 250, 252, 0.75)",
                        padding: "10px 16px",
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 12,
                        flexWrap: "wrap",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ fontSize: 12, color: THEME.muted }}>
                        Created: <strong style={{ color: THEME.text }}>{formatDate(p.createdAt)}</strong>
                      </span>
                      <span style={{ fontSize: 12, color: THEME.muted }}>
                        Last update: <strong style={{ color: THEME.text }}>{formatDate(p.updatedAt)}</strong>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <div style={{ height: 28 }} />
      </div>
    </main>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label style={{ display: "grid", gap: 6 }}>
      <span style={{ fontSize: 12, color: "#334155", fontWeight: 950, letterSpacing: 0.2 }}>{label}</span>
      {children}
      {hint ? <span style={{ fontSize: 12, color: "#64748b" }}>{hint}</span> : null}
    </label>
  );
}

function inputStyle(): React.CSSProperties {
  return {
    padding: 12,
    borderRadius: 14,
    border: `1px solid rgba(15, 23, 42, 0.12)`,
    background: "rgba(255,255,255,0.98)",
    color: "#0f172a",
    fontWeight: 800,
    outline: "none",
    boxShadow: "0 6px 18px rgba(2, 6, 23, 0.06)",
  };
}
