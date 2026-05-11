import Head from "next/head";
import Link from "next/link";
import type { GetStaticProps } from "next";
import { useMemo, useState } from "react";
import CareersShell from "../../components/careers/CareersShell";
import { listApprovedJobs } from "../../lib/careers/db";
import type { CareersJob, CareersJobMode } from "../../lib/careers/sampleJobs";

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

export default function CareersJobs({ jobs }: Props) {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<ModeFilter>("any");

  const filtered = useMemo<CareersJob[]>(() => {
    const q = query.trim().toLowerCase();
    return jobs.filter((j) => {
      if (mode !== "any" && j.remote !== mode) return false;
      if (!q) return true;
      const haystack = `${j.title} ${j.company} ${j.location} ${j.summary}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [query, mode, jobs]);

  return (
    <>
      <Head>
        <title>Find Jobs — MedicaidReady Careers</title>
        <meta
          name="description"
          content="Browse open Medicaid roles: eligibility, compliance, billing, care management, and policy."
        />
        <meta name="robots" content="noindex" />
      </Head>

      <CareersShell>
        <section className="careers-section">
          <div className="careers-container">
            <div className="careers-eyebrow">Find jobs</div>
            <h1 className="careers-h1">Open roles in the Medicaid space</h1>
            <p className="careers-lead">
              {jobs.length} {jobs.length === 1 ? "role" : "roles"} currently listed.
            </p>

            <div className="careers-jobs-toolbar" style={{ marginTop: 32, marginBottom: 24 }}>
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
                {filtered.map((job) => (
                  <Link
                    key={job.id}
                    href={`/careers/jobs/${job.id}`}
                    className="careers-job-card"
                  >
                    <h2 className="careers-job-title">{job.title}</h2>
                    <p className="careers-job-company">
                      {job.company} &middot; {job.location}
                    </p>
                    <div className="careers-job-meta">
                      <span className="careers-pill careers-pill-blue">{job.type}</span>
                      <span className="careers-pill">{job.remote}</span>
                      {job.salary && (
                        <span className="careers-pill careers-pill-green">{job.salary}</span>
                      )}
                    </div>
                    <p className="careers-job-summary">{job.summary}</p>
                    <div className="careers-job-posted">{formatPostedAt(job.postedAt)}</div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </CareersShell>
    </>
  );
}
