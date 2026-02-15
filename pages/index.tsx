import Head from "next/head";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Head>
        <title>MedicaidReady | Continuous Medicaid Compliance Monitoring (MD • VA • DC)</title>
        <meta
          name="description"
          content="Continuous Medicaid compliance monitoring and risk scoring for providers in Maryland, Virginia, and Washington, DC. Audit readiness. Escalation signals. Operational visibility."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="page">
        {/* Top Bar */}
        <header className="header">
          <div className="container headerInner">
            <div className="brand">
              <div className="mark" aria-hidden="true" />
              <div className="brandText">
                <div className="brandName">MedicaidReady</div>
                <div className="brandTag">MD • VA • DC</div>
              </div>
            </div>

            <nav className="nav">
              <Link className="navLink" href="/pricing">
                Pricing
              </Link>
              <Link className="navLink" href="/request-access">
                Request Access
              </Link>
              <Link className="navButton" href="/providers">
                Sign in
              </Link>
            </nav>
          </div>
        </header>

        {/* Hero */}
        <main className="main">
          <section className="hero">
            <div className="container heroGrid">
              <div>
                <div className="badge">
                  <span className="dot" aria-hidden="true" />
                  Continuous Compliance Monitoring
                </div>

                <h1 className="h1">
                  Continuous Medicaid compliance monitoring for providers in{" "}
                  <span className="em">Maryland, Virginia &amp; Washington, DC</span>.
                </h1>

                <p className="sub">
                  Track readiness, score risk, and surface escalation signals before audits and
                  corrective action plans force urgent response.
                </p>

                <div className="ctaRow">
                  <Link className="primary" href="/request-access">
                    Request early access
                  </Link>
                  <Link className="secondary" href="/pricing">
                    View pricing
                  </Link>
                </div>

                <div className="trustRow">
                  <div className="trustItem">
                    <div className="trustK">Risk scoring</div>
                    <div className="trustV">Monthly trend visibility</div>
                  </div>
                  <div className="trustItem">
                    <div className="trustK">Audit readiness</div>
                    <div className="trustV">Checklist + onboarding tracking</div>
                  </div>
                  <div className="trustItem">
                    <div className="trustK">Operational clarity</div>
                    <div className="trustV">Provider-level reporting</div>
                  </div>
                </div>
              </div>

              <div className="heroCard" role="region" aria-label="Platform preview">
                <div className="cardTop">
                  <div className="cardTitle">Compliance Overview</div>
                  <div className="pill">DMV Region</div>
                </div>

                <div className="cardGrid">
                  <div className="metric">
                    <div className="metricLabel">Providers monitored</div>
                    <div className="metricValue">—</div>
                    <div className="metricHint">Connected to your roster</div>
                  </div>
                  <div className="metric">
                    <div className="metricLabel">Risk level</div>
                    <div className="metricValue">—</div>
                    <div className="metricHint">Low • Medium • High</div>
                  </div>
                  <div className="metric">
                    <div className="metricLabel">Trend</div>
                    <div className="metricValue">—</div>
                    <div className="metricHint">Improving • Stable • Declining</div>
                  </div>
                  <div className="metric">
                    <div className="metricLabel">Escalation signals</div>
                    <div className="metricValue">—</div>
                    <div className="metricHint">Flags that require attention</div>
                  </div>
                </div>

                <div className="divider" />

                <div className="list">
                  <div className="listRow">
                    <div className="statusDot sHigh" aria-hidden="true" />
                    <div className="listText">
                      <div className="listTitle">High risk provider</div>
                      <div className="listSub">Declining trend detected</div>
                    </div>
                    <div className="listTag">Review</div>
                  </div>

                  <div className="listRow">
                    <div className="statusDot sMed" aria-hidden="true" />
                    <div className="listText">
                      <div className="listTitle">Medium risk provider</div>
                      <div className="listSub">Checklist in progress</div>
                    </div>
                    <div className="listTag">Track</div>
                  </div>

                  <div className="listRow">
                    <div className="statusDot sLow" aria-hidden="true" />
                    <div className="listText">
                      <div className="listTitle">Low risk provider</div>
                      <div className="listSub">Stable month-over-month</div>
                    </div>
                    <div className="listTag">OK</div>
                  </div>
                </div>

                <div className="cardFoot">
                  <div className="footNote">
                    Designed for small-to-mid providers that need continuous oversight without
                    enterprise compliance overhead.
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Problem */}
          <section className="section">
            <div className="container twoCol">
              <div>
                <h2 className="h2">The problem</h2>
                <p className="p">
                  Many Medicaid providers operate with compliance checks that are periodic, manual,
                  or reactive. That gap creates exposure: missed documentation, incomplete
                  onboarding, inconsistent training records, and late detection of declining
                  performance.
                </p>
                <p className="p">
                  When oversight arrives, the response becomes urgent—pulling staff away from
                  operations and increasing risk of escalation.
                </p>
              </div>

              <div className="panel">
                <div className="panelTitle">What MedicaidReady prevents</div>
                <ul className="bullets">
                  <li>Reactive “fire drill” audit preparation</li>
                  <li>Untracked onboarding and credentialing tasks</li>
                  <li>Silent performance decline across months</li>
                  <li>Unclear provider readiness status</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Solution */}
          <section className="section alt">
            <div className="container twoCol">
              <div className="panel">
                <div className="panelTitle">What the platform does</div>
                <ul className="bullets">
                  <li>Maintains a provider roster with status + timestamps</li>
                  <li>Tracks checklist and onboarding completion</li>
                  <li>Calculates compliance score history and trends</li>
                  <li>Flags declining trajectories and escalation risk</li>
                </ul>
              </div>

              <div>
                <h2 className="h2">The solution</h2>
                <p className="p">
                  MedicaidReady provides continuous compliance monitoring built for DMV-region
                  providers. The system is designed to make readiness measurable, trackable, and
                  reportable—without enterprise complexity.
                </p>

                <div className="callout">
                  <div className="calloutTitle">Regional focus</div>
                  <div className="calloutBody">
                    Maryland • Virginia • Washington, DC — built for organizations operating within
                    DMV oversight realities.
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* How it works */}
          <section className="section">
            <div className="container">
              <h2 className="h2">How it works</h2>
              <div className="steps">
                <div className="step">
                  <div className="stepNum">1</div>
                  <div className="stepTitle">Add providers</div>
                  <div className="stepBody">
                    Create and manage your provider roster with standardized metadata.
                  </div>
                </div>
                <div className="step">
                  <div className="stepNum">2</div>
                  <div className="stepTitle">Track readiness</div>
                  <div className="stepBody">
                    Monitor onboarding and checklist status across teams and time.
                  </div>
                </div>
                <div className="step">
                  <div className="stepNum">3</div>
                  <div className="stepTitle">Measure risk</div>
                  <div className="stepBody">
                    Review monthly score trends and prioritize high-risk providers first.
                  </div>
                </div>
              </div>

              <div className="centerCta">
                <Link className="primary" href="/request-access">
                  Request early access
                </Link>
              </div>
            </div>
          </section>

          {/* Who it's for */}
          <section className="section alt">
            <div className="container">
              <h2 className="h2">Who it’s for</h2>
              <div className="tiles">
                <div className="tile">
                  <div className="tileTitle">Home Health Agencies</div>
                  <div className="tileBody">Track readiness, training, and documentation status.</div>
                </div>
                <div className="tile">
                  <div className="tileTitle">Behavioral Health Providers</div>
                  <div className="tileBody">Monitor compliance signals and operational risk.</div>
                </div>
                <div className="tile">
                  <div className="tileTitle">DME Providers</div>
                  <div className="tileBody">Maintain provider-level visibility and audit posture.</div>
                </div>
                <div className="tile">
                  <div className="tileTitle">Small Group Practices</div>
                  <div className="tileBody">Get continuous oversight without enterprise tooling.</div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="cta">
            <div className="container ctaInner">
              <div>
                <div className="ctaTitle">Ready to operationalize compliance monitoring?</div>
                <div className="ctaSub">
                  Request early access for Maryland, Virginia, and Washington, DC provider
                  organizations.
                </div>
              </div>
              <div className="ctaButtons">
                <Link className="primary" href="/request-access">
                  Request access
                </Link>
                <Link className="secondary" href="/pricing">
                  Pricing
                </Link>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="footer">
          <div className="container footerInner">
            <div className="footerLeft">
              <div className="footerBrand">MedicaidReady</div>
              <div className="footerSmall">
                Continuous Medicaid compliance monitoring for MD • VA • DC.
              </div>
            </div>
            <div className="footerRight">
              <Link className="footerLink" href="/pricing">
                Pricing
              </Link>
              <Link className="footerLink" href="/request-access">
                Request access
              </Link>
              <Link className="footerLink" href="/providers">
                Sign in
              </Link>
            </div>
          </div>
        </footer>

        <style jsx>{`
          .page {
            min-height: 100vh;
            background: #ffffff;
            color: #0b1220;
          }
          .container {
            width: 100%;
            max-width: 1100px;
            margin: 0 auto;
            padding: 0 20px;
          }

          .header {
            position: sticky;
            top: 0;
            z-index: 50;
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(10px);
            border-bottom: 1px solid #e6e9ef;
          }
          .headerInner {
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 70px;
          }

          .brand {
            display: flex;
            align-items: center;
            gap: 12px;
          }
          .mark {
            width: 38px;
            height: 38px;
            border-radius: 10px;
            background: linear-gradient(135deg, #0b3a66, #0f6aa6);
          }
          .brandText {
            line-height: 1.1;
          }
          .brandName {
            font-weight: 750;
            letter-spacing: -0.02em;
          }
          .brandTag {
            font-size: 12px;
            color: #5b6576;
            margin-top: 3px;
          }

          .nav {
            display: flex;
            align-items: center;
            gap: 14px;
          }
          .navLink {
            color: #243044;
            text-decoration: none;
            font-size: 14px;
            padding: 8px 10px;
            border-radius: 10px;
          }
          .navLink:hover {
            background: #f3f5f9;
          }
          .navButton {
            text-decoration: none;
            font-size: 14px;
            padding: 10px 12px;
            border-radius: 12px;
            border: 1px solid #d7dce6;
            color: #0b1220;
            background: #fff;
          }
          .navButton:hover {
            background: #f7f9fc;
          }

          .main {
            display: block;
          }

          .hero {
            border-bottom: 1px solid #eef1f6;
            background: radial-gradient(
                900px 500px at 15% 10%,
                rgba(15, 106, 166, 0.12),
                transparent 55%
              ),
              radial-gradient(900px 500px at 85% 20%, rgba(11, 58, 102, 0.10), transparent 55%);
            padding: 52px 0 34px;
          }
          .heroGrid {
            display: grid;
            grid-template-columns: 1.15fr 0.85fr;
            gap: 28px;
            align-items: start;
          }

          .badge {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            padding: 10px 12px;
            border-radius: 999px;
            border: 1px solid #dbe2ee;
            background: rgba(255, 255, 255, 0.8);
            font-size: 13px;
            color: #243044;
          }
          .dot {
            width: 8px;
            height: 8px;
            border-radius: 999px;
            background: #0f6aa6;
          }

          .h1 {
            margin: 14px 0 10px;
            font-size: 42px;
            line-height: 1.1;
            letter-spacing: -0.03em;
          }
          .em {
            color: #0b3a66;
          }
          .sub {
            margin: 0 0 18px;
            color: #445065;
            font-size: 16px;
            line-height: 1.6;
            max-width: 640px;
          }

          .ctaRow {
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
            margin-bottom: 18px;
          }
          .primary {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 12px 14px;
            border-radius: 14px;
            text-decoration: none;
            background: #0b3a66;
            color: #fff;
            font-weight: 650;
            border: 1px solid #0b3a66;
            min-width: 180px;
          }
          .primary:hover {
            background: #0a345d;
          }
          .secondary {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 12px 14px;
            border-radius: 14px;
            text-decoration: none;
            background: #ffffff;
            color: #0b1220;
            font-weight: 650;
            border: 1px solid #d7dce6;
            min-width: 140px;
          }
          .secondary:hover {
            background: #f7f9fc;
          }

          .trustRow {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 10px;
            margin-top: 8px;
          }
          .trustItem {
            border: 1px solid #e6e9ef;
            border-radius: 14px;
            padding: 12px;
            background: rgba(255, 255, 255, 0.7);
          }
          .trustK {
            font-weight: 700;
            font-size: 13px;
            color: #0b1220;
          }
          .trustV {
            margin-top: 4px;
            font-size: 13px;
            color: #5b6576;
          }

          .heroCard {
            border: 1px solid #e6e9ef;
            border-radius: 18px;
            background: rgba(255, 255, 255, 0.92);
            box-shadow: 0 12px 28px rgba(11, 18, 32, 0.08);
            overflow: hidden;
          }
          .cardTop {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 14px 14px 10px;
            border-bottom: 1px solid #eef1f6;
          }
          .cardTitle {
            font-weight: 750;
            font-size: 14px;
          }
          .pill {
            font-size: 12px;
            color: #0b3a66;
            background: rgba(11, 58, 102, 0.08);
            border: 1px solid rgba(11, 58, 102, 0.18);
            padding: 6px 10px;
            border-radius: 999px;
          }
          .cardGrid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 10px;
            padding: 14px;
          }
          .metric {
            border: 1px solid #eef1f6;
            border-radius: 14px;
            padding: 12px;
            background: #ffffff;
          }
          .metricLabel {
            font-size: 12px;
            color: #5b6576;
          }
          .metricValue {
            margin-top: 6px;
            font-size: 22px;
            font-weight: 800;
            letter-spacing: -0.02em;
          }
          .metricHint {
            margin-top: 6px;
            font-size: 12px;
            color: #7a8597;
          }
          .divider {
            height: 1px;
            background: #eef1f6;
          }
          .list {
            padding: 12px 14px;
            display: grid;
            gap: 10px;
          }
          .listRow {
            display: grid;
            grid-template-columns: 14px 1fr auto;
            align-items: center;
            gap: 10px;
            border: 1px solid #eef1f6;
            border-radius: 14px;
            padding: 10px 12px;
            background: #fff;
          }
          .statusDot {
            width: 10px;
            height: 10px;
            border-radius: 999px;
          }
          .sHigh {
            background: #b42318;
          }
          .sMed {
            background: #b54708;
          }
          .sLow {
            background: #067647;
          }
          .listTitle {
            font-weight: 700;
            font-size: 13px;
          }
          .listSub {
            margin-top: 2px;
            font-size: 12px;
            color: #6b7688;
          }
          .listTag {
            font-size: 12px;
            font-weight: 700;
            color: #243044;
            background: #f3f5f9;
            border: 1px solid #e6e9ef;
            padding: 6px 10px;
            border-radius: 999px;
          }
          .cardFoot {
            padding: 0 14px 14px;
          }
          .footNote {
            font-size: 12px;
            color: #6b7688;
            line-height: 1.5;
          }

          .section {
            padding: 44px 0;
          }
          .alt {
            background: #f7f9fc;
            border-top: 1px solid #eef1f6;
            border-bottom: 1px solid #eef1f6;
          }
          .twoCol {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 24px;
            align-items: start;
          }
          .h2 {
            margin: 0 0 10px;
            font-size: 26px;
            letter-spacing: -0.02em;
          }
          .p {
            margin: 0 0 12px;
            color: #445065;
            line-height: 1.65;
          }

          .panel {
            border: 1px solid #e6e9ef;
            border-radius: 18px;
            background: #ffffff;
            padding: 16px;
          }
          .panelTitle {
            font-weight: 800;
            margin-bottom: 10px;
          }
          .bullets {
            margin: 0;
            padding-left: 18px;
            color: #445065;
            line-height: 1.7;
          }

          .callout {
            margin-top: 14px;
            border-left: 4px solid #0f6aa6;
            background: rgba(15, 106, 166, 0.08);
            border-radius: 14px;
            padding: 12px 14px;
          }
          .calloutTitle {
            font-weight: 800;
            margin-bottom: 4px;
          }
          .calloutBody {
            color: #445065;
            line-height: 1.6;
          }

          .steps {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 12px;
            margin-top: 14px;
          }
          .step {
            border: 1px solid #e6e9ef;
            border-radius: 18px;
            background: #ffffff;
            padding: 16px;
          }
          .stepNum {
            width: 34px;
            height: 34px;
            border-radius: 12px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-weight: 900;
            color: #0b3a66;
            background: rgba(11, 58, 102, 0.10);
            border: 1px solid rgba(11, 58, 102, 0.18);
          }
          .stepTitle {
            margin-top: 10px;
            font-weight: 850;
          }
          .stepBody {
            margin-top: 6px;
            color: #445065;
            line-height: 1.6;
          }
          .centerCta {
            margin-top: 18px;
            display: flex;
            justify-content: center;
          }

          .tiles {
            margin-top: 12px;
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 12px;
          }
          .tile {
            border: 1px solid #e6e9ef;
            border-radius: 18px;
            background: #ffffff;
            padding: 16px;
          }
          .tileTitle {
            font-weight: 850;
          }
          .tileBody {
            margin-top: 6px;
            color: #445065;
            line-height: 1.6;
            font-size: 14px;
          }

          .cta {
            padding: 34px 0;
            background: linear-gradient(135deg, #0b3a66, #0f6aa6);
            color: #fff;
          }
          .ctaInner {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 14px;
            flex-wrap: wrap;
          }
          .ctaTitle {
            font-size: 22px;
            font-weight: 900;
            letter-spacing: -0.02em;
          }
          .ctaSub {
            margin-top: 6px;
            color: rgba(255, 255, 255, 0.9);
            line-height: 1.6;
            max-width: 680px;
          }
          .ctaButtons {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
          }
          .ctaButtons :global(.primary) {
            background: #ffffff;
            color: #0b3a66;
            border-color: rgba(255, 255, 255, 0.65);
          }
          .ctaButtons :global(.primary:hover) {
            background: rgba(255, 255, 255, 0.92);
          }
          .ctaButtons :global(.secondary) {
            background: transparent;
            color: #fff;
            border-color: rgba(255, 255, 255, 0.45);
          }
          .ctaButtons :global(.secondary:hover) {
            background: rgba(255, 255, 255, 0.10);
          }

          .footer {
            border-top: 1px solid #eef1f6;
            padding: 22px 0;
            background: #ffffff;
          }
          .footerInner {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            flex-wrap: wrap;
          }
          .footerBrand {
            font-weight: 900;
            letter-spacing: -0.02em;
          }
          .footerSmall {
            margin-top: 6px;
            color: #6b7688;
            font-size: 13px;
            line-height: 1.5;
          }
          .footerRight {
            display: flex;
            align-items: center;
            gap: 14px;
          }
          .footerLink {
            color: #243044;
            text-decoration: none;
            font-size: 14px;
            padding: 8px 10px;
            border-radius: 10px;
          }
          .footerLink:hover {
            background: #f3f5f9;
          }

          @media (max-width: 980px) {
            .heroGrid {
              grid-template-columns: 1fr;
            }
            .trustRow {
              grid-template-columns: 1fr;
            }
            .twoCol {
              grid-template-columns: 1fr;
            }
            .steps {
              grid-template-columns: 1fr;
            }
            .tiles {
              grid-template-columns: 1fr;
            }
            .h1 {
              font-size: 36px;
            }
          }

          @media (max-width: 640px) {
            .navLink {
              display: none;
            }
            .h1 {
              font-size: 32px;
            }
          }
        `}</style>
      </div>
    </>
  );
}
