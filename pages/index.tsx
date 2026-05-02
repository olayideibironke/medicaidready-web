import Head from "next/head";
import Link from "next/link";

const STATS = [
  { value: "90M+", label: "Americans on Medicaid" },
  { value: "50", label: "States covered" },
  { value: "2 min", label: "Average check time" },
  { value: "Free", label: "No account needed" },
];

const HOW_STEPS = [
  {
    num: "01",
    title: "Answer 5 quick questions",
    body: "Tell us your state, household size, monthly income, age, and employment status. Plain English - no jargon.",
  },
  {
    num: "02",
    title: "Enter your email",
    body: "Your personalized eligibility summary is delivered straight to your inbox within seconds.",
  },
  {
    num: "03",
    title: "Get your result",
    body: "Our AI reviews your answers against your state's current Medicaid rules and gives you a clear, honest assessment.",
  },
];

const WHO_ITEMS = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
          d="M10 11a4 4 0 100-8 4 4 0 000 8zM3 17c0-3.314 3.134-6 7-6s7 2.686 7 6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: "Working families",
    body: "Income limits are higher than most people think, especially with children in the household.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
          d="M10 3v2M10 15v2M3 10H1M19 10h-2M4.93 4.93l1.41 1.41M13.66 13.66l1.41 1.41M4.93 15.07l1.41-1.41M13.66 6.34l1.41-1.41M10 13a3 3 0 100-6 3 3 0 000 6z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
    title: "Recently unemployed",
    body: "Losing a job often makes you eligible immediately. Employment is not required to qualify.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect
          x="3"
          y="6"
          width="14"
          height="11"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M7 6V4a3 3 0 016 0v2"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M10 11v2M9 12h2"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
    title: "Adults without children",
    body: "Many states expanded Medicaid under the ACA - adults qualify based on income alone.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
          d="M10 2L2 6v5c0 4.418 3.582 8 8 8s8-3.582 8-8V6l-8-4z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M10 7v4M8 10h4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
    title: "Seniors and people with disabilities",
    body: "Special eligibility rules apply for adults 65+ and those with qualifying disabilities.",
  },
];

const FAQ_ITEMS = [
  {
    q: "Is this free?",
    a: "Yes - checking your eligibility is completely free and always will be. We offer an optional $9.99 Application Guide PDF for people who want step-by-step help applying.",
  },
  {
    q: "Will this affect my credit or create an account?",
    a: "No. The quiz does not create an account, run a credit check, or share your data with any government agency.",
  },
  {
    q: "How accurate is the eligibility check?",
    a: "The check is based on current Medicaid income and categorical rules for your state. It is not a final determination - only your state Medicaid office can officially approve or deny you.",
  },
  {
    q: "What states do you cover?",
    a: "All 50 states plus Washington, DC. Each state has different rules, and we account for whether your state has expanded Medicaid under the ACA.",
  },
];

