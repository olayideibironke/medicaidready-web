import Head from "next/head";
import Link from "next/link";
import CareersShell from "../../../components/careers/CareersShell";

const SITE_URL = "https://www.medicaidready.org";

const verificationStats = [
  {
    value: "282",
    label: "verified listings reviewed",
  },
  {
    value: "0",
    label: "broken application links after cleanup",
  },
  {
    value: "0",
    label: "duplicate job groups after audit",
  },
  {
    value: "Weekly",
    label: "job refresh and quality review cycle",
  },
];

const hiringTrends = [
  {
    title: "Remote data roles continue to attract strong demand",
    body:
      "Data Analyst roles remain active across healthcare, public sector, finance, nonprofit, technology, operations, and business intelligence teams.",
  },
  {
    title: "Healthcare data experience is valuable",
    body:
      "Candidates with experience in claims, Medicaid, population health, provider data, quality reporting, utilization, EHR, or payer operations can stand out.",
  },
  {
    title: "Tools matter more than titles",
    body:
      "Employers often look for Excel, SQL, Power BI, Tableau, dashboarding, reporting, data cleaning, and stakeholder communication skills.",
  },
];

const featuredSearches = [
  {
    title: "Remote Data Analyst jobs",
    description:
      "Explore remote and flexible Data Analyst opportunities across healthcare, business intelligence, operations, and reporting teams.",
    href: "/careers/jobs?q=Remote%20Data%20Analyst",
  },
  {
    title: "Healthcare Data Analyst jobs",
    description:
      "Find data roles connected to Medicaid, claims, population health, quality reporting, provider data, and healthcare operations.",
    href: "/careers/jobs?q=Healthcare%20Data%20Analyst",
  },
  {
    title: "Business Intelligence Analyst jobs",
    description:
      "Search analyst roles involving dashboards, Power BI, Tableau, SQL, reporting, and decision-support workflows.",
    href: "/careers/jobs?q=Business%20Intelligence%20Analyst",
  },
];

const companiesHiring = [
  "Healthcare systems",
  "Managed care organizations",
  "Health technology teams",
  "Government contractors",
  "Business intelligence teams",
  "Remote-first operations teams",
];

const salarySnapshot = [
  {
    level: "Entry to early career",
    range: "$62k – $82k",
    note: "Common for reporting support, Excel-heavy analysis, data cleanup, operational dashboards, and junior analytics roles.",
  },
  {
    level: "Mid-level analyst",
    range: "$82k – $112k",
    note: "Often tied to SQL, Power BI, Tableau, healthcare data, stakeholder reporting, and recurring dashboard ownership.",
  },
  {
    level: "Senior / specialized analyst",
    range: "$112k – $140k+",
    note: "More common when roles require advanced SQL, Python, payer data, claims, financial analytics, data modeling, or leadership-level reporting.",
  },
];

const applicationTips = [
  "Put your strongest tools near the top of your resume: Excel, SQL, Power BI, Tableau, Python, Salesforce, EHR systems, or claims platforms.",
  "Show business impact. Mention dashboards built, reports automated, datasets cleaned, turnaround time improved, or decisions supported.",
  "Use the employer's language. If the posting says SQL, reporting, dashboards, quality, claims, or provider data, reflect those terms naturally in your resume.",
  "For remote roles, show that you can communicate clearly with stakeholders and deliver reliable reporting without constant supervision.",
];

