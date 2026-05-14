import Head from "next/head";
import Link from "next/link";
import type { GetStaticProps } from "next";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import CareersShell from "../../components/careers/CareersShell";
import CategoryGrid from "../../components/careers/CategoryGrid";
import JobAlertCapture from "../../components/careers/JobAlertCapture";
import { listApprovedJobs } from "../../lib/careers/db";
import type {
  CareersJob,
  CareersJobMode,
  CareersJobType,
} from "../../lib/careers/sampleJobs";

const SITE_URL = "https://www.medicaidready.org";
const SAVED_KEY = "mr_saved_jobs_v1";

type Props = { jobs: CareersJob[] };
type DateRange = "any" | "1d" | "7d" | "30d";

type CategoryDef = {
  key: string;
  label: string;
  keywords: string[];
};

const CATEGORY_DEFS: CategoryDef[] = [
  {
    key: "medicaid",
    label: "Medicaid coverage & eligibility",
    keywords: [
      "medicaid",
      "eligibility",
      "enrollment",
      "navigator",
      "patient access",
      "benefits",
      "coverage",
    ],
  },
  {
    key: "care_workforce",
    label: "Care workforce (CNA, GNA, caregiver)",
    keywords: [
      "cna",
      "gna",
      "caregiver",
      "nursing assistant",
      "home health aide",
      "hha",
      "personal care",
      "direct support",
      "dsp",
      "patient care tech",
    ],
  },
  {
    key: "care_management",
    label: "Care management & coordination",
    keywords: [
      "care manager",
      "care coordinator",
      "case manager",
      "social worker",
      "care management",
      "case management",
      "ltss",
    ],
  },
  {
    key: "healthcare_it",
    label: "Healthcare IT & systems",
    keywords: [
      "healthcare it",
      "clinical systems",
      "systems analyst",
      "application analyst",
      "it analyst",
      "technical analyst",
      "information systems",
    ],
  },
  {
    key: "ehr",
    label: "EHR / Epic / Cerner",
    keywords: ["ehr", "epic", "cerner", "electronic health record"],
  },
  {
    key: "claims",
    label: "Claims systems & payer ops",
    keywords: [
      "claims",
      "qnxt",
      "facets",
      "payment integrity",
      "claims configuration",
      "configuration analyst",
      "edi",
    ],
  },
  {
    key: "provider_data",
    label: "Provider data & credentialing",
    keywords: [
      "provider data",
      "credentialing",
      "provider configuration",
      "network",
      "provider relations",
    ],
  },
  {
    key: "analytics",
    label: "Healthcare data & analytics",
    keywords: [
      "data analyst",
      "data scientist",
      "data engineer",
      "analytics",
      "reporting analyst",
      "bi analyst",
      "bi developer",
      "business intelligence",
    ],
  },
  {
    key: "compliance",
    label: "Compliance & regulatory",
    keywords: [
      "compliance",
      "regulatory",
      "auditor",
      "audit",
      "hipaa",
      "risk",
      "privacy",
    ],
  },
];

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

