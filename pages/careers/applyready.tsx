import Head from "next/head";
import Link from "next/link";
import CareersShell from "../../components/careers/CareersShell";
import JobAlertCapture from "../../components/careers/JobAlertCapture";

const SITE_URL = "https://www.medicaidready.org";
const PAGE_PATH = "/careers/applyready";
const CANONICAL_URL = `${SITE_URL}${PAGE_PATH}`;

const WORKFLOW_LINKS = [
  {
    title: "Dashboard",
    eyebrow: "Workspace",
    body: "See profile progress, resume readiness, saved jobs, and tracker counts in one place.",
    href: "/careers/applyready/dashboard",
  },
  {
    title: "Candidate Profile",
    eyebrow: "Profile",
    body: "Save a browser-based draft with preferred roles, skills, work setting, location, and salary goals.",
    href: "/careers/applyready/profile",
  },
  {
    title: "Resume Vault",
    eyebrow: "Readiness",
    body: "Track resume readiness, target role, format, checklist items, and notes before secure upload is added later.",
    href: "/careers/applyready/resume",
  },
  {
    title: "Saved Jobs",
    eyebrow: "Shortlist",
    body: "Review jobs saved from the job board and move strong matches into your application tracker.",
    href: "/careers/saved-jobs",
  },
  {
    title: "Application Tracker",
    eyebrow: "Follow up",
    body: "Track role status, notes, job links, next steps, interviews, and follow-up needs.",
    href: "/careers/applyready/tracker",
  },
];

const PREP_FEATURES = [
  {
    title: "Career Profile",
    body: "Create one browser-saved candidate profile with your preferred roles, location, work setting, skills, salary goals, and career interests.",
    href: "/careers/applyready/profile",
  },
  {
    title: "Resume Readiness",
    body: "Track whether your resume is current, targeted, formatted, quantified, saved as PDF, and ready for a stronger application.",
    href: "/careers/applyready/resume",
  },
  {
    title: "Saved Jobs",
    body: "Save roles you want to review later and keep your search organized across different career tracks.",
    href: "/careers/saved-jobs",
  },
  {
    title: "Application Tracker",
    body: "Track jobs you viewed, saved, prepared for, applied to, need to follow up on, or want to archive.",
    href: "/careers/applyready/tracker",
  },
];

const AI_TOOLS = [
  "Resume review",
  "Role match score",
  "Resume rewrite for a specific job",
  "Cover letter draft",
  "Recruiter summary",
  "Interview prep notes",
];

const STEPS = [
  {
    number: "01",
    title: "Start your profile",
    body: "Add your career goals, skills, preferred roles, location, and work setting so your ApplyReady workspace has useful context.",
  },
  {
    number: "02",
    title: "Prepare your resume readiness",
    body: "Use the Resume Vault checklist to track your target role, resume format, notes, and application readiness before secure file upload is added later.",
  },
  {
    number: "03",
    title: "Save jobs and track progress",
    body: "Save roles from the job board, move strong matches into the tracker, update statuses, add notes, and follow up with a cleaner plan.",
  },
];

