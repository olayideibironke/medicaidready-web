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

      <div className="ra-root">
        <main className="ra-main">
          <div className="ra-shell">
            <div className="ra-hero">
              <h1 className="ra-h1">Request access</h1>
              <p className="ra-lead">
                Submit your details and we’ll review and approve your account.
              </p>
            </div>

            <div className="ra-grid">
              {/* Left card */}
              <section className="ra-card">
                <h2 className="ra-card-title">Prefer to request access first?</h2>
                <p className="ra-card-text">
                  Use your work email. Optional details help speed approval.
                </p>

                <ul className="ra-bullets">
                  <li>Reviewed within 1–2 business days</li>
                  <li>No spam — we only contact you about access</li>
                  <li>Once approved, you can sign in immediately</li>
                </ul>

                <div className="ra-mini-note">
                  Already comparing plans?{" "}
                  <Link href="/pricing" className="ra-link">
                    View pricing
                  </Link>
                </div>
              </section>

              {/* Right card: form */}
              <section className="ra-card">
                <div className="ra-formhead">
                  <h2 className="ra-card-title">Request access</h2>
                  <div className="ra-badge">Reviewed quickly</div>
                </div>

                {submitState === "success" && (
                  <div className="ra-alert ra-alert-success" role="status">
                    <div className="ra-alert-title">Request received.</div>
                    <div className="ra-alert-text">
                      We’ll follow up by email with next steps.
                    </div>
                  </div>
                )}

                {submitState === "error" && (
                  <div className="ra-alert ra-alert-error" role="alert">
                    <div className="ra-alert-title">Submission failed.</div>
                    <div className="ra-alert-text">
                      {errorMessage || "Please try again."}
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="ra-form">
                  <div className="ra-field">
                    <label className="ra-label">Work email</label>
                    <input
                      className={"ra-input" + (workEmail && !emailOk ? " ra-input-invalid" : "")}
                      value={workEmail}
                      onChange={(e) => setWorkEmail(e.target.value)}
                      placeholder="name@organization.com"
                      autoComplete="email"
                      required
                    />
                    {workEmail && !emailOk ? (
                      <div className="ra-help">Enter a valid email address.</div>
                    ) : null}
                  </div>

                  <div className="ra-2col">
                    <div className="ra-field">
                      <label className="ra-label">Full name (optional)</label>
                      <input
                        className="ra-input"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g., John Doe"
                        autoComplete="name"
                      />
                    </div>

                    <div className="ra-field">
                      <label className="ra-label">Primary state (optional)</label>
                      <input
                        className="ra-input"
                        value={stateCode}
                        onChange={(e) => setStateCode(e.target.value.toUpperCase())}
                        placeholder="e.g., MD"
                        maxLength={2}
                      />
                    </div>
                  </div>

                  <div className="ra-2col">
                    <div className="ra-field">
                      <label className="ra-label">Organization (optional)</label>
                      <input
                        className="ra-input"
                        value={organization}
                        onChange={(e) => setOrganization(e.target.value)}
                        placeholder="e.g., ACME Health"
                        autoComplete="organization"
                      />
                    </div>

                    <div className="ra-field">
                      <label className="ra-label">Role / title (optional)</label>
                      <input
                        className="ra-input"
                        value={roleTitle}
                        onChange={(e) => setRoleTitle(e.target.value)}
                        placeholder="e.g., Program Analyst"
                        autoComplete="organization-title"
                      />
                    </div>
                  </div>

                  <div className="ra-field">
                    <label className="ra-label">Notes (optional)</label>
                    <textarea
                      className="ra-textarea"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={4}
                      placeholder="Tell us what you’re trying to do with MedicaidReady (optional)."
                    />
                  </div>

                  <button
                    type="submit"
                    className={"ra-btn" + (!canSubmit ? " ra-btn-disabled" : "")}
                    disabled={!canSubmit}
                  >
                    {submitState === "submitting"
                      ? "Submitting..."
                      : submitState === "success"
                      ? "Submitted"
                      : "Request access"}
                  </button>

                  <div className="ra-legal">
                    By submitting, you agree we can contact you about access.
                  </div>
                </form>
              </section>
            </div>

            <div className="ra-bottom-links">
              <Link href="/pricing" className="ra-bottom-link">
                View pricing
              </Link>
              <Link href="/signin" className="ra-bottom-link">
                Sign in
              </Link>
            </div>
          </div>
        </main>

        <style jsx global>{`
          :root {
            --ra-ink: #0b1220;
            --ra-muted: rgba(11, 18, 32, 0.72);
            --ra-border: rgba(11, 18, 32, 0.12);
            --ra-card: rgba(255, 255, 255, 0.92);
            --ra-shadow: 0 16px 40px rgba(11, 18, 32, 0.08);
            --ra-blue: #0b3a67;
            --ra-blue2: #0a2f55;
          }

          html,
          body {
            background: #f4f7fb;
            color: var(--ra-ink);
          }

          .ra-root {
            min-height: 100vh;
            color: var(--ra-ink);
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

          .ra-shell {
            max-width: 1180px;
            margin: 0 auto;
            padding: 26px 18px 28px;
          }

          .ra-hero {
            padding: 10px 0 22px;
            border-bottom: 1px solid rgba(11, 18, 32, 0.08);
          }

          .ra-h1 {
            margin: 0;
            font-family: ui-serif, Georgia, "Times New Roman", Times, serif;
            font-weight: 700;
            font-size: 56px;
            letter-spacing: -0.6px;
            color: #0b1220;
          }

          .ra-lead {
            margin: 14px 0 0;
            font-size: 18px;
            color: var(--ra-muted);
            max-width: 70ch;
            line-height: 1.6;
          }

          .ra-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 20px;
            margin-top: 22px;
          }

          .ra-card {
            background: var(--ra-card);
            border: 1px solid rgba(11, 18, 32, 0.10);
            border-radius: 18px;
            box-shadow: var(--ra-shadow);
            padding: 22px;
          }

          .ra-card-title {
            margin: 0;
            font-family: ui-serif, Georgia, "Times New Roman", Times, serif;
            font-weight: 700;
            font-size: 22px;
            color: #0b1220;
          }

          .ra-card-text {
            margin: 10px 0 0;
            color: var(--ra-muted);
            font-size: 16px;
            line-height: 1.6;
          }

          .ra-bullets {
            margin: 14px 0 0;
            padding-left: 18px;
            color: rgba(11, 18, 32, 0.80);
            line-height: 1.9;
          }

          .ra-mini-note {
            margin-top: 16px;
            color: rgba(11, 18, 32, 0.72);
          }

          .ra-link {
            color: var(--ra-blue);
            font-weight: 700;
            text-decoration: underline;
            text-decoration-color: rgba(11, 58, 103, 0.25);
            text-underline-offset: 4px;
          }

          .ra-formhead {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            margin-bottom: 12px;
          }

          .ra-badge {
            font-size: 12px;
            font-weight: 800;
            color: rgba(11, 18, 32, 0.72);
            background: rgba(11, 58, 103, 0.08);
            border: 1px solid rgba(11, 58, 103, 0.14);
            padding: 8px 12px;
            border-radius: 999px;
            white-space: nowrap;
          }

          .ra-alert {
            margin: 10px 0 14px;
            border-radius: 14px;
            padding: 14px;
            border: 1px solid rgba(11, 18, 32, 0.12);
            background: rgba(244, 247, 251, 0.8);
          }

          .ra-alert-title {
            font-weight: 800;
          }

          .ra-alert-text {
            margin-top: 6px;
            color: rgba(11, 18, 32, 0.78);
          }

          .ra-alert-success {
            border-color: rgba(34, 197, 94, 0.22);
            background: rgba(34, 197, 94, 0.08);
          }

          .ra-alert-error {
            border-color: rgba(239, 68, 68, 0.22);
            background: rgba(239, 68, 68, 0.08);
          }

          .ra-form {
            margin-top: 6px;
            display: flex;
            flex-direction: column;
            gap: 14px;
          }

          .ra-field {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }

          .ra-label {
            font-weight: 700;
            color: rgba(11, 18, 32, 0.86);
          }

          .ra-input {
            height: 46px;
            border-radius: 12px;
            border: 1px solid rgba(11, 18, 32, 0.16);
            padding: 0 14px;
            font-size: 16px;
            background: white;
            color: #0b1220;
            outline: none;
          }

          .ra-input:focus {
            border-color: rgba(11, 58, 103, 0.42);
            box-shadow: 0 0 0 4px rgba(11, 58, 103, 0.12);
          }

          .ra-input-invalid {
            border-color: rgba(239, 68, 68, 0.45);
          }

          .ra-help {
            font-size: 13px;
            color: rgba(239, 68, 68, 0.9);
          }

          .ra-2col {
            display: grid;
            grid-template-columns: 1fr;
            gap: 14px;
          }

          .ra-textarea {
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

          .ra-textarea:focus {
            border-color: rgba(11, 58, 103, 0.42);
            box-shadow: 0 0 0 4px rgba(11, 58, 103, 0.12);
          }

          .ra-btn {
            height: 56px;
            border-radius: 14px;
            border: none;
            background: var(--ra-blue);
            color: white;
            font-weight: 800;
            font-size: 18px;
            cursor: pointer;
            box-shadow: 0 18px 32px rgba(11, 58, 103, 0.18);
          }

          .ra-btn:hover {
            background: var(--ra-blue2);
          }

          .ra-btn-disabled,
          .ra-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }

          .ra-legal {
            font-size: 13px;
            color: rgba(11, 18, 32, 0.62);
            line-height: 1.5;
          }

          .ra-bottom-links {
            display: flex;
            gap: 14px;
            flex-wrap: wrap;
            margin-top: 18px;
            color: rgba(11, 18, 32, 0.72);
          }

          .ra-bottom-link {
            text-decoration: none;
            color: rgba(11, 18, 32, 0.78);
            font-weight: 800;
          }

          .ra-bottom-link:hover {
            color: rgba(11, 18, 32, 0.95);
            text-decoration: underline;
            text-decoration-color: rgba(11, 18, 32, 0.18);
            text-underline-offset: 4px;
          }

          @media (min-width: 900px) {
            .ra-grid {
              grid-template-columns: 1.05fr 1fr;
              gap: 22px;
              align-items: start;
            }
            .ra-2col {
              grid-template-columns: 1fr 1fr;
            }
          }

          @media (max-width: 560px) {
            .ra-h1 {
              font-size: 44px;
            }
          }
        `}</style>
      </div>
    </>
  );
}