import Head from "next/head";
import Link from "next/link";
import type { GetStaticProps } from "next";
import CareersShell from "../../components/careers/CareersShell";

const SITE_URL = "https://www.medicaidready.org";

type Props = {
  pricingDisplay: {
    standard: string;
    featured: string;
  };
};

export const getStaticProps: GetStaticProps<Props> = async () => ({
  props: {
    pricingDisplay: {
      standard:
        process.env.STRIPE_CAREERS_STANDARD_DISPLAY ?? "$99 per 30-day listing",
      featured:
        process.env.STRIPE_CAREERS_FEATURED_DISPLAY ?? "$249 per 30-day featured listing",
    },
  },
  revalidate: 300,
});

const NICHE = [
  "Medicaid",
  "Medicare",
  "ACA / marketplace",
  "Eligibility & enrollment",
  "Compliance & regulatory",
  "Care management",
  "Analytics & data",
  "Healthcare operations",
];

export default function CareersEmployers({ pricingDisplay }: Props) {
  const url = `${SITE_URL}/careers/employers`;
  const metaTitle = "Post Medicaid Jobs — Employer Pricing | MedicaidReady Careers";
  const metaDescription =
    "Post Medicaid, Medicare, and ACA roles to a niche audience that already works in eligibility, compliance, care management, and analytics. Manual approval, plain pricing.";

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
            <div className="careers-eyebrow">For employers</div>
            <h1 className="careers-h1">Hire candidates who already speak Medicaid.</h1>
            <p className="careers-lead">
              Reach eligibility specialists, compliance analysts, billing coordinators,
              policy associates, and care managers — without the noise of a generic job
              board.
            </p>
            <div className="careers-actions">
              <Link href="/careers/post-a-job" className="careers-btn-primary">
                Post a job
              </Link>
              <Link href="/careers/jobs" className="careers-btn-ghost">
                See current listings
              </Link>
            </div>
          </div>
        </section>

        <section
          className="careers-section-tight"
          style={{
            background: "#ffffff",
            borderTop: "1px solid #e2e8f0",
            borderBottom: "1px solid #e2e8f0",
          }}
        >
          <div className="careers-container">
            <div className="careers-eyebrow">Pricing</div>
            <h2 className="careers-h2">Plain, predictable pricing.</h2>
            <div className="emp-pricing-grid">
              <div className="emp-tier">
                <div className="emp-tier-name">Free</div>
                <div className="emp-tier-price">No charge</div>
                <div className="emp-tier-period">Standard placement</div>
                <ul className="emp-tier-list">
                  <li>Reviewed and approved by our team</li>
                  <li>Goes live within a few business days</li>
                  <li>Listed on the main jobs board</li>
                  <li>Shown on matching SEO category pages</li>
                </ul>
                <Link href="/careers/post-a-job" className="emp-tier-cta">
                  Post for free
                </Link>
              </div>

              <div className="emp-tier emp-tier-standard">
                <div className="emp-tier-name">Standard</div>
                <div className="emp-tier-price">{pricingDisplay.standard}</div>
                <div className="emp-tier-period">30-day listing</div>
                <ul className="emp-tier-list">
                  <li>Faster review queue</li>
                  <li>Standard placement on the main board</li>
                  <li>Shown on matching SEO category pages</li>
                  <li>Final amount confirmed at checkout</li>
                </ul>
                <Link href="/careers/post-a-job" className="emp-tier-cta emp-tier-cta-primary">
                  Post a Standard role
                </Link>
              </div>

              <div className="emp-tier emp-tier-featured">
                <div className="emp-tier-badge">Most visibility</div>
                <div className="emp-tier-name">Featured</div>
                <div className="emp-tier-price">{pricingDisplay.featured}</div>
                <div className="emp-tier-period">30-day featured listing</div>
                <ul className="emp-tier-list">
                  <li>Top placement on the main board</li>
                  <li>Top placement on category pages</li>
                  <li>Highlighted styling on listings</li>
                  <li>Final amount confirmed at checkout</li>
                </ul>
                <Link href="/careers/post-a-job" className="emp-tier-cta emp-tier-cta-primary">
                  Post a Featured role
                </Link>
              </div>
            </div>

            <div className="emp-founding">
              <div className="emp-founding-eyebrow">Founding employer</div>
              <div className="emp-founding-title">
                Founding employer pricing — for teams hiring multiple roles
              </div>
              <p className="emp-founding-body">
                If you&apos;re posting more than 3 Medicaid roles in the next quarter,
                email{" "}
                <a href="mailto:careers@medicaidready.org">careers@medicaidready.org</a>{" "}
                and we&apos;ll set up a founding-employer rate. Locked-in pricing for the
                first year, priority review, and a placement on the employers section of
                MedicaidReady Careers.
              </p>
            </div>
          </div>
        </section>

        <section className="careers-section">
          <div className="careers-container">
            <div className="careers-eyebrow">How it works</div>
            <h2 className="careers-h2">Manual approval, every time.</h2>
            <p className="careers-lead">
              We don&apos;t auto-publish. Every listing — paid or free — is reviewed by a
              human before going live. Quality over quantity is the whole point of a niche
              board.
            </p>
            <div className="emp-steps">
              <div className="emp-step">
                <div className="emp-step-num">01</div>
                <div className="emp-step-title">You submit</div>
                <div className="emp-step-body">
                  Fill out the post-a-job form. Pick free, standard, or featured. Pay if
                  you chose a paid tier.
                </div>
              </div>
              <div className="emp-step">
                <div className="emp-step-num">02</div>
                <div className="emp-step-title">We review</div>
                <div className="emp-step-body">
                  Our team checks the role is genuinely Medicaid-adjacent and the apply
                  link works. We may email you to clarify.
                </div>
              </div>
              <div className="emp-step">
                <div className="emp-step-num">03</div>
                <div className="emp-step-title">It goes live</div>
                <div className="emp-step-body">
                  Approved listings appear on the main jobs board, all matching category
                  pages, and our search index. Apply links open on your careers site.
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          className="careers-section-tight"
          style={{
            background: "#ffffff",
            borderTop: "1px solid #e2e8f0",
            borderBottom: "1px solid #e2e8f0",
          }}
        >
          <div className="careers-container">
            <div className="careers-eyebrow">Niche focus</div>
            <h2 className="careers-h2">Built for the Medicaid ecosystem.</h2>
            <p className="careers-lead">
              MedicaidReady Careers is intentionally narrow. We post and promote roles in:
            </p>
            <div className="emp-niche">
              {NICHE.map((n) => (
                <span key={n} className="emp-niche-pill">
                  {n}
                </span>
              ))}
            </div>
            <p
              className="careers-lead"
              style={{ marginTop: 18, fontSize: 15, color: "#64748b" }}
            >
              If your role isn&apos;t in this space, we&apos;ll let you know — and refund
              the listing fee in full.
            </p>
          </div>
        </section>

        <section className="careers-section">
          <div className="careers-container">
            <h2 className="careers-h2">Ready to hire?</h2>
            <p className="careers-lead">Submit your role and we&apos;ll take it from there.</p>
            <div className="careers-actions">
              <Link href="/careers/post-a-job" className="careers-btn-primary">
                Post a job
              </Link>
              <Link href="/careers/jobs" className="careers-btn-ghost">
                See current listings
              </Link>
            </div>
          </div>
        </section>
      </CareersShell>

      <style jsx>{`
        .emp-pricing-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-top: 24px;
        }
        .emp-tier {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.05);
          position: relative;
        }
        .emp-tier-standard {
          border-color: #93c5fd;
        }
        .emp-tier-featured {
          border: 2px solid #0a3d6b;
          background: linear-gradient(180deg, #ffffff 0%, #f0f7ff 100%);
        }
        .emp-tier-badge {
          position: absolute;
          top: -10px;
          right: 16px;
          background: #0a3d6b;
          color: #ffffff;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 999px;
        }
        .emp-tier-name {
          font-size: 16px;
          font-weight: 700;
          color: #0f172a;
          letter-spacing: -0.01em;
        }
        .emp-tier-price {
          font-size: 22px;
          font-weight: 700;
          color: #0a3d6b;
          letter-spacing: -0.02em;
        }
        .emp-tier-period {
          font-size: 12px;
          color: #64748b;
          margin: 0 0 8px;
        }
        .emp-tier-list {
          margin: 0;
          padding-left: 18px;
          font-size: 13px;
          color: #334155;
          line-height: 1.7;
          flex: 1;
        }
        .emp-tier-cta {
          margin-top: 16px;
          display: inline-block;
          padding: 10px 16px;
          border-radius: 10px;
          background: #ffffff;
          color: #0a3d6b;
          border: 1px solid #cbd5e1;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          text-align: center;
        }
        .emp-tier-cta-primary {
          background: #0a3d6b;
          color: #ffffff;
          border-color: #072d52;
        }
        .emp-founding {
          margin-top: 32px;
          padding: 22px 24px;
          background: #f8fafc;
          border: 1px dashed #cbd5e1;
          border-radius: 14px;
        }
        .emp-founding-eyebrow {
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #1565c0;
          margin: 0 0 6px;
        }
        .emp-founding-title {
          font-size: 16px;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 8px;
          letter-spacing: -0.01em;
        }
        .emp-founding-body {
          font-size: 14px;
          color: #475569;
          line-height: 1.7;
          margin: 0;
        }
        .emp-steps {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-top: 24px;
        }
        .emp-step {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 22px 24px;
        }
        .emp-step-num {
          font-size: 12px;
          font-weight: 700;
          color: #1565c0;
          letter-spacing: 0.06em;
          margin-bottom: 10px;
        }
        .emp-step-title {
          font-size: 15px;
          font-weight: 700;
          color: #0f172a;
          letter-spacing: -0.01em;
          margin-bottom: 6px;
        }
        .emp-step-body {
          font-size: 14px;
          color: #475569;
          line-height: 1.65;
        }
        .emp-niche {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 16px;
        }
        .emp-niche-pill {
          display: inline-flex;
          align-items: center;
          padding: 6px 12px;
          border-radius: 999px;
          background: #eff6ff;
          color: #1d4ed8;
          font-size: 13px;
          font-weight: 500;
          border: 1px solid #bfdbfe;
        }
        @media (max-width: 880px) {
          .emp-pricing-grid {
            grid-template-columns: 1fr;
          }
          .emp-steps {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
