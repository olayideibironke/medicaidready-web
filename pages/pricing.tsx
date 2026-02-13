// pages/pricing.tsx
import Head from "next/head";
import Link from "next/link";

export default function PricingPage() {
  return (
    <>
      <Head>
        <title>Pricing | MedicaidReady</title>
        <meta
          name="description"
          content="Pricing for MedicaidReady — continuous Medicaid compliance monitoring for providers in Maryland, Virginia & Washington DC."
        />
      </Head>

      <div className="page">
        <header className="header">
          <div className="brand">
            <div className="mark" aria-hidden="true" />
            <div className="brandText">
              <div className="brandName">MedicaidReady</div>
              <div className="brandTag">Continuous Compliance Monitoring — DMV</div>
            </div>
          </div>

          <nav className="nav">
            <Link className="navLink" href="/">
              Home
            </Link>
            <Link className="navLink" href="/request-access">
              Request Access
            </Link>
            <Link className="navLink" href="/providers">
              Dashboard
            </Link>
          </nav>
        </header>

        <main className="main">
          <section className="hero">
            <div className="heroInner">
              <h1 className="headline">Pricing built for provider compliance teams.</h1>
              <p className="subhead">
                MedicaidReady provides continuous Medicaid compliance monitoring for providers in Maryland, Virginia,
                and Washington DC — designed for clinical leadership, compliance, and operations.
              </p>

              <div className="ctaRow">
                <Link className="buttonPrimary" href="/request-access">
                  Request Access
                </Link>
                <Link className="buttonSecondary" href="/providers">
                  View Dashboard
                </Link>
              </div>

              <div className="trustRow">
                <div className="trustItem">DMV focus (MD • VA • DC)</div>
                <div className="trustDot" aria-hidden="true" />
                <div className="trustItem">No ads</div>
                <div className="trustDot" aria-hidden="true" />
                <div className="trustItem">Clinical, audit-ready presentation</div>
              </div>
            </div>
          </section>

          <section className="grid">
            <div className="card">
              <div className="planHeader">
                <div className="planName">DMV Pilot</div>
                <div className="planPrice">
                  <span className="price">$149</span>
                  <span className="per">/month</span>
                </div>
                <div className="planDesc">For a single organization monitoring across one DMV jurisdiction.</div>
              </div>

              <ul className="list">
                <li>Provider risk scoring & trend</li>
                <li>Issue indicators & change detection</li>
                <li>Dashboard access for internal review</li>
                <li>Monthly data refresh cadence</li>
                <li>Email-based onboarding support</li>
              </ul>

              <div className="cardFooter">
                <Link className="buttonPrimary full" href="/request-access">
                  Request Access
                </Link>
                <div className="fine">
                  Access is credentialed. We validate organization details before enabling dashboard login.
                </div>
              </div>
            </div>

            <div className="card featured">
              <div className="badge">Recommended</div>

              <div className="planHeader">
                <div className="planName">DMV Professional</div>
                <div className="planPrice">
                  <span className="price">$299</span>
                  <span className="per">/month</span>
                </div>
                <div className="planDesc">For compliance teams monitoring multiple provider locations or services.</div>
              </div>

              <ul className="list">
                <li>Everything in DMV Pilot</li>
                <li>Expanded monitoring scope (multi-location)</li>
                <li>Operational summary views for leadership</li>
                <li>Priority onboarding support</li>
                <li>Quarterly review call (by request)</li>
              </ul>

              <div className="cardFooter">
                <Link className="buttonPrimary full" href="/request-access">
                  Request Access
                </Link>
                <div className="fine">
                  No Stripe checkout yet. Access requests are collected and approved before billing is activated.
                </div>
              </div>
            </div>

            <div className="card">
              <div className="planHeader">
                <div className="planName">Enterprise</div>
                <div className="planPrice">
                  <span className="price">Custom</span>
                </div>
                <div className="planDesc">For networks, holding companies, and cross-jurisdiction operations.</div>
              </div>

              <ul className="list">
                <li>Multi-state roadmap planning (DMV-first)</li>
                <li>Custom reporting requirements</li>
                <li>Dedicated rollout & change management</li>
                <li>Internal stakeholder enablement</li>
                <li>Compliance documentation support</li>
              </ul>

              <div className="cardFooter">
                <Link className="buttonSecondary full" href="/request-access">
                  Request Access
                </Link>
                <div className="fine">We’ll confirm scope and respond with an onboarding plan.</div>
              </div>
            </div>
          </section>

          <section className="faq">
            <div className="faqCard">
              <h2 className="faqTitle">What happens after I request access?</h2>
              <div className="faqBody">
                Your submission is stored securely and reviewed for DMV scope alignment and provider legitimacy. If
                approved, you receive credentialed access to the dashboard.
              </div>
            </div>

            <div className="faqCard">
              <h2 className="faqTitle">Do you offer a free trial?</h2>
              <div className="faqBody">
                We currently onboard via credentialed access requests. Trial availability is evaluated during onboarding
                based on organization type and monitoring scope.
              </div>
            </div>

            <div className="faqCard">
              <h2 className="faqTitle">Is billing enabled today?</h2>
              <div className="faqBody">
                Not yet. This phase is revenue frontend completion. Stripe integration will be added after access flow
                and pricing are finalized.
              </div>
            </div>
          </section>

          <footer className="footer">
            <div className="footerInner">
              <div className="footerBrand">
                <div className="footerName">MedicaidReady</div>
                <div className="footerTag">Continuous Medicaid Compliance Monitoring — DMV</div>
              </div>

              <div className="footerLinks">
                <Link className="footerLink" href="/request-access">
                  Request Access
                </Link>
                <Link className="footerLink" href="/providers">
                  Dashboard
                </Link>
              </div>
            </div>
          </footer>
        </main>
      </div>

      <style jsx>{`
        .page {
          min-height: 100vh;
          background: #f6f8fb;
          color: #0b1f3a;
        }

        .header {
          max-width: 1040px;
          margin: 0 auto;
          padding: 22px 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .mark {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: #0b2a4a;
          box-shadow: 0 1px 0 rgba(0, 0, 0, 0.06);
        }

        .brandText {
          display: flex;
          flex-direction: column;
          line-height: 1.1;
        }

        .brandName {
          font-weight: 800;
          letter-spacing: 0.2px;
        }

        .brandTag {
          font-size: 12px;
          color: rgba(11, 31, 58, 0.72);
          margin-top: 2px;
        }

        .nav {
          display: flex;
          gap: 14px;
        }

        .navLink {
          font-size: 14px;
          color: rgba(11, 31, 58, 0.82);
          text-decoration: none;
          padding: 8px 10px;
          border-radius: 10px;
        }

        .navLink:hover {
          background: rgba(11, 31, 58, 0.06);
        }

        .main {
          max-width: 1040px;
          margin: 0 auto;
          padding: 10px 18px 44px;
        }

        .hero {
          background: linear-gradient(180deg, rgba(11, 42, 74, 0.05), rgba(11, 42, 74, 0));
          border: 1px solid rgba(11, 31, 58, 0.10);
          border-radius: 18px;
          padding: 28px;
          box-shadow: 0 10px 22px rgba(11, 31, 58, 0.06);
        }

        .heroInner {
          max-width: 820px;
        }

        .headline {
          margin: 0;
          font-size: 30px;
          letter-spacing: 0.2px;
        }

        .subhead {
          margin: 10px 0 0;
          font-size: 15px;
          color: rgba(11, 31, 58, 0.78);
          line-height: 1.6;
        }

        .ctaRow {
          margin-top: 18px;
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .buttonPrimary {
          height: 42px;
          border-radius: 12px;
          border: 1px solid rgba(11, 31, 58, 0.12);
          background: #0b2a4a;
          color: #ffffff;
          font-weight: 800;
          padding: 0 14px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
        }

        .buttonSecondary {
          height: 42px;
          border-radius: 12px;
          border: 1px solid rgba(11, 31, 58, 0.16);
          background: #ffffff;
          color: #0b2a4a;
          font-weight: 800;
          padding: 0 14px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
        }

        .full {
          width: 100%;
        }

        .trustRow {
          margin-top: 16px;
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
          font-size: 12px;
          color: rgba(11, 31, 58, 0.70);
        }

        .trustDot {
          width: 4px;
          height: 4px;
          border-radius: 999px;
          background: rgba(11, 31, 58, 0.30);
        }

        .grid {
          margin-top: 18px;
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 14px;
        }

        .card {
          background: #ffffff;
          border: 1px solid rgba(11, 31, 58, 0.12);
          border-radius: 16px;
          box-shadow: 0 8px 18px rgba(11, 31, 58, 0.06);
          padding: 18px;
          position: relative;
        }

        .featured {
          border-color: rgba(11, 42, 74, 0.28);
          box-shadow: 0 10px 22px rgba(11, 42, 74, 0.10);
        }

        .badge {
          position: absolute;
          top: 14px;
          right: 14px;
          font-size: 12px;
          font-weight: 800;
          color: #0b2a4a;
          background: rgba(11, 42, 74, 0.08);
          border: 1px solid rgba(11, 42, 74, 0.16);
          padding: 6px 10px;
          border-radius: 999px;
        }

        .planHeader {
          padding-bottom: 14px;
          border-bottom: 1px solid rgba(11, 31, 58, 0.08);
          margin-bottom: 14px;
        }

        .planName {
          font-weight: 900;
          letter-spacing: 0.2px;
        }

        .planPrice {
          margin-top: 10px;
          display: flex;
          align-items: baseline;
          gap: 6px;
        }

        .price {
          font-size: 28px;
          font-weight: 900;
        }

        .per {
          font-size: 13px;
          color: rgba(11, 31, 58, 0.70);
          font-weight: 700;
        }

        .planDesc {
          margin-top: 8px;
          font-size: 13px;
          color: rgba(11, 31, 58, 0.75);
          line-height: 1.5;
        }

        .list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
          font-size: 13px;
          color: rgba(11, 31, 58, 0.80);
        }

        .list li {
          padding-left: 14px;
          position: relative;
        }

        .list li:before {
          content: "";
          position: absolute;
          left: 0;
          top: 8px;
          width: 6px;
          height: 6px;
          border-radius: 999px;
          background: rgba(11, 42, 74, 0.55);
        }

        .cardFooter {
          margin-top: 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .fine {
          font-size: 12px;
          color: rgba(11, 31, 58, 0.65);
          line-height: 1.5;
        }

        .faq {
          margin-top: 16px;
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 14px;
        }

        .faqCard {
          background: #ffffff;
          border: 1px solid rgba(11, 31, 58, 0.12);
          border-radius: 16px;
          box-shadow: 0 8px 18px rgba(11, 31, 58, 0.06);
          padding: 18px;
        }

        .faqTitle {
          margin: 0;
          font-size: 14px;
          font-weight: 900;
          letter-spacing: 0.2px;
        }

        .faqBody {
          margin-top: 8px;
          font-size: 13px;
          color: rgba(11, 31, 58, 0.76);
          line-height: 1.6;
        }

        .footer {
          margin-top: 18px;
        }

        .footerInner {
          background: #ffffff;
          border: 1px solid rgba(11, 31, 58, 0.12);
          border-radius: 16px;
          padding: 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 8px 18px rgba(11, 31, 58, 0.06);
        }

        .footerName {
          font-weight: 900;
        }

        .footerTag {
          margin-top: 4px;
          font-size: 12px;
          color: rgba(11, 31, 58, 0.70);
        }

        .footerLinks {
          display: flex;
          gap: 14px;
        }

        .footerLink {
          font-size: 14px;
          color: rgba(11, 31, 58, 0.82);
          text-decoration: none;
          padding: 8px 10px;
          border-radius: 10px;
        }

        .footerLink:hover {
          background: rgba(11, 31, 58, 0.06);
        }

        @media (max-width: 980px) {
          .grid {
            grid-template-columns: 1fr;
          }
          .faq {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
