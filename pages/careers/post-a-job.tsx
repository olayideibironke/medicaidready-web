import Head from "next/head";
import { useState } from "react";
import CareersShell from "../../components/careers/CareersShell";

type FormState = {
  company: string;
  contactEmail: string;
  jobTitle: string;
  location: string;
  type: string;
  remote: string;
  salary: string;
  description: string;
};

const INITIAL: FormState = {
  company: "",
  contactEmail: "",
  jobTitle: "",
  location: "",
  type: "Full-time",
  remote: "Hybrid",
  salary: "",
  description: "",
};

export default function PostAJob() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (
      !form.company.trim() ||
      !form.contactEmail.trim() ||
      !form.jobTitle.trim() ||
      !form.description.trim()
    ) {
      setError("Please fill in company, contact email, job title, and description.");
      return;
    }
    if (!form.contactEmail.includes("@")) {
      setError("Please enter a valid contact email.");
      return;
    }

    setError("");
    setSubmitted(true);
  }

  return (
    <>
      <Head>
        <title>Post a Job — MedicaidReady Careers</title>
        <meta name="description" content="Submit a Medicaid role to MedicaidReady Careers." />
        <meta name="robots" content="noindex" />
      </Head>

      <CareersShell>
        <section className="careers-section">
          <div className="careers-container" style={{ maxWidth: 760 }}>
            <div className="careers-eyebrow">Post a job</div>
            <h1 className="careers-h1">Submit a Medicaid role.</h1>
            <p className="careers-lead">
              Phase 1 preview — listings are not yet published live. Submit your role and we will
              be in touch when the full board launches.
            </p>

            {submitted ? (
              <div className="careers-form" style={{ marginTop: 32 }}>
                <div className="careers-form-success">
                  <strong>Thanks — we received your posting.</strong>
                  <div style={{ marginTop: 6 }}>
                    We will email <strong>{form.contactEmail}</strong> when MedicaidReady Careers
                    goes live and your role is published.
                  </div>
                </div>
                <div className="careers-actions" style={{ marginTop: 20 }}>
                  <button
                    type="button"
                    className="careers-btn-ghost"
                    onClick={() => {
                      setForm(INITIAL);
                      setSubmitted(false);
                    }}
                  >
                    Submit another role
                  </button>
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
                    <label htmlFor="company">Company</label>
                    <input
                      id="company"
                      type="text"
                      value={form.company}
                      onChange={(e) => update("company", e.target.value)}
                      placeholder="Bayview Community Health"
                      required
                    />
                  </div>
                  <div className="careers-field">
                    <label htmlFor="contactEmail">Contact email</label>
                    <input
                      id="contactEmail"
                      type="email"
                      value={form.contactEmail}
                      onChange={(e) => update("contactEmail", e.target.value)}
                      placeholder="hiring@bayviewcommunityhealth.org"
                      required
                    />
                  </div>
                </div>

                <div className="careers-field">
                  <label htmlFor="jobTitle">Job title</label>
                  <input
                    id="jobTitle"
                    type="text"
                    value={form.jobTitle}
                    onChange={(e) => update("jobTitle", e.target.value)}
                    placeholder="Medicaid Eligibility Specialist"
                    required
                  />
                </div>

                <div className="careers-form-row">
                  <div className="careers-field">
                    <label htmlFor="location">Location</label>
                    <input
                      id="location"
                      type="text"
                      value={form.location}
                      onChange={(e) => update("location", e.target.value)}
                      placeholder="Baltimore, MD"
                    />
                  </div>
                  <div className="careers-field">
                    <label htmlFor="salary">Salary range (optional)</label>
                    <input
                      id="salary"
                      type="text"
                      value={form.salary}
                      onChange={(e) => update("salary", e.target.value)}
                      placeholder="$50,000 – $60,000 / year"
                    />
                  </div>
                </div>

                <div className="careers-form-row">
                  <div className="careers-field">
                    <label htmlFor="type">Employment type</label>
                    <select
                      id="type"
                      value={form.type}
                      onChange={(e) => update("type", e.target.value)}
                    >
                      <option>Full-time</option>
                      <option>Part-time</option>
                      <option>Contract</option>
                      <option>Internship</option>
                    </select>
                  </div>
                  <div className="careers-field">
                    <label htmlFor="remote">Work mode</label>
                    <select
                      id="remote"
                      value={form.remote}
                      onChange={(e) => update("remote", e.target.value)}
                    >
                      <option>Remote</option>
                      <option>Hybrid</option>
                      <option>On-site</option>
                    </select>
                  </div>
                </div>

                <div className="careers-field">
                  <label htmlFor="description">Role description</label>
                  <textarea
                    id="description"
                    value={form.description}
                    onChange={(e) => update("description", e.target.value)}
                    placeholder="Briefly describe the role, responsibilities, and any required qualifications."
                    required
                  />
                </div>

                {error && (
                  <p className="careers-form-error" role="alert">
                    {error}
                  </p>
                )}

                <div className="careers-actions" style={{ marginTop: 4 }}>
                  <button type="submit" className="careers-btn-primary">
                    Submit posting
                  </button>
                </div>

                <p className="careers-form-help" style={{ marginTop: 16 }}>
                  Phase 1 preview only. Submitting does not publish the role and does not save the
                  data anywhere — it stays in your browser until you reload.
                </p>
              </form>
            )}
          </div>
        </section>
      </CareersShell>
    </>
  );
}
