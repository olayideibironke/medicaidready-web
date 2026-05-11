import Head from "next/head";
import Link from "next/link";
import CareersShell from "../../components/careers/CareersShell";

export default function CareersHome() {
  return (
    <>
      <Head>
        <title>MedicaidReady Careers — Jobs in the Medicaid Ecosystem</title>
        <meta
          name="description"
          content="Find your next role in Medicaid: eligibility specialists, compliance, billing, care management, and policy. New jobs added every week."
        />
        <meta name="robots" content="noindex" />
      </Head>

      <CareersShell>
        <section className="careers-section">
          <div className="careers-container">
            <div className="careers-eyebrow">MedicaidReady Careers</div>
            <h1 className="careers-h1">
              Build a career in the
              <br />
              Medicaid ecosystem.
            </h1>
            <p className="careers-lead">
              MedicaidReady Careers is a focused job board for Medicaid eligibility, compliance,
              billing, care management, and policy roles. Built for the people doing the work — by
              people doing the work.
            </p>

            <div className="careers-actions">
              <Link href="/careers/jobs" className="careers-btn-primary">
                Browse jobs
              </Link>
              <Link href="/careers/employers" className="careers-btn-ghost">
                Hiring? Post a role
              </Link>
            </div>
          </div>
        </section>

        <section
          className="careers-section-tight"
          style={{
            background: "#ffffff",
            borderTop: "1px solid #e2e8f0",
            borderBottom: "1px solid #e2e8f0",
          }}
        >
          <div className="careers-container">
            <div className="careers-feature-grid">
              <div className="careers-card">
                <div className="careers-feature-icon">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M10 2L3 5v5c0 4.4 3.1 8 7 9 3.9-1 7-4.6 7-9V5l-7-3z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="careers-feature-title">Medicaid-only roles</h3>
                <p className="careers-feature-body">
                  No noise. Every listing is in the Medicaid ecosystem — providers, MCOs, advocacy,
                  policy, and tech.
                </p>
              </div>

              <div className="careers-card">
                <div className="careers-feature-icon">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
                    <path
                      d="M10 6v4l2.5 2.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <h3 className="careers-feature-title">Updated weekly</h3>
                <p className="careers-feature-body">
                  Fresh listings added every week from agencies, providers, and partners we already
                  work with.
                </p>
              </div>

              <div className="careers-card">
                <div className="careers-feature-icon">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M3 7l7-4 7 4-7 4-7-4z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M3 13l7 4 7-4M3 10l7 4 7-4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="careers-feature-title">Built for the field</h3>
                <p className="careers-feature-body">
                  From front-line enrollment specialists to policy directors. Real titles, real
                  salary ranges, real next steps.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="careers-section">
          <div className="careers-container">
            <div className="careers-eyebrow">For employers</div>
            <h2 className="careers-h2">Hire from a pool that already knows Medicaid.</h2>
            <p className="careers-lead">
              Reach candidates who understand eligibility, MCO dynamics, and state-by-state policy
              nuance. No generic job-board sprawl.
            </p>
            <div className="careers-actions">
              <Link href="/careers/post-a-job" className="careers-btn-primary">
                Post a job
              </Link>
              <Link href="/careers/employers" className="careers-btn-ghost">
                Learn more
              </Link>
            </div>
          </div>
        </section>
      </CareersShell>
    </>
  );
}
