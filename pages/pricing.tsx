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
  "Personalized for your state",
  "PDF — instant download",
  "30-day money-back guarantee",
  "Email copy sent automatically",
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

        {/* Hero */}
        <div className="hero">
          <div className="container">
            <div className="breadcrumb">
              <Link href="/" className="breadcrumb-link">Home</Link>
              <span className="breadcrumb-sep">›</span>
              <span className="breadcrumb-cur">Application Guide</span>
            </div>
            <div className="hero-tag">One-time purchase &middot; Instant download &middot; All 50 states</div>
            <h1 className="h1">The Complete Medicaid <span className="h1-em">Application Guide</span></h1>
            <p className="hero-sub">
              Check your eligibility free — then get the step-by-step guide to actually apply.
              Plain English. State-specific. No guesswork.
            </p>
          </div>
        </div>

        {/* Main */}
        <div className="main">
          <div className="container">
            <div className="grid">

              {/* LEFT */}
              <div className="left-col">
                <div className="includes-card">
                  <div className="includes-header">
                    <div className="includes-icon">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M4 4h12v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                        <path d="M8 4V2M12 4V2M4 8h12" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                        <path d="M7 12l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div>
                      <div className="includes-title">What&apos;s inside the guide</div>
                      <div className="includes-sub">Everything you need to apply successfully</div>
                    </div>
                  </div>
                  <ul className="includes-list">
                    {GUIDE_INCLUDES.map((item) => (
                      <li key={item} className="includes-item">
                        <span className="check-wrap">
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M2 6l3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="free-card">
                  <span className="free-pill">Free</span>
                  <div className="free-title">Haven&apos;t checked eligibility yet?</div>
                  <p className="free-body">Run the free eligibility check first — 5 questions, 2 minutes, no account needed.</p>
                  <Link href="/quiz" className="free-link">
                    Check eligibility free
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>
                </div>

                <div className="faq-wrap">
                  <div className="faq-title">Common questions</div>
                  {[
                    { q: "Do I need to check eligibility first?", a: "Nope — you can buy the guide directly. But the free check takes 2 minutes if you haven't done it yet." },
                    { q: "Is this a subscription?", a: "No. $9.99 is a one-time payment. Nothing else is ever charged to you." },
                    { q: "What if I don't like it?", a: "Email us within 30 days for a full refund. No questions asked." },
                    { q: "Does it work for my state?", a: "The guide covers all 50 states and DC, with state-specific income limits, portals, and contacts." },
                  ].map((faq) => (
                    <div key={faq.q} className="faq-item">
                      <div className="faq-q">{faq.q}</div>
                      <div className="faq-a">{faq.a}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* RIGHT */}
              <div className="right-col">
                <div className="purchase-card">
                  <div className="price-block">
                    <div className="price-row">
                      <div className="price">$9.99</div>
                      <div className="price-tag">One-time</div>
                    </div>
                    <div className="price-note">No subscription &middot; No hidden fees</div>
                  </div>

                  <div className="card-rule" />

                  <div className="card-gets">
                    <div className="card-gets-label">What you get</div>
                    {CARD_INCLUDES.map((item) => (
                      <div key={item} className="card-get-item">
                        <span className="card-check">
                          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                            <path d="M1.5 5.5l3 3 5-6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </span>
                        {item}
                      </div>
                    ))}
                  </div>

                  <div className="card-rule" />

                  <div className="email-block">
                    <label htmlFor="guide-email" className="email-label">
                      Your email — we&apos;ll send the guide here
                    </label>
                    <input
                      id="guide-email"
                      type="email"
                      className={`email-input${emailError ? " email-input-err" : ""}`}
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") handleCheckout(); }}
                      autoComplete="email"
                    />
                    {emailError && <p className="email-err">{emailError}</p>}
                  </div>

                  <button type="button" className="cta-btn" onClick={handleCheckout} disabled={loading}>
                    {loading ? "Redirecting to checkout…" : "Get the Guide — $9.99"}
                  </button>

                  <div className="trust-row">
                    <span className="trust-item">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <rect x="1.5" y="5" width="9" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.25"/>
                        <path d="M4 5V3.5a2 2 0 014 0V5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
                      </svg>
                      Secured by Stripe
                    </span>
                    <span className="trust-dot" />
                    <span className="trust-item">SSL encrypted</span>
                    <span className="trust-dot" />
                    <span className="trust-item">Instant delivery</span>
                  </div>

                  <div className="guarantee">
                    <div className="guarantee-icon">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M7 1.5L2 4v3.5c0 2.9 2.1 5.6 5 6.23 2.9-.63 5-3.33 5-6.23V4L7 1.5z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round"/>
                        <path d="M4.5 7l2 2 3-3.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <span>30-day money-back guarantee — no questions asked</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        * { box-sizing: border-box; }

        .page {
          background: #f8fafc;
          color: #0f172a;
          min-height: 100vh;
          font-family: 'DM Sans', ui-sans-serif, system-ui, -apple-system, sans-serif;
        }

        .container { max-width: 1100px; margin: 0 auto; padding: 0 24px; }

        .hero { background: #ffffff; border-bottom: 1px solid #e2e8f0; padding: 52px 0 56px; }

        .breadcrumb { display: flex; align-items: center; gap: 6px; font-size: 13px; color: #64748b; margin-bottom: 20px; }
        .breadcrumb-link { color: #64748b; text-decoration: none; }
        .breadcrumb-link:hover { color: #0f172a; }
        .breadcrumb-sep { color: #cbd5e1; }
        .breadcrumb-cur { color: #475569; }

        .hero-tag { display: inline-block; padding: 5px 14px; border-radius: 999px; border: 1px solid #e2e8f0; background: #f8fafc; font-size: 12px; font-weight: 500; color: #64748b; margin-bottom: 18px; }

        .h1 { font-size: 44px; font-weight: 700; letter-spacing: -0.04em; line-height: 1.1; margin: 0 0 16px; color: #0f172a; }
        .h1-em { color: #0a3d6b; }
        .hero-sub { font-size: 17px; line-height: 1.7; color: #475569; max-width: 540px; margin: 0; }

        .main { padding: 52px 0 80px; }

        .grid { display: grid; grid-template-columns: 1fr 360px; gap: 40px; align-items: start; }

        .includes-card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 28px; box-shadow: 0 1px 3px rgba(15,23,42,0.06); margin-bottom: 20px; }

        .includes-header { display: flex; align-items: center; gap: 14px; margin-bottom: 24px; padding-bottom: 20px; border-bottom: 1px solid #f1f5f9; }

        .includes-icon { width: 44px; height: 44px; border-radius: 12px; background: #0a3d6b; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }

        .includes-title { font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 2px; }
        .includes-sub { font-size: 13px; color: #64748b; }

        .includes-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 14px; }

        .includes-item { display: flex; align-items: flex-start; gap: 12px; font-size: 15px; color: #334155; line-height: 1.6; }

        .check-wrap { width: 22px; height: 22px; min-width: 22px; border-radius: 50%; background: #f0fdf4; border: 1px solid #bbf7d0; color: #15803d; display: flex; align-items: center; justify-content: center; margin-top: 1px; }

        .free-card { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 14px; padding: 20px 22px; margin-bottom: 20px; }

        .free-pill { display: inline-block; padding: 2px 10px; border-radius: 999px; background: #f0fdf4; border: 1px solid #bbf7d0; font-size: 11px; font-weight: 700; color: #15803d; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 8px; }

        .free-title { font-size: 15px; font-weight: 700; color: #1e3a5f; margin-bottom: 6px; }
        .free-body { font-size: 14px; color: #3b5998; line-height: 1.65; margin: 0 0 12px; }
        .free-link { display: inline-flex; align-items: center; gap: 6px; font-size: 14px; font-weight: 600; color: #1d4ed8; text-decoration: none; }
        .free-link:hover { text-decoration: underline; }

        .faq-wrap { }
        .faq-title { font-size: 17px; font-weight: 700; color: #0f172a; margin-bottom: 14px; letter-spacing: -0.02em; }
        .faq-item { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px 20px; margin-bottom: 8px; }
        .faq-q { font-size: 14px; font-weight: 600; color: #0f172a; margin-bottom: 6px; }
        .faq-a { font-size: 14px; color: #475569; line-height: 1.7; }

        .right-col { position: sticky; top: 80px; }

        .purchase-card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 20px; box-shadow: 0 8px 32px rgba(15,23,42,0.10), 0 2px 8px rgba(15,23,42,0.04); padding: 28px; }

        .price-block { margin-bottom: 4px; }
        .price-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px; }
        .price { font-size: 52px; font-weight: 700; letter-spacing: -0.05em; color: #0f172a; line-height: 1; }
        .price-tag { display: inline-block; padding: 5px 12px; border-radius: 999px; background: #eff6ff; border: 1px solid #bfdbfe; font-size: 12px; font-weight: 600; color: #1d4ed8; }
        .price-note { font-size: 13px; color: #64748b; }

        .card-rule { height: 1px; background: #f1f5f9; margin: 20px 0; }

        .card-gets { display: flex; flex-direction: column; gap: 10px; }
        .card-gets-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #94a3b8; margin-bottom: 2px; }
        .card-get-item { display: flex; align-items: center; gap: 10px; font-size: 14px; color: #334155; font-weight: 500; }
        .card-check { width: 20px; height: 20px; min-width: 20px; border-radius: 50%; background: #f0fdf4; border: 1px solid #bbf7d0; color: #15803d; display: flex; align-items: center; justify-content: center; }

        .email-block { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; }
        .email-label { font-size: 13px; font-weight: 500; color: #475569; }
        .email-input { width: 100%; padding: 13px 14px; border: 1.5px solid #e2e8f0; border-radius: 10px; font-size: 15px; color: #0f172a; background: #ffffff; outline: none; transition: border-color 140ms, box-shadow 140ms; font-family: inherit; }
        .email-input:focus { border-color: #0a3d6b; box-shadow: 0 0 0 3px rgba(10,61,107,0.10); }
        .email-input-err { border-color: #dc2626 !important; }
        .email-err { font-size: 12px; color: #dc2626; font-weight: 500; margin: 0; }

        .cta-btn { width: 100%; padding: 15px; border-radius: 12px; background: #0a3d6b; color: #ffffff; font-size: 15px; font-weight: 600; border: 1px solid #072d52; box-shadow: 0 4px 12px rgba(10,61,107,0.25); cursor: pointer; font-family: inherit; transition: background 140ms, transform 100ms; margin-bottom: 14px; }
        .cta-btn:hover:not(:disabled) { background: #072d52; transform: translateY(-1px); }
        .cta-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .trust-row { display: flex; align-items: center; justify-content: center; gap: 6px; flex-wrap: wrap; margin-bottom: 14px; }
        .trust-item { display: inline-flex; align-items: center; gap: 4px; font-size: 12px; color: #94a3b8; }
        .trust-dot { width: 3px; height: 3px; border-radius: 50%; background: #cbd5e1; }

        .guarantee { display: flex; align-items: center; gap: 10px; padding: 12px 14px; border-radius: 10px; background: #f8fafc; border: 1px solid #e2e8f0; font-size: 13px; color: #475569; line-height: 1.5; }
        .guarantee-icon { width: 30px; height: 30px; min-width: 30px; border-radius: 8px; background: #f0fdf4; border: 1px solid #bbf7d0; color: #15803d; display: flex; align-items: center; justify-content: center; }

        @media (max-width: 860px) {
          .grid { grid-template-columns: 1fr; }
          .right-col { position: static; }
          .h1 { font-size: 34px; }
        }

        @media (max-width: 520px) {
          .h1 { font-size: 28px; }
          .price { font-size: 44px; }
          .hero { padding: 36px 0 40px; }
          .container { padding: 0 16px; }
          .main { padding: 32px 0 60px; }
        }
      `}</style>
    </>
  );
}
