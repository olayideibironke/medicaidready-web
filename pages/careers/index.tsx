import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import type { GetStaticProps } from "next";
import { useState, type FormEvent } from "react";
import CareersShell from "../../components/careers/CareersShell";
import CategoryGrid from "../../components/careers/CategoryGrid";
import JobAlertCapture from "../../components/careers/JobAlertCapture";
import { listApprovedJobs } from "../../lib/careers/db";

const SITE_URL = "https://www.medicaidready.org";

const POPULAR_SEARCHES = [
  "IT Specialist",
  "Data Scientist",
  "Cybersecurity",
  "Cloud Engineer",
  "DevOps",
  "Data Analyst",
  "Program Analyst",
  "Business Analyst",
];

const APPLYREADY_FEATURES = [
  "Career Profile",
  "Resume Vault",
  "Saved Jobs",
  "Application Tracker",
  "AI Resume Review",
  "Interview Prep",
];

type Stats = {
  totalJobs: number;
  remoteJobs: number;
  uniqueCompanies: number;
  featuredJob: {
    id: string;
    title: string;
    company: string;
    location: string;
    summary: string;
    salary: string;
    remote: string;
  } | null;
  hiringCompanies: string[];
};

type Props = {
  stats: Stats;
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  let stats: Stats = {
    totalJobs: 0,
    remoteJobs: 0,
    uniqueCompanies: 0,
    featuredJob: null,
    hiringCompanies: [],
  };

  try {
    const jobs = await listApprovedJobs();
    const companySet = new Set<string>();
    let remoteCount = 0;

    for (const job of jobs) {
      if (job.company) companySet.add(job.company.trim());
      if (job.remote === "Remote") remoteCount++;
    }

    const featured =
      jobs.find((job) => job.featured) ??
      jobs.find((job) => Boolean(job.salary && job.salary.trim())) ??
      jobs[0] ??
      null;

    const hiringSeen = new Set<string>();
    const hiringCompanies: string[] = [];

    for (const job of jobs) {
      const company = job.company?.trim();

      if (!company || hiringSeen.has(company)) continue;

      hiringSeen.add(company);
      hiringCompanies.push(company);

      if (hiringCompanies.length >= 10) break;
    }

    stats = {
      totalJobs: jobs.length,
      remoteJobs: remoteCount,
      uniqueCompanies: companySet.size,
      featuredJob: featured
        ? {
            id: featured.id,
            title: featured.title,
            company: featured.company,
            location: featured.location,
            summary: featured.summary,
            salary: featured.salary,
            remote: featured.remote,
          }
        : null,
      hiringCompanies,
    };
  } catch (error) {
    console.warn(
      "[careers/index] listApprovedJobs failed:",
      error instanceof Error ? error.message : String(error)
    );
  }

  return {
    props: { stats },
    revalidate: 60,
  };
};

function formatNumber(value: number): string {
  return value.toLocaleString("en-US");
}

