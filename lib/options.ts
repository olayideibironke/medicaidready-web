// lib/options.ts
import { supabase } from "@/lib/supabaseClient";

export type StateCode = string;
export type ProviderType = string;
export type Scope = string;

export type OptionItem<T extends string = string> = {
  value: T;
  label: string;
};

export const DEFAULTS = {
  state: "MD" as StateCode,
  provider_type: "home_health" as ProviderType,
  scope: "ORG" as Scope,
};

export const FALLBACK_STATE_OPTIONS: OptionItem<StateCode>[] = [
  { value: "MD", label: "Maryland (MD)" },
  { value: "DC", label: "Washington, DC (DC)" },
  { value: "VA", label: "Virginia (VA)" },
];

export const FALLBACK_PROVIDER_TYPE_OPTIONS: OptionItem<ProviderType>[] = [
  { value: "home_health", label: "Home Health" },
  { value: "personal_care", label: "Personal Care" }, // ✅ added
  { value: "behavioral_health", label: "Behavioral Health" },
  { value: "primary_care", label: "Primary Care" },
];

export const FALLBACK_SCOPE_OPTIONS: OptionItem<Scope>[] = [
  { value: "ORG", label: "Organization (ORG)" },
  { value: "INDIVIDUAL", label: "Individual (INDIVIDUAL)" },
];

export function buildChecklistHref(params: {
  state: StateCode;
  provider_type: ProviderType;
  scope: Scope;
}) {
  const { state, provider_type, scope } = params;
  return `/checklist?state=${encodeURIComponent(
    state
  )}&provider_type=${encodeURIComponent(
    provider_type
  )}&scope=${encodeURIComponent(scope)}`;
}

// Exported: use these for display labels anywhere in the UI
export function titleize(value: string) {
  // home_health -> Home Health
  return value
    .replace(/[_-]+/g, " ")
    .trim()
    .split(/\s+/)
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

export function labelForState(code: string) {
  const upper = code.toUpperCase();
  if (upper === "MD") return "Maryland (MD)";
  if (upper === "DC") return "Washington, DC (DC)";
  if (upper === "VA") return "Virginia (VA)";
  return `${upper}`;
}

export function labelForScope(scope: string) {
  const upper = scope.toUpperCase();
  if (upper === "ORG") return "Organization (ORG)";
  if (upper === "INDIVIDUAL") return "Individual (INDIVIDUAL)";
  return upper;
}

// Friendly label for provider_type code (snake_case -> Title Case)
export function labelForProviderType(providerType: string) {
  return titleize(providerType);
}

function uniqSorted(values: string[]) {
  return Array.from(new Set(values.filter(Boolean))).sort((a, b) =>
    a.localeCompare(b)
  );
}

/**
 * Loads dropdown options by scanning rows in a single table that contains:
 * - state
 * - provider_type
 * - scope
 *
 * This is intentionally defensive:
 * - If table is missing / columns missing / query fails => return null (caller falls back)
 */
export async function loadOptionsFromSupabase(tableName?: string) {
  if (!tableName) return null;

  try {
    const { data, error } = await supabase
      .from(tableName)
      .select("state,provider_type,scope")
      .limit(1000);

    if (error || !data || data.length === 0) return null;

    const states = uniqSorted(data.map((r: any) => (r?.state ?? "").toString()));
    const providerTypes = uniqSorted(
      data.map((r: any) => (r?.provider_type ?? "").toString())
    );
    const scopes = uniqSorted(data.map((r: any) => (r?.scope ?? "").toString()));

    if (states.length === 0 || providerTypes.length === 0 || scopes.length === 0)
      return null;

    const stateOptions: OptionItem<StateCode>[] = states.map((s) => ({
      value: s,
      label: labelForState(s),
    }));

    const providerTypeOptions: OptionItem<ProviderType>[] = providerTypes.map(
      (p) => ({
        value: p,
        label: labelForProviderType(p),
      })
    );

    const scopeOptions: OptionItem<Scope>[] = scopes.map((s) => ({
      value: s,
      label: labelForScope(s),
    }));

    return { stateOptions, providerTypeOptions, scopeOptions };
  } catch {
    return null;
  }
}
