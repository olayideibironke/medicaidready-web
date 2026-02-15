// pages/providers/[id].tsx
import Head from "next/head";
import Link from "next/link";
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

function statusTone(s: ChecklistStatus) {
  if (s === "complete") return "toneSuccess";
  if (s === "in_progress") return "toneInfo";
  return "toneNeutral";
}

function riskTone(level: "high" | "med" | "low") {
  if (level === "high") return "dotHigh";
  if (level === "med") return "dotMed";
  return "dotLow";
}

export default function ProviderDashboardPage() {
  const router = useRouter();

  const providerId = useMemo(() => {
    const raw = router.query?.id;
    const id = typeof raw === "string" ? raw : Array.isArray(raw) ? raw[0] : undefined;
    return id && id.trim() ? id.trim() : "test-provider";
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

  const onboardStatus: ChecklistStatus = useMemo(() => {
    const s = data?.onboard?.status;
    if (s === "complete") return "complete";
    if (s === "in_progress") return "in_progress";
    return "not_started";
  }, [data?.onboard?.status]);

  const listPreview = useMemo(() => {
    // purely UI: give a premium “signals” list; does not affect data
    return [
      {
        level: percentComplete < 40 ? "high" : percentComplete < 80 ? "med" : "low",
        title: "Readiness progress",
        sub: `${percentComplete}% complete`,
        tag: percentComplete < 80 ? "Track" : "OK",
      },
      {
        level: onboardStatus === "complete" ? "low" : onboardStatus === "in_progress" ? "med" : "high",
        title: "Onboarding status",
        sub: statusLabel(onboardStatus),
        tag: onboardStatus === "complete" ? "OK" : "Review",
      },
      {
        level: (data?.progress?.notStarted ?? 0) > 0 ? "med" : "low",
        title: "Open checklist items",
        sub: `${data?.progress?.notStarted ?? "—"} not started`,
        tag: (data?.progress?.notStarted ?? 0) > 0 ? "Work" : "OK",
      },
    ] as const;
  }, [percentComplete, onboardStatus, data?.progress?.notStarted]);

  return (
    <>
      <Head>
        <title>Provider Dashboard • MedicaidReady</title>
        <meta name="description" content="Provider dashboard for compliance monitoring, onboarding, and checklist status." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="mrp-root">
        <header className="mrp-header">
          <div className="mrp-shell mrp-header-inner">
            <Link href="/" className="mrp-brand" aria-label="Go to home">
              <span className="mrp-logo" aria-hidden="true" />
              <span className="mrp-brand-text">
                <span className="mrp-brand-title">MedicaidReady</span>
                <span className="mrp-brand-sub">MD • VA • DC</span>
              </span>
            </Link>

            <nav className="mrp-nav" aria-label="Primary navigation">
              <Link href="/" className="mrp-nav-link">
                Home
              </Link>
              <Link href="/pricing" className="mrp-nav-link">
                Pricing
              </Link>
              <Link href="/request-access" className="mrp-nav-link">
                Request Access
              </Link>
              <Link href="/providers" className="mrp-nav-cta">
                Providers
              </Link>
            </nav>
          </div>
        </header>

        <main className="mrp-main">
          <div className="mrp-shell">
            <div className="mrp-hero">
              <div className="mrp-hero-left">
                <div className="mrp-badge">
                  <span className="mrp-dot" aria-hidden="true" />
                  Provider dashboard
                </div>

                <h1 className="mrp-h1">Provider overview</h1>
                <p className="mrp-lead">
                  Provider ID: <strong>{providerId}</strong>
                </p>

                <div className="mrp-hero-actions">
                  <button
                    onClick={refresh}
                    disabled={loading || !!busyKey}
                    className={"mrp-btn-secondary" + (loading || !!busyKey ? " mrp-btn-disabled" : "")}
                  >
                    {loading ? "Refreshing…" : "Refresh"}
                  </button>

                  <Link href="/providers" className="mrp-btn-link">
                    Back to providers
                  </Link>
                </div>
              </div>

              <aside className="mrp-hero-card" aria-label="Quick signals">
                <div className="mrp-hero-card-top">
                  <div className="mrp-card-title">Signals</div>
                  <div className="mrp-pill">Live snapshot</div>
                </div>

                <div className="mrp-signal-list">
                  {listPreview.map((row, idx) => (
                    <div className="mrp-signal-row" key={`sig-${idx}`}>
                      <span className={"mrp-status-dot " + riskTone(row.level)} aria-hidden="true" />
                      <div className="mrp-signal-text">
                        <div className="mrp-signal-title">{row.title}</div>
                        <div className="mrp-signal-sub">{row.sub}</div>
                      </div>
                      <div className="mrp-tag">{row.tag}</div>
                    </div>
                  ))}
                </div>

                <div className="mrp-hero-card-foot">
                  Snapshot last read:{" "}
                  <strong>{data?.snapshotAt ? new Date(data.snapshotAt).toLocaleString() : "—"}</strong>
                </div>
              </aside>
            </div>

            {error && (
              <div className="mrp-alert mrp-alert-error" role="alert">
                <div className="mrp-alert-title">Error</div>
                <div className="mrp-alert-text" style={{ whiteSpace: "pre-wrap" }}>
                  {error}
                </div>
              </div>
            )}

            {/* Progress */}
            <section className="mrp-card">
              <div className="mrp-card-head">
                <div>
                  <h2 className="mrp-h2">Progress</h2>
                  <p className="mrp-muted">
                    {data ? (
                      <>
                        {data.progress.complete} complete • {data.progress.inProgress} in progress •{" "}
                        {data.progress.notStarted} not started
                      </>
                    ) : (
                      "Loading…"
                    )}
                  </p>
                </div>

                <div className="mrp-kpi">
                  <div className="mrp-kpi-label">Complete</div>
                  <div className="mrp-kpi-value">{percentComplete}%</div>
                </div>
              </div>

              <div className="mrp-bar">
                <div className="mrp-bar-fill" style={{ width: `${percentComplete}%` }} />
              </div>
              <div className="mrp-bar-note">{percentComplete}% complete</div>
            </section>

            {/* Onboarding */}
            <section className="mrp-card">
              <div className="mrp-card-head">
                <div>
                  <h2 className="mrp-h2">Onboarding</h2>
                  <p className="mrp-muted">
                    Status:{" "}
                    <span className={"mrp-chip " + statusTone(onboardStatus)}>
                      {statusLabel(onboardStatus)}
                    </span>
                    {data?.onboard?.startedAt ? (
                      <>
                        {" "}
                        • Started: {new Date(data.onboard.startedAt).toLocaleString()}
                      </>
                    ) : null}
                    {data?.onboard?.completedAt ? (
                      <>
                        {" "}
                        • Completed: {new Date(data.onboard.completedAt).toLocaleString()}
                      </>
                    ) : null}
                  </p>
                </div>

                <div className="mrp-actions">
                  <button
                    onClick={quickStartOnboarding}
                    disabled={loading || busyKey === "onboarding_start"}
                    className={
                      "mrp-btn-secondary" + (loading || busyKey === "onboarding_start" ? " mrp-btn-disabled" : "")
                    }
                    title="Sets status to in_progress"
                  >
                    {busyKey === "onboarding_start" ? "Starting…" : "Start onboarding"}
                  </button>

                  <button
                    onClick={markOnboardingComplete}
                    disabled={loading || busyKey === "onboarding_complete"}
                    className={"mrp-btn-primary" + (loading || busyKey === "onboarding_complete" ? " mrp-btn-disabled" : "")}
                    title="Marks onboarding complete"
                  >
                    {busyKey === "onboarding_complete" ? "Completing…" : "Complete onboarding"}
                  </button>
                </div>
              </div>

              <div className="mrp-grid2">
                <div className="mrp-subcard">
                  <div className="mrp-subhead">Contact</div>
                  <div className="mrp-subbody">
                    <div>
                      <strong>Name:</strong> {data?.onboard?.contact?.name ?? "—"}
                    </div>
                    <div>
                      <strong>Email:</strong> {data?.onboard?.contact?.email ?? "—"}
                    </div>
                    <div>
                      <strong>Phone:</strong> {data?.onboard?.contact?.phone ?? "—"}
                    </div>
                  </div>
                </div>

                <div className="mrp-subcard">
                  <div className="mrp-subhead">Organization</div>
                  <div className="mrp-subbody">
                    <div>
                      <strong>Name:</strong> {data?.onboard?.org?.name ?? "—"}
                    </div>
                    <div>
                      <strong>NPI:</strong> {data?.onboard?.org?.npi ?? "—"}
                    </div>
                    <div>
                      <strong>Medicaid ID:</strong> {data?.onboard?.org?.medicaidId ?? "—"}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Checklist */}
            <section className="mrp-card">
              <div className="mrp-card-head">
                <div>
                  <h2 className="mrp-h2">Checklist</h2>
                  <p className="mrp-muted">Update status per item (saves immediately).</p>
                </div>
              </div>

              {!data && <p className="mrp-muted">Loading…</p>}

              {data && (
                <div className="mrp-list">
                  {data.checklist.map((item) => {
                    const isBusy = busyKey === item.key || loading;
                    return (
                      <div className="mrp-row" key={item.key}>
                        <div className="mrp-row-left">
                          <div className="mrp-row-title">
                            <strong>{item.title}</strong>
                            <span className={"mrp-chip " + statusTone(item.status)}>{statusLabel(item.status)}</span>
                          </div>
                          <div className="mrp-row-sub">
                            Updated: {new Date(item.updatedAt).toLocaleString()}
                            {item.completedAt ? <> • Completed: {new Date(item.completedAt).toLocaleString()}</> : null}
                          </div>
                        </div>

                        <div className="mrp-row-actions">
                          <button
                            onClick={() => setItemStatus(item, "not_started")}
                            disabled={isBusy}
                            className={"mrp-btn-small" + (isBusy ? " mrp-btn-disabled" : "")}
                          >
                            Not started
                          </button>

                          <button
                            onClick={() => setItemStatus(item, "in_progress")}
                            disabled={isBusy}
                            className={"mrp-btn-small" + (isBusy ? " mrp-btn-disabled" : "")}
                          >
                            In progress
                          </button>

                          <button
                            onClick={() => setItemStatus(item, "complete")}
                            disabled={isBusy}
                            className={"mrp-btn-small mrp-btn-small-primary" + (isBusy ? " mrp-btn-disabled" : "")}
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

            <footer className="mrp-footer">
              © {new Date().getFullYear()} MedicaidReady
            </footer>
          </div>
        </main>

        <style jsx global>{`
          :root {
            --mrp-ink: #0b1220;
            --mrp-muted: rgba(11, 18, 32, 0.72);
            --mrp-border2: rgba(11, 18, 32, 0.08);
            --mrp-card: rgba(255, 255, 255, 0.92);
            --mrp-shadow: 0 16px 40px rgba(11, 18, 32, 0.08);
            --mrp-blue: #0b3a67;
            --mrp-blue2: #0a2f55;
          }

          html,
          body {
            background: #f4f7fb;
            color: var(--mrp-ink);
          }
        `}</style>

        <style jsx>{`
          .mrp-root {
            min-height: 100vh;
            font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial,
              "Apple Color Emoji", "Segoe UI Emoji";
            background: radial-gradient(
                900px 340px at 44% 18%,
                rgba(11, 58, 103, 0.10),
                rgba(244, 247, 251, 0) 60%
              ),
              radial-gradient(
                900px 340px at 72% 22%,
                rgba(11, 58, 103, 0.07),
                rgba(244, 247, 251, 0) 62%
              ),
              linear-gradient(#f4f7fb, #f4f7fb);
            color: var(--mrp-ink);
          }

          .mrp-shell {
            max-width: 1180px;
            margin: 0 auto;
            padding: 0 18px;
          }

          .mrp-header {
            position: sticky;
            top: 0;
            z-index: 30;
            background: rgba(255, 255, 255, 0.86);
            backdrop-filter: blur(10px);
            border-bottom: 1px solid var(--mrp-border2);
          }

          .mrp-header-inner {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16px 0;
            gap: 14px;
          }

          .mrp-brand {
            display: inline-flex;
            align-items: center;
            gap: 12px;
            text-decoration: none;
            color: var(--mrp-ink);
          }

          .mrp-logo {
            width: 52px;
            height: 52px;
            border-radius: 14px;
            background: var(--mrp-blue);
            box-shadow: 0 10px 20px rgba(11, 58, 103, 0.18);
          }

          .mrp-brand-text {
            display: flex;
            flex-direction: column;
            line-height: 1.1;
          }

          .mrp-brand-title {
            font-family: ui-serif, Georgia, "Times New Roman", Times, serif;
            font-weight: 700;
            font-size: 20px;
            letter-spacing: 0.2px;
          }

          .mrp-brand-sub {
            margin-top: 4px;
            font-size: 13px;
            color: rgba(11, 18, 32, 0.65);
          }

          .mrp-nav {
            display: flex;
            align-items: center;
            gap: 18px;
          }

          .mrp-nav-link {
            text-decoration: none;
            color: rgba(11, 18, 32, 0.78);
            font-weight: 600;
          }

          .mrp-nav-link:hover {
            color: var(--mrp-ink);
            text-decoration: underline;
            text-decoration-color: rgba(11, 18, 32, 0.18);
            text-underline-offset: 4px;
          }

          .mrp-nav-cta {
            text-decoration: none;
            background: var(--mrp-blue);
            color: white;
            padding: 12px 18px;
            border-radius: 999px;
            font-weight: 700;
            box-shadow: 0 14px 24px rgba(11, 58, 103, 0.18);
          }

          .mrp-nav-cta:hover {
            background: var(--mrp-blue2);
          }

          .mrp-main {
            padding: 28px 0 26px;
          }

          .mrp-hero {
            display: grid;
            grid-template-columns: 1.25fr 0.75fr;
            gap: 18px;
            align-items: start;
            margin-bottom: 18px;
            padding-bottom: 18px;
            border-bottom: 1px solid rgba(11, 18, 32, 0.08);
          }

          .mrp-badge {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            padding: 10px 12px;
            border-radius: 999px;
            border: 1px solid rgba(11, 18, 32, 0.10);
            background: rgba(255, 255, 255, 0.86);
            font-size: 13px;
            font-weight: 700;
            color: rgba(11, 18, 32, 0.8);
            box-shadow: 0 10px 22px rgba(11, 18, 32, 0.05);
            width: fit-content;
          }

          .mrp-dot {
            width: 8px;
            height: 8px;
            border-radius: 999px;
            background: #0f6aa6;
          }

          .mrp-h1 {
            margin: 12px 0 6px;
            font-family: ui-serif, Georgia, "Times New Roman", Times, serif;
            font-weight: 700;
            font-size: 44px;
            letter-spacing: -0.6px;
          }

          .mrp-lead {
            margin: 0;
            color: var(--mrp-muted);
            font-size: 16px;
            line-height: 1.6;
          }

          .mrp-hero-actions {
            margin-top: 14px;
            display: flex;
            align-items: center;
            gap: 10px;
            flex-wrap: wrap;
          }

          .mrp-btn-link {
            color: var(--mrp-blue);
            font-weight: 800;
            text-decoration: underline;
            text-decoration-color: rgba(11, 58, 103, 0.25);
            text-underline-offset: 4px;
          }

          .mrp-hero-card {
            background: var(--mrp-card);
            border: 1px solid rgba(11, 18, 32, 0.10);
            border-radius: 18px;
            box-shadow: var(--mrp-shadow);
            overflow: hidden;
          }

          .mrp-hero-card-top {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 14px 14px 12px;
            border-bottom: 1px solid rgba(11, 18, 32, 0.08);
            background: rgba(255, 255, 255, 0.92);
          }

          .mrp-card-title {
            font-family: ui-serif, Georgia, "Times New Roman", Times, serif;
            font-weight: 700;
            font-size: 16px;
          }

          .mrp-pill {
            font-size: 12px;
            font-weight: 800;
            color: rgba(11, 18, 32, 0.72);
            background: rgba(11, 58, 103, 0.08);
            border: 1px solid rgba(11, 58, 103, 0.14);
            padding: 7px 10px;
            border-radius: 999px;
            white-space: nowrap;
          }

          .mrp-signal-list {
            padding: 12px 14px;
            display: grid;
            gap: 10px;
          }

          .mrp-signal-row {
            display: grid;
            grid-template-columns: 14px 1fr auto;
            align-items: center;
            gap: 10px;
            border: 1px solid rgba(11, 18, 32, 0.08);
            border-radius: 16px;
            padding: 10px 12px;
            background: rgba(255, 255, 255, 0.96);
          }

          .mrp-status-dot {
            width: 10px;
            height: 10px;
            border-radius: 999px;
          }
          .dotHigh {
            background: #dc2626;
          }
          .dotMed {
            background: #f59e0b;
          }
          .dotLow {
            background: #16a34a;
          }

          .mrp-signal-title {
            font-weight: 900;
            font-size: 13px;
          }
          .mrp-signal-sub {
            margin-top: 2px;
            font-size: 12px;
            color: rgba(11, 18, 32, 0.62);
          }

          .mrp-tag {
            font-size: 12px;
            font-weight: 800;
            color: rgba(11, 18, 32, 0.78);
            background: rgba(243, 245, 249, 0.95);
            border: 1px solid rgba(11, 18, 32, 0.10);
            padding: 6px 10px;
            border-radius: 999px;
            white-space: nowrap;
          }

          .mrp-hero-card-foot {
            padding: 12px 14px 14px;
            border-top: 1px solid rgba(11, 18, 32, 0.08);
            font-size: 12px;
            color: rgba(11, 18, 32, 0.62);
            background: rgba(255, 255, 255, 0.86);
          }

          .mrp-alert {
            margin: 14px 0 18px;
            border-radius: 14px;
            padding: 14px;
            border: 1px solid rgba(11, 18, 32, 0.12);
          }

          .mrp-alert-title {
            font-weight: 900;
          }

          .mrp-alert-text {
            margin-top: 6px;
            color: rgba(11, 18, 32, 0.78);
            line-height: 1.5;
          }

          .mrp-alert-error {
            border-color: rgba(239, 68, 68, 0.22);
            background: rgba(239, 68, 68, 0.08);
          }

          .mrp-card {
            background: var(--mrp-card);
            border: 1px solid rgba(11, 18, 32, 0.10);
            border-radius: 18px;
            box-shadow: var(--mrp-shadow);
            padding: 18px;
            margin-bottom: 16px;
          }

          .mrp-card-head {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 12px;
            flex-wrap: wrap;
            margin-bottom: 10px;
          }

          .mrp-h2 {
            margin: 0;
            font-family: ui-serif, Georgia, "Times New Roman", Times, serif;
            font-weight: 700;
            font-size: 22px;
          }

          .mrp-muted {
            margin: 8px 0 0;
            color: var(--mrp-muted);
            line-height: 1.6;
          }

          .mrp-kpi {
            text-align: right;
            padding: 10px 12px;
            border: 1px solid rgba(11, 18, 32, 0.10);
            background: rgba(255, 255, 255, 0.7);
            border-radius: 16px;
            min-width: 120px;
          }
          .mrp-kpi-label {
            font-size: 12px;
            color: rgba(11, 18, 32, 0.62);
            font-weight: 800;
          }
          .mrp-kpi-value {
            margin-top: 4px;
            font-weight: 900;
            font-size: 22px;
            letter-spacing: -0.02em;
          }

          .mrp-bar {
            height: 10px;
            background: rgba(11, 18, 32, 0.08);
            border-radius: 999px;
            overflow: hidden;
          }
          .mrp-bar-fill {
            height: 100%;
            background: var(--mrp-blue);
            border-radius: 999px;
            transition: width 240ms ease;
          }
          .mrp-bar-note {
            margin-top: 8px;
            font-size: 12px;
            color: rgba(11, 18, 32, 0.62);
          }

          .mrp-actions {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
          }

          .mrp-btn-primary {
            height: 44px;
            padding: 0 14px;
            border-radius: 14px;
            border: 1px solid rgba(11, 58, 103, 0.35);
            background: var(--mrp-blue);
            color: #fff;
            font-weight: 900;
            cursor: pointer;
            box-shadow: 0 14px 24px rgba(11, 58, 103, 0.18);
          }

          .mrp-btn-primary:hover {
            background: var(--mrp-blue2);
          }

          .mrp-btn-secondary {
            height: 44px;
            padding: 0 14px;
            border-radius: 14px;
            border: 1px solid rgba(11, 18, 32, 0.14);
            background: rgba(255, 255, 255, 0.92);
            color: rgba(11, 18, 32, 0.9);
            font-weight: 900;
            cursor: pointer;
            box-shadow: 0 10px 22px rgba(11, 18, 32, 0.06);
          }

          .mrp-btn-secondary:hover {
            transform: translateY(-1px);
          }

          .mrp-btn-disabled,
          button:disabled {
            opacity: 0.6;
            cursor: not-allowed !important;
            transform: none !important;
          }

          .mrp-grid2 {
            margin-top: 14px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
          }

          .mrp-subcard {
            border: 1px solid rgba(11, 18, 32, 0.10);
            background: rgba(255, 255, 255, 0.86);
            border-radius: 16px;
            padding: 14px;
          }

          .mrp-subhead {
            font-size: 12px;
            font-weight: 900;
            color: rgba(11, 18, 32, 0.62);
            letter-spacing: 0.02em;
            text-transform: uppercase;
          }

          .mrp-subbody {
            margin-top: 10px;
            line-height: 1.8;
            color: rgba(11, 18, 32, 0.82);
          }

          .mrp-chip {
            display: inline-flex;
            align-items: center;
            padding: 6px 10px;
            border-radius: 999px;
            font-size: 12px;
            font-weight: 900;
            border: 1px solid rgba(11, 18, 32, 0.12);
            background: rgba(243, 245, 249, 0.9);
            margin-left: 8px;
            white-space: nowrap;
          }
          .toneSuccess {
            border-color: rgba(34, 197, 94, 0.22);
            background: rgba(34, 197, 94, 0.10);
            color: rgba(11, 18, 32, 0.86);
          }
          .toneInfo {
            border-color: rgba(59, 130, 246, 0.22);
            background: rgba(59, 130, 246, 0.10);
            color: rgba(11, 18, 32, 0.86);
          }
          .toneNeutral {
            border-color: rgba(11, 18, 32, 0.12);
            background: rgba(243, 245, 249, 0.9);
            color: rgba(11, 18, 32, 0.78);
          }

          .mrp-list {
            margin-top: 10px;
            display: grid;
            gap: 10px;
          }

          .mrp-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            padding: 14px;
            border: 1px solid rgba(11, 18, 32, 0.10);
            border-radius: 16px;
            background: rgba(255, 255, 255, 0.9);
          }

          .mrp-row-left {
            min-width: 0;
          }

          .mrp-row-title {
            display: flex;
            align-items: center;
            gap: 10px;
            flex-wrap: wrap;
          }

          .mrp-row-sub {
            margin-top: 6px;
            font-size: 12px;
            color: rgba(11, 18, 32, 0.62);
          }

          .mrp-row-actions {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
            justify-content: flex-end;
          }

          .mrp-btn-small {
            height: 38px;
            padding: 0 12px;
            border-radius: 12px;
            border: 1px solid rgba(11, 18, 32, 0.14);
            background: rgba(255, 255, 255, 0.92);
            color: rgba(11, 18, 32, 0.9);
            font-weight: 900;
            cursor: pointer;
          }

          .mrp-btn-small-primary {
            background: var(--mrp-blue);
            border-color: rgba(11, 58, 103, 0.35);
            color: white;
          }

          .mrp-btn-small-primary:hover {
            background: var(--mrp-blue2);
          }

          .mrp-footer {
            margin-top: 18px;
            padding: 18px 0 26px;
            border-top: 1px solid rgba(11, 18, 32, 0.08);
            color: rgba(11, 18, 32, 0.6);
            font-size: 12px;
          }

          @media (max-width: 980px) {
            .mrp-hero {
              grid-template-columns: 1fr;
            }
            .mrp-grid2 {
              grid-template-columns: 1fr;
            }
          }

          @media (max-width: 560px) {
            .mrp-nav {
              gap: 12px;
            }
            .mrp-h1 {
              font-size: 36px;
            }
            .mrp-logo {
              width: 46px;
              height: 46px;
            }
          }
        `}</style>
      </div>
    </>
  );
}
