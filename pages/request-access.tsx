// pages/request-access.tsx
import Head from "next/head";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { FormEvent } from "react";

type FormState = {
  name: string;
  organization: string;
  email: string;
  state: "MD" | "VA" | "DC" | "";
  providerType: string;
};

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success" }
  | { kind: "error"; message: string };

const STATES: Array<{ value: "MD" | "VA" | "DC"; label: string }> = [
  { value: "MD", label: "Maryland (MD)" },
  { value: "VA", label: "Virginia (VA)" },
  { value: "DC", label: "Washington, DC (DC)" },
];

const PROVIDER_TYPES: Array<{ value: string; label: string }> = [
  { value: "home_health", label: "Home Health Agency" },
  { value: "hospice", label: "Hospice" },
  { value: "snf", label: "Skilled Nursing Facility (SNF)" },
  { value: "assisted_living", label: "Assisted Living" },
  { value: "behavioral_health", label: "Behavioral Health" },
  { value: "primary_care", label: "Primary Care" },
  { value: "hospital", label: "Hospital / Health System" },
  { value: "clinic", label: "Clinic" },
  { value: "transportation", label: "Non-Emergency Medical Transportation" },
  { value: "dme", label: "Durable Medical Equipment (DME)" },
  { value: "other", label: "Other" },
];

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default function RequestAccessPage() {
  const [form, setForm] = useState<FormState>({
    name: "",
    organization: "",
    email: "",
    state: "",
    providerType: "",
  });

  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const canSubmit = useMemo(() => {
    if (!form.name.trim()) return false;
    if (!form.organization.trim()) return false;
    if (!form.email.trim() || !isEmail(form.email.trim())) return false;
    if (!form.state) return false;
    if (!form.providerType) return false;
    return true;
  }, [form]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();

    if (!canSubmit) {
      setStatus({ kind: "error", message: "Please complete all fields with a valid email." });
      return;
    }

    setStatus({ kind: "submitting" });

    try {
      const res = await fetch("/api/request-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          organization: form.organization.trim(),
          email: form.email.trim(),
          state: form.state,
          providerType: form.providerType,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const msg =
          (data && typeof data.error === "string" && data.error) ||
          "Unable to submit request. Please try again.";
        setStatus({ kind: "error", message: msg });
        return;
      }

      setStatus({ kind: "success" });
      setForm({
        name: "",
        organization: "",
        email: "",
        state: "",
        providerType: "",
      });
    } catch {
      setStatus({ kind: "error", message: "Network error. Please try again." });
    }
  }

  return (
    <>
      <Head>
        <title>Request Access | MedicaidReady</title>
        <meta
          name="description"
          content="Request access to MedicaidReady — continuous Medicaid compliance monitoring for providers in Maryland, Virginia & Washington DC."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="page">
        <header className="header">
          <div className="container headerInner">
            <div className="brand">
              <div className="mark" aria-hidden="true" />
              <div className="brandText">
                <div className="brandName">MedicaidReady</div>
                <div className="brandTag">MD • VA • DC</div>
              </div>
            </div>

            <nav className="nav" aria-label="Primary">
              <Link className="navPill" href="/">
                Home
              </Link>
              <Link className="navPill" href="/pricing">
                Pricing
              </Link>
              <Link className="navCta" href="/providers">
                Sign in
              </Link>
            </nav>
          </div>
        </header>

        <main className="main">
          <section className="hero">
            <div className="container">
              <div className="heroTop">
                <div>
                  <h1 className="h1">Request Access</h1>
                  <p className="sub">
                    Submit your details to receive access credentials for the MedicaidReady provider dashboard.
                  </p>
                </div>

                <div className="sideHint">
                  <div className="sideHintTitle">Already approved?</div>
                  <div className="sideHintBody">Sign in to your provider dashboard.</div>
                  <Link className="sideHintCta" href="/providers">
                    Go to dashboard
                  </Link>
                </div>
              </div>

              <div className="grid">
                <div className="card">
                  {status.kind === "success" ? (
                    <div className="successBox" role="status" aria-live="polite">
                      <div className="successTitle">Request received.</div>
                      <div className="successBody">
                        We’ll review your submission and follow up by email.
                      </div>

                      <div className="successActions">
                        <Link className="primaryLink" href="/">
                          Return Home
                        </Link>
                        <Link className="ghostLink" href="/pricing">
                          View pricing
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="cardTop">
                        <div className="cardTitle">Access request form</div>
                        <div className="cardNote">All fields are required.</div>
                      </div>

                      <form onSubmit={onSubmit} className="form">
                        <label className="label">
                          <span>Full name</span>
                          <input
                            className="input"
                            placeholder="Full Name"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            autoComplete="name"
                          />
                        </label>

                        <label className="label">
                          <span>Organization</span>
                          <input
                            className="input"
                            placeholder="Organization"
                            value={form.organization}
                            onChange={(e) => setForm({ ...form, organization: e.target.value })}
                            autoComplete="organization"
                          />
                        </label>

                        <label className="label">
                          <span>Work email</span>
                          <input
                            className="input"
                            placeholder="Work Email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            autoComplete="email"
                          />
                        </label>

                        <div className="row2">
                          <label className="label">
                            <span>State / jurisdiction</span>
                            <select
                              className="input"
                              value={form.state}
                              onChange={(e) => setForm({ ...form, state: e.target.value as any })}
                            >
                              <option value="">Select State</option>
                              {STATES.map((s) => (
                                <option key={s.value} value={s.value}>
                                  {s.label}
                                </option>
                              ))}
                            </select>
                          </label>

                          <label className="label">
                            <span>Provider type</span>
                            <select
                              className="input"
                              value={form.providerType}
                              onChange={(e) => setForm({ ...form, providerType: e.target.value })}
                            >
                              <option value="">Select Provider Type</option>
                              {PROVIDER_TYPES.map((p) => (
                                <option key={p.value} value={p.value}>
                                  {p.label}
                                </option>
                              ))}
                            </select>
                          </label>
                        </div>

                        {status.kind === "error" ? <div className="msg">{status.message}</div> : null}

                        <button
                          type="submit"
                          disabled={!canSubmit || status.kind === "submitting"}
                          className="primary"
                        >
                          {status.kind === "submitting" ? "Submitting…" : "Submit Request"}
                        </button>

                        <div className="fine">
                          We typically respond within 1–2 business days.
                        </div>
                      </form>
                    </>
                  )}
                </div>

                <div className="panel">
                  <div className="panelTitle">What happens next?</div>
                  <div className="panelBody">
                    After submission, we verify your organization and jurisdiction, then email your sign-in instructions.
                  </div>

                  <div className="panelList">
                    <div className="panelItem">
                      <div className="dot" />
                      <div>
                        <div className="panelItemTitle">Credential review</div>
                        <div className="panelItemBody">We confirm provider details and region eligibility.</div>
                      </div>
                    </div>

                    <div className="panelItem">
                      <div className="dot" />
                      <div>
                        <div className="panelItemTitle">Account approval</div>
                        <div className="panelItemBody">You’ll receive an email when access is granted.</div>
                      </div>
                    </div>

                    <div className="panelItem">
                      <div className="dot" />
                      <div>
                        <div className="panelItemTitle">Start monitoring</div>
                        <div className="panelItemBody">Track risk, trends, issues, and onboarding readiness.</div>
                      </div>
                    </div>
                  </div>

                  <Link className="panelCta" href="/pricing">
                    View pricing
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer className="footer">
          <div className="container footerInner">
            <div className="footerLeft">
              <div className="footerBrand">MedicaidReady</div>
              <div className="footerSmall">Continuous Medicaid compliance monitoring for MD • VA • DC.</div>
            </div>
            <div className="footerRight">
              <Link className="footerPill" href="/pricing">
                Pricing
              </Link>
              <Link className="footerPill" href="/providers">
                Sign in
              </Link>
            </div>
          </div>
        </footer>

        <style jsx>{`
          .page {
            min-height: 100vh;
            background: #ffffff;
            color: #0b1220;
          }
          .container {
            width: 100%;
            max-width: 1100px;
            margin: 0 auto;
            padding: 0 20px;
          }

          .header {
            position: sticky;
            top: 0;
            z-index: 50;
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(10px);
            border-bottom: 1px solid #e6e9ef;
          }
          .headerInner {
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 70px;
          }
          .brand {
            display: flex;
            align-items: center;
            gap: 12px;
          }
          .mark {
            width: 38px;
            height: 38px;
            border-radius: 10px;
            background: linear-gradient(135deg, #0b3a66, #0f6aa6);
          }
          .brandText {
            line-height: 1.1;
          }
          .brandName {
            font-weight: 750;
            letter-spacing: -0.02em;
          }
          .brandTag {
            font-size: 12px;
            color: #5b6576;
            margin-top: 3px;
          }

          .nav {
            display: flex;
            align-items: center;
            gap: 10px;
          }
          .navPill {
            color: #1f2b3d;
            text-decoration: none;
            font-size: 13px;
            font-weight: 650;
            padding: 9px 12px;
            border-radius: 999px;
            border: 1px solid transparent;
            letter-spacing: 0.01em;
          }
          .navPill:hover {
            background: rgba(243, 245, 249, 0.9);
            border-color: rgba(230, 233, 239, 0.9);
          }
          .navPill:visited {
            color: #1f2b3d;
          }

          .navCta {
            text-decoration: none;
            font-size: 13px;
            font-weight: 750;
            padding: 10px 14px;
            border-radius: 999px;
            letter-spacing: 0.01em;
            color: #ffffff;
            background: linear-gradient(135deg, #0b3a66, #0f6aa6);
            border: 1px solid rgba(11, 58, 102, 0.35);
            box-shadow: 0 10px 22px rgba(11, 18, 32, 0.12);
          }
          .navCta:hover {
            filter: brightness(0.98);
          }
          .navCta:visited {
            color: #ffffff;
          }

          .hero {
            padding: 44px 0;
            background: radial-gradient(900px 520px at 15% 10%, rgba(15, 106, 166, 0.12), transparent 55%),
              radial-gradient(900px 520px at 85% 20%, rgba(11, 58, 102, 0.1), transparent 55%);
          }

          .heroTop {
            display: grid;
            grid-template-columns: 1fr 0.62fr;
            gap: 14px;
            align-items: start;
          }

          .h1 {
            margin: 0;
            font-size: 40px;
            letter-spacing: -0.03em;
          }
          .sub {
            margin: 10px 0 0;
            color: #445065;
            font-size: 16px;
            line-height: 1.6;
            max-width: 820px;
          }

          .sideHint {
            border: 1px solid #e6e9ef;
            border-radius: 18px;
            background: rgba(255, 255, 255, 0.92);
            box-shadow: 0 12px 28px rgba(11, 18, 32, 0.06);
            padding: 16px;
          }
          .sideHintTitle {
            font-weight: 900;
            letter-spacing: -0.01em;
          }
          .sideHintBody {
            margin-top: 8px;
            color: #445065;
            line-height: 1.6;
          }
          .sideHintCta {
            margin-top: 12px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            padding: 12px 14px;
            border-radius: 14px;
            text-decoration: none;
            font-weight: 850;
            color: #0b3a66;
            background: rgba(11, 58, 102, 0.06);
            border: 1px solid rgba(11, 58, 102, 0.22);
          }
          .sideHintCta:hover {
            background: rgba(11, 58, 102, 0.09);
          }
          .sideHintCta:visited {
            color: #0b3a66;
          }

          .grid {
            margin-top: 14px;
            display: grid;
            grid-template-columns: 1fr 0.62fr;
            gap: 14px;
            align-items: start;
          }

          .card {
            border: 1px solid #e6e9ef;
            border-radius: 18px;
            background: rgba(255, 255, 255, 0.92);
            box-shadow: 0 12px 28px rgba(11, 18, 32, 0.08);
            padding: 16px;
          }

          .cardTop {
            display: flex;
            align-items: baseline;
            justify-content: space-between;
            gap: 12px;
            flex-wrap: wrap;
            margin-bottom: 10px;
          }
          .cardTitle {
            font-weight: 950;
            letter-spacing: -0.01em;
            font-size: 16px;
          }
          .cardNote {
            font-size: 12px;
            color: #6b7688;
            font-weight: 750;
          }

          .form {
            display: grid;
            gap: 12px;
          }

          .label {
            display: grid;
            gap: 6px;
          }
          .label span {
            font-size: 12px;
            color: #5b6576;
            font-weight: 700;
          }

          .row2 {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
          }

          .input {
            padding: 12px 12px;
            border-radius: 12px;
            border: 1px solid #d7dce6;
            outline: none;
            font-size: 14px;
            background: #ffffff;
          }
          .input:focus {
            border-color: #0f6aa6;
            box-shadow: 0 0 0 3px rgba(15, 106, 166, 0.12);
          }

          .msg {
            border: 1px solid #f3b6b6;
            background: #fff1f1;
            padding: 10px 12px;
            border-radius: 12px;
            color: #7a1f1f;
            font-weight: 650;
            font-size: 13px;
          }

          .primary {
            width: 100%;
            padding: 12px 14px;
            border-radius: 14px;
            text-decoration: none;
            background: #0b3a66;
            color: #fff;
            font-weight: 900;
            border: 1px solid #0b3a66;
            cursor: pointer;
            box-shadow: 0 12px 26px rgba(11, 18, 32, 0.12);
          }
          .primary:disabled {
            opacity: 0.7;
            cursor: not-allowed;
            box-shadow: none;
          }
          .primary:hover:not(:disabled) {
            background: #0a345d;
          }

          .fine {
            font-size: 12px;
            color: #6b7688;
            line-height: 1.5;
            margin-top: 2px;
          }

          .successBox {
            border-radius: 16px;
            border: 1px solid rgba(15, 106, 166, 0.22);
            background: rgba(15, 106, 166, 0.06);
            padding: 16px;
          }
          .successTitle {
            font-weight: 950;
            letter-spacing: -0.01em;
          }
          .successBody {
            margin-top: 8px;
            color: #445065;
            line-height: 1.6;
          }
          .successActions {
            margin-top: 14px;
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
          }
          .primaryLink {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 12px 14px;
            border-radius: 14px;
            text-decoration: none;
            font-weight: 900;
            color: #ffffff;
            background: linear-gradient(135deg, #0b3a66, #0f6aa6);
            border: 1px solid rgba(11, 58, 102, 0.35);
          }
          .primaryLink:hover {
            filter: brightness(0.98);
          }
          .primaryLink:visited {
            color: #ffffff;
          }
          .ghostLink {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 12px 14px;
            border-radius: 14px;
            text-decoration: none;
            font-weight: 900;
            color: #0b3a66;
            background: rgba(11, 58, 102, 0.06);
            border: 1px solid rgba(11, 58, 102, 0.22);
          }
          .ghostLink:hover {
            background: rgba(11, 58, 102, 0.09);
          }
          .ghostLink:visited {
            color: #0b3a66;
          }

          .panel {
            border: 1px solid #e6e9ef;
            border-radius: 18px;
            background: #ffffff;
            padding: 16px;
          }
          .panelTitle {
            font-weight: 950;
            letter-spacing: -0.01em;
          }
          .panelBody {
            margin-top: 8px;
            color: #445065;
            line-height: 1.6;
          }
          .panelList {
            margin-top: 12px;
            display: grid;
            gap: 12px;
          }
          .panelItem {
            display: grid;
            grid-template-columns: 16px 1fr;
            gap: 10px;
            align-items: start;
          }
          .dot {
            width: 10px;
            height: 10px;
            border-radius: 999px;
            background: rgba(15, 106, 166, 0.85);
            box-shadow: 0 0 0 3px rgba(15, 106, 166, 0.12);
            margin-top: 4px;
          }
          .panelItemTitle {
            font-weight: 900;
            font-size: 13px;
            letter-spacing: -0.01em;
          }
          .panelItemBody {
            margin-top: 4px;
            color: #5b6576;
            line-height: 1.55;
            font-size: 13px;
          }
          .panelCta {
            margin-top: 14px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            padding: 12px 14px;
            border-radius: 14px;
            text-decoration: none;
            font-weight: 900;
            color: #0b1220;
            background: #ffffff;
            border: 1px solid #d7dce6;
          }
          .panelCta:hover {
            background: #f7f9fc;
          }
          .panelCta:visited {
            color: #0b1220;
          }

          .footer {
            border-top: 1px solid #eef1f6;
            padding: 22px 0;
            background: #ffffff;
          }
          .footerInner {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            flex-wrap: wrap;
          }
          .footerBrand {
            font-weight: 900;
            letter-spacing: -0.02em;
          }
          .footerSmall {
            margin-top: 6px;
            color: #6b7688;
            font-size: 13px;
            line-height: 1.5;
          }
          .footerRight {
            display: flex;
            align-items: center;
            gap: 10px;
          }
          .footerPill {
            color: #1f2b3d;
            text-decoration: none;
            font-size: 13px;
            font-weight: 650;
            padding: 9px 12px;
            border-radius: 999px;
            border: 1px solid transparent;
          }
          .footerPill:hover {
            background: rgba(243, 245, 249, 0.9);
            border-color: rgba(230, 233, 239, 0.9);
          }
          .footerPill:visited {
            color: #1f2b3d;
          }

          @media (max-width: 980px) {
            .heroTop {
              grid-template-columns: 1fr;
            }
            .grid {
              grid-template-columns: 1fr;
            }
            .row2 {
              grid-template-columns: 1fr;
            }
          }
          @media (max-width: 640px) {
            .navPill {
              display: none;
            }
            .h1 {
              font-size: 34px;
            }
          }
        `}</style>
      </div>
    </>
  );
}
