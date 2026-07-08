import Head from "next/head";
import Link from "next/link";
import type { GetStaticPaths, GetStaticProps } from "next";
import CareersShell from "../../../components/careers/CareersShell";
import {
  CATEGORY_SLUGS,
  getCategoryConfig,
  listJobsForCategory,
  type CategoryConfig,
} from "../../../lib/careers/categories";
import type { CareersJob } from "../../../lib/careers/sampleJobs";

const SITE_URL = "https://www.medicaidready.org";

type Props = {
  config: CategoryConfig;
  jobs: CareersJob[];
  slug: string;
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: CATEGORY_SLUGS.map((slug) => ({
      params: { slug },
    })),
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const slug = typeof params?.slug === "string" ? params.slug : "";
  const config = getCategoryConfig(slug);

  if (!config) {
    return {
      notFound: true,
      revalidate: 60,
    };
  }

  const jobs = await listJobsForCategory(slug);

  return {
    props: {
      config,
      jobs,
      slug,
    },
    revalidate: 60,
  };
};

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

function jobSearchHref(query: string): string {
  return `/careers/jobs?query=${encodeURIComponent(query)}`;
}

function jobDetailHref(job: CareersJob): string {
  return `/careers/jobs/${job.id}`;
}

function companyInitials(company: string): string {
  const parts = company.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return "MR";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

  return ((parts[0][0] || "") + (parts[parts.length - 1][0] || "")).toUpperCase();
}

