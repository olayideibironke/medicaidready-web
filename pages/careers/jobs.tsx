import Head from "next/head";
import Link from "next/link";
import type { GetStaticProps } from "next";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import CareersShell from "../../components/careers/CareersShell";
import CategoryGrid from "../../components/careers/CategoryGrid";
import JobAlertCapture from "../../components/careers/JobAlertCapture";
import SaveJobButton from "../../components/careers/SaveJobButton";
import {
  CAREERS_CATEGORY_DEFS,
  careersJobSearchText,
  findCareersCategoryByInput,
  jobMatchesCareersCategory,
} from "../../lib/careers/categories";
import { listApprovedJobs } from "../../lib/careers/db";
import type {
  CareersJob,
  CareersJobMode,
  CareersJobType,
} from "../../lib/careers/sampleJobs";

const SITE_URL = "https://www.medicaidready.org";

const COMPANY_LOGO_DOMAINS: Record<string, string> = {
  "unitedhealth group": "unitedhealthgroup.com",
  "unitedhealth group / optum": "optum.com",
  optum: "optum.com",
  "molina healthcare": "molinahealthcare.com",
  "centene corporation": "centene.com",
  gbmc: "gbmc.org",
  "adventist healthcare": "adventisthealthcare.com",
  "elevance health": "elevancehealth.com",
  "trinity health": "trinity-health.org",
  "communitycare health": "communitycarehealth.org",
  "cvs health": "cvshealth.com",
  aetna: "aetna.com",
  humana: "humana.com",
  "kaiser permanente": "kp.org",
  carefirst: "carefirst.com",
  "carefirst bluecross blueshield": "carefirst.com",
  "johns hopkins medicine": "hopkinsmedicine.org",
  "medstar health": "medstarhealth.org",
  "university of maryland medical system": "umms.org",
  "children's national hospital": "childrensnational.org",
  "children’s national hospital": "childrensnational.org",
  "blue cross blue shield": "bcbs.com",
  "capital one": "capitalone.com",
  "navy federal credit union": "navyfederal.org",
  caresource: "caresource.com",
  "commonwealth care alliance": "commonwealthcarealliance.org",
  "caresource / commonwealth care alliance": "caresource.com",
  "blue shield of california": "blueshieldca.com",
  "anthem blue cross": "anthem.com",
  "highmark health": "highmarkhealth.org",
  "independence blue cross": "ibx.com",
  "cigna healthcare": "cigna.com",
  cigna: "cigna.com",
  amerihealth: "amerihealth.com",
  "amerihealth caritas": "amerihealthcaritas.com",
  geisinger: "geisinger.org",
  "mayo clinic": "mayoclinic.org",
  "cleveland clinic": "clevelandclinic.org",
  walgreens: "walgreens.com",
  "rite aid": "riteaid.com",
  "hca healthcare": "hcahealthcare.com",
  "bon secours": "bonsecours.com",
  "lifepoint health": "lifepointhealth.net",
  "oak street health": "oakstreethealth.com",
  chenmed: "chenmed.com",
};

type Props = { jobs: CareersJob[] };
type DateRange = "any" | "1d" | "7d" | "30d";

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

  return ((parts[0][0] || "") + (parts[parts.length - 1][0] || "")).toUpperCase();
}

function getJobApplyUrl(job: CareersJob): string | null {
  const flexibleJob = job as CareersJob & {
    apply_url?: string | null;
    applyUrl?: string | null;
    url?: string | null;
  };

  return flexibleJob.apply_url || flexibleJob.applyUrl || flexibleJob.url || null;
}

function extractDomainFromUrl(url?: string | null): string | null {
  if (!url) return null;

  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.replace(/^www\./, "").toLowerCase();

    const blockedJobBoards = [
      "linkedin.com",
      "indeed.com",
      "ziprecruiter.com",
      "glassdoor.com",
      "dice.com",
      "monster.com",
      "careerbuilder.com",
      "simplyhired.com",
    ];

    if (blockedJobBoards.some((domain) => hostname === domain || hostname.endsWith(`.${domain}`))) {
      return null;
    }

    return hostname;
  } catch {
    return null;
  }
}

