import Head from "next/head";
import Link from "next/link";
import type { GetStaticProps } from "next";
import CareersShell from "../../../components/careers/CareersShell";
import { careersJobSearchText } from "../../../lib/careers/categories";
import { listApprovedJobs } from "../../../lib/careers/db";
import type { CareersJob } from "../../../lib/careers/sampleJobs";

const SITE_URL = "https://www.medicaidready.org";
const PAGE_PATH = "/careers/reports/cloud-devops-infrastructure-jobs-hiring-now";
const CANONICAL_URL = `${SITE_URL}${PAGE_PATH}`;

type Props = {
  jobs: CareersJob[];
  generatedAt: string;
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const allJobs = await listApprovedJobs();

  const jobs = allJobs
    .filter((job) => {
      const text = careersJobSearchText(job).toLowerCase();

      return [
        "cloud engineer",
        "cloud infrastructure",
        "cloud administrator",
        "cloud architect",
        "devops",
        "dev ops",
        "site reliability",
        "sre",
        "infrastructure engineer",
        "infrastructure analyst",
        "systems engineer",
        "systems administrator",
        "platform engineer",
        "platform operations",
        "network engineer",
        "network administrator",
        "azure",
        "aws",
        "amazon web services",
        "gcp",
        "google cloud",
        "kubernetes",
        "docker",
        "terraform",
        "linux administrator",
        "windows administrator",
        "cloud operations",
      ].some((term) => text.includes(term));
    })
    .slice(0, 60);

  return {
    props: {
      jobs,
      generatedAt: new Date().toISOString(),
    },
    revalidate: 60,
  };
};

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "This week";

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatPostedAt(iso: string): string {
  const then = new Date(iso).getTime();

  if (Number.isNaN(then)) return "";

  const days = Math.max(0, Math.floor((Date.now() - then) / 86_400_000));

  if (days === 0) return "Posted today";
  if (days === 1) return "Posted yesterday";
  if (days < 30) return `Posted ${days} days ago`;

  const months = Math.floor(days / 30);

  return `Posted ${months} month${months === 1 ? "" : "s"} ago`;
}

function getJobApplyUrl(job: CareersJob): string | null {
  const flexibleJob = job as CareersJob & {
    apply_url?: string | null;
    applyUrl?: string | null;
    url?: string | null;
  };

  return flexibleJob.apply_url || flexibleJob.applyUrl || flexibleJob.url || null;
}

function companyInitials(company: string): string {
  const parts = company.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return "MR";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

  return ((parts[0][0] || "") + (parts[parts.length - 1][0] || "")).toUpperCase();
}

function uniqueCount(values: string[]): number {
  return new Set(values.filter(Boolean).map((value) => value.trim().toLowerCase())).size;
}

