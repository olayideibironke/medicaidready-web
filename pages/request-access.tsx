// pages/request-access.tsx
import Head from "next/head";
import Link from "next/link";
import { useMemo, useState } from "react";

type SubmitState = "idle" | "submitting" | "success" | "error";

export default function RequestAccessPage() {
  // DO NOT change backend logic: keep POST to same endpoint
  const API_ENDPOINT = "/api/request-access";

  const [fullName, setFullName] = useState("");
  const [workEmail, setWorkEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [roleTitle, setRoleTitle] = useState("");
  const [stateCode, setStateCode] = useState("");
  const [notes, setNotes] = useState("");

  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const emailOk = useMemo(() => {
    const email = workEmail.trim();
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }, [workEmail]);

  const canSubmit = useMemo(() => {
    return emailOk && submitState !== "submitting" && submitState !== "success";
  }, [emailOk, submitState]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!emailOk || submitState === "submitting") return;

    setSubmitState("submitting");
    setErrorMessage("");

    try {
      const payload: Record<string, string> = {
        email: workEmail.trim(),
      };

      const n = fullName.trim();
      const o = organization.trim();
      const r = roleTitle.trim();
      const s = stateCode.trim();
      const msg = notes.trim();

      if (n) payload.name = n;
      if (o) payload.organization = o;
      if (r) payload.role = r;
      if (s) payload.state = s;
      if (msg) payload.message = msg;

      const res = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let detail = "";
        try {
          const data = await res.json();
          detail =
            typeof data?.error === "string"
              ? data.error
              : typeof data?.message === "string"
              ? data.message
              : "";
        } catch {
          // ignore
        }
        throw new Error(detail || "Request failed. Please try again.");
      }

      setSubmitState("success");
    } catch (err: any) {
      setSubmitState("error");
      setErrorMessage(err?.message || "Something went wrong. Please try again.");
    }
  }

  return (
    <>
      <Head>
        <title>Request Access • MedicaidReady</title>
        <meta
          name="description"
          content="Request access to MedicaidReady. Submit your work email and we’ll follow up."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="mr-root">
        <div className="mr-bg" aria-hidden="true" />

        <header className="mr-header">
          <div className="mr-shell mr-header-inner">
            <Link href="/" className="mr-brand" aria-label="Go to home">
              <span className="mr-mark" aria-hidden="true">
                <span className="mr-mark-dot" />
              </span>
              <span className="mr-brand-text">
                <span className="mr-brand-title">MedicaidReady</span>
                <span className="mr-brand-sub">Provider intelligence</span>
              </span>
            </Link>

            <nav className="mr-nav" aria-label="Primary">
              <Link href="/pricing" className="mr-nav-link">
                Pricing
              </Link>
              <Link href="/request-access" className="mr-nav-link mr-nav-active">
                Request Access
              </Link>
              <span className="mr-sep" aria-hidden="true" />
              <Link href="/pricing" className="mr-cta">
                View Plans
              </Link>
            </nav>

            <div className="mr-nav-mobile">
              <Link href="/pricing" className="mr-cta mr-cta-compact">
                Pricing
              </Link>
            </div>
          </div>
        </header>

        <main className="mr-main">
          <div className="mr-shell mr-grid">
            <section className="mr-left">
              <div className="mr-pill">
                <span className="mr-pill-dot" aria-hidden="true" />
                Access is reviewed within 1–2 business days
              </div>

              <h1 className="mr-h1">Request Access</h1>
              <p className="mr-lead">
                MedicaidReady is a premium provider analytics experience. Submit
                your details and we’ll confirm next steps.
              </p>

              <div className="mr-cards">
                <div className="mr-card">
                  <div className="mr-icon" aria-hidden="true">
                    🔒
                  </div>
                  <div>
                    <div className="mr-card-title">Secure by design</div>
                    <div className="mr-card-text">
                      Your info is used only to evaluate access. No spam.
                    </div>
                  </div>
                </div>

                <div className="mr-card">
                  <div className="mr-icon" aria-hidden="true">
                    ⚡
                  </div>
                  <div>
                    <div className="mr-card-title">Fast onboarding</div>
                    <div className="mr-card-text">
                      Once approved, you’ll be guided into your plan and workspace.
                    </div>
                  </div>
                </div>

                <div className="mr-card">
                  <div className="mr-icon" aria-hidden="true">
                    📈
                  </div>
                  <div>
                    <div className="mr-card-title">Premium insights</div>
                    <div className="mr-card-text">
                      Risk signals, issues, and provider profiles in one place.
                    </div>
                  </div>
                </div>
              </div>

              <div className="mr-footnote">
                Already evaluating plans?{" "}
                <Link href="/pricing" className="mr-link">
                  Compare Pricing
                </Link>
              </div>
            </section>

            <section className="mr-right">
              <div className="mr-panel">
                <div className="mr-panel-top">
                  <div>
                    <h2 className="mr-h2">Access request form</h2>
                    <p className="mr-sub">
                      Use your work email. Optional details help speed approval.
                    </p>
                  </div>
                  <div className="mr-tip">Tip: add org + role</div>
                </div>

                {submitState === "success" && (
                  <div className="mr-alert mr-alert-success" role="status">
                    <div className="mr-alert-title">Request received.</div>
                    <div className="mr-alert-text">
                      We’ll follow up by email with next steps.
                    </div>
                  </div>
                )}

                {submitState === "error" && (
                  <div className="mr-alert mr-alert-error" role="alert">
                    <div className="mr-alert-title">Submission failed.</div>
                    <div className="mr-alert-text">
                      {errorMessage || "Please try again."}
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="mr-form">
                  <div className="mr-row">
                    <Field
                      label="Full name (optional)"
                      value={fullName}
                      onChange={setFullName}
                      placeholder="e.g., Olayide Ibironke"
                      autoComplete="name"
                    />
                    <Field
                      label="Work email"
                      value={workEmail}
                      onChange={setWorkEmail}
                      placeholder="name@organization.com"
                      autoComplete="email"
                      required
                      helper={
                        !workEmail
                          ? ""
                          : emailOk
                          ? ""
                          : "Enter a valid email address."
                      }
                      invalid={!!workEmail && !emailOk}
                    />
                  </div>

                  <div className="mr-row">
                    <Field
                      label="Organization (optional)"
                      value={organization}
                      onChange={setOrganization}
                      placeholder="e.g., ACME Health"
                      autoComplete="organization"
                    />
                    <Field
                      label="Role / title (optional)"
                      value={roleTitle}
                      onChange={setRoleTitle}
                      placeholder="e.g., Program Analyst"
                      autoComplete="organization-title"
                    />
                  </div>

                  <div className="mr-row">
                    <Field
                      label="Primary state (optional)"
                      value={stateCode}
                      onChange={(v) => setStateCode(v.toUpperCase())}
                      placeholder="e.g., MD"
                      maxLength={2}
                    />
                    <div className="mr-mini">
                      <div className="mr-mini-title">What happens next</div>
                      <div className="mr-mini-text">
                        We review your request and reply with approval or a follow-up
                        question.
                      </div>
                    </div>
                  </div>

                  <div className="mr-block">
                    <label className="mr-label">Notes (optional)</label>
                    <textarea
                      className="mr-textarea"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={4}
                      placeholder="Tell us what you’re trying to do with MedicaidReady (optional)."
                    />
                  </div>

                  <div className="mr-actions">
                    <button
                      type="submit"
                      className={
                        "mr-button " +
                        (submitState === "success"
                          ? "mr-button-success"
                          : "mr-button-primary") +
                        (!canSubmit ? " mr-button-disabled" : "")
                      }
                      disabled={!canSubmit}
                    >
                      {submitState === "submitting"
                        ? "Submitting…"
                        : submitState === "success"
                        ? "Submitted"
                        : "Request Access"}
                    </button>

                    <div className="mr-legal">
                      By submitting, you agree we can contact you about access.
                    </div>
                  </div>
                </form>
              </div>

              <div className="mr-tags" aria-hidden="true">
                <span className="mr-tag">Premium UI system</span>
                <span className="mr-tag">Pages Router compatible</span>
                <span className="mr-tag">No backend changes</span>
              </div>
            </section>
          </div>

          <footer className="mr-footer">
            <div className="mr-shell mr-footer-inner">
              <div>© {new Date().getFullYear()} MedicaidReady</div>
              <div className="mr-footer-links">
                <Link href="/pricing" className="mr-footer-link">
                  Pricing
                </Link>
                <Link href="/" className="mr-footer-link">
                  Home
                </Link>
              </div>
            </div>
          </footer>
        </main>

        <style jsx global>{`
          :root {
            --mr-bg: #070a12;
            --mr-card: rgba(255, 255, 255, 0.06);
            --mr-card-2: rgba(0, 0, 0, 0.25);
            --mr-border: rgba(255, 255, 255, 0.12);
            --mr-border-soft: rgba(255, 255, 255, 0.1);
            --mr-text: rgba(255, 255, 255, 0.92);
            --mr-muted: rgba(255, 255, 255, 0.68);
            --mr-muted2: rgba(255, 255, 255, 0.56);
            --mr-shadow: 0 18px 60px rgba(0, 0, 0, 0.45);
            --mr-radius-xl: 24px;
            --mr-radius-2xl: 28px;
            --mr-radius-3xl: 32px;
            --mr-focus: 0 0 0 4px rgba(255, 255, 255, 0.12);
          }

          html,
          body {
            background: var(--mr-bg);
          }

          .mr-root {
            min-height: 100vh;
            color: var(--mr-text);
            background: var(--mr-bg);
            position: relative;
            isolation: isolate;
            font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto,
              Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
          }

          .mr-bg {
            position: fixed;
            inset: 0;
            z-index: -1;
            pointer-events: none;
            background: radial-gradient(
                60% 40% at 50% 0%,
                rgba(255, 255, 255, 0.08),
                rgba(255, 255, 255, 0) 65%
              ),
              radial-gradient(
                520px 520px at 50% -10%,
                rgba(217, 70, 239, 0.12),
                rgba(255, 255, 255, 0) 70%
              ),
              radial-gradient(
                520px 520px at 95% 110%,
                rgba(34, 211, 238, 0.12),
                rgba(255, 255, 255, 0) 70%
              ),
              linear-gradient(
                to bottom,
                rgba(0, 0, 0, 0),
                rgba(0, 0, 0, 0.25),
                rgba(0, 0, 0, 0.6)
              );
            filter: saturate(1.05);
          }

          .mr-shell {
            width: 100%;
            max-width: 1100px;
            margin: 0 auto;
            padding: 0 16px;
          }

          .mr-header {
            position: sticky;
            top: 0;
            z-index: 50;
            border-bottom: 1px solid var(--mr-border-soft);
            background: rgba(0, 0, 0, 0.25);
            backdrop-filter: blur(14px);
          }

          .mr-header-inner {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 14px 0;
            gap: 12px;
          }

          .mr-brand {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            text-decoration: none;
            color: var(--mr-text);
          }

          .mr-brand:focus-visible {
            outline: none;
            box-shadow: var(--mr-focus);
            border-radius: 14px;
          }

          .mr-mark {
            width: 38px;
            height: 38px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 14px;
            border: 1px solid var(--mr-border-soft);
            background: rgba(255, 255, 255, 0.05);
            box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.04);
          }

          .mr-mark-dot {
            width: 16px;
            height: 16px;
            border-radius: 6px;
            background: linear-gradient(135deg, #e879f9, #22d3ee);
            box-shadow: 0 0 26px rgba(217, 70, 239, 0.2);
          }

          .mr-brand-text {
            display: flex;
            flex-direction: column;
            line-height: 1.1;
          }

          .mr-brand-title {
            font-weight: 700;
            font-size: 14px;
            letter-spacing: 0.2px;
          }

          .mr-brand-sub {
            font-size: 12px;
            color: var(--mr-muted2);
            margin-top: 2px;
          }

          .mr-nav {
            display: none;
            align-items: center;
            gap: 6px;
          }

          .mr-nav-link {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 10px 12px;
            border-radius: 14px;
            color: var(--mr-muted);
            text-decoration: none;
            font-size: 14px;
            transition: background 160ms ease, color 160ms ease;
          }

          .mr-nav-link:hover {
            background: rgba(255, 255, 255, 0.06);
            color: var(--mr-text);
          }

          .mr-nav-active {
            color: var(--mr-text);
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.08);
          }

          .mr-sep {
            width: 1px;
            height: 22px;
            background: rgba(255, 255, 255, 0.12);
            margin: 0 6px;
          }

          .mr-cta {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 10px 14px;
            border-radius: 14px;
            background: #ffffff;
            color: #000;
            text-decoration: none;
            font-weight: 700;
            font-size: 14px;
            transition: transform 120ms ease, opacity 120ms ease;
            box-shadow: 0 10px 30px rgba(255, 255, 255, 0.1);
          }

          .mr-cta:hover {
            transform: translateY(-1px);
            opacity: 0.92;
          }

          .mr-cta-compact {
            padding: 9px 12px;
            border-radius: 12px;
          }

          .mr-nav-mobile {
            display: inline-flex;
          }

          .mr-main {
            padding: 28px 0 0;
          }

          .mr-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 22px;
            padding: 28px 0 22px;
          }

          .mr-left {
            padding-top: 6px;
          }

          .mr-pill {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            padding: 8px 12px;
            border-radius: 999px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            background: rgba(255, 255, 255, 0.05);
            color: rgba(255, 255, 255, 0.75);
            font-size: 12px;
          }

          .mr-pill-dot {
            width: 8px;
            height: 8px;
            border-radius: 999px;
            background: rgba(52, 211, 153, 1);
            box-shadow: 0 0 18px rgba(52, 211, 153, 0.35);
          }

          .mr-h1 {
            margin: 14px 0 0;
            font-size: 36px;
            line-height: 1.06;
            letter-spacing: -0.6px;
            font-weight: 800;
          }

          .mr-lead {
            margin: 12px 0 0;
            color: var(--mr-muted);
            font-size: 15px;
            line-height: 1.6;
            max-width: 50ch;
          }

          .mr-cards {
            margin-top: 18px;
            display: grid;
            gap: 12px;
          }

          .mr-card {
            display: flex;
            gap: 12px;
            align-items: flex-start;
            padding: 14px;
            border-radius: var(--mr-radius-xl);
            border: 1px solid rgba(255, 255, 255, 0.1);
            background: rgba(255, 255, 255, 0.05);
          }

          .mr-icon {
            width: 38px;
            height: 38px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 14px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            background: rgba(0, 0, 0, 0.22);
            font-size: 18px;
            flex: 0 0 auto;
          }

          .mr-card-title {
            font-weight: 800;
            font-size: 14px;
          }

          .mr-card-text {
            margin-top: 4px;
            color: var(--mr-muted);
            font-size: 14px;
            line-height: 1.45;
          }

          .mr-footnote {
            margin-top: 14px;
            color: var(--mr-muted2);
            font-size: 14px;
          }

          .mr-link {
            color: var(--mr-text);
            text-decoration: underline;
            text-decoration-color: rgba(255, 255, 255, 0.3);
            text-underline-offset: 3px;
          }

          .mr-right {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }

          .mr-panel {
            position: relative;
            overflow: hidden;
            border-radius: var(--mr-radius-3xl);
            border: 1px solid rgba(255, 255, 255, 0.1);
            background: rgba(255, 255, 255, 0.06);
            box-shadow: var(--mr-shadow);
            padding: 18px;
          }

          .mr-panel:before {
            content: "";
            position: absolute;
            inset: 0;
            pointer-events: none;
            background: radial-gradient(
                80% 60% at 20% 0%,
                rgba(217, 70, 239, 0.14),
                rgba(255, 255, 255, 0) 55%
              ),
              radial-gradient(
                80% 60% at 80% 20%,
                rgba(34, 211, 238, 0.12),
                rgba(255, 255, 255, 0) 55%
              );
            opacity: 0.9;
          }

          .mr-panel > * {
            position: relative;
          }

          .mr-panel-top {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 12px;
          }

          .mr-h2 {
            margin: 0;
            font-size: 18px;
            font-weight: 800;
            letter-spacing: -0.2px;
          }

          .mr-sub {
            margin: 6px 0 0;
            color: var(--mr-muted);
            font-size: 14px;
            line-height: 1.5;
          }

          .mr-tip {
            display: none;
            white-space: nowrap;
            align-self: flex-start;
            padding: 10px 12px;
            border-radius: 18px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            background: rgba(0, 0, 0, 0.22);
            color: rgba(255, 255, 255, 0.72);
            font-size: 12px;
          }

          .mr-alert {
            margin-top: 14px;
            padding: 14px;
            border-radius: var(--mr-radius-xl);
            border: 1px solid rgba(255, 255, 255, 0.12);
            background: rgba(255, 255, 255, 0.06);
          }

          .mr-alert-title {
            font-weight: 800;
            font-size: 14px;
          }

          .mr-alert-text {
            margin-top: 4px;
            font-size: 14px;
            line-height: 1.45;
            color: rgba(255, 255, 255, 0.78);
          }

          .mr-alert-success {
            border-color: rgba(52, 211, 153, 0.22);
            background: rgba(52, 211, 153, 0.12);
          }

          .mr-alert-success .mr-alert-title {
            color: rgba(167, 243, 208, 0.95);
          }

          .mr-alert-error {
            border-color: rgba(251, 113, 133, 0.22);
            background: rgba(251, 113, 133, 0.12);
          }

          .mr-alert-error .mr-alert-title {
            color: rgba(254, 202, 202, 0.95);
          }

          .mr-form {
            margin-top: 14px;
            display: flex;
            flex-direction: column;
            gap: 14px;
          }

          .mr-row {
            display: grid;
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .mr-mini {
            border-radius: var(--mr-radius-xl);
            border: 1px solid rgba(255, 255, 255, 0.1);
            background: rgba(0, 0, 0, 0.22);
            padding: 14px;
          }

          .mr-mini-title {
            font-weight: 800;
            font-size: 14px;
          }

          .mr-mini-text {
            margin-top: 6px;
            font-size: 14px;
            line-height: 1.45;
            color: rgba(255, 255, 255, 0.7);
          }

          .mr-block {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }

          .mr-label {
            font-size: 14px;
            font-weight: 700;
            color: rgba(255, 255, 255, 0.85);
          }

          .mr-input {
            width: 100%;
            border-radius: 18px;
            border: 1px solid rgba(255, 255, 255, 0.12);
            background: rgba(0, 0, 0, 0.24);
            color: rgba(255, 255, 255, 0.92);
            padding: 12px 14px;
            font-size: 14px;
            outline: none;
            transition: border-color 160ms ease, background 160ms ease;
          }

          .mr-input::placeholder {
            color: rgba(255, 255, 255, 0.42);
          }

          .mr-input:focus {
            border-color: rgba(255, 255, 255, 0.22);
            background: rgba(0, 0, 0, 0.28);
            box-shadow: var(--mr-focus);
          }

          .mr-input-invalid {
            border-color: rgba(251, 113, 133, 0.35);
          }

          .mr-helper {
            margin-top: 6px;
            font-size: 12px;
            color: rgba(251, 113, 133, 0.92);
          }

          .mr-textarea {
            width: 100%;
            border-radius: 18px;
            border: 1px solid rgba(255, 255, 255, 0.12);
            background: rgba(0, 0, 0, 0.24);
            color: rgba(255, 255, 255, 0.92);
            padding: 12px 14px;
            font-size: 14px;
            outline: none;
            resize: vertical;
            min-height: 110px;
            transition: border-color 160ms ease, background 160ms ease;
          }

          .mr-textarea::placeholder {
            color: rgba(255, 255, 255, 0.42);
          }

          .mr-textarea:focus {
            border-color: rgba(255, 255, 255, 0.22);
            background: rgba(0, 0, 0, 0.28);
            box-shadow: var(--mr-focus);
          }

          .mr-actions {
            display: flex;
            flex-direction: column;
            gap: 10px;
            margin-top: 4px;
          }

          .mr-button {
            width: 100%;
            border: none;
            border-radius: 18px;
            padding: 13px 16px;
            font-weight: 800;
            font-size: 14px;
            cursor: pointer;
            transition: transform 120ms ease, opacity 120ms ease;
            box-shadow: 0 18px 60px rgba(255, 255, 255, 0.1);
          }

          .mr-button-primary {
            background: #ffffff;
            color: #000000;
          }

          .mr-button-success {
            background: rgba(52, 211, 153, 1);
            color: #000000;
          }

          .mr-button:hover {
            transform: translateY(-1px);
            opacity: 0.94;
          }

          .mr-button-disabled,
          .mr-button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none !important;
          }

          .mr-legal {
            font-size: 12px;
            color: rgba(255, 255, 255, 0.55);
          }

          .mr-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 2px;
          }

          .mr-tag {
            display: inline-flex;
            align-items: center;
            padding: 7px 10px;
            border-radius: 999px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            background: rgba(255, 255, 255, 0.05);
            color: rgba(255, 255, 255, 0.62);
            font-size: 12px;
          }

          .mr-footer {
            margin-top: 26px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            padding: 18px 0 22px;
            color: rgba(255, 255, 255, 0.6);
            font-size: 14px;
          }

          .mr-footer-inner {
            display: flex;
            flex-direction: column;
            gap: 10px;
            align-items: flex-start;
            justify-content: space-between;
          }

          .mr-footer-links {
            display: flex;
            align-items: center;
            gap: 14px;
          }

          .mr-footer-link {
            color: rgba(255, 255, 255, 0.65);
            text-decoration: none;
          }

          .mr-footer-link:hover {
            color: rgba(255, 255, 255, 0.92);
            text-decoration: underline;
            text-decoration-color: rgba(255, 255, 255, 0.25);
            text-underline-offset: 3px;
          }

          /* Responsive */
          @media (min-width: 640px) {
            .mr-shell {
              padding: 0 24px;
            }
            .mr-nav {
              display: inline-flex;
            }
            .mr-nav-mobile {
              display: none;
            }
            .mr-row {
              grid-template-columns: 1fr 1fr;
            }
            .mr-actions {
              flex-direction: row;
              align-items: center;
              justify-content: space-between;
              gap: 14px;
            }
            .mr-button {
              width: auto;
              min-width: 200px;
            }
            .mr-tip {
              display: inline-flex;
            }
            .mr-footer-inner {
              flex-direction: row;
              align-items: center;
            }
          }

          @media (min-width: 1024px) {
            .mr-grid {
              grid-template-columns: 5fr 7fr;
              gap: 28px;
              padding: 42px 0 26px;
            }
            .mr-h1 {
              font-size: 42px;
            }
            .mr-panel {
              padding: 22px;
            }
          }
        `}</style>
      </div>
    </>
  );
}

function Field(props: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  maxLength?: number;
  helper?: string;
  invalid?: boolean;
}) {
  return (
    <div className="mr-block">
      <label className="mr-label">
        {props.label}
        {props.required ? <span style={{ opacity: 0.7 }}> *</span> : null}
      </label>
      <input
        className={"mr-input" + (props.invalid ? " mr-input-invalid" : "")}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        placeholder={props.placeholder}
        autoComplete={props.autoComplete}
        required={props.required}
        maxLength={props.maxLength}
      />
      {props.helper ? <div className="mr-helper">{props.helper}</div> : null}
    </div>
  );
}
