import Head from "next/head";
import Link from "next/link";
import type { GetStaticProps } from "next";
import { useMemo, useState } from "react";
import CareersShell from "../../components/careers/CareersShell";
import JobAlertCapture from "../../components/careers/JobAlertCapture";
import { listApprovedJobs } from "../../lib/careers/db";

const SITE_URL = "https://www.medicaidready.org";

type CompanyEntry = {
  company: string;
  openRoles: number;
  remoteRoles: number;
  hasFeatured: boolean;
  latestPostedAt: string;
  topLocations: string[];
};

type Props = { companies: CompanyEntry[]; totalJobs: number };

type SortMode = "az" | "count";

export const getStaticProps: GetStaticProps<Props> = async () => {
  let companies: CompanyEntry[] = [];
  let totalJobs = 0;

  try {
    const jobs = await listApprovedJobs();
    totalJobs = jobs.length;

    const map = new Map<
      string,
      {
        openRoles: number;
        remoteRoles: number;
        hasFeatured: boolean;
        latestPostedAt: string;
        locationCounts: Map<string, number>;
      }
    >();

    for (const j of jobs) {
      const c = (j.company ?? "").trim();
      if (!c) continue;
      const entry =
        map.get(c) ??
        {
          openRoles: 0,
          remoteRoles: 0,
          hasFeatured: false,
          latestPostedAt: j.postedAt,
          locationCounts: new Map<string, number>(),
        };
      entry.openRoles += 1;
      if (j.remote === "Remote") entry.remoteRoles += 1;
      if (j.featured) entry.hasFeatured = true;
      if (
        !entry.latestPostedAt ||
        new Date(j.postedAt).getTime() > new Date(entry.latestPostedAt).getTime()
      ) {
        entry.latestPostedAt = j.postedAt;
      }
      const loc = (j.location ?? "").trim();
      if (loc) {
        entry.locationCounts.set(loc, (entry.locationCounts.get(loc) ?? 0) + 1);
      }
      map.set(c, entry);
    }

    companies = Array.from(map.entries()).map(([company, e]) => {
      const topLocations = Array.from(e.locationCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 2)
        .map(([loc]) => loc);
      return {
        company,
        openRoles: e.openRoles,
        remoteRoles: e.remoteRoles,
        hasFeatured: e.hasFeatured,
        latestPostedAt: e.latestPostedAt,
        topLocations,
      };
    });

    companies.sort((a, b) => a.company.localeCompare(b.company));
  } catch (e) {
    console.warn(
      "[careers/companies] listApprovedJobs failed:",
      e instanceof Error ? e.message : String(e)
    );
  }

  return { props: { companies, totalJobs }, revalidate: 60 };
};

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

