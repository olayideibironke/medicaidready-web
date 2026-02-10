// app/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  DEFAULTS,
  type OptionItem,
  type ProviderType,
  type Scope,
  type StateCode,
  FALLBACK_PROVIDER_TYPE_OPTIONS,
  FALLBACK_SCOPE_OPTIONS,
  FALLBACK_STATE_OPTIONS,
  buildChecklistHref,
  loadOptionsFromSupabase,
} from "@/lib/options";

/**
 * Home now supports URL-driven selections:
 *   /?state=MD&provider_type=home_health&scope=ORG
 *
 * Behavior:
 * - Attempts to initialize dropdowns from URL params
 * - Validates against loaded option lists (Supabase or fallback)
 * - Falls back to DEFAULTS when params are missing/invalid
 */

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

export default function HomePage() {
  const [state, setState] = useState<StateCode>(DEFAULTS.state);
  const [providerType, setProviderType] = useState<ProviderType>(
    DEFAULTS.provider_type
  );
  const [scope, setScope] = useState<Scope>(DEFAULTS.scope);

  const [stateOptions, setStateOptions] = useState<OptionItem<StateCode>[]>(
    FALLBACK_STATE_OPTIONS
  );
  const [providerTypeOptions, setProviderTypeOptions] = useState<
    OptionItem<ProviderType>[]
  >(FALLBACK_PROVIDER_TYPE_OPTIONS);
  const [scopeOptions, setScopeOptions] = useState<OptionItem<Scope>[]>(
    FALLBACK_SCOPE_OPTIONS
  );

  const [optionsStatus, setOptionsStatus] = useState<
    "idle" | "loading" | "loaded" | "fallback"
  >("idle");

  const [hydratedFromUrl, setHydratedFromUrl] = useState(false);
  const [normalizedNote, setNormalizedNote] = useState<string | null>(null);

  // 1) Load options (Supabase if available, otherwise fallback)
  useEffect(() => {
    let cancelled = false;

    async function run() {
      setOptionsStatus("loading");

      const table = process.env.NEXT_PUBLIC_OPTIONS_SOURCE_TABLE;
      const result = await loadOptionsFromSupabase(table);

      if (cancelled) return;

      if (!result) {
        setOptionsStatus("fallback");
        return;
      }

      setStateOptions(result.stateOptions);
      setProviderTypeOptions(result.providerTypeOptions);
      setScopeOptions(result.scopeOptions);
      setOptionsStatus("loaded");
    }

    run();

    return () => {
      cancelled = true;
    };
  }, []);

  // 2) Hydrate selections from URL ONCE (after options are available)
  useEffect(() => {
    if (hydratedFromUrl) return;

    // We can hydrate as soon as we have *some* options (fallback or loaded)
    if (optionsStatus !== "loaded" && optionsStatus !== "fallback") return;

    const params = new URLSearchParams(window.location.search);

    const requested = {
      state: normalizeState(params.get("state") ?? undefined),
      provider_type: normalizeProviderType(params.get("provider_type") ?? undefined),
      scope: normalizeScope(params.get("scope") ?? undefined),
    };

    // Validate against current option lists
    const stateAllowed = stateOptions.some((o) => o.value === requested.state);
    const providerAllowed = providerTypeOptions.some(
      (o) => o.value === requested.provider_type
    );
    const scopeAllowed = scopeOptions.some((o) => o.value === requested.scope);

    const final = {
      state: requested.state && stateAllowed ? requested.state : DEFAULTS.state,
      provider_type:
        requested.provider_type && providerAllowed
          ? requested.provider_type
          : DEFAULTS.provider_type,
      scope: requested.scope && scopeAllowed ? requested.scope : DEFAULTS.scope,
    };

    // Apply
    setState(final.state);
    setProviderType(final.provider_type);
    setScope(final.scope);

    // Note if the URL had values but they were adjusted
    const urlHadAny =
      Boolean(requested.state) ||
      Boolean(requested.provider_type) ||
      Boolean(requested.scope);

    const changed =
      (requested.state && requested.state !== final.state) ||
      (requested.provider_type && requested.provider_type !== final.provider_type) ||
      (requested.scope && requested.scope !== final.scope);

    if (urlHadAny && changed) {
      setNormalizedNote(
        `Normalized from ${requested.state || "—"}/${requested.provider_type || "—"}/${
          requested.scope || "—"
        }`
      );
    } else {
      setNormalizedNote(null);
    }

    setHydratedFromUrl(true);
  }, [
    hydratedFromUrl,
    optionsStatus,
    stateOptions,
    providerTypeOptions,
    scopeOptions,
  ]);

  const href = useMemo(
    () =>
      buildChecklistHref({
        state,
        provider_type: providerType,
        scope,
      }),
    [state, providerType, scope]
  );

  const homeShareHref = useMemo(() => {
    return `/?state=${encodeURIComponent(state)}&provider_type=${encodeURIComponent(
      providerType
    )}&scope=${encodeURIComponent(scope)}`;
  }, [state, providerType, scope]);

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

        <div style={{ marginTop: 10, fontSize: 13, color: "#777" }}>
          {optionsStatus === "loading" && "Loading options…"}
          {optionsStatus === "loaded" && "Options loaded from Supabase."}
          {optionsStatus === "fallback" &&
            "Using fallback options (Supabase options unavailable)."}
          {normalizedNote ? (
            <span style={{ marginLeft: 10 }}>
              <code>{normalizedNote}</code>
            </span>
          ) : null}
        </div>

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
              {stateOptions.map((opt) => (
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
              {providerTypeOptions.map((opt) => (
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
              {scopeOptions.map((opt) => (
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
            Checklist URL: <code>{href}</code>
          </div>

          <div style={{ marginTop: 6, color: "#777", fontSize: 13 }}>
            Shareable Home URL: <code>{homeShareHref}</code>
          </div>

          <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
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

            <Link
              href={homeShareHref}
              style={{
                display: "inline-block",
                padding: "10px 14px",
                borderRadius: 12,
                border: "1px solid #111",
                background: "#fff",
                color: "#111",
                textDecoration: "none",
                fontWeight: 700,
              }}
            >
              Open this selection on Home →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
