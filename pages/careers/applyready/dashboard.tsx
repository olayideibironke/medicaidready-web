import Head from "next/head";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import CareersShell from "../../../components/careers/CareersShell";
import { getSavedJobRecords } from "../../../lib/careers/applyReadyStorage";
import {
  EMPTY_APPLYREADY_PROFILE,
  getApplyReadyProfile,
  isApplyReadyProfileStarted,
  type ApplyReadyProfile,
} from "../../../lib/careers/applyReadyProfile";
import {
  calculateApplyReadyResumeCompletion,
  EMPTY_APPLYREADY_RESUME_STATUS,
  getApplyReadyResumeStatus,
  isApplyReadyResumeStarted,
  type ApplyReadyResumeStatus,
} from "../../../lib/careers/applyReadyResume";

const SITE_URL = "https://www.medicaidready.org";
const PAGE_PATH = "/careers/applyready/dashboard";
const CANONICAL_URL = `${SITE_URL}${PAGE_PATH}`;

const AI_ITEMS = [
  "Resume review",
  "Role match score",
  "Resume rewrite",
  "Cover letter draft",
  "Recruiter summary",
  "Interview prep notes",
];

function calculateProfileCompletion(profile: ApplyReadyProfile): number {
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
}

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

export default function ApplyReadyDashboardPage() {
  const [savedCount, setSavedCount] = useState(0);
  const [profile, setProfile] = useState<ApplyReadyProfile>(EMPTY_APPLYREADY_PROFILE);
  const [resumeStatus, setResumeStatus] = useState<ApplyReadyResumeStatus>(
    EMPTY_APPLYREADY_RESUME_STATUS
  );
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => {
      setSavedCount(getSavedJobRecords().length);
      setProfile(getApplyReadyProfile());
      setResumeStatus(getApplyReadyResumeStatus());
      setReady(true);
    };

    sync();

    window.addEventListener("storage", sync);
    window.addEventListener("applyready:saved-jobs-updated", sync);
    window.addEventListener("applyready:profile-updated", sync);
    window.addEventListener("applyready:resume-updated", sync);

    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("applyready:saved-jobs-updated", sync);
      window.removeEventListener("applyready:profile-updated", sync);
      window.removeEventListener("applyready:resume-updated", sync);
    };
  }, []);

  const profileStarted = isApplyReadyProfileStarted(profile);
  const profileCompletion = calculateProfileCompletion(profile);
  const resumeStarted = isApplyReadyResumeStarted(resumeStatus);
  const resumeCompletion = calculateApplyReadyResumeCompletion(resumeStatus);

  const foundationItems = useMemo(
    () => [
      {
        title: "Candidate Profile",
        status: profileStarted ? `${profileCompletion}% complete` : "Ready to start",
        description:
          "Create your career profile with preferred roles, skills, work setting, location, and salary goals.",
        href: "/careers/applyready/profile",
      },
      {
        title: "Resume Vault",
        status: resumeStarted ? `${resumeCompletion}% ready` : "Ready to start",
        description:
          "Track resume readiness before secure account storage and file upload are added.",
        href: "/careers/applyready/resume",
      },
      {
        title: "Saved Jobs",
        status: savedCount === 1 ? "1 saved job" : `${savedCount} saved jobs`,
        description:
          "Save jobs from the job board and job detail pages, then return to them in your ApplyReady list.",
        href: "/careers/saved-jobs",
      },
      {
        title: "Application Tracker",
        status: "Next foundation",
        description:
          "Track saved, preparing, applied, interview, offer, not selected, and follow-up statuses.",
        href: "/careers/applyready/tracker",
      },
    ],
    [profileCompletion, profileStarted, resumeCompletion, resumeStarted, savedCount]
  );

  const metaTitle = "ApplyReady Dashboard | MedicaidReady Careers";
  const metaDescription =
    "ApplyReady dashboard foundation for candidate profiles, saved jobs, resume vault, application tracking, and AI-supported job preparation tools.";

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
        <main className="ard-page">
          <section className="ard-hero">
            <div className="ard-hero-glow" />
            <div className="careers-container ard-hero-inner">
              <div className="ard-breadcrumbs">
                <Link href="/careers">Careers</Link>
                <span>/</span>
                <Link href="/careers/applyready">ApplyReady</Link>
                <span>/</span>
                <span>Dashboard</span>
              </div>

              <div className="ard-hero-grid">
                <div>
                  <p className="ard-eyebrow">ApplyReady Dashboard</p>
                  <h1>Your career preparation command center.</h1>
                  <p>
                    Track your ApplyReady foundation in one place. Start with your candidate
                    profile, prepare your resume, save jobs that fit your goals, and move
                    toward application tracking with a cleaner plan.
                  </p>

                  <div className="ard-actions">
                    <Link href="/careers/applyready/profile" className="ard-primary">
                      Build Profile
                    </Link>
                    <Link href="/careers/applyready/resume" className="ard-secondary">
                      Resume Vault
                    </Link>
                  </div>
                </div>

                <aside className="ard-panel">
                  <span>Current progress</span>

                  <div className="ard-panel-metrics">
                    <div>
                      <strong>{ready ? `${profileCompletion}%` : "0%"}</strong>
                      <small>Profile</small>
                    </div>
                    <div>
                      <strong>{ready ? `${resumeCompletion}%` : "0%"}</strong>
                      <small>Resume</small>
                    </div>
                    <div>
                      <strong>{ready ? savedCount : 0}</strong>
                      <small>Saved jobs</small>
                    </div>
                  </div>

                  <p>
                    {profileStarted || resumeStarted || savedCount > 0
                      ? "Your ApplyReady foundation is underway."
                      : "Start your profile, resume readiness, or saved jobs list."}
                  </p>

                  <small>
                    Profile: {formatUpdatedAt(profile.updatedAt)}
                    <br />
                    Resume: {formatUpdatedAt(resumeStatus.updatedAt)}
                  </small>
                </aside>
              </div>
            </div>
          </section>

          <section className="careers-section">
            <div className="careers-container">
              <div className="ard-status">
                <div>
                  <p className="ard-eyebrow ard-eyebrow-dark">Build status</p>
                  <h2>What is live now and what comes next.</h2>
                </div>
                <p>
                  We are building ApplyReady as a real candidate preparation system. Saved
                  jobs, profile drafts, and resume readiness can start now. Resume file
                  upload and account-tied data should wait until sign-in, database, storage,
                  and privacy controls are ready.
                </p>
              </div>

              <div className="ard-grid">
                {foundationItems.map((item) => (
                  <Link href={item.href} className="ard-card" key={item.title}>
                    <div className="ard-card-top">
                      <h3>{item.title}</h3>
                      <span>{item.status}</span>
                    </div>
                    <p>{item.description}</p>
                    <strong>Open</strong>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          <section className="ard-profile-section">
            <div className="careers-container">
              <div className="ard-profile">
                <div>
                  <p className="ard-eyebrow">Profile foundation</p>
                  <h2>
                    {profileStarted
                      ? "Your candidate profile draft is underway."
                      : "Start your candidate profile before deeper matching tools."}
                  </h2>
                  <p>
                    The profile gives ApplyReady the context needed for saved jobs, resume
                    matching, tracker statuses, and future AI-supported tools. It is the
                    right foundation before we build full account-based resume upload.
                  </p>
                </div>

                <div className="ard-profile-card">
                  <div className="ard-progress-top">
                    <span>Profile completion</span>
                    <strong>{ready ? `${profileCompletion}%` : "0%"}</strong>
                  </div>

                  <div className="ard-progress-track">
                    <div
                      className="ard-progress-fill"
                      style={{ width: `${ready ? profileCompletion : 0}%` }}
                    />
                  </div>

                  <div className="ard-profile-facts">
                    <div>
                      <span>Name</span>
                      <strong>{profile.fullName.trim() || "Not added"}</strong>
                    </div>
                    <div>
                      <span>Preferred roles</span>
                      <strong>{profile.preferredRoles.trim() || "Not added"}</strong>
                    </div>
                    <div>
                      <span>Work setting</span>
                      <strong>{profile.workMode.trim() || "Not selected"}</strong>
                    </div>
                  </div>

                  <Link href="/careers/applyready/profile" className="ard-profile-link">
                    Continue profile
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <section className="ard-resume-section">
            <div className="careers-container">
              <div className="ard-resume">
                <div className="ard-resume-card">
                  <div className="ard-progress-top">
                    <span>Resume readiness</span>
                    <strong>{ready ? `${resumeCompletion}%` : "0%"}</strong>
                  </div>

                  <div className="ard-progress-track">
                    <div
                      className="ard-progress-fill ard-progress-fill-resume"
                      style={{ width: `${ready ? resumeCompletion : 0}%` }}
                    />
                  </div>

                  <div className="ard-profile-facts">
                    <div>
                      <span>Resume label</span>
                      <strong>{resumeStatus.resumeName.trim() || "Not added"}</strong>
                    </div>
                    <div>
                      <span>Target role</span>
                      <strong>{resumeStatus.targetRole.trim() || "Not added"}</strong>
                    </div>
                    <div>
                      <span>Format</span>
                      <strong>{resumeStatus.resumeFormat.trim() || "Not selected"}</strong>
                    </div>
                  </div>

                  <Link href="/careers/applyready/resume" className="ard-profile-link">
                    Continue resume vault
                  </Link>
                </div>

                <div>
                  <p className="ard-eyebrow ard-eyebrow-dark">Resume Vault</p>
                  <h2>
                    {resumeStarted
                      ? "Your resume readiness draft is underway."
                      : "Prepare resume readiness before file upload."}
                  </h2>
                  <p>
                    This stage tracks whether the candidate has a current resume, target role,
                    clean format, and readiness checklist. Actual resume upload should come
                    later with secure account storage, replacement controls, delete controls,
                    and privacy wording.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="ard-account-section">
            <div className="careers-container">
              <div className="ard-account">
                <div>
                  <p className="ard-eyebrow">Account foundation</p>
                  <h2>Profile and resume features need secure accounts.</h2>
                  <p>
                    Saved jobs can start in browser storage, but candidate profiles and
                    resumes should eventually be tied to secure accounts. That keeps user
                    data safer and gives us the right path for resume tools, tracker
                    history, and AI-supported preparation.
                  </p>
                </div>

                <div className="ard-account-steps">
                  <div>
                    <span>01</span>
                    <strong>Candidate profile</strong>
                    <p>Basic career preferences and skills. Foundation is now started.</p>
                  </div>
                  <div>
                    <span>02</span>
                    <strong>Resume readiness</strong>
                    <p>Resume Vault status is now started without unsafe file upload.</p>
                  </div>
                  <div>
                    <span>03</span>
                    <strong>Application tracker</strong>
                    <p>Track status after profile and resume structure are stable.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="careers-section">
            <div className="careers-container">
              <div className="ard-ai">
                <div>
                  <p className="ard-eyebrow ard-eyebrow-dark">AI tools later</p>
                  <h2>AI comes after profile and resume structure.</h2>
                  <p>
                    AI resume tools become more useful after we know the candidate profile,
                    target roles, saved jobs, and resume readiness. That is why we build the
                    foundation before charging into AI features.
                  </p>
                </div>

                <div className="ard-ai-list">
                  {AI_ITEMS.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </main>
      </CareersShell>

      <style jsx global>{`
        .ard-page {
          background: #f8fafc;
          color: #0f172a;
        }

        .ard-hero {
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(circle at 18% 20%, rgba(239, 159, 39, 0.22), transparent 28%),
            radial-gradient(circle at 86% 18%, rgba(133, 183, 235, 0.2), transparent 34%),
            linear-gradient(135deg, #061b3a 0%, #07335f 58%, #0c447c 100%);
          color: #ffffff;
        }

        .ard-hero-glow {
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

        .ard-hero-inner {
          position: relative;
          padding-top: 46px;
          padding-bottom: 76px;
        }

        .ard-breadcrumbs {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          align-items: center;
          margin-bottom: 34px;
          color: rgba(255, 255, 255, 0.68);
          font-size: 13px;
          font-weight: 850;
        }

        .ard-breadcrumbs a {
          color: rgba(255, 255, 255, 0.84);
          text-decoration: none;
        }

        .ard-breadcrumbs a:hover {
          color: #f5b942;
        }

        .ard-hero-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 430px;
          gap: 34px;
          align-items: center;
        }

        .ard-eyebrow {
          margin: 0;
          color: #f5b942;
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .ard-eyebrow-dark {
          color: #0c447c;
        }

        .ard-hero h1 {
          max-width: 900px;
          margin: 14px 0 0;
          color: #ffffff;
          font-size: clamp(42px, 6vw, 76px);
          line-height: 0.96;
          letter-spacing: -0.06em;
          font-weight: 950;
        }

        .ard-hero p {
          max-width: 760px;
          margin: 24px 0 0;
          color: rgba(255, 255, 255, 0.78);
          font-size: 18px;
          line-height: 1.72;
        }

        .ard-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 30px;
        }

        .ard-primary,
        .ard-secondary {
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

        .ard-primary {
          background: #f5b942;
          color: #061b3a;
        }

        .ard-primary:hover {
          background: #ffd978;
          transform: translateY(-1px);
        }

        .ard-secondary {
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.22);
        }

        .ard-secondary:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-1px);
        }

        .ard-panel {
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 28px;
          background: rgba(255, 255, 255, 0.08);
          padding: 26px;
          box-shadow: 0 28px 70px rgba(0, 0, 0, 0.28);
          backdrop-filter: blur(18px);
        }

        .ard-panel > span {
          display: block;
          color: #f5b942;
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .ard-panel-metrics {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-top: 18px;
        }

        .ard-panel-metrics div {
          border: 1px solid rgba(255, 255, 255, 0.11);
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.08);
          padding: 14px;
          min-width: 0;
        }

        .ard-panel strong {
          display: block;
          color: #ffffff;
          font-size: 27px;
          line-height: 1;
          font-weight: 950;
          letter-spacing: -0.06em;
        }

        .ard-panel small {
          display: block;
          margin-top: 8px;
          color: rgba(255, 255, 255, 0.62);
          font-size: 12px;
          font-weight: 750;
          line-height: 1.5;
        }

        .ard-panel p {
          margin: 18px 0 0;
          color: rgba(255, 255, 255, 0.72);
          font-size: 14px;
          line-height: 1.6;
        }

        .ard-status {
          display: grid;
          grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
          gap: 28px;
          align-items: start;
          margin-bottom: 24px;
        }

        .ard-status h2,
        .ard-profile h2,
        .ard-resume h2,
        .ard-account h2,
        .ard-ai h2 {
          margin: 10px 0 0;
          color: #061b3a;
          font-size: clamp(30px, 4vw, 46px);
          line-height: 1.05;
          letter-spacing: -0.045em;
          font-weight: 950;
        }

        .ard-status p,
        .ard-profile p,
        .ard-resume p,
        .ard-ai p {
          margin: 0;
          color: #475569;
          line-height: 1.75;
          font-size: 16px;
        }

        .ard-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .ard-card {
          display: grid;
          gap: 14px;
          border: 1px solid #dbe5f0;
          border-radius: 24px;
          background: #ffffff;
          padding: 22px;
          text-decoration: none;
          color: inherit;
          box-shadow: 0 14px 34px rgba(4, 44, 83, 0.06);
          transition:
            transform 140ms ease,
            border-color 140ms ease,
            box-shadow 140ms ease;
        }

        .ard-card:hover {
          transform: translateY(-2px);
          border-color: #ba7517;
          box-shadow: 0 18px 42px rgba(4, 44, 83, 0.1);
        }

        .ard-card-top {
          display: grid;
          gap: 10px;
        }

        .ard-card h3 {
          margin: 0;
          color: #042c53;
          font-size: 18px;
          line-height: 1.2;
          font-weight: 950;
          letter-spacing: -0.025em;
        }

        .ard-card span {
          width: fit-content;
          border: 1px solid #f1deb3;
          border-radius: 999px;
          background: #fff7e6;
          color: #ba7517;
          padding: 6px 10px;
          font-size: 11px;
          font-weight: 950;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .ard-card p {
          margin: 0;
          color: #64748b;
          font-size: 14px;
          line-height: 1.68;
        }

        .ard-card strong {
          color: #0c447c;
          font-size: 13px;
          font-weight: 950;
        }

        .ard-profile-section {
          background: #eef4fb;
          padding: 58px 0 0;
        }

        .ard-profile,
        .ard-resume {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 430px;
          gap: 34px;
          align-items: center;
          border: 1px solid #dbe5f0;
          border-radius: 30px;
          background: #ffffff;
          padding: 30px;
          box-shadow: 0 16px 42px rgba(4, 44, 83, 0.08);
        }

        .ard-profile p,
        .ard-resume p {
          margin-top: 16px;
        }

        .ard-resume-section {
          background: #eef4fb;
          padding: 24px 0 58px;
        }

        .ard-resume {
          grid-template-columns: 430px minmax(0, 1fr);
        }

        .ard-profile-card,
        .ard-resume-card {
          border: 1px solid #dbe5f0;
          border-radius: 24px;
          background: #f8fafc;
          padding: 22px;
        }

        .ard-resume-card {
          background:
            radial-gradient(circle at top right, rgba(239, 159, 39, 0.12), transparent 34%),
            #f8fafc;
        }

        .ard-progress-top {
          display: flex;
          justify-content: space-between;
          gap: 14px;
          align-items: center;
        }

        .ard-progress-top span {
          color: #042c53;
          font-size: 13px;
          font-weight: 950;
        }

        .ard-progress-top strong {
          color: #ba7517;
          font-size: 22px;
          font-weight: 950;
        }

        .ard-progress-track {
          height: 10px;
          border-radius: 999px;
          background: #e2e8f0;
          overflow: hidden;
          margin-top: 14px;
        }

        .ard-progress-fill {
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(135deg, #ba7517, #f5b942);
          transition: width 220ms ease;
        }

        .ard-progress-fill-resume {
          background: linear-gradient(135deg, #0c447c, #85b7eb);
        }

        .ard-profile-facts {
          display: grid;
          gap: 10px;
          margin-top: 18px;
        }

        .ard-profile-facts div {
          border-top: 1px solid #e2e8f0;
          padding-top: 10px;
        }

        .ard-profile-facts span {
          display: block;
          color: #64748b;
          font-size: 12px;
          font-weight: 850;
        }

        .ard-profile-facts strong {
          display: block;
          margin-top: 4px;
          color: #042c53;
          font-size: 13px;
          line-height: 1.45;
          font-weight: 900;
        }

        .ard-profile-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          min-height: 44px;
          margin-top: 18px;
          border-radius: 999px;
          background: #042c53;
          color: #ffffff;
          font-size: 14px;
          font-weight: 950;
          text-decoration: none;
          box-shadow: inset 0 -2px 0 #ba7517;
        }

        .ard-profile-link:hover {
          background: #0c447c;
        }

        .ard-account-section {
          background: #061b3a;
          color: #ffffff;
          padding: 58px 0;
        }

        .ard-account {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 430px;
          gap: 34px;
          align-items: center;
        }

        .ard-account h2 {
          color: #ffffff;
        }

        .ard-account p {
          max-width: 760px;
          margin: 18px 0 0;
          color: rgba(255, 255, 255, 0.76);
          line-height: 1.75;
          font-size: 16px;
        }

        .ard-account-steps {
          display: grid;
          gap: 12px;
        }

        .ard-account-steps div {
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.08);
          padding: 18px;
        }

        .ard-account-steps span {
          color: #f5b942;
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 0.12em;
        }

        .ard-account-steps strong {
          display: block;
          margin-top: 8px;
          color: #ffffff;
          font-size: 16px;
          font-weight: 950;
        }

        .ard-account-steps p {
          margin: 7px 0 0;
          color: rgba(255, 255, 255, 0.68);
          font-size: 13px;
          line-height: 1.6;
        }

        .ard-ai {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 430px;
          gap: 34px;
          align-items: center;
        }

        .ard-ai-list {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .ard-ai-list span {
          display: inline-flex;
          align-items: center;
          border: 1px solid #f1deb3;
          border-radius: 999px;
          background: #fff7e6;
          color: #ba7517;
          padding: 10px 13px;
          font-size: 13px;
          font-weight: 900;
        }

        @media (max-width: 980px) {
          .ard-hero-grid,
          .ard-status,
          .ard-profile,
          .ard-resume,
          .ard-account,
          .ard-ai {
            grid-template-columns: 1fr;
          }

          .ard-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 680px) {
          .ard-hero h1 {
            font-size: clamp(40px, 13vw, 58px);
          }

          .ard-panel-metrics,
          .ard-grid {
            grid-template-columns: 1fr;
          }

          .ard-panel,
          .ard-card,
          .ard-profile,
          .ard-resume,
          .ard-profile-card,
          .ard-resume-card {
            border-radius: 22px;
          }

          .ard-actions {
            flex-direction: column;
            align-items: stretch;
          }

          .ard-primary,
          .ard-secondary {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
}