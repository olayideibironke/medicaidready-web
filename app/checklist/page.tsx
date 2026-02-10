// app/checklist/page.tsx
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { type RequirementRow, mapRequirementRow } from "@/lib/requirementsModel";
import { labelForProviderType, labelForScope, labelForState } from "@/lib/options";
import ChecklistClient from "@/app/checklist/ChecklistClient";
import DownloadPdfButton from "./DownloadPdfButton";

export const dynamic = "force-dynamic";

// ✅ Fix browser print header title (removes "Create Next App" as the page title)
export const metadata = {
  title: "MedicaidReady Checklist",
};

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
        border: "1px solid #e9e9e9",
        background: "#fff",
        fontSize: 13,
        lineHeight: 1,
        whiteSpace: "nowrap",
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

function slugForFilename(value: string) {
  return value
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9\-]/g, "")
    .replace(/\-+/g, "-");
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

  const allowedStates = uniq((optionRows ?? []).map((r: any) => normalizeState(r?.state)));
  const allowedProviderTypes = uniq(
    (optionRows ?? []).map((r: any) => normalizeProviderType(r?.provider_type))
  );
  const allowedScopes = uniq((optionRows ?? []).map((r: any) => normalizeScope(r?.scope)));

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
      requested.provider_type && canValidate && allowedProviderTypes.includes(requested.provider_type)
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

  // Display labels
  const displayState = labelForState(final.state);
  const displayProviderType = labelForProviderType(final.provider_type);
  const displayScope = labelForScope(final.scope);

  const displayRequested = {
    state: requested.state ? labelForState(requested.state) : "—",
    provider_type: requested.provider_type ? labelForProviderType(requested.provider_type) : "—",
    scope: requested.scope ? labelForScope(requested.scope) : "—",
  };

  // Local progress key (per selection)
  const storageKey = `medicaidready_progress:${final.state}:${final.provider_type}:${final.scope}`;

  // Print metadata + suggested filename
  const now = new Date();
  const dateStamp = now.toISOString().slice(0, 10); // YYYY-MM-DD
  const printedOn = now.toLocaleString("en-US", { timeZone: "America/New_York" });

  const suggestedFilename = `MedicaidReady-${slugForFilename(displayState)}-${slugForFilename(
    displayProviderType
  )}-${slugForFilename(displayScope)}-${dateStamp}.pdf`;

  return (
    <main className="mr-print-page" style={{ maxWidth: 980, margin: "0 auto", padding: "44px 20px" }}>
      {/* Server-safe print CSS */}
      <style>{`
        @media print {
          .mr-print-page { max-width: none !important; padding: 0 !important; margin: 0 !important; }
          .mr-print-hide { display: none !important; }
          .mr-print-only { display: block !important; }

          html, body { background: #fff !important; }
          * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }

          .mr-print-header { margin-bottom: 10px !important; }
          .mr-print-hr { margin: 14px 0 !important; }
        }

        /* Default (screen): print-only hidden */
        .mr-print-only { display: none; }
      `}</style>

      <header
        className="mr-print-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 16,
          alignItems: "flex-start",
        }}
      >
        <div style={{ minWidth: 0 }}>
          <h1 style={{ fontSize: 40, fontWeight: 850 as any, margin: 0 }}>MedicaidReady Checklist</h1>

          <p style={{ marginTop: 10, color: "#555", lineHeight: 1.5 }}>
            Checklist for <b>{displayState}</b> / <b>{displayProviderType}</b> / <b>{displayScope}</b>.
          </p>

          <div
            style={{
              marginTop: 14,
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            {pill(`State: ${displayState}`)}
            {pill(`Provider: ${displayProviderType}`)}
            {pill(`Scope: ${displayScope}`)}
            {pill(`Items: ${items.length}`)}

            {wasNormalized ? (
              <span style={{ color: "#777", fontSize: 13 }}>
                Normalized from{" "}
                <code
                  style={{
                    background: "#f6f6f6",
                    padding: "2px 6px",
                    borderRadius: 8,
                  }}
                >
                  {displayRequested.state}/{displayRequested.provider_type}/{displayRequested.scope}
                </code>
              </span>
            ) : null}

            {optionsError ? (
              <span style={{ color: "#777", fontSize: 13 }}>
                (Options validation unavailable — using safe defaults.)
              </span>
            ) : null}
          </div>

          {/* Print-only metadata line */}
          <div className="mr-print-only" style={{ marginTop: 10, fontSize: 12, color: "#666" }}>
            Printed on: {printedOn}
          </div>
        </div>

        {/* Screen-only controls + filename guidance */}
        <div
          className="mr-print-hide"
          style={{
            alignSelf: "flex-start",
            whiteSpace: "nowrap",
            display: "flex",
            flexDirection: "column",
            gap: 8,
            alignItems: "flex-end",
          }}
        >
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <DownloadPdfButton />
            <Link href="/" style={{ textDecoration: "underline" }}>
              Home
            </Link>
          </div>

          <div style={{ maxWidth: 420, textAlign: "right", fontSize: 12, color: "#666", lineHeight: 1.35 }}>
            Tip: In the print dialog, choose <b>Save as PDF</b>, and turn <b>Headers and footers</b> OFF. Name it:
            <div style={{ marginTop: 4 }}>
              <code style={{ background: "#f6f6f6", padding: "2px 6px", borderRadius: 8 }}>
                {suggestedFilename}
              </code>
            </div>
          </div>
        </div>
      </header>

      <hr
        className="mr-print-hr"
        style={{
          margin: "26px 0",
          border: "none",
          borderTop: "1px solid #eee",
        }}
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

      <ChecklistClient items={items} storageKey={storageKey} />
    </main>
  );
}
