// pages/privacy.tsx
import Head from "next/head";
import Link from "next/link";
import { useMemo } from "react";

export default function PrivacyPolicyPage() {
  const updated = useMemo(() => new Date().toLocaleDateString(), []);

  return (
    <>
      <Head>
        <title>Privacy Policy • MedicaidReady</title>
        <meta
          name="description"
          content="MedicaidReady Privacy Policy. We focus on compliance monitoring and do not collect patient-level PHI."
        />
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
                  Policy
                </div>
                <h1 className="mrp-h1">Privacy Policy</h1>
                <p className="mrp-lead">
                  Last updated: <strong>{updated}</strong>
                </p>

                <div className="mrp-hero-actions">
                  <Link href="/security" className="mrp-btn-secondary">
                    Security Overview
                  </Link>
                  <Link href="/terms" className="mrp-btn-secondary">
                    Terms of Service
                  </Link>
                </div>
              </div>

              <aside className="mrp-hero-card" aria-label="Quick summary">
                <div className="mrp-hero-card-top">
                  <div className="mrp-card-title">At a glance</div>
                  <div className="mrp-pill">Privacy</div>
                </div>

                <div className="mrp-signal-list">
                  <div className="mrp-signal-row">
                    <span className="mrp-status-dot dotLow" aria-hidden="true" />
                    <div className="mrp-signal-text">
                      <div className="mrp-signal-title">No patient PHI needed</div>
                      <div className="mrp-signal-sub">We’re designed for compliance readiness, not patient charts.</div>
                    </div>
                    <div className="mrp-tag">Core</div>
                  </div>

                  <div className="mrp-signal-row">
                    <span className="mrp-status-dot dotMed" aria-hidden="true" />
                    <div className="mrp-signal-text">
                      <div className="mrp-signal-title">Minimal data collection</div>
                      <div className="mrp-signal-sub">Business contact + billing + usage analytics.</div>
                    </div>
                    <div className="mrp-tag">Min</div>
                  </div>

                  <div className="mrp-signal-row">
                    <span className="mrp-status-dot dotLow" aria-hidden="true" />
                    <div className="mrp-signal-text">
                      <div className="mrp-signal-title">Access controls</div>
                      <div className="mrp-signal-sub">Credentialed access and least-privilege approach.</div>
                    </div>
                    <div className="mrp-tag">Safe</div>
                  </div>
                </div>

                <div className="mrp-hero-card-foot">
                  Questions? Email: <strong>info@medicaidready.org</strong>
                </div>
              </aside>
            </div>

            <section className="mrp-card">
              <h2 className="mrp-h2">1) What MedicaidReady is (and isn’t)</h2>
              <p className="mrp-paragraph">
                MedicaidReady provides compliance readiness monitoring for Medicaid providers in the DMV region. The
                platform is designed to track operational readiness signals (e.g., checklist progress, policy artifacts,
                organizational metadata) and does <strong>not</strong> require patient-level information.
              </p>
              <div className="mrp-callout">
                <div className="mrp-callout-title">PHI (Protected Health Information)</div>
                <div className="mrp-callout-text">
                  MedicaidReady is not intended to store PHI. Do not upload patient identifiers, clinical notes, medical
                  record numbers, diagnoses, or any patient-specific data.
                </div>
              </div>
            </section>

            <section className="mrp-card">
              <h2 className="mrp-h2">2) Information we collect</h2>

              <h3 className="mrp-h3">A) Account and business contact data</h3>
              <ul className="mrp-list">
                <li>Organization name</li>
                <li>Business contact name, email, phone (if provided)</li>
                <li>Jurisdiction and provider-type metadata (if provided)</li>
              </ul>

              <h3 className="mrp-h3">B) Billing and subscription data</h3>
              <p className="mrp-paragraph">
                Payments are handled by third-party payment processors. We may store references such as customer IDs and
                subscription status. We do not store full payment card numbers.
              </p>

              <h3 className="mrp-h3">C) Technical and usage data</h3>
              <ul className="mrp-list">
                <li>Log data (IP address, device/browser, timestamps)</li>
                <li>Security and fraud prevention signals</li>
                <li>Feature usage metrics to improve reliability and usability</li>
              </ul>
            </section>

            <section className="mrp-card">
              <h2 className="mrp-h2">3) How we use information</h2>
              <ul className="mrp-list">
                <li>Provide and operate the service</li>
                <li>Authenticate users and enforce access controls</li>
                <li>Process subscriptions and manage account status</li>
                <li>Communicate important updates, invoices, and support messages</li>
                <li>Improve product performance and security</li>
              </ul>
            </section>

            <section className="mrp-card">
              <h2 className="mrp-h2">4) Sharing of information</h2>
              <p className="mrp-paragraph">
                We share information only with service providers necessary to operate MedicaidReady (e.g., infrastructure,
                authentication, payment processing, email delivery), or when required by law. We do not sell your
                information.
              </p>
            </section>

            <section className="mrp-card">
              <h2 className="mrp-h2">5) Data retention</h2>
              <p className="mrp-paragraph">
                We retain account, business, and subscription records as needed to provide the service, meet legal
                obligations, resolve disputes, and enforce agreements. We may delete or anonymize data when it is no
                longer needed.
              </p>
            </section>

            <section className="mrp-card">
              <h2 className="mrp-h2">6) Security</h2>
              <p className="mrp-paragraph">
                We use reasonable administrative, technical, and organizational safeguards to protect data. For more
                details, see our{" "}
                <Link href="/security" className="mrp-link">
                  Security Overview
                </Link>
                .
              </p>
            </section>

            <section className="mrp-card">
              <h2 className="mrp-h2">7) Your choices</h2>
              <ul className="mrp-list">
                <li>Request access, updates, or deletions for your organization’s account information</li>
                <li>Manage subscription status through your billing settings</li>
                <li>Contact us for support at <strong>info@medicaidready.org</strong></li>
              </ul>
            </section>

            <section className="mrp-card">
              <h2 className="mrp-h2">8) Changes to this policy</h2>
              <p className="mrp-paragraph">
                We may update this policy from time to time. The “Last updated” date reflects the latest version.
              </p>
            </section>

            <footer className="mrp-footer">
              <div className="mrp-footer-links">
                <Link href="/terms" className="mrp-footer-link">
                  Terms
                </Link>
                <Link href="/privacy" className="mrp-footer-link">
                  Privacy
                </Link>
                <Link href="/security" className="mrp-footer-link">
                  Security
                </Link>
                <span className="mrp-footer-sep">•</span>
                <span>© {new Date().getFullYear()} MedicaidReady</span>
              </div>
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
                rgba(11, 58, 103, 0.1),
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
            border: 1px solid rgba(11, 18, 32, 0.1);
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

          .mrp-btn-secondary {
            height: 44px;
            padding: 0 14px;
            border-radius: 14px;
            border: 1px solid rgba(11, 18, 32, 0.14);
            background: rgba(255, 255, 255, 0.92);
            color: rgba(11, 18, 32, 0.9);
            font-weight: 900;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            box-shadow: 0 10px 22px rgba(11, 18, 32, 0.06);
          }

          .mrp-btn-secondary:hover {
            transform: translateY(-1px);
          }

          .mrp-hero-card {
            background: var(--mrp-card);
            border: 1px solid rgba(11, 18, 32, 0.1);
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
          .dotLow {
            background: #16a34a;
          }
          .dotMed {
            background: #f59e0b;
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
            border: 1px solid rgba(11, 18, 32, 0.1);
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

          .mrp-card {
            background: var(--mrp-card);
            border: 1px solid rgba(11, 18, 32, 0.1);
            border-radius: 18px;
            box-shadow: var(--mrp-shadow);
            padding: 18px;
            margin-bottom: 16px;
          }

          .mrp-h2 {
            margin: 0 0 10px;
            font-family: ui-serif, Georgia, "Times New Roman", Times, serif;
            font-weight: 700;
            font-size: 22px;
          }

          .mrp-h3 {
            margin: 14px 0 8px;
            font-weight: 900;
            font-size: 14px;
          }

          .mrp-paragraph {
            margin: 0;
            color: rgba(11, 18, 32, 0.82);
            line-height: 1.75;
          }

          .mrp-list {
            margin: 0;
            padding-left: 18px;
            color: rgba(11, 18, 32, 0.82);
            line-height: 1.9;
          }

          .mrp-callout {
            margin-top: 14px;
            border: 1px solid rgba(234, 88, 12, 0.22);
            background: rgba(255, 247, 237, 0.7);
            border-radius: 14px;
            padding: 14px;
          }

          .mrp-callout-title {
            font-weight: 900;
            color: rgba(124, 45, 18, 0.95);
          }

          .mrp-callout-text {
            margin-top: 6px;
            color: rgba(124, 45, 18, 0.9);
            line-height: 1.65;
          }

          .mrp-link {
            color: var(--mrp-blue);
            font-weight: 900;
            text-decoration: underline;
            text-decoration-color: rgba(11, 58, 103, 0.25);
            text-underline-offset: 4px;
          }

          .mrp-footer {
            margin-top: 18px;
            padding: 18px 0 26px;
            border-top: 1px solid rgba(11, 18, 32, 0.08);
            color: rgba(11, 18, 32, 0.6);
            font-size: 12px;
          }

          .mrp-footer-links {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            align-items: center;
          }

          .mrp-footer-link {
            color: rgba(11, 18, 32, 0.72);
            text-decoration: none;
            font-weight: 800;
          }

          .mrp-footer-link:hover {
            text-decoration: underline;
            text-decoration-color: rgba(11, 18, 32, 0.18);
            text-underline-offset: 4px;
            color: rgba(11, 18, 32, 0.9);
          }

          .mrp-footer-sep {
            opacity: 0.6;
          }

          @media (max-width: 980px) {
            .mrp-hero {
              grid-template-columns: 1fr;
            }
          }

          @media (max-width: 560px) {
            .mrp-nav {
              gap: 12px;
            }
            .mrp-h1 {
              font-size: 34px;
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