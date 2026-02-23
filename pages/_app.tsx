import type { AppProps } from "next/app";
import Head from "next/head";
import Link from "next/link";

export default function MyApp({ Component, pageProps }: AppProps) {
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
    gap: 14,
    flexWrap: "wrap",
  };

  const brandStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    textDecoration: "none",
    color: "#0b1220",
    fontWeight: 900,
    letterSpacing: -0.2,
  };

  const navStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
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
  };

  const primaryLinkStyle: React.CSSProperties = {
    ...navLinkStyle,
    color: "#ffffff",
    border: "1px solid rgba(11, 58, 102, 0.35)",
    background: "linear-gradient(135deg, #0b3a66, #0f6aa6)",
    boxShadow: "0 10px 22px rgba(11, 18, 32, 0.10)",
  };

  const mainStyle: React.CSSProperties = {
    flex: 1,
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

      <div style={shellStyle}>
        <header style={headerStyle}>
          <div style={headerInnerStyle}>
            <Link href="/" style={brandStyle} aria-label="MedicaidReady Home">
              <span style={{ fontSize: 16 }}>MedicaidReady</span>
            </Link>

            <nav style={navStyle} aria-label="Primary navigation">
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
          </div>
        </header>

        <main style={mainStyle}>
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