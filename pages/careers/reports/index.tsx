import Head from "next/head";
import Link from "next/link";
import type { GetStaticProps } from "next";
import CareersShell from "../../../components/careers/CareersShell";
import { careersJobSearchText } from "../../../lib/careers/categories";
import { listApprovedJobs } from "../../../lib/careers/db";
import type { CareersJob } from "../../../lib/careers/sampleJobs";

const SITE_URL = "https://www.medicaidready.org";
const PAGE_PATH = "/careers/reports";
const CANONICAL_URL = `${SITE_URL}${PAGE_PATH}`;

type ReportStats = {
  totalJobs: number;
  remoteJobs: number;
  uniqueCompanies: number;
  programAnalystRemote: number;
  dataAnalyticsRemote: number;
  cyberSecurity: number;
  cloudInfrastructure: number;
};

type Props = {
  stats: ReportStats;
  generatedAt: string;
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const jobs = await listApprovedJobs();
  const companies = new Set<string>();

  for (const job of jobs) {
    if (job.company?.trim()) companies.add(job.company.trim().toLowerCase());
  }

  const textIncludes = (job: CareersJob, terms: string[]) => {
    const text = careersJobSearchText(job).toLowerCase();

    return terms.some((term) => text.includes(term));
  };

  const stats: ReportStats = {
    totalJobs: jobs.length,
    remoteJobs: jobs.filter((job) => job.remote === "Remote").length,
    uniqueCompanies: companies.size,
    programAnalystRemote: jobs.filter(
      (job) =>
        job.remote === "Remote" &&
        textIncludes(job, [
          "program analyst",
          "project analyst",
          "management analyst",
          "program coordinator",
          "project coordinator",
          "program manager",
          "project manager",
        ])
    ).length,
    dataAnalyticsRemote: jobs.filter(
      (job) =>
        job.remote === "Remote" &&
        textIncludes(job, [
          "data analyst",
          "data scientist",
          "analytics",
          "business intelligence",
          "reporting analyst",
          "data engineer",
        ])
    ).length,
    cyberSecurity: jobs.filter((job) =>
      textIncludes(job, [
        "cybersecurity",
        "cyber security",
        "security engineer",
        "application security",
        "cloud security",
        "information security",
        "vulnerability",
      ])
    ).length,
    cloudInfrastructure: jobs.filter((job) =>
      textIncludes(job, [
        "cloud",
        "devops",
        "infrastructure",
        "site reliability",
        "sre",
        "azure",
        "aws",
        "gcp",
        "kubernetes",
      ])
    ).length,
  };

  return {
    props: {
      stats,
      generatedAt: new Date().toISOString(),
    },
    revalidate: 60,
  };
};

