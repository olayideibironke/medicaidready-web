// pages/terms.tsx
import Head from "next/head";
import Link from "next/link";
import { useMemo } from "react";

export default function TermsOfServicePage() {
  const updated = useMemo(() => new Date().toLocaleDateString(), []);

  return (
    <>
      <Head>
        <title>Terms of Service • MedicaidReady</title>
        <meta
          name="description"
          content="MedicaidReady Terms of Service. Compliance readiness monitoring for Medicaid providers in the DMV region."
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
            <div className="mrp-top">
              <div className="mrp-badge">
                <span className="mrp-dot" aria-hidden="true" />
                Legal
              </div>
              <h1 className="mrp-h1">Terms of Service</h1>
              <p className="mrp-lead">
                Last updated: <strong>{updated}</strong>
              </p>
              <div className="mrp-actions">
                <Link href="/privacy" className="mrp-btn-secondary">
                  Privacy Policy
                </Link>
                <Link href="/security" className="mrp-btn-secondary">
                  Security Overview
                </Link>
              </div>
            </div>

            <section className="mrp-card">
              <h2 className="mrp-h2">1) Agreement</h2>
              <p className="mrp-p">
                By accessing or using MedicaidReady, you agree to these Terms of Service. If you are using the service on
                behalf of an organization, you represent that you have authority to bind that organization.
              </p>
            </section>

            <section className="mrp-card">
              <h2 className="mrp-h2">2) Service description</h2>
              <p className="mrp-p">
                MedicaidReady provides compliance readiness monitoring tools for Medicaid providers (e.g., onboarding,
                checklist tracking, operational signals, reporting views). The service is intended for organizational
                compliance workflows—not patient medical record storage.
              </p>

              <div className="mrp-callout">
                <div className="mrp-callout-title">No PHI (Protected Health Information)</div>
                <div className="mrp-callout-text">
                  You agree not to submit patient-level data to MedicaidReady. Do not upload PHI, patient identifiers,
                  clinical notes, diagnoses, or medical record numbers.
                </div>
              </div>
            </section>

            <section className="mrp-card">
              <h2 className="mrp-h2">3) Access and accounts</h2>
              <ul className="mrp-ul">
                <li>Access is credentialed and may require approval.</li>
                <li>You are responsible for safeguarding account credentials.</li>
                <li>You agree to provide accurate business information for onboarding and billing.</li>
              </ul>
            </section>

            <section className="mrp-card">
              <h2 className="mrp-h2">4) Subscriptions, billing, and renewals</h2>
              <ul className="mrp-ul">
                <li>Subscriptions may renew automatically unless canceled.</li>
                <li>Billing is processed by third-party payment providers.</li>
                <li>Non-payment or chargebacks may result in access restriction or revocation.</li>
              </ul>
            </section>

            <section className="mrp-card">
              <h2 className="mrp-h2">5) Acceptable use</h2>
              <ul className="mrp-ul">
                <li>No unlawful, harmful, or abusive activity.</li>
                <li>No attempts to bypass access controls, scrape data, or probe for vulnerabilities.</li>
                <li>No uploading content you don’t have rights to share.</li>
              </ul>
            </section>

            <section className="mrp-card">
              <h2 className="mrp-h2">6) Confidentiality</h2>
              <p className="mrp-p">
                You may upload organizational compliance artifacts and internal operational information. You should only
                upload information your organization permits you to share. We will take reasonable steps to protect
                customer information consistent with our Security Overview.
              </p>
            </section>

            <section className="mrp-card">
              <h2 className="mrp-h2">7) Disclaimer</h2>
              <p className="mrp-p">
                MedicaidReady provides operational support and visibility into compliance readiness. It does not provide
                legal advice and is not a substitute for professional compliance, legal, or regulatory guidance. The
                service is provided “as is” without warranties of any kind.
              </p>
            </section>

            <section className="mrp-card">
              <h2 className="mrp-h2">8) Limitation of liability</h2>
              <p className="mrp-p">
                To the maximum extent permitted by law, MedicaidReady and its operators will not be liable for indirect,
                incidental, special, consequential, or punitive damages, or any loss of profits, revenue, data, or
                business opportunities arising from your use of the service.
              </p>
            </section>

            <section className="mrp-card">
              <h2 className="mrp-h2">9) Suspension and termination</h2>
              <p className="mrp-p">
                We may suspend or terminate access if we reasonably believe there is unauthorized access, abuse, non-payment,
                or a violation of these Terms. You may stop using the service at any time.
              </p>
            </section>

            <section className="mrp-card">
              <h2 className="mrp-h2">10) Changes</h2>
              <p className="mrp-p">
                We may update these Terms from time to time. Continued use of the service after changes means you accept
                the updated Terms.
              </p>
            </section>

            <section className="mrp-card">
              <h2 className="mrp-h2">11) Contact</h2>
              <p className="mrp-p">
                Support and legal notices: <strong>info@medicaidready.org</strong>
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
            --ink: #0b1220;
            --muted: rgba(11, 18, 32, 0.72);
            --border: rgba(11, 18, 32, 0.08);
            --card: rgba(255, 255, 255, 0.92);
            --shadow: 0 16px 40px rgba(11, 18, 32, 0.08);
            --blue: #0b3a67;
            --blue2: #0a2f55;
          }

          html,
          body {
            background: #f4f7fb;
            color: var(--ink);
          }
        `}</style>

        <style jsx>{`
          .mrp-root {
            min-height: 100vh;
            font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial,
              "Apple Color Emoji", "Segoe UI Emoji";
            background: radial-gradient(900px 340px at 44% 18%, rgba(11, 58, 103, 0.1), rgba(244, 247, 251, 0) 60%),
              radial-gradient(900px 340px at 72% 22%, rgba(11, 58, 103, 0.07), rgba(244, 247, 251, 0) 62%),
              linear-gradient(#f4f7fb, #f4f7fb);
            color: var(--ink);
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
            border-bottom: 1px solid var(--border);
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
            color: var(--ink);
          }

          .mrp-logo {
            width: 52px;
            height: 52px;
            border-radius: 14px;
            background: var(--blue);
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
            color: var(--ink);
            text-decoration: underline;
            text-decoration-color: rgba(11, 18, 32, 0.18);
            text-underline-offset: 4px;
          }

          .mrp-nav-cta {
            text-decoration: none;
            background: var(--blue);
            color: white;
            padding: 12px 18px;
            border-radius: 999px;
            font-weight: 700;
            box-shadow: 0 14px 24px rgba(11, 58, 103, 0.18);
          }

          .mrp-nav-cta:hover {
            background: var(--blue2);
          }

          .mrp-main {
            padding: 28px 0 26px;
          }

          .mrp-top {
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
            color: var(--muted);
            font-size: 16px;
            line-height: 1.6;
          }

          .mrp-actions {
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

          .mrp-card {
            background: var(--card);
            border: 1px solid rgba(11, 18, 32, 0.1);
            border-radius: 18px;
            box-shadow: var(--shadow);
            padding: 18px;
            margin-bottom: 16px;
          }

          .mrp-h2 {
            margin: 0 0 10px;
            font-family: ui-serif, Georgia, "Times New Roman", Times, serif;
            font-weight: 700;
            font-size: 22px;
          }

          .mrp-p {
            margin: 0;
            color: rgba(11, 18, 32, 0.82);
            line-height: 1.75;
          }

          .mrp-ul {
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