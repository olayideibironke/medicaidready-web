import Head from "next/head";
import Link from "next/link";
import type { GetStaticPaths, GetStaticProps } from "next";
import CareersShell from "../../../components/careers/CareersShell";
import { getApprovedJobBySlug, listApprovedJobSlugs } from "../../../lib/careers/db";
import type { CareersJob } from "../../../lib/careers/sampleJobs";

const SITE_URL = "https://www.medicaidready.org";

type Props = { job: CareersJob };

type JobWithApplyUrl = CareersJob & {
  applyUrl?: string | null;
  apply_url?: string | null;
};

type JobWithSource = CareersJob & {
  sourceType?: string | null;
  source_type?: string | null;
};

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = await listApprovedJobSlugs();

  return {
    paths: slugs.map((slug) => ({ params: { id: slug } })),
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<Props, { id: string }> = async (ctx) => {
  const id = ctx.params?.id ?? "";
  const job = await getApprovedJobBySlug(id);

  if (!job) {
    return { notFound: true, revalidate: 60 };
  }

  return { props: { job }, revalidate: 60 };
};

function getApplyUrl(job: CareersJob): string | null {
  const jobWithUrl = job as JobWithApplyUrl;
  const value = jobWithUrl.applyUrl ?? jobWithUrl.apply_url ?? null;

  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  return trimmed;
}

function getSourceType(job: CareersJob): string | null {
  const j = job as JobWithSource;
  const value = j.sourceType ?? j.source_type ?? null;
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed || null;
}

function handleMissingApplyUrl() {
  if (typeof window !== "undefined") {
    window.alert("Application link is not available yet for this listing.");
  }
}

const EMPLOYMENT_TYPE_MAP: Record<string, string> = {
  "Full-time": "FULL_TIME",
  "Part-time": "PART_TIME",
  Contract: "CONTRACTOR",
  Internship: "INTERN",
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function safeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

function buildJobPostingJsonLd(
  job: CareersJob,
  canonicalUrl: string,
  applyUrl: string | null
): Record<string, unknown> {
  const isRemote = job.remote === "Remote";

  const descriptionParts: string[] = [];
  const trimmedDescription = (job.description ?? "").trim();
  const trimmedSummary = (job.summary ?? "").trim();

  if (trimmedDescription) {
    descriptionParts.push(`<p>${escapeHtml(trimmedDescription)}</p>`);
  } else if (trimmedSummary) {
    descriptionParts.push(`<p>${escapeHtml(trimmedSummary)}</p>`);
  }

  if (job.responsibilities.length > 0) {
    descriptionParts.push(
      `<h4>Responsibilities</h4><ul>${job.responsibilities
        .map((r) => `<li>${escapeHtml(r)}</li>`)
        .join("")}</ul>`
    );
  }
  if (job.requirements.length > 0) {
    descriptionParts.push(
      `<h4>Requirements</h4><ul>${job.requirements
        .map((r) => `<li>${escapeHtml(r)}</li>`)
        .join("")}</ul>`
    );
  }
  if (job.benefits.length > 0) {
    descriptionParts.push(
      `<h4>Benefits</h4><ul>${job.benefits
        .map((b) => `<li>${escapeHtml(b)}</li>`)
        .join("")}</ul>`
    );
  }

  const description =
    descriptionParts.join("") ||
    `<p>${escapeHtml(`${job.title} at ${job.company}.`)}</p>`;

  const datePosted = (() => {
    const d = new Date(job.postedAt);
    return Number.isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
  })();

  const ld: Record<string, unknown> = {
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    title: job.title,
    description,
    datePosted,
    employmentType: EMPLOYMENT_TYPE_MAP[job.type] ?? "FULL_TIME",
    hiringOrganization: {
      "@type": "Organization",
      name: job.company,
    },
    identifier: {
      "@type": "PropertyValue",
      name: job.company,
      value: job.id,
    },
    url: canonicalUrl,
    directApply: Boolean(applyUrl),
  };

  if (isRemote) {
    ld.jobLocationType = "TELECOMMUTE";
    ld.applicantLocationRequirements = {
      "@type": "Country",
      name: "USA",
    };
  } else if (job.location && job.location.trim()) {
    const parts = job.location
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);
    const addressLocality = parts[0] ?? job.location;
    const addressRegion = parts[1] ?? "";
    const address: Record<string, string> = {
      "@type": "PostalAddress",
      addressLocality,
      addressCountry: "US",
    };
    if (addressRegion) address.addressRegion = addressRegion;
    ld.jobLocation = {
      "@type": "Place",
      address,
    };
  }

  return ld;
}

function buildBreadcrumbJsonLd(
  job: CareersJob,
  canonicalUrl: string
): Record<string, unknown> {
  return {
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
      {
        "@type": "ListItem",
        position: 4,
        name: job.title,
        item: canonicalUrl,
      },
    ],
  };
}

