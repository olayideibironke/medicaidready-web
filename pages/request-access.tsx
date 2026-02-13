// pages/request-access.tsx
import Head from "next/head";
import Link from "next/link";
import { useMemo, useState } from "react";

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

  async function onSubmit(e: React.FormEvent) {
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
      </Head>

      <div className="page">
        <header className="header">
          <div className="brand">
            <div className="mark" />
            <div className="brandText">
              <div className="brandName">MedicaidReady</div>
              <div className="brandTag">DMV Continuous Compliance Monitoring</div>
            </div>
          </div>

          <nav className="nav">
            <Link href="/">Home</Link>
            <Link href="/providers">Dashboard</Link>
          </nav>
        </header>

        <main className="main">
          <div className="card">
            <h1 className="title">Request Access</h1>
            <p className="subtitle">
              Submit your details to receive access credentials for the MedicaidReady provider dashboard.
            </p>

            {status.kind === "success" ? (
              <div className="successBox">
                <strong>Request received.</strong>
                <p>
                  We’ll review your submission and follow up by email.
                </p>
                <Link href="/">Return Home</Link>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="form">
                <input
                  className="input"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <input
                  className="input"
                  placeholder="Organization"
                  value={form.organization}
                  onChange={(e) => setForm({ ...form, organization: e.target.value })}
                />
                <input
                  className="input"
                  placeholder="Work Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />

                <select
                  className="input"
                  value={form.state}
                  onChange={(e) =>
                    setForm({ ...form, state: e.target.value as any })
                  }
                >
                  <option value="">Select State</option>
                  {STATES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>

                <select
                  className="input"
                  value={form.providerType}
                  onChange={(e) =>
                    setForm({ ...form, providerType: e.target.value })
                  }
                >
                  <option value="">Select Provider Type</option>
                  {PROVIDER_TYPES.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>

                {status.kind === "error" && (
                  <div className="error">{status.message}</div>
                )}

                <button
                  type="submit"
                  disabled={!canSubmit || status.kind === "submitting"}
                  className="button"
                >
                  {status.kind === "submitting" ? "Submitting..." : "Submit Request"}
                </button>
              </form>
            )}
          </div>
        </main>
      </div>

      <style jsx>{`
        .page {
          min-height: 100vh;
          background: #f5f7fa;
          color: #0b1f3a;
        }

        .header {
          max-width: 960px;
          margin: 0 auto;
          padding: 24px 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .brand {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .mark {
          width: 34px;
          height: 34px;
          border-radius: 8px;
          background: #0b2a4a;
        }

        .brandName {
          font-weight: 800;
        }

        .brandTag {
          font-size: 12px;
          opacity: 0.7;
        }

        .nav a {
          margin-left: 16px;
          text-decoration: none;
          color: #0b1f3a;
          font-weight: 600;
        }

        .main {
          max-width: 960px;
          margin: 0 auto;
          padding: 24px 16px;
        }

        .card {
          background: white;
          padding: 32px;
          border-radius: 14px;
          border: 1px solid #d9e1ec;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.05);
        }

        .title {
          margin: 0 0 8px 0;
        }

        .subtitle {
          margin-bottom: 24px;
          font-size: 14px;
          opacity: 0.8;
        }

        .form {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .input {
          height: 42px;
          padding: 0 12px;
          border-radius: 10px;
          border: 1px solid #cbd5e1;
          font-size: 14px;
        }

        .button {
          height: 44px;
          border-radius: 10px;
          background: #0b2a4a;
          color: white;
          border: none;
          font-weight: 700;
          cursor: pointer;
        }

        .error {
          font-size: 13px;
          color: #b91c1c;
        }

        .successBox {
          background: #eef4fb;
          padding: 20px;
          border-radius: 10px;
          border: 1px solid #c9d9f2;
        }
      `}</style>
    </>
  );
}
