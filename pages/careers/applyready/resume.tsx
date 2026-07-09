import Head from "next/head";
import Link from "next/link";
import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import CareersShell from "../../../components/careers/CareersShell";
import {
  calculateApplyReadyResumeCompletion,
  clearApplyReadyResumeStatus,
  EMPTY_APPLYREADY_RESUME_STATUS,
  getApplyReadyResumeStatus,
  isApplyReadyResumeStarted,
  saveApplyReadyResumeStatus,
  type ApplyReadyResumeStatus,
} from "../../../lib/careers/applyReadyResume";

const SITE_URL = "https://www.medicaidready.org";
const PAGE_PATH = "/careers/applyready/resume";
const CANONICAL_URL = `${SITE_URL}${PAGE_PATH}`;

const FORMAT_OPTIONS = ["", "PDF", "Word document", "Google Docs", "Not sure yet"];

const CHECKLIST_ITEMS: Array<{
  key: keyof Pick<
    ApplyReadyResumeStatus,
    | "hasCurrentResume"
    | "reviewedContactInfo"
    | "addedRecentExperience"
    | "addedSkills"
    | "quantifiedImpact"
    | "savedAsPdf"
    | "readyForSecureUpload"
  >;
  title: string;
  body: string;
}> = [
  {
    key: "hasCurrentResume",
    title: "Current resume exists",
    body: "You have a resume file or draft that can be reviewed.",
  },
  {
    key: "reviewedContactInfo",
    title: "Contact details reviewed",
    body: "Name, email, phone, location, and links are current.",
  },
  {
    key: "addedRecentExperience",
    title: "Recent experience added",
    body: "Recent jobs, projects, certifications, or training are included.",
  },
  {
    key: "addedSkills",
    title: "Relevant skills added",
    body: "Skills match the roles you want to pursue.",
  },
  {
    key: "quantifiedImpact",
    title: "Impact is clear",
    body: "Achievements include numbers, outcomes, volume, savings, or measurable results when possible.",
  },
  {
    key: "savedAsPdf",
    title: "PDF version ready",
    body: "A clean PDF version is available for employer application systems.",
  },
  {
    key: "readyForSecureUpload",
    title: "Ready for secure upload later",
    body: "You are ready to upload once ApplyReady account storage is available.",
  },
];

function formatUpdatedAt(value: string): string {
  if (!value) return "Not saved yet";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Saved recently";

  return `Last saved ${date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })}`;
}

