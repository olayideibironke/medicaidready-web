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

  return (
    <main style={{ padding: 24, fontFamily: "system-ui, sans-serif", maxWidth: 980, margin: "0 auto" }}>
      <header style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div>
            <h1 style={{ fontSize: 24, margin: 0 }}>Providers</h1>
            <p style={{ margin: "6px 0 0", color: "#555" }}>
              Create a provider, then open the dashboard.
            </p>
          </div>

          <Link
            href="/providers/analytics"
            style={{
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid #ddd",
              background: "white",
              textDecoration: "none",
              color: "#111",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              height: "fit-content",
              fontWeight: 600,
            }}
          >
            Analytics Overview →
          </Link>
        </div>
      </header>

      {error && (
        <div style={{ border: "1px solid #f3b6b6", background: "#fff1f1", padding: 12, borderRadius: 10, marginBottom: 16 }}>
          <strong style={{ display: "block", marginBottom: 6 }}>Error</strong>
          <div style={{ whiteSpace: "pre-wrap" }}>{error}</div>
        </div>
      )}

      <section style={{ border: "1px solid #e6e6e6", borderRadius: 14, padding: 16, marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <h2 style={{ fontSize: 18, margin: 0 }}>Create / Upsert Provider</h2>

          <button
            onClick={load}
            disabled={loading}
            style={{
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid #ddd",
              background: "white",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Loading…" : "Refresh list"}
          </button>
        </div>

        <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <label style={{ display: "grid", gap: 6 }}>
            <span style={{ fontSize: 12, color: "#666" }}>Provider ID (recommended)</span>
            <input
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="e.g. test-provider"
              style={{ padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
            />
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            <span style={{ fontSize: 12, color: "#666" }}>Name (optional)</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. ACME Home Health"
              style={{ padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
            />
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            <span style={{ fontSize: 12, color: "#666" }}>Provider Type Code (optional)</span>
            <input
              value={providerType}
              onChange={(e) => setProviderType(e.target.value)}
              placeholder='e.g. "home_health"'
              style={{ padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
            />
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            <span style={{ fontSize: 12, color: "#666" }}>Jurisdiction Code (optional)</span>
            <input
              value={jurisdiction}
              onChange={(e) => setJurisdiction(e.target.value)}
              placeholder='e.g. "MD"'
              style={{ padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
            />
          </label>
        </div>

        <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            onClick={createProvider}
            disabled={loading}
            style={{
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid #111",
              background: "#111",
              color: "white",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Saving…" : "Create / Upsert"}
          </button>

          <Link
            href={`/providers/${encodeURIComponent(id.trim() || "test-provider")}`}
            style={{
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid #ddd",
              background: "white",
              textDecoration: "none",
              color: "#111",
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            Open dashboard
          </Link>
        </div>
      </section>

      <section style={{ border: "1px solid #e6e6e6", borderRadius: 14, padding: 16 }}>
        <h2 style={{ fontSize: 18, margin: 0 }}>All Providers</h2>
        <p style={{ margin: "6px 0 12px", color: "#555" }}>
          {sorted.length} provider(s)
        </p>

        {loading && sorted.length === 0 && <p>Loading…</p>}

        {sorted.length === 0 && !loading && (
          <p style={{ color: "#666" }}>No providers yet. Create one above.</p>
        )}

        {sorted.length > 0 && (
          <div style={{ display: "grid", gap: 10 }}>
            {sorted.map((p) => {
              const percent = pct(p.progress?.percentComplete ?? 0);

              return (
                <div
                  key={p.id}
                  style={{
                    padding: 12,
                    border: "1px solid #eee",
                    borderRadius: 12,
                    display: "grid",
                    gap: 10,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                    <div>
                      <div style={{ fontSize: 14 }}>
                        <strong>{p.meta?.name || p.id}</strong>
                      </div>
                      <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
                        ID: {p.id} • Onboarding: {p.onboardStatus}
                        {p.meta?.provider_type_code ? <> • Type: {p.meta.provider_type_code}</> : null}
                        {p.meta?.jurisdiction_code ? <> • Jurisdiction: {p.meta.jurisdiction_code}</> : null}
                      </div>
                    </div>

                    <Link
                      href={`/providers/${encodeURIComponent(p.id)}`}
                      style={{
                        padding: "8px 10px",
                        borderRadius: 10,
                        border: "1px solid #ddd",
                        background: "white",
                        textDecoration: "none",
                        color: "#111",
                        height: "fit-content",
                      }}
                    >
                      Open
                    </Link>
                  </div>

                  <div>
                    <div style={{ height: 10, background: "#eee", borderRadius: 999, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${percent}%`, background: "#111" }} />
                    </div>
                    <div style={{ marginTop: 8, fontSize: 12, color: "#555" }}>
                      {percent}% complete • {p.progress.complete} complete • {p.progress.inProgress} in progress
                    </div>
                    <div style={{ marginTop: 4, fontSize: 12, color: "#777" }}>
                      Updated: {new Date(p.updatedAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
