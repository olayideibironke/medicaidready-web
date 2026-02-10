// app/page.tsx
import Link from "next/link";

export default function HomePage() {
  // Default values for now (you can expand later)
  const state = "MD";
  const provider_type = "home_health";
  const scope = "ORG";

  const href = `/checklist?state=${encodeURIComponent(
    state
  )}&provider_type=${encodeURIComponent(
    provider_type
  )}&scope=${encodeURIComponent(scope)}`;

  return (
    <main style={{ maxWidth: 980, margin: "0 auto", padding: "48px 20px" }}>
      <header style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: 40, fontWeight: 800, margin: 0 }}>
            MedicaidReady
          </h1>
          <p style={{ marginTop: 8, color: "#555" }}>
            Choose a template checklist (read-only for now).
          </p>
        </div>
        <div style={{ alignSelf: "flex-start" }}>
          <Link href="/checklist" style={{ textDecoration: "underline" }}>
            Go to checklist
          </Link>
        </div>
      </header>

      <section
        style={{
          marginTop: 28,
          border: "1px solid #eee",
          borderRadius: 16,
          padding: 20,
          background: "#fff",
        }}
      >
        <h2 style={{ margin: 0, fontSize: 18 }}>Quick start</h2>
        <p style={{ marginTop: 8, color: "#555" }}>
          Default template: <b>MD</b> / <b>home_health</b> / <b>ORG</b>
        </p>

        <div style={{ marginTop: 14 }}>
          <Link
            href={href}
            style={{
              display: "inline-block",
              padding: "10px 14px",
              borderRadius: 12,
              border: "1px solid #111",
              background: "#111",
              color: "#fff",
              textDecoration: "none",
              fontWeight: 700,
            }}
          >
            Open checklist →
          </Link>
        </div>
      </section>
    </main>
  );
}