export default function RemoteDataAnalystReportPage() {
  const url = `${SITE_URL}/careers/insights/remote-data-analyst-jobs-this-week`;
  const title = "Remote Data Analyst Jobs Hiring This Week | MedicaidReady Careers";
  const description =
    "Explore remote Data Analyst hiring trends, verified job searches, salary signals, companies hiring, and application tips from MedicaidReady Careers.";

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={url} />
        <meta property="og:site_name" content="MedicaidReady" />
      </Head>

      <CareersShell>
        <main className="report-page">
          <section className="report-hero">
            <div className="careers-container">
              <div className="report-hero-grid">
                <div>
                  <div className="report-eyebrow">Weekly Hiring Report</div>
                  <h1 className="report-title">
                    Remote Data Analyst Jobs Hiring This Week
                  </h1>
                  <p className="report-subtitle">
                    A practical career intelligence report for job seekers tracking
                    verified remote and flexible Data Analyst roles across healthcare,
                    Medicaid, reporting, business intelligence, operations, finance,
                    and public sector teams.
                  </p>

                  <div className="report-actions">
                    <Link
                      href="/careers/jobs?q=Remote%20Data%20Analyst"
                      className="report-primary-btn"
                    >
                      View matching jobs
                    </Link>
                    <Link href="/careers/insights" className="report-secondary-btn">
                      Back to Insights
                    </Link>
                  </div>
                </div>

                <div className="report-hero-card">
                  <div className="report-card-label">Verification Summary</div>
                  <h2>Cleaner job data for serious applicants.</h2>
                  <p>
                    MedicaidReady Careers reviews active listings, archives expired
                    jobs, removes duplicate listings, and prioritizes official
                    employer application paths before publishing refreshed opportunities.
                  </p>
                  <div className="report-mini-list">
                    <span>Active links reviewed</span>
                    <span>Expired jobs archived</span>
                    <span>Duplicate listings removed</span>
                    <span>Official apply paths prioritized</span>
                  </div>
                </div>
              </div>

              <div className="report-stats">
                {verificationStats.map((item) => (
                  <div className="report-stat" key={item.label}>
                    <strong>{item.value}</strong>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="report-section">
            <div className="careers-container">
              <div className="report-section-head">
                <div>
                  <div className="report-kicker">Hiring Trends</div>
                  <h2>What data analyst candidates should watch this week.</h2>
                </div>
                <p>
                  Remote Data Analyst roles can be competitive because the skillset
                  applies across many industries. Candidates who connect data skills
                  to real business, healthcare, or operational outcomes usually have
                  a stronger application.
                </p>
              </div>

              <div className="trend-grid">
                {hiringTrends.map((trend) => (
                  <article className="trend-card" key={trend.title}>
                    <h3>{trend.title}</h3>
                    <p>{trend.body}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="report-section report-section-soft">
            <div className="careers-container">
              <div className="report-section-head">
                <div>
                  <div className="report-kicker">Featured Verified Jobs</div>
                  <h2>Start with these verified job searches.</h2>
                </div>
                <p>
                  These searches help candidates quickly move from market insight
                  to active opportunities using the MedicaidReady Careers verified
                  jobs directory.
                </p>
              </div>

              <div className="featured-job-grid">
                {featuredSearches.map((item) => (
                  <Link href={item.href} className="featured-job-card" key={item.title}>
                    <div className="featured-job-badge">Verified search</div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <span>Explore jobs →</span>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          <section className="report-section">
            <div className="careers-container">
              <div className="two-column">
                <div className="report-panel dark-panel">
                  <div className="report-kicker gold">Companies Hiring</div>
                  <h2>Where Data Analyst demand often appears.</h2>
                  <p>
                    Data Analyst roles show up wherever teams need better visibility:
                    dashboards, reporting, quality tracking, claims review, provider
                    data, performance metrics, finance, operations, and compliance.
                  </p>

                  <div className="company-tags">
                    {companiesHiring.map((company) => (
                      <span key={company}>{company}</span>
                    ))}
                  </div>

                  <Link href="/careers/companies" className="panel-link-light">
                    Browse hiring companies →
                  </Link>
                </div>

                <div className="report-panel">
                  <div className="report-kicker">Salary Snapshot</div>
                  <h2>Typical salary signals for Data Analyst roles.</h2>

                  <div className="salary-list">
                    {salarySnapshot.map((item) => (
                      <div className="salary-row" key={item.level}>
                        <div className="salary-top">
                          <strong>{item.level}</strong>
                          <span>{item.range}</span>
                        </div>
                        <p>{item.note}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="report-section report-section-soft">
            <div className="careers-container">
              <div className="two-column tips-grid">
                <div>
                  <div className="report-kicker">Application Tips</div>
                  <h2 className="tips-title">
                    How to compete for remote Data Analyst roles.
                  </h2>
                  <p className="tips-lead">
                    The best Data Analyst applications make the employer believe
                    quickly that you can turn messy information into useful answers.
                    Keep your resume practical, tool-focused, and outcome-driven.
                  </p>
                </div>

                <div className="tips-list">
                  {applicationTips.map((tip) => (
                    <div className="tip-item" key={tip}>
                      <span aria-hidden="true">✓</span>
                      <p>{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="report-cta-section">
            <div className="careers-container">
              <div className="report-cta">
                <div>
                  <div className="report-kicker gold">Explore More Jobs</div>
                  <h2>Ready to apply?</h2>
                  <p>
                    Browse verified roles across Data Analyst, Healthcare Analyst,
                    Program Analyst, Medicaid, business intelligence, public sector,
                    nonprofit, and remote-friendly career tracks.
                  </p>
                </div>

                <div className="report-cta-actions">
                  <Link href="/careers/jobs" className="report-primary-btn">
                    Browse all verified jobs
                  </Link>
                  <Link href="/careers/insights" className="report-secondary-btn light">
                    More insights
                  </Link>
                </div>
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
          background:
            radial-gradient(circle at 15% 0%, rgba(239, 159, 39, 0.22), transparent 34%),
            radial-gradient(circle at 80% 10%, rgba(133, 183, 235, 0.18), transparent 32%),
            linear-gradient(180deg, #042C53 0%, #021c38 100%);
          color: #ffffff;
          padding: 58px 0 34px;
          border-bottom: 3px solid #BA7517;
        }

        .report-hero-grid {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 34px;
          align-items: center;
        }

        .report-eyebrow,
        .report-kicker {
          color: #BA7517;
          font-size: 12px;
          line-height: 1.2;
          font-weight: 900;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .report-eyebrow {
          color: #EF9F27;
          margin-bottom: 12px;
        }

        .report-title {
          margin: 0;
          color: #ffffff;
          font-size: 46px;
          line-height: 1.06;
          letter-spacing: -0.045em;
          font-weight: 900;
          max-width: 860px;
        }

        .report-subtitle {
          margin: 18px 0 0;
          color: #dbeafe;
          font-size: 17px;
          line-height: 1.75;
          max-width: 780px;
        }

        .report-actions,
        .report-cta-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 26px;
        }

        .report-primary-btn,
        .report-secondary-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 46px;
          padding: 12px 20px;
          border-radius: 999px;
          font-size: 14px;
          font-weight: 900;
          text-decoration: none !important;
          transition: transform 120ms, background 140ms, border-color 140ms;
        }

        .report-primary-btn {
          background: #EF9F27;
          color: #061a2f !important;
          border: 1px solid #BA7517;
          box-shadow: 0 14px 30px rgba(239, 159, 39, 0.22);
        }

        .report-primary-btn:hover {
          background: #f6b34c;
          transform: translateY(-1px);
        }

        .report-secondary-btn {
          color: #ffffff !important;
          border: 1px solid rgba(219, 234, 254, 0.45);
          background: rgba(255,255,255,0.07);
        }

        .report-secondary-btn:hover {
          background: rgba(255,255,255,0.12);
          border-color: rgba(255,255,255,0.72);
          transform: translateY(-1px);
        }

        .report-secondary-btn.light {
          color: #ffffff !important;
          border-color: rgba(255,255,255,0.35);
        }

        .report-hero-card {
          border-radius: 22px;
          border: 1px solid rgba(255,255,255,0.14);
          background: rgba(255,255,255,0.07);
          padding: 24px;
          box-shadow: 0 24px 58px rgba(2, 14, 32, 0.28);
          backdrop-filter: blur(12px);
        }

        .report-card-label {
          display: inline-flex;
          border-radius: 999px;
          background: rgba(34, 197, 94, 0.14);
          border: 1px solid rgba(34, 197, 94, 0.24);
          color: #bbf7d0;
          padding: 7px 11px;
          font-size: 12px;
          font-weight: 900;
          margin-bottom: 14px;
        }

        .report-hero-card h2 {
          margin: 0;
          color: #ffffff;
          font-size: 24px;
          line-height: 1.18;
          letter-spacing: -0.03em;
        }

        .report-hero-card p {
          margin: 12px 0 0;
          color: #cbd5e1;
          font-size: 14px;
          line-height: 1.7;
        }

        .report-mini-list {
          display: grid;
          gap: 9px;
          margin-top: 18px;
        }

        .report-mini-list span {
          border-radius: 12px;
          background: rgba(2, 28, 56, 0.75);
          border: 1px solid rgba(255,255,255,0.09);
          color: #dbeafe;
          padding: 10px 12px;
          font-size: 13px;
          font-weight: 700;
        }

        .report-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin-top: 32px;
        }

        .report-stat {
          border-radius: 18px;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.07);
          padding: 18px;
        }

        .report-stat strong {
          display: block;
          color: #ffffff;
          font-size: 30px;
          line-height: 1;
          letter-spacing: -0.04em;
        }

        .report-stat span {
          display: block;
          color: #bfdbfe;
          font-size: 12px;
          line-height: 1.45;
          margin-top: 8px;
          font-weight: 700;
        }

        .report-section {
          padding: 58px 0;
          background: #ffffff;
        }

        .report-section-soft {
          background: #f8fafc;
          border-top: 1px solid #e2e8f0;
          border-bottom: 1px solid #e2e8f0;
        }

        .report-section-head {
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          gap: 26px;
          align-items: end;
          margin-bottom: 26px;
        }

        .report-section-head h2,
        .report-panel h2,
        .report-cta h2,
        .tips-title {
          margin: 8px 0 0;
          color: #042C53;
          font-size: 31px;
          line-height: 1.13;
          letter-spacing: -0.035em;
          font-weight: 900;
        }

        .report-section-head p,
        .report-panel p,
        .tips-lead {
          margin: 0;
          color: #475569;
          font-size: 15px;
          line-height: 1.75;
        }

        .trend-grid,
        .featured-job-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .trend-card,
        .featured-job-card,
        .report-panel {
          border-radius: 18px;
          border: 1px solid #e2e8f0;
          background: #ffffff;
          padding: 22px;
          box-shadow: 0 10px 28px rgba(15, 23, 42, 0.04);
        }

        .trend-card {
          background: linear-gradient(180deg, #ffffff 0%, #fffaf0 100%);
          border-color: rgba(186, 117, 23, 0.18);
        }

        .trend-card h3,
        .featured-job-card h3 {
          margin: 0;
          color: #042C53;
          font-size: 18px;
          line-height: 1.25;
          letter-spacing: -0.02em;
          font-weight: 900;
        }

        .trend-card p,
        .featured-job-card p {
          margin: 10px 0 0;
          color: #475569;
          font-size: 14px;
          line-height: 1.65;
        }

        .featured-job-card {
          text-decoration: none !important;
          color: inherit;
          transition: transform 120ms, border-color 140ms, box-shadow 140ms;
        }

        .featured-job-card:hover {
          transform: translateY(-2px);
          border-color: #BA7517;
          box-shadow: 0 18px 36px rgba(4, 44, 83, 0.09);
          color: inherit;
        }

        .featured-job-badge {
          display: inline-flex;
          border-radius: 999px;
          background: #fff7e6;
          border: 1px solid #f1deb3;
          color: #9a5f10;
          padding: 6px 10px;
          font-size: 11px;
          font-weight: 900;
          margin-bottom: 14px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .featured-job-card span {
          display: inline-flex;
          margin-top: 16px;
          color: #BA7517;
          font-size: 14px;
          font-weight: 900;
        }

        .two-column {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
          align-items: stretch;
        }

        .dark-panel {
          background:
            radial-gradient(circle at top left, rgba(239, 159, 39, 0.18), transparent 34%),
            linear-gradient(180deg, #042C53 0%, #021c38 100%);
          color: #ffffff;
          border-color: rgba(186, 117, 23, 0.35);
        }

        .dark-panel h2,
        .dark-panel p {
          color: #ffffff;
        }

        .dark-panel p {
          color: #dbeafe;
        }

        .gold {
          color: #EF9F27;
        }

        .company-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
          margin-top: 20px;
        }

        .company-tags span {
          border-radius: 999px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          color: #e0f2fe;
          padding: 8px 11px;
          font-size: 12px;
          font-weight: 800;
        }

        .panel-link-light {
          display: inline-flex;
          color: #fde68a !important;
          font-size: 14px;
          font-weight: 900;
          text-decoration: none !important;
          margin-top: 22px;
        }

        .salary-list {
          display: grid;
          gap: 12px;
          margin-top: 18px;
        }

        .salary-row {
          border-radius: 14px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          padding: 16px;
        }

        .salary-top {
          display: flex;
          justify-content: space-between;
          gap: 14px;
          align-items: center;
        }

        .salary-top strong {
          color: #042C53;
          font-size: 15px;
        }

        .salary-top span {
          border-radius: 999px;
          background: #dcfce7;
          color: #166534;
          padding: 6px 10px;
          font-size: 12px;
          font-weight: 900;
          white-space: nowrap;
        }

        .salary-row p {
          margin: 9px 0 0;
          color: #475569;
          font-size: 13px;
          line-height: 1.6;
        }

        .tips-grid {
          align-items: start;
        }

        .tips-list {
          display: grid;
          gap: 12px;
        }

        .tip-item {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 12px;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          background: #ffffff;
          padding: 16px;
        }

        .tip-item span {
          width: 24px;
          height: 24px;
          border-radius: 999px;
          background: #fff7e6;
          color: #BA7517;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 900;
        }

        .tip-item p {
          margin: 0;
          color: #334155;
          font-size: 14px;
          line-height: 1.65;
        }

        .report-cta-section {
          background: #021c38;
          color: #ffffff;
          padding: 54px 0;
          border-top: 3px solid #BA7517;
        }

        .report-cta {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 24px;
          align-items: center;
          border-radius: 24px;
          border: 1px solid rgba(255,255,255,0.12);
          background:
            radial-gradient(circle at top left, rgba(239, 159, 39, 0.16), transparent 36%),
            rgba(255,255,255,0.05);
          padding: 28px;
        }

        .report-cta h2 {
          color: #ffffff;
        }

        .report-cta p {
          margin: 10px 0 0;
          color: #dbeafe;
          font-size: 15px;
          line-height: 1.7;
          max-width: 720px;
        }

        @media (max-width: 960px) {
          .report-hero-grid,
          .report-section-head,
          .two-column,
          .report-cta {
            grid-template-columns: 1fr;
          }

          .report-title {
            font-size: 36px;
          }

          .report-stats,
          .trend-grid,
          .featured-job-grid {
            grid-template-columns: 1fr 1fr;
          }

          .report-cta-actions {
            margin-top: 0;
          }
        }

        @media (max-width: 620px) {
          .report-hero {
            padding: 44px 0 28px;
          }

          .report-title {
            font-size: 30px;
          }

          .report-subtitle {
            font-size: 15px;
          }

          .report-stats,
          .trend-grid,
          .featured-job-grid {
            grid-template-columns: 1fr;
          }

          .report-section {
            padding: 42px 0;
          }

          .report-section-head h2,
          .report-panel h2,
          .report-cta h2,
          .tips-title {
            font-size: 25px;
          }

          .salary-top {
            align-items: flex-start;
            flex-direction: column;
          }
        }
      `}</style>
    </>
  );
}