export default function CareersHome({ stats }: Props) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [loc, setLoc] = useState("");

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const params = new URLSearchParams();

    if (q.trim()) params.set("q", q.trim());
    if (loc.trim()) params.set("loc", loc.trim());

    const queryString = params.toString();

    void router.push(queryString ? `/careers/jobs?${queryString}` : "/careers/jobs");
  }

  function jumpToChip(label: string) {
    void router.push(`/careers/jobs?q=${encodeURIComponent(label)}`);
  }

  const url = `${SITE_URL}/careers`;
  const metaTitle =
    "MedicaidReady Careers | Verified Jobs, ApplyReady Tools, and Career Intelligence";
  const metaDescription =
    "Search verified jobs across technology, data, cybersecurity, cloud, public sector, healthcare, operations, and care workforce roles. Use ApplyReady tools, employer links, hiring reports, and career intelligence to apply with confidence.";

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <meta property="og:site_name" content="MedicaidReady Careers" />
      </Head>

      <CareersShell>
        <section className="ch-hero">
          <div className="ch-hero-glow" />
          <div className="careers-container">
            <div className="ch-hero-inner">
              <div className="ch-hero-main">
                <div className="ch-eyebrow">MedicaidReady Careers</div>
                <h1 className="ch-hero-title">
                  Right skills. Real openings. Better career moves.
                </h1>
                <p className="ch-hero-sub">
                  Search verified roles across technology, data, cybersecurity, cloud,
                  public sector, healthcare, operations, and care workforce careers.
                  Use employer links, weekly reports, and hiring signals to apply with
                  more confidence.
                </p>

                <form className="ch-search" onSubmit={handleSearch} role="search">
                  <div className="ch-search-field ch-search-field-q">
                    <span className="ch-search-icon" aria-hidden="true">
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <circle cx="8" cy="8" r="5.25" stroke="currentColor" strokeWidth="1.6" />
                        <path
                          d="M12 12l3 3"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                    <input
                      type="search"
                      className="ch-search-input"
                      placeholder="Job title, skill, company, or keyword"
                      aria-label="Job title, skill, company, or keyword"
                      value={q}
                      onChange={(event) => setQ(event.target.value)}
                    />
                  </div>

                  <div className="ch-search-field ch-search-field-loc">
                    <span className="ch-search-icon" aria-hidden="true">
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path
                          d="M9 16s5-4.5 5-9a5 5 0 10-10 0c0 4.5 5 9 5 9z"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinejoin="round"
                        />
                        <circle cx="9" cy="7" r="2" stroke="currentColor" strokeWidth="1.6" />
                      </svg>
                    </span>
                    <input
                      type="search"
                      className="ch-search-input"
                      placeholder="City, state, or remote"
                      aria-label="City, state, or remote"
                      value={loc}
                      onChange={(event) => setLoc(event.target.value)}
                    />
                  </div>

                  <button type="submit" className="ch-search-btn">
                    Search jobs
                  </button>
                </form>

                <div className="ch-popular">
                  <span className="ch-popular-label">Start with a role or skill</span>
                  <div className="ch-popular-list">
                    {POPULAR_SEARCHES.map((label) => (
                      <button
                        type="button"
                        key={label}
                        className="ch-popular-chip"
                        onClick={() => jumpToChip(label)}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <aside className="ch-hero-panel">
                <div className="ch-panel-label">Start your job search</div>
                <h2>Find roles that match your skills and goals.</h2>
                <p>
                  Search openings, compare career lanes, review hiring reports, and move
                  from job browsing to a more focused application plan.
                </p>

                <div className="ch-panel-metrics">
                  <div>
                    <strong>{formatNumber(stats.totalJobs)}</strong>
                    <span>verified roles</span>
                  </div>
                  <div>
                    <strong>{formatNumber(stats.remoteJobs)}</strong>
                    <span>remote-friendly</span>
                  </div>
                  <div>
                    <strong>{formatNumber(stats.uniqueCompanies)}</strong>
                    <span>employers</span>
                  </div>
                </div>

                {stats.featuredJob && (
                  <Link
                    href={`/careers/jobs/${stats.featuredJob.id}`}
                    className="ch-panel-featured"
                  >
                    <span>Role spotlight</span>
                    <strong>{stats.featuredJob.title}</strong>
                    <small>
                      {stats.featuredJob.company}
                      {stats.featuredJob.location ? ` · ${stats.featuredJob.location}` : ""}
                    </small>
                  </Link>
                )}
              </aside>
            </div>
          </div>
        </section>

        {stats.hiringCompanies.length > 0 && (
          <section className="ch-hiring-section">
            <div className="careers-container">
              <div className="ch-hiring" aria-label="Hiring companies currently represented">
                <div className="ch-hiring-head">
                  <span className="ch-hiring-dot" aria-hidden="true" />
                  <span className="ch-hiring-title">Hiring companies</span>
                </div>
                <div className="ch-hiring-list">
                  {stats.hiringCompanies.map((company) => (
                    <Link
                      key={company}
                      href={`/careers/jobs?q=${encodeURIComponent(company)}`}
                      className="ch-hiring-pill"
                    >
                      {company}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {stats.totalJobs > 0 && (
          <section className="ch-stats-section">
            <div className="careers-container">
              <div className="ch-stats">
                <div className="ch-stat">
                  <div className="ch-stat-value">{formatNumber(stats.totalJobs)}</div>
                  <div className="ch-stat-label">
                    {stats.totalJobs === 1 ? "Open role" : "Open roles"}
                  </div>
                </div>
                <div className="ch-stat">
                  <div className="ch-stat-value">{formatNumber(stats.remoteJobs)}</div>
                  <div className="ch-stat-label">Remote-friendly</div>
                </div>
                <div className="ch-stat">
                  <div className="ch-stat-value">{formatNumber(stats.uniqueCompanies)}</div>
                  <div className="ch-stat-label">Hiring employers</div>
                </div>
                <div className="ch-stat">
                  <div className="ch-stat-value">Weekly</div>
                  <div className="ch-stat-label">Career reports</div>
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="ch-applyready-section">
          <div className="careers-container">
            <div className="ch-applyready">
              <div className="ch-applyready-copy">
                <div className="careers-eyebrow" style={{ color: "#EF9F27" }}>
                  ApplyReady
                </div>
                <h2>Prepare your resume, profile, and application plan before you apply.</h2>
                <p>
                  ApplyReady is the candidate preparation layer for MedicaidReady Careers.
                  Build a stronger profile, organize saved jobs, track applications, and use
                  AI-supported tools to improve your resume before applying through each
                  employer&apos;s official site.
                </p>

                <div className="ch-applyready-actions">
                  <Link href="/careers/applyready" className="ch-applyready-primary">
                    Explore ApplyReady
                  </Link>
                  <Link href="/careers/jobs" className="ch-applyready-secondary">
                    Browse Jobs
                  </Link>
                </div>
              </div>

              <div className="ch-applyready-panel">
                <div className="ch-applyready-panel-top">
                  <span className="ch-applyready-live-dot" aria-hidden="true" />
                  <span>Candidate tools roadmap</span>
                </div>

                <div className="ch-applyready-tools">
                  {APPLYREADY_FEATURES.map((feature) => (
                    <span key={feature}>{feature}</span>
                  ))}
                </div>

                <div className="ch-applyready-note">
                  First release focuses on preparation, saved jobs, profile structure, and
                  resume readiness. Direct applications can come later for employers who accept
                  candidates inside MedicaidReady Careers.
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="ch-insights-section">
          <div className="careers-container">
            <div className="ch-insights">
              <div className="ch-insights-left">
                <div className="careers-eyebrow" style={{ color: "#EF9F27" }}>
                  Career Intelligence
                </div>
                <h2 className="ch-insights-title">
                  Make your job search sharper before you apply.
                </h2>
                <p className="ch-insights-sub">
                  Go beyond job listings. Review hiring signals, salary snapshots,
                  verified opportunity reports, and weekly market summaries built from
                  MedicaidReady Careers job activity.
                </p>

                <div className="ch-insights-actions">
                  <Link href="/careers/insights" className="ch-insights-cta">
                    Explore Career Insights
                  </Link>
                  <Link href="/careers/reports" className="ch-insights-ghost">
                    View Hiring Reports
                  </Link>
                </div>
              </div>

              <div className="ch-insights-panel">
                <div className="ch-insights-panel-top">
                  <span className="ch-insights-live-dot" aria-hidden="true" />
                  <span>Platform trust standard</span>
                </div>

                <div className="ch-insights-metrics">
                  <div className="ch-insights-metric">
                    <strong>{formatNumber(stats.totalJobs)}</strong>
                    <span>verified active listings</span>
                  </div>
                  <div className="ch-insights-metric">
                    <strong>{formatNumber(stats.uniqueCompanies)}</strong>
                    <span>employers represented</span>
                  </div>
                  <div className="ch-insights-metric">
                    <strong>{formatNumber(stats.remoteJobs)}</strong>
                    <span>remote-friendly roles</span>
                  </div>
                </div>

                <div className="ch-insights-tags">
                  <span>Hiring reports</span>
                  <span>Salary signals</span>
                  <span>Employer links</span>
                  <span>Weekly updates</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="careers-section">
          <div className="careers-container">
            <CategoryGrid heading="Explore jobs by career track" />
          </div>
        </section>

        {stats.featuredJob && (
          <section className="ch-featured-section">
            <div className="careers-container">
              <div className="careers-eyebrow">Featured role</div>
              <h2 className="careers-h2">A role worth reviewing today.</h2>

              <Link
                href={`/careers/jobs/${stats.featuredJob.id}`}
                className="ch-featured-card"
              >
                <div className="ch-featured-badge">
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path
                      d="M6 1l1.5 3.2L11 4.7l-2.5 2.4.6 3.4L6 8.9 2.9 10.5l.6-3.4L1 4.7l3.5-.5L6 1z"
                      fill="currentColor"
                    />
                  </svg>
                  Featured
                </div>

                <div className="ch-featured-body">
                  <div className="ch-featured-title">{stats.featuredJob.title}</div>
                  <div className="ch-featured-meta">
                    <span className="ch-featured-company">{stats.featuredJob.company}</span>
                    {stats.featuredJob.location && (
                      <>
                        <span className="ch-featured-sep" aria-hidden="true">·</span>
                        <span>{stats.featuredJob.location}</span>
                      </>
                    )}
                    {stats.featuredJob.remote && (
                      <>
                        <span className="ch-featured-sep" aria-hidden="true">·</span>
                        <span>{stats.featuredJob.remote}</span>
                      </>
                    )}
                  </div>

                  {stats.featuredJob.summary && (
                    <p className="ch-featured-summary">{stats.featuredJob.summary}</p>
                  )}

                  {stats.featuredJob.salary && (
                    <span className="careers-pill careers-pill-gold ch-featured-salary">
                      {stats.featuredJob.salary}
                    </span>
                  )}
                </div>

                <div className="ch-featured-cta">
                  View role
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path
                      d="M3 7h8M7 3l4 4-4 4"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </Link>
            </div>
          </section>
        )}

        <section className="careers-section">
          <div className="careers-container">
            <div className="careers-eyebrow">Career resources</div>
            <h2 className="careers-h2">Tools and guides for your search.</h2>
            <p className="careers-lead">
              Free resources for career insights, verified job search, benefits guidance,
              and practical hiring support.
            </p>

            <div className="ch-resources">
              <Link href="/careers/applyready" className="ch-res-card ch-res-card-applyready">
                <div className="ch-res-icon" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M6 4h8a2 2 0 012 2v10H4V6a2 2 0 012-2z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                    <path d="M7 8h6M7 11h6M7 14h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="ch-res-title">ApplyReady</div>
                <div className="ch-res-body">
                  Candidate profile, resume prep, saved jobs, application tracking, and AI-supported tools.
                </div>
                <span className="ch-res-link">Prepare to apply</span>
              </Link>

              <Link href="/careers/insights" className="ch-res-card ch-res-card-featured">
                <div className="ch-res-icon" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M4 15V5M8 15V9M12 15V7M16 15V3"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <path d="M3 16h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="ch-res-title">Career Insights Center</div>
                <div className="ch-res-body">
                  Hiring trends, salary insights, weekly reports, and verified job market signals.
                </div>
                <span className="ch-res-link">Explore insights</span>
              </Link>

              <Link href="/careers/jobs" className="ch-res-card">
                <div className="ch-res-icon" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M4 5h12M4 10h12M4 15h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="ch-res-title">Verified job search</div>
                <div className="ch-res-body">
                  Search by role, skill, company, location, work setting, and category.
                </div>
                <span className="ch-res-link">Find jobs</span>
              </Link>

              <Link href="/careers/resources" className="ch-res-card">
                <div className="ch-res-icon" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M4 4h12v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                    <path d="M7 8h6M7 11h6M7 14h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="ch-res-title">Career resources</div>
                <div className="ch-res-body">
                  Curated links and guides for tech, healthcare, data, public sector,
                  Medicaid, and care workforce career pathways.
                </div>
                <span className="ch-res-link">Browse resources</span>
              </Link>

              <Link href="/careers/companies" className="ch-res-card">
                <div className="ch-res-icon" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M4 17V5l6-3 6 3v12" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                    <path
                      d="M7 17v-5h6v5M7 7h.01M10 7h.01M13 7h.01M7 10h.01M13 10h.01"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <div className="ch-res-title">Browse companies</div>
                <div className="ch-res-body">
                  Explore employers represented across MedicaidReady Careers listings.
                </div>
                <span className="ch-res-link">View companies</span>
              </Link>
            </div>
          </div>
        </section>

        <section className="careers-section">
          <div className="careers-container">
            <JobAlertCapture source="careers_home" />
          </div>
        </section>
      </CareersShell>

      <style jsx global>{`
        .ch-hero {
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(circle at 12% 18%, rgba(239, 159, 39, 0.20), transparent 24%),
            radial-gradient(circle at 84% 20%, rgba(12, 68, 124, 0.34), transparent 32%),
            linear-gradient(135deg, #061b3a 0%, #07335f 58%, #0c447c 100%);
          color: #ffffff;
          border-bottom: 1px solid rgba(219, 229, 240, 0.2);
          padding: 72px 0 44px;
        }

        .ch-hero-glow {
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

        .ch-hero-inner {
          position: relative;
          display: grid;
          grid-template-columns: minmax(0, 1fr) 390px;
          gap: 44px;
          align-items: center;
        }

        .ch-hero-main {
          min-width: 0;
        }

        .ch-eyebrow {
          color: #f5b942;
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          margin-bottom: 14px;
        }

        .ch-hero-title {
          max-width: 980px;
          margin: 0;
          color: #ffffff;
          font-size: clamp(44px, 6.4vw, 88px);
          line-height: 0.96;
          letter-spacing: -0.065em;
          font-weight: 950;
        }

        .ch-hero-sub {
          max-width: 860px;
          margin: 24px 0 0;
          color: rgba(255, 255, 255, 0.82);
          font-size: 19px;
          line-height: 1.7;
        }

        .ch-search {
          display: grid;
          grid-template-columns: minmax(0, 1.35fr) minmax(0, 0.9fr) auto;
          gap: 10px;
          align-items: center;
          max-width: 980px;
          margin-top: 34px;
          padding: 9px;
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.96);
          box-shadow: 0 24px 52px rgba(0, 0, 0, 0.24);
          backdrop-filter: blur(16px);
        }

        .ch-search-field {
          min-width: 0;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 14px;
          border-radius: 14px;
          background: #ffffff;
        }

        .ch-search-field-q {
          border-right: 1px solid #e2e8f0;
        }

        .ch-search-icon {
          color: #64748b;
          display: inline-flex;
          flex-shrink: 0;
        }

        .ch-search-input {
          width: 100%;
          min-width: 0;
          border: 0;
          outline: 0;
          background: transparent;
          padding: 16px 0;
          color: #0f172a;
          font-size: 15px;
          font-family: inherit;
        }

        .ch-search-input::placeholder {
          color: #94a3b8;
        }

        .ch-search-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 50px;
          padding: 0 24px;
          border-radius: 14px;
          border: 1px solid #021c38;
          background: linear-gradient(135deg, #042c53, #0c447c);
          color: #ffffff;
          font-size: 14px;
          font-weight: 950;
          font-family: inherit;
          cursor: pointer;
          box-shadow: 0 10px 22px rgba(4, 44, 83, 0.22), inset 0 -2px 0 #ba7517;
        }

        .ch-search-btn:hover {
          transform: translateY(-1px);
        }

        .ch-popular {
          display: grid;
          gap: 12px;
          max-width: 980px;
          margin-top: 22px;
        }

        .ch-popular-label {
          color: rgba(255, 255, 255, 0.7);
          font-size: 13px;
          font-weight: 850;
        }

        .ch-popular-list {
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
        }

        .ch-popular-chip {
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.08);
          color: #ffffff;
          padding: 9px 13px;
          font-size: 13px;
          font-weight: 850;
          font-family: inherit;
          cursor: pointer;
          backdrop-filter: blur(10px);
        }

        .ch-popular-chip:hover {
          border-color: #f5b942;
          color: #061b3a;
          background: #f5b942;
        }

        .ch-hero-panel {
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 30px;
          background: rgba(255, 255, 255, 0.08);
          padding: 26px;
          box-shadow: 0 28px 70px rgba(0, 0, 0, 0.28);
          backdrop-filter: blur(18px);
        }

        .ch-panel-label {
          color: #f5b942;
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .ch-hero-panel h2 {
          margin: 14px 0 0;
          color: #ffffff;
          font-size: 30px;
          line-height: 1.08;
          letter-spacing: -0.04em;
          font-weight: 950;
        }

        .ch-hero-panel p {
          margin: 14px 0 0;
          color: rgba(255, 255, 255, 0.74);
          line-height: 1.7;
          font-size: 15px;
        }

        .ch-panel-metrics {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-top: 22px;
        }

        .ch-panel-metrics div {
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.08);
          padding: 14px;
        }

        .ch-panel-metrics strong {
          display: block;
          color: #ffffff;
          font-size: 24px;
          line-height: 1;
          font-weight: 950;
          letter-spacing: -0.04em;
        }

        .ch-panel-metrics span {
          display: block;
          margin-top: 6px;
          color: rgba(255, 255, 255, 0.64);
          font-size: 12px;
          font-weight: 800;
        }

        .ch-panel-featured {
          display: grid;
          gap: 6px;
          margin-top: 18px;
          border: 1px solid rgba(245, 185, 66, 0.24);
          border-radius: 20px;
          background: rgba(245, 185, 66, 0.12);
          padding: 16px;
          color: #ffffff;
          text-decoration: none;
        }

        .ch-panel-featured:hover {
          background: rgba(245, 185, 66, 0.18);
        }

        .ch-panel-featured span {
          color: #f5b942;
          font-size: 11px;
          font-weight: 950;
          text-transform: uppercase;
          letter-spacing: 0.14em;
        }

        .ch-panel-featured strong {
          color: #ffffff;
          font-size: 15px;
          line-height: 1.3;
        }

        .ch-panel-featured small {
          color: rgba(255, 255, 255, 0.68);
          font-size: 12px;
          font-weight: 750;
        }

        .ch-hiring-section {
          background: #eef4fb;
          padding: 26px 0 0;
        }

        .ch-hiring {
          display: grid;
          grid-template-columns: 210px minmax(0, 1fr);
          gap: 18px;
          align-items: center;
          border: 1px solid #dbe5f0;
          border-radius: 24px;
          background:
            radial-gradient(circle at left, rgba(239, 159, 39, 0.12), transparent 34%),
            linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
          padding: 18px;
          box-shadow: 0 16px 42px rgba(4, 44, 83, 0.08);
        }

        .ch-hiring-head {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          width: fit-content;
          border: 1px solid #dbe5f0;
          border-radius: 999px;
          background: #ffffff;
          color: #042c53;
          padding: 10px 14px;
          font-size: 13px;
          font-weight: 950;
          white-space: nowrap;
          box-shadow: 0 8px 20px rgba(4, 44, 83, 0.06);
        }

        .ch-hiring-dot {
          width: 10px;
          height: 10px;
          border-radius: 999px;
          background: #22c55e;
          box-shadow: 0 0 0 5px rgba(34, 197, 94, 0.13);
          flex-shrink: 0;
        }

        .ch-hiring-list {
          display: flex;
          gap: 10px;
          align-items: center;
          flex-wrap: wrap;
          min-width: 0;
        }

        .ch-hiring-pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 38px;
          border-radius: 999px;
          background: #ffffff;
          border: 1px solid #cfdced;
          color: #042c53;
          padding: 9px 14px;
          font-size: 13px;
          font-weight: 900;
          line-height: 1;
          text-decoration: none;
          white-space: nowrap;
          box-shadow: 0 8px 18px rgba(4, 44, 83, 0.05);
          transition:
            transform 140ms ease,
            border-color 140ms ease,
            background 140ms ease,
            color 140ms ease,
            box-shadow 140ms ease;
        }

        .ch-hiring-pill:hover {
          transform: translateY(-1px);
          color: #061b3a;
          border-color: #ba7517;
          background: #fff7e6;
          box-shadow: 0 12px 26px rgba(186, 117, 23, 0.12);
        }

        .ch-stats-section {
          background: #eef4fb;
          padding: 24px 0 38px;
        }

        .ch-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          border: 1px solid #dbe5f0;
          border-radius: 18px;
          background: #ffffff;
          box-shadow: 0 14px 38px rgba(4, 44, 83, 0.07);
          overflow: hidden;
        }

        .ch-stat {
          padding: 24px 28px;
          border-right: 1px solid #e2e8f0;
        }

        .ch-stat:last-child {
          border-right: 0;
        }

        .ch-stat-value {
          color: #042c53;
          font-size: 28px;
          line-height: 1;
          font-weight: 950;
          letter-spacing: -0.04em;
        }

        .ch-stat-label {
          margin-top: 8px;
          color: #64748b;
          font-size: 13px;
          font-weight: 750;
        }

        .ch-applyready-section {
          background: #eef4fb;
          padding: 16px 0 54px;
        }

        .ch-applyready {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 410px;
          gap: 34px;
          align-items: center;
          border-radius: 30px;
          background:
            radial-gradient(circle at top right, rgba(239, 159, 39, 0.18), transparent 34%),
            linear-gradient(135deg, #041f3d 0%, #07335f 58%, #0c447c 100%);
          color: #ffffff;
          padding: 48px 30px;
          box-shadow: 0 26px 60px rgba(4, 44, 83, 0.20);
        }

        .ch-applyready-copy h2 {
          max-width: 760px;
          margin: 14px 0 0;
          color: #ffffff;
          font-size: clamp(30px, 4vw, 50px);
          line-height: 1.04;
          letter-spacing: -0.05em;
          font-weight: 950;
        }

        .ch-applyready-copy p {
          max-width: 740px;
          margin: 18px 0 0;
          color: rgba(255, 255, 255, 0.78);
          font-size: 16px;
          line-height: 1.75;
        }

        .ch-applyready-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 26px;
        }

        .ch-applyready-primary,
        .ch-applyready-secondary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          padding: 12px 18px;
          font-size: 14px;
          font-weight: 950;
          text-decoration: none;
        }

        .ch-applyready-primary {
          background: #ef9f27;
          color: #041f3d;
        }

        .ch-applyready-primary:hover {
          background: #f5b942;
        }

        .ch-applyready-secondary {
          border: 1px solid rgba(255, 255, 255, 0.18);
          color: #ffffff;
        }

        .ch-applyready-secondary:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .ch-applyready-panel {
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 24px;
          background: rgba(255, 255, 255, 0.08);
          padding: 22px;
          backdrop-filter: blur(16px);
        }

        .ch-applyready-panel-top {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          color: #ffffff;
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .ch-applyready-live-dot {
          width: 9px;
          height: 9px;
          border-radius: 999px;
          background: #22c55e;
          box-shadow: 0 0 0 5px rgba(34, 197, 94, 0.12);
        }

        .ch-applyready-tools {
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
          margin-top: 20px;
        }

        .ch-applyready-tools span {
          display: inline-flex;
          align-items: center;
          border: 1px solid rgba(239, 159, 39, 0.42);
          border-radius: 999px;
          background: rgba(239, 159, 39, 0.12);
          color: #ffe2ad;
          padding: 8px 11px;
          font-size: 12px;
          font-weight: 900;
        }

        .ch-applyready-note {
          margin-top: 18px;
          border-top: 1px solid rgba(255, 255, 255, 0.12);
          padding-top: 16px;
          color: rgba(255, 255, 255, 0.68);
          font-size: 13px;
          line-height: 1.65;
          font-weight: 650;
        }

        .ch-insights-section {
          background: #eef4fb;
          padding: 16px 0 54px;
        }

        .ch-insights {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 410px;
          gap: 34px;
          align-items: center;
          border-radius: 30px;
          background:
            radial-gradient(circle at top left, rgba(186, 117, 23, 0.14), transparent 36%),
            linear-gradient(135deg, #041f3d 0%, #07335f 58%, #0c447c 100%);
          color: #ffffff;
          padding: 48px 30px;
          box-shadow: 0 26px 60px rgba(4, 44, 83, 0.20);
        }

        .ch-insights-left {
          padding-left: 2px;
        }

        .ch-insights-title {
          max-width: 720px;
          margin: 14px 0 0;
          font-size: clamp(30px, 4vw, 48px);
          line-height: 1.05;
          letter-spacing: -0.045em;
          font-weight: 950;
        }

        .ch-insights-sub {
          max-width: 700px;
          margin: 18px 0 0;
          color: rgba(255, 255, 255, 0.78);
          font-size: 16px;
          line-height: 1.75;
        }

        .ch-insights-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 26px;
        }

        .ch-insights-cta,
        .ch-insights-ghost {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          padding: 12px 18px;
          font-size: 14px;
          font-weight: 900;
          text-decoration: none;
        }

        .ch-insights-cta {
          background: #ef9f27;
          color: #041f3d;
        }

        .ch-insights-ghost {
          border: 1px solid rgba(255, 255, 255, 0.18);
          color: #ffffff;
        }

        .ch-insights-panel {
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 22px;
          background: rgba(255, 255, 255, 0.06);
          padding: 20px;
          backdrop-filter: blur(16px);
        }

        .ch-insights-panel-top {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          color: #ffffff;
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .ch-insights-live-dot {
          width: 9px;
          height: 9px;
          border-radius: 999px;
          background: #22c55e;
          box-shadow: 0 0 0 5px rgba(34, 197, 94, 0.12);
        }

        .ch-insights-metrics {
          display: grid;
          gap: 10px;
          margin-top: 18px;
        }

        .ch-insights-metric {
          border: 1px solid rgba(255, 255, 255, 0.10);
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.08);
          padding: 15px;
        }

        .ch-insights-metric strong {
          display: block;
          font-size: 26px;
          line-height: 1;
          color: #ffffff;
          font-weight: 950;
          letter-spacing: -0.04em;
        }

        .ch-insights-metric span {
          display: block;
          margin-top: 7px;
          color: rgba(255, 255, 255, 0.74);
          font-size: 12px;
          font-weight: 800;
        }

        .ch-insights-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 14px;
        }

        .ch-insights-tags span {
          display: inline-flex;
          align-items: center;
          border: 1px solid rgba(239, 159, 39, 0.42);
          border-radius: 999px;
          background: rgba(239, 159, 39, 0.12);
          color: #ffe2ad;
          padding: 7px 10px;
          font-size: 11px;
          font-weight: 900;
        }

        .ch-featured-section {
          background: #ffffff;
          border-top: 1px solid #e2e8f0;
          border-bottom: 1px solid #e2e8f0;
          padding: 46px 0;
        }

        .ch-featured-card {
          position: relative;
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 24px;
          align-items: center;
          margin-top: 18px;
          border: 1px solid #dbe5f0;
          border-radius: 24px;
          background: linear-gradient(180deg, #ffffff 0%, #fffbf2 100%);
          padding: 24px;
          color: inherit;
          text-decoration: none;
          box-shadow: 0 14px 38px rgba(4, 44, 83, 0.08);
        }

        .ch-featured-badge {
          position: absolute;
          top: 18px;
          right: 20px;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          color: #ba7517;
          font-size: 11px;
          font-weight: 950;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .ch-featured-title {
          max-width: 780px;
          color: #042c53;
          font-size: 24px;
          line-height: 1.15;
          font-weight: 950;
          letter-spacing: -0.035em;
        }

        .ch-featured-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
          margin-top: 9px;
          color: #64748b;
          font-size: 13px;
          font-weight: 750;
        }

        .ch-featured-company {
          color: #334155;
          font-weight: 900;
        }

        .ch-featured-summary {
          max-width: 820px;
          margin: 14px 0 0;
          color: #475569;
          line-height: 1.7;
          font-size: 15px;
        }

        .ch-featured-salary {
          margin-top: 12px;
        }

        .ch-featured-cta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border-radius: 999px;
          background: #042c53;
          color: #ffffff;
          padding: 12px 18px;
          font-size: 14px;
          font-weight: 900;
          box-shadow: inset 0 -2px 0 #ba7517;
        }

        .ch-resources {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 16px;
          margin-top: 24px;
        }

        .ch-res-card {
          display: block;
          min-height: 240px;
          border: 1px solid #dbe5f0;
          border-radius: 22px;
          background: #ffffff;
          padding: 22px;
          color: inherit;
          text-decoration: none;
          box-shadow: 0 12px 30px rgba(4, 44, 83, 0.06);
          transition: transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease;
        }

        .ch-res-card:hover {
          transform: translateY(-2px);
          border-color: #ba7517;
          box-shadow: 0 18px 40px rgba(4, 44, 83, 0.10);
        }

        .ch-res-card-featured {
          background:
            radial-gradient(circle at top right, rgba(239, 159, 39, 0.18), transparent 36%),
            #ffffff;
        }

        .ch-res-card-applyready {
          background:
            radial-gradient(circle at top right, rgba(12, 68, 124, 0.14), transparent 34%),
            linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
          border-color: #cfdced;
        }

        .ch-res-icon {
          width: 42px;
          height: 42px;
          border-radius: 14px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: #eef4fb;
          color: #0c447c;
          margin-bottom: 16px;
        }

        .ch-res-title {
          color: #042c53;
          font-size: 17px;
          line-height: 1.25;
          font-weight: 950;
          letter-spacing: -0.025em;
        }

        .ch-res-body {
          margin-top: 10px;
          color: #64748b;
          font-size: 14px;
          line-height: 1.65;
        }

        .ch-res-link {
          display: inline-flex;
          margin-top: 18px;
          color: #ba7517;
          font-size: 13px;
          font-weight: 950;
        }

        @media (max-width: 1060px) {
          .ch-hero-inner {
            grid-template-columns: 1fr;
          }

          .ch-hero-panel {
            max-width: 720px;
          }

          .ch-hiring {
            grid-template-columns: 1fr;
          }

          .ch-resources {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 980px) {
          .ch-search,
          .ch-applyready,
          .ch-insights,
          .ch-featured-card {
            grid-template-columns: 1fr;
          }

          .ch-stats {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 680px) {
          .ch-hero {
            padding-top: 48px;
          }

          .ch-hero-title {
            font-size: clamp(40px, 13vw, 58px);
          }

          .ch-hero-sub {
            font-size: 16px;
          }

          .ch-search {
            padding: 6px;
          }

          .ch-search-field-q {
            border-right: 0;
            border-bottom: 1px solid #e2e8f0;
          }

          .ch-panel-metrics,
          .ch-stats,
          .ch-resources,
          .ch-insights-metrics {
            grid-template-columns: 1fr;
          }

          .ch-applyready,
          .ch-insights {
            padding: 30px 18px;
            border-radius: 24px;
          }

          .ch-hiring {
            padding: 16px;
          }

          .ch-hiring-list {
            gap: 8px;
          }

          .ch-hiring-pill {
            width: 100%;
            justify-content: flex-start;
          }

          .ch-stat {
            border-right: 0;
            border-bottom: 1px solid #e2e8f0;
          }

          .ch-stat:last-child {
            border-bottom: 0;
          }
        }
      `}</style>
    </>
  );
}