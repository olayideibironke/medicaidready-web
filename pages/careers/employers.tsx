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
        process.env.STRIPE_CAREERS_STANDARD_DISPLAY ?? "$149 per 30-day listing",
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

const STANDARD_INCLUDES = [
  "Featured placement on the main board",
  "Listed on matching SEO category pages",
  "Verified employer checkmark",
  "Priority review queue",
  "30 days of active visibility",
  "Apply link routes to your careers site",
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
        <section className="careers-section emp-hero-section">
          <div className="careers-container">
            <div className="emp-split">
              {/* LEFT: Pitch */}
              <div className="emp-left">
                <div className="careers-eyebrow">For employers</div>
                <h1 className="careers-h1">
                  Hire candidates who already speak Medicaid.
                </h1>
                <p className="careers-lead">
                  Reach eligibility specialists, compliance analysts, billing coordinators,
                  policy associates, and care managers — without the noise of a generic job
                  board.
                </p>

                <div className="emp-trust">
                  <div className="emp-trust-item">
                    <span className="emp-trust-icon" aria-hidden="true">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M2 7l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                    Manual approval, every time
                  </div>
                  <div className="emp-trust-item">
                    <span className="emp-trust-icon" aria-hidden="true">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M2 7l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                    Niche Medicaid-only audience
                  </div>
                  <div className="emp-trust-item">
                    <span className="emp-trust-icon" aria-hidden="true">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M2 7l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                    Verified employer badge included
                  </div>
                </div>

                <div className="emp-niche-block">
                  <div className="emp-niche-label">We post and promote roles in:</div>
                  <div className="emp-niche">
                    {NICHE.map((n) => (
                      <span key={n} className="emp-niche-pill">
                        {n}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT: Pricing card */}
              <div className="emp-right">
                <div className="emp-card">
                  <span className="emp-card-badge">Most popular</span>
                  <div className="emp-card-header">
                    <div className="emp-card-title">Single Job Post</div>
                    <div className="emp-card-sub">Standard placement, 30 days</div>
                  </div>

                  <div className="emp-card-price">
                    <span className="emp-card-price-amount">$149</span>
                    <span className="emp-card-price-period">/ job post</span>
                  </div>
                  <div className="emp-card-price-note">30-day listing · One-time payment</div>

                  <div className="emp-card-rule" />

                  <ul className="emp-card-list">
                    {STANDARD_INCLUDES.map((item) => (
                      <li key={item} className="emp-card-item">
                        <span className="emp-card-check" aria-hidden="true">
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path d="M1.5 5l2 2 4-5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>

                  <Link href="/careers/post-a-job" className="emp-card-cta">
                    Post a Job
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>

                  <div className="emp-card-foot">
                    Or post for free — manual review, may take a few business days.{" "}
                    <Link href="/careers/post-a-job" className="emp-card-foot-link">
                      Free option →
                    </Link>
                  </div>
                </div>

                <div className="emp-tiers">
                  <div className="emp-tier-row">
                    <div className="emp-tier-row-name">Free</div>
                    <div className="emp-tier-row-price">$0</div>
                  </div>
                  <div className="emp-tier-row emp-tier-row-active">
                    <div className="emp-tier-row-name">
                      Single Post <span className="emp-tier-row-tag">Most popular</span>
                    </div>
                    <div className="emp-tier-row-price">$149</div>
                  </div>
                  <div className="emp-tier-row">
                    <div className="emp-tier-row-name">
                      Featured
                      <span className="emp-tier-row-tag emp-tier-row-tag-gold">Top placement</span>
                    </div>
                    <div className="emp-tier-row-price">{pricingDisplay.featured.split(" ")[0]}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          className="careers-section"
          style={{
            background: "#ffffff",
            borderTop: "1px solid #e2e8f0",
            borderBottom: "1px solid #e2e8f0",
          }}
        >
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
                  Fill out the post-a-job form. Pick free, standard ($149), or featured. Pay
                  if you chose a paid tier.
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

        <section className="careers-section">
          <div className="careers-container">
            <div className="emp-founding">
              <div className="emp-founding-eyebrow">Founding employer</div>
              <div className="emp-founding-title">
                Hiring 3+ Medicaid roles this quarter? Get locked-in pricing.
              </div>
              <p className="emp-founding-body">
                Email{" "}
                <a href="mailto:careers@medicaidready.org">careers@medicaidready.org</a>{" "}
                and we&apos;ll set up a founding-employer rate: locked-in pricing for the
                first year, priority review, and a placement on the employers section of
                MedicaidReady Careers.
              </p>
            </div>

            <h2 className="careers-h2" style={{ marginTop: 40 }}>Ready to hire?</h2>
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
        .emp-hero-section {
          background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
        }
        .emp-split {
          display: grid;
          grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
          gap: 56px;
          align-items: start;
        }
        .emp-left {
          padding-top: 4px;
        }
        .emp-trust {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 28px;
          margin-bottom: 28px;
        }
        .emp-trust-item {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          font-weight: 500;
          color: #334155;
        }
        .emp-trust-icon {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          color: #15803d;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .emp-niche-block {
          margin-top: 8px;
        }
        .emp-niche-label {
          font-size: 13px;
          font-weight: 600;
          color: #475569;
          margin-bottom: 10px;
        }
        .emp-niche {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .emp-niche-pill {
          display: inline-flex;
          align-items: center;
          padding: 6px 12px;
          border-radius: 999px;
          background: #ffffff;
          color: #042C53;
          font-size: 13px;
          font-weight: 600;
          border: 1px solid #cbd5e1;
        }

        .emp-right {
          position: sticky;
          top: 88px;
        }
        .emp-card {
          position: relative;
          background: #ffffff;
          border: 2px solid #BA7517;
          border-radius: 18px;
          padding: 28px 26px 24px;
          box-shadow: 0 16px 40px rgba(4, 44, 83, 0.10), 0 4px 12px rgba(4, 44, 83, 0.06);
        }
        .emp-card-badge {
          position: absolute;
          top: -12px;
          left: 24px;
          padding: 5px 12px;
          border-radius: 999px;
          background: #BA7517;
          color: #ffffff;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .emp-card-header {
          margin-bottom: 18px;
        }
        .emp-card-title {
          font-size: 18px;
          font-weight: 700;
          color: #042C53;
          letter-spacing: -0.02em;
          margin-bottom: 4px;
        }
        .emp-card-sub {
          font-size: 13px;
          color: #64748b;
        }
        .emp-card-price {
          display: flex;
          align-items: baseline;
          gap: 8px;
        }
        .emp-card-price-amount {
          font-size: 56px;
          font-weight: 700;
          color: #042C53;
          letter-spacing: -0.04em;
          line-height: 1;
        }
        .emp-card-price-period {
          font-size: 15px;
          color: #64748b;
          font-weight: 500;
        }
        .emp-card-price-note {
          font-size: 12px;
          color: #94a3b8;
          margin-top: 6px;
        }
        .emp-card-rule {
          height: 1px;
          background: #f1f5f9;
          margin: 20px 0;
        }
        .emp-card-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 22px;
        }
        .emp-card-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 14px;
          color: #334155;
          line-height: 1.55;
        }
        .emp-card-check {
          width: 18px;
          height: 18px;
          min-width: 18px;
          border-radius: 50%;
          background: #fff7e6;
          border: 1px solid #f1deb3;
          color: #BA7517;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 1px;
        }
        .emp-card-cta {
          width: 100%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 15px 22px;
          border-radius: 12px;
          background: #042C53;
          color: #ffffff !important;
          font-size: 15px;
          font-weight: 700;
          border: 1px solid #021c38;
          box-shadow: 0 4px 16px rgba(4, 44, 83, 0.30), inset 0 -2px 0 0 #BA7517;
          text-decoration: none !important;
          transition: background 140ms, transform 100ms;
          margin-bottom: 14px;
        }
        .emp-card-cta:hover {
          background: #0C447C;
          transform: translateY(-1px);
        }
        .emp-card-foot {
          font-size: 12px;
          color: #64748b;
          text-align: center;
          line-height: 1.5;
        }
        .emp-card-foot-link {
          color: #042C53;
          font-weight: 600;
          text-decoration: none;
          white-space: nowrap;
        }
        .emp-card-foot-link:hover {
          color: #BA7517;
        }

        .emp-tiers {
          margin-top: 16px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 4px;
        }
        .emp-tier-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          padding: 11px 14px;
          border-radius: 10px;
        }
        .emp-tier-row-active {
          background: #fff7e6;
          border: 1px solid #f1deb3;
        }
        .emp-tier-row-name {
          font-size: 14px;
          font-weight: 600;
          color: #042C53;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .emp-tier-row-tag {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 2px 7px;
          border-radius: 999px;
          background: #eff6ff;
          color: #1d4ed8;
        }
        .emp-tier-row-tag-gold {
          background: #fff7e6;
          color: #BA7517;
        }
        .emp-tier-row-price {
          font-size: 14px;
          font-weight: 700;
          color: #042C53;
        }

        .emp-founding {
          padding: 22px 24px;
          background: #f8fafc;
          border: 1px dashed #cbd5e1;
          border-left: 4px solid #BA7517;
          border-radius: 14px;
        }
        .emp-founding-eyebrow {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #BA7517;
          margin: 0 0 6px;
        }
        .emp-founding-title {
          font-size: 17px;
          font-weight: 700;
          color: #042C53;
          margin: 0 0 8px;
          letter-spacing: -0.01em;
        }
        .emp-founding-body {
          font-size: 14px;
          color: #475569;
          line-height: 1.7;
          margin: 0;
        }
        .emp-founding-body a {
          color: #042C53;
          font-weight: 600;
          text-decoration: underline;
        }
        .emp-founding-body a:hover { color: #BA7517; }

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
          font-weight: 800;
          color: #BA7517;
          letter-spacing: 0.08em;
          margin-bottom: 10px;
        }
        .emp-step-title {
          font-size: 15px;
          font-weight: 700;
          color: #042C53;
          letter-spacing: -0.01em;
          margin-bottom: 6px;
        }
        .emp-step-body {
          font-size: 14px;
          color: #475569;
          line-height: 1.65;
        }

        @media (max-width: 960px) {
          .emp-split {
            grid-template-columns: 1fr;
            gap: 32px;
          }
          .emp-right {
            position: static;
          }
          .emp-steps {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