export default function ApplyReadyPage() {
  const metaTitle = "ApplyReady | Resume Prep and Candidate Tools | MedicaidReady Careers";
  const metaDescription =
    "ApplyReady helps candidates prepare career profiles, resume readiness, saved jobs, application trackers, and future AI-supported job search materials before applying through official employer sites.";

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
        <main className="ar-page">
          <section className="ar-hero">
            <div className="ar-hero-glow" />
            <div className="careers-container ar-hero-inner">
              <div className="ar-breadcrumbs">
                <Link href="/careers">Careers</Link>
                <span>/</span>
                <span>ApplyReady</span>
              </div>

              <div className="ar-hero-grid">
                <div className="ar-hero-copy">
                  <p className="ar-eyebrow">ApplyReady</p>
                  <h1>Prepare better before you apply.</h1>
                  <p className="ar-hero-sub">
                    ApplyReady helps candidates build a stronger profile, prepare resume
                    readiness, save jobs, track applications, and organize next steps before
                    applying through each employer&apos;s official process.
                  </p>

                  <div className="ar-actions">
                    <Link href="/careers/applyready/dashboard" className="ar-primary">
                      Open Dashboard
                    </Link>
                    <Link href="/careers/jobs" className="ar-secondary">
                      Browse Jobs
                    </Link>
                    <Link href="#join" className="ar-tertiary">
                      Join Updates
                    </Link>
                  </div>

                  <p className="ar-actions-note">
                    Current ApplyReady tools are browser-saved and do not require an account.
                    Secure accounts, database storage, and resume file upload can come later.
                  </p>
                </div>

                <aside className="ar-panel">
                  <div className="ar-panel-label">Candidate preparation workspace</div>
                  <h2>Your job search command center.</h2>
                  <p>
                    Start with the live workspace now. Save jobs, prepare your profile, track
                    resume readiness, and manage applications without adding unnecessary
                    account friction yet.
                  </p>

                  <div className="ar-panel-list">
                    <Link href="/careers/applyready/dashboard">Dashboard</Link>
                    <Link href="/careers/applyready/profile">Profile</Link>
                    <Link href="/careers/applyready/resume">Resume</Link>
                    <Link href="/careers/saved-jobs">Saved jobs</Link>
                    <Link href="/careers/applyready/tracker">Tracker</Link>
                  </div>
                </aside>
              </div>
            </div>
          </section>

          <section className="ar-workspace-section">
            <div className="careers-container">
              <div className="ar-section-head ar-section-head-split">
                <div>
                  <p className="ar-eyebrow ar-eyebrow-dark">Live workspace</p>
                  <h2>Open the tools that are ready now.</h2>
                </div>
                <p>
                  This is the lean ApplyReady flow we need for this phase. It gives candidates
                  useful preparation tools without building account login, file upload, direct
                  apply, or employer dashboards yet.
                </p>
              </div>

              <div className="ar-workflow-grid">
                {WORKFLOW_LINKS.map((item) => (
                  <Link href={item.href} className="ar-workflow-card" key={item.title}>
                    <span>{item.eyebrow}</span>
                    <h3>{item.title}</h3>
                    <p>{item.body}</p>
                    <strong>Open</strong>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          <section className="careers-section ar-intro-section">
            <div className="careers-container">
              <div className="ar-intro">
                <div>
                  <p className="ar-eyebrow ar-eyebrow-dark">Why ApplyReady</p>
                  <h2>Most job seekers do not need more noise. They need better preparation.</h2>
                </div>
                <p>
                  Many roles still require candidates to apply through an employer&apos;s official
                  website. ApplyReady does not replace that process. It helps candidates get
                  organized, improve their materials, and approach each application with a
                  stronger plan.
                </p>
              </div>
            </div>
          </section>

          <section className="careers-section">
            <div className="careers-container">
              <div className="ar-section-head">
                <p className="ar-eyebrow ar-eyebrow-dark">Candidate tools</p>
                <h2>Build once. Prepare smarter for every role.</h2>
              </div>

              <div className="ar-feature-grid">
                {PREP_FEATURES.map((feature) => (
                  <Link href={feature.href} className="ar-feature-card" key={feature.title}>
                    <div className="ar-feature-icon" aria-hidden="true">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path
                          d="M5 10.5l3 3L15 6"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <h3>{feature.title}</h3>
                    <p>{feature.body}</p>
                    <strong>Open tool</strong>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          <section className="ar-ai-section">
            <div className="careers-container">
              <div className="ar-ai">
                <div>
                  <p className="ar-eyebrow">Future AI resume tools</p>
                  <h2>AI should come after the preparation structure is solid.</h2>
                  <p>
                    ApplyReady AI tools can later help candidates review resume quality,
                    improve job-specific wording, create recruiter summaries, prepare cover
                    letters, and get ready for interviews. For now, the live foundation is
                    profile, resume readiness, saved jobs, tracker, and dashboard.
                  </p>
                </div>

                <div className="ar-ai-tools">
                  {AI_TOOLS.map((tool) => (
                    <span key={tool}>{tool}</span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="careers-section">
            <div className="careers-container">
              <div className="ar-section-head">
                <p className="ar-eyebrow ar-eyebrow-dark">How it works</p>
                <h2>A practical flow for candidates.</h2>
              </div>

              <div className="ar-steps">
                {STEPS.map((step) => (
                  <article className="ar-step" key={step.number}>
                    <div className="ar-step-number">{step.number}</div>
                    <h3>{step.title}</h3>
                    <p>{step.body}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="ar-trust-section">
            <div className="careers-container">
              <div className="ar-trust">
                <div>
                  <p className="ar-eyebrow">Important distinction</p>
                  <h2>ApplyReady prepares candidates. Employers still receive applications through their official process.</h2>
                  <p>
                    For employer-linked jobs, candidates will still apply through the official
                    employer site. Direct in-platform applications can be added later for
                    employers who choose to receive applications inside MedicaidReady Careers.
                  </p>
                </div>

                <div className="ar-trust-card">
                  <strong>Now</strong>
                  <span>Browser-saved profile draft, resume readiness, saved jobs, tracker, and dashboard.</span>
                  <strong>Later</strong>
                  <span>Secure accounts, database storage, resume upload, and direct applications for participating employers.</span>
                </div>
              </div>
            </div>
          </section>

          <section className="careers-section" id="join">
            <div className="careers-container">
              <div className="ar-join">
                <div>
                  <p className="ar-eyebrow ar-eyebrow-dark">Get updates</p>
                  <h2>Be first to know when ApplyReady expands.</h2>
                  <p>
                    Join updates for secure accounts, resume upload, AI resume tools,
                    employer posting workflows, and future ApplyReady releases.
                  </p>
                </div>

                <JobAlertCapture source="applyready_waitlist" />
              </div>
            </div>
          </section>
        </main>
      </CareersShell>

      <style jsx global>{`
        .ar-page {
          background: #f8fafc;
          color: #0f172a;
        }

        .ar-hero {
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(circle at 16% 20%, rgba(239, 159, 39, 0.22), transparent 28%),
            radial-gradient(circle at 86% 16%, rgba(133, 183, 235, 0.2), transparent 32%),
            linear-gradient(135deg, #061b3a 0%, #07335f 58%, #0c447c 100%);
          color: #ffffff;
        }

        .ar-hero-glow {
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

        .ar-hero-inner {
          position: relative;
          padding-top: 46px;
          padding-bottom: 88px;
        }

        .ar-breadcrumbs {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 8px;
          margin-bottom: 34px;
          color: rgba(255, 255, 255, 0.68);
          font-size: 13px;
          font-weight: 850;
        }

        .ar-breadcrumbs a {
          color: rgba(255, 255, 255, 0.84);
          text-decoration: none;
        }

        .ar-breadcrumbs a:hover {
          color: #f5b942;
        }

        .ar-hero-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 390px;
          gap: 44px;
          align-items: center;
        }

        .ar-eyebrow {
          margin: 0;
          color: #f5b942;
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .ar-eyebrow-dark {
          color: #0c447c;
        }

        .ar-hero h1 {
          max-width: 880px;
          margin: 14px 0 0;
          color: #ffffff;
          font-size: clamp(46px, 7vw, 86px);
          line-height: 0.96;
          letter-spacing: -0.065em;
          font-weight: 950;
        }

        .ar-hero-sub {
          max-width: 760px;
          margin: 24px 0 0;
          color: rgba(255, 255, 255, 0.8);
          font-size: 19px;
          line-height: 1.72;
        }

        .ar-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
          align-items: center;
          margin-top: 34px;
        }

        .ar-primary,
        .ar-secondary,
        .ar-tertiary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 54px;
          border-radius: 999px;
          padding: 0 24px;
          font-size: 15px;
          font-weight: 950;
          text-decoration: none;
          transition:
            transform 150ms ease,
            background 150ms ease,
            border-color 150ms ease,
            box-shadow 150ms ease,
            color 150ms ease;
        }

        .ar-primary {
          background: #f5b942;
          color: #061b3a;
          box-shadow: 0 16px 34px rgba(0, 0, 0, 0.2);
        }

        .ar-primary:hover {
          background: #ffd978;
          transform: translateY(-1px);
        }

        .ar-secondary,
        .ar-tertiary {
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.22);
          background: rgba(255, 255, 255, 0.06);
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.02);
        }

        .ar-secondary:hover,
        .ar-tertiary:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(245, 185, 66, 0.4);
          transform: translateY(-1px);
        }

        .ar-actions-note {
          max-width: 720px;
          margin: 16px 0 0;
          color: rgba(255, 255, 255, 0.62);
          font-size: 13px;
          line-height: 1.65;
          font-weight: 650;
        }

        .ar-panel {
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 30px;
          background: rgba(255, 255, 255, 0.08);
          padding: 26px;
          box-shadow: 0 28px 70px rgba(0, 0, 0, 0.28);
          backdrop-filter: blur(18px);
        }

        .ar-panel-label {
          color: #f5b942;
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .ar-panel h2 {
          margin: 14px 0 0;
          color: #ffffff;
          font-size: 30px;
          line-height: 1.08;
          letter-spacing: -0.04em;
          font-weight: 950;
        }

        .ar-panel p {
          margin: 14px 0 0;
          color: rgba(255, 255, 255, 0.74);
          line-height: 1.7;
          font-size: 15px;
        }

        .ar-panel-list {
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
          margin-top: 22px;
        }

        .ar-panel-list a,
        .ar-ai-tools span {
          display: inline-flex;
          align-items: center;
          border: 1px solid rgba(245, 185, 66, 0.24);
          border-radius: 999px;
          background: rgba(245, 185, 66, 0.12);
          color: #ffe2ad;
          padding: 8px 11px;
          font-size: 12px;
          font-weight: 850;
          text-decoration: none;
        }

        .ar-panel-list a:hover {
          background: rgba(245, 185, 66, 0.2);
          color: #ffffff;
        }

        .ar-workspace-section {
          background: #eef4fb;
          padding: 58px 0;
        }

        .ar-section-head {
          margin-bottom: 24px;
        }

        .ar-section-head-split {
          display: grid;
          grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
          gap: 28px;
          align-items: start;
        }

        .ar-section-head-split p:last-child {
          margin: 0;
          color: #475569;
          font-size: 16px;
          line-height: 1.75;
        }

        .ar-workflow-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 14px;
        }

        .ar-workflow-card,
        .ar-feature-card {
          display: grid;
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

        .ar-workflow-card {
          gap: 12px;
        }

        .ar-workflow-card:hover,
        .ar-feature-card:hover {
          transform: translateY(-2px);
          border-color: #ba7517;
          box-shadow: 0 18px 42px rgba(4, 44, 83, 0.1);
        }

        .ar-workflow-card span {
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

        .ar-workflow-card h3 {
          margin: 0;
          color: #042c53;
          font-size: 18px;
          line-height: 1.2;
          font-weight: 950;
          letter-spacing: -0.025em;
        }

        .ar-workflow-card p {
          margin: 0;
          color: #64748b;
          font-size: 14px;
          line-height: 1.68;
        }

        .ar-workflow-card strong,
        .ar-feature-card strong {
          color: #0c447c;
          font-size: 13px;
          font-weight: 950;
        }

        .ar-intro-section {
          background: #f8fafc;
        }

        .ar-intro {
          display: grid;
          grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
          gap: 28px;
          align-items: start;
          border: 1px solid #dbe5f0;
          border-radius: 28px;
          background: #ffffff;
          padding: 30px;
          box-shadow: 0 16px 42px rgba(4, 44, 83, 0.08);
        }

        .ar-intro h2,
        .ar-section-head h2 {
          margin: 10px 0 0;
          color: #061b3a;
          font-size: clamp(30px, 4vw, 46px);
          line-height: 1.05;
          letter-spacing: -0.045em;
          font-weight: 950;
        }

        .ar-intro p {
          margin: 0;
          color: #475569;
          line-height: 1.75;
          font-size: 16px;
        }

        .ar-feature-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .ar-feature-card {
          gap: 0;
        }

        .ar-feature-icon {
          width: 42px;
          height: 42px;
          border-radius: 14px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: #fff7e6;
          color: #ba7517;
          border: 1px solid #f1deb3;
          margin-bottom: 16px;
        }

        .ar-feature-card h3 {
          margin: 0;
          color: #042c53;
          font-size: 17px;
          line-height: 1.25;
          font-weight: 950;
          letter-spacing: -0.02em;
        }

        .ar-feature-card p {
          margin: 10px 0 14px;
          color: #64748b;
          font-size: 14px;
          line-height: 1.68;
        }

        .ar-ai-section {
          background: #061b3a;
          color: #ffffff;
          padding: 58px 0;
        }

        .ar-ai {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 420px;
          gap: 34px;
          align-items: center;
        }

        .ar-ai h2 {
          max-width: 760px;
          margin: 10px 0 0;
          color: #ffffff;
          font-size: clamp(32px, 4.5vw, 52px);
          line-height: 1.02;
          letter-spacing: -0.05em;
          font-weight: 950;
        }

        .ar-ai p {
          max-width: 760px;
          margin: 18px 0 0;
          color: rgba(255, 255, 255, 0.76);
          line-height: 1.75;
          font-size: 16px;
        }

        .ar-ai-tools {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .ar-ai-tools span {
          padding: 10px 13px;
          font-size: 13px;
        }

        .ar-steps {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .ar-step {
          border: 1px solid #dbe5f0;
          border-radius: 24px;
          background: #ffffff;
          padding: 24px;
          box-shadow: 0 14px 34px rgba(4, 44, 83, 0.06);
        }

        .ar-step-number {
          color: #ba7517;
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 0.12em;
        }

        .ar-step h3 {
          margin: 12px 0 0;
          color: #042c53;
          font-size: 18px;
          font-weight: 950;
          letter-spacing: -0.02em;
        }

        .ar-step p {
          margin: 9px 0 0;
          color: #64748b;
          font-size: 14px;
          line-height: 1.68;
        }

        .ar-trust-section {
          background: #eef4fb;
          padding: 58px 0;
        }

        .ar-trust {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 360px;
          gap: 28px;
          align-items: center;
          border-radius: 28px;
          background:
            radial-gradient(circle at top right, rgba(239, 159, 39, 0.16), transparent 30%),
            #ffffff;
          border: 1px solid #dbe5f0;
          padding: 30px;
          box-shadow: 0 16px 42px rgba(4, 44, 83, 0.08);
        }

        .ar-trust h2 {
          margin: 10px 0 0;
          color: #061b3a;
          font-size: clamp(28px, 4vw, 44px);
          line-height: 1.06;
          letter-spacing: -0.045em;
          font-weight: 950;
        }

        .ar-trust p {
          max-width: 760px;
          margin: 16px 0 0;
          color: #475569;
          line-height: 1.75;
          font-size: 15px;
        }

        .ar-trust-card {
          display: grid;
          gap: 9px;
          border: 1px solid #dbe5f0;
          border-radius: 22px;
          background: #f8fafc;
          padding: 22px;
        }

        .ar-trust-card strong {
          color: #042c53;
          font-size: 15px;
          font-weight: 950;
        }

        .ar-trust-card span {
          color: #64748b;
          font-size: 14px;
          line-height: 1.62;
        }

        .ar-join {
          display: grid;
          grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
          gap: 28px;
          align-items: center;
        }

        .ar-join h2 {
          margin: 10px 0 0;
          color: #061b3a;
          font-size: clamp(28px, 4vw, 44px);
          line-height: 1.06;
          letter-spacing: -0.045em;
          font-weight: 950;
        }

        .ar-join p {
          margin: 14px 0 0;
          color: #64748b;
          line-height: 1.7;
          font-size: 15px;
        }

        @media (max-width: 1280px) {
          .ar-workflow-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 980px) {
          .ar-hero-grid,
          .ar-section-head-split,
          .ar-intro,
          .ar-ai,
          .ar-trust,
          .ar-join {
            grid-template-columns: 1fr;
          }

          .ar-feature-grid,
          .ar-workflow-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .ar-steps {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 680px) {
          .ar-hero h1 {
            font-size: clamp(40px, 13vw, 58px);
          }

          .ar-feature-grid,
          .ar-workflow-grid {
            grid-template-columns: 1fr;
          }

          .ar-panel,
          .ar-intro,
          .ar-trust {
            border-radius: 22px;
          }

          .ar-actions {
            flex-direction: column;
            align-items: flex-start;
          }

          .ar-primary,
          .ar-secondary,
          .ar-tertiary {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </>
  );
}
