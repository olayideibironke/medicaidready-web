import Head from "next/head";
import Link from "next/link";
import { useState } from "react";

const GUIDE_INCLUDES = [
  "Step-by-step application walkthrough for your state",
  "Exact documents you need to collect before applying",
  "Income and household calculation worksheet",
  "What to do if you're denied (appeal guide included)",
  "Timeline of what to expect after you apply",
  "Common mistakes that delay or derail applications",
];

const CARD_INCLUDES = [
  { label: "Personalized for your state" },
  { label: "PDF — instant download" },
  { label: "30-day money-back guarantee" },
  { label: "Email copy sent automatically" },
];

export default function Pricing() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  async function handleCheckout() {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !trimmed.includes("@")) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setEmailError("");
    setLoading(true);

    try {
      const res = await fetch("/api/stripe/create-guide-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });
      const json = (await res.json()) as { ok: boolean; url?: string; error?: string };
      if (!res.ok || !json.ok || !json.url) throw new Error(json.error ?? "Checkout failed");
      window.location.href = json.url;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Something went wrong. Please try again.";
      alert(msg);
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>Pricing — MedicaidReady Application Guide</title>
        <meta name="description" content="Get your Complete Medicaid Application Guide for $9.99. Step-by-step instructions, document checklist, and appeal guide for your state." />
        <meta property="og:title" content="MedicaidReady Application Guide — $9.99" />
        <meta property="og:description" content="Step-by-step Medicaid application help for your state. $9.99 one-time, instant download." />
        <link rel="canonical" href="https://medicaidready.org/pricing" />
      </Head>

      <div className="page">

        {/* Page header */}
        <div className="page-header">
          <div className="container">
            <div className="breadcrumb">
              <Link href="/" className="breadcrumb-link">Home</Link>
              <span className="breadcrumb-sep" aria-hidden="true">›</span>
              <span className="breadcrumb-current">Application Guide</span>
            </div>
            <div className="tag">One-time purchase &middot; Instant download</div>
            <h1 className="h1">The Complete Medicaid<br /><span className="h1-em">Application Guide</span></h1>
            <p className="page-sub">
              We check your eligibility for free. If you qualify, this guide walks you through
              the application — step by step, in plain English, for your specific state.
            </p>
          </div>
        </div>

        {/* Main */}
        <div className="main">
          <div className="container">
            <div className="main-grid">

              {/* Left: What's included */}
              <div className="includes-col">
                <h2 className="h2">What&apos;s inside</h2>

                <ul className="includes-list">
                  {GUIDE_INCLUDES.map((item) => (
                    <li key={item} className="includes-item">
                      <span className="check-icon" aria-hidden="true">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M2 7l4 4 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="divider" />

                <div className="free-note">
                  <div className="free-note-header">
                    <span className="free-badge">Free</span>
                    <span className="free-note-title">Eligibility check</span>
                  </div>
                  <p className="free-note-body">
                    Not sure if you qualify yet? Run the free eligibility checker first — no account needed, results in 2 minutes.
                  </p>
                  <Link href="/quiz" className="free-note-link">
                    Check eligibility free
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>
                </div>

                {/* FAQ */}
                <div className="faq-section">
                  <h3 className="faq-heading">Questions</h3>
                  <div className="faq-list">
                    {[
                      { q: "Do I need to check eligibility first?", a: "Nope — you can buy the guide directly. But if you haven't checked yet, the free checker takes 2 minutes." },
                      { q: "Is this a subscription?", a: "No. $9.99 is a one-time payment. Nothing else is ever charged." },
                      { q: "What if I don't like it?", a: "Email us within 30 days for a full refund, no questions asked." },
                      { q: "Does it work for my state?", a: "The guide covers all 50 states and DC, with state-specific sections for income limits, portals, and contacts." },
                    ].map((item) => (
                      <div key={item.q} className="faq-item">
                        <div className="faq-q">{item.q}</div>
                        <div className="faq-a">{item.a}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Purchase card */}
              <div className="card-col">
                <div className="purchase-card">
                  <div className="price-section">
                    <div className="price-row">
                      <div className="price">$9.99</div>
                      <div className="price-badge">Best value</div>
                    </div>
                    <div className="price-label">one-time &middot; no subscription</div>
                  </div>

                  <div className="card-divider" />

                  <div className="card-includes">
                    <div className="card-includes-label">What you get</div>
                    {CARD_INCLUDES.map((item) => (
                      <div key={item.label} className="card-includes-item">
                        <span className="card-check" aria-hidden="true">
                          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                            <path d="M2 6.5l3.5 3.5 5.5-6.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </span>
                        {item.label}
                      </div>
                    ))}
                  </div>

                  <div className="card-divider" />

                  <div className="email-field">
                    <label htmlFor="checkout-email" className="email-label">
                      Your email — we&apos;ll send the guide here
                    </label>
                    <input
                      id="checkout-email"
                      type="email"
                      className={`email-input ${emailError ? "email-input-error" : ""}`}
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") handleCheckout(); }}
                      autoComplete="email"
                    />
                    {emailError && <p className="email-error" role="alert">{emailError}</p>}
                  </div>

                  <button
                    type="button"
                    className="buy-btn"
                    onClick={handleCheckout}
                    disabled={loading}
                    aria-busy={loading}
                  >
                    {loading ? "Redirecting to checkout…" : "Get the Guide — $9.99"}
                  </button>

                  <div className="secure-row">
                    <span className="secure-item">
                      <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                        <rect x="2" y="5.5" width="9" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.25"/>
                        <path d="M4.5 5.5V4a2 2 0 014 0v1.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
                      </svg>
                      Secured by Stripe
                    </span>
                    <span className="secure-sep" aria-hidden="true">&middot;</span>
                    <span className="secure-item">SSL encrypted</span>
                    <span className="secure-sep" aria-hidden="true">&middot;</span>
                    <span className="secure-item">Instant delivery</span>
                  </div>

                  <div className="guarantee-row">
                    <div className="guarantee-icon" aria-hidden="true">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M8 1.5L2 4.5v4c0 3.31 2.687 6.41 6 7.16 3.313-.75 6-3.85 6-7.16v-4L8 1.5z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round"/>
                        <path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <span>30-day money-back guarantee. No questions asked.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .page { background: var(--bg); color: var(--ink); min-height: 100vh; }

        .container {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* Page header */
        .page-header {
          background: var(--surface);
          border-bottom: 1px solid var(--border);
          padding: 48px 0 52px;
        }

        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: var(--muted);
          margin-bottom: 20px;
        }

        .breadcrumb-link {
          color: var(--muted);
          transition: color 120ms;
        }

        .breadcrumb-link:hover { color: var(--ink); }
        .breadcrumb-sep { color: var(--border-strong); }
        .breadcrumb-current { color: var(--text); }

        .tag {
          display: inline-block;
          padding: 5px 12px;
          border-radius: 999px;
          border: 1px solid var(--border);
          background: var(--bg);
          font-size: 12px;
          font-weight: 500;
          color: var(--muted);
          margin-bottom: 16px;
        }

        .h1 {
          font-size: 42px;
          font-weight: 700;
          letter-spacing: -0.04em;
          line-height: 1.1;
          margin-bottom: 16px;
          color: var(--ink);
        }

        .h1-em { color: var(--navy); }

        .page-sub {
          font-size: 17px;
          line-height: 1.65;
          color: var(--text);
          max-width: 560px;
        }

        /* Main */
        .main { padding: 52px 0 80px; }

        .main-grid {
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 48px;
          align-items: start;
        }

        /* Includes */
        .h2 {
          font-size: 22px;
          font-weight: 700;
          letter-spacing: -0.025em;
          color: var(--ink);
          margin-bottom: 20px;
        }

        .includes-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 28px;
        }

        .includes-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          font-size: 15px;
          color: var(--text);
          line-height: 1.6;
        }

        .check-icon {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: var(--green-bg);
          border: 1px solid var(--green-border);
          color: var(--green);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 1px;
        }

        .divider {
          height: 1px;
          background: var(--border);
          margin: 28px 0;
        }

        /* Free note */
        .free-note {
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          background: var(--surface);
          padding: 20px;
          box-shadow: var(--shadow-sm);
        }

        .free-note-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }

        .free-badge {
          display: inline-block;
          padding: 2px 8px;
          border-radius: 999px;
          background: var(--green-bg);
          border: 1px solid var(--green-border);
          font-size: 11px;
          font-weight: 600;
          color: var(--green);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .free-note-title {
          font-size: 14px;
          font-weight: 600;
          color: var(--ink);
        }

        .free-note-body {
          font-size: 14px;
          color: var(--text);
          line-height: 1.65;
          margin-bottom: 12px;
        }

        .free-note-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          font-weight: 600;
          color: var(--navy);
          transition: gap 120ms;
        }

        .free-note-link:hover { gap: 8px; }

        /* FAQ inside col */
        .faq-section { margin-top: 36px; }

        .faq-heading {
          font-size: 18px;
          font-weight: 700;
          letter-spacing: -0.02em;
          color: var(--ink);
          margin-bottom: 16px;
        }

        .faq-list {
          display: flex;
          flex-direction: column;
          gap: 1px;
          background: var(--border);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          overflow: hidden;
        }

        .faq-item {
          background: var(--surface);
          padding: 20px 22px;
        }

        .faq-q {
          font-size: 14px;
          font-weight: 600;
          color: var(--ink);
          margin-bottom: 6px;
        }

        .faq-a {
          font-size: 14px;
          color: var(--text);
          line-height: 1.7;
        }

        /* Purchase card */
        .card-col { position: sticky; top: 80px; }

        .purchase-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-lg);
          padding: 28px;
        }

        .price-section { margin-bottom: 2px; }

        .price-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 4px;
        }

        .price {
          font-size: 48px;
          font-weight: 700;
          letter-spacing: -0.05em;
          color: var(--ink);
          line-height: 1;
        }

        .price-badge {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 999px;
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          font-size: 12px;
          font-weight: 600;
          color: #1d4ed8;
        }

        .price-label {
          font-size: 13px;
          color: var(--muted);
        }

        .card-divider {
          height: 1px;
          background: var(--border);
          margin: 20px 0;
        }

        .card-includes {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .card-includes-label {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--muted);
          margin-bottom: 2px;
        }

        .card-includes-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          color: var(--text);
        }

        .card-check {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--green-bg);
          border: 1px solid var(--green-border);
          color: var(--green);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        /* Email */
        .email-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 14px;
        }

        .email-label {
          font-size: 13px;
          font-weight: 500;
          color: var(--text);
        }

        .email-input {
          width: 100%;
          padding: 12px 14px;
          border: 1.5px solid var(--border);
          border-radius: var(--radius-md);
          font-size: 15px;
          color: var(--ink);
          background: var(--surface);
          outline: none;
          transition: border-color 140ms, box-shadow 140ms;
          box-sizing: border-box;
        }

        .email-input:focus {
          border-color: var(--blue);
          box-shadow: 0 0 0 3px rgba(21,101,192,0.12);
        }

        .email-input-error { border-color: var(--red) !important; }

        .email-error {
          font-size: 12px;
          color: var(--red);
          font-weight: 500;
        }

        /* Buy button */
        .buy-btn {
          width: 100%;
          padding: 15px;
          border-radius: var(--radius-md);
          background: var(--navy);
          color: #fff;
          font-size: 15px;
          font-weight: 600;
          border: 1px solid var(--navy-dark);
          box-shadow: var(--shadow-md);
          cursor: pointer;
          transition: background 140ms, transform 100ms;
          margin-bottom: 14px;
          font-family: inherit;
        }

        .buy-btn:hover:not(:disabled) {
          background: var(--navy-dark);
          transform: translateY(-1px);
        }

        .buy-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Secure */
        .secure-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          flex-wrap: wrap;
          margin-bottom: 14px;
        }

        .secure-item {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: var(--muted);
        }

        .secure-sep {
          color: var(--border-strong);
          font-size: 12px;
        }

        /* Guarantee */
        .guarantee-row {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 14px;
          border-radius: var(--radius-sm);
          background: var(--bg);
          border: 1px solid var(--border);
          font-size: 13px;
          color: var(--text);
          line-height: 1.4;
        }

        .guarantee-icon {
          width: 28px;
          height: 28px;
          border-radius: var(--radius-sm);
          background: var(--green-bg);
          border: 1px solid var(--green-border);
          color: var(--green);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        /* Responsive */
        @media (max-width: 860px) {
          .main-grid { grid-template-columns: 1fr; }
          .card-col { position: static; }
          .h1 { font-size: 32px; }
        }

        @media (max-width: 480px) {
          .h1 { font-size: 26px; }
          .price { font-size: 40px; }
          .page-header { padding: 36px 0 40px; }
          .container { padding: 0 16px; }
        }
      `}</style>
    </>
  );
}
