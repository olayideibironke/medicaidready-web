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

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setOptionsStatus("loading");

      const table = process.env.NEXT_PUBLIC_OPTIONS_SOURCE_TABLE;
      const result = await loadOptionsFromSupabase(table);

      if (cancelled) return;

      if (!result) {
        // Silent fallback
        setOptionsStatus("fallback");
        return;
      }

      setStateOptions(result.stateOptions);
      setProviderTypeOptions(result.providerTypeOptions);
      setScopeOptions(result.scopeOptions);

      // If current selection isn't present in fetched options, reset to defaults
      if (!result.stateOptions.some((o) => o.value === state)) {
        setState(DEFAULTS.state);
      }
      if (!result.providerTypeOptions.some((o) => o.value === providerType)) {
        setProviderType(DEFAULTS.provider_type);
      }
      if (!result.scopeOptions.some((o) => o.value === scope)) {
        setScope(DEFAULTS.scope);
      }

      setOptionsStatus("loaded");
    }

    run();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

        {/* status (subtle + non-blocking) */}
        <div style={{ marginTop: 10, fontSize: 13, color: "#777" }}>
          {optionsStatus === "loading" && "Loading options…"}
          {optionsStatus === "loaded" && "Options loaded from Supabase."}
          {optionsStatus === "fallback" &&
            "Using fallback options (Supabase options unavailable)."}
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
