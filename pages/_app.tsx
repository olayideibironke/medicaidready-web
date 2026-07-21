import type { AppProps } from "next/app";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const close = () => setMenuOpen(false);

    router.events.on("routeChangeStart", close);
    router.events.on("hashChangeStart", close);

    return () => {
      router.events.off("routeChangeStart", close);
      router.events.off("hashChangeStart", close);
    };
  }, [router.events]);

  const year = useMemo(() => new Date().getFullYear(), []);
  const isCareersRoute = router.pathname.startsWith("/careers");
  const isCheckoutRoute = router.pathname.startsWith("/checkout");
  const isQuizRoute = router.pathname === "/quiz";
  const isPublicFluidRoute = !isCareersRoute && !isCheckoutRoute && !isQuizRoute;

  const mainClassName = [
    "site-main",
    isCareersRoute ? "site-main-careers" : "",
    isPublicFluidRoute ? "site-main-public-fluid" : "site-main-public-standard",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap"
          rel="stylesheet"
        />
      </Head>

      <style jsx global>{`
        *,
        *::before,
        *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        :root {
          --navy: #042c53;
          --navy-dark: #021c38;
          --navy-2: #0c447c;
          --blue: #0c447c;
          --blue-light: #85b7eb;
          --gold: #ba7517;
          --gold-bright: #ef9f27;
          --gold-soft: #f4e4c6;
          --ink: #0f172a;
          --text: #334155;
          --muted: #64748b;
          --subtle: #94a3b8;
          --bg: #f8fafc;
          --bg-alt: #f1f5f9;
          --surface: #ffffff;
          --border: #e2e8f0;
          --border-strong: #cbd5e1;
          --green: #15803d;
          --green-bg: #f0fdf4;
          --green-border: #bbf7d0;
          --amber: #b45309;
          --amber-bg: #fffbeb;
          --amber-border: #fde68a;
          --red: #dc2626;
          --shadow-sm: 0 1px 3px rgba(15, 23, 42, 0.08),
            0 1px 2px rgba(15, 23, 42, 0.04);
          --shadow-md: 0 4px 12px rgba(15, 23, 42, 0.08),
            0 2px 4px rgba(15, 23, 42, 0.04);
          --shadow-lg: 0 12px 32px rgba(15, 23, 42, 0.1),
            0 4px 8px rgba(15, 23, 42, 0.04);
          --radius-sm: 8px;
          --radius-md: 12px;
          --radius-lg: 16px;
          --radius-xl: 24px;

          --site-edge: clamp(16px, 3.2vw, 56px);
          --site-container-max: 1720px;
          --site-subtle-max: 1180px;
        }

        html,
        body {
          width: 100%;
          max-width: 100%;
          overflow-x: hidden;
          background: var(--bg);
          color: var(--ink);
          font-family: "DM Sans", ui-sans-serif, system-ui, -apple-system, sans-serif;
          font-size: 16px;
          line-height: 1.6;
          -webkit-text-size-adjust: 100%;
          -webkit-font-smoothing: antialiased;
        }

        @supports (overflow: clip) {
          html,
          body {
            overflow-x: clip;
          }
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        button,
        input,
        select,
        textarea {
          font-family: inherit;
        }

        img,
        picture,
        video,
        canvas {
          max-width: 100%;
        }

        .shell {
          min-height: 100vh;
          width: 100%;
          min-width: 0;
          display: flex;
          flex-direction: column;
          background: var(--bg);
          overflow-x: hidden;
        }

        @supports (overflow: clip) {
          .shell {
            overflow-x: clip;
          }
        }

        .site-main {
          flex: 1;
          width: 100%;
          min-width: 0;
        }

        .site-main > * {
          min-width: 0;
        }

        .site-main-public-fluid {
          --public-edge: var(--site-edge);
          --public-container-max: var(--site-container-max);
          overflow-x: hidden;
        }

        @supports (overflow: clip) {
          .site-main-public-fluid {
            overflow-x: clip;
          }
        }

        .site-main-public-fluid .container {
          width: min(
            calc(100% - calc(var(--public-edge) * 2)),
            var(--public-container-max)
          ) !important;
          max-width: none !important;
          margin-left: auto !important;
          margin-right: auto !important;
          padding-left: 0 !important;
          padding-right: 0 !important;
        }

        .site-main-public-fluid section,
        .site-main-public-fluid article,
        .site-main-public-fluid aside,
        .site-main-public-fluid div,
        .site-main-public-fluid form {
          min-width: 0;
        }

        .site-main-public-fluid img,
        .site-main-public-fluid svg,
        .site-main-public-fluid video,
        .site-main-public-fluid canvas {
          max-width: 100%;
        }

        .site-main-public-fluid table {
          width: 100%;
          max-width: 100%;
        }

        .site-main-public-standard {
          overflow-x: hidden;
        }

        @supports (overflow: clip) {
          .site-main-public-standard {
            overflow-x: clip;
          }
        }

        .header-hidden {
          display: none !important;
        }

        .header {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(255, 255, 255, 0.97);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border-bottom: 1px solid var(--border);
          box-shadow: inset 0 -3px 0 0 var(--gold);
        }

        .header-inner {
          width: min(
            calc(100% - calc(var(--site-edge) * 2)),
            var(--site-container-max)
          );
          max-width: none;
          margin: 0 auto;
          padding: 0;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .brand {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          color: var(--ink);
          font-weight: 700;
          font-size: 17px;
          letter-spacing: -0.3px;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .brand-icon {
          width: 36px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .brand-icon svg {
          display: block;
          width: 100%;
          height: 100%;
        }

        .brand-name {
          display: inline-flex;
          align-items: baseline;
          gap: 0;
        }

        .brand-name-main {
          color: var(--navy);
        }

        .brand-name-accent {
          color: var(--gold);
        }

        .nav {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-left: auto;
        }

        .nav-link {
          display: inline-flex;
          align-items: center;
          padding: 8px 16px;
          border-radius: var(--radius-sm);
          font-size: 14px;
          font-weight: 500;
          color: var(--text);
          transition:
            background 140ms,
            color 140ms;
          white-space: nowrap;
        }

        .nav-link:hover {
          background: var(--bg-alt);
          color: var(--ink);
        }

        .nav-cta {
          display: inline-flex;
          align-items: center;
          padding: 9px 20px;
          border-radius: var(--radius-sm);
          font-size: 14px;
          font-weight: 600;
          color: #fff;
          background: var(--navy);
          white-space: nowrap;
          transition:
            background 140ms,
            transform 100ms;
          border: 1px solid var(--navy-dark);
          box-shadow: var(--shadow-sm);
        }

        .nav-cta:hover {
          background: var(--navy-dark);
          transform: translateY(-1px);
        }

        .menu-btn {
          display: none;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border);
          background: var(--surface);
          color: var(--ink);
          cursor: pointer;
          flex-shrink: 0;
        }

        .menu-btn svg {
          display: block;
        }

        .mobile-panel {
          border-top: 1px solid var(--border);
          background: var(--surface);
        }

        .mobile-panel-inner {
          width: min(
            calc(100% - calc(var(--site-edge) * 2)),
            var(--site-container-max)
          );
          max-width: none;
          margin: 0 auto;
          padding: 12px 0 16px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .mobile-link {
          display: block;
          padding: 12px 16px;
          border-radius: var(--radius-sm);
          font-size: 15px;
          font-weight: 500;
          color: var(--text);
        }

        .mobile-link:hover {
          background: var(--bg-alt);
        }

        .mobile-cta {
          display: block;
          padding: 13px 16px;
          border-radius: var(--radius-sm);
          font-size: 15px;
          font-weight: 600;
          color: #fff;
          background: var(--navy);
          text-align: center;
          margin-top: 4px;
        }

        .footer {
          background: var(--surface);
          border-top: 1px solid var(--border);
          margin-top: auto;
        }

        .footer-inner {
          width: min(
            calc(100% - calc(var(--site-edge) * 2)),
            var(--site-container-max)
          );
          max-width: none;
          margin: 0 auto;
          padding: 28px 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          flex-wrap: wrap;
        }

        .footer-left {
          display: flex;
          flex-direction: column;
          gap: 5px;
          min-width: 0;
        }

        .footer-brand {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 700;
          color: var(--ink);
        }

        .footer-brand-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--gold);
          flex-shrink: 0;
          box-shadow: 0 0 0 4px rgba(186, 117, 23, 0.1);
        }

        .footer-meta {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 8px;
          padding-left: 16px;
          color: var(--muted);
          font-size: 13px;
          line-height: 1.5;
        }

        .footer-owner {
          color: var(--muted);
          font-weight: 600;
        }

        .footer-owner strong {
          color: var(--navy);
          font-weight: 900;
        }

        .footer-meta-divider {
          width: 4px;
          height: 4px;
          border-radius: 999px;
          background: var(--border-strong);
          flex-shrink: 0;
        }

        .footer-links {
          display: flex;
          align-items: center;
          gap: 4px;
          flex-wrap: wrap;
        }

        .footer-link {
          padding: 6px 12px;
          border-radius: var(--radius-sm);
          font-size: 13px;
          font-weight: 500;
          color: var(--muted);
          transition:
            color 120ms,
            background 120ms;
        }

        .footer-link:hover {
          color: var(--ink);
          background: var(--bg-alt);
        }

        .footer-divider {
          width: 1px;
          height: 14px;
          background: var(--border);
        }

        @media (min-width: 1800px) {
          :root {
            --site-container-max: 1840px;
          }
        }

        @media (max-width: 680px) {
          :root {
            --site-edge: 16px;
          }

          .nav {
            display: none;
          }

          .menu-btn {
            display: flex;
          }

          .header-inner,
          .mobile-panel-inner,
          .footer-inner {
            width: min(calc(100% - 32px), var(--site-container-max));
          }

          .footer-inner {
            padding: 20px 0;
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }

          .footer-meta {
            padding-left: 16px;
          }

          .site-main-public-fluid .container {
            width: min(calc(100% - 32px), var(--public-container-max)) !important;
          }
        }

        @media (max-width: 420px) {
          .footer-meta {
            display: grid;
            gap: 4px;
          }

          .footer-meta-divider {
            display: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            transition-duration: 0ms !important;
            animation-duration: 0ms !important;
          }
        }
      `}</style>

      <div className="shell">
        <header className={`header ${isCareersRoute ? "header-hidden" : ""}`}>
          <div className="header-inner">
            <Link
              href="/"
              className="brand"
              aria-label="MedicaidReady Home"
              onClick={() => setMenuOpen(false)}
            >
              <span className="brand-icon" aria-hidden="true">
                <svg
                  viewBox="0 0 52 56"
                  xmlns="http://www.w3.org/2000/svg"
                  role="img"
                  aria-label="MedicaidReady Hex Crest Mark"
                >
                  <polygon points="26,3 48,15 48,39 26,51 4,39 4,15" fill="#042C53" />
                  <polygon
                    points="26,9 43,19 43,35 26,45 9,35 9,19"
                    fill="none"
                    stroke="#BA7517"
                    strokeWidth="1.5"
                  />
                  <line
                    x1="26"
                    y1="20"
                    x2="26"
                    y2="34"
                    stroke="#FFFFFF"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  <line
                    x1="19"
                    y1="27"
                    x2="33"
                    y2="27"
                    stroke="#FFFFFF"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  <line
                    x1="26"
                    y1="20"
                    x2="26"
                    y2="34"
                    stroke="#BA7517"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <line
                    x1="19"
                    y1="27"
                    x2="33"
                    y2="27"
                    stroke="#BA7517"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <span className="brand-name">
                <span className="brand-name-main">Medicaid</span>
                <span className="brand-name-accent">Ready</span>
              </span>
            </Link>

            <nav className="nav" aria-label="Primary navigation">
              <Link href="/pricing" className="nav-link">
                Pricing
              </Link>
              <Link href="/quiz" className="nav-cta">
                Check Eligibility - Free
              </Link>
            </nav>

            <button
              type="button"
              className="menu-btn"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path
                    d="M4 4l10 10M14 4L4 14"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path
                    d="M3 5h12M3 9h12M3 13h12"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </button>
          </div>

          {menuOpen && (
            <div className="mobile-panel">
              <div className="mobile-panel-inner" role="menu">
                <Link
                  href="/pricing"
                  className="mobile-link"
                  onClick={() => setMenuOpen(false)}
                >
                  Pricing
                </Link>
                <Link
                  href="/quiz"
                  className="mobile-cta"
                  onClick={() => setMenuOpen(false)}
                >
                  Check My Eligibility - Free
                </Link>
              </div>
            </div>
          )}
        </header>

        <main className={mainClassName}>
          <Component {...pageProps} />
        </main>

        <footer className="footer">
          <div className="footer-inner">
            <div className="footer-left">
              <div className="footer-brand">
                <span className="footer-brand-dot" aria-hidden="true" />
                MedicaidReady
              </div>

              <div className="footer-meta">
                <span>© {year} MedicaidReady. All rights reserved.</span>
                <span className="footer-meta-divider" aria-hidden="true" />
                <span className="footer-owner">
                  A product of <strong>Westforge Holdings Inc.</strong>
                </span>
              </div>
            </div>

            <nav className="footer-links" aria-label="Legal links">
              <Link href="/privacy" className="footer-link">
                Privacy
              </Link>
              <span className="footer-divider" aria-hidden="true" />
              <Link href="/terms" className="footer-link">
                Terms
              </Link>
              <span className="footer-divider" aria-hidden="true" />
              <Link href="/security" className="footer-link">
                Security
              </Link>
            </nav>
          </div>
        </footer>
      </div>
    </>
  );
}