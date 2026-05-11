import Head from "next/head";
import Link from "next/link";
import type { GetStaticPaths, GetStaticProps } from "next";
import CareersShell from "../../../components/careers/CareersShell";
import { getApprovedJobBySlug, listApprovedJobSlugs } from "../../../lib/careers/db";
import type { CareersJob } from "../../../lib/careers/sampleJobs";

type Props = { job: CareersJob };

type JobWithApplyUrl = CareersJob & {
  applyUrl?: string | null;
  apply_url?: string | null;
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

function handleMissingApplyUrl() {
  if (typeof window !== "undefined") {
    window.alert("Application link is not available yet for this listing.");
  }
}

export default function JobDetail({ job }: Props) {
  const applyUrl = getApplyUrl(job);

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
    </>
  );
}