function daysSince(iso: string): number {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return Infinity;
  return Math.max(0, Math.floor((Date.now() - then) / 86_400_000));
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

function jobMatchesCategory(job: CareersJob, def: CategoryDef): boolean {
  const haystack = `${job.title} ${job.summary} ${job.description}`.toLowerCase();
  return def.keywords.some((kw) => haystack.includes(kw));
}

function jobMatchesLocation(job: CareersJob, loc: string): boolean {
  const l = loc.trim().toLowerCase();
  if (!l) return true;
  if (l === "remote" || l === "remote-friendly") return job.remote === "Remote";
  const target = `${job.location} ${job.remote}`.toLowerCase();
  return target.includes(l);
}

export default function CareersJobs({ jobs }: Props) {
  const router = useRouter();

  const initialQ =
    typeof router.query.q === "string" ? router.query.q : "";
  const initialLoc =
    typeof router.query.loc === "string" ? router.query.loc : "";

  const [query, setQuery] = useState(initialQ);
  const [loc, setLoc] = useState(initialLoc);
  const [postedRange, setPostedRange] = useState<DateRange>("any");
  const [modes, setModes] = useState<Set<CareersJobMode>>(new Set());
  const [types, setTypes] = useState<Set<CareersJobType>>(new Set());
  const [cats, setCats] = useState<Set<string>>(new Set());
  const [salaryOnly, setSalaryOnly] = useState(false);
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    if (!router.isReady) return;
    if (typeof router.query.q === "string" && router.query.q !== query) {
      setQuery(router.query.q);
    }
    if (typeof router.query.loc === "string" && router.query.loc !== loc) {
      setLoc(router.query.loc);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, router.query.q, router.query.loc]);

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

  function toggleSetItem<T>(set: Set<T>, item: T, setter: (s: Set<T>) => void) {
    const next = new Set(set);
    if (next.has(item)) next.delete(item);
    else next.add(item);
    setter(next);
  }

  function clearAllFilters() {
    setQuery("");
    setLoc("");
    setPostedRange("any");
    setModes(new Set());
    setTypes(new Set());
    setCats(new Set());
    setSalaryOnly(false);
    setFeaturedOnly(false);
  }

  const activeFilterCount =
    (postedRange !== "any" ? 1 : 0) +
    modes.size +
    types.size +
    cats.size +
    (salaryOnly ? 1 : 0) +
    (featuredOnly ? 1 : 0);

  const filtered = useMemo<CareersJob[]>(() => {
    const q = query.trim().toLowerCase();
    return jobs.filter((j) => {
      if (q) {
        const hay = `${j.title} ${j.company} ${j.location} ${j.summary}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (loc && !jobMatchesLocation(j, loc)) return false;
      if (modes.size > 0 && !modes.has(j.remote)) return false;
      if (types.size > 0 && !types.has(j.type)) return false;
      if (salaryOnly && !(j.salary && j.salary.trim())) return false;
      if (featuredOnly && !j.featured) return false;
      if (postedRange !== "any") {
        const limit = postedRange === "1d" ? 1 : postedRange === "7d" ? 7 : 30;
        if (daysSince(j.postedAt) > limit) return false;
      }
      if (cats.size > 0) {
        let matchAny = false;
        for (const key of cats) {
          const def = CATEGORY_DEFS.find((c) => c.key === key);
          if (def && jobMatchesCategory(j, def)) {
            matchAny = true;
            break;
          }
        }
        if (!matchAny) return false;
      }
      return true;
    });
  }, [jobs, query, loc, postedRange, modes, types, cats, salaryOnly, featuredOnly]);

  const newCount = useMemo(
    () => filtered.filter((j) => daysSince(j.postedAt) <= 7).length,
    [filtered]
  );

  const url = `${SITE_URL}/careers/jobs`;
  const metaTitle =
    "Find Medicaid Jobs — Curated Roles in Medicaid, Care Workforce, and Healthcare Tech | MedicaidReady Careers";
  const metaDescription =
    "Browse curated Medicaid, care workforce, and healthcare technology jobs. Filter by work setting, employment type, posted date, and category. Apply directly through each employer's official site.";

  const filterPanel = (
    <aside className="cj-sidebar" aria-label="Filters">
      <div className="cj-sidebar-head">
        <span className="cj-sidebar-title">Filters</span>
        {activeFilterCount > 0 && (
          <button type="button" className="cj-clear" onClick={clearAllFilters}>
            Clear all
          </button>
        )}
      </div>

      <fieldset className="cj-group">
        <legend className="cj-group-title">Posted date</legend>
        {([
          ["any", "Any time"],
          ["1d", "Past 24 hours"],
          ["7d", "Past 7 days"],
          ["30d", "Past 30 days"],
        ] as Array<[DateRange, string]>).map(([value, label]) => (
          <label key={value} className="cj-row cj-radio-row">
            <input
              type="radio"
              name="posted"
              value={value}
              checked={postedRange === value}
              onChange={() => setPostedRange(value)}
            />
            <span>{label}</span>
          </label>
        ))}
      </fieldset>

      <fieldset className="cj-group">
        <legend className="cj-group-title">Work setting</legend>
        {(["Remote", "Hybrid", "On-site"] as CareersJobMode[]).map((m) => (
          <label key={m} className="cj-row">
            <input
              type="checkbox"
              checked={modes.has(m)}
              onChange={() => toggleSetItem(modes, m, setModes)}
            />
            <span>{m}</span>
          </label>
        ))}
      </fieldset>

      <fieldset className="cj-group">
        <legend className="cj-group-title">Employment type</legend>
        {(["Full-time", "Part-time", "Contract", "Internship"] as CareersJobType[]).map(
          (t) => (
            <label key={t} className="cj-row">
              <input
                type="checkbox"
                checked={types.has(t)}
                onChange={() => toggleSetItem(types, t, setTypes)}
              />
              <span>{t}</span>
            </label>
          )
        )}
      </fieldset>

      <fieldset className="cj-group">
        <legend className="cj-group-title">Category</legend>
        {CATEGORY_DEFS.map((def) => (
          <label key={def.key} className="cj-row">
            <input
              type="checkbox"
              checked={cats.has(def.key)}
              onChange={() => toggleSetItem(cats, def.key, setCats)}
            />
            <span>{def.label}</span>
          </label>
        ))}
      </fieldset>

      <fieldset className="cj-group">
        <legend className="cj-group-title">Other</legend>
        <label className="cj-row">
          <input
            type="checkbox"
            checked={salaryOnly}
            onChange={() => setSalaryOnly((v) => !v)}
          />
          <span>Salary available</span>
        </label>
        <label className="cj-row">
          <input
            type="checkbox"
            checked={featuredOnly}
            onChange={() => setFeaturedOnly((v) => !v)}
          />
          <span>Featured only</span>
        </label>
      </fieldset>
    </aside>
  );

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
            <div className="cj-search-bar">
              <div className="cj-search-field cj-search-field-q">
                <span className="cj-search-icon" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <circle cx="8" cy="8" r="5.25" stroke="currentColor" strokeWidth="1.6"/>
                    <path d="M12 12l3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                  </svg>
                </span>
                <input
                  type="search"
                  placeholder="Job title, skill, company, or keyword"
                  aria-label="Job title, skill, company, or keyword"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <div className="cj-search-field cj-search-field-loc">
                <span className="cj-search-icon" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M9 16s5-4.5 5-9a5 5 0 10-10 0c0 4.5 5 9 5 9z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
                    <circle cx="9" cy="7" r="2" stroke="currentColor" strokeWidth="1.6"/>
                  </svg>
                </span>
                <input
                  type="search"
                  placeholder="City, state, or remote"
                  aria-label="Location"
                  value={loc}
                  onChange={(e) => setLoc(e.target.value)}
                />
              </div>
              <button
                type="button"
                className="cj-filters-btn"
                onClick={() => setMobileFiltersOpen((v) => !v)}
                aria-expanded={mobileFiltersOpen}
                aria-controls="cj-filters-mobile"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M2 4h10M3 7h8M5 10h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                </svg>
                All filters
                {activeFilterCount > 0 && (
                  <span className="cj-filters-count">{activeFilterCount}</span>
                )}
              </button>
            </div>

            <div className="cj-layout">
              {filterPanel}

              <div className="cj-results">
                <div className="cj-results-head">
                  <div className="cj-results-tabs">
                    <span className="cj-tab cj-tab-active">Recommended Jobs</span>
                  </div>
                  <div className="cj-results-meta">
                    <span className="cj-results-count">
                      <strong>{filtered.length}</strong> result{filtered.length === 1 ? "" : "s"}
                    </span>
                    {newCount > 0 && (
                      <span className="cj-results-new">
                        <span className="cj-new-dot" aria-hidden="true" />
                        {newCount} new this week
                      </span>
                    )}
                  </div>
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
                      const isHot = daysSince(job.postedAt) <= 7;
                      const isSaved = Boolean(saved[job.id]);
                      const benefitTags = (job.benefits ?? []).slice(0, 3);

                      return (
                        <div
                          key={job.id}
                          className={`careers-job-card jc${isFeatured ? " jc-featured" : ""}`}
                        >
                          <Link
                            href={`/careers/jobs/${job.id}`}
                            className="jc-link"
                            aria-label={`View ${job.title}`}
                          >
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
                                <span
                                  className="jc-verified"
                                  title="Verified employer"
                                  aria-label="Verified employer"
                                >
                                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                                    <path d="M7 0.7l1.6 1L10.5 1.5l.4 1.9 1.6 1.1-.7 1.8.7 1.8-1.6 1.1-.4 1.9-1.9-.2L7 13.3l-1.6-1L3.5 12.5l-.4-1.9L1.5 9.5l.7-1.8-.7-1.8 1.6-1.1L3.5 2.9l1.9.2L7 0.7z" fill="#0e7490"/>
                                    <path d="M4.5 7l1.7 1.7L9.5 5.3" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                </span>
                                {isHot && (
                                  <span
                                    className="jc-hiring-dot"
                                    title="Actively hiring"
                                    aria-label="Actively hiring"
                                  >
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
                                <span className="careers-job-posted jc-posted">
                                  {formatPostedAt(job.postedAt)}
                                </span>

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
                                  <Link href={`/careers/jobs/${job.id}`} className="jc-apply">
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
            </div>
          </div>
        </section>

        {mobileFiltersOpen && (
          <div
            className="cj-mobile-overlay"
            onClick={() => setMobileFiltersOpen(false)}
            aria-hidden="true"
          />
        )}
        <div
          id="cj-filters-mobile"
          className={`cj-mobile-panel${mobileFiltersOpen ? " is-open" : ""}`}
          role="dialog"
          aria-label="Filters"
          aria-hidden={!mobileFiltersOpen}
        >
          <div className="cj-mobile-head">
            <div className="cj-mobile-title">Filters</div>
            <button
              type="button"
              className="cj-mobile-close"
              onClick={() => setMobileFiltersOpen(false)}
              aria-label="Close filters"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
          <div className="cj-mobile-body">{filterPanel}</div>
          <div className="cj-mobile-foot">
            <button
              type="button"
              className="careers-btn-primary"
              onClick={() => setMobileFiltersOpen(false)}
            >
              Show {filtered.length} result{filtered.length === 1 ? "" : "s"}
            </button>
          </div>
        </div>
      </CareersShell>

      <style jsx>{`
        .cj-search-bar {
          display: grid;
          grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr) auto;
          gap: 10px;
          background: #ffffff;
          padding: 8px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
          margin-bottom: 22px;
        }
        .cj-search-field {
          display: flex;
          align-items: center;
          padding-left: 14px;
          border-radius: 9px;
        }
        .cj-search-field-q {
          border-right: 1px solid #e2e8f0;
        }
        .cj-search-icon {
          color: #64748b;
          display: inline-flex;
          align-items: center;
          flex-shrink: 0;
        }
        .cj-search-field input {
          width: 100%;
          padding: 12px 14px;
          border: 0;
          background: transparent;
          font-size: 15px;
          color: #0f172a;
          outline: none;
          font-family: inherit;
        }
        .cj-search-field input::placeholder {
          color: #94a3b8;
        }
        .cj-filters-btn {
          display: none;
          align-items: center;
          gap: 6px;
          padding: 11px 16px;
          border-radius: 9px;
          background: #042C53;
          color: #ffffff;
          font-size: 13px;
          font-weight: 700;
          border: 1px solid #021c38;
          cursor: pointer;
          font-family: inherit;
          box-shadow: inset 0 -2px 0 0 #BA7517;
        }
        .cj-filters-count {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 18px;
          height: 18px;
          padding: 0 6px;
          border-radius: 999px;
          background: #BA7517;
          color: #ffffff;
          font-size: 11px;
          font-weight: 800;
          margin-left: 2px;
        }

        .cj-layout {
          display: grid;
          grid-template-columns: 260px minmax(0, 1fr);
          gap: 24px;
          align-items: start;
        }
        .cj-results {
          min-width: 0;
        }

        .cj-sidebar {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 4px 18px 18px;
          position: sticky;
          top: 140px;
          max-height: calc(100vh - 160px);
          overflow-y: auto;
        }
        .cj-sidebar-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 0 10px;
          border-bottom: 1px solid #f1f5f9;
          margin-bottom: 6px;
        }
        .cj-sidebar-title {
          font-size: 14px;
          font-weight: 800;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: #042C53;
        }
        .cj-clear {
          background: none;
          border: 0;
          color: #BA7517;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
          padding: 4px 6px;
        }
        .cj-clear:hover { color: #042C53; }

        .cj-group {
          border: 0;
          padding: 12px 0;
          margin: 0;
          border-bottom: 1px solid #f1f5f9;
        }
        .cj-group:last-child { border-bottom: 0; }
        .cj-group-title {
          font-size: 12px;
          font-weight: 700;
          color: #042C53;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 0 0 8px;
        }
        .cj-row {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 5px 0;
          font-size: 13.5px;
          color: #334155;
          cursor: pointer;
          line-height: 1.4;
        }
        .cj-row input[type="checkbox"],
        .cj-row input[type="radio"] {
          width: 16px;
          height: 16px;
          accent-color: #BA7517;
          cursor: pointer;
          flex-shrink: 0;
        }
        .cj-row:hover { color: #042C53; }

        .cj-results-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 14px;
          flex-wrap: wrap;
        }
        .cj-results-tabs {
          display: inline-flex;
          gap: 4px;
        }
        .cj-tab {
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 700;
          color: #64748b;
          cursor: pointer;
        }
        .cj-tab-active {
          color: #042C53;
          background: #f8fafc;
          box-shadow: inset 0 -3px 0 0 #BA7517;
        }
        .cj-results-meta {
          display: inline-flex;
          align-items: center;
          gap: 14px;
          font-size: 13px;
          color: #475569;
        }
        .cj-results-count strong {
          color: #042C53;
          font-weight: 800;
        }
        .cj-results-new {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 3px 10px;
          border-radius: 999px;
          background: #f0fdf4;
          color: #15803d;
          font-size: 12px;
          font-weight: 700;
          border: 1px solid #bbf7d0;
        }
        .cj-new-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #16a34a;
        }

        /* Job card styles (reused) */
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
        .jc-row > * { pointer-events: auto; }
        .jc-link { pointer-events: auto; }
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
        .jc-main { flex: 1; min-width: 0; }
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
        .jc-company { font-weight: 600; color: #334155; }
        .jc-verified { display: inline-flex; align-items: center; line-height: 1; }
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
        .jc-meta { margin-bottom: 10px; }
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
        .jc-posted { margin-top: 0; }
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

        /* Mobile filter panel */
        .cj-mobile-overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(2, 14, 32, 0.45);
          z-index: 200;
        }
        .cj-mobile-panel {
          display: none;
          position: fixed;
          inset: 0 0 0 auto;
          width: min(360px, 92vw);
          background: #ffffff;
          z-index: 201;
          transform: translateX(100%);
          transition: transform 200ms ease-out;
          flex-direction: column;
        }
        .cj-mobile-panel.is-open {
          transform: translateX(0);
        }
        .cj-mobile-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          border-bottom: 1px solid #e2e8f0;
        }
        .cj-mobile-title {
          font-size: 16px;
          font-weight: 800;
          color: #042C53;
        }
        .cj-mobile-close {
          width: 32px;
          height: 32px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          background: #ffffff;
          color: #475569;
          cursor: pointer;
        }
        .cj-mobile-body {
          flex: 1;
          overflow-y: auto;
          padding: 0 18px;
        }
        .cj-mobile-body :global(.cj-sidebar) {
          position: static;
          max-height: none;
          border: 0;
          padding: 0;
        }
        .cj-mobile-foot {
          padding: 14px 20px;
          border-top: 1px solid #e2e8f0;
        }
        .cj-mobile-foot :global(.careers-btn-primary) {
          width: 100%;
        }

        @media (max-width: 960px) {
          .cj-layout {
            grid-template-columns: 1fr;
          }
          .cj-sidebar {
            display: none;
          }
          .cj-filters-btn {
            display: inline-flex;
          }
          .cj-mobile-panel { display: flex; }
          .cj-mobile-overlay { display: block; }
        }
        @media (max-width: 720px) {
          .cj-search-bar {
            grid-template-columns: 1fr;
            gap: 6px;
            padding: 6px;
          }
          .cj-search-field-q {
            border-right: 0;
            border-bottom: 1px solid #e2e8f0;
          }
          .cj-filters-btn {
            justify-content: center;
          }
          .jc { padding: 18px 16px; }
          .jc-avatar { width: 44px; height: 44px; font-size: 16px; }
          .jc-row { gap: 12px; }
          .jc-footer { align-items: flex-start; }
        }
      `}</style>
    </>
  );
}
