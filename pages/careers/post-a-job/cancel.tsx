import Head from "next/head";
import Link from "next/link";
import CareersShell from "../../../components/careers/CareersShell";

export default function PostAJobCancel() {
  return (
    <>
      <Head>
        <title>Payment cancelled — MedicaidReady Careers</title>
        <meta name="robots" content="noindex" />
      </Head>

      <CareersShell>
        <section className="careers-section">
          <div className="careers-container" style={{ maxWidth: 640 }}>
            <div className="careers-eyebrow">Payment cancelled</div>
            <h1 className="careers-h1">No charge made.</h1>
            <p className="careers-lead">
              We saved your job draft, but it has not been published yet — payment was
              cancelled before it completed. You can resubmit at any time, or pick the
              free tier.
            </p>
            <div className="careers-actions">
              <Link href="/careers/post-a-job" className="careers-btn-primary">
                Try again
              </Link>
              <Link href="/careers/employers" className="careers-btn-ghost">
                See pricing
              </Link>
            </div>
          </div>
        </section>
      </CareersShell>
    </>
  );
}
