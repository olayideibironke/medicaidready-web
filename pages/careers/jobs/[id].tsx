import Head from "next/head";
import Link from "next/link";
import type { GetStaticPaths, GetStaticProps } from "next";
import CareersShell from "../../../components/careers/CareersShell";
import SaveJobButton from "../../../components/careers/SaveJobButton";
import {
  getApprovedJobBySlug,
  listApprovedJobSlugs,
  listApprovedJobs,
} from "../../../lib/careers/db";
import type { CareersJob, CareersJobMode } from "../../../lib/careers/sampleJobs";

const SITE_URL = "https://www.medicaidready.org";

type SimilarJob = {
  id: string;
  title: string;
  company: string;
  location: string;
  remote: string;
  type: string;
  salary: string;
};

type Props = {
  job: CareersJob;
  similar: SimilarJob[];
};

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

function pickSimilar(job: CareersJob, all: CareersJob[]): SimilarJob[] {
  const tokens = `${job.title} ${job.summary}`
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 3);

  function score(other: CareersJob): number {
    if (other.id === job.id) return -1;

    let s = 0;
    const hay = `${other.title} ${other.summary}`.toLowerCase();

    for (const t of tokens) {
      if (hay.includes(t)) s += 1;
    }

    if (other.company === job.company) s += 2;
    if (other.remote === job.remote) s += 1;
    if (other.type === job.type) s += 1;

    return s;
  }

  return all
    .map((j) => ({ j, s: score(j) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, 4)
    .map(({ j }) => ({
      id: j.id,
      title: j.title,
      company: j.company,
      location: j.location,
      remote: j.remote,
      type: j.type,
      salary: j.salary,
    }));
}

export const getStaticProps: GetStaticProps<Props, { id: string }> = async (ctx) => {
  const id = ctx.params?.id ?? "";
  const job = await getApprovedJobBySlug(id);

  if (!job) {
    return { notFound: true, revalidate: 60 };
  }

  let similar: SimilarJob[] = [];

  try {
    const all = await listApprovedJobs();
    similar = pickSimilar(job, all);
  } catch {
    similar = [];
  }

  return { props: { job, similar }, revalidate: 60 };
};

function getApplyUrl(job: CareersJob): string | null {
  const jobWithUrl = job as JobWithApplyUrl;
  const value = jobWithUrl.applyUrl ?? jobWithUrl.apply_url ?? null;

  if (typeof value !== "string") return null;

  const trimmed = value.trim();

  if (!trimmed) return null;

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

function companyInitials(company: string): string {
  const parts = company.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return "MR";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function avatarPalette(company: string): { bg: string; fg: string } {
  const PALETTE = [
    { bg: "#eef3f9", fg: "#042C53" },
    { bg: "#fff7e6", fg: "#BA7517" },
    { bg: "#ecfeff", fg: "#0e7490" },
    { bg: "#f0fdf4", fg: "#15803d" },
    { bg: "#faf5ff", fg: "#7c3aed" },
    { bg: "#fff1f2", fg: "#be123c" },
  ];

  let hash = 0;

  for (let i = 0; i < company.length; i++) {
    hash = (hash * 31 + company.charCodeAt(i)) >>> 0;
  }

  return PALETTE[hash % PALETTE.length];
}

function modeBadgeClass(mode: CareersJobMode | string): string {
  if (mode === "Remote") return "careers-pill-teal";
  if (mode === "Hybrid") return "careers-pill-navy";

  return "careers-pill";
}

function typeBadgeClass(type: string): string {
  if (type === "Contract") return "careers-pill-purple";
  if (type === "Full-time") return "careers-pill-green";

  return "careers-pill-blue";
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
    descriptionParts.join("") || `<p>${escapeHtml(`${job.title} at ${job.company}.`)}</p>`;

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

  return `${candidate.slice(0, 197).trimEnd()}...`;
}

export default function JobDetail({ job, similar }: Props) {
  const applyUrl = getApplyUrl(job);
  const sourceType = getSourceType(job);
  const isApproved = sourceType !== null;

  const canonicalUrl = `${SITE_URL}/careers/jobs/${job.id}`;
  const pageTitle = `${job.title} | ${job.company} | MedicaidReady Careers`;
  const metaDescription = buildMetaDescription(job);

  const jobPostingLd = isApproved ? buildJobPostingJsonLd(job, canonicalUrl, applyUrl) : null;
  const breadcrumbLd = isApproved ? buildBreadcrumbJsonLd(job, canonicalUrl) : null;

  const av = avatarPalette(job.company);

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
            <meta property="og:site_name" content="MedicaidReady Careers" />
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
          <div className="careers-container">
            <Link href="/careers/jobs" className="careers-detail-back jd-back">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path
                  d="M9 2L4 7l5 5"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Back to results
            </Link>

            <div className="jd-layout">
              <div className="jd-main">
                <div className="jd-header">
                  <div className="jd-header-top">
                    <div
                      className="jd-avatar"
                      style={{ background: av.bg, color: av.fg }}
                      aria-hidden="true"
                    >
                      {companyInitials(job.company)}
                    </div>

                    <div className="jd-header-text">
                      <h1 className="jd-title">{job.title}</h1>
                      <div className="jd-company-row">
                        <span className="jd-company">{job.company}</span>
                        <span
                          className="jd-verified"
                          title="Verified employer"
                          aria-label="Verified employer"
                        >
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                            <path
                              d="M7 0.7l1.6 1L10.5 1.5l.4 1.9 1.6 1.1-.7 1.8.7 1.8-1.6 1.1-.4 1.9-1.9-.2L7 13.3l-1.6-1L3.5 12.5l-.4-1.9L1.5 9.5l.7-1.8-.7-1.8 1.6-1.1L3.5 2.9l1.9.2L7 0.7z"
                              fill="#0e7490"
                            />
                            <path
                              d="M4.5 7l1.7 1.7L9.5 5.3"
                              stroke="white"
                              strokeWidth="1.6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                        <span className="jd-sep" aria-hidden="true">
                          ·
                        </span>
                        <span>{job.location || "Location not specified"}</span>
                      </div>

                      {job.featured && (
                        <span className="jd-featured-tag">
                          <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                            <path
                              d="M6 1l1.5 3.2L11 4.7l-2.5 2.4.6 3.4L6 8.9 2.9 10.5l.6-3.4L1 4.7l3.5-.5L6 1z"
                              fill="currentColor"
                            />
                          </svg>
                          Featured
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="careers-job-meta jd-meta">
                    <span className={`careers-pill ${typeBadgeClass(job.type)}`}>{job.type}</span>
                    <span className={`careers-pill ${modeBadgeClass(job.remote)}`}>
                      {job.remote}
                    </span>
                    {job.salary && (
                      <span className="careers-pill careers-pill-gold">{job.salary}</span>
                    )}
                  </div>

                  <div className="jd-actions">
                    {applyUrl ? (
                      <a
                        href={applyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="careers-btn-primary jd-apply"
                      >
                        Apply on company site
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                          <path
                            d="M5 9l5-5M5 4h5v5"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </a>
                    ) : (
                      <button
                        type="button"
                        className="careers-btn-primary jd-apply"
                        onClick={handleMissingApplyUrl}
                      >
                        Apply for this role
                      </button>
                    )}

                    <SaveJobButton jobId={job.id} variant="full" />

                    <Link href="/careers/saved-jobs" className="jd-saved-link">
                      Saved Jobs
                    </Link>
                  </div>

                  <p className="jd-disclosure">
                    Curated listing. Apply through the employer&apos;s official site.
                  </p>
                </div>

                <div className="jd-applyready-banner">
                  <div>
                    <span className="jd-applyready-eyebrow">ApplyReady</span>
                    <h2>Prepare your resume and application plan before applying.</h2>
                    <p>
                      Save this role, review it later, and use ApplyReady to organize your
                      resume, job list, and next steps before going to the employer&apos;s
                      official application page.
                    </p>
                  </div>

                  <div className="jd-applyready-actions">
                    <Link href="/careers/applyready" className="jd-applyready-primary">
                      Prepare with ApplyReady
                    </Link>
                    <Link href="/careers/saved-jobs" className="jd-applyready-secondary">
                      View saved jobs
                    </Link>
                  </div>
                </div>

                {job.description && (
                  <div className="careers-detail-section">
                    <h3>About the role</h3>
                    <p>{job.description}</p>
                  </div>
                )}

                {job.responsibilities.length > 0 && (
                  <div className="careers-detail-section">
                    <h3>Responsibilities</h3>
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

                <div className="careers-detail-section jd-bottom-apply">
                  <h3>Ready to apply?</h3>
                  <p style={{ marginBottom: 16 }}>
                    Applications go directly to <strong>{job.company}</strong>. MedicaidReady
                    Careers curates and routes listings, we do not collect your application
                    data for employer-linked jobs.
                  </p>
                  <div className="careers-actions" style={{ marginTop: 0 }}>
                    {applyUrl ? (
                      <a
                        href={applyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="careers-btn-primary"
                      >
                        Apply on company site
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                          <path
                            d="M5 9l5-5M5 4h5v5"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
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
                    <Link href="/careers/applyready" className="careers-btn-ghost">
                      Prepare with ApplyReady
                    </Link>
                    <Link href="/careers/jobs" className="careers-btn-ghost">
                      View other openings
                    </Link>
                  </div>
                </div>
              </div>

              <aside className="jd-rail" aria-label="Job details">
                <div className="jd-card jd-card-save">
                  <div className="jd-card-title">ApplyReady tools</div>
                  <p>
                    Save this job, keep it in your ApplyReady list, and prepare before
                    applying through the employer&apos;s official site.
                  </p>
                  <SaveJobButton jobId={job.id} variant="full" />
                  <Link href="/careers/saved-jobs" className="jd-rail-secondary">
                    View saved jobs
                  </Link>
                </div>

                <div className="jd-card">
                  <div className="jd-card-title">Job details</div>
                  <dl className="jd-dl">
                    <div className="jd-dl-row">
                      <dt>Posted</dt>
                      <dd>{formatPostedAt(job.postedAt) || "—"}</dd>
                    </div>
                    <div className="jd-dl-row">
                      <dt>Work setting</dt>
                      <dd>{job.remote}</dd>
                    </div>
                    <div className="jd-dl-row">
                      <dt>Employment type</dt>
                      <dd>{job.type}</dd>
                    </div>
                    {job.location && (
                      <div className="jd-dl-row">
                        <dt>Location</dt>
                        <dd>{job.location}</dd>
                      </div>
                    )}
                    {job.salary && (
                      <div className="jd-dl-row">
                        <dt>Salary</dt>
                        <dd>{job.salary}</dd>
                      </div>
                    )}
                    <div className="jd-dl-row">
                      <dt>Employer</dt>
                      <dd>
                        {job.company}
                        <span className="jd-dl-badge">Verified</span>
                      </dd>
                    </div>
                  </dl>

                  {applyUrl ? (
                    <a
                      href={applyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="careers-btn-primary jd-rail-apply"
                    >
                      Apply on company site
                    </a>
                  ) : (
                    <button
                      type="button"
                      className="careers-btn-primary jd-rail-apply"
                      onClick={handleMissingApplyUrl}
                    >
                      Apply for this role
                    </button>
                  )}
                </div>

                <div className="jd-card jd-resources">
                  <div className="jd-card-title">Useful resources</div>
                  <Link href="/careers/applyready" className="jd-res-link">
                    Prepare with ApplyReady →
                  </Link>
                  <Link href="/careers/saved-jobs" className="jd-res-link">
                    View saved jobs →
                  </Link>
                  <Link href="/careers/resources" className="jd-res-link">
                    Career resources →
                  </Link>
                  <Link href="/careers/companies" className="jd-res-link">
                    Browse hiring employers →
                  </Link>
                </div>
              </aside>
            </div>

            {similar.length > 0 && (
              <div className="jd-similar">
                <h2 className="careers-h2" style={{ fontSize: 22 }}>
                  Similar openings
                </h2>
                <div className="jd-similar-grid">
                  {similar.map((s) => {
                    const sav = avatarPalette(s.company);

                    return (
                      <Link
                        key={s.id}
                        href={`/careers/jobs/${s.id}`}
                        className="jd-similar-card"
                      >
                        <div
                          className="jd-similar-avatar"
                          style={{ background: sav.bg, color: sav.fg }}
                          aria-hidden="true"
                        >
                          {companyInitials(s.company)}
                        </div>
                        <div className="jd-similar-body">
                          <div className="jd-similar-title">{s.title}</div>
                          <div className="jd-similar-meta">
                            {s.company}
                            {s.location ? ` · ${s.location}` : ""}
                          </div>
                          <div className="jd-similar-pills">
                            <span className={`careers-pill ${typeBadgeClass(s.type)}`}>
                              {s.type}
                            </span>
                            <span className={`careers-pill ${modeBadgeClass(s.remote)}`}>
                              {s.remote}
                            </span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </section>
      </CareersShell>

      <style jsx>{`
        .jd-back {
          margin-bottom: 14px;
        }

        .jd-layout {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 320px;
          gap: 28px;
          align-items: start;
        }

        .jd-main {
          min-width: 0;
        }

        .jd-header {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 26px 28px;
          margin-bottom: 16px;
        }

        .jd-header-top {
          display: flex;
          gap: 16px;
          align-items: flex-start;
          margin-bottom: 16px;
        }

        .jd-avatar {
          width: 56px;
          height: 56px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 19px;
          font-weight: 700;
          letter-spacing: -0.02em;
          flex-shrink: 0;
          border: 1px solid rgba(15, 23, 42, 0.06);
        }

        .jd-header-text {
          min-width: 0;
          flex: 1;
        }

        .jd-title {
          font-size: 26px;
          font-weight: 700;
          color: #042C53;
          letter-spacing: -0.03em;
          margin: 0 0 6px;
          line-height: 1.2;
        }

        .jd-company-row {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #475569;
          flex-wrap: wrap;
        }

        .jd-company {
          font-weight: 600;
          color: #334155;
        }

        .jd-verified {
          display: inline-flex;
          align-items: center;
        }

        .jd-sep {
          color: #cbd5e1;
        }

        .jd-featured-tag {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 3px 9px;
          border-radius: 999px;
          background: #BA7517;
          color: #ffffff;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          margin-top: 6px;
        }

        .jd-meta {
          margin-bottom: 18px;
        }

        .jd-actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          align-items: center;
        }

        .jd-apply {
          flex: 0 1 auto;
        }

        .jd-saved-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 46px;
          padding: 10px 18px;
          border-radius: 999px;
          background: #ffffff;
          color: #042c53;
          border: 1px solid #cfdced;
          font-size: 14px;
          font-weight: 900;
          text-decoration: none;
          transition:
            transform 140ms ease,
            border-color 140ms ease,
            background 140ms ease,
            color 140ms ease;
        }

        .jd-saved-link:hover {
          transform: translateY(-1px);
          border-color: #BA7517;
          background: #fff7e6;
          color: #BA7517;
        }

        .jd-disclosure {
          margin: 14px 0 0;
          font-size: 12px;
          color: #94a3b8;
          line-height: 1.5;
        }

        .jd-applyready-banner {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 20px;
          align-items: center;
          border: 1px solid #dbe5f0;
          border-radius: 18px;
          background:
            radial-gradient(circle at top right, rgba(239, 159, 39, 0.16), transparent 32%),
            linear-gradient(135deg, #041f3d 0%, #07335f 58%, #0c447c 100%);
          color: #ffffff;
          padding: 24px;
          margin-bottom: 16px;
          box-shadow: 0 16px 40px rgba(4, 44, 83, 0.14);
        }

        .jd-applyready-eyebrow {
          display: block;
          color: #f5b942;
          font-size: 11px;
          font-weight: 950;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .jd-applyready-banner h2 {
          margin: 0;
          color: #ffffff;
          font-size: 23px;
          line-height: 1.12;
          font-weight: 950;
          letter-spacing: -0.035em;
        }

        .jd-applyready-banner p {
          max-width: 720px;
          margin: 10px 0 0;
          color: rgba(255, 255, 255, 0.76);
          line-height: 1.65;
          font-size: 14px;
        }

        .jd-applyready-actions {
          display: grid;
          gap: 8px;
          min-width: 210px;
        }

        .jd-applyready-primary,
        .jd-applyready-secondary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          padding: 11px 16px;
          font-size: 13px;
          font-weight: 950;
          text-decoration: none;
          white-space: nowrap;
        }

        .jd-applyready-primary {
          background: #f5b942;
          color: #061b3a;
        }

        .jd-applyready-primary:hover {
          background: #ffd978;
        }

        .jd-applyready-secondary {
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #ffffff;
        }

        .jd-applyready-secondary:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .jd-rail {
          position: sticky;
          top: 140px;
        }

        .jd-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 18px 20px;
          margin-bottom: 14px;
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
        }

        .jd-card-save {
          border-top: 4px solid #BA7517;
          background:
            radial-gradient(circle at top right, rgba(239, 159, 39, 0.13), transparent 34%),
            #ffffff;
        }

        .jd-card-save p {
          margin: 0 0 14px;
          color: #64748b;
          font-size: 13px;
          line-height: 1.65;
        }

        .jd-card-title {
          font-size: 12px;
          font-weight: 800;
          color: #042C53;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 12px;
        }

        .jd-rail-secondary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          min-height: 42px;
          margin-top: 10px;
          border-radius: 999px;
          background: #ffffff;
          color: #042c53;
          border: 1px solid #cfdced;
          font-size: 13px;
          font-weight: 900;
          text-decoration: none;
        }

        .jd-rail-secondary:hover {
          border-color: #BA7517;
          background: #fff7e6;
          color: #BA7517;
        }

        .jd-dl {
          margin: 0;
        }

        .jd-dl-row {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          padding: 8px 0;
          border-bottom: 1px solid #f1f5f9;
          font-size: 13px;
        }

        .jd-dl-row:last-child {
          border-bottom: 0;
        }

        .jd-dl-row dt {
          color: #64748b;
          font-weight: 500;
        }

        .jd-dl-row dd {
          color: #042C53;
          font-weight: 600;
          margin: 0;
          text-align: right;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
          justify-content: flex-end;
        }

        .jd-dl-badge {
          display: inline-flex;
          align-items: center;
          padding: 2px 8px;
          border-radius: 999px;
          background: #ecfeff;
          color: #0e7490;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          border: 1px solid #a5f3fc;
        }

        .jd-rail-apply {
          width: 100%;
          margin-top: 14px;
        }

        .jd-resources :global(.jd-res-link),
        .jd-resources .jd-res-link {
          display: block;
          padding: 8px 0;
          font-size: 13px;
          font-weight: 600;
          color: #042C53;
          text-decoration: none;
          border-bottom: 1px solid #f1f5f9;
        }

        .jd-resources .jd-res-link:last-child {
          border-bottom: 0;
        }

        .jd-resources .jd-res-link:hover {
          color: #BA7517;
        }

        .jd-bottom-apply {
          background: linear-gradient(180deg, #ffffff 0%, #fffbf2 100%);
          border: 1px solid #f1deb3;
        }

        .jd-similar {
          margin-top: 28px;
        }

        .jd-similar-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-top: 14px;
        }

        .jd-similar-card {
          display: flex;
          gap: 14px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 16px 18px;
          text-decoration: none;
          color: inherit;
          transition: border-color 140ms, transform 100ms, box-shadow 140ms;
        }

        .jd-similar-card:hover {
          border-color: #BA7517;
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(4, 44, 83, 0.08);
          color: inherit;
        }

        .jd-similar-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 700;
          flex-shrink: 0;
          border: 1px solid rgba(15, 23, 42, 0.06);
        }

        .jd-similar-body {
          min-width: 0;
          flex: 1;
        }

        .jd-similar-title {
          font-size: 14px;
          font-weight: 700;
          color: #042C53;
          margin: 0 0 3px;
          letter-spacing: -0.01em;
        }

        .jd-similar-meta {
          font-size: 12px;
          color: #64748b;
          margin: 0 0 8px;
        }

        .jd-similar-pills {
          display: flex;
          gap: 4px;
          flex-wrap: wrap;
        }

        @media (max-width: 960px) {
          .jd-layout {
            grid-template-columns: 1fr;
          }

          .jd-rail {
            position: static;
          }

          .jd-similar-grid {
            grid-template-columns: 1fr;
          }

          .jd-applyready-banner {
            grid-template-columns: 1fr;
          }

          .jd-applyready-actions {
            min-width: 0;
            display: flex;
            flex-wrap: wrap;
          }
        }

        @media (max-width: 600px) {
          .jd-header {
            padding: 20px 18px;
          }

          .jd-title {
            font-size: 22px;
          }

          .jd-actions {
            flex-direction: column;
            align-items: stretch;
          }

          .jd-apply,
          .jd-actions :global(.save-job-btn-full),
          .jd-saved-link {
            justify-content: center;
            width: 100%;
          }

          .jd-applyready-primary,
          .jd-applyready-secondary {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
}