import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import type { GetStaticProps } from "next";
import { useState } from "react";
import CareersShell from "../../components/careers/CareersShell";
import CategoryGrid from "../../components/careers/CategoryGrid";
import JobAlertCapture from "../../components/careers/JobAlertCapture";
import { listApprovedJobs } from "../../lib/careers/db";

const SITE_URL = "https://www.medicaidready.org";
const POPULAR_SEARCHES = [
  "CNA",
  "GNA",
  "Caregiver",
  "Medicaid Analyst",
  "Healthcare IT",
  "EHR Analyst",
  "Provider Data",
  "Claims Systems",
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

type Props = { stats: Stats };

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
    for (const j of jobs) {
      if (j.company) companySet.add(j.company.trim());
      if (j.remote === "Remote") remoteCount++;
    }

    const featured =
      jobs.find((j) => j.featured) ??
      jobs.find((j) => Boolean(j.salary && j.salary.trim())) ??
      jobs[0] ??
      null;

    const hiringSeen = new Set<string>();
    const hiring: string[] = [];
    for (const j of jobs) {
      const c = j.company?.trim();
      if (!c || hiringSeen.has(c)) continue;
      hiringSeen.add(c);
      hiring.push(c);
      if (hiring.length >= 10) break;
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
      hiringCompanies: hiring,
    };
  } catch (e) {
    console.warn(
      "[careers/index] listApprovedJobs failed:",
      e instanceof Error ? e.message : String(e)
    );
  }

  return { props: { stats }, revalidate: 60 };
};

function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}

