import Head from "next/head";
import Link from "next/link";

export default function CheckoutCancel() {
  return (
    <>
      <Head>
        <title>Payment canceled | MedicaidReady</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main style={{ maxWidth: 860, margin: "0 auto", padding: 24, fontFamily: "system-ui, sans-serif" }}>
        <h1 style={{ margin: 0 }}>Payment canceled</h1>
        <p style={{ marginTop: 10, color: "#444", lineHeight: 1.6 }}>
          No charge was made. You can try again any time.
        </p>

        <div style={{ marginTop: 18, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link
            href="/pricing"
            style={{
              padding: "10px 12px",
              borderRadius: 12,
              border: "1px solid #0b3a66",
              background: "#0b3a66",
              color: "white",
              textDecoration: "none",
              fontWeight: 700,
            }}
          >
            Back to Pricing
          </Link>

          <Link
            href="/"
            style={{
              padding: "10px 12px",
              borderRadius: 12,
              border: "1px solid #d7dce6",
              background: "white",
              color: "#111",
              textDecoration: "none",
              fontWeight: 700,
            }}
          >
            Return home
          </Link>
        </div>
      </main>
    </>
  );
}
