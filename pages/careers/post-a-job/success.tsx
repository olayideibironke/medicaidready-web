import Head from "next/head";
import Link from "next/link";
import CareersShell from "../../../components/careers/CareersShell";

export default function PostAJobSuccess() {
  return (
    <>
      <Head>
        <title>Payment received — MedicaidReady Careers</title>
        <meta name="robots" content="noindex" />
      </Head>

      <CareersShell>
        <section className="careers-section">
          <div className="careers-container" style={{ maxWidth: 640 }}>
            <div className="careers-eyebrow">Payment received</div>
            <h1 className="careers-h1">Thanks — your listing is paid.</h1>
            <p className="careers-lead">
              Your role is now <strong>paid</strong> and waiting for our team to approve
              and publish it. Featured tier roles get top placement on the main jobs board
              and on relevant category pages.
            </p>
            <p className="careers-lead" style={{ marginTop: 16 }}>
              We&apos;ll email the contact address on the submission once the listing is live.
              No further action needed from you.
            </p>
            <div className="careers-actions">
              <Link href="/careers/jobs" className="careers-btn-primary">
                See current listings
              </Link>
              <Link href="/careers/employers" className="careers-btn-ghost">
                Pricing &amp; FAQ
              </Link>
            </div>
          </div>
        </section>
      </CareersShell>
    </>
  );
}
