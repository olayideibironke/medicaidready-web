import Head from "next/head";
import Link from "next/link";
import { useState } from "react";

export default function PricingPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function startCheckout() {
    setMsg(null);
    const e = email.trim().toLowerCase();

    if (!e || !e.includes("@")) {
      setMsg("Enter a valid work email.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: e }),
      });

      const json = await res.json();
      if (!res.ok || !json?.url) {
        throw new Error(json?.message || "Unable to start checkout.");
      }

      window.location.href = json.url;
    } catch (err: any) {
      setMsg(err?.message ?? String(err));
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>Pricing | MedicaidReady</title>
        <meta
          name="description"
          content="Subscription pricing for continuous Medicaid compliance monitoring in Maryland, Virginia, and Washington DC."
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
              <Link className="navPill" href="/request-access">
                Request Access
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
              <h1 className="h1">Pricing</h1>
              <p className="sub">
                Continuous Medicaid compliance monitoring for provider organizations operating in Maryland, Virginia &amp; Washington DC.
              </p>

              <div className="grid">
                <div className="card">
                  <div className="planTop">
                    <div>
                      <div className="planName">DMV Plan</div>
                      <div className="planDesc">Subscription access for credentialed provider organizations.</div>
                    </div>
                    <div className="price">
                      <div className="amt">$249</div>
                      <div className="per">/ month</div>
                    </div>
                  </div>

                  <ul className="list">
                    <li>Provider roster + compliance overview</li>
                    <li>Checklist + onboarding tracking</li>
                    <li>Risk scoring + trends</li>
                    <li>Escalation signal visibility</li>
                  </ul>

                  <div className="divider" />

                  <label className="label">
                    <span>Work email</span>
                    <input
                      value={email}
                      onChange={(ev) => setEmail(ev.target.value)}
                      placeholder="name@organization.com"
                      className="input"
                      autoComplete="email"
                    />
                  </label>

                  {msg ? <div className="msg">{msg}</div> : null}

                  <button className="primary" onClick={startCheckout} disabled={loading}>
                    {loading ? "Redirecting…" : "Subscribe"}
                  </button>

                  <div className="fine">After payment, your email is automatically approved for sign-in.</div>
                </div>

                <div className="side">
                  <div className="sideTitle">Prefer to request access first?</div>
                  <div className="sideBody">Submit your details and we’ll review and approve your account.</div>

                  {/* Polished button style (was a basic link) */}
                  <Link className="sideCta" href="/request-access">
                    Request access
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
              <Link className="footerPill" href="/request-access">
                Request access
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

          /* PREMIUM NAV PILLS (replaces default-looking links) */
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

          /* PREMIUM CTA BUTTON */
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
            background: radial-gradient(900px 500px at 15% 10%, rgba(15, 106, 166, 0.12), transparent 55%),
              radial-gradient(900px 500px at 85% 20%, rgba(11, 58, 102, 0.1), transparent 55%);
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

          .grid {
            margin-top: 18px;
            display: grid;
            grid-template-columns: 1fr 0.7fr;
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
          .planTop {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 12px;
          }
          .planName {
            font-weight: 900;
            font-size: 18px;
          }
          .planDesc {
            margin-top: 6px;
            color: #5b6576;
            line-height: 1.6;
          }
          .price {
            text-align: right;
          }
          .amt {
            font-weight: 950;
            font-size: 28px;
            letter-spacing: -0.02em;
            color: #0b3a66;
          }
          .per {
            margin-top: 2px;
            font-size: 13px;
            color: #6b7688;
          }

          .list {
            margin: 12px 0 0;
            padding-left: 18px;
            color: #445065;
            line-height: 1.8;
          }
          .divider {
            height: 1px;
            background: #eef1f6;
            margin: 14px 0;
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
          .input {
            padding: 12px 12px;
            border-radius: 12px;
            border: 1px solid #d7dce6;
            outline: none;
            font-size: 14px;
          }
          .input:focus {
            border-color: #0f6aa6;
            box-shadow: 0 0 0 3px rgba(15, 106, 166, 0.12);
          }

          .msg {
            margin-top: 10px;
            border: 1px solid #f3b6b6;
            background: #fff1f1;
            padding: 10px 12px;
            border-radius: 12px;
            color: #7a1f1f;
            font-weight: 650;
            font-size: 13px;
          }

          .primary {
            margin-top: 12px;
            width: 100%;
            padding: 12px 14px;
            border-radius: 14px;
            text-decoration: none;
            background: #0b3a66;
            color: #fff;
            font-weight: 800;
            border: 1px solid #0b3a66;
            cursor: pointer;
          }
          .primary:disabled {
            opacity: 0.7;
            cursor: not-allowed;
          }
          .primary:hover:not(:disabled) {
            background: #0a345d;
          }

          .fine {
            margin-top: 10px;
            font-size: 12px;
            color: #6b7688;
            line-height: 1.5;
          }

          .side {
            border: 1px solid #e6e9ef;
            border-radius: 18px;
            background: #ffffff;
            padding: 16px;
          }
          .sideTitle {
            font-weight: 900;
          }
          .sideBody {
            margin-top: 8px;
            color: #445065;
            line-height: 1.6;
          }

          /* Polished Request Access CTA (replaces default link vibe) */
          .sideCta {
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
          .sideCta:hover {
            background: rgba(11, 58, 102, 0.09);
          }
          .sideCta:visited {
            color: #0b3a66;
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

          /* PREMIUM FOOTER PILLS (no default visited purple) */
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
            .grid {
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
