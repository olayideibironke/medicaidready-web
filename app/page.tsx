// app/page.tsx
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

/**
 * Step 2: Add dropdown UI (state, provider type, scope)
 * - Builds the /checklist link dynamically from selections
 * - Checklist remains read-only (handled on /checklist)
 */

type StateCode = "MD" | "DC" | "VA";
type ProviderType = "home_health" | "behavioral_health" | "primary_care";
type Scope = "ORG" | "INDIVIDUAL";

const STATE_OPTIONS: Array<{ value: StateCode; label: string }> = [
  { value: "MD", label: "Maryland (MD)" },
  { value: "DC", label: "Washington, DC (DC)" },
  { value: "VA", label: "Virginia (VA)" },
];

const PROVIDER_TYPE_OPTIONS: Array<{ value: ProviderType; label: string }> = [
  { value: "home_health", label: "Home Health" },
  { value: "behavioral_health", label: "Behavioral Health" },
  { value: "primary_care", label: "Primary Care" },
];

const SCOPE_OPTIONS: Array<{ value: Scope; label: string }> = [
  { value: "ORG", label: "Organization (ORG)" },
  { value: "INDIVIDUAL", label: "Individual (INDIVIDUAL)" },
];

const DEFAULTS = {
  state: "MD" as StateCode,
  provider_type: "home_health" as ProviderType,
  scope: "ORG" as Scope,
};

function buildChecklistHref(params: {
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

export default function HomePage() {
  const [state, setState] = useState<StateCode>(DEFAULTS.state);
  const [providerType, setProviderType] = useState<ProviderType>(
    DEFAULTS.provider_type
  );
  const [scope, setScope] = useState<Scope>(DEFAULTS.scope);

  const href = useMemo(
    () =>
      buildChecklistHref({
        state,
        provider_type: providerType,
        scope,
      }),
    [state, providerType, scope]
  );

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
          Pick options below, then open the generated checklist.
        </p>

        {/* Selectors */}
        <div
          style={{
            marginTop: 14,
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 12,
          }}
        >
          <div>
            <label
              htmlFor="state"
              style={{ display: "block", fontWeight: 700, marginBottom: 6 }}
            >
              State
            </label>
            <select
              id="state"
              value={state}
              onChange={(e) => setState(e.target.value as StateCode)}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 12,
                border: "1px solid #ddd",
                background: "#fff",
                fontWeight: 600,
              }}
            >
              {STATE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="provider_type"
              style={{ display: "block", fontWeight: 700, marginBottom: 6 }}
            >
              Provider Type
            </label>
            <select
              id="provider_type"
              value={providerType}
              onChange={(e) =>
                setProviderType(e.target.value as ProviderType)
              }
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 12,
                border: "1px solid #ddd",
                background: "#fff",
                fontWeight: 600,
              }}
            >
              {PROVIDER_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="scope"
              style={{ display: "block", fontWeight: 700, marginBottom: 6 }}
            >
              Scope
            </label>
            <select
              id="scope"
              value={scope}
              onChange={(e) => setScope(e.target.value as Scope)}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 12,
                border: "1px solid #ddd",
                background: "#fff",
                fontWeight: 600,
              }}
            >
              {SCOPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Preview + action */}
        <div
          style={{
            marginTop: 14,
            padding: 14,
            borderRadius: 12,
            border: "1px solid #f0f0f0",
            background: "#fafafa",
          }}
        >
          <div style={{ color: "#555" }}>
            Current selection: <b>{state}</b> / <b>{providerType}</b> /{" "}
            <b>{scope}</b>
          </div>
          <div style={{ marginTop: 6, color: "#777", fontSize: 13 }}>
            Generated URL: <code>{href}</code>
          </div>

          <div style={{ marginTop: 12 }}>
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
        </div>
      </section>
    </main>
  );
}