export default function CareersCompanies({ companies, totalJobs }: Props) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortMode>("count");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q
      ? companies.filter((c) => c.company.toLowerCase().includes(q))
      : companies;
    const sorted = [...list];
    if (sort === "count") {
      sorted.sort((a, b) => {
        if (b.openRoles !== a.openRoles) return b.openRoles - a.openRoles;
        return a.company.localeCompare(b.company);
      });
    } else {
      sorted.sort((a, b) => a.company.localeCompare(b.company));
    }
    return sorted;
  }, [companies, query, sort]);

  const url = `${SITE_URL}/careers/companies`;
  const metaTitle =
    "Healthcare and Medicaid Companies Hiring Now | MedicaidReady Careers";
  const metaDescription =
    "Browse healthcare, Medicaid, and care-workforce employers actively hiring through MedicaidReady Careers. Real companies, real open roles, updated weekly.";

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
            <div className="careers-eyebrow">Companies</div>
            <h1 className="careers-h1">Healthcare employers hiring now.</h1>
            <p className="careers-lead">
              {companies.length > 0 ? (
                <>
                  {companies.length}{" "}
                  {companies.length === 1 ? "employer" : "employers"} listing{" "}
                  {totalJobs} open {totalJobs === 1 ? "role" : "roles"} on
                  MedicaidReady Careers right now. Each one is curated and
                  reviewed before going live.
                </>
              ) : (
                <>No companies listed yet. New employer listings appear here as roles are approved.</>
              )}
            </p>

            <div className="co-toolbar">
              <input
                type="search"
                className="careers-search"
                placeholder="Search companies"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search companies"
              />
              <div className="co-sort" role="radiogroup" aria-label="Sort companies">
                <button
                  type="button"
                  className={`co-sort-btn${sort === "count" ? " is-active" : ""}`}
                  onClick={() => setSort("count")}
                  aria-pressed={sort === "count"}
                >
                  Most open roles
                </button>
                <button
                  type="button"
                  className={`co-sort-btn${sort === "az" ? " is-active" : ""}`}
                  onClick={() => setSort("az")}
                  aria-pressed={sort === "az"}
                >
                  A–Z
                </button>
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="careers-empty">
                {query
                  ? "No companies match that search."
                  : "No companies listed yet. Check back after the next curation cycle."}
              </div>
            ) : (
              <div className="co-grid">
                {filtered.map((c) => {
                  const av = avatarPalette(c.company);
                  return (
                    <Link
                      key={c.company}
                      href={`/careers/jobs?q=${encodeURIComponent(c.company)}`}
                      className="co-card"
                    >
                      {c.hasFeatured && (
                        <span className="co-card-featured">
                          <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                            <path d="M6 1l1.5 3.2L11 4.7l-2.5 2.4.6 3.4L6 8.9 2.9 10.5l.6-3.4L1 4.7l3.5-.5L6 1z" fill="currentColor"/>
                          </svg>
                          Featured employer
                        </span>
                      )}

                      <div className="co-card-top">
                        <div
                          className="co-avatar"
                          style={{ background: av.bg, color: av.fg }}
                          aria-hidden="true"
                        >
                          {companyInitials(c.company)}
                        </div>
                        <div className="co-card-name-block">
                          <div className="co-card-name-row">
                            <span className="co-card-name">{c.company}</span>
                            <span
                              className="co-verified"
                              title="Verified employer"
                              aria-label="Verified employer"
                            >
                              <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                                <path d="M7 0.7l1.6 1L10.5 1.5l.4 1.9 1.6 1.1-.7 1.8.7 1.8-1.6 1.1-.4 1.9-1.9-.2L7 13.3l-1.6-1L3.5 12.5l-.4-1.9L1.5 9.5l.7-1.8-.7-1.8 1.6-1.1L3.5 2.9l1.9.2L7 0.7z" fill="#0e7490"/>
                                <path d="M4.5 7l1.7 1.7L9.5 5.3" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </span>
                          </div>
                          {c.topLocations.length > 0 && (
                            <div className="co-card-locations">
                              {c.topLocations.join(" · ")}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="co-card-meta">
                        <span className="careers-pill careers-pill-navy co-pill-strong">
                          {c.openRoles} open {c.openRoles === 1 ? "role" : "roles"}
                        </span>
                        {c.remoteRoles > 0 && (
                          <span className="careers-pill careers-pill-teal">
                            {c.remoteRoles} remote
                          </span>
                        )}
                      </div>

                      <div className="co-card-cta">
                        View roles
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                          <path d="M3 6h6M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            <p className="co-disclaimer">
              Employers appear here based on currently approved listings on
              MedicaidReady Careers. Every employer is reviewed manually before
              listings go live.
            </p>

            <div style={{ marginTop: 36 }}>
              <JobAlertCapture source="careers_companies_page" />
            </div>
          </div>
        </section>
      </CareersShell>

      <style jsx>{`
        .co-toolbar {
          display: flex;
          gap: 12px;
          align-items: center;
          flex-wrap: wrap;
          margin: 24px 0 22px;
        }
        .co-sort {
          display: inline-flex;
          padding: 4px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          gap: 2px;
        }
        .co-sort-btn {
          padding: 8px 14px;
          border: 0;
          background: transparent;
          font-size: 13px;
          font-weight: 600;
          color: #475569;
          border-radius: 8px;
          cursor: pointer;
          font-family: inherit;
          transition: background 120ms, color 120ms;
        }
        .co-sort-btn:hover {
          color: #042C53;
          background: #f1f5f9;
        }
        .co-sort-btn.is-active {
          background: #042C53;
          color: #ffffff;
          box-shadow: inset 0 -2px 0 0 #BA7517;
        }

        .co-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }
        .co-card {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 14px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 20px 22px;
          text-decoration: none !important;
          color: inherit;
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
          transition: border-color 140ms, transform 100ms, box-shadow 140ms;
        }
        .co-card:hover {
          border-color: #BA7517;
          transform: translateY(-1px);
          box-shadow: 0 8px 22px rgba(4, 44, 83, 0.08);
          color: inherit;
        }
        .co-card-featured {
          position: absolute;
          top: 10px;
          right: 12px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 3px 8px;
          border-radius: 999px;
          background: #fff7e6;
          color: #BA7517;
          border: 1px solid #f1deb3;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }
        .co-card-top {
          display: flex;
          gap: 14px;
          align-items: flex-start;
        }
        .co-avatar {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          font-weight: 700;
          flex-shrink: 0;
          border: 1px solid rgba(15, 23, 42, 0.06);
        }
        .co-card-name-block {
          min-width: 0;
          flex: 1;
        }
        .co-card-name-row {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .co-card-name {
          font-size: 15px;
          font-weight: 700;
          color: #042C53;
          letter-spacing: -0.01em;
        }
        .co-verified {
          display: inline-flex;
          align-items: center;
          line-height: 1;
        }
        .co-card-locations {
          font-size: 12px;
          color: #64748b;
          margin-top: 3px;
          line-height: 1.4;
        }
        .co-card-meta {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }
        .co-pill-strong {
          font-weight: 700;
        }
        .co-card-cta {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 700;
          color: #BA7517;
          margin-top: auto;
        }

        .co-disclaimer {
          margin: 26px 0 0;
          font-size: 13px;
          color: #64748b;
          line-height: 1.6;
        }

        @media (max-width: 960px) {
          .co-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 600px) {
          .co-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
}
