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
};

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: CATEGORY_SLUGS.map((slug) => ({ params: { slug } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps<Props, { slug: string }> = async (ctx) => {
  const slug = ctx.params?.slug ?? "";
  const config = getCategoryConfig(slug);
  if (!config) return { notFound: true };

  const jobs = await listJobsForCategory(slug);

  return {
    props: { config, jobs },
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

export default function CategoryPage({ config, jobs }: Props) {
  const url = `${SITE_URL}/careers/category/${config.slug}`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "MedicaidReady", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Careers", item: `${SITE_URL}/careers` },
      {
        "@type": "ListItem",
        position: 3,
        name: "All jobs",
        item: `${SITE_URL}/careers/jobs`,
      },
      { "@type": "ListItem", position: 4, name: config.heading, item: url },
    ],
  };

  const faqJsonLd =
    config.faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: config.faq.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }
      : null;

  return (
    <>
      <Head>
        <title>{config.metaTitle}</title>
        <meta name="description" content={config.metaDescription} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={config.metaTitle} />
        <meta property="og:description" content={config.metaDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <meta property="og:site_name" content="MedicaidReady" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={config.metaTitle} />
        <meta name="twitter:description" content={config.metaDescription} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
        {faqJsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
          />
        )}
      </Head>

      <CareersShell>
        <section className="careers-section">
          <div className="careers-container">
            <div className="careers-eyebrow">{config.eyebrow}</div>
            <h1 className="careers-h1">{config.heading}</h1>
            <p className="careers-lead">{config.intro}</p>
            <div className="careers-actions">
              <Link href="/careers/jobs" className="careers-btn-primary">
                Browse all jobs
              </Link>
              <Link href="/careers/post-a-job" className="careers-btn-ghost">
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
            <h2 className="careers-h2">
              {jobs.length > 0
                ? `${jobs.length} ${jobs.length === 1 ? "open role" : "open roles"} in this category`
                : "No matching roles right now"}
            </h2>

            {jobs.length === 0 ? (
              <div className="cat-empty">
                <p className="cat-empty-text">{config.emptyStateCopy}</p>
                <Link href="/careers/jobs" className="careers-btn-primary">
                  See all current jobs
                </Link>
              </div>
            ) : (
              <div className="careers-job-list cat-list">
                {jobs.map((job) => (
                  <Link
                    key={job.id}
                    href={`/careers/jobs/${job.id}`}
                    className="careers-job-card"
                  >
                    <h3 className="careers-job-title">{job.title}</h3>
                    <p className="careers-job-company">
                      {job.company}
                      {job.location ? ` · ${job.location}` : ""}
                    </p>
                    <div className="careers-job-meta">
                      <span className="careers-pill careers-pill-blue">{job.type}</span>
                      <span className="careers-pill">{job.remote}</span>
                      {job.salary && (
                        <span className="careers-pill careers-pill-green">{job.salary}</span>
                      )}
                    </div>
                    {job.summary && (
                      <p className="careers-job-summary">{job.summary}</p>
                    )}
                    <div className="careers-job-posted">
                      {formatPostedAt(job.postedAt)}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="careers-section">
          <div className="careers-container">
            <div className="careers-eyebrow">About this category</div>
            <h2 className="careers-h2">
              What to expect from {config.heading.toLowerCase()}
            </h2>
            <div className="cat-about">
              {config.about.map((p, i) => (
                <p key={i} className="cat-about-para">
                  {p}
                </p>
              ))}
            </div>
          </div>
        </section>

        {config.faq.length > 0 && (
          <section
            className="careers-section-tight"
            style={{
              background: "#ffffff",
              borderTop: "1px solid #e2e8f0",
              borderBottom: "1px solid #e2e8f0",
            }}
          >
            <div className="careers-container">
              <div className="careers-eyebrow">FAQ</div>
              <h2 className="careers-h2">Common questions</h2>
              <div className="cat-faq">
                {config.faq.map((item, i) => (
                  <div key={i} className="cat-faq-item">
                    <div className="cat-faq-q">{item.q}</div>
                    <div className="cat-faq-a">{item.a}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {config.related.length > 0 && (
          <section className="careers-section">
            <div className="careers-container">
              <div className="careers-eyebrow">Related categories</div>
              <h2 className="careers-h2">Explore more job categories</h2>
              <div className="cat-related">
                {config.related.map((relSlug) => {
                  const rel = getCategoryConfig(relSlug);
                  if (!rel) return null;
                  return (
                    <Link
                      key={relSlug}
                      href={`/careers/category/${relSlug}`}
                      className="cat-related-card"
                    >
                      <h3 className="cat-related-title">{rel.heading}</h3>
                      <p className="cat-related-body">{rel.intro}</p>
                      <span className="cat-related-link">View jobs →</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}
      </CareersShell>

      <style jsx>{`
        .cat-empty {
          background: #f8fafc;
          border: 1px dashed #cbd5e1;
          border-radius: 14px;
          padding: 32px 28px;
          margin-top: 24px;
        }
        .cat-empty-text {
          font-size: 15px;
          color: #475569;
          line-height: 1.7;
          margin: 0 0 16px;
          max-width: 640px;
        }
        .cat-list {
          margin-top: 24px;
        }
        .cat-about {
          max-width: 820px;
          margin-top: 20px;
        }
        .cat-about-para {
          font-size: 16px;
          line-height: 1.75;
          color: #334155;
          margin: 0 0 16px;
        }
        .cat-about-para:last-child {
          margin-bottom: 0;
        }
        .cat-faq {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-top: 24px;
        }
        .cat-faq-item {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 22px 24px;
        }
        .cat-faq-q {
          font-size: 15px;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 8px;
          letter-spacing: -0.01em;
        }
        .cat-faq-a {
          font-size: 14px;
          color: #475569;
          line-height: 1.7;
          margin: 0;
        }
        .cat-related {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-top: 24px;
        }
        .cat-related-card {
          display: block;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 22px 24px;
          text-decoration: none;
          color: inherit;
          transition: border-color 140ms, transform 100ms, box-shadow 140ms;
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06);
        }
        .cat-related-card:hover {
          border-color: #93c5fd;
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(15, 23, 42, 0.07);
          color: inherit;
        }
        .cat-related-title {
          font-size: 16px;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 8px;
          letter-spacing: -0.01em;
        }
        .cat-related-body {
          font-size: 14px;
          color: #475569;
          line-height: 1.65;
          margin: 0 0 12px;
        }
        .cat-related-link {
          font-size: 13px;
          font-weight: 600;
          color: #1565c0;
        }
        @media (max-width: 880px) {
          .cat-faq {
            grid-template-columns: 1fr;
          }
          .cat-related {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