function formatNumber(value: number): string {
  return value.toLocaleString("en-US");
}

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Updated weekly";

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function CareersReportsIndex({ stats, generatedAt }: Props) {
  const metaTitle = "Career Reports — Weekly Hiring Intelligence | MedicaidReady Careers";
  const metaDescription =
    "Explore weekly hiring reports, salary signals, remote job trends, and verified market intelligence from MedicaidReady Careers.";

  const reports = [
    {
      eyebrow: "Live Report",
      title: "Remote Program Analyst Jobs Hiring This Week",
      description:
        "A weekly report for remote Program Analyst, Project Analyst, Management Analyst, and program operations roles.",
      href: "/careers/reports/remote-program-analyst-jobs-this-week",
      metric: stats.programAnalystRemote,
      metricLabel: "matched remote roles",
      status: "Live",
    },
    {
      eyebrow: "Market Watch",
      title: "Remote Data Analyst & Data Science Jobs",
      description:
        "Track remote data analyst, data science, analytics, reporting, and business intelligence opportunities.",
      href: "/careers/jobs?query=Data%20Analyst&workMode=remote",
      metric: stats.dataAnalyticsRemote,
      metricLabel: "remote data roles",
      status: "Job search",
    },
    {
      eyebrow: "Market Watch",
      title: "Cybersecurity Jobs Hiring Now",
      description:
        "Follow application security, cloud security, information security, vulnerability, and security engineering roles.",
      href: "/careers/jobs?category=cybersecurity",
      metric: stats.cyberSecurity,
      metricLabel: "security matches",
      status: "Job search",
    },
    {
      eyebrow: "Market Watch",
      title: "Cloud, DevOps & Infrastructure Jobs",
      description:
        "Review DevOps, SRE, cloud infrastructure, platform, Azure, AWS, GCP, and systems engineering roles.",
      href: "/careers/jobs?category=cloud_infrastructure",
      metric: stats.cloudInfrastructure,
      metricLabel: "cloud matches",
      status: "Job search",
    },
  ];

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: metaTitle,
    description: metaDescription,
    url: CANONICAL_URL,
    dateModified: generatedAt,
    publisher: {
      "@type": "Organization",
      name: "MedicaidReady Careers",
    },
  };

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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
        />
      </Head>

      <CareersShell>
        <main className="reports-page">
          <section className="reports-hero">
            <div className="reports-hero-glow" />
            <div className="careers-container reports-hero-inner">
              <div className="reports-breadcrumbs">
                <Link href="/careers">Careers</Link>
                <span>/</span>
                <Link href="/careers/insights">Insights</Link>
                <span>/</span>
                <span>Reports</span>
              </div>

              <div className="reports-hero-grid">
                <div>
                  <p className="reports-eyebrow">Career Intelligence Reports</p>
                  <h1>Weekly hiring reports built from verified job activity.</h1>
                  <p className="reports-hero-copy">
                    MedicaidReady Careers reports help job seekers understand what
                    employers are hiring for, which roles are showing momentum, and
                    where to focus their applications next.
                  </p>

                  <div className="reports-actions">
                    <Link
                      href="/careers/reports/remote-program-analyst-jobs-this-week"
                      className="reports-primary"
                    >
                      Read latest report
                    </Link>
                    <Link href="/careers/jobs" className="reports-secondary">
                      Browse verified jobs
                    </Link>
                  </div>
                </div>

                <aside className="reports-snapshot">
                  <div className="snapshot-label">Platform Snapshot</div>
                  <div className="snapshot-number">{formatNumber(stats.totalJobs)}</div>
                  <p>verified active listings powering current reports</p>

                  <div className="snapshot-grid">
                    <div>
                      <span>Remote-friendly</span>
                      <strong>{formatNumber(stats.remoteJobs)}</strong>
                    </div>
                    <div>
                      <span>Employers</span>
                      <strong>{formatNumber(stats.uniqueCompanies)}</strong>
                    </div>
                    <div>
                      <span>Updated</span>
                      <strong>{formatDate(generatedAt)}</strong>
                    </div>
                    <div>
                      <span>Focus</span>
                      <strong>Weekly</strong>
                    </div>
                  </div>
                </aside>
              </div>
            </div>
          </section>

          <section className="careers-section">
            <div className="careers-container">
              <div className="reports-section-head">
                <div>
                  <p className="reports-eyebrow reports-eyebrow-dark">Latest Reports</p>
                  <h2>Hiring intelligence you can actually use.</h2>
                  <p>
                    These reports are designed to help job seekers decide where to apply,
                    which skills to emphasize, and which career lanes are showing activity.
                  </p>
                </div>
              </div>

              <div className="reports-grid">
                {reports.map((report) => (
                  <Link href={report.href} className="report-card" key={report.title}>
                    <div className="report-card-top">
                      <span className="report-card-eyebrow">{report.eyebrow}</span>
                      <span className="report-status">{report.status}</span>
                    </div>

                    <h3>{report.title}</h3>
                    <p>{report.description}</p>

                    <div className="report-card-foot">
                      <div>
                        <strong>{formatNumber(report.metric)}</strong>
                        <span>{report.metricLabel}</span>
                      </div>
                      <span className="report-arrow">Read →</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          <section className="reports-method-section">
            <div className="careers-container">
              <div className="reports-method">
                <div>
                  <p className="reports-eyebrow">How to use these reports</p>
                  <h2>Apply with better timing and better positioning.</h2>
                  <p>
                    A job board tells you what is open. A career intelligence report
                    helps you understand what those openings are saying about the market.
                    Use these reports to identify recurring job titles, active skill
                    themes, remote hiring lanes, and employer demand patterns.
                  </p>
                </div>

                <div className="method-list">
                  <div>
                    <strong>1</strong>
                    <span>Review active roles in a focused lane.</span>
                  </div>
                  <div>
                    <strong>2</strong>
                    <span>Identify repeated skills and responsibilities.</span>
                  </div>
                  <div>
                    <strong>3</strong>
                    <span>Update your resume language before applying.</span>
                  </div>
                  <div>
                    <strong>4</strong>
                    <span>Track weekly changes as new roles are added.</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </CareersShell>

      <style jsx>{`
        .reports-page {
          background: #f8fafc;
          color: #0f172a;
        }

        .reports-hero {
          position: relative;
          overflow: hidden;
          background: #061b3a;
          color: #ffffff;
        }

        .reports-hero-glow {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at top right, rgba(245, 185, 66, 0.26), transparent 34%),
            radial-gradient(circle at left, rgba(56, 129, 255, 0.16), transparent 40%);
        }

        .reports-hero-inner {
          position: relative;
          padding-top: 44px;
          padding-bottom: 58px;
        }

        .reports-breadcrumbs {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          align-items: center;
          margin-bottom: 34px;
          font-size: 13px;
          font-weight: 800;
          color: rgba(255, 255, 255, 0.68);
        }

        .reports-breadcrumbs a {
          color: rgba(255, 255, 255, 0.84);
          text-decoration: none;
        }

        .reports-breadcrumbs a:hover {
          color: #f5b942;
        }

        .reports-hero-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.1fr) 380px;
          gap: 34px;
          align-items: center;
        }

        .reports-eyebrow {
          margin: 0;
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #f5b942;
        }

        .reports-eyebrow-dark {
          color: #0c447c;
        }

        .reports-hero h1 {
          max-width: 900px;
          margin: 12px 0 0;
          font-size: clamp(40px, 6vw, 70px);
          line-height: 0.95;
          letter-spacing: -0.06em;
          font-weight: 950;
        }

        .reports-hero-copy {
          max-width: 760px;
          margin: 22px 0 0;
          color: rgba(255, 255, 255, 0.76);
          font-size: 18px;
          line-height: 1.75;
        }

        .reports-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 30px;
        }

        .reports-primary,
        .reports-secondary {
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

        .reports-primary {
          background: #f5b942;
          color: #061b3a;
          padding: 13px 21px;
          box-shadow: 0 14px 30px rgba(0, 0, 0, 0.2);
        }

        .reports-primary:hover {
          background: #ffd978;
          transform: translateY(-1px);
        }

        .reports-secondary {
          border: 1px solid rgba(255, 255, 255, 0.22);
          color: #ffffff;
          padding: 13px 21px;
        }

        .reports-secondary:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-1px);
        }

        .reports-snapshot {
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

        .reports-snapshot p {
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

        .reports-section-head {
          margin-bottom: 24px;
        }

        .reports-section-head h2 {
          max-width: 820px;
          margin: 8px 0 0;
          color: #061b3a;
          font-size: clamp(30px, 4vw, 46px);
          line-height: 1.05;
          font-weight: 950;
          letter-spacing: -0.045em;
        }

        .reports-section-head p {
          max-width: 780px;
          margin: 14px 0 0;
          color: #64748b;
          line-height: 1.75;
          font-size: 16px;
        }

        .reports-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 18px;
        }

        .report-card {
          display: grid;
          min-height: 270px;
          border: 1px solid #dbe5f0;
          border-radius: 26px;
          background: #ffffff;
          padding: 24px;
          color: inherit;
          text-decoration: none;
          box-shadow: 0 14px 38px rgba(4, 44, 83, 0.06);
          transition:
            transform 160ms ease,
            border-color 160ms ease,
            box-shadow 160ms ease;
        }

        .report-card:hover {
          transform: translateY(-2px);
          border-color: #ba7517;
          box-shadow: 0 22px 52px rgba(4, 44, 83, 0.12);
        }

        .report-card-top {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          align-items: center;
        }

        .report-card-eyebrow {
          color: #ba7517;
          font-size: 11px;
          font-weight: 950;
          text-transform: uppercase;
          letter-spacing: 0.16em;
        }

        .report-status {
          border-radius: 999px;
          background: #f0fdf4;
          color: #15803d;
          border: 1px solid #bbf7d0;
          padding: 5px 10px;
          font-size: 11px;
          font-weight: 900;
        }

        .report-card h3 {
          margin: 18px 0 0;
          color: #061b3a;
          font-size: 25px;
          line-height: 1.12;
          font-weight: 950;
          letter-spacing: -0.035em;
        }

        .report-card p {
          margin: 12px 0 0;
          color: #64748b;
          line-height: 1.7;
          font-size: 15px;
        }

        .report-card-foot {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 16px;
          margin-top: auto;
          padding-top: 24px;
        }

        .report-card-foot strong {
          display: block;
          color: #061b3a;
          font-size: 30px;
          line-height: 1;
          font-weight: 950;
          letter-spacing: -0.04em;
        }

        .report-card-foot span {
          color: #64748b;
          font-size: 12px;
          font-weight: 800;
        }

        .report-arrow {
          color: #ba7517 !important;
          font-size: 13px !important;
          font-weight: 950 !important;
          white-space: nowrap;
        }

        .reports-method-section {
          background: #061b3a;
          color: #ffffff;
          padding: 58px 0;
        }

        .reports-method {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 420px;
          gap: 36px;
          align-items: center;
        }

        .reports-method h2 {
          max-width: 760px;
          margin: 10px 0 0;
          font-size: clamp(30px, 4vw, 48px);
          line-height: 1.05;
          font-weight: 950;
          letter-spacing: -0.045em;
        }

        .reports-method p {
          max-width: 760px;
          margin: 16px 0 0;
          color: rgba(255, 255, 255, 0.74);
          line-height: 1.75;
          font-size: 16px;
        }

        .method-list {
          display: grid;
          gap: 12px;
        }

        .method-list div {
          display: grid;
          grid-template-columns: 42px minmax(0, 1fr);
          gap: 12px;
          align-items: center;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.08);
          padding: 14px;
        }

        .method-list strong {
          width: 42px;
          height: 42px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: #f5b942;
          color: #061b3a;
          font-weight: 950;
        }

        .method-list span {
          color: rgba(255, 255, 255, 0.78);
          font-size: 14px;
          font-weight: 800;
          line-height: 1.5;
        }

        @media (max-width: 980px) {
          .reports-hero-grid,
          .reports-method {
            grid-template-columns: 1fr;
          }

          .reports-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 680px) {
          .snapshot-grid {
            grid-template-columns: 1fr;
          }

          .report-card {
            min-height: auto;
          }

          .report-card-foot {
            align-items: flex-start;
            flex-direction: column;
          }
        }
      `}</style>
    </>
  );
}