export default function CareersHome({ stats }: Props) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [loc, setLoc] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (loc.trim()) params.set("loc", loc.trim());
    const qs = params.toString();
    void router.push(qs ? `/careers/jobs?${qs}` : "/careers/jobs");
  }

  function jumpToChip(label: string) {
    void router.push(`/careers/jobs?q=${encodeURIComponent(label)}`);
  }

  const url = `${SITE_URL}/careers`;
  const metaTitle = "MedicaidReady Careers — Healthcare, Medicaid, and Care Workforce Jobs";
  const metaDescription =
    "Find healthcare, Medicaid, and care workforce jobs: CNA, GNA, caregiver, eligibility, care management, analytics, healthcare IT, EHR, claims systems, and more. Updated weekly. Apply directly through the employer's official site.";

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
        <meta property="og:site_name" content="MedicaidReady" />
      </Head>

      <CareersShell>
        <section className="ch-hero">
          <div className="careers-container">
            <div className="ch-hero-inner">
              <div className="careers-eyebrow">MedicaidReady Careers</div>
              <h1 className="ch-hero-title">
                Healthcare, Medicaid, and care workforce jobs — all in one place.
              </h1>
              <p className="ch-hero-sub">
                Curated openings across coverage, the direct-care workforce, and healthcare
                technology. Updated weekly. Apply through each employer&apos;s official site.
              </p>

              <form className="ch-search" onSubmit={handleSearch} role="search">
                <div className="ch-search-field ch-search-field-q">
                  <span className="ch-search-icon" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <circle cx="8" cy="8" r="5.25" stroke="currentColor" strokeWidth="1.6"/>
                      <path d="M12 12l3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                    </svg>
                  </span>
                  <input
                    type="search"
                    className="ch-search-input"
                    placeholder="Job title, skill, company, or keyword"
                    aria-label="Job title, skill, company, or keyword"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                  />
                </div>
                <div className="ch-search-field ch-search-field-loc">
                  <span className="ch-search-icon" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M9 16s5-4.5 5-9a5 5 0 10-10 0c0 4.5 5 9 5 9z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
                      <circle cx="9" cy="7" r="2" stroke="currentColor" strokeWidth="1.6"/>
                    </svg>
                  </span>
                  <input
                    type="search"
                    className="ch-search-input"
                    placeholder="City, state, or remote"
                    aria-label="City, state, or remote"
                    value={loc}
                    onChange={(e) => setLoc(e.target.value)}
                  />
                </div>
                <button type="submit" className="ch-search-btn">
                  Search jobs
                </button>
              </form>

              <div className="ch-popular">
                <span className="ch-popular-label">Popular:</span>
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
          </div>
        </section>

        {stats.hiringCompanies.length > 0 && (
          <section className="ch-hiring-section">
            <div className="careers-container">
              <div className="ch-hiring">
                <div className="ch-hiring-head">
                  <span className="ch-hiring-dot" aria-hidden="true" />
                  <span className="ch-hiring-title">Hiring now</span>
                </div>
                <div className="ch-hiring-list">
                  {stats.hiringCompanies.map((c) => (
                    <Link
                      key={c}
                      href={`/careers/jobs?q=${encodeURIComponent(c)}`}
                      className="ch-hiring-pill"
                    >
                      {c}
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
                  <div className="ch-stat-label">Curated updates</div>
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="ch-insights-section">
          <div className="careers-container">
            <div className="ch-insights">
              <div className="ch-insights-left">
                <div className="careers-eyebrow" style={{ color: "#EF9F27" }}>
                  Career Intelligence
                </div>
                <h2 className="ch-insights-title">
                  New: Career Insights Center for verified hiring trends.
                </h2>
                <p className="ch-insights-sub">
                  Go beyond job listings. Explore hiring signals, salary snapshots,
                  verified opportunity reports, and weekly market summaries built from
                  real MedicaidReady Careers job activity.
                </p>

                <div className="ch-insights-actions">
                  <Link href="/careers/insights" className="ch-insights-cta">
                    Explore Career Insights
                  </Link>
                  <Link href="/careers/jobs" className="ch-insights-ghost">
                    Browse verified jobs
                  </Link>
                </div>
              </div>

              <div className="ch-insights-panel">
                <div className="ch-insights-panel-top">
                  <span className="ch-insights-live-dot" aria-hidden="true" />
                  <span>Verification standard</span>
                </div>

                <div className="ch-insights-metrics">
                  <div className="ch-insights-metric">
                    <strong>{formatNumber(stats.totalJobs)}</strong>
                    <span>active listings reviewed</span>
                  </div>
                  <div className="ch-insights-metric">
                    <strong>0</strong>
                    <span>broken links after cleanup</span>
                  </div>
                  <div className="ch-insights-metric">
                    <strong>0</strong>
                    <span>duplicate groups after audit</span>
                  </div>
                </div>

                <div className="ch-insights-tags">
                  <span>Hiring reports</span>
                  <span>Salary signals</span>
                  <span>Verified links</span>
                  <span>Weekly audits</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="careers-section">
          <div className="careers-container">
            <CategoryGrid heading="Browse by category" />
          </div>
        </section>

        {stats.featuredJob && (
          <section
            className="careers-section-tight"
            style={{
              background: "#ffffff",
              borderTop: "1px solid #e2e8f0",
              borderBottom: "1px solid #e2e8f0",
            }}
          >
            <div className="careers-container">
              <div className="careers-eyebrow">Featured role</div>
              <h2 className="careers-h2">Spotlight</h2>

              <Link
                href={`/careers/jobs/${stats.featuredJob.id}`}
                className="ch-featured-card"
              >
                <div className="ch-featured-badge">
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M6 1l1.5 3.2L11 4.7l-2.5 2.4.6 3.4L6 8.9 2.9 10.5l.6-3.4L1 4.7l3.5-.5L6 1z" fill="currentColor"/>
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
                    <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
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
              Free resources you can use today — from checking your own benefits coverage
              to navigating Medicaid as a candidate or employer.
            </p>

            <div className="ch-resources">
              <Link href="/careers/insights" className="ch-res-card ch-res-card-featured">
                <div className="ch-res-icon" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M4 15V5M8 15V9M12 15V7M16 15V3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M3 16h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="ch-res-title">Career Insights Center</div>
                <div className="ch-res-body">
                  Hiring trends, salary insights, weekly reports, and verified job market signals.
                </div>
                <span className="ch-res-link">Explore insights →</span>
              </Link>

              <Link href="/quiz" className="ch-res-card">
                <div className="ch-res-icon" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 2L3 5v5c0 4.4 3.1 8 7 9 3.9-1 7-4.6 7-9V5l-7-3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="ch-res-title">Check your Medicaid eligibility</div>
                <div className="ch-res-body">
                  Free 2-minute eligibility check. Covers all 50 states.
                </div>
                <span className="ch-res-link">Take the quiz →</span>
              </Link>

              <Link href="/careers/resources" className="ch-res-card">
                <div className="ch-res-icon" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M4 4h12v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                    <path d="M7 8h6M7 11h6M7 14h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="ch-res-title">Career resources</div>
                <div className="ch-res-body">
                  Curated links to official Medicaid, CMS, and care workforce resources.
                </div>
                <span className="ch-res-link">Browse resources →</span>
              </Link>

              <Link href="/careers/companies" className="ch-res-card">
                <div className="ch-res-icon" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <rect x="3" y="4" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M7 17V9h6v8M9 7v.01M11 7v.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="ch-res-title">Browse companies</div>
                <div className="ch-res-body">
                  See which healthcare and Medicaid employers are actively hiring this week.
                </div>
                <span className="ch-res-link">See employers →</span>
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
            <div style={{ maxWidth: 640 }}>
              <JobAlertCapture source="careers_home" />
            </div>
          </div>
        </section>

        <section className="ch-emp-section">
          <div className="careers-container">
            <div className="ch-emp">
              <div className="ch-emp-left">
                <div className="careers-eyebrow" style={{ color: "#EF9F27" }}>
                  For employers
                </div>
                <h2 className="ch-emp-h2">Hire healthcare and Medicaid talent.</h2>
                <p className="ch-emp-sub">
                  Reach a niche audience that already speaks Medicaid: eligibility,
                  compliance, billing, care management, analytics, EHR, and the direct-care
                  workforce.
                </p>
                <div className="careers-actions">
                  <Link href="/careers/post-a-job" className="ch-emp-cta">
                    Post a Job — $149
                  </Link>
                  <Link href="/careers/employers" className="ch-emp-cta-ghost">
                    See employer pricing
                  </Link>
                </div>
              </div>
              <div className="ch-emp-right" aria-hidden="true">
                <div className="ch-emp-card ch-emp-card-1">
                  <div className="ch-emp-card-row">
                    <div className="ch-emp-card-dot" />
                    <div className="ch-emp-card-text">Verified employer</div>
                  </div>
                </div>
                <div className="ch-emp-card ch-emp-card-2">
                  <div className="ch-emp-card-row">
                    <div className="ch-emp-card-icon">★</div>
                    <div className="ch-emp-card-text">Featured placement</div>
                  </div>
                </div>
                <div className="ch-emp-card ch-emp-card-3">
                  <div className="ch-emp-card-row">
                    <div className="ch-emp-card-icon">✓</div>
                    <div className="ch-emp-card-text">Manual review</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </CareersShell>

      <style jsx>{`
        .ch-hero {
          background: linear-gradient(180deg, #042C53 0%, #021c38 100%);
          padding: 56px 0 48px;
          color: #ffffff;
          border-bottom: 3px solid #BA7517;
        }
        .ch-hero-inner {
          max-width: 880px;
        }
        .ch-hero :global(.careers-eyebrow) {
          color: #EF9F27;
        }
        .ch-hero-title {
          font-size: 44px;
          line-height: 1.1;
          letter-spacing: -0.035em;
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 14px;
        }
        .ch-hero-sub {
          font-size: 17px;
          line-height: 1.65;
          color: #85B7EB;
          max-width: 720px;
          margin: 0 0 28px;
        }

        .ch-search {
          display: grid;
          grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr) auto;
          gap: 10px;
          background: #ffffff;
          padding: 8px;
          border-radius: 14px;
          box-shadow: 0 16px 42px rgba(2, 14, 32, 0.35), 0 4px 12px rgba(2, 14, 32, 0.2);
          margin-bottom: 18px;
        }
        .ch-search-field {
          position: relative;
          background: #ffffff;
          border-radius: 10px;
          display: flex;
          align-items: center;
          padding-left: 14px;
        }
        .ch-search-field-q {
          border-right: 1px solid #e2e8f0;
        }
        .ch-search-icon {
          color: #64748b;
          display: inline-flex;
          align-items: center;
          flex-shrink: 0;
        }
        .ch-search-input {
          width: 100%;
          border: 0;
          background: transparent;
          padding: 14px 12px;
          font-size: 15px;
          color: #0f172a;
          outline: none;
          font-family: inherit;
        }
        .ch-search-input::placeholder { color: #94a3b8; }
        .ch-search-btn {
          padding: 0 22px;
          border-radius: 10px;
          background: #BA7517;
          color: #ffffff;
          font-size: 14px;
          font-weight: 700;
          border: 1px solid #9a5f10;
          cursor: pointer;
          font-family: inherit;
          letter-spacing: 0.01em;
          box-shadow: inset 0 -2px 0 0 rgba(0,0,0,0.18);
          transition: background 140ms, transform 100ms;
          white-space: nowrap;
        }
        .ch-search-btn:hover {
          background: #d18d2a;
          transform: translateY(-1px);
        }

        .ch-popular {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .ch-popular-label {
          font-size: 13px;
          color: #85B7EB;
          font-weight: 600;
          letter-spacing: 0.02em;
        }
        .ch-popular-list {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }
        .ch-popular-chip {
          padding: 5px 11px;
          border-radius: 999px;
          background: rgba(133, 183, 235, 0.10);
          border: 1px solid rgba(133, 183, 235, 0.35);
          color: #ffffff;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          font-family: inherit;
          transition: background 120ms, border-color 120ms;
        }
        .ch-popular-chip:hover {
          background: rgba(186, 117, 23, 0.18);
          border-color: #BA7517;
        }

        .ch-hiring-section {
          padding: 24px 0 0;
        }
        .ch-hiring {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-left: 4px solid #BA7517;
          border-radius: 12px;
          padding: 14px 18px;
          display: flex;
          gap: 14px;
          align-items: center;
          flex-wrap: wrap;
        }
        .ch-hiring-head {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }
        .ch-hiring-dot {
          display: inline-block;
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: #16a34a;
          box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.18);
          animation: hpulse 1.8s ease-in-out infinite;
        }
        @keyframes hpulse {
          0%, 100% { box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.18); }
          50% { box-shadow: 0 0 0 6px rgba(22, 163, 74, 0.06); }
        }
        .ch-hiring-title {
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #042C53;
        }
        .ch-hiring-list {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .ch-hiring-pill {
          padding: 5px 11px;
          border-radius: 999px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          color: #334155;
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          transition: border-color 120ms, color 120ms, background 120ms;
        }
        .ch-hiring-pill:hover {
          border-color: #BA7517;
          background: #fff7e6;
          color: #042C53;
        }

        .ch-stats-section {
          padding: 24px 0 8px;
        }
        .ch-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 20px 24px;
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
        }
        .ch-stat {
          padding: 4px 8px;
          border-right: 1px solid #e2e8f0;
        }
        .ch-stat:last-child {
          border-right: 0;
        }
        .ch-stat-value {
          font-size: 26px;
          font-weight: 700;
          color: #042C53;
          letter-spacing: -0.025em;
          line-height: 1.2;
        }
        .ch-stat-label {
          font-size: 12px;
          color: #64748b;
          margin-top: 4px;
          font-weight: 500;
        }

        .ch-insights-section {
          padding: 28px 0 10px;
        }
        .ch-insights {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 24px;
          align-items: center;
          overflow: hidden;
          border-radius: 20px;
          border: 1px solid rgba(186, 117, 23, 0.35);
          background:
            radial-gradient(circle at top left, rgba(239, 159, 39, 0.22), transparent 34%),
            linear-gradient(135deg, #042C53 0%, #021c38 62%, #0C447C 100%);
          color: #ffffff;
          padding: 28px;
          box-shadow: 0 18px 46px rgba(4, 44, 83, 0.18);
        }
        .ch-insights-title {
          font-size: 30px;
          line-height: 1.15;
          letter-spacing: -0.035em;
          font-weight: 800;
          color: #ffffff;
          margin: 8px 0 12px;
          max-width: 680px;
        }
        .ch-insights-sub {
          font-size: 15px;
          line-height: 1.7;
          color: #dbeafe;
          margin: 0;
          max-width: 720px;
        }
        .ch-insights-actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-top: 22px;
        }
        .ch-insights-cta,
        .ch-insights-ghost {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 12px 18px;
          border-radius: 999px;
          font-size: 14px;
          font-weight: 800;
          text-decoration: none !important;
          transition: transform 100ms, background 140ms, border-color 140ms;
        }
        .ch-insights-cta {
          background: #EF9F27;
          border: 1px solid #BA7517;
          color: #061a2f !important;
          box-shadow: 0 12px 28px rgba(239, 159, 39, 0.22);
        }
        .ch-insights-cta:hover {
          background: #f6b34c;
          transform: translateY(-1px);
        }
        .ch-insights-ghost {
          border: 1px solid rgba(133, 183, 235, 0.45);
          color: #ffffff !important;
          background: rgba(255,255,255,0.06);
        }
        .ch-insights-ghost:hover {
          background: rgba(255,255,255,0.1);
          border-color: rgba(255,255,255,0.7);
          transform: translateY(-1px);
        }
        .ch-insights-panel {
          border-radius: 18px;
          border: 1px solid rgba(255,255,255,0.14);
          background: rgba(2, 28, 56, 0.72);
          padding: 20px;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.06);
        }
        .ch-insights-panel-top {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          color: #dbeafe;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          margin-bottom: 16px;
        }
        .ch-insights-live-dot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.14);
        }
        .ch-insights-metrics {
          display: grid;
          gap: 10px;
        }
        .ch-insights-metric {
          border-radius: 14px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.08);
          padding: 13px 14px;
        }
        .ch-insights-metric strong {
          display: block;
          color: #ffffff;
          font-size: 24px;
          line-height: 1;
          letter-spacing: -0.03em;
        }
        .ch-insights-metric span {
          display: block;
          color: #bfdbfe;
          font-size: 12px;
          margin-top: 6px;
          font-weight: 600;
        }
        .ch-insights-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
          margin-top: 14px;
        }
        .ch-insights-tags span {
          border-radius: 999px;
          background: rgba(239, 159, 39, 0.12);
          border: 1px solid rgba(239, 159, 39, 0.24);
          color: #fdecc8;
          font-size: 12px;
          font-weight: 700;
          padding: 6px 9px;
        }

        .ch-featured-card {
          display: grid;
          grid-template-columns: auto 1fr auto;
          gap: 18px;
          align-items: center;
          background: linear-gradient(180deg, #ffffff 0%, #fffbf2 100%);
          border: 2px solid #BA7517;
          border-radius: 16px;
          padding: 22px 24px;
          margin-top: 18px;
          text-decoration: none !important;
          color: inherit;
          box-shadow: 0 8px 24px rgba(186, 117, 23, 0.12);
          transition: transform 100ms, box-shadow 140ms;
        }
        .ch-featured-card:hover {
          transform: translateY(-1px);
          box-shadow: 0 14px 36px rgba(186, 117, 23, 0.18);
          color: inherit;
        }
        .ch-featured-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 11px;
          border-radius: 999px;
          background: #BA7517;
          color: #ffffff;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          flex-shrink: 0;
          align-self: flex-start;
        }
        .ch-featured-body {
          min-width: 0;
        }
        .ch-featured-title {
          font-size: 18px;
          font-weight: 700;
          color: #042C53;
          margin: 0 0 4px;
          letter-spacing: -0.02em;
        }
        .ch-featured-meta {
          font-size: 14px;
          color: #475569;
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
          margin-bottom: 8px;
        }
        .ch-featured-company {
          font-weight: 600;
          color: #334155;
        }
        .ch-featured-sep { color: #cbd5e1; }
        .ch-featured-summary {
          font-size: 14px;
          color: #475569;
          line-height: 1.6;
          margin: 0 0 10px;
        }
        .ch-featured-salary {
          display: inline-flex;
        }
        .ch-featured-cta {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 11px 18px;
          border-radius: 10px;
          background: #042C53;
          color: #ffffff;
          font-size: 14px;
          font-weight: 700;
          box-shadow: inset 0 -2px 0 0 #BA7517;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .ch-resources {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
          margin-top: 24px;
        }
        .ch-res-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 22px;
          text-decoration: none !important;
          color: inherit;
          transition: border-color 140ms, transform 100ms, box-shadow 140ms;
          display: flex;
          flex-direction: column;
        }
        .ch-res-card:hover {
          border-color: #BA7517;
          transform: translateY(-1px);
          box-shadow: 0 8px 22px rgba(4, 44, 83, 0.08);
          color: inherit;
        }
        .ch-res-card-featured {
          border-color: rgba(186, 117, 23, 0.5);
          background: linear-gradient(180deg, #ffffff 0%, #fff8eb 100%);
        }
        .ch-res-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: #fff7e6;
          color: #BA7517;
          border: 1px solid #f1deb3;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 14px;
        }
        .ch-res-title {
          font-size: 15px;
          font-weight: 700;
          color: #042C53;
          letter-spacing: -0.01em;
          margin-bottom: 6px;
        }
        .ch-res-body {
          font-size: 13px;
          color: #475569;
          line-height: 1.6;
          margin: 0 0 12px;
          flex: 1;
        }
        .ch-res-link {
          font-size: 13px;
          font-weight: 700;
          color: #BA7517;
        }

        .ch-emp-section {
          background: linear-gradient(180deg, #042C53 0%, #0C447C 100%);
          padding: 64px 0;
          color: #ffffff;
          border-top: 3px solid #BA7517;
        }
        .ch-emp {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 32px;
          align-items: center;
        }
        .ch-emp-h2 {
          font-size: 30px;
          font-weight: 700;
          letter-spacing: -0.03em;
          color: #ffffff;
          margin: 0 0 12px;
        }
        .ch-emp-sub {
          font-size: 16px;
          color: #85B7EB;
          line-height: 1.65;
          margin: 0;
          max-width: 540px;
        }
        .ch-emp-cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 13px 22px;
          border-radius: 10px;
          background: #BA7517;
          color: #ffffff !important;
          font-size: 15px;
          font-weight: 700;
          border: 1px solid #9a5f10;
          text-decoration: none !important;
          box-shadow: inset 0 -2px 0 0 rgba(0,0,0,0.18);
          transition: background 140ms, transform 100ms;
        }
        .ch-emp-cta:hover {
          background: #d18d2a;
          transform: translateY(-1px);
        }
        .ch-emp-cta-ghost {
          display: inline-flex;
          align-items: center;
          padding: 13px 20px;
          border-radius: 10px;
          background: transparent;
          color: #ffffff !important;
          font-size: 14px;
          font-weight: 600;
          border: 1px solid rgba(133, 183, 235, 0.5);
          text-decoration: none !important;
          transition: background 140ms, border-color 140ms;
        }
        .ch-emp-cta-ghost:hover {
          background: rgba(255,255,255,0.05);
          border-color: #ffffff;
        }
        .ch-emp-right {
          position: relative;
          height: 220px;
        }
        .ch-emp-card {
          position: absolute;
          background: #ffffff;
          color: #042C53;
          padding: 14px 18px;
          border-radius: 12px;
          box-shadow: 0 14px 36px rgba(2, 14, 32, 0.30);
          border: 1px solid rgba(255,255,255,0.6);
          font-size: 14px;
          font-weight: 700;
        }
        .ch-emp-card-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .ch-emp-card-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #0e7490;
          box-shadow: 0 0 0 3px rgba(14, 116, 144, 0.18);
        }
        .ch-emp-card-icon {
          width: 22px;
          height: 22px;
          border-radius: 6px;
          background: #fff7e6;
          color: #BA7517;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 800;
        }
        .ch-emp-card-1 {
          top: 8px;
          left: 0;
          transform: rotate(-3deg);
        }
        .ch-emp-card-2 {
          top: 64px;
          right: 12px;
          transform: rotate(2deg);
        }
        .ch-emp-card-3 {
          bottom: 6px;
          left: 36px;
          transform: rotate(-1.5deg);
        }

        @media (max-width: 960px) {
          .ch-hero-title { font-size: 34px; }
          .ch-search { grid-template-columns: 1fr; gap: 6px; padding: 6px; }
          .ch-search-field-q { border-right: 0; border-bottom: 1px solid #e2e8f0; }
          .ch-search-btn { padding: 14px 22px; }
          .ch-stats { grid-template-columns: 1fr 1fr; gap: 10px; }
          .ch-stat { border-right: 0; }
          .ch-insights { grid-template-columns: 1fr; padding: 22px; }
          .ch-insights-title { font-size: 25px; }
          .ch-resources { grid-template-columns: 1fr 1fr; }
          .ch-featured-card { grid-template-columns: 1fr; }
          .ch-featured-cta { width: max-content; }
          .ch-emp { grid-template-columns: 1fr; }
          .ch-emp-right { display: none; }
        }
        @media (max-width: 600px) {
          .ch-hero { padding: 44px 0 36px; }
          .ch-hero-title { font-size: 28px; }
          .ch-stats { grid-template-columns: 1fr 1fr; }
          .ch-resources { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
}