import Head from "next/head";
import Link from "next/link";
import type { GetStaticPaths, GetStaticProps } from "next";
import CareersShell from "../../../components/careers/CareersShell";
import {
  SAMPLE_JOBS,
  getJobById,
  type CareersJob,
} from "../../../lib/careers/sampleJobs";

type Props = { job: CareersJob };

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: SAMPLE_JOBS.map((j) => ({ params: { id: j.id } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps<Props, { id: string }> = async (ctx) => {
  const id = ctx.params?.id ?? "";
  const job = getJobById(id);
  if (!job) return { notFound: true };
  return { props: { job } };
};

function handleApply() {
  if (typeof window !== "undefined") {
    window.alert(
      "Applications are not yet enabled. This is a Phase 1 preview — applying will open in a future release."
    );
  }
}

export default function JobDetail({ job }: Props) {
  return (
    <>
      <Head>
        <title>
          {job.title} — {job.company} | MedicaidReady Careers
        </title>
        <meta name="description" content={job.summary} />
        <meta name="robots" content="noindex" />
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
                <button
                  type="button"
                  className="careers-btn-primary"
                  onClick={handleApply}
                >
                  Apply for this role
                </button>
                <Link href="/careers/jobs" className="careers-btn-ghost">
                  View other openings
                </Link>
              </div>
            </div>

            <div className="careers-detail-section">
              <h3>About the role</h3>
              <p>{job.description}</p>
            </div>

            <div className="careers-detail-section">
              <h3>What you&apos;ll do</h3>
              <ul>
                {job.responsibilities.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>

            <div className="careers-detail-section">
              <h3>Requirements</h3>
              <ul>
                {job.requirements.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>

            {job.benefits.length > 0 && (
              <div className="careers-detail-section">
                <h3>Benefits</h3>
                <ul>
                  {job.benefits.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      </CareersShell>
    </>
  );
}
