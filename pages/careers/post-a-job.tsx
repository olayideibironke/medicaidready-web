import Head from "next/head";
import Link from "next/link";
import type { GetStaticProps } from "next";
import { useState } from "react";
import type { FormEvent } from "react";
import CareersShell from "../../components/careers/CareersShell";

type PaymentEnabled = {
  standard: boolean;
  featured: boolean;
};

type Props = {
  paymentEnabled: PaymentEnabled;
  pricingDisplay: {
    standard: string;
    featured: string;
  };
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const hasSecret = Boolean(process.env.STRIPE_SECRET_KEY);
  return {
    props: {
      paymentEnabled: {
        standard: hasSecret && Boolean(process.env.STRIPE_CAREERS_STANDARD_PRICE_ID),
        featured: hasSecret && Boolean(process.env.STRIPE_CAREERS_FEATURED_PRICE_ID),
      },
      pricingDisplay: {
        standard:
          process.env.STRIPE_CAREERS_STANDARD_DISPLAY ?? "$99 per 30-day listing",
        featured:
          process.env.STRIPE_CAREERS_FEATURED_DISPLAY ?? "$249 per 30-day featured listing",
      },
    },
    revalidate: 300,
  };
};

type Tier = "free" | "standard" | "featured";

type FormState = {
  company: string;
  contactName: string;
  contactEmail: string;
  jobTitle: string;
  category: string;
  location: string;
  workMode: string;
  employmentType: string;
  salaryMin: string;
  salaryMax: string;
  salaryDisplay: string;
  summary: string;
  description: string;
  responsibilities: string;
  requirements: string;
  benefits: string;
  applyUrl: string;
};

const INITIAL: FormState = {
  company: "",
  contactName: "",
  contactEmail: "",
  jobTitle: "",
  category: "",
  location: "",
  workMode: "hybrid",
  employmentType: "full_time",
  salaryMin: "",
  salaryMax: "",
  salaryDisplay: "",
  summary: "",
  description: "",
  responsibilities: "",
  requirements: "",
  benefits: "",
  applyUrl: "",
};

const CATEGORY_OPTIONS = [
  { value: "", label: "Select a category" },
  { value: "eligibility", label: "Eligibility / enrollment" },
  { value: "care_management", label: "Care management" },
  { value: "compliance", label: "Compliance / regulatory" },
  { value: "analytics", label: "Analytics / data" },
  { value: "policy", label: "Policy / analyst" },
  { value: "billing", label: "Billing / revenue cycle" },
  { value: "operations", label: "Operations" },
  { value: "clinical", label: "Clinical" },
  { value: "other", label: "Other" },
];

