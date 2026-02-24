import type { AppProps } from "next/app";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close menu on route change (real Next.js navigation, not just popstate)
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

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <style jsx global>{`
        /* Global hardening to stop mobile "wiggle" */
        * {
          box-sizing: border-box;
        }
        html,
        body {
          width: 100%;
          max-width: 100%;
          overflow-x: hidden;
          margin: 0;
          padding: 0;
          background: #ffffff;
          color: #0b1220;
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto,
            Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
          -webkit-text-size-adjust: 100%;
        }

        /* Layout shell */
        .mr-shell {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: #ffffff;
        }

        /* Header: stable height, no wrap, no shifting */
        .mr-header {
          position: sticky;
          top: 0;
          z-index: 50;
          background: #ffffff; /* solid background = less Safari repaint jitter */
          border-bottom: 1px solid rgba(15, 23, 42, 0.10);
        }

        .mr-header-inner {
          max-width: 1100px;
          margin: 0 auto;
          padding: 10px 16px;
          height: 58px; /* fixed height prevents reflow */
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .mr-brand {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          color: #0b1220;
          font-weight: 900;
          letter-spacing: -0.2px;
          white-space: nowrap;
          flex: 0 0 auto;
          min-width: 0;
        }

        .mr-brand-dot {
          width: 12px;
          height: 12px;
          border-radius: 999px;
          background: #0b3a66;
          box-shadow: 0 8px 18px rgba(11, 58, 102, 0.18);
          flex: 0 0 auto;
        }

        .mr-brand-text {
          font-size: 16px;
          line-height: 1;
        }

        /* Desktop nav */
        .mr-nav {
          display: flex;
          align-items: center;
          gap: 10px;
          justify-content: flex-end;
          flex: 1 1 auto;
          min-width: 0;
        }

        .mr-link {
          text-decoration: none;
          color: #0b1220;
          font-weight: 800;
          font-size: 13px;
          padding: 8px 10px;
          border-radius: 999px;
          border: 1px solid rgba(15, 23, 42, 0.10);
          background: #ffffff;
          white-space: nowrap;
        }

        .mr-link-primary {
          color: #ffffff;
          border: 1px solid rgba(11, 58, 102, 0.35);
          background: linear-gradient(135deg, #0b3a66, #0f6aa6);
          box-shadow: 0 10px 22px rgba(11, 18, 32, 0.10);
        }

        /* Mobile menu button */
        .mr-menu-btn {
          display: none;
          align-items: center;
          justify-content: center;
          height: 40px;
          padding: 0 12px;
          border-radius: 999px;
          border: 1px solid rgba(15, 23, 42, 0.10);
          background: #ffffff;
          color: #0b1220;
          font-weight: 900;
          cursor: pointer;
          white-space: nowrap;
          flex: 0 0 auto;
        }

        /* Mobile dropdown panel */
        .mr-mobile-panel {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 16px 12px;
        }

        .mr-mobile-card {
          border: 1px solid rgba(15, 23, 42, 0.10);
          border-radius: 16px;
          background: #ffffff;
          box-shadow: 0 12px 30px rgba(2, 6, 23, 0.10);
          overflow: hidden;
        }

        .mr-mobile-item {
          display: block;
          padding: 12px 14px;
          text-decoration: none;
          color: #0b1220;
          font-weight: 900;
          border-top: 1px solid rgba(15, 23, 42, 0.08);
        }

        .mr-mobile-item:first-child {
          border-top: none;
        }

        /* Footer */
        .mr-footer {
          border-top: 1px solid rgba(15, 23, 42, 0.10);
          background: #ffffff;
        }

        .mr-footer-inner {
          max-width: 1100px;
          margin: 0 auto;
          padding: 18px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
          color: #475569;
          font-size: 13px;
        }

        .mr-footer-links {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          align-items: center;
        }

        .mr-footer-link {
          text-decoration: none;
          color: #0b1220;
          font-weight: 800;
        }

        /* Responsive rules: hard switch — no overlap, no reflow */
        @media (max-width: 720px) {
          .mr-nav {
            display: none;
          }
          .mr-menu-btn {
            display: inline-flex;
          }
        }
      `}</style>

      <div className="mr-shell">
        <header className="mr-header">
          <div className="mr-header-inner">
            <Link href="/" className="mr-brand" aria-label="MedicaidReady Home" onClick={() => setMenuOpen(false)}>
              <span className="mr-brand-dot" aria-hidden="true" />
              <span className="mr-brand-text">MedicaidReady</span>
            </Link>

            <nav className="mr-nav" aria-label="Primary navigation">
              <Link href="/pricing" className="mr-link">
                Pricing
              </Link>
              <Link href="/request-access" className="mr-link mr-link-primary">
                Request access
              </Link>
              <Link href="/signin" className="mr-link">
                Sign in
              </Link>
              <Link href="/providers" className="mr-link">
                Providers
              </Link>
            </nav>

            <button
              type="button"
              className="mr-menu-btn"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? "Close" : "Menu"}
            </button>
          </div>

          {menuOpen ? (
            <div className="mr-mobile-panel">
              <div className="mr-mobile-card" role="menu" aria-label="Mobile navigation">
                <Link href="/pricing" className="mr-mobile-item" onClick={() => setMenuOpen(false)}>
                  Pricing
                </Link>
                <Link href="/request-access" className="mr-mobile-item" onClick={() => setMenuOpen(false)}>
                  Request access
                </Link>
                <Link href="/signin" className="mr-mobile-item" onClick={() => setMenuOpen(false)}>
                  Sign in
                </Link>
                <Link href="/providers" className="mr-mobile-item" onClick={() => setMenuOpen(false)}>
                  Providers
                </Link>
              </div>
            </div>
          ) : null}
        </header>

        <main style={{ flex: 1 }}>
          <Component {...pageProps} />
        </main>

        <footer className="mr-footer">
          <div className="mr-footer-inner">
            <div>© {year} MedicaidReady</div>

            <div className="mr-footer-links" aria-label="Legal links">
              <Link href="/privacy" className="mr-footer-link">
                Privacy
              </Link>
              <Link href="/terms" className="mr-footer-link">
                Terms
              </Link>
              <Link href="/security" className="mr-footer-link">
                Security
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}