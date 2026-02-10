// app/checklist/page.tsx
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { type RequirementRow, mapRequirementRow } from "@/lib/requirementsModel";
import { labelForProviderType, labelForScope, labelForState } from "@/lib/options";
import ChecklistClient from "@/app/checklist/ChecklistClient";
import DownloadPdfButton from "./DownloadPdfButton";

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

export default async function ChecklistPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;

  const requested = {
    state: normalizeState(sp.state),
    provider_type: normalizeProviderType(sp.provider_type),
    scope: normalizeScope(sp.scope),
  };

  const defaults = {
    state: "MD",
    provider_type: "home_health",
    scope: "ORG",
  };

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

  const displayState = labelForState(final.state);
  const displayProviderType = labelForProviderType(final.provider_type);
  const displayScope = labelForScope(final.scope);

  const storageKey = `medicaidready_progress:${final.state}:${final.provider_type}:${final.scope}`;

  return (
    <main className="mr-print-page" style={{ maxWidth: 980, margin: "0 auto", padding: "44px 20px" }}>
      <style>{`
        @media print {
          .mr-print-page { padding: 0 !important; margin: 0 !important; }
          .mr-print-hide { display: none !important; }
        }
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
        <div>
          <h1 style={{ fontSize: 40, fontWeight: 850, margin: 0 }}>
            MedicaidReady Checklist
          </h1>
          <p style={{ marginTop: 10, color: "#555" }}>
            Checklist for <b>{displayState}</b> / <b>{displayProviderType}</b> / <b>{displayScope}</b>.
          </p>
        </div>

        <div className="mr-print-hide" style={{ display: "flex", gap: 12 }}>
          <DownloadPdfButton />
          <Link href="/" style={{ textDecoration: "underline" }}>
            Home
          </Link>
        </div>
      </header>

      <ChecklistClient items={items} storageKey={storageKey} />
    </main>
  );
}