export default function CareersCategoryPage({ config, jobs, slug }: Props) {
  const canonicalUrl = `${SITE_URL}/careers/category/${slug}`;
  const visibleJobs = jobs.slice(0, 60);
  const featuredJobs = jobs.slice(0, 3);
  const popularSearches =
    config.popularSearches.length > 0 ? config.popularSearches : config.aliases;
  const marketSignals =
    config.marketSignals.length > 0
      ? config.marketSignals
      : [
          "Reviewed application links",
          "Cleaned duplicate listings",
          "Category-based job discovery",
        ];
  const relatedCategories = config.relatedCategories.slice(0, 6);

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: config.title,
    description: config.metaDescription,
    url: canonicalUrl,
    numberOfItems: visibleJobs.length,
    itemListElement: visibleJobs.slice(0, 20).map((job, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${SITE_URL}${jobDetailHref(job)}`,
      name: job.title,
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "MedicaidReady Careers",
        item: `${SITE_URL}/careers`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Jobs",
        item: `${SITE_URL}/careers/jobs`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: config.title,
        item: canonicalUrl,
      },
    ],
  };

  return (
    <>
      <Head>
        <title>{config.metaTitle}</title>
        <meta name="description" content={config.metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={config.metaTitle} />
        <meta property="og:description" content={config.metaDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="MedicaidReady Careers" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
      </Head>

      <CareersShell>
        <main className="cc-page">
          <section className="cc-hero">
            <div className="cc-hero-bg" />
            <div className="careers-container cc-hero-inner">
              <div className="cc-breadcrumbs">
                <Link href="/careers">Careers</Link>
                <span>/</span>
                <Link href="/careers/jobs">Jobs</Link>
                <span>/</span>
                <span>{config.label}</span>
              </div>

              <div className="cc-hero-grid">
                <div>
                  <p className="cc-eyebrow">{config.eyebrow}</p>
                  <h1>{config.heroTitle}</h1>
                  <p className="cc-hero-copy">{config.heroDescription}</p>

                  <div className="cc-hero-actions">
                    <Link href={jobSearchHref(config.searchQuery)} className="cc-primary">
                      Browse {config.label} Jobs
                    </Link>
                    <Link href="/careers/insights" className="cc-secondary">
                      View Career Insights
                    </Link>
                  </div>
                </div>

                <aside className="cc-hero-card">
                  <div className="cc-card-label">Category Snapshot</div>
                  <div className="cc-stat-large">{jobs.length}</div>
                  <p>verified active role{jobs.length === 1 ? "" : "s"} in this category</p>

                  <div className="cc-snapshot-list">
                    <div>
                      <span>Verification</span>
                      <strong>Reviewed links</strong>
                    </div>
                    <div>
                      <span>Focus</span>
                      <strong>{config.label}</strong>
                    </div>
                    <div>
                      <span>Updated</span>
                      <strong>Refresh cycle</strong>
                    </div>
                  </div>
                </aside>
              </div>
            </div>
          </section>

          <section className="careers-section">
            <div className="careers-container">
              <div className="cc-layout">
                <div className="cc-main">
                  <div className="cc-section-head">
                    <div>
                      <p className="cc-eyebrow cc-eyebrow-dark">Open Roles</p>
                      <h2>{config.title}</h2>
                      <p>
                        Browse verified listings matched to this role category using the
                        MedicaidReady Careers category engine.
                      </p>
                    </div>
                    <Link href="/careers/jobs" className="cc-text-link">
                      All jobs →
                    </Link>
                  </div>

                  {visibleJobs.length === 0 ? (
                    <div className="cc-empty">
                      <h3>No active jobs in this category yet.</h3>
                      <p>
                        This category is part of the MedicaidReady Careers taxonomy.
                        New verified listings will appear here after future imports and audits.
                      </p>
                      <Link href="/careers/jobs" className="cc-primary cc-primary-inline">
                        Browse All Jobs
                      </Link>
                    </div>
                  ) : (
                    <div className="cc-job-list">
                      {visibleJobs.map((job) => {
                        const applyUrl = getJobApplyUrl(job);

                        return (
                          <article className="cc-job-card" key={job.id}>
                            <div className="cc-job-avatar" aria-hidden="true">
                              {companyInitials(job.company)}
                            </div>

                            <div className="cc-job-body">
                              <div className="cc-job-top">
                                <div>
                                  <h3>
                                    <Link href={jobDetailHref(job)}>{job.title}</Link>
                                  </h3>
                                  <p className="cc-job-company">
                                    {job.company} · {job.location}
                                  </p>
                                </div>

                                {job.featured && <span className="cc-featured">Featured</span>}
                              </div>

                              <div className="cc-pills">
                                <span>{job.type}</span>
                                <span>{job.remote}</span>
                                {job.salary && <span>{job.salary}</span>}
                              </div>

                              {job.summary && <p className="cc-job-summary">{job.summary}</p>}

                              <div className="cc-job-foot">
                                <span>{formatPostedAt(job.postedAt)}</span>
                                <div className="cc-job-actions">
                                  <Link href={jobDetailHref(job)} className="cc-outline">
                                    Details
                                  </Link>
                                  {applyUrl ? (
                                    <a
                                      href={applyUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="cc-apply"
                                    >
                                      Apply
                                    </a>
                                  ) : (
                                    <Link href={jobDetailHref(job)} className="cc-apply">
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
                </div>

                <aside className="cc-sidebar">
                  <div className="cc-side-card">
                    <p className="cc-eyebrow cc-eyebrow-dark">Popular Searches</p>
                    <div className="cc-chip-list">
                      {popularSearches.slice(0, 8).map((search) => (
                        <Link href={jobSearchHref(search)} key={search}>
                          {search}
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="cc-side-card cc-side-navy">
                    <p className="cc-eyebrow">Market Signals</p>
                    <ul>
                      {marketSignals.map((signal) => (
                        <li key={signal}>{signal}</li>
                      ))}
                    </ul>
                  </div>

                  {featuredJobs.length > 0 && (
                    <div className="cc-side-card">
                      <p className="cc-eyebrow cc-eyebrow-dark">Featured Matches</p>
                      <div className="cc-mini-list">
                        {featuredJobs.map((job) => (
                          <Link href={jobDetailHref(job)} key={job.id}>
                            <strong>{job.title}</strong>
                            <span>{job.company}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {relatedCategories.length > 0 && (
                    <div className="cc-side-card">
                      <p className="cc-eyebrow cc-eyebrow-dark">Related Categories</p>
                      <div className="cc-chip-list">
                        {relatedCategories.map((category) => (
                          <Link href={jobSearchHref(category)} key={category}>
                            {category}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </aside>
              </div>
            </div>
          </section>
        </main>
      </CareersShell>

      <style jsx>{`
        .cc-page {
          background: #f8fafc;
          color: #0f172a;
        }

        .cc-hero {
          position: relative;
          overflow: hidden;
          background: #061b3a;
          color: #ffffff;
        }

        .cc-hero-bg {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at top right, rgba(245, 185, 66, 0.25), transparent 34%),
            radial-gradient(circle at left, rgba(56, 129, 255, 0.18), transparent 38%);
        }

        .cc-hero-inner {
          position: relative;
          padding-top: 46px;
          padding-bottom: 58px;
        }

        .cc-breadcrumbs {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          align-items: center;
          margin-bottom: 34px;
          font-size: 13px;
          font-weight: 800;
          color: rgba(255, 255, 255, 0.68);
        }

        .cc-breadcrumbs a {
          color: rgba(255, 255, 255, 0.82);
          text-decoration: none;
        }

        .cc-hero-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.1fr) 360px;
          gap: 36px;
          align-items: center;
        }

        .cc-eyebrow {
          margin: 0;
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #f5b942;
        }

        .cc-eyebrow-dark {
          color: #0c447c;
        }

        .cc-hero h1 {
          max-width: 850px;
          margin: 12px 0 0;
          font-size: clamp(40px, 6vw, 68px);
          line-height: 0.95;
          letter-spacing: -0.055em;
          font-weight: 950;
        }

        .cc-hero-copy {
          max-width: 720px;
          margin: 22px 0 0;
          color: rgba(255, 255, 255, 0.74);
          font-size: 18px;
          line-height: 1.75;
        }

        .cc-hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 28px;
        }

        .cc-primary,
        .cc-secondary,
        .cc-outline,
        .cc-apply {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          font-size: 14px;
          font-weight: 950;
          text-decoration: none;
        }

        .cc-primary {
          background: #f5b942;
          color: #061b3a;
          padding: 13px 21px;
        }

        .cc-secondary {
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #ffffff;
          padding: 13px 21px;
        }

        .cc-hero-card,
        .cc-empty,
        .cc-side-card {
          border: 1px solid #dbe5f0;
          border-radius: 24px;
          background: #ffffff;
          padding: 20px;
          box-shadow: 0 12px 34px rgba(4, 44, 83, 0.06);
        }

        .cc-hero-card {
          border-color: rgba(255, 255, 255, 0.12);
          border-radius: 30px;
          background: rgba(255, 255, 255, 0.1);
          color: #ffffff;
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.25);
        }

        .cc-card-label {
          color: #f5b942;
          font-size: 12px;
          font-weight: 950;
          text-transform: uppercase;
          letter-spacing: 0.18em;
        }

        .cc-stat-large {
          margin-top: 16px;
          font-size: 58px;
          line-height: 1;
          font-weight: 950;
        }

        .cc-hero-card p {
          color: rgba(255, 255, 255, 0.72);
        }

        .cc-snapshot-list {
          display: grid;
          gap: 10px;
          margin-top: 22px;
        }

        .cc-snapshot-list div {
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.08);
          padding: 14px;
        }

        .cc-snapshot-list span {
          display: block;
          color: rgba(255, 255, 255, 0.58);
          font-size: 12px;
          font-weight: 800;
        }

        .cc-snapshot-list strong {
          display: block;
          margin-top: 4px;
          color: #ffffff;
          font-size: 14px;
        }

        .cc-layout {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 330px;
          gap: 26px;
          align-items: start;
        }

        .cc-section-head {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          align-items: flex-end;
          margin-bottom: 20px;
        }

        .cc-section-head h2 {
          margin: 8px 0 0;
          color: #061b3a;
          font-size: 32px;
          line-height: 1.05;
          font-weight: 950;
        }

        .cc-section-head p {
          max-width: 660px;
          margin: 10px 0 0;
          color: #64748b;
          line-height: 1.7;
        }

        .cc-text-link {
          color: #ba7517;
          font-size: 14px;
          font-weight: 950;
          text-decoration: none;
          white-space: nowrap;
        }

        .cc-job-list {
          display: grid;
          gap: 14px;
        }

        .cc-job-card {
          display: grid;
          grid-template-columns: 54px minmax(0, 1fr);
          gap: 16px;
          border: 1px solid #dbe5f0;
          border-radius: 24px;
          background: #ffffff;
          padding: 20px;
          box-shadow: 0 12px 34px rgba(4, 44, 83, 0.06);
        }

        .cc-job-avatar {
          width: 54px;
          height: 54px;
          border-radius: 16px;
          background: linear-gradient(135deg, #061b3a, #0c447c);
          color: #f5b942;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 950;
        }

        .cc-job-top {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          align-items: flex-start;
        }

        .cc-job-top h3 {
          margin: 0;
          color: #061b3a;
          font-size: 18px;
          line-height: 1.25;
          font-weight: 950;
        }

        .cc-job-top h3 a {
          color: inherit;
          text-decoration: none;
        }

        .cc-job-company {
          margin: 6px 0 0;
          color: #64748b;
          font-size: 13px;
          font-weight: 700;
        }

        .cc-featured {
          border-radius: 999px;
          background: #fff7e6;
          color: #ba7517;
          border: 1px solid #f1deb3;
          padding: 5px 10px;
          font-size: 11px;
          font-weight: 950;
          text-transform: uppercase;
        }

        .cc-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 13px;
        }

        .cc-pills span {
          border-radius: 999px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          color: #334155;
          padding: 6px 10px;
          font-size: 12px;
          font-weight: 850;
        }

        .cc-job-summary {
          margin: 14px 0 0;
          color: #475569;
          line-height: 1.7;
          font-size: 14px;
        }

        .cc-job-foot {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-top: 16px;
          color: #64748b;
          font-size: 13px;
          font-weight: 750;
        }

        .cc-job-actions {
          display: inline-flex;
          gap: 8px;
          align-items: center;
        }

        .cc-outline {
          border: 1px solid #cbd5e1;
          color: #334155;
          background: #ffffff;
          padding: 9px 14px;
        }

        .cc-apply {
          background: #061b3a;
          color: #ffffff;
          padding: 10px 16px;
        }

        .cc-empty h3 {
          margin: 0;
          color: #061b3a;
          font-size: 24px;
          font-weight: 950;
        }

        .cc-empty p {
          color: #64748b;
          line-height: 1.7;
        }

        .cc-sidebar {
          display: grid;
          gap: 16px;
          position: sticky;
          top: 24px;
        }

        .cc-side-navy {
          background: #061b3a;
          color: #ffffff;
        }

        .cc-side-navy ul {
          display: grid;
          gap: 10px;
          margin: 16px 0 0;
          padding: 0;
          list-style: none;
        }

        .cc-side-navy li {
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.08);
          padding: 12px;
          color: rgba(255, 255, 255, 0.78);
          font-size: 13px;
          font-weight: 800;
        }

        .cc-chip-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 14px;
        }

        .cc-chip-list a {
          display: inline-flex;
          border-radius: 999px;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          color: #334155;
          padding: 8px 11px;
          text-decoration: none;
          font-size: 12px;
          font-weight: 850;
        }

        .cc-mini-list {
          display: grid;
          gap: 10px;
          margin-top: 14px;
        }

        .cc-mini-list a {
          display: block;
          border-radius: 18px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          padding: 13px;
          text-decoration: none;
        }

        .cc-mini-list strong {
          display: block;
          color: #061b3a;
          font-size: 13px;
        }

        .cc-mini-list span {
          display: block;
          margin-top: 4px;
          color: #64748b;
          font-size: 12px;
          font-weight: 750;
        }

        @media (max-width: 980px) {
          .cc-hero-grid,
          .cc-layout {
            grid-template-columns: 1fr;
          }

          .cc-sidebar {
            position: static;
          }
        }

        @media (max-width: 680px) {
          .cc-job-card {
            grid-template-columns: 1fr;
          }

          .cc-job-top,
          .cc-job-foot,
          .cc-section-head {
            align-items: flex-start;
            flex-direction: column;
          }
        }
      `}</style>
    </>
  );
}