export default function CloudDevOpsInfrastructureReport({ jobs, generatedAt }: Props) {
  const salaryListedCount = jobs.filter((job) => job.salary && job.salary.trim()).length;
  const companyCount = uniqueCount(jobs.map((job) => job.company));
  const remoteCount = jobs.filter((job) => job.remote === "Remote").length;
  const hybridCount = jobs.filter((job) => job.remote === "Hybrid").length;
  const topJobs = jobs.slice(0, 12);
  const updatedLabel = formatDate(generatedAt);

  const metaTitle = "Cloud, DevOps & Infrastructure Jobs Hiring Now | MedicaidReady Careers";
  const metaDescription =
    "A MedicaidReady Careers report on cloud engineering, DevOps, infrastructure, SRE, platform engineering, systems administration, Azure, AWS, GCP, and Kubernetes jobs currently hiring.";

  const reportJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: metaTitle,
    description: metaDescription,
    datePublished: generatedAt,
    dateModified: generatedAt,
    author: {
      "@type": "Organization",
      name: "MedicaidReady Careers",
    },
    publisher: {
      "@type": "Organization",
      name: "MedicaidReady Careers",
    },
    mainEntityOfPage: CANONICAL_URL,
  };

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Cloud, DevOps & Infrastructure Jobs Hiring Now",
    numberOfItems: topJobs.length,
    itemListElement: topJobs.map((job, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: job.title,
      url: `${SITE_URL}/careers/jobs/${job.id}`,
    })),
  };

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={CANONICAL_URL} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={CANONICAL_URL} />
        <meta property="og:site_name" content="MedicaidReady Careers" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(reportJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
        />
      </Head>

      <CareersShell>
        <main className="report-page">
          <section className="report-hero">
            <div className="report-hero-glow" />
            <div className="careers-container report-hero-inner">
              <div className="report-breadcrumbs">
                <Link href="/careers">Careers</Link>
                <span>/</span>
                <Link href="/careers/insights">Insights</Link>
                <span>/</span>
                <Link href="/careers/reports">Reports</Link>
                <span>/</span>
                <span>Cloud & Infrastructure</span>
              </div>

              <div className="report-hero-grid">
                <div>
                  <p className="report-eyebrow">Hiring Intelligence Report</p>
                  <h1>Cloud, DevOps & Infrastructure Jobs Hiring Now</h1>
                  <p className="report-hero-copy">
                    A career intelligence brief for job seekers tracking cloud engineering,
                    DevOps, infrastructure, SRE, platform engineering, systems
                    administration, Azure, AWS, GCP, Kubernetes, and cloud operations roles.
                  </p>

                  <div className="report-actions">
                    <Link
                      href="/careers/jobs?query=Cloud%20DevOps%20Infrastructure"
                      className="report-primary"
                    >
                      Browse Cloud & DevOps Jobs
                    </Link>
                    <Link href="/careers/reports" className="report-secondary">
                      Back to Reports
                    </Link>
                  </div>
                </div>

                <aside className="report-snapshot">
                  <div className="snapshot-label">Report Snapshot</div>
                  <div className="snapshot-number">{jobs.length}</div>
                  <p>cloud, DevOps, infrastructure, and platform roles matched in the current job database</p>

                  <div className="snapshot-grid">
                    <div>
                      <span>Companies</span>
                      <strong>{companyCount}</strong>
                    </div>
                    <div>
                      <span>Remote</span>
                      <strong>{remoteCount}</strong>
                    </div>
                    <div>
                      <span>Hybrid</span>
                      <strong>{hybridCount}</strong>
                    </div>
                    <div>
                      <span>Updated</span>
                      <strong>{updatedLabel}</strong>
                    </div>
                  </div>
                </aside>
              </div>
            </div>
          </section>

          <section className="careers-section">
            <div className="careers-container">
              <div className="report-layout">
                <article className="report-main">
                  <section className="report-card">
                    <p className="report-eyebrow report-eyebrow-dark">This Week’s Read</p>
                    <h2>What cloud and infrastructure hiring is showing</h2>
                    <p>
                      Cloud and infrastructure hiring is spread across several job families.
                      Employers may use titles such as Cloud Engineer, DevOps Engineer,
                      Infrastructure Engineer, Site Reliability Engineer, Platform Engineer,
                      Systems Administrator, Network Engineer, or Cloud Operations Analyst.
                    </p>
                    <p>
                      Strong applicants usually show hands-on systems knowledge, reliability
                      thinking, automation awareness, troubleshooting ability, cloud platform
                      exposure, and the discipline to document systems clearly for teams.
                    </p>
                  </section>

                  <section className="report-card">
                    <div className="report-section-head">
                      <div>
                        <p className="report-eyebrow report-eyebrow-dark">Verified Openings</p>
                        <h2>Cloud and infrastructure roles to review now</h2>
                      </div>
                      <Link href="/careers/jobs?query=Cloud%20DevOps%20Infrastructure">See all →</Link>
                    </div>

                    {topJobs.length === 0 ? (
                      <div className="report-empty">
                        <h3>No cloud or infrastructure matches are active right now.</h3>
                        <p>
                          This report page is live and will update as new verified cloud,
                          DevOps, infrastructure, and platform roles are imported into
                          MedicaidReady Careers.
                        </p>
                      </div>
                    ) : (
                      <div className="report-job-list">
                        {topJobs.map((job) => {
                          const applyUrl = getJobApplyUrl(job);

                          return (
                            <article className="report-job" key={job.id}>
                              <div className="job-avatar" aria-hidden="true">
                                {companyInitials(job.company)}
                              </div>

                              <div className="job-body">
                                <div className="job-top">
                                  <div>
                                    <h3>
                                      <Link href={`/careers/jobs/${job.id}`}>{job.title}</Link>
                                    </h3>
                                    <p>
                                      {job.company} · {job.location}
                                    </p>
                                  </div>

                                  {job.featured && <span className="featured-pill">Featured</span>}
                                </div>

                                <div className="job-pills">
                                  <span>{job.type}</span>
                                  <span>{job.remote}</span>
                                  {job.salary && <span>{job.salary}</span>}
                                </div>

                                {job.summary && <p className="job-summary">{job.summary}</p>}

                                <div className="job-foot">
                                  <span>{formatPostedAt(job.postedAt)}</span>
                                  <div className="job-actions">
                                    <Link href={`/careers/jobs/${job.id}`} className="outline-btn">
                                      Details
                                    </Link>
                                    {applyUrl ? (
                                      <a
                                        href={applyUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="apply-btn"
                                      >
                                        Apply
                                      </a>
                                    ) : (
                                      <Link href={`/careers/jobs/${job.id}`} className="apply-btn">
                                        Apply
                                      </Link>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </article>
                          );
                        })}
                      </div>
                    )}
                  </section>

                  <section className="report-card">
                    <p className="report-eyebrow report-eyebrow-dark">Application Strategy</p>
                    <h2>How to position yourself for cloud, DevOps, and infrastructure roles</h2>
                    <div className="strategy-grid">
                      <div>
                        <h3>Separate the lane clearly</h3>
                        <p>
                          Make it obvious whether you are targeting cloud engineering,
                          DevOps, infrastructure, systems administration, SRE, platform
                          engineering, or network operations.
                        </p>
                      </div>
                      <div>
                        <h3>Show reliability and ownership</h3>
                        <p>
                          Highlight uptime, monitoring, troubleshooting, automation,
                          patching, deployments, migrations, incident support, or systems
                          documentation when accurate.
                        </p>
                      </div>
                      <div>
                        <h3>Name platforms honestly</h3>
                        <p>
                          Include AWS, Azure, GCP, Kubernetes, Docker, Terraform, Linux,
                          Windows Server, CI/CD, or networking tools only when you can
                          explain your practical exposure.
                        </p>
                      </div>
                      <div>
                        <h3>Connect technical work to outcomes</h3>
                        <p>
                          Employers value applicants who can explain how infrastructure
                          work improves security, performance, reliability, cost control,
                          and team productivity.
                        </p>
                      </div>
                    </div>
                  </section>
                </article>

                <aside className="report-sidebar">
                  <div className="side-card">
                    <p className="report-eyebrow report-eyebrow-dark">Quick Filters</p>
                    <div className="chip-list">
                      <Link href="/careers/jobs?query=Cloud%20Engineer">Cloud Engineer</Link>
                      <Link href="/careers/jobs?query=DevOps%20Engineer">DevOps Engineer</Link>
                      <Link href="/careers/jobs?query=Infrastructure%20Engineer">
                        Infrastructure Engineer
                      </Link>
                      <Link href="/careers/jobs?query=Site%20Reliability%20Engineer">
                        Site Reliability Engineer
                      </Link>
                    </div>
                  </div>

                  <div className="side-card side-navy">
                    <p className="report-eyebrow">Skills Watch</p>
                    <ul>
                      <li>AWS, Azure, GCP, and cloud operations</li>
                      <li>Linux, Windows, networking, and systems administration</li>
                      <li>Automation, scripting, CI/CD, and infrastructure as code</li>
                      <li>Kubernetes, Docker, platform reliability, and monitoring</li>
                      <li>Incident response, documentation, and operational ownership</li>
                    </ul>
                  </div>

                  <div className="side-card">
                    <p className="report-eyebrow report-eyebrow-dark">Related Reports</p>
                    <div className="mini-links">
                      <Link href="/careers/reports">All reports</Link>
                      <Link href="/careers/reports/cybersecurity-jobs-hiring-now">
                        Cybersecurity Jobs Hiring Now
                      </Link>
                      <Link href="/careers/reports/remote-data-analyst-data-science-jobs-this-week">
                        Remote Data Analyst Jobs
                      </Link>
                      <Link href="/careers/reports/remote-program-analyst-jobs-this-week">
                        Remote Program Analyst Jobs
                      </Link>
                    </div>
                  </div>
                </aside>
              </div>
            </div>
          </section>
        </main>
      </CareersShell>

      <style jsx>{`
        .report-page {
          background: #f8fafc;
          color: #0f172a;
        }

        .report-hero {
          position: relative;
          overflow: hidden;
          background: #061b3a;
          color: #ffffff;
        }

        .report-hero-glow {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at top right, rgba(245, 185, 66, 0.26), transparent 34%),
            radial-gradient(circle at left, rgba(56, 129, 255, 0.16), transparent 40%);
        }

        .report-hero-inner {
          position: relative;
          padding-top: 44px;
          padding-bottom: 58px;
        }

        .report-breadcrumbs {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          align-items: center;
          margin-bottom: 34px;
          font-size: 13px;
          font-weight: 800;
          color: rgba(255, 255, 255, 0.68);
        }

        .report-breadcrumbs a {
          color: rgba(255, 255, 255, 0.84);
          text-decoration: none;
        }

        .report-breadcrumbs a:hover {
          color: #f5b942;
        }

        .report-hero-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.1fr) 380px;
          gap: 34px;
          align-items: center;
        }

        .report-eyebrow {
          margin: 0;
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #f5b942;
        }

        .report-eyebrow-dark {
          color: #0c447c;
        }

        .report-hero h1 {
          max-width: 900px;
          margin: 12px 0 0;
          font-size: clamp(40px, 6vw, 70px);
          line-height: 0.95;
          letter-spacing: -0.06em;
          font-weight: 950;
        }

        .report-hero-copy {
          max-width: 760px;
          margin: 22px 0 0;
          color: rgba(255, 255, 255, 0.76);
          font-size: 18px;
          line-height: 1.75;
        }

        .report-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 30px;
        }

        .report-primary,
        .report-secondary,
        .outline-btn,
        .apply-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          font-size: 14px;
          font-weight: 950;
          text-decoration: none;
          transition:
            transform 160ms ease,
            background 160ms ease,
            border-color 160ms ease;
        }

        .report-primary {
          background: #f5b942;
          color: #061b3a;
          padding: 13px 21px;
          box-shadow: 0 14px 30px rgba(0, 0, 0, 0.2);
        }

        .report-primary:hover {
          background: #ffd978;
          transform: translateY(-1px);
        }

        .report-secondary {
          border: 1px solid rgba(255, 255, 255, 0.22);
          color: #ffffff;
          padding: 13px 21px;
        }

        .report-secondary:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-1px);
        }

        .report-snapshot {
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 30px;
          background: rgba(255, 255, 255, 0.1);
          padding: 26px;
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.25);
        }

        .snapshot-label {
          color: #f5b942;
          font-size: 12px;
          font-weight: 950;
          text-transform: uppercase;
          letter-spacing: 0.18em;
        }

        .snapshot-number {
          margin-top: 16px;
          font-size: 62px;
          line-height: 1;
          font-weight: 950;
        }

        .report-snapshot p {
          margin: 10px 0 0;
          color: rgba(255, 255, 255, 0.72);
          line-height: 1.6;
        }

        .snapshot-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-top: 22px;
        }

        .snapshot-grid div {
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.08);
          padding: 14px;
        }

        .snapshot-grid span {
          display: block;
          color: rgba(255, 255, 255, 0.58);
          font-size: 12px;
          font-weight: 800;
        }

        .snapshot-grid strong {
          display: block;
          margin-top: 4px;
          color: #ffffff;
          font-size: 15px;
        }

        .report-layout {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 330px;
          gap: 26px;
          align-items: start;
        }

        .report-main,
        .report-sidebar {
          min-width: 0;
        }

        .report-main {
          display: grid;
          gap: 18px;
        }

        .report-card,
        .side-card,
        .report-empty {
          border: 1px solid #dbe5f0;
          border-radius: 26px;
          background: #ffffff;
          padding: 24px;
          box-shadow: 0 14px 38px rgba(4, 44, 83, 0.06);
        }

        .report-card h2 {
          margin: 8px 0 0;
          color: #061b3a;
          font-size: 30px;
          line-height: 1.08;
          font-weight: 950;
          letter-spacing: -0.04em;
        }

        .report-card p {
          color: #475569;
          line-height: 1.75;
          font-size: 15px;
        }

        .report-section-head {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          align-items: flex-end;
          margin-bottom: 18px;
        }

        .report-section-head a {
          color: #ba7517;
          font-size: 14px;
          font-weight: 950;
          text-decoration: none;
          white-space: nowrap;
        }

        .report-job-list {
          display: grid;
          gap: 14px;
        }

        .report-job {
          display: grid;
          grid-template-columns: 52px minmax(0, 1fr);
          gap: 16px;
          border: 1px solid #e2e8f0;
          border-radius: 22px;
          background: #ffffff;
          padding: 18px;
        }

        .job-avatar {
          width: 52px;
          height: 52px;
          border-radius: 16px;
          background: linear-gradient(135deg, #061b3a, #0c447c);
          color: #f5b942;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 950;
        }

        .job-top {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          align-items: flex-start;
        }

        .job-top h3 {
          margin: 0;
          color: #061b3a;
          font-size: 18px;
          line-height: 1.25;
          font-weight: 950;
        }

        .job-top h3 a {
          color: inherit;
          text-decoration: none;
        }

        .job-top h3 a:hover {
          color: #0c447c;
        }

        .job-top p {
          margin: 6px 0 0;
          color: #64748b;
          font-size: 13px;
          font-weight: 750;
        }

        .featured-pill {
          border-radius: 999px;
          background: #fff7e6;
          color: #ba7517;
          border: 1px solid #f1deb3;
          padding: 5px 10px;
          font-size: 11px;
          font-weight: 950;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .job-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 13px;
        }

        .job-pills span {
          border-radius: 999px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          color: #334155;
          padding: 6px 10px;
          font-size: 12px;
          font-weight: 850;
        }

        .job-summary {
          margin: 13px 0 0 !important;
          color: #475569 !important;
          line-height: 1.7 !important;
          font-size: 14px !important;
        }

        .job-foot {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          align-items: center;
          margin-top: 15px;
          color: #64748b;
          font-size: 13px;
          font-weight: 750;
        }

        .job-actions {
          display: inline-flex;
          gap: 8px;
          align-items: center;
        }

        .outline-btn {
          border: 1px solid #cbd5e1;
          color: #334155;
          background: #ffffff;
          padding: 9px 14px;
        }

        .outline-btn:hover {
          border-color: #ba7517;
          color: #ba7517;
        }

        .apply-btn {
          background: #061b3a;
          color: #ffffff;
          padding: 10px 16px;
        }

        .apply-btn:hover {
          background: #0c447c;
          transform: translateY(-1px);
        }

        .strategy-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          margin-top: 18px;
        }

        .strategy-grid div {
          border-radius: 20px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          padding: 18px;
        }

        .strategy-grid h3 {
          margin: 0;
          color: #061b3a;
          font-size: 16px;
          font-weight: 950;
        }

        .strategy-grid p {
          margin: 8px 0 0;
          font-size: 14px;
        }

        .report-sidebar {
          display: grid;
          gap: 16px;
          position: sticky;
          top: 24px;
        }

        .chip-list,
        .mini-links {
          display: grid;
          gap: 9px;
          margin-top: 14px;
        }

        .chip-list a,
        .mini-links a {
          border-radius: 16px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          color: #334155;
          padding: 12px;
          text-decoration: none;
          font-size: 13px;
          font-weight: 850;
        }

        .chip-list a:hover,
        .mini-links a:hover {
          border-color: #ba7517;
          background: #fff7e6;
          color: #ba7517;
        }

        .side-navy {
          background: #061b3a;
          color: #ffffff;
          border-color: rgba(255, 255, 255, 0.12);
        }

        .side-navy ul {
          display: grid;
          gap: 10px;
          margin: 16px 0 0;
          padding: 0;
          list-style: none;
        }

        .side-navy li {
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.08);
          padding: 12px;
          color: rgba(255, 255, 255, 0.78);
          font-size: 13px;
          font-weight: 800;
        }

        @media (max-width: 980px) {
          .report-hero-grid,
          .report-layout {
            grid-template-columns: 1fr;
          }

          .report-sidebar {
            position: static;
          }
        }

        @media (max-width: 680px) {
          .snapshot-grid,
          .strategy-grid {
            grid-template-columns: 1fr;
          }

          .report-job {
            grid-template-columns: 1fr;
          }

          .job-top,
          .job-foot,
          .report-section-head {
            align-items: flex-start;
            flex-direction: column;
          }
        }
      `}</style>
    </>
  );
}