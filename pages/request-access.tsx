// pages/request-access.tsx
import Head from "next/head";
import Link from "next/link";
import { useMemo, useState } from "react";

type SubmitState = "idle" | "submitting" | "success" | "error";

export default function RequestAccessPage() {
  // NOTE: Backend logic preserved: submit via POST to the same API route a Request Access page typically uses.
  // If your project already has this route, this keeps behavior stable.
  const API_ENDPOINT = "/api/request-access";

  const [fullName, setFullName] = useState("");
  const [workEmail, setWorkEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [roleTitle, setRoleTitle] = useState("");
  const [stateCode, setStateCode] = useState("");
  const [notes, setNotes] = useState("");

  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const canSubmit = useMemo(() => {
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(workEmail.trim());
    return emailOk && submitState !== "submitting";
  }, [workEmail, submitState]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setSubmitState("submitting");
    setErrorMessage("");

    try {
      // Keep payload simple & predictable (email is primary). Optional fields included only if present.
      const payload: Record<string, string> = {
        email: workEmail.trim(),
      };

      const n = fullName.trim();
      const o = organization.trim();
      const r = roleTitle.trim();
      const s = stateCode.trim();
      const msg = notes.trim();

      if (n) payload.name = n;
      if (o) payload.organization = o;
      if (r) payload.role = r;
      if (s) payload.state = s;
      if (msg) payload.message = msg;

      const res = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        // Try to read a meaningful error without depending on any particular backend response shape.
        let detail = "";
        try {
          const data = await res.json();
          detail =
            typeof data?.error === "string"
              ? data.error
              : typeof data?.message === "string"
              ? data.message
              : "";
        } catch {
          // ignore
        }
        throw new Error(detail || "Request failed. Please try again.");
      }

      setSubmitState("success");
    } catch (err: any) {
      setSubmitState("error");
      setErrorMessage(err?.message || "Something went wrong. Please try again.");
    }
  }

  return (
    <>
      <Head>
        <title>Request Access • MedicaidReady</title>
        <meta
          name="description"
          content="Request access to MedicaidReady. Submit your work email and we’ll follow up."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-[#070A12] text-white">
        {/* Premium background accents */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-fuchsia-500/10 blur-3xl" />
          <div className="absolute -bottom-56 right-[-140px] h-[520px] w-[520px] rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(60%_40%_at_50%_0%,rgba(255,255,255,0.08),rgba(255,255,255,0)_65%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.0),rgba(0,0,0,0.25),rgba(0,0,0,0.55))]" />
        </div>

        {/* Header / Nav (premium + consistent) */}
        <header className="sticky top-0 z-40 border-b border-white/10 bg-black/25 backdrop-blur-xl">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
            <Link href="/" className="group inline-flex items-center gap-2">
              <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/5 shadow-[0_0_0_1px_rgba(255,255,255,0.04)]">
                <span className="h-4 w-4 rounded-md bg-gradient-to-br from-fuchsia-400 to-cyan-300 shadow-[0_0_24px_rgba(217,70,239,0.22)]" />
              </span>
              <span className="flex flex-col leading-tight">
                <span className="text-sm font-semibold tracking-wide">
                  MedicaidReady
                </span>
                <span className="text-xs text-white/60">
                  Provider intelligence
                </span>
              </span>
              <span className="sr-only">Go to home</span>
            </Link>

            <nav className="hidden items-center gap-2 sm:flex">
              <Link
                href="/pricing"
                className="rounded-xl px-3 py-2 text-sm text-white/75 hover:text-white hover:bg-white/5 transition"
              >
                Pricing
              </Link>
              <Link
                href="/request-access"
                className="rounded-xl px-3 py-2 text-sm text-white hover:bg-white/5 transition"
                aria-current="page"
              >
                Request Access
              </Link>

              <div className="ml-2 h-6 w-px bg-white/10" />

              <Link
                href="/pricing"
                className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-white/90 transition shadow-[0_10px_30px_rgba(255,255,255,0.10)]"
              >
                View Plans
              </Link>
            </nav>

            <div className="sm:hidden">
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center rounded-xl bg-white px-3 py-2 text-sm font-semibold text-black hover:bg-white/90 transition"
              >
                Pricing
              </Link>
            </div>
          </div>
        </header>

        <main className="relative">
          <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
            <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
              {/* Left: headline + trust bullets */}
              <section className="lg:col-span-5">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.35)]" />
                  Access is reviewed within 1–2 business days
                </div>

                <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
                  Request Access
                </h1>
                <p className="mt-3 text-sm leading-6 text-white/70 sm:text-base">
                  MedicaidReady is a premium provider analytics experience. Submit
                  your details and we’ll confirm next steps.
                </p>

                <div className="mt-8 space-y-3">
                  <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-black/20">
                      <span className="text-lg">🔒</span>
                    </span>
                    <div>
                      <p className="text-sm font-semibold">Secure by design</p>
                      <p className="mt-1 text-sm text-white/70">
                        Your info is used only to evaluate access. No spam.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-black/20">
                      <span className="text-lg">⚡</span>
                    </span>
                    <div>
                      <p className="text-sm font-semibold">Fast onboarding</p>
                      <p className="mt-1 text-sm text-white/70">
                        Once approved, you’ll be guided into your plan and workspace.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-black/20">
                      <span className="text-lg">📈</span>
                    </span>
                    <div>
                      <p className="text-sm font-semibold">Premium insights</p>
                      <p className="mt-1 text-sm text-white/70">
                        Risk signals, issues, and provider profiles in one place.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 text-sm text-white/60">
                  Already evaluating plans?{" "}
                  <Link href="/pricing" className="text-white hover:underline">
                    Compare Pricing
                  </Link>
                </div>
              </section>

              {/* Right: premium form card */}
              <section className="lg:col-span-7">
                <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_18px_60px_rgba(0,0,0,0.45)]">
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_60%_at_20%_0%,rgba(217,70,239,0.12),rgba(255,255,255,0)_55%)]" />
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_60%_at_80%_20%,rgba(34,211,238,0.10),rgba(255,255,255,0)_55%)]" />

                  <div className="relative p-6 sm:p-8">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-lg font-semibold">
                          Access request form
                        </h2>
                        <p className="mt-1 text-sm text-white/70">
                          Use your work email. Optional details help speed approval.
                        </p>
                      </div>
                      <div className="hidden sm:block rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-xs text-white/70">
                        <span className="font-semibold text-white">Tip:</span>{" "}
                        add org + role
                      </div>
                    </div>

                    {/* Alerts */}
                    {submitState === "success" && (
                      <div className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
                        <p className="text-sm font-semibold text-emerald-200">
                          Request received.
                        </p>
                        <p className="mt-1 text-sm text-emerald-100/80">
                          We’ll follow up by email with next steps.
                        </p>
                      </div>
                    )}

                    {submitState === "error" && (
                      <div className="mt-6 rounded-2xl border border-rose-400/20 bg-rose-400/10 p-4">
                        <p className="text-sm font-semibold text-rose-200">
                          Submission failed.
                        </p>
                        <p className="mt-1 text-sm text-rose-100/80">
                          {errorMessage || "Please try again."}
                        </p>
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Field
                          label="Full name (optional)"
                          value={fullName}
                          onChange={setFullName}
                          placeholder="e.g., Olayide Ibironke"
                          autoComplete="name"
                        />
                        <Field
                          label="Work email"
                          value={workEmail}
                          onChange={setWorkEmail}
                          placeholder="name@organization.com"
                          autoComplete="email"
                          required
                        />
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <Field
                          label="Organization (optional)"
                          value={organization}
                          onChange={setOrganization}
                          placeholder="e.g., ACME Health"
                          autoComplete="organization"
                        />
                        <Field
                          label="Role / title (optional)"
                          value={roleTitle}
                          onChange={setRoleTitle}
                          placeholder="e.g., Program Analyst"
                          autoComplete="organization-title"
                        />
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <Field
                          label="Primary state (optional)"
                          value={stateCode}
                          onChange={setStateCode}
                          placeholder="e.g., MD"
                          maxLength={2}
                        />
                        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                          <p className="text-sm font-semibold">What happens next</p>
                          <p className="mt-1 text-sm text-white/70">
                            We review your request and reply with approval or a follow-up question.
                          </p>
                        </div>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-white/85">
                          Notes (optional)
                        </label>
                        <textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          rows={4}
                          className="w-full resize-none rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none ring-0 transition focus:border-white/20 focus:bg-black/35"
                          placeholder="Tell us what you’re trying to do with MedicaidReady (optional)."
                        />
                      </div>

                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <button
                          type="submit"
                          disabled={!canSubmit || submitState === "success"}
                          className={[
                            "inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold transition",
                            "shadow-[0_18px_60px_rgba(255,255,255,0.10)]",
                            submitState === "success"
                              ? "bg-emerald-400 text-black"
                              : "bg-white text-black hover:bg-white/90",
                            !canSubmit || submitState === "submitting"
                              ? "opacity-60 cursor-not-allowed"
                              : "",
                          ].join(" ")}
                        >
                          {submitState === "submitting"
                            ? "Submitting…"
                            : submitState === "success"
                            ? "Submitted"
                            : "Request Access"}
                        </button>

                        <p className="text-xs text-white/55">
                          By submitting, you agree we can contact you about access.
                        </p>
                      </div>
                    </form>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-white/60">
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                    Premium UI system
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                    Pages Router compatible
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                    No backend changes
                  </span>
                </div>
              </section>
            </div>

            {/* Footer */}
            <footer className="mt-14 border-t border-white/10 pt-8 text-sm text-white/60">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p>© {new Date().getFullYear()} MedicaidReady</p>
                <div className="flex items-center gap-4">
                  <Link href="/pricing" className="hover:text-white">
                    Pricing
                  </Link>
                  <Link href="/" className="hover:text-white">
                    Home
                  </Link>
                </div>
              </div>
            </footer>
          </div>
        </main>
      </div>
    </>
  );
}

function Field(props: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  maxLength?: number;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-white/85">
        {props.label}
        {props.required ? <span className="text-white/60"> *</span> : null}
      </label>
      <input
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        placeholder={props.placeholder}
        autoComplete={props.autoComplete}
        required={props.required}
        maxLength={props.maxLength}
        className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none ring-0 transition focus:border-white/20 focus:bg-black/35"
      />
    </div>
  );
}
