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
        .slice(0, 3)
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
        <section className="careers-section companies-page">
          <div className="careers-container">
            <div className="companies-hero">
              <div className="careers-eyebrow">Companies</div>
              <h1 className="careers-h1">Healthcare employers hiring now.</h1>
              <p className="careers-lead">
                {companies.length > 0 ? (
                  <>
                    Browse {companies.length} employers with {totalJobs} approved
                    roles across Medicaid, healthcare operations, compliance,
                    care workforce, and health-tech hiring.
                  </>
                ) : (
                  <>
                    No companies listed yet. New employer listings appear here as
                    roles are approved.
                  </>
                )}
              </p>
            </div>

            <div className="dice-search-shell">
              <div className="dice-search-row">
                <div className="dice-search-box">
                  <svg width="22" height="22" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path
                      d="M9.2 15.4a6.2 6.2 0 1 0 0-12.4 6.2 6.2 0 0 0 0 12.4ZM14 14l3 3"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                  <input
                    type="search"
                    placeholder="Search by employer name"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    aria-label="Search companies"
                  />
                </div>

                <div className="dice-sort">
                  <button
                    type="button"
                    className={sort === "count" ? "is-active" : ""}
                    onClick={() => setSort("count")}
                    aria-pressed={sort === "count"}
                  >
                    Most open roles
                  </button>
                  <button
                    type="button"
                    className={sort === "az" ? "is-active" : ""}
                    onClick={() => setSort("az")}
                    aria-pressed={sort === "az"}
                  >
                    A-Z
                  </button>
                </div>
              </div>

              <div className="dice-filter-line">
                <span className="filter-icon" aria-hidden="true">☰</span>
                <span>All companies</span>
              </div>
            </div>

            <div className="companies-results-bar">
              Showing <strong>{filtered.length}</strong>{" "}
              {filtered.length === 1 ? "company" : "companies"}{" "}
              <span>•</span> Manual review before publishing
            </div>

            {filtered.length === 0 ? (
              <div className="careers-empty co-empty">
                {query
                  ? "No companies match that search."
                  : "No companies listed yet. Check back after the next curation cycle."}
              </div>
            ) : (
              <div className="company-list">
                {filtered.map((c) => (
                  <Link
                    key={c.company}
                    href={`/careers/jobs?q=${encodeURIComponent(c.company)}`}
                    className="company-row"
                  >
                    <div className="company-logo" aria-hidden="true">
                      {companyInitials(c.company)}
                    </div>

                    <div className="company-main">
                      <div className="company-topline">
                        <h2>{c.company}</h2>
                        <span className="verified-badge">Verified</span>
                        {c.hasFeatured && (
                          <span className="featured-badge">Featured</span>
                        )}
                      </div>

                      <div className="company-location">
                        {c.topLocations.length > 0
                          ? c.topLocations.join(" • ")
                          : "Location varies by role"}
                      </div>

                      <div className="company-summary">
                        Healthcare employer with approved active listings on
                        MedicaidReady Careers.
                      </div>

                      <div className="company-tags">
                        <span>{c.openRoles} open {c.openRoles === 1 ? "role" : "roles"}</span>
                        <span>{c.remoteRoles} remote {c.remoteRoles === 1 ? "role" : "roles"}</span>
                        <span>Healthcare hiring</span>
                      </div>
                    </div>

                    <div className="company-action">
                      <span className="view-button">View roles</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            <p className="co-disclaimer">
              Employers appear here based on currently approved listings on
              MedicaidReady Careers. Every employer is reviewed manually before
              listings go live.
            </p>

            <div className="co-alert-wrap">
              <JobAlertCapture source="careers_companies_page" />
            </div>
          </div>
        </section>
      </CareersShell>

      <style jsx>{`
        .companies-page {
          background: #f8fafc;
        }

        .companies-hero {
          margin-bottom: 22px;
        }

        .dice-search-shell {
          margin: 22px 0 26px;
          padding: 22px;
          border-radius: 18px;
          background: #0f5668;
          box-shadow: 0 18px 38px rgba(15, 86, 104, 0.18);
        }

        .dice-search-row {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 14px;
          align-items: center;
        }

        .dice-search-box {
          display: flex;
          align-items: center;
          gap: 14px;
          min-height: 66px;
          padding: 0 20px;
          border-radius: 10px;
          background: #ffffff;
          color: #64748b;
        }

        .dice-search-box input {
          width: 100%;
          border: 0;
          outline: 0;
          background: transparent;
          font-family: inherit;
          font-size: 18px;
          font-weight: 600;
          color: #0f172a;
        }

        .dice-search-box input::placeholder {
          color: #6b7280;
        }

        .dice-sort {
          display: flex;
          align-items: center;
          gap: 8px;
          height: 66px;
          padding: 7px;
          border-radius: 10px;
          background: #ffffff;
        }

        .dice-sort button {
          height: 50px;
          padding: 0 20px;
          border: 0;
          border-radius: 999px;
          background: transparent;
          color: #042c53;
          cursor: pointer;
          font-family: inherit;
          font-size: 15px;
          font-weight: 850;
        }

        .dice-sort button.is-active {
          background: #042c53;
          color: #ffffff;
          box-shadow: inset 0 -3px 0 #ba7517;
        }

        .dice-filter-line {
          display: flex;
          align-items: center;
          gap: 9px;
          margin-top: 20px;
          color: #ffffff;
          font-size: 16px;
          font-weight: 850;
        }

        .filter-icon {
          font-size: 18px;
          line-height: 1;
          transform: rotate(90deg);
        }

        .companies-results-bar {
          margin-bottom: 16px;
          color: #475569;
          font-size: 15px;
          font-weight: 700;
        }

        .companies-results-bar strong {
          color: #042c53;
        }

        .companies-results-bar span {
          margin: 0 8px;
          color: #ba7517;
        }

        .company-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .company-row {
          display: grid;
          grid-template-columns: 70px minmax(0, 1fr) auto;
          gap: 20px;
          align-items: start;
          padding: 28px 30px;
          border-radius: 12px;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          box-shadow: 0 2px 8px rgba(15, 23, 42, 0.06);
          text-decoration: none !important;
          color: inherit;
          transition: border-color 140ms ease, box-shadow 140ms ease, transform 120ms ease;
        }

        .company-row:hover {
          border-color: #0f7f99;
          box-shadow: 0 10px 26px rgba(15, 23, 42, 0.1);
          transform: translateY(-1px);
          color: inherit;
        }

        .company-logo {
          width: 58px;
          height: 58px;
          border-radius: 8px;
          background: #eef3f9;
          border: 1px solid #dbe5ef;
          color: #042c53;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          font-weight: 900;
          letter-spacing: -0.04em;
        }

        .company-main {
          min-width: 0;
        }

        .company-topline {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 9px;
        }

        .company-topline h2 {
          margin: 0;
          color: #042c53;
          font-size: 23px;
          line-height: 1.25;
          font-weight: 900;
          letter-spacing: -0.03em;
        }

        .verified-badge,
        .featured-badge {
          display: inline-flex;
          align-items: center;
          min-height: 24px;
          padding: 4px 10px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .verified-badge {
          background: #e6fbff;
          color: #08758a;
          border: 1px solid #bff3fb;
        }

        .featured-badge {
          background: #fff7e6;
          color: #9a5b08;
          border: 1px solid #f1deb3;
        }

        .company-location {
          margin-top: 9px;
          color: #5b6472;
          font-size: 16px;
          font-weight: 650;
          line-height: 1.5;
        }

        .company-summary {
          margin-top: 18px;
          padding-top: 18px;
          border-top: 1px dashed #d7dde5;
          color: #334155;
          font-size: 16px;
          line-height: 1.55;
        }

        .company-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 18px;
        }

        .company-tags span {
          display: inline-flex;
          align-items: center;
          min-height: 32px;
          padding: 7px 12px;
          border-radius: 6px;
          background: #f3f4f6;
          color: #374151;
          font-size: 13px;
          font-weight: 800;
        }

        .company-action {
          display: flex;
          align-items: flex-start;
          justify-content: flex-end;
          min-width: 138px;
        }

        .view-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 46px;
          padding: 0 22px;
          border-radius: 999px;
          background: #0f7f99;
          color: #ffffff;
          font-size: 15px;
          font-weight: 900;
          white-space: nowrap;
          box-shadow: inset 0 -2px 0 rgba(4, 44, 83, 0.25);
        }

        .company-row:hover .view-button {
          background: #042c53;
        }

        .co-empty {
          border-radius: 12px;
          background: #ffffff;
          border: 1px solid #e5e7eb;
        }

        .co-disclaimer {
          margin: 24px 0 0;
          color: #64748b;
          font-size: 13px;
          line-height: 1.6;
        }

        .co-alert-wrap {
          margin-top: 34px;
        }

        @media (max-width: 860px) {
          .dice-search-row {
            grid-template-columns: 1fr;
          }

          .dice-sort {
            width: 100%;
          }

          .dice-sort button {
            flex: 1;
          }

          .company-row {
            grid-template-columns: 58px minmax(0, 1fr);
          }

          .company-action {
            grid-column: 1 / -1;
            justify-content: flex-start;
          }
        }

        @media (max-width: 560px) {
          .dice-search-shell {
            padding: 16px;
          }

          .dice-search-box {
            min-height: 58px;
          }

          .dice-search-box input {
            font-size: 15px;
          }

          .company-row {
            padding: 22px 18px;
            gap: 14px;
          }

          .company-topline h2 {
            font-size: 19px;
          }

          .company-location,
          .company-summary {
            font-size: 14px;
          }
        }
      `}</style>
    </>
  );
}