function companyLogoUrl(job: CareersJob): string | null {
  const applyDomain = extractDomainFromUrl(getJobApplyUrl(job));

  if (applyDomain) {
    return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(applyDomain)}&sz=128`;
  }

  const normalized = job.company.trim().toLowerCase();
  const mappedDomain = COMPANY_LOGO_DOMAINS[normalized];

  if (mappedDomain) {
    return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(mappedDomain)}&sz=128`;
  }

  return null;
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

function jobMatchesLocation(job: CareersJob, loc: string): boolean {
  const l = loc.trim().toLowerCase();

  if (!l) return true;
  if (l === "remote" || l === "remote-friendly") return job.remote === "Remote";

  const target = `${job.location} ${job.remote}`.toLowerCase();

  return target.includes(l);
}

function queryStringValue(value: string | string[] | undefined): string {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value[0] || "";

  return "";
}

function normalizeWorkModeParam(value: string | string[] | undefined): CareersJobMode | null {
  const raw = queryStringValue(value).trim().toLowerCase();

  if (raw === "remote") return "Remote";
  if (raw === "hybrid") return "Hybrid";
  if (raw === "on-site" || raw === "onsite" || raw === "on site") return "On-site";

  return null;
}

function normalizeCategoryParam(value: string | string[] | undefined): string | null {
  const category = findCareersCategoryByInput(queryStringValue(value));

  return category?.key ?? null;
}

