import Head from "next/head";
import Link from "next/link";
import type { GetStaticProps } from "next";
import { useEffect, useMemo, useState } from "react";
import CareersShell from "../../components/careers/CareersShell";
import CategoryGrid from "../../components/careers/CategoryGrid";
import JobAlertCapture from "../../components/careers/JobAlertCapture";
import { listApprovedJobs } from "../../lib/careers/db";
import type { CareersJob, CareersJobMode } from "../../lib/careers/sampleJobs";

const SITE_URL = "https://www.medicaidready.org";
const SAVED_KEY = "mr_saved_jobs_v1";

type ModeFilter = "any" | CareersJobMode;
type Props = { jobs: CareersJob[] };

export const getStaticProps: GetStaticProps<Props> = async () => {
  const jobs = await listApprovedJobs();
  return {
    props: { jobs },
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

function modeBadgeClass(mode: CareersJobMode): string {
  if (mode === "Remote") return "careers-pill-teal";
  if (mode === "Hybrid") return "careers-pill-navy";
  return "careers-pill";
}

function typeBadgeClass(type: string): string {
  if (type === "Contract") return "careers-pill-purple";
  if (type === "Full-time") return "careers-pill-green";
  return "careers-pill-blue";
}

function isRecent(iso: string, days = 21): boolean {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return false;
  return Date.now() - then < days * 86_400_000;
}

export default function CareersJobs({ jobs }: Props) {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<ModeFilter>("any");
  const [saved, setSaved] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(SAVED_KEY);
      if (raw) setSaved(JSON.parse(raw) as Record<string, boolean>);
    } catch {
      /* ignore */
    }
  }, []);

  function toggleSaved(id: string) {
    setSaved((prev) => {
      const next = { ...prev };
      if (next[id]) delete next[id];
      else next[id] = true;
      try {
        window.localStorage.setItem(SAVED_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }

  const filtered = useMemo<CareersJob[]>(() => {
    const q = query.trim().toLowerCase();
    return jobs.filter((j) => {
      if (mode !== "any" && j.remote !== mode) return false;
      if (!q) return true;
      const haystack = `${j.title} ${j.company} ${j.location} ${j.summary}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [query, mode, jobs]);

  const hiringCompanies = useMemo<string[]>(() => {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const j of jobs) {
      const c = j.company.trim();
      if (!c || seen.has(c)) continue;
      seen.add(c);
      out.push(c);
      if (out.length >= 8) break;
    }
    return out;
  }, [jobs]);

  const url = `${SITE_URL}/careers/jobs`;
  const metaTitle = "Find Medicaid Jobs — Curated Roles in Medicaid, Medicare, and ACA | MedicaidReady Careers";
  const metaDescription =
    "Browse curated Medicaid jobs in eligibility, compliance, care management, and analytics. Updated weekly. Apply directly through the employer's official site.";

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
        <section className="careers-section">
          <div className="careers-container">
            <div className="careers-eyebrow">Find jobs</div>
            <h1 className="careers-h1">Open roles in the Medicaid space</h1>
            <p className="careers-lead">
              {jobs.length} {jobs.length === 1 ? "role" : "roles"} currently listed.
              Curated weekly. Apply through each employer&apos;s official site.
            </p>

            {hiringCompanies.length > 0 && (
              <div className="hiring-strip" aria-label="Hiring now">
                <span className="hiring-strip-label">
                  <span className="hiring-strip-dot" aria-hidden="true" />
                  Hiring now
                </span>
                <div className="hiring-strip-list">
                  {hiringCompanies.map((c) => (
                    <span className="hiring-strip-item" key={c}>
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="careers-jobs-toolbar" style={{ marginTop: 28, marginBottom: 24 }}>
              <input
                type="search"
                className="careers-search"
                placeholder="Search by title, company, or city"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search jobs"
              />
              <select
                className="careers-select"
                value={mode}
                onChange={(e) => setMode(e.target.value as ModeFilter)}
                aria-label="Filter by remote, hybrid, or on-site"
              >
                <option value="any">Any location</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
              </select>
            </div>

            {filtered.length === 0 ? (
              <div className="careers-empty">
                No jobs match your filters yet. Try clearing them or check back soon.
              </div>
            ) : (
              <div className="careers-job-list">
                {filtered.map((job) => {
                  const av = avatarPalette(job.company);
                  const isFeatured = Boolean(job.featured);
                  const isHot = isRecent(job.postedAt, 7);
                  const isSaved = Boolean(saved[job.id]);
                  const benefitTags = (job.benefits ?? []).slice(0, 3);

                  return (
                    <div
                      key={job.id}
                      className={`careers-job-card jc${isFeatured ? " jc-featured" : ""}`}
                    >
                      <Link href={`/careers/jobs/${job.id}`} className="jc-link" aria-label={`View ${job.title}`}>
                        <span className="jc-link-cover" />
                      </Link>

                      {isFeatured && (
                        <span className="jc-featured-badge">
                          <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                            <path d="M6 1l1.5 3.2L11 4.7l-2.5 2.4.6 3.4L6 8.9 2.9 10.5l.6-3.4L1 4.7l3.5-.5L6 1z" fill="currentColor"/>
                          </svg>
                          Featured
                        </span>
                      )}

                      <div className="jc-row">
                        <div
                          className="jc-avatar"
                          style={{ background: av.bg, color: av.fg }}
                          aria-hidden="true"
                        >
                          {companyInitials(job.company)}
                        </div>

                        <div className="jc-main">
                          <h2 className="careers-job-title jc-title">{job.title}</h2>
                          <div className="jc-company-row">
                            <span className="jc-company">{job.company}</span>
                            <span className="jc-verified" title="Verified employer" aria-label="Verified employer">
                              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                                <path d="M7 0.7l1.6 1L10.5 1.5l.4 1.9 1.6 1.1-.7 1.8.7 1.8-1.6 1.1-.4 1.9-1.9-.2L7 13.3l-1.6-1L3.5 12.5l-.4-1.9L1.5 9.5l.7-1.8-.7-1.8 1.6-1.1L3.5 2.9l1.9.2L7 0.7z" fill="#0e7490"/>
                                <path d="M4.5 7l1.7 1.7L9.5 5.3" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </span>
                            {isHot && (
                              <span className="jc-hiring-dot" title="Actively hiring" aria-label="Actively hiring">
                                <span className="jc-hiring-dot-inner" />
                              </span>
                            )}
                            <span className="jc-loc-sep" aria-hidden="true">·</span>
                            <span className="jc-loc">{job.location}</span>
                          </div>

                          <div className="careers-job-meta jc-meta">
                            <span className={`careers-pill ${typeBadgeClass(job.type)}`}>{job.type}</span>
                            <span className={`careers-pill ${modeBadgeClass(job.remote)}`}>{job.remote}</span>
                            {job.salary && (
                              <span className="careers-pill careers-pill-gold">{job.salary}</span>
                            )}
                          </div>

                          <p className="careers-job-summary jc-summary">{job.summary}</p>

                          {benefitTags.length > 0 && (
                            <div className="jc-benefits" aria-label="Benefits">
                              {benefitTags.map((b) => (
                                <span className="jc-benefit" key={b}>
                                  {b}
                                </span>
                              ))}
                            </div>
                          )}

                          <div className="jc-footer">
                            <span className="careers-job-posted jc-posted">{formatPostedAt(job.postedAt)}</span>

                            <div className="jc-actions">
                              <button
                                type="button"
                                className={`jc-save${isSaved ? " jc-save-active" : ""}`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  toggleSaved(job.id);
                                }}
                                aria-pressed={isSaved}
                                aria-label={isSaved ? "Remove from saved" : "Save this job"}
                              >
                                <svg width="14" height="14" viewBox="0 0 14 14" fill={isSaved ? "currentColor" : "none"} aria-hidden="true">
                                  <path d="M3 1.5h8v11l-4-2.5-4 2.5v-11z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                                </svg>
                                {isSaved ? "Saved" : "Save"}
                              </button>
                              <Link
                                href={`/careers/jobs/${job.id}`}
                                className="jc-apply"
                              >
                                Apply
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                                  <path d="M3 6h6M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <CategoryGrid />

            <div style={{ marginTop: 32 }}>
              <JobAlertCapture source="careers_jobs_page" />
            </div>
          </div>
        </section>
      </CareersShell>

      <style jsx>{`
        .hiring-strip {
          margin-top: 24px;
          padding: 14px 16px;
          background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
          border: 1px solid #e2e8f0;
          border-left: 4px solid #BA7517;
          border-radius: 12px;
          display: flex;
          gap: 14px;
          align-items: center;
          flex-wrap: wrap;
        }
        .hiring-strip-label {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #042C53;
          flex-shrink: 0;
        }
        .hiring-strip-dot {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #16a34a;
          box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.18);
          animation: pulseDot 1.8s ease-in-out infinite;
        }
        @keyframes pulseDot {
          0%, 100% { box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.18); }
          50% { box-shadow: 0 0 0 6px rgba(22, 163, 74, 0.06); }
        }
        .hiring-strip-list {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .hiring-strip-item {
          padding: 4px 10px;
          border-radius: 999px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          color: #334155;
          font-size: 12px;
          font-weight: 600;
        }

        .jc {
          position: relative;
          padding: 22px 24px;
        }
        .jc-featured {
          border: 2px solid #BA7517 !important;
          background: linear-gradient(180deg, #ffffff 0%, #fffbf2 100%) !important;
          box-shadow: 0 4px 18px rgba(186, 117, 23, 0.10);
        }
        .jc-featured-badge {
          position: absolute;
          top: 12px;
          right: 16px;
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
          z-index: 2;
        }
        .jc-link {
          position: absolute;
          inset: 0;
          z-index: 1;
        }
        .jc-link-cover {
          display: block;
          width: 100%;
          height: 100%;
        }
        .jc-row {
          position: relative;
          display: flex;
          gap: 16px;
          z-index: 2;
          pointer-events: none;
        }
        .jc-row > * {
          pointer-events: auto;
        }
        .jc-link {
          pointer-events: auto;
        }
        .jc-avatar {
          width: 52px;
          height: 52px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          font-weight: 700;
          letter-spacing: -0.02em;
          flex-shrink: 0;
          border: 1px solid rgba(15, 23, 42, 0.06);
        }
        .jc-main {
          flex: 1;
          min-width: 0;
        }
        .jc-title {
          font-size: 17px;
          font-weight: 700;
          color: #042C53 !important;
          margin: 0 0 4px;
          letter-spacing: -0.02em;
        }
        .jc-company-row {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: #475569;
          margin: 0 0 12px;
          flex-wrap: wrap;
        }
        .jc-company {
          font-weight: 600;
          color: #334155;
        }
        .jc-verified {
          display: inline-flex;
          align-items: center;
          line-height: 1;
        }
        .jc-hiring-dot {
          position: relative;
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: rgba(22, 163, 74, 0.18);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-left: 2px;
        }
        .jc-hiring-dot-inner {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #16a34a;
        }
        .jc-loc-sep { color: #cbd5e1; }
        .jc-loc { color: #64748b; }
        .jc-meta {
          margin-bottom: 10px;
        }
        .jc-summary {
          font-size: 14px;
          color: #475569;
          line-height: 1.65;
          margin: 0 0 12px;
        }
        .jc-benefits {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin: 0 0 14px;
        }
        .jc-benefit {
          display: inline-flex;
          align-items: center;
          padding: 3px 9px;
          border-radius: 6px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          color: #475569;
          font-size: 12px;
          font-weight: 500;
        }
        .jc-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }
        .jc-posted {
          margin-top: 0;
        }
        .jc-actions {
          display: inline-flex;
          gap: 8px;
          align-items: center;
        }
        .jc-save {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 12px;
          border-radius: 8px;
          background: #ffffff;
          color: #475569;
          border: 1px solid #cbd5e1;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          transition: border-color 120ms, color 120ms, background 120ms;
        }
        .jc-save:hover {
          border-color: #BA7517;
          color: #BA7517;
          background: #fff7e6;
        }
        .jc-save-active {
          color: #BA7517;
          border-color: #BA7517;
          background: #fff7e6;
        }
        .jc-apply {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: 8px;
          background: #042C53;
          color: #ffffff !important;
          font-size: 13px;
          font-weight: 700;
          border: 1px solid #021c38;
          text-decoration: none !important;
          box-shadow: inset 0 -2px 0 0 #BA7517;
          transition: background 120ms;
        }
        .jc-apply:hover {
          background: #0C447C;
          color: #ffffff !important;
        }

        @media (max-width: 600px) {
          .jc { padding: 18px 16px; }
          .jc-avatar { width: 44px; height: 44px; font-size: 16px; }
          .jc-row { gap: 12px; }
          .jc-footer { align-items: flex-start; }
        }
      `}</style>
    </>
  );
}