export default function ApplyReadyResumePage() {
  const [status, setStatus] = useState<ApplyReadyResumeStatus>(
    EMPTY_APPLYREADY_RESUME_STATUS
  );
  const [ready, setReady] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");

  useEffect(() => {
    setStatus(getApplyReadyResumeStatus());
    setReady(true);
  }, []);

  const completion = useMemo(() => calculateApplyReadyResumeCompletion(status), [status]);
  const started = isApplyReadyResumeStarted(status);

  function updateField(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = event.target;

    setStatus((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function updateChecklist(key: keyof ApplyReadyResumeStatus, checked: boolean) {
    setStatus((current) => ({
      ...current,
      [key]: checked,
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    saveApplyReadyResumeStatus(status);
    setStatus(getApplyReadyResumeStatus());
    setSavedMessage("Resume readiness status saved in this browser.");
    window.setTimeout(() => setSavedMessage(""), 3500);
  }

  function handleClear() {
    const confirmed = window.confirm(
      "Clear this Resume Vault readiness draft from this browser?"
    );

    if (!confirmed) return;

    clearApplyReadyResumeStatus();
    setStatus(EMPTY_APPLYREADY_RESUME_STATUS);
    setSavedMessage("Resume readiness status cleared.");
    window.setTimeout(() => setSavedMessage(""), 3500);
  }

  const metaTitle = "Resume Vault | ApplyReady | MedicaidReady Careers";
  const metaDescription =
    "Prepare your resume readiness status for ApplyReady. Resume file upload will come after secure account storage and privacy controls are ready.";

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={CANONICAL_URL} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={CANONICAL_URL} />
        <meta property="og:site_name" content="MedicaidReady Careers" />
      </Head>

      <CareersShell>
        <main className="arr-page">
          <section className="arr-hero">
            <div className="arr-hero-glow" />
            <div className="careers-container arr-hero-inner">
              <div className="arr-breadcrumbs">
                <Link href="/careers">Careers</Link>
                <span>/</span>
                <Link href="/careers/applyready">ApplyReady</Link>
                <span>/</span>
                <span>Resume Vault</span>
              </div>

              <div className="arr-hero-grid">
                <div>
                  <p className="arr-eyebrow">Resume Vault</p>
                  <h1>Prepare your resume before secure upload goes live.</h1>
                  <p>
                    Track resume readiness now without uploading private files. Secure resume
                    storage will come after account sign-in, database storage, delete controls,
                    and privacy wording are ready.
                  </p>

                  <div className="arr-actions">
                    <Link href="/careers/applyready/dashboard" className="arr-primary">
                      Open Dashboard
                    </Link>
                    <Link href="/careers/applyready/profile" className="arr-secondary">
                      Candidate Profile
                    </Link>
                  </div>
                </div>

                <aside className="arr-panel">
                  <span>Resume readiness</span>
                  <strong>{ready ? `${completion}%` : "0%"}</strong>
                  <p>{started ? "Resume readiness draft started." : "No resume status saved yet."}</p>
                  <small>{formatUpdatedAt(status.updatedAt)}</small>
                </aside>
              </div>
            </div>
          </section>

          <section className="careers-section">
            <div className="careers-container">
              <div className="arr-layout">
                <form className="arr-form" onSubmit={handleSubmit}>
                  <div className="arr-form-head">
                    <div>
                      <p className="arr-eyebrow arr-eyebrow-dark">Resume readiness</p>
                      <h2>Track the resume you plan to use for applications.</h2>
                    </div>
                    {savedMessage && <span className="arr-save-message">{savedMessage}</span>}
                  </div>

                  <div className="arr-form-grid">
                    <label className="arr-field">
                      <span>Resume name or label</span>
                      <input
                        name="resumeName"
                        type="text"
                        value={status.resumeName}
                        onChange={updateField}
                        placeholder="Program Analyst Resume, Data Analyst Resume"
                      />
                    </label>

                    <label className="arr-field">
                      <span>Target role</span>
                      <input
                        name="targetRole"
                        type="text"
                        value={status.targetRole}
                        onChange={updateField}
                        placeholder="Program Analyst, Data Analyst, Cybersecurity Analyst"
                      />
                    </label>

                    <label className="arr-field">
                      <span>Resume format</span>
                      <select
                        name="resumeFormat"
                        value={status.resumeFormat}
                        onChange={updateField}
                      >
                        {FORMAT_OPTIONS.map((option) => (
                          <option key={option || "blank"} value={option}>
                            {option || "Select format"}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="arr-field">
                      <span>Where is the resume saved?</span>
                      <input
                        name="resumeLocation"
                        type="text"
                        value={status.resumeLocation}
                        onChange={updateField}
                        placeholder="My laptop, Google Drive, OneDrive, email"
                      />
                    </label>

                    <label className="arr-field arr-field-wide">
                      <span>Resume notes</span>
                      <textarea
                        name="notes"
                        value={status.notes}
                        onChange={updateField}
                        placeholder="What needs to be improved, rewritten, added, or tailored before applying?"
                      />
                    </label>
                  </div>

                  <div className="arr-checklist">
                    <div className="arr-checklist-head">
                      <p className="arr-eyebrow arr-eyebrow-dark">Checklist</p>
                      <h3>Resume readiness checklist</h3>
                    </div>

                    <div className="arr-checklist-grid">
                      {CHECKLIST_ITEMS.map((item) => (
                        <label
                          key={item.key}
                          className={`arr-check-card${status[item.key] ? " is-checked" : ""}`}
                        >
                          <input
                            type="checkbox"
                            checked={Boolean(status[item.key])}
                            onChange={(event) => updateChecklist(item.key, event.target.checked)}
                          />
                          <span className="arr-check-box" aria-hidden="true" />
                          <span className="arr-check-copy">
                            <strong>{item.title}</strong>
                            <small>{item.body}</small>
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="arr-form-actions">
                    <button type="submit" className="arr-submit">
                      Save Resume Status
                    </button>
                    <button type="button" className="arr-clear" onClick={handleClear}>
                      Clear Status
                    </button>
                  </div>

                  <p className="arr-local-note">
                    No resume file is uploaded on this page. This is a browser-saved
                    readiness draft only.
                  </p>
                </form>

                <aside className="arr-side">
                  <div className="arr-side-card arr-side-card-warning">
                    <div className="arr-side-title">Why upload is not live yet</div>
                    <p>
                      Resumes include private information. File upload should wait until
                      account sign-in, secure storage, replacement controls, delete controls,
                      and privacy wording are ready.
                    </p>
                  </div>

                  <div className="arr-side-card">
                    <div className="arr-side-title">What this page does now</div>
                    <p>
                      It helps candidates track whether their resume is ready, where the file
                      currently lives, which role it targets, and what still needs work.
                    </p>
                  </div>

                  <div className="arr-side-card arr-side-card-dark">
                    <div className="arr-side-title">Next build</div>
                    <p>
                      After this is clean, we connect Resume Vault status into the dashboard.
                      Then we can move toward Application Tracker foundation.
                    </p>
                    <Link href="/careers/applyready/dashboard">Back to dashboard</Link>
                  </div>
                </aside>
              </div>
            </div>
          </section>
        </main>
      </CareersShell>

      <style jsx global>{`
        .arr-page {
          background: #f8fafc;
          color: #0f172a;
        }

        .arr-hero {
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(circle at 18% 20%, rgba(239, 159, 39, 0.22), transparent 28%),
            radial-gradient(circle at 86% 18%, rgba(133, 183, 235, 0.2), transparent 34%),
            linear-gradient(135deg, #061b3a 0%, #07335f 58%, #0c447c 100%);
          color: #ffffff;
        }

        .arr-hero-glow {
          position: absolute;
          right: -180px;
          bottom: -220px;
          width: 520px;
          height: 520px;
          border-radius: 999px;
          background: rgba(133, 183, 235, 0.18);
          filter: blur(10px);
          pointer-events: none;
        }

        .arr-hero-inner {
          position: relative;
          padding-top: 46px;
          padding-bottom: 76px;
        }

        .arr-breadcrumbs {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          align-items: center;
          margin-bottom: 34px;
          color: rgba(255, 255, 255, 0.68);
          font-size: 13px;
          font-weight: 850;
        }

        .arr-breadcrumbs a {
          color: rgba(255, 255, 255, 0.84);
          text-decoration: none;
        }

        .arr-breadcrumbs a:hover {
          color: #f5b942;
        }

        .arr-hero-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 340px;
          gap: 34px;
          align-items: center;
        }

        .arr-eyebrow {
          margin: 0;
          color: #f5b942;
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .arr-eyebrow-dark {
          color: #0c447c;
        }

        .arr-hero h1 {
          max-width: 900px;
          margin: 14px 0 0;
          color: #ffffff;
          font-size: clamp(42px, 6vw, 76px);
          line-height: 0.96;
          letter-spacing: -0.06em;
          font-weight: 950;
        }

        .arr-hero p {
          max-width: 760px;
          margin: 24px 0 0;
          color: rgba(255, 255, 255, 0.78);
          font-size: 18px;
          line-height: 1.72;
        }

        .arr-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 30px;
        }

        .arr-primary,
        .arr-secondary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          padding: 13px 21px;
          font-size: 14px;
          font-weight: 950;
          text-decoration: none;
          transition:
            transform 140ms ease,
            background 140ms ease,
            border-color 140ms ease,
            color 140ms ease;
        }

        .arr-primary {
          background: #f5b942;
          color: #061b3a;
        }

        .arr-primary:hover {
          background: #ffd978;
          transform: translateY(-1px);
        }

        .arr-secondary {
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.22);
        }

        .arr-secondary:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-1px);
        }

        .arr-panel {
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 28px;
          background: rgba(255, 255, 255, 0.08);
          padding: 26px;
          box-shadow: 0 28px 70px rgba(0, 0, 0, 0.28);
          backdrop-filter: blur(18px);
        }

        .arr-panel span {
          display: block;
          color: #f5b942;
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .arr-panel strong {
          display: block;
          margin-top: 16px;
          color: #ffffff;
          font-size: 58px;
          line-height: 1;
          font-weight: 950;
          letter-spacing: -0.06em;
        }

        .arr-panel p {
          margin: 12px 0 0;
          color: rgba(255, 255, 255, 0.72);
          font-size: 14px;
          line-height: 1.6;
        }

        .arr-panel small {
          display: block;
          margin-top: 10px;
          color: rgba(255, 255, 255, 0.58);
          font-size: 12px;
          font-weight: 750;
        }

        .arr-layout {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 330px;
          gap: 24px;
          align-items: start;
        }

        .arr-form {
          border: 1px solid #dbe5f0;
          border-radius: 28px;
          background: #ffffff;
          padding: 28px;
          box-shadow: 0 14px 34px rgba(4, 44, 83, 0.06);
        }

        .arr-form-head {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          align-items: flex-start;
          margin-bottom: 24px;
        }

        .arr-form-head h2 {
          max-width: 760px;
          margin: 10px 0 0;
          color: #061b3a;
          font-size: clamp(30px, 4vw, 44px);
          line-height: 1.06;
          letter-spacing: -0.045em;
          font-weight: 950;
        }

        .arr-save-message {
          display: inline-flex;
          width: fit-content;
          border: 1px solid #bbf7d0;
          border-radius: 999px;
          background: #f0fdf4;
          color: #15803d;
          padding: 8px 12px;
          font-size: 12px;
          font-weight: 900;
          white-space: nowrap;
        }

        .arr-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .arr-field {
          display: grid;
          gap: 7px;
        }

        .arr-field-wide {
          grid-column: 1 / -1;
        }

        .arr-field span {
          color: #042c53;
          font-size: 13px;
          font-weight: 900;
        }

        .arr-field input,
        .arr-field select,
        .arr-field textarea {
          width: 100%;
          border: 1.5px solid #dbe5f0;
          border-radius: 14px;
          background: #ffffff;
          color: #0f172a;
          padding: 13px 14px;
          font-size: 15px;
          line-height: 1.5;
          font-family: inherit;
          outline: none;
          box-sizing: border-box;
          transition:
            border-color 140ms ease,
            box-shadow 140ms ease;
        }

        .arr-field textarea {
          min-height: 104px;
          resize: vertical;
        }

        .arr-field input:focus,
        .arr-field select:focus,
        .arr-field textarea:focus {
          border-color: #0c447c;
          box-shadow: 0 0 0 3px rgba(12, 68, 124, 0.12);
        }

        .arr-checklist {
          margin-top: 26px;
          border-top: 1px solid #e2e8f0;
          padding-top: 24px;
        }

        .arr-checklist-head h3 {
          margin: 8px 0 0;
          color: #061b3a;
          font-size: 24px;
          line-height: 1.12;
          letter-spacing: -0.035em;
          font-weight: 950;
        }

        .arr-checklist-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-top: 18px;
        }

        .arr-check-card {
          display: flex;
          gap: 11px;
          align-items: flex-start;
          border: 1px solid #dbe5f0;
          border-radius: 18px;
          background: #f8fafc;
          padding: 14px;
          cursor: pointer;
          transition:
            border-color 140ms ease,
            background 140ms ease,
            box-shadow 140ms ease;
        }

        .arr-check-card:hover {
          border-color: #ba7517;
          background: #fffdf7;
        }

        .arr-check-card input {
          position: absolute;
          opacity: 0;
          pointer-events: none;
        }

        .arr-check-box {
          width: 20px;
          height: 20px;
          border-radius: 6px;
          border: 1.7px solid #94a3b8;
          background: #ffffff;
          flex-shrink: 0;
          margin-top: 1px;
          position: relative;
        }

        .arr-check-box::after {
          content: "✓";
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          font-size: 13px;
          font-weight: 950;
          opacity: 0;
        }

        .arr-check-card.is-checked {
          border-color: #ba7517;
          background: #fff7e6;
          box-shadow: 0 10px 24px rgba(186, 117, 23, 0.08);
        }

        .arr-check-card.is-checked .arr-check-box {
          border-color: #ba7517;
          background: #ba7517;
        }

        .arr-check-card.is-checked .arr-check-box::after {
          opacity: 1;
        }

        .arr-check-copy {
          display: grid;
          gap: 5px;
        }

        .arr-check-copy strong {
          color: #042c53;
          font-size: 14px;
          line-height: 1.25;
          font-weight: 950;
        }

        .arr-check-copy small {
          color: #64748b;
          font-size: 12px;
          line-height: 1.55;
          font-weight: 650;
        }

        .arr-form-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 22px;
        }

        .arr-submit,
        .arr-clear {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          min-height: 46px;
          padding: 0 18px;
          font-family: inherit;
          font-size: 14px;
          font-weight: 950;
          cursor: pointer;
          transition:
            transform 140ms ease,
            background 140ms ease,
            border-color 140ms ease,
            color 140ms ease;
        }

        .arr-submit {
          border: 1px solid #021c38;
          background: #042c53;
          color: #ffffff;
          box-shadow: inset 0 -2px 0 #ba7517;
        }

        .arr-submit:hover {
          background: #0c447c;
          transform: translateY(-1px);
        }

        .arr-clear {
          border: 1px solid #cfdced;
          background: #ffffff;
          color: #334155;
        }

        .arr-clear:hover {
          border-color: #ba7517;
          background: #fff7e6;
          color: #ba7517;
          transform: translateY(-1px);
        }

        .arr-local-note {
          margin: 18px 0 0;
          color: #64748b;
          font-size: 13px;
          line-height: 1.65;
        }

        .arr-side {
          display: grid;
          gap: 14px;
        }

        .arr-side-card {
          border: 1px solid #dbe5f0;
          border-radius: 22px;
          background: #ffffff;
          padding: 20px;
          box-shadow: 0 14px 34px rgba(4, 44, 83, 0.06);
        }

        .arr-side-title {
          color: #042c53;
          font-size: 15px;
          font-weight: 950;
          letter-spacing: -0.02em;
        }

        .arr-side-card p {
          margin: 9px 0 0;
          color: #64748b;
          font-size: 14px;
          line-height: 1.68;
        }

        .arr-side-card-warning {
          background:
            radial-gradient(circle at top right, rgba(239, 159, 39, 0.18), transparent 34%),
            #ffffff;
        }

        .arr-side-card-dark {
          background:
            radial-gradient(circle at top right, rgba(239, 159, 39, 0.15), transparent 34%),
            #061b3a;
          border-color: rgba(255, 255, 255, 0.12);
          color: #ffffff;
        }

        .arr-side-card-dark .arr-side-title {
          color: #ffffff;
        }

        .arr-side-card-dark p {
          color: rgba(255, 255, 255, 0.72);
        }

        .arr-side-card-dark a {
          display: inline-flex;
          margin-top: 14px;
          color: #f5b942;
          font-size: 13px;
          font-weight: 950;
          text-decoration: none;
        }

        @media (max-width: 980px) {
          .arr-hero-grid,
          .arr-layout {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 680px) {
          .arr-hero h1 {
            font-size: clamp(40px, 13vw, 58px);
          }

          .arr-form-grid,
          .arr-checklist-grid {
            grid-template-columns: 1fr;
          }

          .arr-form-head {
            flex-direction: column;
          }

          .arr-panel,
          .arr-form,
          .arr-side-card {
            border-radius: 22px;
          }

          .arr-actions,
          .arr-form-actions {
            flex-direction: column;
            align-items: stretch;
          }

          .arr-primary,
          .arr-secondary,
          .arr-submit,
          .arr-clear {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
}