export default function CareersJobs({ jobs }: Props) {
  const router = useRouter();

  const initialQ = queryStringValue(router.query.q) || queryStringValue(router.query.query);
  const initialLoc = queryStringValue(router.query.loc) || queryStringValue(router.query.location);
  const initialMode =
    normalizeWorkModeParam(router.query.workMode) || normalizeWorkModeParam(router.query.mode);
  const initialCategory = normalizeCategoryParam(router.query.category);

  const [query, setQuery] = useState(initialQ);
  const [loc, setLoc] = useState(initialLoc);
  const [postedRange, setPostedRange] = useState<DateRange>("any");
  const [modes, setModes] = useState<Set<CareersJobMode>>(
    () => new Set(initialMode ? [initialMode] : [])
  );
  const [types, setTypes] = useState<Set<CareersJobType>>(new Set());
  const [cats, setCats] = useState<Set<string>>(
    () => new Set(initialCategory ? [initialCategory] : [])
  );
  const [salaryOnly, setSalaryOnly] = useState(false);
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    if (typeof document === "undefined") return;

    document.documentElement.classList.add("careers-jobs-scroll-lock");
    document.body.classList.add("careers-jobs-scroll-lock");
    window.scrollTo({ top: 0, left: 0 });

    return () => {
      document.documentElement.classList.remove("careers-jobs-scroll-lock");
      document.body.classList.remove("careers-jobs-scroll-lock");
    };
  }, []);

  useEffect(() => {
    if (!router.isReady) return;

    const nextQuery = queryStringValue(router.query.q) || queryStringValue(router.query.query);
    const nextLocation =
      queryStringValue(router.query.loc) || queryStringValue(router.query.location);
    const nextMode =
      normalizeWorkModeParam(router.query.workMode) || normalizeWorkModeParam(router.query.mode);
    const nextCategory = normalizeCategoryParam(router.query.category);

    setQuery((current) => (current === nextQuery ? current : nextQuery));
    setLoc((current) => (current === nextLocation ? current : nextLocation));

    if (nextMode) {
      setModes((current) => {
        if (current.size === 1 && current.has(nextMode)) return current;

        return new Set([nextMode]);
      });
    }

    if (nextCategory) {
      setCats((current) => {
        if (current.size === 1 && current.has(nextCategory)) return current;

        return new Set([nextCategory]);
      });
    }
  }, [
    router.isReady,
    router.query.q,
    router.query.query,
    router.query.loc,
    router.query.location,
    router.query.workMode,
    router.query.mode,
    router.query.category,
  ]);

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
        const hay = careersJobSearchText(j).toLowerCase();
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
        const matchAnySelectedCategory = Array.from(cats).some((key) => {
          const def = CAREERS_CATEGORY_DEFS.find((category) => category.key === key);

          return def ? jobMatchesCareersCategory(j, def) : false;
        });

        if (!matchAnySelectedCategory) return false;
      }

      return true;
    });
  }, [jobs, query, loc, postedRange, modes, types, cats, salaryOnly, featuredOnly]);

  const newCount = useMemo(
    () => filtered.filter((j) => daysSince(j.postedAt) <= 7).length,
    [filtered]
  );

  const activeCategoryLabels = useMemo(
    () =>
      CAREERS_CATEGORY_DEFS.filter((category) => cats.has(category.key)).map(
        (category) => category.label
      ),
    [cats]
  );

  const activeResultsLabel =
    activeCategoryLabels.length === 1
      ? activeCategoryLabels[0]
      : activeCategoryLabels.length > 1
        ? "Filtered Jobs"
        : "Recommended Jobs";

  const url = `${SITE_URL}/careers/jobs`;
  const metaTitle =
    "Find Verified Jobs | Analyst, Healthcare, Government, Tech and Remote Roles | MedicaidReady Careers";
  const metaDescription =
    "Browse verified jobs across healthcare, technology, government, analyst, operations, compliance, cybersecurity, cloud, IT, finance, and remote career categories.";

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
          <label
            key={value}
            className={`cj-row cj-radio-row${postedRange === value ? " is-selected" : ""}`}
          >
            <input
              type="radio"
              name="posted"
              value={value}
              checked={postedRange === value}
              onChange={() => setPostedRange(value)}
            />
            <span className="cj-choice-mark cj-radio-mark" aria-hidden="true" />
            <span>{label}</span>
          </label>
        ))}
      </fieldset>

      <fieldset className="cj-group">
        <legend className="cj-group-title">Work setting</legend>
        {(["Remote", "Hybrid", "On-site"] as CareersJobMode[]).map((m) => (
          <label key={m} className={`cj-row${modes.has(m) ? " is-selected" : ""}`}>
            <input
              type="checkbox"
              checked={modes.has(m)}
              onChange={() => toggleSetItem(modes, m, setModes)}
            />
            <span className="cj-choice-mark cj-check-mark" aria-hidden="true" />
            <span>{m}</span>
          </label>
        ))}
      </fieldset>

      <fieldset className="cj-group">
        <legend className="cj-group-title">Employment type</legend>
        {(["Full-time", "Part-time", "Contract", "Internship"] as CareersJobType[]).map(
          (t) => (
            <label key={t} className={`cj-row${types.has(t) ? " is-selected" : ""}`}>
              <input
                type="checkbox"
                checked={types.has(t)}
                onChange={() => toggleSetItem(types, t, setTypes)}
              />
              <span className="cj-choice-mark cj-check-mark" aria-hidden="true" />
              <span>{t}</span>
            </label>
          )
        )}
      </fieldset>

      <fieldset className="cj-group">
        <legend className="cj-group-title">Role category</legend>
        {CAREERS_CATEGORY_DEFS.map((def) => (
          <label key={def.key} className={`cj-row${cats.has(def.key) ? " is-selected" : ""}`}>
            <input
              type="checkbox"
              checked={cats.has(def.key)}
              onChange={() => toggleSetItem(cats, def.key, setCats)}
            />
            <span className="cj-choice-mark cj-check-mark" aria-hidden="true" />
            <span>{def.label}</span>
          </label>
        ))}
      </fieldset>

      <fieldset className="cj-group">
        <legend className="cj-group-title">Other</legend>
        <label className={`cj-row${salaryOnly ? " is-selected" : ""}`}>
          <input
            type="checkbox"
            checked={salaryOnly}
            onChange={() => setSalaryOnly((v) => !v)}
          />
          <span className="cj-choice-mark cj-check-mark" aria-hidden="true" />
          <span>Salary available</span>
        </label>
        <label className={`cj-row${featuredOnly ? " is-selected" : ""}`}>
          <input
            type="checkbox"
            checked={featuredOnly}
            onChange={() => setFeaturedOnly((v) => !v)}
          />
          <span className="cj-choice-mark cj-check-mark" aria-hidden="true" />
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
        <meta property="og:site_name" content="MedicaidReady Careers" />
      </Head>

      <CareersShell>
        <section className="careers-section cj-page-section">
          <div className="careers-container cj-page-container">
            <div className="cj-search-bar">
              <div className="cj-search-field cj-search-field-q">
                <span className="cj-search-icon" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <circle cx="8" cy="8" r="5.25" stroke="currentColor" strokeWidth="1.6" />
                    <path
                      d="M12 12l3 3"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
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
                  <path
                    d="M2 4h10M3 7h8M5 10h4"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
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
                    <span className="cj-tab cj-tab-active">{activeResultsLabel}</span>
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
                      const logoUrl = companyLogoUrl(job);
                      const isFeatured = Boolean(job.featured);
                      const isHot = daysSince(job.postedAt) <= 7;
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
                              <svg
                                width="11"
                                height="11"
                                viewBox="0 0 12 12"
                                fill="none"
                                aria-hidden="true"
                              >
                                <path
                                  d="M6 1l1.5 3.2L11 4.7l-2.5 2.4.6 3.4L6 8.9 2.9 10.5l.6-3.4L1 4.7l3.5-.5L6 1z"
                                  fill="currentColor"
                                />
                              </svg>
                              Featured
                            </span>
                          )}

                          <div className="jc-row">
                            <div className="jc-avatar" aria-hidden="true">
                              {logoUrl ? (
                                <img src={logoUrl} alt="" loading="lazy" />
                              ) : (
                                <span>{companyInitials(job.company)}</span>
                              )}
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
                                  <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 14 14"
                                    fill="none"
                                    aria-hidden="true"
                                  >
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
                                {isHot && (
                                  <span
                                    className="jc-hiring-dot"
                                    title="Actively hiring"
                                    aria-label="Actively hiring"
                                  >
                                    <span className="jc-hiring-dot-inner" />
                                  </span>
                                )}
                                <span className="jc-loc-sep" aria-hidden="true">
                                  •
                                </span>
                                <span className="jc-loc">{job.location}</span>
                              </div>

                              <div className="careers-job-meta jc-meta">
                                <span className={`careers-pill ${typeBadgeClass(job.type)}`}>
                                  {job.type}
                                </span>
                                <span className={`careers-pill ${modeBadgeClass(job.remote)}`}>
                                  {job.remote}
                                </span>
                                {job.salary && (
                                  <span className="careers-pill careers-pill-gold">
                                    {job.salary}
                                  </span>
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
                                  <SaveJobButton jobId={job.id} />
                                  <Link href={`/careers/jobs/${job.id}`} className="jc-apply">
                                    Apply
                                    <svg
                                      width="12"
                                      height="12"
                                      viewBox="0 0 12 12"
                                      fill="none"
                                      aria-hidden="true"
                                    >
                                      <path
                                        d="M3 6h6M7 3l3 3-3 3"
                                        stroke="currentColor"
                                        strokeWidth="1.6"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
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
                <path
                  d="M3 3l8 8M11 3l-8 8"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                />
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

      <style jsx global>{`
        @media (min-width: 961px) {
          html.careers-jobs-scroll-lock,
          body.careers-jobs-scroll-lock {
            overflow: hidden !important;
          }
        }

        .cj-page-section {
          --cj-subnav-height: 62px;
          --cj-top-space: clamp(34px, 6vh, 76px);
          height: calc(100dvh - var(--cj-subnav-height));
          min-height: 0;
          overflow: hidden;
          padding-top: var(--cj-top-space) !important;
          padding-bottom: 0 !important;
        }

        .cj-page-container {
          width: min(100%, calc(100vw - clamp(24px, 3.5vw, 72px))) !important;
          max-width: none !important;
          height: calc(100dvh - var(--cj-subnav-height) - var(--cj-top-space));
          min-height: 0;
          display: flex;
          flex-direction: column;
          margin-left: auto !important;
          margin-right: auto !important;
          padding-left: 0 !important;
          padding-right: 0 !important;
        }

        .cj-search-bar {
          flex: 0 0 auto;
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
          box-shadow: 0 6px 14px rgba(4, 44, 83, 0.20), inset 0 -2px 0 0 #BA7517;
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
          flex: 1 1 auto;
          min-height: 0;
          display: grid;
          grid-template-columns: clamp(286px, 19vw, 340px) minmax(0, 1fr);
          gap: clamp(18px, 2vw, 32px);
          align-items: stretch;
          overflow: hidden;
        }
        .cj-results {
          min-width: 0;
          height: 100%;
          min-height: 0;
          overflow-y: auto;
          overflow-x: hidden;
          padding-right: clamp(6px, 0.9vw, 14px);
          scrollbar-gutter: stable;
        }

        .cj-sidebar {
          background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%) !important;
          border: 1px solid #dbe5f0 !important;
          border-top: 4px solid #BA7517 !important;
          border-radius: 18px !important;
          padding: 16px 18px 18px !important;
          box-shadow: 0 10px 26px rgba(4, 44, 83, 0.08) !important;
          position: relative !important;
          top: auto !important;
          height: 100% !important;
          max-height: none !important;
          min-height: 0 !important;
          overflow-y: auto !important;
          align-self: stretch !important;
          z-index: 20 !important;
          scrollbar-gutter: stable !important;
        }
        .cj-sidebar-head {
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          padding: 0 0 12px !important;
          border-bottom: 1px solid #edf2f7 !important;
          margin-bottom: 4px !important;
        }
        .cj-sidebar-title {
          font-size: 14px !important;
          font-weight: 900 !important;
          color: #042C53 !important;
          letter-spacing: 0.08em !important;
          text-transform: uppercase !important;
        }
        .cj-clear {
          border: 1px solid #f1deb3 !important;
          background: #fff7e6 !important;
          color: #BA7517 !important;
          border-radius: 999px !important;
          padding: 5px 10px !important;
          font-size: 12px !important;
          font-weight: 800 !important;
          cursor: pointer !important;
          font-family: inherit !important;
        }
        .cj-clear:hover {
          color: #042C53 !important;
          background: #fff3d5 !important;
        }

        .cj-sidebar fieldset,
        .cj-sidebar fieldset.cj-group,
        fieldset.cj-group {
          border: 0 !important;
          margin: 0 !important;
          padding: 14px 0 !important;
          min-width: 0 !important;
          border-bottom: 1px solid #edf2f7 !important;
        }
        .cj-sidebar fieldset:last-child,
        fieldset.cj-group:last-child {
          border-bottom: 0 !important;
        }
        .cj-group-title,
        .cj-sidebar legend {
          display: block !important;
          width: 100% !important;
          padding: 0 0 9px !important;
          margin: 0 !important;
          font-size: 12px !important;
          font-weight: 850 !important;
          color: #042C53 !important;
          letter-spacing: 0.08em !important;
          text-transform: uppercase !important;
        }
        .cj-row {
          display: flex !important;
          align-items: flex-start !important;
          gap: 10px !important;
          padding: 7px 0 !important;
          font-size: 13.5px !important;
          color: #334155 !important;
          cursor: pointer !important;
          line-height: 1.45 !important;
          user-select: none !important;
        }
        .cj-row input[type="checkbox"],
        .cj-row input[type="radio"] {
          position: absolute !important;
          opacity: 0 !important;
          width: 1px !important;
          height: 1px !important;
          margin: 0 !important;
          pointer-events: none !important;
          appearance: none !important;
          -webkit-appearance: none !important;
        }
        .cj-choice-mark {
          width: 18px !important;
          height: 18px !important;
          flex: 0 0 18px !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          border: 1.7px solid #94a3b8 !important;
          background: #ffffff !important;
          color: #ffffff !important;
          box-shadow: 0 1px 2px rgba(15, 23, 42, 0.06) !important;
          margin-top: 1px !important;
          transition: border-color 120ms ease, background 120ms ease, box-shadow 120ms ease !important;
        }
        .cj-radio-mark {
          border-radius: 999px !important;
        }
        .cj-check-mark {
          border-radius: 5px !important;
        }
        .cj-radio-mark::after {
          content: "" !important;
          width: 8px !important;
          height: 8px !important;
          border-radius: 999px !important;
          background: #BA7517 !important;
          opacity: 0 !important;
          transform: scale(0.35) !important;
          transition: opacity 120ms ease, transform 120ms ease !important;
        }
        .cj-check-mark::after {
          content: "✓" !important;
          font-size: 13px !important;
          font-weight: 900 !important;
          line-height: 1 !important;
          opacity: 0 !important;
          transform: scale(0.8) !important;
          transition: opacity 120ms ease, transform 120ms ease !important;
        }
        .cj-row.is-selected {
          color: #042C53 !important;
          font-weight: 650 !important;
        }
        .cj-row.is-selected .cj-radio-mark {
          border-color: #BA7517 !important;
          background: #fff7e6 !important;
          box-shadow: 0 0 0 3px rgba(186, 117, 23, 0.12) !important;
        }
        .cj-row.is-selected .cj-radio-mark::after {
          opacity: 1 !important;
          transform: scale(1) !important;
        }
        .cj-row.is-selected .cj-check-mark {
          border-color: #BA7517 !important;
          background: #BA7517 !important;
          box-shadow: 0 0 0 3px rgba(186, 117, 23, 0.12) !important;
        }
        .cj-row.is-selected .cj-check-mark::after {
          opacity: 1 !important;
          transform: scale(1) !important;
        }
        .cj-row input[type="checkbox"]:focus-visible + .cj-choice-mark,
        .cj-row input[type="radio"]:focus-visible + .cj-choice-mark {
          outline: 3px solid rgba(186, 117, 23, 0.25) !important;
          outline-offset: 2px !important;
        }
        .cj-row:hover {
          color: #042C53 !important;
        }
        .cj-row:hover .cj-choice-mark {
          border-color: #BA7517 !important;
        }

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
          flex-shrink: 0;
          border: 1px solid rgba(15, 23, 42, 0.08);
          background: #ffffff;
          overflow: hidden;
          box-shadow: 0 1px 4px rgba(15, 23, 42, 0.08);
        }
        .jc-avatar img {
          display: block;
          width: 38px;
          height: 38px;
          object-fit: contain;
        }
        .jc-avatar span {
          display: flex;
          width: 100%;
          height: 100%;
          align-items: center;
          justify-content: center;
          background: #eef3f9;
          color: #042C53;
          font-size: 18px;
          font-weight: 800;
          letter-spacing: -0.02em;
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
        .jc-loc-sep {
          color: #cbd5e1;
        }
        .jc-loc {
          color: #64748b;
        }
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
          position: relative;
          z-index: 6;
        }
        .jc-apply {
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 6px !important;
          padding: 10px 18px !important;
          min-width: 92px !important;
          border-radius: 999px !important;
          background: linear-gradient(135deg, #042C53, #0C447C) !important;
          color: #ffffff !important;
          font-size: 13px !important;
          font-weight: 800 !important;
          border: 1px solid #021c38 !important;
          text-decoration: none !important;
          box-shadow: 0 6px 14px rgba(4, 44, 83, 0.22), inset 0 -2px 0 0 #BA7517 !important;
          position: relative !important;
          z-index: 5 !important;
        }
        .jc-apply:hover {
          background: linear-gradient(135deg, #0C447C, #042C53) !important;
          color: #ffffff !important;
          transform: translateY(-1px) !important;
        }

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
        .cj-mobile-body .cj-sidebar {
          position: static !important;
          max-height: none !important;
          border: 0 !important;
          padding: 0 !important;
          box-shadow: none !important;
        }
        .cj-mobile-foot {
          padding: 14px 20px;
          border-top: 1px solid #e2e8f0;
        }
        .cj-mobile-foot .careers-btn-primary {
          width: 100%;
        }

        @media (max-width: 1180px) {
          .cj-page-container {
            width: min(100%, calc(100vw - 32px)) !important;
            max-width: none !important;
          }

          .cj-layout {
            grid-template-columns: 286px minmax(0, 1fr);
            gap: 20px;
          }
        }

        @media (max-width: 960px) {
          .cj-layout {
            grid-template-columns: 1fr;
            overflow: visible;
          }
          .cj-sidebar {
            display: none !important;
          }
          .cj-results {
            height: auto;
            overflow: visible;
            padding-right: 0;
          }
          .cj-filters-btn {
            display: inline-flex;
          }
          .cj-mobile-panel {
            display: flex;
          }
          .cj-mobile-overlay {
            display: block;
          }
        }
        @media (max-width: 720px) {
          .cj-page-section {
            height: auto;
            min-height: auto;
            overflow: visible;
            padding-top: 52px !important;
            padding-bottom: 48px !important;
          }

          .cj-page-container {
            width: min(100%, calc(100vw - 20px)) !important;
            max-width: min(100%, calc(100vw - 20px)) !important;
            height: auto;
            display: block;
          }

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
          .jc {
            padding: 18px 16px;
          }
          .jc-avatar {
            width: 44px;
            height: 44px;
          }
          .jc-avatar img {
            width: 32px;
            height: 32px;
          }
          .jc-avatar span {
            font-size: 16px;
          }
          .jc-row {
            gap: 12px;
          }
          .jc-footer {
            align-items: flex-start;
          }
        }
      `}</style>
    </>
  );
}