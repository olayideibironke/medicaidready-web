// app/checklist/page.tsx
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import {
  type RequirementRow,
  mapRequirementRow,
  groupByCategory,
} from "@/lib/requirementsModel";

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

function normalizeState(value?: string) {
  const v = (value ?? "").trim();
  if (!v) return "";
  return v.toUpperCase();
}

function normalizeProviderType(value?: string) {
  const v = (value ?? "").trim();
  if (!v) return "";
  return v.toLowerCase();
}

function normalizeScope(value?: string) {
  const v = (value ?? "").trim();
  if (!v) return "";
  return v.toUpperCase();
}

function uniq(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

export default async function ChecklistPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;

  // Requested (normalized)
  const requested = {
    state: normalizeState(sp.state),
    provider_type: normalizeProviderType(sp.provider_type),
    scope: normalizeScope(sp.scope),
  };

  // Defaults (normalized)
  const defaults = {
    state: "MD",
    provider_type: "home_health",
    scope: "ORG",
  };

  /**
   * Validate against actual DB values (read-only).
   * If this fails for any reason, we still render using defaults.
   */
  const { data: optionRows, error: optionsError } = await supabase
    .from("requirements")
    .select("state,provider_type,scope")
    .limit(1000);

  const allowedStates = uniq(
    (optionRows ?? []).map((r: any) => normalizeState(r?.state))
  );
  const allowedProviderTypes = uniq(
    (optionRows ?? []).map((r: any) =>
      normalizeProviderType(r?.provider_type)
    )
  );
  const allowedScopes = uniq(
    (optionRows ?? []).map((r: any) => normalizeScope(r?.scope))
  );

  const canValidate =
    !optionsError &&
    allowedStates.length > 0 &&
    allowedProviderTypes.length > 0 &&
    allowedScopes.length > 0;

  const final = {
    state:
      requested.state && canValidate && allowedStates.includes(requested.state)
        ? requested.state
        : defaults.state,
    provider_type:
      requested.provider_type &&
      canValidate &&
      allowedProviderTypes.includes(requested.provider_type)
        ? requested.provider_type
        : defaults.provider_type,
    scope:
      requested.scope && canValidate && allowedScopes.includes(requested.scope)
        ? requested.scope
        : defaults.scope,
  };

  const wasNormalized =
    (requested.state && requested.state !== final.state) ||
    (requested.provider_type && requested.provider_type !== final.provider_type) ||
    (requested.scope && requested.scope !== final.scope);

  // Fetch requirements
  const { data, error } = await supabase
    .from("requirements")
    .select("*")
    .eq("state", final.state)
    .eq("provider_type", final.provider_type)
    .eq("scope", final.scope)
    .order("category", { ascending: true })
    .order("sort_order", { ascending: true });

  const rows = (data ?? []) as RequirementRow[];
  const items = rows.map(mapRequirementRow);
  const groups = groupByCategory(items);

  return (
    <main style={{ maxWidth: 980, margin: "0 auto", padding: "48px 20px" }}>
      <header style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: 40, fontWeight: 800, margin: 0 }}>
            MedicaidReady Checklist
          </h1>

          <p style={{ marginTop: 8, color: "#555" }}>
            Read-only template checklist for <b>{final.state}</b> /{" "}
            <b>{final.provider_type}</b> / <b>{final.scope}</b>.
          </p>

          <div
            style={{
              marginTop: 14,
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            {pill(`State: ${final.state}`)}
            {pill(`Provider type: ${final.provider_type}`)}
            {pill(`Scope: ${final.scope}`)}
            {pill(`Items: ${items.length}`)}

            {wasNormalized ? (
              <span style={{ color: "#777", fontSize: 13 }}>
                Normalized from{" "}
                <code>
                  {requested.state || "—"}/{requested.provider_type || "—"}/
                  {requested.scope || "—"}
                </code>
              </span>
            ) : null}
          </div>

          {optionsError ? (
            <div style={{ marginTop: 10, color: "#777", fontSize: 13 }}>
              (Options validation unavailable — using safe defaults.)
            </div>
          ) : null}
        </div>

        <div style={{ alignSelf: "flex-start" }}>
          <Link href="/" style={{ textDecoration: "underline" }}>
            Home
          </Link>
        </div>
      </header>

      <hr
        style={{ margin: "26px 0", border: "none", borderTop: "1px solid #eee" }}
      />

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
          No checklist items found for <b>{final.state}</b> /{" "}
          <b>{final.provider_type}</b> / <b>{final.scope}</b>.
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
                {rows.map((item) => (
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
                    <div
                      style={{ display: "flex", gap: 10, alignItems: "center" }}
                    >
                      <input type="checkbox" disabled />
                      <div style={{ fontSize: 18, fontWeight: 800 }}>
                        {item.title}
                      </div>
                      {item.isRequired ? (
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
                      {item.renewalRule
                        ? pill(`Renewal: ${item.renewalRule}`)
                        : null}
                      {typeof item.dueDaysBeforeExpiry === "number"
                        ? pill(`Alert: ${item.dueDaysBeforeExpiry} days`)
                        : null}
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
