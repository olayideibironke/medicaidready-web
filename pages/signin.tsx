// pages/signin.tsx
import Head from "next/head";
import Link from "next/link";

export default function SignInPage() {
  return (
    <>
      <Head>
        <title>Sign in • MedicaidReady</title>
        <meta name="description" content="Sign in to MedicaidReady." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="mrs-root">
        <header className="mrs-header">
          <div className="mrs-shell mrs-header-inner">
            <Link href="/" className="mrs-brand" aria-label="Go to home">
              <span className="mrs-logo" aria-hidden="true" />
              <span className="mrs-brand-text">
                <span className="mrs-brand-title">MedicaidReady</span>
                <span className="mrs-brand-sub">MD • VA • DC</span>
              </span>
            </Link>

            <nav className="mrs-nav" aria-label="Primary navigation">
              <Link href="/" className="mrs-nav-link">
                Home
              </Link>
              <Link href="/request-access" className="mrs-nav-link">
                Request Access
              </Link>
              <Link href="/signin" className="mrs-nav-cta mrs-nav-cta-active">
                Sign in
              </Link>
            </nav>
          </div>
        </header>

        <main className="mrs-main">
          <div className="mrs-shell">
            <div className="mrs-hero">
              <h1 className="mrs-h1">Sign in</h1>
              <p className="mrs-lead">
                Sign-in is being finalized. If you don’t have access yet, request access first.
              </p>
            </div>

            <div className="mrs-grid">
              <section className="mrs-card">
                <h2 className="mrs-card-title">Don’t have access yet?</h2>
                <p className="mrs-card-text">
                  Submit your work email and we’ll review and approve your account.
                </p>

                <div className="mrs-actions">
                  <Link href="/request-access" className="mrs-btn-primary">
                    Request access
                  </Link>
                  <Link href="/pricing" className="mrs-btn-secondary">
                    View pricing
                  </Link>
                </div>

                <div className="mrs-note">
                  Already approved? Your sign-in flow will be available here shortly.
                </div>
              </section>

              <section className="mrs-card">
                <h2 className="mrs-card-title">Sign in</h2>
                <p className="mrs-card-text">
                  This page exists to prevent 404s and keep the nav consistent while the auth page is wired in.
                </p>

                <div className="mrs-form">
                  <div className="mrs-field">
                    <label className="mrs-label">Email</label>
                    <input
                      className="mrs-input"
                      placeholder="name@organization.com"
                      autoComplete="email"
                      disabled
                    />
                  </div>

                  <div className="mrs-field">
                    <label className="mrs-label">Password</label>
                    <input
                      className="mrs-input"
                      placeholder="••••••••"
                      autoComplete="current-password"
                      type="password"
                      disabled
                    />
                  </div>

                  <button className="mrs-btn-disabled" disabled>
                    Sign in (coming next)
                  </button>

                  <div className="mrs-legal">
                    If you need immediate access, use{" "}
                    <Link href="/request-access" className="mrs-link">
                      Request Access
                    </Link>
                    .
                  </div>
                </div>
              </section>
            </div>

            <footer className="mrs-footer">
              <div className="mrs-footer-inner">
                <div>© {new Date().getFullYear()} MedicaidReady</div>
                <div className="mrs-footer-links">
                  <Link href="/pricing" className="mrs-footer-link">
                    Pricing
                  </Link>
                  <Link href="/request-access" className="mrs-footer-link">
                    Request Access
                  </Link>
                </div>
              </div>
            </footer>
          </div>
        </main>

        <style jsx global>{`
          :root {
            --mrs-ink: #0b1220;
            --mrs-muted: rgba(11, 18, 32, 0.72);
            --mrs-border: rgba(11, 18, 32, 0.12);
            --mrs-border2: rgba(11, 18, 32, 0.08);
            --mrs-card: rgba(255, 255, 255, 0.92);
            --mrs-shadow: 0 16px 40px rgba(11, 18, 32, 0.08);
            --mrs-blue: #0b3a67;
            --mrs-blue2: #0a2f55;
          }

          html,
          body {
            background: #f4f7fb;
            color: var(--mrs-ink);
          }

          .mrs-root {
            min-height: 100vh;
            color: var(--mrs-ink);
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

          .mrs-shell {
            max-width: 1180px;
            margin: 0 auto;
            padding: 0 18px;
          }

          .mrs-header {
            position: sticky;
            top: 0;
            z-index: 30;
            background: rgba(255, 255, 255, 0.86);
            backdrop-filter: blur(10px);
            border-bottom: 1px solid var(--mrs-border2);
          }

          .mrs-header-inner {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16px 0;
            gap: 14px;
          }

          .mrs-brand {
            display: inline-flex;
            align-items: center;
            gap: 12px;
            text-decoration: none;
            color: var(--mrs-ink);
          }

          .mrs-logo {
            width: 52px;
            height: 52px;
            border-radius: 14px;
            background: var(--mrs-blue);
            box-shadow: 0 10px 20px rgba(11, 58, 103, 0.18);
          }

          .mrs-brand-text {
            display: flex;
            flex-direction: column;
            line-height: 1.1;
          }

          .mrs-brand-title {
            font-family: ui-serif, Georgia, "Times New Roman", Times, serif;
            font-weight: 700;
            font-size: 20px;
            letter-spacing: 0.2px;
          }

          .mrs-brand-sub {
            margin-top: 4px;
            font-size: 13px;
            color: rgba(11, 18, 32, 0.65);
          }

          .mrs-nav {
            display: flex;
            align-items: center;
            gap: 22px;
          }

          .mrs-nav-link {
            text-decoration: none;
            color: rgba(11, 18, 32, 0.78);
            font-weight: 600;
          }

          .mrs-nav-link:hover {
            color: var(--mrs-ink);
            text-decoration: underline;
            text-decoration-color: rgba(11, 18, 32, 0.18);
            text-underline-offset: 4px;
          }

          .mrs-nav-cta {
            text-decoration: none;
            background: var(--mrs-blue);
            color: white;
            padding: 12px 18px;
            border-radius: 999px;
            font-weight: 700;
            box-shadow: 0 14px 24px rgba(11, 58, 103, 0.18);
          }

          .mrs-nav-cta:hover {
            background: var(--mrs-blue2);
          }

          .mrs-nav-cta-active {
            background: var(--mrs-blue2);
          }

          .mrs-main {
            padding: 34px 0 22px;
          }

          .mrs-hero {
            padding: 12px 0 26px;
            border-bottom: 1px solid rgba(11, 18, 32, 0.08);
          }

          .mrs-h1 {
            margin: 0;
            font-family: ui-serif, Georgia, "Times New Roman", Times, serif;
            font-weight: 700;
            font-size: 56px;
            letter-spacing: -0.6px;
            color: #0b1220;
          }

          .mrs-lead {
            margin: 14px 0 0;
            font-size: 18px;
            color: var(--mrs-muted);
            max-width: 70ch;
            line-height: 1.6;
          }

          .mrs-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 20px;
            margin-top: 26px;
          }

          .mrs-card {
            background: var(--mrs-card);
            border: 1px solid rgba(11, 18, 32, 0.10);
            border-radius: 18px;
            box-shadow: var(--mrs-shadow);
            padding: 22px;
          }

          .mrs-card-title {
            margin: 0;
            font-family: ui-serif, Georgia, "Times New Roman", Times, serif;
            font-weight: 700;
            font-size: 22px;
            color: #0b1220;
          }

          .mrs-card-text {
            margin: 10px 0 0;
            color: var(--mrs-muted);
            font-size: 16px;
            line-height: 1.6;
          }

          .mrs-actions {
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
            margin-top: 16px;
          }

          .mrs-btn-primary {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            height: 52px;
            padding: 0 18px;
            border-radius: 14px;
            background: var(--mrs-blue);
            color: white;
            font-weight: 800;
            text-decoration: none;
            box-shadow: 0 18px 32px rgba(11, 58, 103, 0.18);
          }

          .mrs-btn-primary:hover {
            background: var(--mrs-blue2);
          }

          .mrs-btn-secondary {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            height: 52px;
            padding: 0 18px;
            border-radius: 14px;
            background: rgba(11, 58, 103, 0.08);
            border: 1px solid rgba(11, 58, 103, 0.14);
            color: var(--mrs-blue);
            font-weight: 800;
            text-decoration: none;
          }

          .mrs-note {
            margin-top: 14px;
            color: rgba(11, 18, 32, 0.62);
            line-height: 1.6;
          }

          .mrs-form {
            margin-top: 14px;
            display: flex;
            flex-direction: column;
            gap: 14px;
          }

          .mrs-field {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }

          .mrs-label {
            font-weight: 700;
            color: rgba(11, 18, 32, 0.86);
          }

          .mrs-input {
            height: 46px;
            border-radius: 12px;
            border: 1px solid rgba(11, 18, 32, 0.16);
            padding: 0 14px;
            font-size: 16px;
            background: white;
            color: #0b1220;
            outline: none;
          }

          .mrs-btn-disabled {
            height: 56px;
            border-radius: 14px;
            border: none;
            background: rgba(11, 58, 103, 0.22);
            color: rgba(255, 255, 255, 0.85);
            font-weight: 800;
            font-size: 18px;
            cursor: not-allowed;
          }

          .mrs-legal {
            font-size: 13px;
            color: rgba(11, 18, 32, 0.62);
            line-height: 1.5;
          }

          .mrs-link {
            color: var(--mrs-blue);
            font-weight: 800;
            text-decoration: underline;
            text-decoration-color: rgba(11, 58, 103, 0.25);
            text-underline-offset: 4px;
          }

          .mrs-footer {
            margin-top: 26px;
            border-top: 1px solid rgba(11, 18, 32, 0.08);
            padding: 18px 0 26px;
            color: rgba(11, 18, 32, 0.6);
          }

          .mrs-footer-inner {
            display: flex;
            flex-direction: column;
            gap: 12px;
            align-items: flex-start;
            justify-content: space-between;
          }

          .mrs-footer-links {
            display: flex;
            gap: 14px;
            align-items: center;
          }

          .mrs-footer-link {
            text-decoration: none;
            color: rgba(11, 18, 32, 0.7);
            font-weight: 700;
          }

          .mrs-footer-link:hover {
            color: rgba(11, 18, 32, 0.95);
            text-decoration: underline;
            text-decoration-color: rgba(11, 18, 32, 0.18);
            text-underline-offset: 4px;
          }

          @media (min-width: 900px) {
            .mrs-grid {
              grid-template-columns: 1fr 1fr;
              gap: 22px;
              align-items: start;
            }
            .mrs-footer-inner {
              flex-direction: row;
              align-items: center;
            }
          }

          @media (max-width: 560px) {
            .mrs-h1 {
              font-size: 44px;
            }
            .mrs-nav {
              gap: 14px;
            }
            .mrs-logo {
              width: 46px;
              height: 46px;
            }
          }
        `}</style>
      </div>
    </>
  );
}