function buildMetaDescription(job: CareersJob): string {
  const candidate = (
    (job.summary && job.summary.trim()) ||
    (job.description && job.description.trim()) ||
    `${job.title} at ${job.company}.`
  ).replace(/\s+/g, " ");

  if (candidate.length <= 200) return candidate;
  return candidate.slice(0, 197).trimEnd() + "…";
}

export default function JobDetail({ job }: Props) {
  const applyUrl = getApplyUrl(job);
  const sourceType = getSourceType(job);
  const isApproved = sourceType !== null;

  const canonicalUrl = `${SITE_URL}/careers/jobs/${job.id}`;
  const pageTitle = `${job.title} — ${job.company} | MedicaidReady Careers`;
  const metaDescription = buildMetaDescription(job);

  const jobPostingLd = isApproved
    ? buildJobPostingJsonLd(job, canonicalUrl, applyUrl)
    : null;
  const breadcrumbLd = isApproved ? buildBreadcrumbJsonLd(job, canonicalUrl) : null;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={metaDescription} />

        {!isApproved && <meta name="robots" content="noindex" />}

        {isApproved && (
          <>
            <link rel="canonical" href={canonicalUrl} />
            <meta property="og:title" content={pageTitle} />
            <meta property="og:description" content={metaDescription} />
            <meta property="og:type" content="article" />
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:site_name" content="MedicaidReady" />
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:title" content={pageTitle} />
            <meta name="twitter:description" content={metaDescription} />
          </>
        )}

        {jobPostingLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: safeJsonLd(jobPostingLd) }}
          />
        )}
        {breadcrumbLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbLd) }}
          />
        )}
      </Head>

      <CareersShell>
        <section className="careers-section">
          <div className="careers-container" style={{ maxWidth: 820 }}>
            <div className="careers-detail-header">
              <Link href="/careers/jobs" className="careers-detail-back">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path
                    d="M9 2L4 7l5 5"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Back to all jobs
              </Link>

              <h1 className="careers-detail-title">{job.title}</h1>

              <p className="careers-detail-company">
                {job.company} &middot; {job.location}
              </p>

              <div className="careers-job-meta">
                <span className="careers-pill careers-pill-blue">{job.type}</span>
                <span className="careers-pill">{job.remote}</span>
                {job.salary && (
                  <span className="careers-pill careers-pill-green">{job.salary}</span>
                )}
              </div>

              <div className="careers-actions" style={{ marginTop: 20 }}>
                {applyUrl ? (
                  <a
                    href={applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="careers-btn-primary"
                  >
                    Apply for this role
                  </a>
                ) : (
                  <button
                    type="button"
                    className="careers-btn-primary"
                    onClick={handleMissingApplyUrl}
                  >
                    Apply for this role
                  </button>
                )}

                <Link href="/careers/jobs" className="careers-btn-ghost">
                  View other openings
                </Link>
              </div>

              <p className="job-disclosure">
                Curated listing. Apply through the employer&apos;s official site.
              </p>
            </div>

            {job.description && (
              <div className="careers-detail-section">
                <h3>About the role</h3>
                <p>{job.description}</p>
              </div>
            )}

            {job.responsibilities.length > 0 && (
              <div className="careers-detail-section">
                <h3>What you&apos;ll do</h3>
                <ul>
                  {job.responsibilities.map((responsibility) => (
                    <li key={responsibility}>{responsibility}</li>
                  ))}
                </ul>
              </div>
            )}

            {job.requirements.length > 0 && (
              <div className="careers-detail-section">
                <h3>Requirements</h3>
                <ul>
                  {job.requirements.map((requirement) => (
                    <li key={requirement}>{requirement}</li>
                  ))}
                </ul>
              </div>
            )}

            {job.benefits.length > 0 && (
              <div className="careers-detail-section">
                <h3>Benefits</h3>
                <ul>
                  {job.benefits.map((benefit) => (
                    <li key={benefit}>{benefit}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      </CareersShell>

      <style jsx>{`
        .job-disclosure {
          margin: 14px 0 0;
          font-size: 12px;
          color: #64748b;
          line-height: 1.5;
        }
      `}</style>
    </>
  );
}
