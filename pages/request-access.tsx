// pages/request-access.tsx
import Head from "next/head";
import Link from "next/link";
import { useMemo, useState } from "react";

type SubmitState = "idle" | "submitting" | "success" | "error";

export default function RequestAccessPage() {
  // DO NOT change backend logic
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
      const payload: Record<string, string> = { email: workEmail.trim() };

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

      <div className="mrw-root">
        {/* Top header matching Pricing */}
        <header className="mrw-header">
          <div className="mrw-shell mrw-header-inner">
            <Link href="/" className="mrw-brand" aria-label="Go to home">
              <span className="mrw-logo" aria-hidden="true" />
              <span className="mrw-brand-text">
                <span className="mrw-brand-title">MedicaidReady</span>
                <span className="mrw-brand-sub">MD • VA • DC</span>
              </span>
            </Link>

            <nav className="mrw-nav" aria-label="Primary navigation">
              <Link href="/" className="mrw-nav-link">
                Home
              </Link>
              <Link href="/request-access" className="mrw-nav-link mrw-active">
                Request Access
              </Link>
              <Link href="/signin" className="mrw-nav-cta">
                Sign in
              </Link>
            </nav>
          </div>
        </header>

        <main className="mrw-main">
          <div className="mrw-shell">
            <div className="mrw-hero">
              <h1 className="mrw-h1">Request access</h1>
              <p className="mrw-lead">
                Submit your details and we’ll review and approve your account.
              </p>
            </div>

            <div className="mrw-grid">
              {/* Left card: simple explanation like pricing */}
              <section className="mrw-card">
                <h2 className="mrw-card-title">Prefer to request access first?</h2>
                <p className="mrw-card-text">
                  Use your work email. Optional details help speed approval.
                </p>

                <ul className="mrw-bullets">
                  <li>Reviewed within 1–2 business days</li>
                  <li>No spam — we only contact you about access</li>
                  <li>Once approved, you can sign in immediately</li>
                </ul>

                <div className="mrw-mini-note">
                  Already comparing plans?{" "}
                  <Link href="/pricing" className="mrw-link">
                    View pricing
                  </Link>
                </div>
              </section>

              {/* Right card: the form (white, premium) */}
              <section className="mrw-card">
                <div className="mrw-formhead">
                  <h2 className="mrw-card-title">Request access</h2>
                  <div className="mrw-badge">Reviewed quickly</div>
                </div>

                {submitState === "success" && (
                  <div className="mrw-alert mrw-alert-success" role="status">
                    <div className="mrw-alert-title">Request received.</div>
                    <div className="mrw-alert-text">
                      We’ll follow up by email with next steps.
                    </div>
                  </div>
                )}

                {submitState === "error" && (
                  <div className="mrw-alert mrw-alert-error" role="alert">
                    <div className="mrw-alert-title">Submission failed.</div>
                    <div className="mrw-alert-text">
                      {errorMessage || "Please try again."}
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="mrw-form">
                  <div className="mrw-field">
                    <label className="mrw-label">Work email</label>
                    <input
                      className={
                        "mrw-input" + (workEmail && !emailOk ? " mrw-input-invalid" : "")
                      }
                      value={workEmail}
                      onChange={(e) => setWorkEmail(e.target.value)}
                      placeholder="name@organization.com"
                      autoComplete="email"
                      required
                    />
                    {workEmail && !emailOk ? (
                      <div className="mrw-help">Enter a valid email address.</div>
                    ) : null}
                  </div>

                  <div className="mrw-2col">
                    <div className="mrw-field">
                      <label className="mrw-label">Full name (optional)</label>
                      <input
                        className="mrw-input"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g., John Doe"
                        autoComplete="name"
                      />
                    </div>

                    <div className="mrw-field">
                      <label className="mrw-label">Primary state (optional)</label>
                      <input
                        className="mrw-input"
                        value={stateCode}
                        onChange={(e) => setStateCode(e.target.value.toUpperCase())}
                        placeholder="e.g., MD"
                        maxLength={2}
                      />
                    </div>
                  </div>

                  <div className="mrw-2col">
                    <div className="mrw-field">
                      <label className="mrw-label">Organization (optional)</label>
                      <input
                        className="mrw-input"
                        value={organization}
                        onChange={(e) => setOrganization(e.target.value)}
                        placeholder="e.g., ACME Health"
                        autoComplete="organization"
                      />
                    </div>

                    <div className="mrw-field">
                      <label className="mrw-label">Role / title (optional)</label>
                      <input
                        className="mrw-input"
                        value={roleTitle}
                        onChange={(e) => setRoleTitle(e.target.value)}
                        placeholder="e.g., Program Analyst"
                        autoComplete="organization-title"
                      />
                    </div>
                  </div>

                  <div className="mrw-field">
                    <label className="mrw-label">Notes (optional)</label>
                    <textarea
                      className="mrw-textarea"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={4}
                      placeholder="Tell us what you’re trying to do with MedicaidReady (optional)."
                    />
                  </div>

                  <button
                    type="submit"
                    className={"mrw-btn" + (!canSubmit ? " mrw-btn-disabled" : "")}
                    disabled={!canSubmit}
                  >
                    {submitState === "submitting"
                      ? "Submitting..."
                      : submitState === "success"
                      ? "Submitted"
                      : "Request access"}
                  </button>

                  <div className="mrw-legal">
                    By submitting, you agree we can contact you about access.
                  </div>
                </form>
              </section>
            </div>

            <footer className="mrw-footer">
              <div className="mrw-footer-inner">
                <div>© {new Date().getFullYear()} MedicaidReady</div>
                <div className="mrw-footer-links">
                  <Link href="/pricing" className="mrw-footer-link">
                    Pricing
                  </Link>
                  <Link href="/" className="mrw-footer-link">
                    Home
                  </Link>
                </div>
              </div>
            </footer>
          </div>
        </main>

        <style jsx global>{`
          :root {
            --mrw-ink: #0b1220;
            --mrw-muted: rgba(11, 18, 32, 0.72);
            --mrw-border: rgba(11, 18, 32, 0.12);
            --mrw-border2: rgba(11, 18, 32, 0.08);
            --mrw-card: rgba(255, 255, 255, 0.92);
            --mrw-shadow: 0 16px 40px rgba(11, 18, 32, 0.08);
            --mrw-blue: #0b3a67;
            --mrw-blue2: #0a2f55;
          }

          html,
          body {
            background: #f4f7fb;
            color: var(--mrw-ink);
          }

          .mrw-root {
            min-height: 100vh;
            color: var(--mrw-ink);
            font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto,
              Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
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
          }

          .mrw-shell {
            max-width: 1180px;
            margin: 0 auto;
            padding: 0 18px;
          }

          .mrw-header {
            position: sticky;
            top: 0;
            z-index: 30;
            background: rgba(255, 255, 255, 0.86);
            backdrop-filter: blur(10px);
            border-bottom: 1px solid var(--mrw-border2);
          }

          .mrw-header-inner {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16px 0;
            gap: 14px;
          }

          .mrw-brand {
            display: inline-flex;
            align-items: center;
            gap: 12px;
            text-decoration: none;
            color: var(--mrw-ink);
          }

          .mrw-brand:focus-visible {
            outline: none;
            box-shadow: 0 0 0 4px rgba(11, 58, 103, 0.18);
            border-radius: 14px;
          }

          .mrw-logo {
            width: 52px;
            height: 52px;
            border-radius: 14px;
            background: var(--mrw-blue);
            box-shadow: 0 10px 20px rgba(11, 58, 103, 0.18);
          }

          .mrw-brand-text {
            display: flex;
            flex-direction: column;
            line-height: 1.1;
          }

          .mrw-brand-title {
            font-family: ui-serif, Georgia, "Times New Roman", Times, serif;
            font-weight: 700;
            font-size: 20px;
            letter-spacing: 0.2px;
          }

          .mrw-brand-sub {
            margin-top: 4px;
            font-size: 13px;
            color: rgba(11, 18, 32, 0.65);
          }

          .mrw-nav {
            display: flex;
            align-items: center;
            gap: 22px;
          }

          .mrw-nav-link {
            text-decoration: none;
            color: rgba(11, 18, 32, 0.78);
            font-weight: 600;
          }

          .mrw-nav-link:hover {
            color: var(--mrw-ink);
            text-decoration: underline;
            text-decoration-color: rgba(11, 18, 32, 0.18);
            text-underline-offset: 4px;
          }

          .mrw-active {
            color: var(--mrw-ink);
          }

          .mrw-nav-cta {
            text-decoration: none;
            background: var(--mrw-blue);
            color: white;
            padding: 12px 18px;
            border-radius: 999px;
            font-weight: 700;
            box-shadow: 0 14px 24px rgba(11, 58, 103, 0.18);
          }

          .mrw-nav-cta:hover {
            background: var(--mrw-blue2);
          }

          .mrw-main {
            padding: 34px 0 22px;
          }

          .mrw-hero {
            padding: 12px 0 26px;
            border-bottom: 1px solid rgba(11, 18, 32, 0.08);
          }

          .mrw-h1 {
            margin: 0;
            font-family: ui-serif, Georgia, "Times New Roman", Times, serif;
            font-weight: 700;
            font-size: 56px;
            letter-spacing: -0.6px;
            color: #0b1220;
          }

          .mrw-lead {
            margin: 14px 0 0;
            font-size: 18px;
            color: var(--mrw-muted);
            max-width: 70ch;
            line-height: 1.6;
          }

          .mrw-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 20px;
            margin-top: 26px;
          }

          .mrw-card {
            background: var(--mrw-card);
            border: 1px solid rgba(11, 18, 32, 0.10);
            border-radius: 18px;
            box-shadow: var(--mrw-shadow);
            padding: 22px;
          }

          .mrw-card-title {
            margin: 0;
            font-family: ui-serif, Georgia, "Times New Roman", Times, serif;
            font-weight: 700;
            font-size: 22px;
            color: #0b1220;
          }

          .mrw-card-text {
            margin: 10px 0 0;
            color: var(--mrw-muted);
            font-size: 16px;
            line-height: 1.6;
          }

          .mrw-bullets {
            margin: 14px 0 0;
            padding-left: 18px;
            color: rgba(11, 18, 32, 0.80);
            line-height: 1.9;
          }

          .mrw-mini-note {
            margin-top: 16px;
            color: rgba(11, 18, 32, 0.72);
          }

          .mrw-link {
            color: var(--mrw-blue);
            font-weight: 700;
            text-decoration: underline;
            text-decoration-color: rgba(11, 58, 103, 0.25);
            text-underline-offset: 4px;
          }

          .mrw-formhead {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            margin-bottom: 12px;
          }

          .mrw-badge {
            font-size: 12px;
            font-weight: 800;
            color: rgba(11, 18, 32, 0.72);
            background: rgba(11, 58, 103, 0.08);
            border: 1px solid rgba(11, 58, 103, 0.14);
            padding: 8px 12px;
            border-radius: 999px;
            white-space: nowrap;
          }

          .mrw-alert {
            margin: 10px 0 14px;
            border-radius: 14px;
            padding: 14px;
            border: 1px solid rgba(11, 18, 32, 0.12);
            background: rgba(244, 247, 251, 0.8);
          }

          .mrw-alert-title {
            font-weight: 800;
          }

          .mrw-alert-text {
            margin-top: 6px;
            color: rgba(11, 18, 32, 0.78);
          }

          .mrw-alert-success {
            border-color: rgba(34, 197, 94, 0.22);
            background: rgba(34, 197, 94, 0.08);
          }

          .mrw-alert-error {
            border-color: rgba(239, 68, 68, 0.22);
            background: rgba(239, 68, 68, 0.08);
          }

          .mrw-form {
            margin-top: 6px;
            display: flex;
            flex-direction: column;
            gap: 14px;
          }

          .mrw-field {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }

          .mrw-label {
            font-weight: 700;
            color: rgba(11, 18, 32, 0.86);
          }

          .mrw-input {
            height: 46px;
            border-radius: 12px;
            border: 1px solid rgba(11, 18, 32, 0.16);
            padding: 0 14px;
            font-size: 16px;
            background: white;
            color: #0b1220;
            outline: none;
          }

          .mrw-input:focus {
            border-color: rgba(11, 58, 103, 0.42);
            box-shadow: 0 0 0 4px rgba(11, 58, 103, 0.12);
          }

          .mrw-input-invalid {
            border-color: rgba(239, 68, 68, 0.45);
          }

          .mrw-help {
            font-size: 13px;
            color: rgba(239, 68, 68, 0.9);
          }

          .mrw-2col {
            display: grid;
            grid-template-columns: 1fr;
            gap: 14px;
          }

          .mrw-textarea {
            border-radius: 12px;
            border: 1px solid rgba(11, 18, 32, 0.16);
            padding: 12px 14px;
            font-size: 16px;
            background: white;
            color: #0b1220;
            outline: none;
            resize: vertical;
            min-height: 112px;
          }

          .mrw-textarea:focus {
            border-color: rgba(11, 58, 103, 0.42);
            box-shadow: 0 0 0 4px rgba(11, 58, 103, 0.12);
          }

          .mrw-btn {
            height: 56px;
            border-radius: 14px;
            border: none;
            background: var(--mrw-blue);
            color: white;
            font-weight: 800;
            font-size: 18px;
            cursor: pointer;
            box-shadow: 0 18px 32px rgba(11, 58, 103, 0.18);
          }

          .mrw-btn:hover {
            background: var(--mrw-blue2);
          }

          .mrw-btn-disabled,
          .mrw-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }

          .mrw-legal {
            font-size: 13px;
            color: rgba(11, 18, 32, 0.62);
            line-height: 1.5;
          }

          .mrw-footer {
            margin-top: 26px;
            border-top: 1px solid rgba(11, 18, 32, 0.08);
            padding: 18px 0 26px;
            color: rgba(11, 18, 32, 0.6);
          }

          .mrw-footer-inner {
            display: flex;
            flex-direction: column;
            gap: 12px;
            align-items: flex-start;
            justify-content: space-between;
          }

          .mrw-footer-links {
            display: flex;
            gap: 14px;
            align-items: center;
          }

          .mrw-footer-link {
            text-decoration: none;
            color: rgba(11, 18, 32, 0.7);
            font-weight: 700;
          }

          .mrw-footer-link:hover {
            color: rgba(11, 18, 32, 0.95);
            text-decoration: underline;
            text-decoration-color: rgba(11, 18, 32, 0.18);
            text-underline-offset: 4px;
          }

          @media (min-width: 900px) {
            .mrw-grid {
              grid-template-columns: 1.05fr 1fr;
              gap: 22px;
              align-items: start;
            }
            .mrw-2col {
              grid-template-columns: 1fr 1fr;
            }
            .mrw-footer-inner {
              flex-direction: row;
              align-items: center;
            }
          }

          @media (max-width: 560px) {
            .mrw-h1 {
              font-size: 44px;
            }
            .mrw-nav {
              gap: 14px;
            }
            .mrw-logo {
              width: 46px;
              height: 46px;
            }
          }
        `}</style>
      </div>
    </>
  );
}