export default function Home() {
  return (
    <>
      <Head>
        <title>MedicaidReady - Free Medicaid Eligibility Check | Find Out in 2 Minutes</title>
        <meta
          name="description"
          content="Find out if you qualify for Medicaid in 2 minutes. Free eligibility check. No jargon. No confusion. Covers all 50 states."
        />
        <meta property="og:title" content="MedicaidReady - Free Medicaid Eligibility Check" />
        <meta
          property="og:description"
          content="Find out if you qualify for Medicaid in 2 minutes. Free eligibility check. No jargon. No confusion."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://medicaidready.org/" />
        <meta property="og:image" content="https://medicaidready.org/medicaidready-header.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="MedicaidReady - Free Medicaid Eligibility Check" />
        <meta
          name="twitter:description"
          content="Find out if you qualify for Medicaid in 2 minutes. Free eligibility check. No jargon."
        />
        <meta name="twitter:image" content="https://medicaidready.org/medicaidready-header.png" />
        <link rel="canonical" href="https://medicaidready.org/" />
      </Head>

      <div className="page">
        <section className="hero">
          <div className="container">
            <div className="hero-inner">
              <div className="hero-badge">
                <span className="hero-badge-dot" aria-hidden="true" />
                Free eligibility check &middot; No account needed &middot; All 50 states
              </div>

              <h1 className="h1">
                Find out if you qualify
                <br />
                for <span className="h1-em">Medicaid</span> in 2 minutes
              </h1>

              <p className="hero-sub">
                Millions of Americans qualify for Medicaid and don&apos;t know it. Our free
                tool checks your eligibility against your state&apos;s current rules &mdash; no
                jargon, no confusion.
              </p>

              <div className="hero-actions">
                <Link href="/quiz" className="btn-primary">
                  Check My Eligibility &mdash; It&apos;s Free
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path
                      d="M3 8h10M9 4l4 4-4 4"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>

                <Link href="/pricing" className="btn-ghost">
                  View pricing
                </Link>
              </div>

              <div className="trust-row" aria-label="Key benefits">
                <div className="trust-item">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path
                      d="M2 7l4 4 6-7"
                      stroke="#15803d"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  No credit check
                </div>
                <div className="trust-sep" aria-hidden="true" />
                <div className="trust-item">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path
                      d="M2 7l4 4 6-7"
                      stroke="#15803d"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  No data shared with government
                </div>
                <div className="trust-sep" aria-hidden="true" />
                <div className="trust-item">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path
                      d="M2 7l4 4 6-7"
                      stroke="#15803d"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Results in under 2 minutes
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="stats-bar">
          <div className="container">
            <div className="stats-grid">
              {STATS.map((stat) => (
                <div className="stat-item" key={stat.label}>
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <section className="section" id="how-it-works">
          <div className="container">
            <div className="section-header">
              <div className="section-eyebrow">How it works</div>
              <h2 className="h2">Three steps. No paperwork. No waiting rooms.</h2>
            </div>

            <div className="steps">
              {HOW_STEPS.map((step) => (
                <div className="step-card" key={step.num}>
                  <div className="step-num" aria-hidden="true">
                    {step.num}
                  </div>
                  <div className="step-title">{step.title}</div>
                  <div className="step-body">{step.body}</div>
                </div>
              ))}
            </div>

            <div className="section-cta">
              <Link href="/quiz" className="btn-primary">
                Start Free Check
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path
                    d="M3 8h10M9 4l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        <section className="section-alt">
          <div className="container">
            <div className="section-header">
              <div className="section-eyebrow">Who this is for</div>
              <h2 className="h2">Medicaid covers more people than you think</h2>
              <p className="section-sub">
                You might qualify and not know it. Here&apos;s who Medicaid is designed to help.
              </p>
            </div>

            <div className="who-grid">
              {WHO_ITEMS.map((item) => (
                <div className="who-card" key={item.title}>
                  <div className="who-icon" aria-hidden="true">
                    {item.icon}
                  </div>
                  <div className="who-title">{item.title}</div>
                  <div className="who-body">{item.body}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-header">
              <div className="section-eyebrow">FAQ</div>
              <h2 className="h2">Common questions</h2>
            </div>

            <div className="faq-grid">
              {FAQ_ITEMS.map((faq) => (
                <div className="faq-card" key={faq.q}>
                  <div className="faq-q">{faq.q}</div>
                  <div className="faq-a">{faq.a}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="cta-section">
          <div className="container">
            <div className="cta-inner">
              <div className="cta-icon" aria-hidden="true">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <path
                    d="M14 3L3 8.5v7c0 5.799 4.802 11.195 11 12.5C20.198 26.695 25 21.299 25 15.5v-7L14 3z"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14 10v7M11 14h6"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <h2 className="cta-title">Ready to check your eligibility?</h2>
              <p className="cta-sub">
                It takes about 2 minutes and it&apos;s completely free. No account required.
              </p>

              <Link href="/quiz" className="btn-white">
                Check My Eligibility &mdash; It&apos;s Free
              </Link>

              <p className="cta-note">No credit card &middot; No account &middot; Instant results</p>
            </div>
          </div>
        </section>
      </div>

      <style jsx global>{`
        .page {
          background: #f8fafc;
          color: #0f172a;
        }

        .container {
          width: 100%;
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .hero {
          background: #ffffff;
          border-bottom: 1px solid #e2e8f0;
          padding: 80px 0 72px;
        }

        .hero-inner {
          max-width: 700px;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          border-radius: 999px;
          border: 1px solid #bfdbfe;
          background: #eff6ff;
          font-size: 13px;
          font-weight: 500;
          color: #1d4ed8;
          margin-bottom: 24px;
        }

        .hero-badge-dot {
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #3b82f6;
          flex-shrink: 0;
        }

        .h1 {
          font-size: 52px;
          line-height: 1.07;
          letter-spacing: -0.04em;
          font-weight: 700;
          margin-bottom: 20px;
          color: #0f172a;
        }

        .h1-em {
          color: #0a3d6b;
        }

        .hero-sub {
          font-size: 18px;
          line-height: 1.7;
          color: #475569;
          margin-bottom: 32px;
          max-width: 580px;
        }

        .hero-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .btn-primary {
          display: inline-flex !important;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 14px 24px;
          border-radius: 10px;
          background: #0a3d6b;
          color: #ffffff !important;
          font-size: 15px;
          font-weight: 600;
          border: 1px solid #072d52;
          box-shadow: 0 4px 12px rgba(10, 61, 107, 0.25);
          text-decoration: none !important;
          transition:
            background 140ms,
            transform 100ms;
          cursor: pointer;
        }

        .btn-primary:hover {
          background: #072d52;
          transform: translateY(-1px);
          color: #ffffff !important;
          text-decoration: none !important;
        }

        .btn-ghost {
          display: inline-flex !important;
          align-items: center;
          justify-content: center;
          padding: 14px 20px;
          border-radius: 10px;
          background: #ffffff;
          color: #0a3d6b !important;
          font-size: 15px;
          font-weight: 600;
          border: 1px solid #cbd5e1;
          text-decoration: none !important;
          transition:
            background 140ms,
            border-color 140ms,
            transform 100ms;
        }

        .btn-ghost:hover {
          background: #eff6ff;
          border-color: #93c5fd;
          transform: translateY(-1px);
          color: #0a3d6b !important;
          text-decoration: none !important;
        }

        .trust-row {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
        }

        .trust-item {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 500;
          color: #475569;
        }

        .trust-sep {
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: #cbd5e1;
        }

        .stats-bar {
          background: #0a3d6b;
          padding: 24px 0;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1px;
        }

        .stat-item {
          padding: 8px 24px;
          border-right: 1px solid rgba(255, 255, 255, 0.12);
          text-align: center;
        }

        .stat-item:last-child {
          border-right: none;
        }

        .stat-value {
          font-size: 26px;
          font-weight: 700;
          color: #fff;
          letter-spacing: -0.03em;
          line-height: 1.2;
        }

        .stat-label {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.65);
          margin-top: 3px;
        }

        .section {
          padding: 80px 0;
          background: #ffffff;
        }

        .section-alt {
          padding: 80px 0;
          background: #f8fafc;
          border-top: 1px solid #e2e8f0;
          border-bottom: 1px solid #e2e8f0;
        }

        .section-header {
          margin-bottom: 48px;
        }

        .section-eyebrow {
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #1565c0;
          margin-bottom: 10px;
        }

        .h2 {
          font-size: 32px;
          font-weight: 700;
          letter-spacing: -0.035em;
          color: #0f172a;
          line-height: 1.2;
        }

        .section-sub {
          margin-top: 12px;
          font-size: 16px;
          color: #475569;
          line-height: 1.7;
          max-width: 540px;
        }

        .steps {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2px;
          background: #e2e8f0;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          overflow: hidden;
          margin-bottom: 40px;
        }

        .step-card {
          background: #ffffff;
          padding: 32px 28px;
        }

        .step-num {
          font-size: 13px;
          font-weight: 700;
          color: #1565c0;
          letter-spacing: 0.05em;
          margin-bottom: 16px;
        }

        .step-title {
          font-size: 17px;
          font-weight: 600;
          color: #0f172a;
          margin-bottom: 10px;
          letter-spacing: -0.01em;
        }

        .step-body {
          font-size: 14px;
          color: #475569;
          line-height: 1.7;
        }

        .section-cta {
          display: flex;
        }

        .who-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .who-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06);
        }

        .who-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: #eff6ff;
          color: #0a3d6b;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 14px;
        }

        .who-title {
          font-size: 15px;
          font-weight: 600;
          color: #0f172a;
          margin-bottom: 8px;
          letter-spacing: -0.01em;
        }

        .who-body {
          font-size: 14px;
          color: #475569;
          line-height: 1.7;
        }

        .faq-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2px;
          background: #e2e8f0;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          overflow: hidden;
        }

        .faq-card {
          background: #ffffff;
          padding: 28px;
        }

        .faq-q {
          font-size: 15px;
          font-weight: 600;
          color: #0f172a;
          margin-bottom: 8px;
          letter-spacing: -0.01em;
        }

        .faq-a {
          font-size: 14px;
          color: #475569;
          line-height: 1.75;
        }

        .cta-section {
          background: #0a3d6b;
          padding: 80px 0;
        }

        .cta-inner {
          text-align: center;
          max-width: 520px;
          margin: 0 auto;
        }

        .cta-icon {
          width: 64px;
          height: 64px;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
        }

        .cta-title {
          font-size: 32px;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.035em;
          margin-bottom: 12px;
          line-height: 1.2;
        }

        .cta-sub {
          font-size: 16px;
          color: rgba(255, 255, 255, 0.75);
          line-height: 1.65;
          margin-bottom: 32px;
        }

        .btn-white {
          display: inline-flex !important;
          align-items: center;
          justify-content: center;
          padding: 14px 28px;
          border-radius: 10px;
          background: #ffffff;
          color: #0a3d6b !important;
          font-size: 15px;
          font-weight: 600;
          border: 1px solid rgba(255, 255, 255, 0.4);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          text-decoration: none !important;
          transition: transform 120ms;
        }

        .btn-white:hover {
          transform: translateY(-1px);
          color: #0a3d6b !important;
          text-decoration: none !important;
        }

        .cta-note {
          margin-top: 14px;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.5);
        }

        @media (max-width: 960px) {
          .h1 {
            font-size: 40px;
          }

          .who-grid {
            grid-template-columns: 1fr 1fr;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 700px) {
          .hero {
            padding: 56px 0 48px;
          }

          .h1 {
            font-size: 32px;
          }

          .hero-sub {
            font-size: 16px;
          }

          .h2 {
            font-size: 26px;
          }

          .steps {
            grid-template-columns: 1fr;
          }

          .who-grid {
            grid-template-columns: 1fr;
          }

          .faq-grid {
            grid-template-columns: 1fr;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .btn-primary {
            width: 100%;
            justify-content: center;
          }

          .btn-ghost {
            width: 100%;
            justify-content: center;
          }

          .btn-white {
            width: 100%;
            justify-content: center;
          }

          .hero-actions {
            flex-direction: column;
          }

          .section {
            padding: 56px 0;
          }

          .section-alt {
            padding: 56px 0;
          }

          .cta-section {
            padding: 56px 0;
          }

          .cta-title {
            font-size: 26px;
          }

          .container {
            padding: 0 16px;
          }
        }
      `}</style>
    </>
  );
}