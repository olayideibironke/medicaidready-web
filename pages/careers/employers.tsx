import Head from "next/head";
import Link from "next/link";
import CareersShell from "../../components/careers/CareersShell";

export default function CareersEmployers() {
  return (
    <>
      <Head>
        <title>For Employers — MedicaidReady Careers</title>
        <meta
          name="description"
          content="Hire qualified Medicaid talent: eligibility specialists, compliance, billing, care management, and policy."
        />
        <meta name="robots" content="noindex" />
      </Head>

      <CareersShell>
        <section className="careers-section">
          <div className="careers-container">
            <div className="careers-eyebrow">For employers</div>
            <h1 className="careers-h1">Hire candidates who already speak Medicaid.</h1>
            <p className="careers-lead">
              MedicaidReady Careers reaches eligibility specialists, compliance analysts, billing
              coordinators, policy associates, and care managers. No generic job-board sprawl.
            </p>
            <div className="careers-actions">
              <Link href="/careers/post-a-job" className="careers-btn-primary">
                Post a job
              </Link>
              <Link href="/careers/jobs" className="careers-btn-ghost">
                See current listings
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
                    <circle cx="7" cy="7" r="3" stroke="currentColor" strokeWidth="1.5" />
                    <path
                      d="M2 17c0-2.76 2.24-5 5-5s5 2.24 5 5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <circle cx="14" cy="6" r="2.5" stroke="currentColor" strokeWidth="1.5" />
                    <path
                      d="M11.5 13c.83-1.21 2.21-2 3.75-2 2.07 0 3.75 1.68 3.75 3.75"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>
                <h3 className="careers-feature-title">Targeted reach</h3>
                <p className="careers-feature-body">
                  Your post lands in front of candidates already working in Medicaid — not the
                  entire internet.
                </p>
              </div>

              <div className="careers-card">
                <div className="careers-feature-icon">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <rect
                      x="3"
                      y="4"
                      width="14"
                      height="13"
                      rx="2"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M7 4V2.5M13 4V2.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <path d="M3 8h14" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </div>
                <h3 className="careers-feature-title">30-day listing</h3>
                <p className="careers-feature-body">
                  Each post stays live for 30 days with applicant tracking and the option to
                  extend.
                </p>
              </div>

              <div className="careers-card">
                <div className="careers-feature-icon">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M3 10l4 4 10-10"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="careers-feature-title">Plain pricing</h3>
                <p className="careers-feature-body">
                  Pricing tiers and self-serve checkout will be available soon. For Phase 1,
                  listings are free while we ramp up.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="careers-section">
          <div className="careers-container">
            <h2 className="careers-h2">Ready to hire?</h2>
            <p className="careers-lead">
              Submit your role today. We will email you when the public job board goes live.
            </p>
            <div className="careers-actions">
              <Link href="/careers/post-a-job" className="careers-btn-primary">
                Post a job
              </Link>
            </div>
          </div>
        </section>
      </CareersShell>
    </>
  );
}
