import Head from "next/head";
import Link from "next/link";
import type { GetStaticProps } from "next";
import { useEffect, useMemo, useState } from "react";
import CareersShell from "../../components/careers/CareersShell";
import SaveJobButton from "../../components/careers/SaveJobButton";
import { getSavedJobRecords } from "../../lib/careers/applyReadyStorage";
import { listApprovedJobs } from "../../lib/careers/db";
import type { CareersJob } from "../../lib/careers/sampleJobs";

const SITE_URL = "https://www.medicaidready.org";
const PAGE_PATH = "/careers/saved-jobs";
const CANONICAL_URL = `${SITE_URL}${PAGE_PATH}`;

type Props = {
  jobs: CareersJob[];
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const jobs = await listApprovedJobs();

  return {
    props: {
      jobs,
    },
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

export default function SavedJobsPage({ jobs }: Props) {
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => {
      setSavedIds(getSavedJobRecords().map((record) => record.jobId));
      setReady(true);
    };

    sync();

    window.addEventListener("storage", sync);
    window.addEventListener("applyready:saved-jobs-updated", sync);

    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("applyready:saved-jobs-updated", sync);
    };
  }, []);

  const savedJobs = useMemo(() => {
    const jobMap = new Map(jobs.map((job) => [job.id, job]));

    return savedIds
      .map((jobId) => jobMap.get(jobId))
      .filter((job): job is CareersJob => Boolean(job));
  }, [jobs, savedIds]);

  const metaTitle = "Saved Jobs | ApplyReady | MedicaidReady Careers";
  const metaDescription =
    "Review jobs saved with ApplyReady and continue preparing your application materials before applying through official employer sites.";

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={CANONICAL_URL} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={CANONICAL_URL} />
        <meta property="og:site_name" content="MedicaidReady Careers" />
      </Head>

      <CareersShell>
        <main className="sj-page">
          <section className="sj-hero">
            <div className="sj-hero-glow" />
            <div className="careers-container sj-hero-inner">
              <div className="sj-breadcrumbs">
                <Link href="/careers">Careers</Link>
                <span>/</span>
                <Link href="/careers/applyready">ApplyReady</Link>
                <span>/</span>
                <span>Saved Jobs</span>
              </div>

              <div className="sj-hero-grid">
                <div>
                  <p className="sj-eyebrow">ApplyReady Saved Jobs</p>
                  <h1>Keep the roles you want to review in one place.</h1>
                  <p>
                    Save jobs while you search, return to them later, and use ApplyReady to
                    build a stronger application plan before you apply through the employer’s
                    official site.
                  </p>

                  <div className="sj-actions">
                    <Link href="/careers/jobs" className="sj-primary">
                      Browse Jobs
                    </Link>
                    <Link href="/careers/applyready" className="sj-secondary">
                      Explore ApplyReady
                    </Link>
                  </div>
                </div>

                <aside className="sj-panel">
                  <span>Saved roles</span>
                  <strong>{ready ? savedJobs.length : "0"}</strong>
                  <p>Jobs saved in this browser for your ApplyReady workflow.</p>
                </aside>
              </div>
            </div>
          </section>

          <section className="careers-section">
            <div className="careers-container">
              <div className="sj-section-head">
                <div>
                  <p className="sj-eyebrow sj-eyebrow-dark">Your list</p>
                  <h2>Saved jobs</h2>
                </div>
                <Link href="/careers/jobs">Find more jobs</Link>
              </div>

              {!ready ? (
                <div className="sj-empty">
                  <h3>Loading saved jobs.</h3>
                  <p>Your saved jobs will appear here in a moment.</p>
                </div>
              ) : savedJobs.length === 0 ? (
                <div className="sj-empty">
                  <h3>No saved jobs yet.</h3>
                  <p>
                    Start browsing verified roles and save the jobs you want to review later.
                    This is the first ApplyReady foundation before accounts and resume tools.
                  </p>
                  <Link href="/careers/jobs" className="sj-empty-btn">
                    Browse Jobs
                  </Link>
                </div>
              ) : (
                <div className="sj-list">
                  {savedJobs.map((job) => (
                    <article className="sj-card" key={job.id}>
                      <div className="sj-card-main">
                        <div className="sj-card-top">
                          <div>
                            <h3>
                              <Link href={`/careers/jobs/${job.id}`}>{job.title}</Link>
                            </h3>
                            <p>
                              {job.company} · {job.location}
                            </p>
                          </div>

                          <SaveJobButton jobId={job.id} />
                        </div>

                        <div className="sj-pills">
                          <span>{job.type}</span>
                          <span>{job.remote}</span>
                          {job.salary && <span>{job.salary}</span>}
                        </div>

                        {job.summary && <p className="sj-summary">{job.summary}</p>}

                        <div className="sj-foot">
                          <span>{formatPostedAt(job.postedAt)}</span>
                          <div className="sj-foot-actions">
                            <Link href={`/careers/jobs/${job.id}`} className="sj-outline">
                              View details
                            </Link>
                            <Link href="/careers/applyready" className="sj-prepare">
                              Prepare with ApplyReady
                            </Link>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </section>
        </main>
      </CareersShell>

      <style jsx global>{`
        .sj-page {
          background: #f8fafc;
          color: #0f172a;
        }

        .sj-hero {
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(circle at 18% 20%, rgba(239, 159, 39, 0.22), transparent 28%),
            radial-gradient(circle at 86% 18%, rgba(133, 183, 235, 0.2), transparent 34%),
            linear-gradient(135deg, #061b3a 0%, #07335f 58%, #0c447c 100%);
          color: #ffffff;
        }

        .sj-hero-glow {
          position: absolute;
          right: -180px;
          bottom: -220px;
          width: 520px;
          height: 520px;
          border-radius: 999px;
          background: rgba(133, 183, 235, 0.18);
          filter: blur(10px);
          pointer-events: none;
        }

        .sj-hero-inner {
          position: relative;
          padding-top: 46px;
          padding-bottom: 66px;
        }

        .sj-breadcrumbs {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          align-items: center;
          margin-bottom: 34px;
          color: rgba(255, 255, 255, 0.68);
          font-size: 13px;
          font-weight: 850;
        }

        .sj-breadcrumbs a {
          color: rgba(255, 255, 255, 0.84);
          text-decoration: none;
        }

        .sj-breadcrumbs a:hover {
          color: #f5b942;
        }

        .sj-hero-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 340px;
          gap: 34px;
          align-items: center;
        }

        .sj-eyebrow {
          margin: 0;
          color: #f5b942;
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .sj-eyebrow-dark {
          color: #0c447c;
        }

        .sj-hero h1 {
          max-width: 860px;
          margin: 14px 0 0;
          color: #ffffff;
          font-size: clamp(42px, 6vw, 76px);
          line-height: 0.96;
          letter-spacing: -0.06em;
          font-weight: 950;
        }

        .sj-hero p {
          max-width: 760px;
          margin: 24px 0 0;
          color: rgba(255, 255, 255, 0.78);
          font-size: 18px;
          line-height: 1.72;
        }

        .sj-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 30px;
        }

        .sj-primary,
        .sj-secondary,
        .sj-empty-btn,
        .sj-outline,
        .sj-prepare {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          font-weight: 950;
          text-decoration: none;
          transition:
            transform 140ms ease,
            background 140ms ease,
            border-color 140ms ease,
            color 140ms ease;
        }

        .sj-primary {
          background: #f5b942;
          color: #061b3a;
          padding: 13px 21px;
          font-size: 14px;
        }

        .sj-primary:hover {
          background: #ffd978;
          transform: translateY(-1px);
        }

        .sj-secondary {
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.22);
          padding: 13px 21px;
          font-size: 14px;
        }

        .sj-secondary:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-1px);
        }

        .sj-panel {
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 28px;
          background: rgba(255, 255, 255, 0.08);
          padding: 26px;
          box-shadow: 0 28px 70px rgba(0, 0, 0, 0.28);
          backdrop-filter: blur(18px);
        }

        .sj-panel span {
          display: block;
          color: #f5b942;
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .sj-panel strong {
          display: block;
          margin-top: 16px;
          color: #ffffff;
          font-size: 64px;
          line-height: 1;
          font-weight: 950;
          letter-spacing: -0.06em;
        }

        .sj-panel p {
          margin: 12px 0 0;
          color: rgba(255, 255, 255, 0.72);
          font-size: 14px;
          line-height: 1.6;
        }

        .sj-section-head {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          align-items: flex-end;
          margin-bottom: 24px;
        }

        .sj-section-head h2 {
          margin: 8px 0 0;
          color: #061b3a;
          font-size: clamp(32px, 4vw, 48px);
          line-height: 1.05;
          letter-spacing: -0.045em;
          font-weight: 950;
        }

        .sj-section-head a {
          color: #ba7517;
          font-size: 14px;
          font-weight: 950;
          text-decoration: none;
          white-space: nowrap;
        }

        .sj-empty {
          border: 1px solid #dbe5f0;
          border-radius: 26px;
          background: #ffffff;
          padding: 34px;
          box-shadow: 0 14px 34px rgba(4, 44, 83, 0.06);
        }

        .sj-empty h3 {
          margin: 0;
          color: #042c53;
          font-size: 24px;
          font-weight: 950;
          letter-spacing: -0.035em;
        }

        .sj-empty p {
          max-width: 720px;
          margin: 10px 0 0;
          color: #64748b;
          line-height: 1.7;
        }

        .sj-empty-btn {
          margin-top: 18px;
          background: #042c53;
          color: #ffffff;
          padding: 12px 18px;
          font-size: 14px;
          box-shadow: inset 0 -2px 0 #ba7517;
        }

        .sj-empty-btn:hover {
          background: #0c447c;
          transform: translateY(-1px);
        }

        .sj-list {
          display: grid;
          gap: 14px;
        }

        .sj-card {
          border: 1px solid #dbe5f0;
          border-radius: 24px;
          background: #ffffff;
          padding: 20px;
          box-shadow: 0 14px 34px rgba(4, 44, 83, 0.06);
        }

        .sj-card-top {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          align-items: flex-start;
        }

        .sj-card h3 {
          margin: 0;
          color: #042c53;
          font-size: 20px;
          font-weight: 950;
          letter-spacing: -0.03em;
          line-height: 1.2;
        }

        .sj-card h3 a {
          color: inherit;
          text-decoration: none;
        }

        .sj-card h3 a:hover {
          color: #0c447c;
        }

        .sj-card-top p {
          margin: 7px 0 0;
          color: #64748b;
          font-size: 13px;
          font-weight: 800;
        }

        .sj-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 14px;
        }

        .sj-pills span {
          border: 1px solid #e2e8f0;
          border-radius: 999px;
          background: #f8fafc;
          color: #334155;
          padding: 6px 10px;
          font-size: 12px;
          font-weight: 850;
        }

        .sj-summary {
          margin: 14px 0 0;
          color: #475569;
          line-height: 1.7;
          font-size: 14px;
        }

        .sj-foot {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          align-items: center;
          margin-top: 16px;
          color: #64748b;
          font-size: 13px;
          font-weight: 750;
        }

        .sj-foot-actions {
          display: inline-flex;
          flex-wrap: wrap;
          gap: 8px;
          align-items: center;
        }

        .sj-outline {
          border: 1px solid #cbd5e1;
          color: #334155;
          background: #ffffff;
          padding: 9px 14px;
          font-size: 13px;
        }

        .sj-outline:hover {
          color: #ba7517;
          border-color: #ba7517;
        }

        .sj-prepare {
          background: #042c53;
          color: #ffffff;
          padding: 10px 15px;
          font-size: 13px;
          box-shadow: inset 0 -2px 0 #ba7517;
        }

        .sj-prepare:hover {
          background: #0c447c;
          transform: translateY(-1px);
        }

        @media (max-width: 900px) {
          .sj-hero-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 680px) {
          .sj-hero h1 {
            font-size: clamp(40px, 13vw, 58px);
          }

          .sj-section-head,
          .sj-card-top,
          .sj-foot {
            flex-direction: column;
            align-items: flex-start;
          }

          .sj-panel,
          .sj-empty,
          .sj-card {
            border-radius: 22px;
          }
        }
      `}</style>
    </>
  );
}