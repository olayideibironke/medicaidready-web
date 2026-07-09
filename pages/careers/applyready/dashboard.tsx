import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import CareersShell from "../../../components/careers/CareersShell";
import { getSavedJobRecords } from "../../../lib/careers/applyReadyStorage";

const SITE_URL = "https://www.medicaidready.org";
const PAGE_PATH = "/careers/applyready/dashboard";
const CANONICAL_URL = `${SITE_URL}${PAGE_PATH}`;

const FOUNDATION_ITEMS = [
  {
    title: "Candidate Profile",
    status: "Next build",
    description:
      "Create your career profile with preferred roles, skills, work setting, location, and salary goals.",
    href: "/careers/applyready/profile",
  },
  {
    title: "Resume Vault",
    status: "Planned",
    description:
      "Securely store, replace, and manage resumes after account sign-in and storage are ready.",
    href: "/careers/applyready/resume",
  },
  {
    title: "Saved Jobs",
    status: "Live foundation",
    description:
      "Save jobs from the job board and job detail pages, then return to them in your ApplyReady list.",
    href: "/careers/saved-jobs",
  },
  {
    title: "Application Tracker",
    status: "After profile",
    description:
      "Track saved, preparing, applied, interview, offer, not selected, and follow-up statuses.",
    href: "/careers/applyready/tracker",
  },
];

const AI_ITEMS = [
  "Resume review",
  "Role match score",
  "Resume rewrite",
  "Cover letter draft",
  "Recruiter summary",
  "Interview prep notes",
];

export default function ApplyReadyDashboardPage() {
  const [savedCount, setSavedCount] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => {
      setSavedCount(getSavedJobRecords().length);
      setReady(true);
    };

    sync();

    window.addEventListener("storage", sync);
    window.addEventListener("applyready:saved-jobs-updated", sync);

    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("applyready:saved-jobs-updated", sync);
    };
  }, []);

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
                    This dashboard organizes the ApplyReady buildout in the right order:
                    profile first, resume vault after account security, saved jobs now,
                    tracker after profile, and AI tools after the foundation is stable.
                  </p>

                  <div className="ard-actions">
                    <Link href="/careers/jobs" className="ard-primary">
                      Browse Jobs
                    </Link>
                    <Link href="/careers/saved-jobs" className="ard-secondary">
                      View Saved Jobs
                    </Link>
                  </div>
                </div>

                <aside className="ard-panel">
                  <span>Current live foundation</span>
                  <strong>{ready ? savedCount : "0"}</strong>
                  <p>Saved jobs in this browser.</p>
                  <Link href="/careers/saved-jobs">Open saved jobs</Link>
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
                  We are building ApplyReady as a real candidate preparation system, not a
                  fake profile screen. Resume storage and account-tied data should wait until
                  sign-in, database, storage, and privacy controls are in place.
                </p>
              </div>

              <div className="ard-grid">
                {FOUNDATION_ITEMS.map((item) => (
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

          <section className="ard-account-section">
            <div className="careers-container">
              <div className="ard-account">
                <div>
                  <p className="ard-eyebrow">Account foundation</p>
                  <h2>Profile and resume features need secure accounts.</h2>
                  <p>
                    Saved jobs can start in browser storage, but candidate profiles and
                    resumes should be tied to secure accounts. That keeps user data safer
                    and gives us the right path for future resume tools, tracker history,
                    and AI-supported preparation.
                  </p>
                </div>

                <div className="ard-account-steps">
                  <div>
                    <span>01</span>
                    <strong>Candidate profile</strong>
                    <p>Basic career preferences and skills.</p>
                  </div>
                  <div>
                    <span>02</span>
                    <strong>Secure resume vault</strong>
                    <p>Upload, replace, delete, and manage resumes.</p>
                  </div>
                  <div>
                    <span>03</span>
                    <strong>Application tracker</strong>
                    <p>Track status after profile structure is ready.</p>
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
                    target roles, saved jobs, and resume content. That is why we build the
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
          grid-template-columns: minmax(0, 1fr) 340px;
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

        .ard-panel span {
          display: block;
          color: #f5b942;
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .ard-panel strong {
          display: block;
          margin-top: 16px;
          color: #ffffff;
          font-size: 64px;
          line-height: 1;
          font-weight: 950;
          letter-spacing: -0.06em;
        }

        .ard-panel p {
          margin: 12px 0 0;
          color: rgba(255, 255, 255, 0.72);
          font-size: 14px;
          line-height: 1.6;
        }

        .ard-panel a {
          display: inline-flex;
          margin-top: 18px;
          color: #f5b942;
          font-size: 13px;
          font-weight: 950;
          text-decoration: none;
        }

        .ard-status {
          display: grid;
          grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
          gap: 28px;
          align-items: start;
          margin-bottom: 24px;
        }

        .ard-status h2,
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

          .ard-grid {
            grid-template-columns: 1fr;
          }

          .ard-panel,
          .ard-card {
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