import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import {
  getSnapshot,
  updateChecklistItem,
  completeChecklistItem,
  completeOnboarding,
  updateOnboard,
  type SnapshotResponse,
  type ChecklistItem,
  type ChecklistStatus,
} from "@/lib/api/providers";

function pct(n: number) {
  const v = Number.isFinite(n) ? n : 0;
  return Math.max(0, Math.min(100, v));
}

function statusLabel(s: ChecklistStatus) {
  if (s === "not_started") return "Not started";
  if (s === "in_progress") return "In progress";
  return "Complete";
}

function statusChipStyle(s: ChecklistStatus) {
  const base: React.CSSProperties = {
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: 999,
    fontSize: 12,
    border: "1px solid #ddd",
    background: "#f6f6f6",
  };
  if (s === "complete") return { ...base, borderColor: "#b9e2c6", background: "#eefbf2" };
  if (s === "in_progress") return { ...base, borderColor: "#c9d8ff", background: "#f1f5ff" };
  return base;
}

export default function ProviderDashboardPage() {
  const router = useRouter();

  const providerId = useMemo(() => {
    const raw = router.query?.id;
    const id =
      typeof raw === "string"
        ? raw
        : Array.isArray(raw)
        ? raw[0]
        : undefined;

    return (id && id.trim()) ? id.trim() : "test-provider";
  }, [router.query?.id]);

  const [data, setData] = useState<SnapshotResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    setError(null);
    setLoading(true);
    try {
      const snap = await getSnapshot(providerId);
      setData(snap);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!router.isReady) return;
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, providerId]);

  async function setItemStatus(item: ChecklistItem, status: ChecklistStatus) {
    setError(null);
    setBusyKey(item.key);
    try {
      // If marking complete, use /complete endpoint (writes completedAt)
      if (status === "complete") {
        await completeChecklistItem(providerId, item.key);
      } else {
        await updateChecklistItem(providerId, item.key, status);
      }
      await refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusyKey(null);
    }
  }

  async function markOnboardingComplete() {
    setError(null);
    setBusyKey("onboarding_complete");
    try {
      await completeOnboarding(providerId);
      await refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusyKey(null);
    }
  }

  async function quickStartOnboarding() {
    setError(null);
    setBusyKey("onboarding_start");
    try {
      // Minimal safe update: moves status to in_progress
      await updateOnboard(providerId, { status: "in_progress" });
      await refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusyKey(null);
    }
  }

  const percentComplete = pct(data?.progress?.percentComplete ?? 0);

  return (
    <main style={{ padding: 24, fontFamily: "system-ui, sans-serif", maxWidth: 980, margin: "0 auto" }}>
      <header style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: 24, margin: 0 }}>Provider Dashboard</h1>
        <p style={{ margin: "6px 0 0", color: "#555" }}>
          Provider ID: <strong>{providerId}</strong>
        </p>
      </header>

      {error && (
        <div style={{ border: "1px solid #f3b6b6", background: "#fff1f1", padding: 12, borderRadius: 10, marginBottom: 16 }}>
          <strong style={{ display: "block", marginBottom: 6 }}>Error</strong>
          <div style={{ whiteSpace: "pre-wrap" }}>{error}</div>
        </div>
      )}

      <section style={{ border: "1px solid #e6e6e6", borderRadius: 14, padding: 16, marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div>
            <h2 style={{ fontSize: 18, margin: 0 }}>Progress</h2>
            <p style={{ margin: "6px 0 0", color: "#555" }}>
              {data ? (
                <>
                  {data.progress.complete} complete • {data.progress.inProgress} in progress • {data.progress.notStarted} not started
                </>
              ) : (
                "Loading…"
              )}
            </p>
          </div>

          <button
            onClick={refresh}
            disabled={loading || !!busyKey}
            style={{
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid #ddd",
              background: loading ? "#f6f6f6" : "white",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Refreshing…" : "Refresh"}
          </button>
        </div>

        <div style={{ marginTop: 12 }}>
          <div style={{ height: 10, background: "#eee", borderRadius: 999, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${percentComplete}%`, background: "#111" }} />
          </div>
          <div style={{ marginTop: 8, fontSize: 12, color: "#555" }}>
            {percentComplete}% complete
          </div>
        </div>
      </section>

      <section style={{ border: "1px solid #e6e6e6", borderRadius: 14, padding: 16, marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div>
            <h2 style={{ fontSize: 18, margin: 0 }}>Onboarding</h2>
            <p style={{ margin: "6px 0 0", color: "#555" }}>
              Status: <strong>{data?.onboard?.status ?? "not_started"}</strong>
              {data?.onboard?.startedAt ? <> • Started: {new Date(data.onboard.startedAt).toLocaleString()}</> : null}
              {data?.onboard?.completedAt ? <> • Completed: {new Date(data.onboard.completedAt).toLocaleString()}</> : null}
            </p>
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button
              onClick={quickStartOnboarding}
              disabled={loading || busyKey === "onboarding_start"}
              style={{
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid #ddd",
                background: "white",
                cursor: loading ? "not-allowed" : "pointer",
              }}
              title="Sets status to in_progress"
            >
              {busyKey === "onboarding_start" ? "Starting…" : "Start onboarding"}
            </button>

            <button
              onClick={markOnboardingComplete}
              disabled={loading || busyKey === "onboarding_complete"}
              style={{
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid #111",
                background: "#111",
                color: "white",
                cursor: loading ? "not-allowed" : "pointer",
              }}
              title="Marks onboarding complete"
            >
              {busyKey === "onboarding_complete" ? "Completing…" : "Complete onboarding"}
            </button>
          </div>
        </div>

        <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div style={{ padding: 12, border: "1px solid #eee", borderRadius: 12 }}>
            <div style={{ fontSize: 13, color: "#666" }}>Contact</div>
            <div style={{ marginTop: 6 }}>
              <div><strong>Name:</strong> {data?.onboard?.contact?.name ?? "-"}</div>
              <div><strong>Email:</strong> {data?.onboard?.contact?.email ?? "-"}</div>
              <div><strong>Phone:</strong> {data?.onboard?.contact?.phone ?? "-"}</div>
            </div>
          </div>

          <div style={{ padding: 12, border: "1px solid #eee", borderRadius: 12 }}>
            <div style={{ fontSize: 13, color: "#666" }}>Organization</div>
            <div style={{ marginTop: 6 }}>
              <div><strong>Name:</strong> {data?.onboard?.org?.name ?? "-"}</div>
              <div><strong>NPI:</strong> {data?.onboard?.org?.npi ?? "-"}</div>
              <div><strong>Medicaid ID:</strong> {data?.onboard?.org?.medicaidId ?? "-"}</div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ border: "1px solid #e6e6e6", borderRadius: 14, padding: 16 }}>
        <h2 style={{ fontSize: 18, margin: 0 }}>Checklist</h2>
        <p style={{ margin: "6px 0 12px", color: "#555" }}>
          Update status per item (saves immediately).
        </p>

        {!data && <p>Loading…</p>}

        {data && (
          <div style={{ display: "grid", gap: 10 }}>
            {data.checklist.map((item) => {
              const isBusy = busyKey === item.key || loading;
              return (
                <div
                  key={item.key}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                    padding: 12,
                    border: "1px solid #eee",
                    borderRadius: 12,
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                      <strong style={{ fontSize: 14 }}>{item.title}</strong>
                      <span style={statusChipStyle(item.status)}>{statusLabel(item.status)}</span>
                    </div>
                    <div style={{ marginTop: 6, fontSize: 12, color: "#666" }}>
                      Updated: {new Date(item.updatedAt).toLocaleString()}
                      {item.completedAt ? <> • Completed: {new Date(item.completedAt).toLocaleString()}</> : null}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button
                      onClick={() => setItemStatus(item, "not_started")}
                      disabled={isBusy}
                      style={{
                        padding: "8px 10px",
                        borderRadius: 10,
                        border: "1px solid #ddd",
                        background: "white",
                        cursor: isBusy ? "not-allowed" : "pointer",
                      }}
                    >
                      Not started
                    </button>

                    <button
                      onClick={() => setItemStatus(item, "in_progress")}
                      disabled={isBusy}
                      style={{
                        padding: "8px 10px",
                        borderRadius: 10,
                        border: "1px solid #ddd",
                        background: "white",
                        cursor: isBusy ? "not-allowed" : "pointer",
                      }}
                    >
                      In progress
                    </button>

                    <button
                      onClick={() => setItemStatus(item, "complete")}
                      disabled={isBusy}
                      style={{
                        padding: "8px 10px",
                        borderRadius: 10,
                        border: "1px solid #111",
                        background: "#111",
                        color: "white",
                        cursor: isBusy ? "not-allowed" : "pointer",
                      }}
                    >
                      {busyKey === item.key ? "Saving…" : "Complete"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <footer style={{ marginTop: 16, fontSize: 12, color: "#777" }}>
        Snapshot last read: {data?.snapshotAt ? new Date(data.snapshotAt).toLocaleString() : "-"}
      </footer>
    </main>
  );
}
