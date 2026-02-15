// pages/index.tsx
import Head from "next/head";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type HeroSlide = {
  badge: string;
  titleEmphasis: string;
  sub: string;
  highlights: { k: string; v: string }[];
  list: { level: "high" | "med" | "low"; title: string; sub: string; tag: string }[];
};

export default function Home() {
  const slides: HeroSlide[] = useMemo(
    () => [
      {
        badge: "Continuous Compliance Monitoring",
        titleEmphasis: "Maryland, Virginia & Washington, DC",
        sub:
          "Track readiness, score risk, and surface escalation signals before audits and corrective action plans force urgent response.",
        highlights: [
          { k: "Risk scoring", v: "Monthly trend visibility" },
          { k: "Audit readiness", v: "Checklist + onboarding tracking" },
          { k: "Operational clarity", v: "Provider-level reporting" },
        ],
        list: [
          { level: "high", title: "High risk provider", sub: "Declining trend detected", tag: "Review" },
          { level: "med", title: "Medium risk provider", sub: "Checklist in progress", tag: "Track" },
          { level: "low", title: "Low risk provider", sub: "Stable month-over-month", tag: "OK" },
        ],
      },
      {
        badge: "Audit Readiness + Checklist Tracking",
        titleEmphasis: "smaller provider teams",
        sub:
          "Replace manual check-ins with structured readiness tracking, due dates, and consistent status visibility across the roster.",
        highlights: [
          { k: "Checklists", v: "Assigned + tracked to completion" },
          { k: "Onboarding", v: "Credentialing + documentation" },
          { k: "Visibility", v: "Team-wide readiness posture" },
        ],
        list: [
          { level: "med", title: "Checklist overdue", sub: "Missing documentation item", tag: "Fix" },
          { level: "low", title: "Onboarding complete", sub: "Ready for review", tag: "OK" },
          { level: "high", title: "Escalation risk", sub: "Multiple late items detected", tag: "Review" },
        ],
      },
      {
        badge: "Risk + Trend Visibility",
        titleEmphasis: "early warning signals",
        sub:
          "See month-over-month risk movement and prioritize intervention before problems become audit findings or corrective action plans.",
        highlights: [
          { k: "Trends", v: "Up / down / stable movement" },
          { k: "Signals", v: "Decline + escalation indicators" },
          { k: "Focus", v: "Prioritize attention where needed" },
        ],
        list: [
          { level: "low", title: "Stable month", sub: "No major changes detected", tag: "OK" },
          { level: "med", title: "Moderate change", sub: "Small decline in readiness", tag: "Track" },
          { level: "high", title: "Rapid decline", sub: "Immediate review recommended", tag: "Review" },
        ],
      },
    ],
    []
  );

  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  // Auto-rotate hero "collections"
  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % slides.length);
    }, 5200);
    return () => window.clearInterval(id);
  }, [paused, slides.length]);

  const slide = slides[active];

  // Auto-rotate the list rows inside the preview to feel alive
  const [listShift, setListShift] = useState(0);
  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      setListShift((n) => (n + 1) % 3);
    }, 3600);
    return () => window.clearInterval(id);
  }, [paused]);

  const rotatedList = useMemo(() => {
    const base = slide.list;
    const s = listShift % base.length;
    return [...base.slice(s), ...base.slice(0, s)];
  }, [slide.list, listShift]);

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

            <nav className="nav" aria-label="Primary">
              <Link className="navLink" href="/pricing">
                Pricing
              </Link>
              <Link className="navLink" href="/request-access">
                Request Access
              </Link>
              <Link className="navButton" href="/signin">
                Sign in
              </Link>
            </nav>
          </div>
        </header>

        {/* Hero */}
        <main className="main">
          <section
            className="hero"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <div className="container heroGrid">
              <div className="left">
                <div className="badge" aria-live="polite">
                  <span className="dot" aria-hidden="true" />
                  <span className="fadeSwap" key={`badge-${active}`}>
                    {slide.badge}
                  </span>
                </div>

                <h1 className="h1" aria-live="polite">
                  Continuous Medicaid compliance monitoring for providers in{" "}
                  <span className="em fadeSwap" key={`title-${active}`}>
                    {slide.titleEmphasis}
                  </span>
                  .
                </h1>

                <p className="sub fadeSwap" key={`sub-${active}`}>
                  {slide.sub}
                </p>

                <div className="ctaRow">
                  <Link className="primary" href="/request-access">
                    Request early access
                  </Link>
                  <Link className="secondary" href="/pricing">
                    View pricing
                  </Link>
                </div>

                <div className="trustRow" aria-label="Key benefits">
                  {slide.highlights.map((h, idx) => (
                    <div className="trustItem" key={`${active}-h-${idx}`}>
                      <div className="trustK">{h.k}</div>
                      <div className="trustV">{h.v}</div>
                    </div>
                  ))}
                </div>

                {/* Dots: “collections” control */}
                <div className="dots" aria-label="Hero collections">
                  {slides.map((_, i) => (
                    <button
                      key={`dot-${i}`}
                      className={`dotBtn ${i === active ? "on" : ""}`}
                      onClick={() => setActive(i)}
                      aria-label={`Show collection ${i + 1}`}
                      type="button"
                    />
                  ))}
                  <div className="dotsHint">Hover to pause</div>
                </div>
              </div>

              <div className="heroCard" role="region" aria-label="Platform preview">
                <div className="sweep" aria-hidden="true" />
                <div className="cardTop">
                  <div className="cardTitle">Compliance Overview</div>
                  <div className="pill">DMV Region</div>
                </div>

                <div className="cardGrid">
                  <div className="metric">
                    <div className="metricLabel">Providers monitored</div>
                    <div className="metricValue shimmer">—</div>
                    <div className="metricHint">Connected to your roster</div>
                  </div>
                  <div className="metric">
                    <div className="metricLabel">Risk level</div>
                    <div className="metricValue shimmer">—</div>
                    <div className="metricHint">Low • Medium • High</div>
                  </div>
                  <div className="metric">
                    <div className="metricLabel">Trend</div>
                    <div className="metricValue shimmer">—</div>
                    <div className="metricHint">Improving • Stable • Declining</div>
                  </div>
                  <div className="metric">
                    <div className="metricLabel">Escalation signals</div>
                    <div className="metricValue shimmer">—</div>
                    <div className="metricHint">Flags that require attention</div>
                  </div>
                </div>

                <div className="divider" />

                <div className="list" aria-live="polite">
                  {rotatedList.map((row, idx) => (
                    <div className="listRow liftIn" key={`${active}-row-${idx}`}>
                      <div
                        className={`statusDot ${
                          row.level === "high" ? "sHigh" : row.level === "med" ? "sMed" : "sLow"
                        }`}
                        aria-hidden="true"
                      />
                      <div className="listText">
                        <div className="listTitle">{row.title}</div>
                        <div className="listSub">{row.sub}</div>
                      </div>
                      <div className="listTag">{row.tag}</div>
                    </div>
                  ))}
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
              <Link className="footerLink" href="/signin">
                Sign in
              </Link>
            </div>
          </div>
        </footer>

        <style jsx>{`
          :global(html, body) {
            margin: 0;
            padding: 0;
          }
          :global(a) {
            color: inherit;
            text-decoration: none;
          }

          .page {
            min-height: 100vh;
            background: #fbfcfe;
            color: #0b1220;
            font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial,
              "Apple Color Emoji", "Segoe UI Emoji";
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            text-rendering: optimizeLegibility;
          }

          .container {
            width: 100%;
            max-width: 1120px;
            margin: 0 auto;
            padding: 0 20px;
          }

          .header {
            position: sticky;
            top: 0;
            z-index: 50;
            background: rgba(251, 252, 254, 0.78);
            backdrop-filter: blur(12px);
            border-bottom: 1px solid rgba(230, 233, 239, 0.9);
            box-shadow: 0 10px 26px rgba(11, 18, 32, 0.05);
          }
          .headerInner {
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 74px;
          }

          .brand {
            display: flex;
            align-items: center;
            gap: 12px;
            user-select: none;
          }
          .mark {
            width: 40px;
            height: 40px;
            border-radius: 12px;
            background: radial-gradient(
                18px 18px at 30% 30%,
                rgba(255, 255, 255, 0.55),
                rgba(255, 255, 255, 0) 55%
              ),
              linear-gradient(135deg, #0b3a66, #0f6aa6);
            box-shadow: 0 10px 22px rgba(11, 58, 102, 0.18);
            border: 1px solid rgba(11, 58, 102, 0.22);
          }
          .brandText {
            line-height: 1.1;
          }
          .brandName {
            font-weight: 850;
            letter-spacing: -0.03em;
            font-size: 15px;
          }
          .brandTag {
            font-size: 12px;
            color: #5b6576;
            margin-top: 4px;
            letter-spacing: 0.02em;
          }

          .nav {
            display: flex;
            align-items: center;
            gap: 10px;
          }
          .navLink {
            color: #1f2b3d;
            font-size: 13px;
            font-weight: 650;
            padding: 9px 12px;
            border-radius: 999px;
            border: 1px solid transparent;
            letter-spacing: 0.01em;
          }
          .navLink:hover {
            background: rgba(243, 245, 249, 0.9);
            border-color: rgba(230, 233, 239, 0.9);
          }

          .navButton {
            font-size: 13px;
            font-weight: 750;
            padding: 10px 14px;
            border-radius: 999px;
            letter-spacing: 0.01em;
            color: #ffffff;
            background: linear-gradient(135deg, #0b3a66, #0f6aa6);
            border: 1px solid rgba(11, 58, 102, 0.35);
            box-shadow: 0 10px 22px rgba(11, 18, 32, 0.12);
          }
          .navButton:hover {
            filter: brightness(0.98);
          }

          .hero {
            border-bottom: 1px solid #eef1f6;
            background: radial-gradient(
                980px 520px at 16% 12%,
                rgba(15, 106, 166, 0.13),
                transparent 58%
              ),
              radial-gradient(980px 520px at 86% 20%, rgba(11, 58, 102, 0.11), transparent 58%);
            padding: 64px 0 42px;
            overflow: hidden;
          }
          .heroGrid {
            display: grid;
            grid-template-columns: 1.12fr 0.88fr;
            gap: 30px;
            align-items: start;
          }

          .left {
            position: relative;
          }

          .badge {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            padding: 10px 12px;
            border-radius: 999px;
            border: 1px solid rgba(219, 226, 238, 0.95);
            background: rgba(255, 255, 255, 0.85);
            font-size: 13px;
            font-weight: 650;
            color: #243044;
            box-shadow: 0 10px 22px rgba(11, 18, 32, 0.05);
          }
          .dot {
            width: 8px;
            height: 8px;
            border-radius: 999px;
            background: #0f6aa6;
          }

          .fadeSwap {
            display: inline-block;
            animation: fadeSwap 520ms ease both;
          }
          @keyframes fadeSwap {
            from {
              opacity: 0;
              transform: translateY(4px);
              filter: blur(1px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
              filter: blur(0);
            }
          }

          .h1 {
            margin: 16px 0 12px;
            font-size: 44px;
            line-height: 1.08;
            letter-spacing: -0.045em;
            max-width: 720px;
          }
          .em {
            color: #0b3a66;
          }
          .sub {
            margin: 0 0 20px;
            color: #445065;
            font-size: 16px;
            line-height: 1.7;
            max-width: 680px;
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
            background: linear-gradient(135deg, #0b3a66, #0f6aa6);
            color: #fff;
            font-weight: 750;
            border: 1px solid rgba(11, 58, 102, 0.35);
            min-width: 180px;
            box-shadow: 0 12px 26px rgba(11, 18, 32, 0.12);
            transition: transform 140ms ease, box-shadow 140ms ease;
          }
          .primary:hover {
            transform: translateY(-1px);
            box-shadow: 0 16px 32px rgba(11, 18, 32, 0.14);
          }
          .secondary {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 12px 14px;
            border-radius: 14px;
            background: rgba(255, 255, 255, 0.92);
            color: #0b1220;
            font-weight: 750;
            border: 1px solid rgba(215, 220, 230, 0.9);
            min-width: 140px;
            box-shadow: 0 10px 22px rgba(11, 18, 32, 0.06);
            transition: transform 140ms ease;
          }
          .secondary:hover {
            transform: translateY(-1px);
          }

          .trustRow {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 10px;
            margin-top: 10px;
          }
          .trustItem {
            border: 1px solid rgba(230, 233, 239, 0.95);
            border-radius: 16px;
            padding: 12px;
            background: rgba(255, 255, 255, 0.78);
            box-shadow: 0 10px 22px rgba(11, 18, 32, 0.05);
            transition: transform 160ms ease;
          }
          .trustItem:hover {
            transform: translateY(-2px);
          }
          .trustK {
            font-weight: 800;
            font-size: 13px;
            color: #0b1220;
            letter-spacing: -0.01em;
          }
          .trustV {
            margin-top: 4px;
            font-size: 13px;
            color: #5b6576;
            line-height: 1.45;
          }

          .dots {
            margin-top: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .dotBtn {
            width: 10px;
            height: 10px;
            border-radius: 999px;
            border: 1px solid rgba(11, 58, 102, 0.22);
            background: rgba(255, 255, 255, 0.85);
            cursor: pointer;
            padding: 0;
            transition: transform 140ms ease, background 140ms ease;
          }
          .dotBtn:hover {
            transform: scale(1.08);
          }
          .dotBtn.on {
            background: #0f6aa6;
            border-color: rgba(11, 58, 102, 0.35);
          }
          .dotsHint {
            margin-left: 10px;
            font-size: 12px;
            color: #6b7688;
          }

          .heroCard {
            border: 1px solid rgba(230, 233, 239, 0.95);
            border-radius: 20px;
            background: rgba(255, 255, 255, 0.9);
            box-shadow: 0 18px 44px rgba(11, 18, 32, 0.12);
            overflow: hidden;
            position: relative;
            animation: float 6.5s ease-in-out infinite;
          }
          @keyframes float {
            0% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-6px);
            }
            100% {
              transform: translateY(0px);
            }
          }

          .sweep {
            position: absolute;
            inset: -40%;
            background: radial-gradient(
                420px 240px at 35% 30%,
                rgba(15, 106, 166, 0.16),
                rgba(255, 255, 255, 0) 60%
              ),
              radial-gradient(
                420px 240px at 70% 60%,
                rgba(11, 58, 102, 0.12),
                rgba(255, 255, 255, 0) 62%
              );
            transform: rotate(10deg);
            animation: sweep 10.5s ease-in-out infinite;
            pointer-events: none;
          }
          @keyframes sweep {
            0% {
              transform: translateX(-2%) translateY(0%) rotate(10deg);
            }
            50% {
              transform: translateX(2%) translateY(-2%) rotate(10deg);
            }
            100% {
              transform: translateX(-2%) translateY(0%) rotate(10deg);
            }
          }

          .cardTop {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16px 16px 12px;
            border-bottom: 1px solid #eef1f6;
            background: rgba(255, 255, 255, 0.92);
            position: relative;
            z-index: 1;
          }
          .cardTitle {
            font-weight: 850;
            font-size: 14px;
            letter-spacing: -0.01em;
          }
          .pill {
            font-size: 12px;
            font-weight: 750;
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
            padding: 16px;
            position: relative;
            z-index: 1;
          }
          .metric {
            border: 1px solid #eef1f6;
            border-radius: 16px;
            padding: 12px;
            background: rgba(255, 255, 255, 0.95);
          }
          .metricLabel {
            font-size: 12px;
            color: #5b6576;
          }
          .metricValue {
            margin-top: 6px;
            font-size: 22px;
            font-weight: 900;
            letter-spacing: -0.03em;
          }
          .metricHint {
            margin-top: 6px;
            font-size: 12px;
            color: #7a8597;
            line-height: 1.4;
          }

          .shimmer {
            position: relative;
            color: rgba(11, 18, 32, 0.68);
          }
          .shimmer::after {
            content: "";
            position: absolute;
            inset: 0;
            transform: translateX(-120%);
            background: linear-gradient(
              90deg,
              rgba(255, 255, 255, 0) 0%,
              rgba(11, 58, 102, 0.10) 50%,
              rgba(255, 255, 255, 0) 100%
            );
            animation: shimmer 2.8s ease-in-out infinite;
            border-radius: 10px;
          }
          @keyframes shimmer {
            0% {
              transform: translateX(-120%);
            }
            60% {
              transform: translateX(120%);
            }
            100% {
              transform: translateX(120%);
            }
          }

          .divider {
            height: 1px;
            background: #eef1f6;
            position: relative;
            z-index: 1;
          }
          .list {
            padding: 12px 16px;
            display: grid;
            gap: 10px;
            position: relative;
            z-index: 1;
          }
          .listRow {
            display: grid;
            grid-template-columns: 14px 1fr auto;
            align-items: center;
            gap: 10px;
            border: 1px solid #eef1f6;
            border-radius: 16px;
            padding: 10px 12px;
            background: rgba(255, 255, 255, 0.96);
          }
          .liftIn {
            animation: liftIn 420ms ease both;
          }
          @keyframes liftIn {
            from {
              opacity: 0;
              transform: translateY(6px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .statusDot {
            width: 10px;
            height: 10px;
            border-radius: 999px;
          }
          .sHigh {
            background: #dc2626;
          }
          .sMed {
            background: #f59e0b;
          }
          .sLow {
            background: #16a34a;
          }
          .listTitle {
            font-weight: 800;
            font-size: 13px;
          }
          .listSub {
            margin-top: 2px;
            font-size: 12px;
            color: #6b7688;
          }
          .listTag {
            font-size: 12px;
            font-weight: 800;
            color: #243044;
            background: rgba(243, 245, 249, 0.95);
            border: 1px solid rgba(230, 233, 239, 0.95);
            padding: 6px 10px;
            border-radius: 999px;
          }
          .cardFoot {
            padding: 0 16px 16px;
            position: relative;
            z-index: 1;
          }
          .footNote {
            font-size: 12px;
            color: #6b7688;
            line-height: 1.5;
          }

          .section {
            padding: 52px 0;
          }
          .alt {
            background: #f7f9fc;
            border-top: 1px solid #eef1f6;
            border-bottom: 1px solid #eef1f6;
          }
          .twoCol {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 26px;
            align-items: start;
          }
          .h2 {
            margin: 0 0 12px;
            font-size: 26px;
            letter-spacing: -0.03em;
            font-weight: 900;
          }
          .p {
            margin: 0 0 12px;
            color: #445065;
            line-height: 1.75;
            font-size: 15px;
          }

          .panel {
            border: 1px solid rgba(230, 233, 239, 0.95);
            border-radius: 20px;
            background: rgba(255, 255, 255, 0.95);
            padding: 18px;
            box-shadow: 0 14px 30px rgba(11, 18, 32, 0.06);
          }
          .panelTitle {
            font-weight: 900;
            margin-bottom: 10px;
            letter-spacing: -0.02em;
          }
          .bullets {
            margin: 0;
            padding-left: 18px;
            color: #445065;
            line-height: 1.8;
            font-size: 15px;
          }

          .callout {
            margin-top: 14px;
            border-left: 4px solid #0f6aa6;
            background: rgba(15, 106, 166, 0.08);
            border-radius: 16px;
            padding: 12px 14px;
          }
          .calloutTitle {
            font-weight: 900;
            margin-bottom: 4px;
            letter-spacing: -0.02em;
          }
          .calloutBody {
            color: #445065;
            line-height: 1.7;
            font-size: 15px;
          }

          .steps {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 12px;
            margin-top: 14px;
          }
          .step {
            border: 1px solid rgba(230, 233, 239, 0.95);
            border-radius: 20px;
            background: rgba(255, 255, 255, 0.95);
            padding: 18px;
            box-shadow: 0 14px 30px rgba(11, 18, 32, 0.06);
          }
          .stepNum {
            width: 36px;
            height: 36px;
            border-radius: 14px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-weight: 950;
            color: #0b3a66;
            background: rgba(11, 58, 102, 0.1);
            border: 1px solid rgba(11, 58, 102, 0.18);
          }
          .stepTitle {
            margin-top: 10px;
            font-weight: 900;
            letter-spacing: -0.02em;
          }
          .stepBody {
            margin-top: 6px;
            color: #445065;
            line-height: 1.7;
            font-size: 15px;
          }
          .centerCta {
            margin-top: 20px;
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
            border: 1px solid rgba(230, 233, 239, 0.95);
            border-radius: 20px;
            background: rgba(255, 255, 255, 0.95);
            padding: 18px;
            box-shadow: 0 14px 30px rgba(11, 18, 32, 0.06);
            transition: transform 160ms ease;
          }
          .tile:hover {
            transform: translateY(-2px);
          }
          .tileTitle {
            font-weight: 900;
            letter-spacing: -0.02em;
          }
          .tileBody {
            margin-top: 6px;
            color: #445065;
            line-height: 1.7;
            font-size: 14px;
          }

          .cta {
            padding: 38px 0;
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
            font-weight: 950;
            letter-spacing: -0.03em;
          }
          .ctaSub {
            margin-top: 6px;
            color: rgba(255, 255, 255, 0.9);
            line-height: 1.7;
            max-width: 680px;
            font-size: 15px;
          }
          .ctaButtons {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
          }
          .ctaButtons :global(.primary) {
            background: rgba(255, 255, 255, 0.98);
            color: #0b3a66;
            border-color: rgba(255, 255, 255, 0.65);
            box-shadow: 0 12px 26px rgba(0, 0, 0, 0.18);
          }
          .ctaButtons :global(.secondary) {
            background: transparent;
            color: #fff;
            border-color: rgba(255, 255, 255, 0.45);
            box-shadow: none;
          }

          .footer {
            border-top: 1px solid #eef1f6;
            padding: 26px 0;
            background: #fbfcfe;
          }
          .footerInner {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            flex-wrap: wrap;
          }
          .footerBrand {
            font-weight: 950;
            letter-spacing: -0.03em;
          }
          .footerSmall {
            margin-top: 6px;
            color: #6b7688;
            font-size: 13px;
            line-height: 1.6;
          }
          .footerRight {
            display: flex;
            align-items: center;
            gap: 10px;
          }
          .footerLink {
            color: #1f2b3d;
            font-size: 13px;
            font-weight: 650;
            padding: 9px 12px;
            border-radius: 999px;
            border: 1px solid transparent;
          }
          .footerLink:hover {
            background: rgba(243, 245, 249, 0.9);
            border-color: rgba(230, 233, 239, 0.9);
          }

          @media (prefers-reduced-motion: reduce) {
            .fadeSwap,
            .heroCard,
            .sweep,
            .shimmer::after,
            .liftIn,
            .trustItem,
            .tile,
            .primary,
            .secondary {
              animation: none !important;
              transition: none !important;
              transform: none !important;
            }
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
              font-size: 38px;
            }
          }

          @media (max-width: 640px) {
            .navLink {
              display: none;
            }
            .h1 {
              font-size: 32px;
            }
            .hero {
              padding: 52px 0 34px;
            }
          }
        `}</style>
      </div>
    </>
  );
}
