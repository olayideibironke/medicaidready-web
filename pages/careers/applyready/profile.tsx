import Head from "next/head";
import Link from "next/link";
import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import CareersShell from "../../../components/careers/CareersShell";
import {
  clearApplyReadyProfile,
  EMPTY_APPLYREADY_PROFILE,
  getApplyReadyProfile,
  isApplyReadyProfileStarted,
  saveApplyReadyProfile,
  type ApplyReadyProfile,
} from "../../../lib/careers/applyReadyProfile";

const SITE_URL = "https://www.medicaidready.org";
const PAGE_PATH = "/careers/applyready/profile";
const CANONICAL_URL = `${SITE_URL}${PAGE_PATH}`;

const WORK_MODE_OPTIONS = [
  "",
  "Remote",
  "Hybrid",
  "On-site",
  "Open to any",
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

export default function ApplyReadyProfilePage() {
  const [profile, setProfile] = useState<ApplyReadyProfile>(EMPTY_APPLYREADY_PROFILE);
  const [ready, setReady] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");

  useEffect(() => {
    setProfile(getApplyReadyProfile());
    setReady(true);
  }, []);

  const completion = useMemo(() => {
    const fields = [
      profile.fullName,
      profile.email,
      profile.location,
      profile.preferredRoles,
      profile.workMode,
      profile.salaryGoal,
      profile.skills,
      profile.careerInterests,
    ];

    const completed = fields.filter((field) => field.trim()).length;

    return Math.round((completed / fields.length) * 100);
  }, [profile]);

  const started = isApplyReadyProfileStarted(profile);

  function updateField(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = event.target;

    setProfile((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    saveApplyReadyProfile(profile);
    setProfile(getApplyReadyProfile());
    setSavedMessage("Profile draft saved in this browser.");

    window.setTimeout(() => setSavedMessage(""), 3500);
  }

  function handleClear() {
    const confirmed = window.confirm(
      "Clear this ApplyReady profile draft from this browser?"
    );

    if (!confirmed) return;

    clearApplyReadyProfile();
    setProfile(EMPTY_APPLYREADY_PROFILE);
    setSavedMessage("Profile draft cleared.");
    window.setTimeout(() => setSavedMessage(""), 3500);
  }

  const metaTitle = "Candidate Profile | ApplyReady | MedicaidReady Careers";
  const metaDescription =
    "Build an ApplyReady candidate profile draft with preferred roles, skills, work setting, location, salary goals, and career interests.";

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
        <main className="arp-page">
          <section className="arp-hero">
            <div className="arp-hero-glow" />
            <div className="careers-container arp-hero-inner">
              <div className="arp-breadcrumbs">
                <Link href="/careers">Careers</Link>
                <span>/</span>
                <Link href="/careers/applyready">ApplyReady</Link>
                <span>/</span>
                <span>Profile</span>
              </div>

              <div className="arp-hero-grid">
                <div>
                  <p className="arp-eyebrow">Candidate Profile</p>
                  <h1>Build your ApplyReady profile draft.</h1>
                  <p>
                    Add your preferred roles, skills, location, work setting, salary goal,
                    and career interests so ApplyReady can become more useful as profile,
                    resume, tracker, and AI tools are added.
                  </p>

                  <div className="arp-actions">
                    <Link href="/careers/applyready/dashboard" className="arp-primary">
                      Open Dashboard
                    </Link>
                    <Link href="/careers/saved-jobs" className="arp-secondary">
                      View Saved Jobs
                    </Link>
                  </div>
                </div>

                <aside className="arp-panel">
                  <span>Profile completion</span>
                  <strong>{ready ? `${completion}%` : "0%"}</strong>
                  <p>{started ? "Profile draft started." : "No profile draft saved yet."}</p>
                  <small>{formatUpdatedAt(profile.updatedAt)}</small>
                </aside>
              </div>
            </div>
          </section>

          <section className="careers-section">
            <div className="careers-container">
              <div className="arp-layout">
                <form className="arp-form" onSubmit={handleSubmit}>
                  <div className="arp-form-head">
                    <div>
                      <p className="arp-eyebrow arp-eyebrow-dark">Profile details</p>
                      <h2>Tell ApplyReady what kind of opportunities fit you.</h2>
                    </div>
                    {savedMessage && <span className="arp-save-message">{savedMessage}</span>}
                  </div>

                  <div className="arp-form-grid">
                    <label className="arp-field">
                      <span>Full name</span>
                      <input
                        name="fullName"
                        type="text"
                        value={profile.fullName}
                        onChange={updateField}
                        placeholder="Your name"
                        autoComplete="name"
                      />
                    </label>

                    <label className="arp-field">
                      <span>Email</span>
                      <input
                        name="email"
                        type="email"
                        value={profile.email}
                        onChange={updateField}
                        placeholder="you@example.com"
                        autoComplete="email"
                      />
                    </label>

                    <label className="arp-field">
                      <span>Location</span>
                      <input
                        name="location"
                        type="text"
                        value={profile.location}
                        onChange={updateField}
                        placeholder="City, state, or remote"
                        autoComplete="address-level2"
                      />
                    </label>

                    <label className="arp-field">
                      <span>Preferred work setting</span>
                      <select name="workMode" value={profile.workMode} onChange={updateField}>
                        {WORK_MODE_OPTIONS.map((option) => (
                          <option key={option || "blank"} value={option}>
                            {option || "Select preference"}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="arp-field arp-field-wide">
                      <span>Preferred roles</span>
                      <input
                        name="preferredRoles"
                        type="text"
                        value={profile.preferredRoles}
                        onChange={updateField}
                        placeholder="Program Analyst, Data Analyst, Cybersecurity, Cloud Engineer"
                      />
                    </label>

                    <label className="arp-field arp-field-wide">
                      <span>Salary goal</span>
                      <input
                        name="salaryGoal"
                        type="text"
                        value={profile.salaryGoal}
                        onChange={updateField}
                        placeholder="$90,000+, $120,000 target, flexible, or open"
                      />
                    </label>

                    <label className="arp-field arp-field-wide">
                      <span>Skills</span>
                      <textarea
                        name="skills"
                        value={profile.skills}
                        onChange={updateField}
                        placeholder="Excel, SQL, Power BI, compliance, case management, project coordination, cloud tools"
                      />
                    </label>

                    <label className="arp-field arp-field-wide">
                      <span>Career interests</span>
                      <textarea
                        name="careerInterests"
                        value={profile.careerInterests}
                        onChange={updateField}
                        placeholder="What roles, industries, or career paths do you want ApplyReady to support?"
                      />
                    </label>
                  </div>

                  <div className="arp-form-actions">
                    <button type="submit" className="arp-submit">
                      Save Profile Draft
                    </button>
                    <button type="button" className="arp-clear" onClick={handleClear}>
                      Clear Draft
                    </button>
                  </div>

                  <p className="arp-local-note">
                    This profile draft is saved only in this browser for now. Full account
                    sign-in, database storage, and resume upload will come later.
                  </p>
                </form>

                <aside className="arp-side">
                  <div className="arp-side-card">
                    <div className="arp-side-title">Why this comes first</div>
                    <p>
                      A profile gives ApplyReady the structure needed for better saved jobs,
                      tracker statuses, resume matching, and future AI-supported tools.
                    </p>
                  </div>

                  <div className="arp-side-card">
                    <div className="arp-side-title">Not resume storage yet</div>
                    <p>
                      Resumes can include private details. Uploads should wait until secure
                      accounts, storage, delete controls, and privacy wording are ready.
                    </p>
                  </div>

                  <div className="arp-side-card arp-side-card-dark">
                    <div className="arp-side-title">Next build</div>
                    <p>
                      After this profile page is clean, we connect profile status into the
                      dashboard and then build the resume vault placeholder.
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
        .arp-page {
          background: #f8fafc;
          color: #0f172a;
        }

        .arp-hero {
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(circle at 18% 20%, rgba(239, 159, 39, 0.22), transparent 28%),
            radial-gradient(circle at 86% 18%, rgba(133, 183, 235, 0.2), transparent 34%),
            linear-gradient(135deg, #061b3a 0%, #07335f 58%, #0c447c 100%);
          color: #ffffff;
        }

        .arp-hero-glow {
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

        .arp-hero-inner {
          position: relative;
          padding-top: 46px;
          padding-bottom: 76px;
        }

        .arp-breadcrumbs {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          align-items: center;
          margin-bottom: 34px;
          color: rgba(255, 255, 255, 0.68);
          font-size: 13px;
          font-weight: 850;
        }

        .arp-breadcrumbs a {
          color: rgba(255, 255, 255, 0.84);
          text-decoration: none;
        }

        .arp-breadcrumbs a:hover {
          color: #f5b942;
        }

        .arp-hero-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 340px;
          gap: 34px;
          align-items: center;
        }

        .arp-eyebrow {
          margin: 0;
          color: #f5b942;
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .arp-eyebrow-dark {
          color: #0c447c;
        }

        .arp-hero h1 {
          max-width: 900px;
          margin: 14px 0 0;
          color: #ffffff;
          font-size: clamp(42px, 6vw, 76px);
          line-height: 0.96;
          letter-spacing: -0.06em;
          font-weight: 950;
        }

        .arp-hero p {
          max-width: 760px;
          margin: 24px 0 0;
          color: rgba(255, 255, 255, 0.78);
          font-size: 18px;
          line-height: 1.72;
        }

        .arp-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 30px;
        }

        .arp-primary,
        .arp-secondary {
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

        .arp-primary {
          background: #f5b942;
          color: #061b3a;
        }

        .arp-primary:hover {
          background: #ffd978;
          transform: translateY(-1px);
        }

        .arp-secondary {
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.22);
        }

        .arp-secondary:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-1px);
        }

        .arp-panel {
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 28px;
          background: rgba(255, 255, 255, 0.08);
          padding: 26px;
          box-shadow: 0 28px 70px rgba(0, 0, 0, 0.28);
          backdrop-filter: blur(18px);
        }

        .arp-panel span {
          display: block;
          color: #f5b942;
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .arp-panel strong {
          display: block;
          margin-top: 16px;
          color: #ffffff;
          font-size: 58px;
          line-height: 1;
          font-weight: 950;
          letter-spacing: -0.06em;
        }

        .arp-panel p {
          margin: 12px 0 0;
          color: rgba(255, 255, 255, 0.72);
          font-size: 14px;
          line-height: 1.6;
        }

        .arp-panel small {
          display: block;
          margin-top: 10px;
          color: rgba(255, 255, 255, 0.58);
          font-size: 12px;
          font-weight: 750;
        }

        .arp-layout {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 330px;
          gap: 24px;
          align-items: start;
        }

        .arp-form {
          border: 1px solid #dbe5f0;
          border-radius: 28px;
          background: #ffffff;
          padding: 28px;
          box-shadow: 0 14px 34px rgba(4, 44, 83, 0.06);
        }

        .arp-form-head {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          align-items: flex-start;
          margin-bottom: 24px;
        }

        .arp-form-head h2 {
          max-width: 760px;
          margin: 10px 0 0;
          color: #061b3a;
          font-size: clamp(30px, 4vw, 44px);
          line-height: 1.06;
          letter-spacing: -0.045em;
          font-weight: 950;
        }

        .arp-save-message {
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

        .arp-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .arp-field {
          display: grid;
          gap: 7px;
        }

        .arp-field-wide {
          grid-column: 1 / -1;
        }

        .arp-field span {
          color: #042c53;
          font-size: 13px;
          font-weight: 900;
        }

        .arp-field input,
        .arp-field select,
        .arp-field textarea {
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

        .arp-field textarea {
          min-height: 104px;
          resize: vertical;
        }

        .arp-field input:focus,
        .arp-field select:focus,
        .arp-field textarea:focus {
          border-color: #0c447c;
          box-shadow: 0 0 0 3px rgba(12, 68, 124, 0.12);
        }

        .arp-form-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 22px;
        }

        .arp-submit,
        .arp-clear {
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

        .arp-submit {
          border: 1px solid #021c38;
          background: #042c53;
          color: #ffffff;
          box-shadow: inset 0 -2px 0 #ba7517;
        }

        .arp-submit:hover {
          background: #0c447c;
          transform: translateY(-1px);
        }

        .arp-clear {
          border: 1px solid #cfdced;
          background: #ffffff;
          color: #334155;
        }

        .arp-clear:hover {
          border-color: #ba7517;
          background: #fff7e6;
          color: #ba7517;
          transform: translateY(-1px);
        }

        .arp-local-note {
          margin: 18px 0 0;
          color: #64748b;
          font-size: 13px;
          line-height: 1.65;
        }

        .arp-side {
          display: grid;
          gap: 14px;
        }

        .arp-side-card {
          border: 1px solid #dbe5f0;
          border-radius: 22px;
          background: #ffffff;
          padding: 20px;
          box-shadow: 0 14px 34px rgba(4, 44, 83, 0.06);
        }

        .arp-side-title {
          color: #042c53;
          font-size: 15px;
          font-weight: 950;
          letter-spacing: -0.02em;
        }

        .arp-side-card p {
          margin: 9px 0 0;
          color: #64748b;
          font-size: 14px;
          line-height: 1.68;
        }

        .arp-side-card-dark {
          background:
            radial-gradient(circle at top right, rgba(239, 159, 39, 0.15), transparent 34%),
            #061b3a;
          border-color: rgba(255, 255, 255, 0.12);
          color: #ffffff;
        }

        .arp-side-card-dark .arp-side-title {
          color: #ffffff;
        }

        .arp-side-card-dark p {
          color: rgba(255, 255, 255, 0.72);
        }

        .arp-side-card-dark a {
          display: inline-flex;
          margin-top: 14px;
          color: #f5b942;
          font-size: 13px;
          font-weight: 950;
          text-decoration: none;
        }

        @media (max-width: 980px) {
          .arp-hero-grid,
          .arp-layout {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 680px) {
          .arp-hero h1 {
            font-size: clamp(40px, 13vw, 58px);
          }

          .arp-form-grid {
            grid-template-columns: 1fr;
          }

          .arp-form-head {
            flex-direction: column;
          }

          .arp-panel,
          .arp-form,
          .arp-side-card {
            border-radius: 22px;
          }

          .arp-actions,
          .arp-form-actions {
            flex-direction: column;
            align-items: stretch;
          }

          .arp-primary,
          .arp-secondary,
          .arp-submit,
          .arp-clear {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
}