export default function PostAJob({ paymentEnabled, pricingDisplay }: Props) {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [tier, setTier] = useState<Tier>("free");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function validate(): string | null {
    if (!form.company.trim()) return "Company name is required.";
    if (!form.contactEmail.trim() || !form.contactEmail.includes("@")) {
      return "A valid contact email is required.";
    }
    if (!form.jobTitle.trim()) return "Job title is required.";
    if (!form.description.trim()) return "Role description is required.";
    if (form.applyUrl.trim()) {
      try {
        const u = new URL(form.applyUrl.trim());
        if (u.protocol !== "http:" && u.protocol !== "https:") {
          return "Apply URL must start with http:// or https://";
        }
      } catch {
        return "Apply URL is not a valid URL.";
      }
    }
    return null;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const validation = validate();
    if (validation) {
      setError(validation);
      return;
    }
    setError("");
    setSubmitting(true);

    const payload = {
      title: form.jobTitle.trim(),
      company: form.company.trim(),
      contactName: form.contactName.trim(),
      contactEmail: form.contactEmail.trim(),
      category: form.category.trim() || undefined,
      location: form.location.trim() || undefined,
      workMode: form.workMode || undefined,
      employmentType: form.employmentType || undefined,
      salaryMin: form.salaryMin === "" ? null : Number(form.salaryMin),
      salaryMax: form.salaryMax === "" ? null : Number(form.salaryMax),
      salaryDisplay: form.salaryDisplay.trim() || undefined,
      summary: form.summary.trim() || undefined,
      description: form.description.trim(),
      responsibilities: form.responsibilities,
      requirements: form.requirements,
      benefits: form.benefits,
      applyUrl: form.applyUrl.trim() || undefined,
      paymentTier: tier,
    };

    try {
      const submitRes = await fetch("/api/careers/jobs/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const submitJson = (await submitRes.json()) as {
        ok: boolean;
        jobId?: string;
        slug?: string;
        error?: string;
      };
      if (!submitRes.ok || !submitJson.ok || !submitJson.jobId) {
        throw new Error(submitJson.error ?? "submit_failed");
      }

      if (tier === "free") {
        setSubmitted(true);
        setSubmitting(false);
        return;
      }

      const checkoutRes = await fetch(
        "/api/careers/stripe/create-checkout-session",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jobId: submitJson.jobId, tier }),
        }
      );
      const checkoutJson = (await checkoutRes.json()) as {
        ok: boolean;
        url?: string;
        error?: string;
      };
      if (!checkoutRes.ok || !checkoutJson.ok || !checkoutJson.url) {
        throw new Error(checkoutJson.error ?? "checkout_failed");
      }
      window.location.href = checkoutJson.url;
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Submission failed.");
      setSubmitting(false);
    }
  }

  return (
    <>
      <Head>
        <title>Post a Job — MedicaidReady Careers</title>
        <meta
          name="description"
          content="Post a Medicaid-focused job listing on MedicaidReady Careers. Reach candidates who already work in eligibility, compliance, care management, and analytics."
        />
      </Head>

      <CareersShell>
        <section className="careers-section">
          <div className="careers-container" style={{ maxWidth: 760 }}>
            <div className="careers-eyebrow">Post a job</div>
            <h1 className="careers-h1">Post a Medicaid role.</h1>
            <p className="careers-lead">
              Submit your role to MedicaidReady Careers. Every listing is reviewed by our team
              before going live — no auto-publishing.
            </p>

            {submitted ? (
              <div className="careers-form" style={{ marginTop: 32 }}>
                <div className="careers-form-success">
                  <strong>Thanks — your role is in our review queue.</strong>
                  <div style={{ marginTop: 6 }}>
                    We&apos;ll email <strong>{form.contactEmail}</strong> once it&apos;s
                    approved and live on MedicaidReady Careers.
                  </div>
                </div>
                <div className="careers-actions" style={{ marginTop: 20 }}>
                  <button
                    type="button"
                    className="careers-btn-ghost"
                    onClick={() => {
                      setForm(INITIAL);
                      setTier("free");
                      setSubmitted(false);
                    }}
                  >
                    Submit another role
                  </button>
                  <Link href="/careers/jobs" className="careers-btn-ghost">
                    See current listings
                  </Link>
                </div>
              </div>
            ) : (
              <form
                className="careers-form"
                style={{ marginTop: 32 }}
                onSubmit={handleSubmit}
                noValidate
              >
                <div className="careers-form-row">
                  <div className="careers-field">
                    <label htmlFor="f-company">Company *</label>
                    <input
                      id="f-company"
                      type="text"
                      value={form.company}
                      onChange={(e) => update("company", e.target.value)}
                      placeholder="Bayview Community Health"
                      required
                    />
                  </div>
                  <div className="careers-field">
                    <label htmlFor="f-contact-email">Contact email *</label>
                    <input
                      id="f-contact-email"
                      type="email"
                      value={form.contactEmail}
                      onChange={(e) => update("contactEmail", e.target.value)}
                      placeholder="hiring@bayviewcommunityhealth.org"
                      required
                    />
                  </div>
                </div>

                <div className="careers-form-row">
                  <div className="careers-field">
                    <label htmlFor="f-contact-name">Your name</label>
                    <input
                      id="f-contact-name"
                      type="text"
                      value={form.contactName}
                      onChange={(e) => update("contactName", e.target.value)}
                      placeholder="Jordan Lee"
                    />
                  </div>
                  <div className="careers-field">
                    <label htmlFor="f-title">Job title *</label>
                    <input
                      id="f-title"
                      type="text"
                      value={form.jobTitle}
                      onChange={(e) => update("jobTitle", e.target.value)}
                      placeholder="Medicaid Eligibility Specialist"
                      required
                    />
                  </div>
                </div>

                <div className="careers-form-row">
                  <div className="careers-field">
                    <label htmlFor="f-category">Category</label>
                    <select
                      id="f-category"
                      value={form.category}
                      onChange={(e) => update("category", e.target.value)}
                    >
                      {CATEGORY_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="careers-field">
                    <label htmlFor="f-location">Location</label>
                    <input
                      id="f-location"
                      type="text"
                      value={form.location}
                      onChange={(e) => update("location", e.target.value)}
                      placeholder="Baltimore, MD"
                    />
                  </div>
                </div>

                <div className="careers-form-row">
                  <div className="careers-field">
                    <label htmlFor="f-mode">Work mode</label>
                    <select
                      id="f-mode"
                      value={form.workMode}
                      onChange={(e) => update("workMode", e.target.value)}
                    >
                      <option value="remote">Remote</option>
                      <option value="hybrid">Hybrid</option>
                      <option value="on_site">On-site</option>
                    </select>
                  </div>
                  <div className="careers-field">
                    <label htmlFor="f-emp">Employment type</label>
                    <select
                      id="f-emp"
                      value={form.employmentType}
                      onChange={(e) => update("employmentType", e.target.value)}
                    >
                      <option value="full_time">Full-time</option>
                      <option value="part_time">Part-time</option>
                      <option value="contract">Contract</option>
                      <option value="internship">Internship</option>
                    </select>
                  </div>
                </div>

                <div className="careers-form-row">
                  <div className="careers-field">
                    <label htmlFor="f-smin">Salary min (annual USD)</label>
                    <input
                      id="f-smin"
                      type="number"
                      step="1000"
                      value={form.salaryMin}
                      onChange={(e) => update("salaryMin", e.target.value)}
                      placeholder="50000"
                    />
                  </div>
                  <div className="careers-field">
                    <label htmlFor="f-smax">Salary max (annual USD)</label>
                    <input
                      id="f-smax"
                      type="number"
                      step="1000"
                      value={form.salaryMax}
                      onChange={(e) => update("salaryMax", e.target.value)}
                      placeholder="60000"
                    />
                  </div>
                </div>

                <div className="careers-field">
                  <label htmlFor="f-sdisp">Salary display (optional override)</label>
                  <input
                    id="f-sdisp"
                    type="text"
                    value={form.salaryDisplay}
                    onChange={(e) => update("salaryDisplay", e.target.value)}
                    placeholder="e.g. DOE, or $50,000 – $60,000 + bonus"
                  />
                </div>

                <div className="careers-field">
                  <label htmlFor="f-summary">Short summary (one line, ~140 chars)</label>
                  <input
                    id="f-summary"
                    type="text"
                    maxLength={200}
                    value={form.summary}
                    onChange={(e) => update("summary", e.target.value)}
                    placeholder="What's this role in one sentence?"
                  />
                </div>

                <div className="careers-field">
                  <label htmlFor="f-desc">Role description *</label>
                  <textarea
                    id="f-desc"
                    value={form.description}
                    onChange={(e) => update("description", e.target.value)}
                    placeholder="What this role does, who they work with, why it matters."
                    required
                  />
                </div>

                <div className="careers-field">
                  <label htmlFor="f-resp">Responsibilities — one per line</label>
                  <textarea
                    id="f-resp"
                    value={form.responsibilities}
                    onChange={(e) => update("responsibilities", e.target.value)}
                    placeholder={"Screen patients for Medicaid eligibility\nSubmit applications via state portal"}
                  />
                </div>

                <div className="careers-field">
                  <label htmlFor="f-req">Requirements — one per line</label>
                  <textarea
                    id="f-req"
                    value={form.requirements}
                    onChange={(e) => update("requirements", e.target.value)}
                    placeholder={"1+ year experience with Medicaid or public benefits\nBilingual English / Spanish preferred"}
                  />
                </div>

                <div className="careers-field">
                  <label htmlFor="f-ben">Benefits — one per line</label>
                  <textarea
                    id="f-ben"
                    value={form.benefits}
                    onChange={(e) => update("benefits", e.target.value)}
                    placeholder={"Health, dental, vision\n401(k) with match"}
                  />
                </div>

                <div className="careers-field">
                  <label htmlFor="f-apply">Apply URL</label>
                  <input
                    id="f-apply"
                    type="url"
                    value={form.applyUrl}
                    onChange={(e) => update("applyUrl", e.target.value)}
                    placeholder="https://your-careers-page.example.com/apply"
                  />
                  <p className="careers-form-help">
                    Where candidates should apply. Direct link to the role on your careers
                    page works best.
                  </p>
                </div>

                <div className="tier-block">
                  <div className="tier-heading">Listing tier</div>
                  <div className="tier-grid">
                    <button
                      type="button"
                      className={`tier-card ${tier === "free" ? "is-active" : ""}`}
                      onClick={() => setTier("free")}
                    >
                      <div className="tier-name">Free</div>
                      <div className="tier-price">No charge</div>
                      <div className="tier-blurb">
                        Standard placement. Reviewed and approved within a few business days.
                      </div>
                    </button>
                    <button
                      type="button"
                      className={`tier-card ${tier === "standard" ? "is-active" : ""} ${
                        !paymentEnabled.standard ? "is-disabled" : ""
                      }`}
                      onClick={() =>
                        paymentEnabled.standard ? setTier("standard") : null
                      }
                      disabled={!paymentEnabled.standard}
                    >
                      <div className="tier-name">Standard</div>
                      <div className="tier-price">{pricingDisplay.standard}</div>
                      <div className="tier-blurb">
                        {paymentEnabled.standard
                          ? "Standard 30-day listing. Final amount confirmed at checkout."
                          : "Coming soon."}
                      </div>
                    </button>
                    <button
                      type="button"
                      className={`tier-card ${tier === "featured" ? "is-active" : ""} ${
                        !paymentEnabled.featured ? "is-disabled" : ""
                      }`}
                      onClick={() =>
                        paymentEnabled.featured ? setTier("featured") : null
                      }
                      disabled={!paymentEnabled.featured}
                    >
                      <div className="tier-name">Featured</div>
                      <div className="tier-price">{pricingDisplay.featured}</div>
                      <div className="tier-blurb">
                        {paymentEnabled.featured
                          ? "Top placement on listings + category pages. Final amount confirmed at checkout."
                          : "Coming soon."}
                      </div>
                    </button>
                  </div>
                </div>

                {error && (
                  <p className="careers-form-error" role="alert">
                    {error}
                  </p>
                )}

                <div className="careers-actions" style={{ marginTop: 4 }}>
                  <button
                    type="submit"
                    className="careers-btn-primary"
                    disabled={submitting}
                  >
                    {submitting
                      ? "Submitting…"
                      : tier === "free"
                        ? "Submit for review"
                        : "Continue to payment"}
                  </button>
                  <Link href="/careers/employers" className="careers-btn-ghost">
                    Pricing details
                  </Link>
                </div>

                <p className="careers-form-help" style={{ marginTop: 16 }}>
                  Submitted listings go to <strong>pending review</strong>. They go live
                  only after our team approves them — no auto-publishing.
                </p>
              </form>
            )}
          </div>
        </section>
      </CareersShell>

      <style jsx>{`
        .tier-block {
          margin: 18px 0 8px;
        }
        .tier-heading {
          font-size: 13px;
          font-weight: 700;
          color: #0f172a;
          letter-spacing: 0.02em;
          text-transform: uppercase;
          margin: 0 0 10px;
        }
        .tier-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }
        .tier-card {
          display: block;
          text-align: left;
          background: #ffffff;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          padding: 16px;
          cursor: pointer;
          font-family: inherit;
          color: #0f172a;
          transition: border-color 140ms, box-shadow 140ms, transform 100ms;
        }
        .tier-card:hover:not(:disabled) {
          border-color: #93c5fd;
        }
        .tier-card.is-active {
          border: 2px solid #0a3d6b;
          box-shadow: 0 0 0 3px rgba(10, 61, 107, 0.1);
        }
        .tier-card.is-disabled,
        .tier-card:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }
        .tier-name {
          font-size: 14px;
          font-weight: 700;
          color: #0f172a;
          letter-spacing: -0.01em;
        }
        .tier-price {
          font-size: 13px;
          color: #1565c0;
          font-weight: 600;
          margin: 4px 0 8px;
        }
        .tier-blurb {
          font-size: 12px;
          color: #475569;
          line-height: 1.5;
        }
        @media (max-width: 720px) {
          .tier-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
