import Head from "next/head";
import Link from "next/link";

export default function PagesAppRoute() {
  return (
    <>
      <Head>
        <title>MedicaidReady</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          padding: 24,
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
          background: "#ffffff",
          color: "#0b1220",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 640,
            border: "1px solid rgba(15, 23, 42, 0.10)",
            borderRadius: 16,
            padding: 18,
            boxShadow: "0 10px 30px rgba(2, 6, 23, 0.08)",
            background: "#fff",
          }}
        >
          <div style={{ fontWeight: 900, fontSize: 18, letterSpacing: -0.2 }}>MedicaidReady</div>
          <div style={{ marginTop: 8, color: "#475569", lineHeight: 1.6 }}>
            This route exists for legacy reasons. Please use the main site navigation.
          </div>

          <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "10px 12px",
                borderRadius: 999,
                textDecoration: "none",
                fontWeight: 800,
                color: "#ffffff",
                background: "linear-gradient(135deg, #0b3a66, #0f6aa6)",
                border: "1px solid rgba(11, 58, 102, 0.35)",
                boxShadow: "0 10px 22px rgba(11, 18, 32, 0.12)",
              }}
            >
              Go to Home
            </Link>

            <Link
              href="/providers"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "10px 12px",
                borderRadius: 999,
                textDecoration: "none",
                fontWeight: 800,
                color: "#0b1220",
                background: "#ffffff",
                border: "1px solid rgba(15, 23, 42, 0.10)",
              }}
            >
              Providers
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
