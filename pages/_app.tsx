import type { AppProps } from "next/app";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function MyApp({ Component, pageProps }: AppProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  // Close menu on route changes / navigation clicks (simple + safe)
  useEffect(() => {
    const close = () => setMenuOpen(false);
    window.addEventListener("popstate", close);
    return () => window.removeEventListener("popstate", close);
  }, []);

  const shellStyle: React.CSSProperties = {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "#ffffff",
    color: "#0b1220",
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
  };

  const headerStyle: React.CSSProperties = {
    position: "sticky",
    top: 0,
    zIndex: 50,
    background: "rgba(255, 255, 255, 0.92)",
    backdropFilter: "blur(10px)",
    borderBottom: "1px solid rgba(15, 23, 42, 0.10)",
  };

  const headerInnerStyle: React.CSSProperties = {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "12px 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "nowrap", // IMPORTANT: stop wrapping causing the wiggle
  };

  const brandStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    textDecoration: "none",
    color: "#0b1220",
    fontWeight: 900,
    letterSpacing: -0.2,
    whiteSpace: "nowrap",
    flex: "0 0 auto",
  };

  const navStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 10,
    flexWrap: "nowrap",
    justifyContent: "flex-end",
    flex: "1 1 auto",
    minWidth: 0,
  };

  const navLinkStyle: React.CSSProperties = {
    textDecoration: "none",
    color: "#0b1220",
    fontWeight: 800,
    fontSize: 13,
    padding: "8px 10px",
    borderRadius: 999,
    border: "1px solid rgba(15, 23, 42, 0.10)",
    background: "#ffffff",
    whiteSpace: "nowrap",
  };

  const primaryLinkStyle: React.CSSProperties = {
    ...navLinkStyle,
    color: "#ffffff",
    border: "1px solid rgba(11, 58, 102, 0.35)",
    background: "linear-gradient(135deg, #0b3a66, #0f6aa6)",
    boxShadow: "0 10px 22px rgba(11, 18, 32, 0.10)",
  };

  const menuButtonStyle: React.CSSProperties = {
    padding: "10px 12px",
    borderRadius: 999,
    border: "1px solid rgba(15, 23, 42, 0.10)",
    background: "#ffffff",
    color: "#0b1220",
    fontWeight: 900,
    cursor: "pointer",
    whiteSpace: "nowrap",
  };

  const menuPanelStyle: React.CSSProperties = {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "0 16px 14px",
  };

  const menuCardStyle: React.CSSProperties = {
    border: "1px solid rgba(15, 23, 42, 0.10)",
    borderRadius: 16,
    background: "rgba(255,255,255,0.98)",
    boxShadow: "0 12px 30px rgba(2, 6, 23, 0.10)",
    overflow: "hidden",
  };

  const menuItemStyle: React.CSSProperties = {
    display: "block",
    padding: "12px 14px",
    textDecoration: "none",
    color: "#0b1220",
    fontWeight: 900,
    borderTop: "1px solid rgba(15, 23, 42, 0.08)",
  };

  const footerStyle: React.CSSProperties = {
    borderTop: "1px solid rgba(15, 23, 42, 0.10)",
    background: "#ffffff",
  };

  const footerInnerStyle: React.CSSProperties = {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "18px 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
    color: "#475569",
    fontSize: 13,
  };

  const footerLinksStyle: React.CSSProperties = {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
    alignItems: "center",
  };

  const footerLinkStyle: React.CSSProperties = {
    textDecoration: "none",
    color: "#0b1220",
    fontWeight: 800,
  };

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Mobile/desktop visibility rules */}
      <style jsx global>{`
        .mr-desktop-nav {
          display: flex;
        }
        .mr-mobile-menu-btn {
          display: none;
        }
        @media (max-width: 720px) {
          .mr-desktop-nav {
            display: none;
          }
          .mr-mobile-menu-btn {
            display: inline-flex;
          }
        }
      `}</style>

      <div style={shellStyle}>
        <header style={headerStyle}>
          <div style={headerInnerStyle}>
            <Link href="/" style={brandStyle} aria-label="MedicaidReady Home" onClick={() => setMenuOpen(false)}>
              <span style={{ fontSize: 16 }}>MedicaidReady</span>
            </Link>

            {/* Desktop nav */}
            <nav className="mr-desktop-nav" style={navStyle} aria-label="Primary navigation">
              <Link href="/pricing" style={navLinkStyle}>
                Pricing
              </Link>
              <Link href="/request-access" style={primaryLinkStyle}>
                Request access
              </Link>
              <Link href="/signin" style={navLinkStyle}>
                Sign in
              </Link>
              <Link href="/providers" style={navLinkStyle}>
                Providers
              </Link>
            </nav>

            {/* Mobile menu button */}
            <button
              type="button"
              className="mr-mobile-menu-btn"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
              style={menuButtonStyle}
            >
              {menuOpen ? "Close" : "Menu"}
            </button>
          </div>

          {/* Mobile dropdown */}
          {menuOpen ? (
            <div style={menuPanelStyle}>
              <div style={menuCardStyle}>
                <Link href="/pricing" style={{ ...menuItemStyle, borderTop: "none" }} onClick={() => setMenuOpen(false)}>
                  Pricing
                </Link>
                <Link href="/request-access" style={menuItemStyle} onClick={() => setMenuOpen(false)}>
                  Request access
                </Link>
                <Link href="/signin" style={menuItemStyle} onClick={() => setMenuOpen(false)}>
                  Sign in
                </Link>
                <Link href="/providers" style={menuItemStyle} onClick={() => setMenuOpen(false)}>
                  Providers
                </Link>
              </div>
            </div>
          ) : null}
        </header>

        <main style={{ flex: 1 }}>
          <Component {...pageProps} />
        </main>

        <footer style={footerStyle}>
          <div style={footerInnerStyle}>
            <div>© {new Date().getFullYear()} MedicaidReady</div>

            <div style={footerLinksStyle} aria-label="Legal links">
              <Link href="/privacy" style={footerLinkStyle}>
                Privacy
              </Link>
              <Link href="/terms" style={footerLinkStyle}>
                Terms
              </Link>
              <Link href="/security" style={footerLinkStyle}>
                Security
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}