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
    "MedicaidReady Careers — Verified Jobs Across Tech, Healthcare, Data, and Public Sector";
  const metaDescription =
    "Find verified jobs across technology, healthcare, data, cybersecurity, cloud, public sector, analyst, operations, and care workforce career tracks. Updated weekly. Apply directly through each employer's official site.";

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
                Verified jobs across tech, healthcare, data, public sector, and care careers — all in one place.
              </h1>
              <p className="ch-hero-sub">
                Curated openings across technology, cybersecurity, cloud, data,
                healthcare, public sector, analyst, operations, and care workforce
                roles. Updated weekly. Apply through each employer&apos;s official site.
              </p>

              <form className="ch-search" onSubmit={handleSearch} role="search">
                <div className="ch-search-field ch-search-field-q">
                  <span className="ch-search-icon" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <circle cx="8" cy="8" r="5.25" stroke="currentColor" strokeWidth="1.6" />
                      <path d="M12 12l3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
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
                  <div className="ch-stat-label">Market updates</div>
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
              Free resources you can use today — from career insights and verified
              job search tools to benefits guidance and practical hiring resources.
            </p>

            <div className="ch-resources">
              <Link href="/careers/insights" className="ch-res-card ch-res-card-featured">
                <div className="ch-res-icon" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M4 15V5M8 15V9M12 15V7M16 15V3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M3 16h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="ch-res-title">Career Insights Center</div>
                <div className="ch-res-body">
                  Hiring trends, salary insights, weekly reports, and verified job market signals.
                </div>
                <span className="ch-res-link">Explore insights →</span>
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
                <span className="ch-res-link">Find jobs →</span>
              </Link>

              <Link href="/careers/resources" className="ch-res-card">
                <div className="ch-res-icon" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M4 4h12v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                    <path d="M7 8h6M7 11h6M7 14h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="ch-res-title">Career resources</div>
                <div className="ch-res-body">
                  Curated links and guides for tech, healthcare, data, public sector,
                  Medicaid, and care workforce career pathways.
                </div>
                <span className="ch-res-link">Browse resources →</span>
              </Link>

              <Link href="/careers/companies" className="ch-res-card">
                <div className="ch-res-icon" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M4 17V5l6-3 6 3v12" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                    <path d="M7 17v-5h6v5M7 7h.01M10 7h.01M13 7h.01M7 10h.01M13 10h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="ch-res-title">Browse companies</div>
                <div className="ch-res-body">
                  Explore employers represented across MedicaidReady Careers listings.
                </div>
                <span className="ch-res-link">View companies →</span>
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
    </>
  );
}