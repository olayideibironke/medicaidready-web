import Head from "next/head";
import Link from "next/link";
import { useMemo, useState } from "react";

const US_STATES = [
  { code: "AL", name: "Alabama" },
  { code: "AK", name: "Alaska" },
  { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" },
  { code: "CA", name: "California" },
  { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" },
  { code: "DE", name: "Delaware" },
  { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" },
  { code: "HI", name: "Hawaii" },
  { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" },
  { code: "IN", name: "Indiana" },
  { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" },
  { code: "KY", name: "Kentucky" },
  { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" },
  { code: "MD", name: "Maryland" },
  { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" },
  { code: "MN", name: "Minnesota" },
  { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" },
  { code: "MT", name: "Montana" },
  { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" },
  { code: "NH", name: "New Hampshire" },
  { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" },
  { code: "NY", name: "New York" },
  { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" },
  { code: "OH", name: "Ohio" },
  { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" },
  { code: "PA", name: "Pennsylvania" },
  { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" },
  { code: "SD", name: "South Dakota" },
  { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" },
  { code: "UT", name: "Utah" },
  { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" },
  { code: "WA", name: "Washington" },
  { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" },
  { code: "WY", name: "Wyoming" },
  { code: "DC", name: "Washington, DC" },
];

type QuizAnswers = {
  state: string;
  householdSize: number;
  monthlyIncome: string;
  age: string;
  employed: boolean | null;
};

type EligibilityResult = {
  id: string | null;
  qualified: boolean;
  summary: string;
};

type Phase = "quiz" | "email" | "loading" | "result" | "error";

const TOTAL_QUIZ_STEPS = 5;

function extractSummaryFromJsonLikeText(value: string): string | null {
  const candidate = value.trim();

  try {
    const parsed = JSON.parse(candidate) as unknown;

    if (typeof parsed === "string") {
      return parsed;
    }

    if (
      parsed &&
      typeof parsed === "object" &&
      "summary" in parsed &&
      typeof (parsed as { summary?: unknown }).summary === "string"
    ) {
      return String((parsed as { summary: string }).summary);
    }
  } catch {
    // Not valid JSON. Continue with safer text cleanup.
  }

  const summaryMatch = candidate.match(
    /"summary"\s*:\s*"([\s\S]*?)(?:"\s*,\s*"(?:qualified|eligible|id|state|status|confidence)"\s*:|"\s*\}\s*$|"\s*$)/i
  );

  if (summaryMatch?.[1]) {
    return summaryMatch[1];
  }

  return null;
}

function cleanSummaryText(value: string): string {
  let text = String(value ?? "").trim();

  text = text
    .replace(/^\s*```(?:json|text|markdown)?\s*/i, "")
    .replace(/\s*```\s*$/i, "")
    .trim();

  const parsedBeforeDecode = extractSummaryFromJsonLikeText(text);
  if (parsedBeforeDecode) {
    text = parsedBeforeDecode;
  }

  text = text
    .replace(/\\n\\n/g, "\n\n")
    .replace(/\\n/g, "\n")
    .replace(/\\"/g, '"')
    .replace(/\\'/g, "'")
    .trim();

  const parsedAfterDecode = extractSummaryFromJsonLikeText(text);
  if (parsedAfterDecode) {
    text = parsedAfterDecode;
  }

  text = text
    .replace(/^\s*```(?:json|text|markdown)?\s*/i, "")
    .replace(/\s*```\s*$/i, "")
    .replace(/^\s*\{\s*/i, "")
    .replace(/^\s*"summary"\s*:\s*/i, "")
    .replace(/^["'`]+/, "")
    .replace(/\s*[,;]?\s*"?(qualified|eligible|id|state|status|confidence)"?\s*:\s*[\s\S]*$/i, "")
    .replace(/\s*[}"'`]+\s*$/g, "")
    .trim();

  return text;
}

function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = Math.round((current / total) * 100);

  return (
    <div
      className="progress-wrap"
      role="progressbar"
      aria-valuenow={current}
      aria-valuemin={1}
      aria-valuemax={total}
      aria-label={`Step ${current} of ${total}`}
    >
      <div className="progress-top">
        <span className="progress-label">
          Step {current} of {total}
        </span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function Quiz() {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<QuizAnswers>({
    state: "",
    householdSize: 1,
    monthlyIncome: "",
    age: "",
    employed: null,
  });
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phase, setPhase] = useState<Phase>("quiz");
  const [result, setResult] = useState<EligibilityResult | null>(null);
  const [apiError, setApiError] = useState("");
  const [guideLoading, setGuideLoading] = useState(false);

  const selectedStateName = useMemo(
    () => US_STATES.find((s) => s.code === answers.state)?.name ?? "your state",
    [answers.state]
  );

  const resultParagraphs = useMemo(() => {
    const cleaned = cleanSummaryText(result?.summary ?? "");
    return cleaned
      .split(/\n{2,}/)
      .map((para) => para.trim())
      .filter(Boolean);
  }, [result?.summary]);

  function canAdvance(): boolean {
    if (step === 1) return answers.state !== "";
    if (step === 2) return answers.householdSize >= 1;
    if (step === 3) return answers.monthlyIncome !== "" && !Number.isNaN(Number(answers.monthlyIncome));
    if (step === 4) return answers.age !== "" && !Number.isNaN(Number(answers.age)) && Number(answers.age) > 0;
    if (step === 5) return answers.employed !== null;
    return false;
  }

  function handleNext() {
    if (!canAdvance()) return;

    if (step < TOTAL_QUIZ_STEPS) {
      setStep((s) => s + 1);
      return;
    }

    setPhase("email");
  }

  function handleBack() {
    if (phase === "email") {
      setPhase("quiz");
      setStep(TOTAL_QUIZ_STEPS);
      return;
    }

    if (step > 1) setStep((s) => s - 1);
  }

  async function handleEmailSubmit() {
    const trimmed = email.trim().toLowerCase();

    if (!trimmed || !trimmed.includes("@")) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    setEmailError("");
    setPhase("loading");

    try {
      const res = await fetch("/api/check-eligibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmed,
          state: answers.state,
          householdSize: answers.householdSize,
          monthlyIncome: Number(answers.monthlyIncome),
          age: Number(answers.age),
          employed: answers.employed === true,
        }),
      });

      const json = (await res.json()) as {
        ok: boolean;
        id?: string;
        qualified?: boolean;
        summary?: string;
        error?: string;
      };

      if (!res.ok || !json.ok) {
        throw new Error(json.error ?? "Something went wrong. Please try again.");
      }

      setResult({
        id: json.id ?? null,
        qualified: Boolean(json.qualified),
        summary: cleanSummaryText(String(json.summary ?? "")),
      });
      setPhase("result");
    } catch (e: unknown) {
      setApiError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
      setPhase("error");
    }
  }

  async function handleGuideCheckout() {
    setGuideLoading(true);

    try {
      const res = await fetch("/api/stripe/create-guide-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), submissionId: result?.id }),
      });

      const json = (await res.json()) as { ok: boolean; url?: string; error?: string };

      if (!res.ok || !json.ok || !json.url) {
        throw new Error(json.error ?? "Checkout failed.");
      }

      window.location.href = json.url;
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Checkout failed. Please try again.");
      setGuideLoading(false);
    }
  }

  function resetQuiz() {
    setStep(1);
    setAnswers({
      state: "",
      householdSize: 1,
      monthlyIncome: "",
      age: "",
      employed: null,
    });
    setEmail("");
    setEmailError("");
    setApiError("");
    setResult(null);
    setPhase("quiz");
  }

  return (
    <>
      <Head>
        <title>Free Medicaid Eligibility Check — MedicaidReady</title>
        <meta
          name="description"
          content="Answer 5 quick questions to find out if you may qualify for Medicaid in your state."
        />
        <meta property="og:title" content="Free Medicaid Eligibility Check — MedicaidReady" />
        <meta
          property="og:description"
          content="Answer 5 quick questions to find out if you may qualify for Medicaid."
        />
        <meta name="robots" content="noindex" />
        <meta name="theme-color" content="#0a3d6b" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg?v=6" />
        <link rel="shortcut icon" href="/favicon.svg?v=6" />
      </Head>

      <div className="quiz-page">
        <div className="quiz-container">
          <div className="quiz-header">
            <h1 className="quiz-title">
              {phase === "result" ? "Your Eligibility Results" : "Free Medicaid Eligibility Check"}
            </h1>

            {(phase === "quiz" || phase === "email") && (
              <p className="quiz-desc">
                Answer 5 quick questions. We check your eligibility against your state&apos;s current Medicaid rules.
              </p>
            )}
          </div>

          {phase === "quiz" && (
            <div className="card">
              <ProgressBar current={step} total={TOTAL_QUIZ_STEPS} />

              {step === 1 && (
                <div className="field-group">
                  <label className="field-label" htmlFor="state-select">
                    What state do you live in?
                  </label>
                  <p className="field-hint">Select your current state of residence.</p>
                  <select
                    id="state-select"
                    className="field-select"
                    value={answers.state}
                    onChange={(e) => setAnswers((a) => ({ ...a, state: e.target.value }))}
                    autoFocus
                  >
                    <option value="">Select a state</option>
                    {US_STATES.map((s) => (
                      <option key={s.code} value={s.code}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {step === 2 && (
                <div className="field-group">
                  <div className="field-label">How many people are in your household?</div>
                  <p className="field-hint">
                    Include yourself, a spouse, and any dependents living with you.
                  </p>
                  <div className="size-grid">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                      <button
                        key={n}
                        type="button"
                        className={`size-btn ${answers.householdSize === n ? "size-btn-active" : ""}`}
                        onClick={() => setAnswers((a) => ({ ...a, householdSize: n }))}
                        aria-pressed={answers.householdSize === n}
                      >
                        {n === 8 ? "8+" : n}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="field-group">
                  <label className="field-label" htmlFor="income-input">
                    What is your monthly household income?
                  </label>
                  <p className="field-hint">
                    Include all income sources for everyone in your household before taxes.
                  </p>
                  <div className="input-wrap">
                    <span className="input-prefix" aria-hidden="true">
                      $
                    </span>
                    <input
                      id="income-input"
                      type="number"
                      min="0"
                      step="1"
                      className="field-input input-with-prefix"
                      placeholder="e.g. 2500"
                      value={answers.monthlyIncome}
                      onChange={(e) => setAnswers((a) => ({ ...a, monthlyIncome: e.target.value }))}
                      autoFocus
                    />
                  </div>
                  <p className="field-note">Enter 0 if you have no income right now.</p>
                </div>
              )}

              {step === 4 && (
                <div className="field-group">
                  <label className="field-label" htmlFor="age-input">
                    What is your age?
                  </label>
                  <p className="field-hint">
                    Age affects eligibility — children, seniors, and adults qualify under different rules.
                  </p>
                  <input
                    id="age-input"
                    type="number"
                    min="0"
                    max="120"
                    step="1"
                    className="field-input"
                    placeholder="e.g. 34"
                    value={answers.age}
                    onChange={(e) => setAnswers((a) => ({ ...a, age: e.target.value }))}
                    autoFocus
                  />
                </div>
              )}

              {step === 5 && (
                <div className="field-group">
                  <div className="field-label">Are you currently employed?</div>
                  <p className="field-hint">
                    Being employed does not automatically disqualify you. Medicaid is mainly based on income and household size.
                  </p>
                  <div className="yesno-row">
                    <button
                      type="button"
                      className={`yesno-btn ${answers.employed === true ? "yesno-btn-active" : ""}`}
                      onClick={() => setAnswers((a) => ({ ...a, employed: true }))}
                      aria-pressed={answers.employed === true}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      className={`yesno-btn ${answers.employed === false ? "yesno-btn-active" : ""}`}
                      onClick={() => setAnswers((a) => ({ ...a, employed: false }))}
                      aria-pressed={answers.employed === false}
                    >
                      No
                    </button>
                  </div>
                </div>
              )}

              <div className="nav-row">
                {step > 1 && (
                  <button type="button" className="btn-back" onClick={handleBack}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path
                        d="M9 2L4 7l5 5"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Back
                  </button>
                )}
                <button
                  type="button"
                  className={`btn-next ${!canAdvance() ? "btn-next-disabled" : ""}`}
                  onClick={handleNext}
                  disabled={!canAdvance()}
                >
                  {step === TOTAL_QUIZ_STEPS ? "See My Results" : "Continue"}
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path
                      d="M5 2l5 5-5 5"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {phase === "email" && (
            <div className="card">
              <div className="email-header">
                <div className="email-icon" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <rect x="2" y="5" width="18" height="13" rx="2.5" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M2 8l9 6 9-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <h2 className="email-title">Almost there</h2>
                <p className="email-sub">
                  Enter your email to receive your personalized eligibility assessment. We will not spam you.
                </p>
              </div>

              <div className="field-group">
                <label className="field-label" htmlFor="email-input">
                  Your email address
                </label>
                <input
                  id="email-input"
                  type="email"
                  className={`field-input ${emailError ? "field-input-error" : ""}`}
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") void handleEmailSubmit();
                  }}
                  autoComplete="email"
                  autoFocus
                />
                {emailError && (
                  <p className="field-error" role="alert">
                    {emailError}
                  </p>
                )}
              </div>

              <div className="nav-row">
                <button type="button" className="btn-back" onClick={handleBack}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path
                      d="M9 2L4 7l5 5"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Back
                </button>
                <button type="button" className="btn-next" onClick={() => void handleEmailSubmit()}>
                  Get My Results
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path
                      d="M5 2l5 5-5 5"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>

              <p className="privacy-note">
                By continuing, you agree to our{" "}
                <Link href="/privacy" className="privacy-link">
                  Privacy Policy
                </Link>
                . We do not share your information with any government agency.
              </p>
            </div>
          )}

          {phase === "loading" && (
            <div className="card card-centered">
              <div className="spinner" aria-label="Analyzing your eligibility" />
              <h2 className="loading-title">Analyzing your eligibility…</h2>
              <p className="loading-sub">
                Reviewing your answers against {selectedStateName}&apos;s current Medicaid rules. This takes a few seconds.
              </p>
            </div>
          )}

          {phase === "result" && result && (
            <div className="card">
              <div className={`result-banner ${result.qualified ? "result-banner-positive" : "result-banner-neutral"}`}>
                <div className="result-banner-icon" aria-hidden="true">
                  {result.qualified ? (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M4 10l5 5 7-8"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M10 6v5M10 14v.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  )}
                </div>
                <div className="result-banner-text">
                  <div className="result-headline">
                    {result.qualified ? "Good news — you may qualify for Medicaid" : "You may not qualify right now"}
                  </div>
                  <div className="result-state">{selectedStateName}</div>
                </div>
              </div>

              <div className="result-body">
                {resultParagraphs.map((para, i) => (
                  <p key={i} className="result-para">
                    {para}
                  </p>
                ))}
              </div>

              <div className="upgrade-card">
                <div className="upgrade-header">
                  <div className="upgrade-badge">$9.99 one-time</div>
                  <div className="upgrade-title">Want step-by-step help applying?</div>
                </div>
                <p className="upgrade-sub">
                  Our <strong>Complete Application Guide</strong> walks you through how to apply for Medicaid in{" "}
                  {selectedStateName} — documents, forms, deadlines, and what to expect.
                </p>
                <button
                  type="button"
                  className={`upgrade-btn ${guideLoading ? "upgrade-btn-disabled" : ""}`}
                  onClick={() => void handleGuideCheckout()}
                  disabled={guideLoading}
                >
                  {guideLoading ? "Redirecting to checkout…" : "Get Your Complete Application Guide — $9.99"}
                </button>
                <p className="upgrade-note">
                  One-time payment &middot; Instant download &middot; 30-day money-back guarantee
                </p>
              </div>

              <div className="result-footer">
                <button type="button" className="restart-btn" onClick={resetQuiz}>
                  Start over with different answers
                </button>
              </div>
            </div>
          )}

          {phase === "error" && (
            <div className="card card-centered">
              <div className="error-icon" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 8v5M12 16v.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path
                    d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h2 className="loading-title">Something went wrong</h2>
              <p className="loading-sub" style={{ marginBottom: 24 }}>
                {apiError || "An unexpected error occurred. Please try again."}
              </p>
              <button
                type="button"
                className="btn-next"
                style={{ margin: "0 auto" }}
                onClick={() => {
                  setApiError("");
                  setPhase("email");
                }}
              >
                Try Again
              </button>
            </div>
          )}

          {(phase === "quiz" || phase === "email") && (
            <p className="disclaimer">
              This tool provides a preliminary assessment only and is not an official Medicaid determination.
              Only your state&apos;s Medicaid agency can approve or deny coverage.
            </p>
          )}
        </div>
      </div>

      <style jsx>{`
        .quiz-page {
          background: var(--bg);
          min-height: calc(100vh - 64px);
          padding: 48px 16px 72px;
        }

        .quiz-container {
          width: 100%;
          max-width: 640px;
          margin: 0 auto;
        }

        .quiz-header {
          text-align: center;
          margin-bottom: 28px;
        }

        .quiz-title {
          font-size: 30px;
          font-weight: 700;
          letter-spacing: -0.04em;
          color: var(--ink);
          margin-bottom: 8px;
          line-height: 1.15;
        }

        .quiz-desc {
          font-size: 15px;
          color: var(--text);
          line-height: 1.65;
          max-width: 440px;
          margin: 0 auto;
        }

        .card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-lg);
          padding: 32px;
        }

        .card-centered {
          text-align: center;
          padding: 52px 32px;
        }

        .progress-wrap {
          margin-bottom: 32px;
        }

        .progress-top {
          display: flex;
          justify-content: flex-start;
          font-size: 13px;
          font-weight: 500;
          color: var(--muted);
          margin-bottom: 8px;
        }

        .progress-label {
          color: var(--text);
        }

        .progress-track {
          width: 100%;
          height: 6px;
          background: var(--bg-alt);
          border-radius: 999px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: var(--navy);
          border-radius: 999px;
          transition: width 280ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        .field-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 28px;
        }

        .field-label {
          font-size: 20px;
          font-weight: 700;
          color: var(--ink);
          letter-spacing: -0.025em;
          line-height: 1.3;
        }

        .field-hint {
          font-size: 14px;
          color: var(--muted);
          line-height: 1.6;
        }

        .field-select,
        .field-input {
          margin-top: 6px;
          width: 100%;
          padding: 13px 16px;
          border: 1.5px solid var(--border);
          border-radius: var(--radius-md);
          font-size: 16px;
          color: var(--ink);
          background: var(--surface);
          outline: none;
          box-sizing: border-box;
          transition: border-color 140ms, box-shadow 140ms;
          appearance: auto;
        }

        .field-select:focus,
        .field-input:focus {
          border-color: var(--navy);
          box-shadow: 0 0 0 3px rgba(10, 61, 107, 0.1);
        }

        .field-input-error {
          border-color: var(--red) !important;
        }

        .field-note {
          font-size: 13px;
          color: var(--subtle);
        }

        .field-error {
          font-size: 13px;
          color: var(--red);
          font-weight: 500;
        }

        .input-wrap {
          position: relative;
          margin-top: 6px;
        }

        .input-prefix {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 16px;
          font-weight: 600;
          color: var(--text);
          pointer-events: none;
          z-index: 1;
        }

        .input-with-prefix {
          padding-left: 30px !important;
        }

        .size-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          margin-top: 8px;
        }

        .size-btn {
          padding: 16px 8px;
          border: 1.5px solid var(--border);
          border-radius: var(--radius-md);
          background: var(--surface);
          color: var(--ink);
          font-size: 18px;
          font-weight: 600;
          cursor: pointer;
          transition: all 120ms;
          font-family: inherit;
        }

        .size-btn:hover {
          border-color: var(--border-strong);
          background: var(--bg);
        }

        .size-btn-active {
          border: 2px solid var(--navy);
          background: rgba(10, 61, 107, 0.06);
          color: var(--navy);
          box-shadow: 0 0 0 3px rgba(10, 61, 107, 0.08);
        }

        .yesno-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-top: 8px;
        }

        .yesno-btn {
          padding: 18px 16px;
          border: 1.5px solid var(--border);
          border-radius: var(--radius-md);
          background: var(--surface);
          color: var(--ink);
          font-size: 17px;
          font-weight: 600;
          cursor: pointer;
          transition: all 120ms;
          font-family: inherit;
        }

        .yesno-btn:hover {
          border-color: var(--border-strong);
          background: var(--bg);
        }

        .yesno-btn-active {
          border: 2px solid var(--navy);
          background: rgba(10, 61, 107, 0.06);
          color: var(--navy);
          box-shadow: 0 0 0 3px rgba(10, 61, 107, 0.08);
        }

        .nav-row {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .btn-back {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 13px 18px;
          border: 1.5px solid var(--border);
          border-radius: var(--radius-md);
          background: var(--surface);
          color: var(--text);
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          white-space: nowrap;
          font-family: inherit;
          transition: background 120ms;
        }

        .btn-back:hover {
          background: var(--bg);
        }

        .btn-next {
          flex: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 14px 20px;
          border-radius: var(--radius-md);
          background: var(--navy);
          color: #fff;
          font-size: 15px;
          font-weight: 600;
          border: 1px solid var(--navy-dark);
          box-shadow: var(--shadow-md);
          cursor: pointer;
          font-family: inherit;
          transition:
            background 140ms,
            transform 100ms;
        }

        .btn-next:hover:not(:disabled) {
          background: var(--navy-dark);
          transform: translateY(-1px);
        }

        .btn-next-disabled,
        .btn-next:disabled {
          opacity: 0.45;
          cursor: not-allowed;
          transform: none !important;
        }

        .email-header {
          text-align: center;
          margin-bottom: 28px;
        }

        .email-icon {
          width: 52px;
          height: 52px;
          border-radius: var(--radius-md);
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          color: var(--navy);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
        }

        .email-title {
          font-size: 24px;
          font-weight: 700;
          letter-spacing: -0.03em;
          color: var(--ink);
          margin-bottom: 8px;
        }

        .email-sub {
          font-size: 15px;
          color: var(--text);
          line-height: 1.65;
        }

        .privacy-note {
          margin-top: 16px;
          font-size: 12px;
          color: var(--subtle);
          text-align: center;
          line-height: 1.6;
        }

        .privacy-link {
          color: var(--navy);
          text-decoration: underline;
        }

        .spinner {
          width: 48px;
          height: 48px;
          border: 3px solid rgba(10, 61, 107, 0.12);
          border-top-color: var(--navy);
          border-radius: 50%;
          margin: 0 auto 24px;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .loading-title {
          font-size: 22px;
          font-weight: 700;
          color: var(--ink);
          letter-spacing: -0.025em;
          margin-bottom: 10px;
        }

        .loading-sub {
          font-size: 15px;
          color: var(--text);
          line-height: 1.65;
          max-width: 380px;
          margin: 0 auto;
        }

        .result-banner {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          border-radius: var(--radius-md);
          padding: 18px 20px;
          margin-bottom: 24px;
        }

        .result-banner-positive {
          background: var(--green-bg);
          border: 1px solid var(--green-border);
        }

        .result-banner-neutral {
          background: var(--amber-bg);
          border: 1px solid var(--amber-border);
        }

        .result-banner-icon {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .result-banner-positive .result-banner-icon {
          background: var(--green-bg);
          border: 1px solid var(--green-border);
          color: var(--green);
        }

        .result-banner-neutral .result-banner-icon {
          background: var(--amber-bg);
          border: 1px solid var(--amber-border);
          color: var(--amber);
        }

        .result-headline {
          font-size: 18px;
          font-weight: 700;
          color: var(--ink);
          letter-spacing: -0.02em;
          line-height: 1.3;
          margin-bottom: 4px;
        }

        .result-state {
          font-size: 13px;
          font-weight: 500;
          color: var(--muted);
        }

        .result-body {
          margin-bottom: 24px;
        }

        .result-para {
          font-size: 15px;
          color: var(--text);
          line-height: 1.75;
          margin-bottom: 12px;
        }

        .result-para:last-child {
          margin-bottom: 0;
        }

        .upgrade-card {
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          background: var(--bg);
          padding: 22px;
          margin-bottom: 16px;
        }

        .upgrade-header {
          margin-bottom: 10px;
        }

        .upgrade-badge {
          display: inline-block;
          padding: 3px 10px;
          border-radius: 999px;
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          font-size: 11px;
          font-weight: 600;
          color: #1d4ed8;
          margin-bottom: 8px;
        }

        .upgrade-title {
          font-size: 17px;
          font-weight: 700;
          color: var(--ink);
          letter-spacing: -0.02em;
        }

        .upgrade-sub {
          font-size: 14px;
          color: var(--text);
          line-height: 1.65;
          margin-bottom: 16px;
        }

        .upgrade-btn {
          width: 100%;
          padding: 15px;
          border-radius: var(--radius-md);
          background: var(--navy);
          color: #fff;
          font-size: 15px;
          font-weight: 600;
          border: 1px solid var(--navy-dark);
          box-shadow: var(--shadow-md);
          cursor: pointer;
          font-family: inherit;
          transition: background 140ms;
          margin-bottom: 10px;
        }

        .upgrade-btn:hover:not(:disabled) {
          background: var(--navy-dark);
        }

        .upgrade-btn-disabled,
        .upgrade-btn:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .upgrade-note {
          font-size: 12px;
          color: var(--subtle);
          text-align: center;
        }

        .result-footer {
          text-align: center;
        }

        .restart-btn {
          background: none;
          border: none;
          color: var(--muted);
          font-size: 13px;
          cursor: pointer;
          text-decoration: underline;
          padding: 4px;
          font-family: inherit;
        }

        .restart-btn:hover {
          color: var(--text);
        }

        .error-icon {
          width: 56px;
          height: 56px;
          border-radius: var(--radius-md);
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: var(--red);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
        }

        .disclaimer {
          margin: 20px auto 0;
          font-size: 12px;
          color: var(--subtle);
          text-align: center;
          line-height: 1.6;
          max-width: 520px;
        }

        @media (max-width: 480px) {
          .quiz-page {
            padding: 32px 12px 60px;
          }

          .card {
            padding: 24px;
          }

          .card-centered {
            padding: 40px 24px;
          }

          .quiz-title {
            font-size: 24px;
          }

          .field-label {
            font-size: 18px;
          }

          .size-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 8px;
          }
        }
      `}</style>
    </>
  );
}