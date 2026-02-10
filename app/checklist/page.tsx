// app/checklist/page.tsx
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export const dynamic = "force-dynamic";

type SearchParams = {
  state?: string;
  provider_type?: string;
  scope?: string;
};

function pill(label: string) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "6px 10px",
        borderRadius: 999,
        border: "1px solid #e6e6e6",
        background: "#fff",
        fontSize: 13,
      }}
    >
      {label}
    </span>
  );
}

export default async function ChecklistPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;

  const state = (sp.state || "MD").toUpperCase();
  const provider_type = sp.provider_type || "home_health";
  const scope = (sp.scope || "ORG").toUpperCase();

  const { data, error } = await supabase
    .from("requirements")
    .select("*")
    .eq("state", state)
    .eq("provider_type", provider_type)
    .eq("scope", scope)
    .order("category", { ascending: true })
    .order("sort_order", { ascending: true });

  const items = data ?? [];

  // Group by category
  const groups = items.reduce((acc: Record<string, any[]>, item: any) => {
    const key = item.category || "General";
    acc[key] = acc[key] || [];
    acc[key].push(item);
    return acc;
  }, {});

  return (
    <main style={{ maxWidth: 980, margin: "0 auto", padding: "48px 20px" }}>
      <header style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: 40, fontWeight: 800, margin: 0 }}>
            MedicaidReady Checklist
          </h1>
          <p style={{ marginTop: 8, color: "#555" }}>
            Read-only template checklist for Maryland Home Health (Agency-level).
          </p>

          <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
            {pill(`State: ${state}`)}
            {pill(`Provider type: ${provider_type}`)}
            {pill(`Scope: ${scope}`)}
            {pill(`Items: ${items.length}`)}
          </div>
        </div>

        <div style={{ alignSelf: "flex-start" }}>
          <Link href="/" style={{ textDecoration: "underline" }}>
            Home
          </Link>
        </div>
      </header>

      <hr style={{ margin: "26px 0", border: "none", borderTop: "1px solid #eee" }} />

      {error ? (
        <div
          style={{
            border: "1px solid #ffd7d7",
            background: "#fff5f5",
            padding: 16,
            borderRadius: 12,
            color: "#8a1f1f",
          }}
        >
          <b>Supabase error:</b> {error.message}
        </div>
      ) : null}

      {Object.keys(groups).length === 0 ? (
        <div style={{ color: "#666" }}>
          No checklist items found for <b>{state}</b> / <b>{provider_type}</b> /{" "}
          <b>{scope}</b>.
        </div>
      ) : (
        <div style={{ display: "grid", gap: 18 }}>
          {Object.entries(groups).map(([category, rows]) => (
            <section
              key={category}
              style={{
                border: "1px solid #eee",
                borderRadius: 18,
                padding: 18,
                background: "#fff",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h2 style={{ margin: 0, fontSize: 26, fontWeight: 800 }}>
                  {category}
                </h2>
                <div style={{ color: "#666", fontSize: 14 }}>
                  {rows.length} items
                </div>
              </div>

              <div style={{ marginTop: 14, display: "grid", gap: 14 }}>
                {rows.map((item: any) => (
                  <div
                    key={item.id}
                    style={{
                      border: "1px solid #efefef",
                      borderRadius: 16,
                      padding: 16,
                      display: "grid",
                      gap: 6,
                    }}
                  >
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <input type="checkbox" disabled />
                      <div style={{ fontSize: 18, fontWeight: 800 }}>
                        {item.title}
                      </div>
                      {item.required ? (
                        <span
                          style={{
                            marginLeft: 6,
                            fontSize: 12,
                            fontWeight: 800,
                            background: "#111",
                            color: "#fff",
                            padding: "3px 8px",
                            borderRadius: 999,
                          }}
                        >
                          Required
                        </span>
                      ) : null}
                    </div>

                    {item.description ? (
                      <div style={{ color: "#444", marginLeft: 28 }}>
                        {item.description}
                      </div>
                    ) : null}

                    <div
                      style={{
                        display: "flex",
                        gap: 10,
                        flexWrap: "wrap",
                        marginLeft: 28,
                        marginTop: 6,
                      }}
                    >
                      {item.renewal_frequency ? pill(`Renewal: ${item.renewal_frequency}`) : null}
                      {item.alert_days ? pill(`Alert: ${item.alert_days} days`) : null}
                      {item.authority ? pill(item.authority) : null}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}
