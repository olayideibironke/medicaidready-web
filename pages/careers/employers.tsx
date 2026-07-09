import Head from "next/head";
import Link from "next/link";
import type { GetStaticProps } from "next";
import CareersShell from "../../components/careers/CareersShell";
import { CAREERS_CATEGORY_DEFS } from "../../lib/careers/categories";

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

const ROLE_TRACKS = CAREERS_CATEGORY_DEFS.map((category) => category.label);

const STANDARD_INCLUDES = [
  "Featured placement on the main job board",
  "Listed on relevant role and category pages",
  "Verified employer checkmark",
  "Priority review queue",
  "30 days of active visibility",
  "Apply link routes to your careers site",
];

const TRUST_ITEMS = [
  "Manual approval before publishing",
  "Verified employer and apply links",
  "Built for focused career discovery",
];

function getPriceAmount(display: string): string {
  const match = display.match(/\$\d+/);
  return match?.[0] ?? "$149";
}

export default function CareersEmployers({ pricingDisplay }: Props) {
  const url = `${SITE_URL}/careers/employers`;
  const standardPrice = getPriceAmount(pricingDisplay.standard);
  const featuredPrice = getPriceAmount(pricingDisplay.featured);

  const metaTitle = "Post Jobs and Reach Career-Ready Candidates | MedicaidReady Careers";
  const metaDescription =
    "Post jobs across technology, data, cybersecurity, cloud, healthcare, public sector, operations, compliance, analytics, and care workforce roles on MedicaidReady Careers.";

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
        <meta property="og:site_name" content="MedicaidReady Careers" />
      </Head>

      <CareersShell>
        <section className="careers-section emp-hero-section">
          <div className="careers-container">
            <div className="emp-split">
              <div className="emp-left">
                <div className="careers-eyebrow">For employers</div>
                <h1 className="careers-h1">
                  Hire candidates across the roles today&apos;s teams need.
                </h1>
                <p className="careers-lead">
                  Reach job seekers across technology, data, cybersecurity, cloud,
                  healthcare, public sector, operations, compliance, analytics, and care
                  workforce roles. MedicaidReady Careers gives employers a focused place
                  to publish verified openings and send candidates directly to the
                  official apply link.
                </p>

                <div className="emp-trust">
                  {TRUST_ITEMS.map((item) => (
                    <div className="emp-trust-item" key={item}>
                      <span className="emp-trust-icon" aria-hidden="true">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path
                            d="M2 7l3 3 7-7"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                      {item}
                    </div>
                  ))}
                </div>

                <div className="emp-role-block">
                  <div className="emp-role-label">We post and promote roles across:</div>
                  <div className="emp-role-grid">
                    {ROLE_TRACKS.map((role) => (
                      <Link
                        key={role}
                        href={`/careers/jobs?category=${encodeURIComponent(role)}`}
                        className="emp-role-pill"
                      >
                        {role}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <div className="emp-right">
                <div className="emp-card">
                  <span className="emp-card-badge">Most popular</span>
                  <div className="emp-card-header">
                    <div className="emp-card-title">Single Job Post</div>
                    <div className="emp-card-sub">Standard placement, 30 days</div>
                  </div>

                  <div className="emp-card-price">
                    <span className="emp-card-price-amount">{standardPrice}</span>
                    <span className="emp-card-price-period">/ job post</span>
                  </div>
                  <div className="emp-card-price-note">30-day listing · One-time payment</div>

                  <div className="emp-card-rule" />

                  <ul className="emp-card-list">
                    {STANDARD_INCLUDES.map((item) => (
                      <li key={item} className="emp-card-item">
                        <span className="emp-card-check" aria-hidden="true">
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path
                              d="M1.5 5l2 2 4-5"
                              stroke="currentColor"
                              strokeWidth="1.75"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>

                  <Link href="/careers/post-a-job" className="emp-card-cta">
                    Post a Job
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path
                        d="M3 7h8M7 3l4 4-4 4"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Link>

                  <div className="emp-card-foot">
                    Free posting is available with manual review. Paid listings receive
                    priority review and stronger placement.
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
                    <div className="emp-tier-row-price">{standardPrice}</div>
                  </div>
                  <div className="emp-tier-row">
                    <div className="emp-tier-row-name">
                      Featured
                      <span className="emp-tier-row-tag emp-tier-row-tag-gold">Top placement</span>
                    </div>
                    <div className="emp-tier-row-price">{featuredPrice}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="emp-how-section">
          <div className="careers-container">
            <div className="careers-eyebrow">How it works</div>
            <h2 className="careers-h2">Quality review before every listing goes live.</h2>
            <p className="careers-lead">
              MedicaidReady Careers does not auto-publish job posts. Every listing is
              reviewed for clear role details, employer identity, apply link quality, and
              fit with the career tracks represented on the platform.
            </p>

            <div className="emp-steps">
              <div className="emp-step">
                <div className="emp-step-num">01</div>
                <div className="emp-step-title">You submit the role</div>
                <div className="emp-step-body">
                  Share the job title, company, location, work setting, category, salary
                  details if available, and the official apply link.
                </div>
              </div>
              <div className="emp-step">
                <div className="emp-step-num">02</div>
                <div className="emp-step-title">We review for quality</div>
                <div className="emp-step-body">
                  We check that the post is clear, the employer link is usable, and the
                  opening fits the platform&apos;s career categories.
                </div>
              </div>
              <div className="emp-step">
                <div className="emp-step-num">03</div>
                <div className="emp-step-title">The listing goes live</div>
                <div className="emp-step-body">
                  Approved jobs appear on the main job board, relevant category pages,
                  search results, and hiring intelligence sections where appropriate.
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="careers-section">
          <div className="careers-container">
            <div className="emp-standard">
              <div>
                <div className="emp-standard-eyebrow">Platform standard</div>
                <h2>Built for verified career discovery.</h2>
                <p>
                  MedicaidReady Careers is expanding into a broader job intelligence
                  platform while keeping a strong quality filter. Employers can reach
                  candidates in healthcare, technology, data, government, operations, and
                  care-focused roles without losing the trust and clarity of a curated board.
                </p>
              </div>

              <div className="emp-standard-points">
                <div>
                  <strong>Verified apply paths</strong>
                  <span>Send candidates to your official employer or recruiting page.</span>
                </div>
                <div>
                  <strong>Role-based discovery</strong>
                  <span>Listings can appear in matching career tracks and search pages.</span>
                </div>
                <div>
                  <strong>Hiring intelligence</strong>
                  <span>Selected categories may appear in reports and market summaries.</span>
                </div>
              </div>
            </div>

            <div className="emp-founding">
              <div className="emp-founding-eyebrow">Employer partnerships</div>
              <div className="emp-founding-title">
                Hiring multiple roles or building a recurring hiring pipeline?
              </div>
              <p className="emp-founding-body">
                Email{" "}
                <a href="mailto:careers@medicaidready.org">careers@medicaidready.org</a>{" "}
                to discuss employer visibility, recurring postings, featured placement,
                and partnership options across MedicaidReady Careers.
              </p>
            </div>

            <h2 className="careers-h2 emp-ready-title">Ready to hire?</h2>
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

      <style jsx global>{`
        .emp-hero-section {
          background:
            radial-gradient(circle at 14% 18%, rgba(186, 117, 23, 0.11), transparent 28%),
            linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
        }

        .emp-split {
          display: grid;
          grid-template-columns: minmax(0, 1.08fr) minmax(360px, 0.92fr);
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
          margin-top: 30px;
          margin-bottom: 30px;
        }

        .emp-trust-item {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-size: 15px;
          font-weight: 750;
          color: #334155;
        }

        .emp-trust-icon {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          color: #15803d;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .emp-role-block {
          margin-top: 10px;
          border: 1px solid #dbe5f0;
          border-radius: 24px;
          background:
            radial-gradient(circle at top left, rgba(239, 159, 39, 0.12), transparent 30%),
            #ffffff;
          padding: 20px;
          box-shadow: 0 14px 34px rgba(4, 44, 83, 0.06);
        }

        .emp-role-label {
          font-size: 13px;
          font-weight: 950;
          color: #042c53;
          margin-bottom: 14px;
          letter-spacing: 0.02em;
        }

        .emp-role-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .emp-role-pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 38px;
          padding: 9px 14px;
          border-radius: 999px;
          background: #f8fafc;
          color: #042c53;
          font-size: 13px;
          font-weight: 900;
          border: 1px solid #cfdced;
          text-decoration: none;
          box-shadow: 0 8px 18px rgba(4, 44, 83, 0.04);
          transition:
            transform 140ms ease,
            border-color 140ms ease,
            background 140ms ease,
            color 140ms ease;
        }

        .emp-role-pill:hover {
          transform: translateY(-1px);
          border-color: #ba7517;
          background: #fff7e6;
          color: #ba7517;
        }

        .emp-right {
          position: sticky;
          top: 88px;
        }

        .emp-card {
          position: relative;
          background: #ffffff;
          border: 2px solid #ba7517;
          border-radius: 22px;
          padding: 30px 28px 24px;
          box-shadow: 0 18px 46px rgba(4, 44, 83, 0.11), 0 5px 14px rgba(4, 44, 83, 0.06);
        }

        .emp-card-badge {
          position: absolute;
          top: -14px;
          left: 24px;
          padding: 6px 14px;
          border-radius: 999px;
          background: #ba7517;
          color: #ffffff;
          font-size: 11px;
          font-weight: 950;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .emp-card-header {
          margin-bottom: 18px;
        }

        .emp-card-title {
          font-size: 20px;
          font-weight: 950;
          color: #042c53;
          letter-spacing: -0.02em;
          margin-bottom: 4px;
        }

        .emp-card-sub {
          font-size: 14px;
          color: #64748b;
        }

        .emp-card-price {
          display: flex;
          align-items: baseline;
          gap: 8px;
        }

        .emp-card-price-amount {
          font-size: 58px;
          font-weight: 950;
          color: #042c53;
          letter-spacing: -0.05em;
          line-height: 1;
        }

        .emp-card-price-period {
          font-size: 15px;
          color: #64748b;
          font-weight: 650;
        }

        .emp-card-price-note {
          font-size: 12px;
          color: #94a3b8;
          margin-top: 6px;
          font-weight: 750;
        }

        .emp-card-rule {
          height: 1px;
          background: #f1f5f9;
          margin: 22px 0;
        }

        .emp-card-list {
          list-style: none;
          margin: 0 0 24px;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 11px;
        }

        .emp-card-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 14px;
          color: #334155;
          line-height: 1.55;
          font-weight: 700;
        }

        .emp-card-check {
          width: 19px;
          height: 19px;
          min-width: 19px;
          border-radius: 50%;
          background: #fff7e6;
          border: 1px solid #f1deb3;
          color: #ba7517;
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
          border-radius: 13px;
          background: #042c53;
          color: #ffffff !important;
          font-size: 15px;
          font-weight: 950;
          border: 1px solid #021c38;
          box-shadow: 0 6px 18px rgba(4, 44, 83, 0.3), inset 0 -2px 0 0 #ba7517;
          text-decoration: none !important;
          transition:
            background 140ms,
            transform 100ms;
          margin-bottom: 14px;
        }

        .emp-card-cta:hover {
          background: #0c447c;
          transform: translateY(-1px);
        }

        .emp-card-foot {
          font-size: 12px;
          color: #64748b;
          text-align: center;
          line-height: 1.55;
          font-weight: 650;
        }

        .emp-tiers {
          margin-top: 16px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 5px;
          box-shadow: 0 10px 28px rgba(4, 44, 83, 0.05);
        }

        .emp-tier-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          padding: 12px 14px;
          border-radius: 12px;
        }

        .emp-tier-row-active {
          background: #fff7e6;
          border: 1px solid #f1deb3;
        }

        .emp-tier-row-name {
          font-size: 14px;
          font-weight: 850;
          color: #042c53;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .emp-tier-row-tag {
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 2px 7px;
          border-radius: 999px;
          background: #eff6ff;
          color: #1d4ed8;
        }

        .emp-tier-row-tag-gold {
          background: #fff7e6;
          color: #ba7517;
        }

        .emp-tier-row-price {
          font-size: 14px;
          font-weight: 950;
          color: #042c53;
        }

        .emp-how-section {
          background: #ffffff;
          border-top: 1px solid #e2e8f0;
          border-bottom: 1px solid #e2e8f0;
          padding: 56px 0;
        }

        .emp-steps {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
          margin-top: 26px;
        }

        .emp-step {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 18px;
          padding: 24px;
          box-shadow: 0 12px 30px rgba(4, 44, 83, 0.05);
        }

        .emp-step-num {
          font-size: 12px;
          font-weight: 950;
          color: #ba7517;
          letter-spacing: 0.1em;
          margin-bottom: 10px;
        }

        .emp-step-title {
          font-size: 16px;
          font-weight: 950;
          color: #042c53;
          letter-spacing: -0.01em;
          margin-bottom: 7px;
        }

        .emp-step-body {
          font-size: 14px;
          color: #475569;
          line-height: 1.7;
        }

        .emp-standard {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 380px;
          gap: 28px;
          align-items: center;
          border-radius: 28px;
          background:
            radial-gradient(circle at top right, rgba(239, 159, 39, 0.16), transparent 30%),
            linear-gradient(135deg, #041f3d 0%, #07335f 56%, #0c447c 100%);
          color: #ffffff;
          padding: 34px;
          box-shadow: 0 22px 54px rgba(4, 44, 83, 0.18);
          margin-bottom: 24px;
        }

        .emp-standard-eyebrow {
          color: #ef9f27;
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .emp-standard h2 {
          margin: 10px 0 0;
          font-size: clamp(30px, 4vw, 46px);
          line-height: 1.05;
          letter-spacing: -0.045em;
          font-weight: 950;
        }

        .emp-standard p {
          max-width: 700px;
          margin: 16px 0 0;
          color: rgba(255, 255, 255, 0.78);
          line-height: 1.75;
          font-size: 15px;
        }

        .emp-standard-points {
          display: grid;
          gap: 10px;
        }

        .emp-standard-points div {
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.08);
          padding: 14px;
        }

        .emp-standard-points strong {
          display: block;
          color: #ffffff;
          font-size: 14px;
          font-weight: 950;
        }

        .emp-standard-points span {
          display: block;
          margin-top: 5px;
          color: rgba(255, 255, 255, 0.72);
          font-size: 13px;
          line-height: 1.55;
          font-weight: 650;
        }

        .emp-founding {
          padding: 24px;
          background: #f8fafc;
          border: 1px dashed #cbd5e1;
          border-left: 4px solid #ba7517;
          border-radius: 18px;
        }

        .emp-founding-eyebrow {
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #ba7517;
          margin: 0 0 6px;
        }

        .emp-founding-title {
          font-size: 18px;
          font-weight: 950;
          color: #042c53;
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
          color: #042c53;
          font-weight: 850;
          text-decoration: underline;
        }

        .emp-founding-body a:hover {
          color: #ba7517;
        }

        .emp-ready-title {
          margin-top: 40px;
        }

        @media (max-width: 980px) {
          .emp-split,
          .emp-standard {
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

        @media (max-width: 680px) {
          .emp-card-price-amount {
            font-size: 46px;
          }

          .emp-role-block,
          .emp-card,
          .emp-standard {
            border-radius: 22px;
          }

          .emp-standard {
            padding: 26px 18px;
          }
        }
      `}</style>
    </>
  );
}