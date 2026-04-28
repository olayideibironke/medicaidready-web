import Head from "next/head";
import Link from "next/link";
import { GetStaticPaths, GetStaticProps } from "next";
import { STATES, getStateBySlug, getAllSlugs, State } from "../../lib/medicaidEligibilityStates";

type Props = { state: State };

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: getAllSlugs().map((slug) => ({ params: { state: slug } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const slug = params?.state as string;
  const state = getStateBySlug(slug);
  if (!state) return { notFound: true };
  return { props: { state } };
};

export default function StatePage({ state }: Props) {
  const otherStates = STATES.filter((s) => s.slug !== state.slug).slice(0, 5);

  return (
    <>
      <Head>
        <title>Medicaid Eligibility in {state.name} 2026 — Do You Qualify?</title>
        <meta
          name="description"
          content={`Find out if you qualify for Medicaid in ${state.name} in 2026. Income limits, eligibility requirements, how to apply, and what's covered. Free eligibility check in 2 minutes.`}
        />
        <meta property="og:title" content={`Medicaid Eligibility in ${state.name} 2026 — Do You Qualify?`} />
        <meta property="og:description" content={`${state.name} Medicaid income limits, eligibility rules, and how to apply in 2026. Free check in 2 minutes.`} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://medicaidready.org/medicaid-eligibility/${state.slug}`} />
        <link rel="canonical" href={`https://medicaidready.org/medicaid-eligibility/${state.slug}`} />
      </Head>

      <div className="page">

        {/* Hero */}
        <div className="hero">
          <div className="container">
            <div className="breadcrumb">
              <Link href="/" className="breadcrumb-link">Home</Link>
              <span className="breadcrumb-sep">›</span>
              <Link href="/medicaid-eligibility" className="breadcrumb-link">Medicaid Eligibility</Link>
              <span className="breadcrumb-sep">›</span>
              <span className="breadcrumb-cur">{state.name}</span>
            </div>
            <div className="hero-tag">Updated for 2026 · {state.name}</div>
            <h1 className="h1">
              Medicaid Eligibility in {state.name}:<br />
              <span className="h1-em">Do You Qualify in 2026?</span>
            </h1>
            <p className="hero-sub">
              {state.expanded
                ? `${state.name} expanded Medicaid under the ACA, which means more residents qualify than ever before. Here is everything you need to know about income limits, who qualifies, and how to apply.`
                : `${state.name} did not expand Medicaid under the ACA, which means income limits are stricter than in most states. Here is everything you need to know about who qualifies and how to apply.`}
            </p>
            <Link href="/quiz" className="hero-cta">
              Check My Eligibility Free — 2 Minutes
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>

        {/* Quick answer */}
        <div className="container">
          <div className={`answer-box ${state.expanded ? "answer-box-green" : "answer-box-amber"}`}>
            <div className="answer-icon">{state.expanded ? "✅" : "⚠️"}</div>
            <div>
              <div className="answer-title">
                {state.expanded ? `${state.name} expanded Medicaid` : `${state.name} did NOT expand Medicaid`}
              </div>
              <p className="answer-text">{state.notes}</p>
            </div>
          </div>
        </div>

        {/* Main */}
        <div className="main">
          <div className="container">
            <div className="content-grid">

              <article className="article">

                <h2 className="h2">Who Qualifies for Medicaid in {state.name}?</h2>
                <p className="p">
                  {state.name} Medicaid covers several groups of people. Eligibility is based on income, household
                  size, age, and other factors. Here are the main groups who may qualify:
                </p>

                <div className="group-cards">
                  {[
                    {
                      title: "Children",
                      desc: `Children under 19 in households earning up to ${state.childLimitPct}% of the federal poverty level qualify for Medicaid or CHIP in ${state.name}.`,
                      ok: true,
                    },
                    {
                      title: "Pregnant women",
                      desc: `Pregnant women qualify up to ${state.pregnantLimitPct}% FPL for pregnancy-related services including prenatal care, labor and delivery, and postpartum care.`,
                      ok: true,
                    },
                    {
                      title: "Low-income adults",
                      desc: state.expanded
                        ? `${state.name} expanded Medicaid, so adults earning up to ${state.adultLimitPct}% FPL (about ${state.adultMonthly1} for a single person) may qualify.`
                        : `${state.name} did not expand Medicaid. Adults without children or a disability face very strict income limits — around ${state.adultMonthly3} per month for a family of three.`,
                      ok: state.expanded,
                    },
                    {
                      title: "Seniors (65+)",
                      desc: `Adults 65 and older may qualify for Medicaid in ${state.name} to cover long-term care, nursing home costs, and services not covered by Medicare.`,
                      ok: true,
                    },
                    {
                      title: "People with disabilities",
                      desc: `Adults with qualifying physical or mental disabilities may qualify for Medicaid in ${state.name} regardless of age, based on income and disability status.`,
                      ok: true,
                    },
                    {
                      title: "Single adults without children",
                      desc: state.expanded
                        ? `Since ${state.name} expanded Medicaid, single adults without children can qualify based on income alone — up to ${state.adultLimitPct}% FPL.`
                        : `This is the hardest group to qualify in ${state.name}. Without a disability or qualifying condition, most single adults do not qualify for Medicaid in ${state.name}.`,
                      ok: state.expanded,
                    },
                  ].map((group) => (
                    <div key={group.title} className={`group-card ${group.ok ? "group-card-green" : "group-card-amber"}`}>
                      <div className="group-card-title">
                        <span className={`group-dot ${group.ok ? "group-dot-green" : "group-dot-amber"}`} />
                        {group.title}
                      </div>
                      <p className="group-card-desc">{group.desc}</p>
                    </div>
                  ))}
                </div>

                <h2 className="h2">{state.name} Medicaid Income Limits 2026</h2>
                <p className="p">
                  Income limits in {state.name} are based on the federal poverty level (FPL) and vary by household
                  size and program. Here are the key limits for 2026:
                </p>

                <div className="table-wrap">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Program</th>
                        <th>% of FPL</th>
                        <th>Household of 1</th>
                        <th>Household of 3</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { program: "Adults", pct: `${state.adultLimitPct}% FPL`, one: state.adultMonthly1, three: state.adultMonthly3 },
                        { program: "Children", pct: `${state.childLimitPct}% FPL`, one: state.childMonthly1, three: state.childMonthly3 },
                        { program: "Pregnant women", pct: `${state.pregnantLimitPct}% FPL`, one: "Varies", three: "Varies" },
                        { program: "Seniors (65+)", pct: "Varies", one: "Varies", three: "Varies" },
                        { program: "People with disabilities", pct: "Varies", one: "Varies", three: "Varies" },
                      ].map((row, i) => (
                        <tr key={i}>
                          <td className="td-bold">{row.program}</td>
                          <td>{row.pct}</td>
                          <td>{row.one}</td>
                          <td>{row.three}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className={`info-box ${state.expanded ? "info-box-blue" : "info-box-amber"}`}>
                  {state.expanded
                    ? `${state.name} expanded Medicaid under the Affordable Care Act. This means most low-income adults qualify based on income alone — you do not need children or a disability to be eligible.`
                    : `${state.name} did not expand Medicaid under the ACA. This means income limits for adults without children or a disability are much lower than in expansion states. If you do not qualify for Medicaid, you may be eligible for subsidized coverage through healthcare.gov.`}
                </div>

                <h2 className="h2">What Does {state.name} Medicaid Cover?</h2>
                <p className="p">{state.name} Medicaid covers a wide range of healthcare services including:</p>

                <div className="coverage-grid">
                  {[
                    "Doctor visits and primary care",
                    "Hospital stays and emergency care",
                    "Prescription medications",
                    "Mental health services",
                    "Dental care (for children)",
                    "Vision care and eyeglasses",
                    "Lab tests and X-rays",
                    "Prenatal and maternity care",
                    "Long-term care and nursing facilities",
                    "Home health services",
                    "Physical and occupational therapy",
                    "Transportation to medical appointments",
                  ].map((item) => (
                    <div key={item} className="coverage-item">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                        <path d="M2 7l4 4 6-7" stroke="#15803d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {item}
                    </div>
                  ))}
                </div>

                <h2 className="h2">How to Apply for Medicaid in {state.name}</h2>
                <p className="p">There are several ways to apply for Medicaid in {state.name}:</p>

                <div className="steps-list">
                  {[
                    { num: "1", title: "Apply online", desc: `Visit ${state.applyUrl} to apply online. This is the fastest method and is available 24/7.` },
                    { num: "2", title: "Apply by phone", desc: `Call ${state.phone} to speak with a benefits counselor who can help you apply over the phone.` },
                    { num: "3", title: "Apply in person", desc: `Visit your local ${state.name} Medicaid office. Bring proof of identity, income, and residency.` },
                    { num: "4", title: "Apply by mail", desc: `Download the paper application from the ${state.name} Medicaid website and mail it to your local office.` },
                  ].map((step) => (
                    <div key={step.num} className="step-item">
                      <div className="step-num">{step.num}</div>
                      <div className="step-content">
                        <div className="step-title">{step.title}</div>
                        <p className="step-desc">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <h2 className="h2">Documents You Will Need</h2>
                <p className="p">When applying for {state.name} Medicaid, gather these documents in advance:</p>
                <ul className="doc-list">
                  {[
                    "Proof of identity (driver's license, state ID, or passport)",
                    `Proof of ${state.name} residency (utility bill, lease, or bank statement)`,
                    "Social Security numbers for all household members applying",
                    "Proof of income (pay stubs, employer letter, or tax return)",
                    "Proof of citizenship or immigration status",
                    "Information about any health insurance you currently have",
                    "Birth certificates for children applying",
                  ].map((doc) => (
                    <li key={doc} className="doc-item">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                        <path d="M2 7l4 4 6-7" stroke="#0a3d6b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {doc}
                    </li>
                  ))}
                </ul>

                <h2 className="h2">Frequently Asked Questions</h2>
                <div className="faq-list">
                  {[
                    {
                      q: `Did ${state.name} expand Medicaid?`,
                      a: state.expanded
                        ? `Yes — ${state.name} expanded Medicaid under the ACA. This means adults earning up to ${state.adultLimitPct}% of the federal poverty level (about ${state.adultMonthly1} per month for a single person) may qualify.`
                        : `No — ${state.name} did not expand Medicaid under the ACA. This means income limits for adults without children are much lower than in expansion states. ${state.notes}`,
                    },
                    {
                      q: `Can I get Medicaid if I am working in ${state.name}?`,
                      a: `Yes — being employed does not automatically disqualify you from Medicaid in ${state.name}. What matters is your total household income compared to the income limit for your program. Many working families, parents, and pregnant women qualify even with a job.`,
                    },
                    {
                      q: `How long does ${state.name} Medicaid approval take?`,
                      a: `${state.name} is required to process most Medicaid applications within 45 days. Disability-related applications may take up to 90 days. Pregnancy applications are often processed faster because of the urgency of prenatal care.`,
                    },
                    {
                      q: `What if I am denied Medicaid in ${state.name}?`,
                      a: `If your application is denied, you have the right to appeal. You generally have 90 days from your denial notice to request a fair hearing. Many denials are overturned on appeal, especially with additional documentation. Call ${state.phone} for help with your appeal.`,
                    },
                    {
                      q: `Does ${state.name} Medicaid cover dental and vision?`,
                      a: `${state.name} Medicaid covers dental and vision care for children. Adult dental and vision coverage varies — some services may be covered depending on your specific plan. Contact ${state.phone} for details about your coverage.`,
                    },
                  ].map((faq) => (
                    <div key={faq.q} className="faq-item">
                      <div className="faq-q">{faq.q}</div>
                      <div className="faq-a">{faq.a}</div>
                    </div>
                  ))}
                </div>

              </article>

              {/* Sidebar */}
              <aside className="sidebar">
                <div className="sidebar-card">
                  <div className="sidebar-card-title">Check Your Eligibility</div>
                  <p className="sidebar-card-desc">
                    Not sure if you qualify in {state.name}? Answer 5 quick questions and get your personalized result in 2 minutes. Free, no account needed.
                  </p>
                  <Link href="/quiz" className="sidebar-cta">
                    Check Eligibility Free
                  </Link>
                  <div className="sidebar-trust">
                    <div className="sidebar-trust-item">✓ No account required</div>
                    <div className="sidebar-trust-item">✓ Results in 2 minutes</div>
                    <div className="sidebar-trust-item">✓ No data shared with government</div>
                  </div>
                </div>

                <div className="sidebar-card sidebar-card-plain">
                  <div className="sidebar-card-title">{state.name} Medicaid Resources</div>
                  <div className="sidebar-links">
                    {[
                      { label: "Apply online", url: state.applyUrl },
                      { label: `Call ${state.phone}`, url: `tel:${state.phone}` },
                    ].map((link) => (
                      <a key={link.label} href={link.url} className="sidebar-link" target="_blank" rel="noopener noreferrer">
                        {link.label}
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M2 10L10 2M10 2H5M10 2v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </a>
                    ))}
                  </div>
                </div>

                <div className="sidebar-card sidebar-card-plain">
                  <div className="sidebar-card-title">Other States</div>
                  <div className="sidebar-links">
                    {otherStates.map((s) => (
                      <Link key={s.slug} href={`/medicaid-eligibility/${s.slug}`} className="sidebar-link">
                        {s.name} Medicaid eligibility
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="sidebar-card sidebar-card-plain">
                  <div className="sidebar-card-title">
                    {state.expanded ? "✅ Expansion state" : "⚠️ Non-expansion state"}
                  </div>
                  <p className="sidebar-card-desc-plain">
                    {state.expanded
                      ? `${state.name} expanded Medicaid. Adults can qualify up to ${state.adultLimitPct}% FPL.`
                      : `${state.name} did not expand Medicaid. Adult income limits are very low.`}
                  </p>
                </div>
              </aside>

            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="bottom-cta">
          <div className="container">
            <div className="bottom-cta-inner">
              <h2 className="bottom-cta-title">Not sure if you qualify in {state.name}?</h2>
              <p className="bottom-cta-sub">Answer 5 quick questions and get your personalized {state.name} Medicaid eligibility result in 2 minutes. Free, no account needed.</p>
              <Link href="/quiz" className="bottom-cta-btn">
                Check My Eligibility — It&apos;s Free
              </Link>
              <p className="bottom-cta-note">No credit card · No account · Instant results</p>
            </div>
          </div>
        </div>

      </div>

      <style jsx>{`
        * { box-sizing: border-box; }

        .page {
          background: #f8fafc;
          color: #0f172a;
          font-family: 'DM Sans', ui-sans-serif, system-ui, -apple-system, sans-serif;
        }

        .container { max-width: 1100px; margin: 0 auto; padding: 0 24px; }

        .hero { background: #ffffff; border-bottom: 1px solid #e2e8f0; padding: 52px 0 56px; }

        .breadcrumb { display: flex; align-items: center; gap: 6px; font-size: 13px; color: #64748b; margin-bottom: 20px; flex-wrap: wrap; }
        .breadcrumb-link { color: #64748b; text-decoration: none; }
        .breadcrumb-link:hover { color: #0f172a; }
        .breadcrumb-sep { color: #cbd5e1; }
        .breadcrumb-cur { color: #475569; }

        .hero-tag { display: inline-block; padding: 5px 14px; border-radius: 999px; border: 1px solid #e2e8f0; background: #f8fafc; font-size: 12px; font-weight: 500; color: #64748b; margin-bottom: 18px; }

        .h1 { font-size: 42px; font-weight: 700; letter-spacing: -0.04em; line-height: 1.1; margin: 0 0 16px; color: #0f172a; }
        .h1-em { color: #0a3d6b; }
        .hero-sub { font-size: 17px; line-height: 1.7; color: #475569; max-width: 600px; margin: 0 0 28px; }
        .hero-cta { display: inline-flex; align-items: center; gap: 8px; padding: 14px 24px; border-radius: 12px; background: #0a3d6b; color: #fff; font-size: 15px; font-weight: 600; border: 1px solid #072d52; box-shadow: 0 4px 12px rgba(10,61,107,0.25); text-decoration: none; transition: background 140ms, transform 100ms; }
        .hero-cta:hover { background: #072d52; transform: translateY(-1px); }

        .answer-box { border-radius: 14px; padding: 20px 24px; margin: 32px 0; display: flex; gap: 14px; align-items: flex-start; }
        .answer-box-green { background: #f0fdf4; border: 1px solid #bbf7d0; }
        .answer-box-amber { background: #fffbeb; border: 1px solid #fde68a; }
        .answer-icon { font-size: 20px; flex-shrink: 0; margin-top: 2px; }
        .answer-title { font-size: 14px; font-weight: 700; color: #0f172a; margin-bottom: 6px; }
        .answer-text { font-size: 15px; color: #334155; line-height: 1.7; margin: 0; }

        .main { padding: 40px 0 60px; }
        .content-grid { display: grid; grid-template-columns: 1fr 300px; gap: 48px; align-items: start; }
        .article { min-width: 0; }

        .h2 { font-size: 26px; font-weight: 700; letter-spacing: -0.03em; color: #0f172a; margin: 40px 0 14px; line-height: 1.3; }
        .h2:first-child { margin-top: 0; }
        .p { font-size: 16px; color: #334155; line-height: 1.8; margin: 0 0 16px; }

        .group-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 20px 0 32px; }
        .group-card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px 20px; }
        .group-card-green { border-left: 3px solid #15803d; }
        .group-card-amber { border-left: 3px solid #d97706; }
        .group-card-title { display: flex; align-items: center; gap: 8px; font-size: 15px; font-weight: 600; color: #0f172a; margin-bottom: 8px; }
        .group-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
        .group-dot-green { background: #15803d; }
        .group-dot-amber { background: #d97706; }
        .group-card-desc { font-size: 14px; color: #475569; line-height: 1.65; margin: 0; }

        .table-wrap { overflow-x: auto; margin: 20px 0 32px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(15,23,42,0.06); }
        .table { width: 100%; border-collapse: collapse; font-size: 14px; }
        .table thead { background: #0a3d6b; }
        .table th { padding: 12px 16px; text-align: left; font-size: 13px; font-weight: 600; color: #ffffff; white-space: nowrap; }
        .table td { padding: 12px 16px; border-top: 1px solid #f1f5f9; color: #334155; }
        .table tr:hover td { background: #f8fafc; }
        .td-bold { font-weight: 600; color: #0f172a; }

        .info-box { border-radius: 12px; padding: 16px 20px; font-size: 14px; line-height: 1.7; margin: 20px 0 32px; }
        .info-box-blue { background: #eff6ff; border: 1px solid #bfdbfe; color: #1e3a5f; }
        .info-box-amber { background: #fffbeb; border: 1px solid #fde68a; color: #78350f; }

        .coverage-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 16px 0 32px; }
        .coverage-item { display: flex; align-items: center; gap: 10px; font-size: 14px; color: #334155; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px 14px; }

        .steps-list { display: flex; flex-direction: column; gap: 14px; margin: 16px 0 32px; }
        .step-item { display: flex; gap: 16px; align-items: flex-start; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px 20px; }
        .step-num { width: 32px; height: 32px; min-width: 32px; border-radius: 8px; background: #0a3d6b; color: #fff; font-size: 14px; font-weight: 700; display: flex; align-items: center; justify-content: center; }
        .step-title { font-size: 15px; font-weight: 600; color: #0f172a; margin-bottom: 4px; }
        .step-desc { font-size: 14px; color: #475569; line-height: 1.65; margin: 0; }

        .doc-list { list-style: none; padding: 0; margin: 16px 0 32px; display: flex; flex-direction: column; gap: 10px; }
        .doc-item { display: flex; align-items: flex-start; gap: 10px; font-size: 15px; color: #334155; line-height: 1.6; }

        .faq-list { display: flex; flex-direction: column; gap: 8px; margin: 16px 0; }
        .faq-item { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px 22px; }
        .faq-q { font-size: 15px; font-weight: 600; color: #0f172a; margin-bottom: 8px; }
        .faq-a { font-size: 14px; color: #475569; line-height: 1.75; }

        .sidebar { position: sticky; top: 80px; display: flex; flex-direction: column; gap: 16px; }
        .sidebar-card { background: #0a3d6b; border-radius: 16px; padding: 24px; }
        .sidebar-card-plain { background: #ffffff; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(15,23,42,0.06); }
        .sidebar-card-title { font-size: 16px; font-weight: 700; color: #ffffff; margin-bottom: 10px; }
        .sidebar-card-plain .sidebar-card-title { color: #0f172a; }
        .sidebar-card-desc { font-size: 14px; color: rgba(255,255,255,0.8); line-height: 1.65; margin: 0 0 18px; }
        .sidebar-card-desc-plain { font-size: 14px; color: #475569; line-height: 1.65; margin: 0; }
        .sidebar-cta { display: block; padding: 13px 16px; border-radius: 10px; background: #ffffff; color: #0a3d6b; font-size: 14px; font-weight: 600; text-align: center; text-decoration: none; transition: opacity 120ms; margin-bottom: 16px; }
        .sidebar-cta:hover { opacity: 0.92; }
        .sidebar-trust { display: flex; flex-direction: column; gap: 6px; }
        .sidebar-trust-item { font-size: 12px; color: rgba(255,255,255,0.7); }
        .sidebar-links { display: flex; flex-direction: column; gap: 2px; }
        .sidebar-link { display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; border-radius: 8px; font-size: 14px; color: #334155; text-decoration: none; transition: background 120ms; }
        .sidebar-link:hover { background: #f8fafc; color: #0a3d6b; }

        .bottom-cta { background: #0a3d6b; padding: 72px 0; margin-top: 40px; }
        .bottom-cta-inner { text-align: center; max-width: 520px; margin: 0 auto; }
        .bottom-cta-title { font-size: 32px; font-weight: 700; color: #fff; letter-spacing: -0.035em; margin: 0 0 12px; }
        .bottom-cta-sub { font-size: 16px; color: rgba(255,255,255,0.75); line-height: 1.65; margin: 0 0 28px; }
        .bottom-cta-btn { display: inline-flex; align-items: center; padding: 14px 28px; border-radius: 12px; background: #fff; color: #0a3d6b; font-size: 15px; font-weight: 600; text-decoration: none; transition: transform 120ms; }
        .bottom-cta-btn:hover { transform: translateY(-1px); }
        .bottom-cta-note { margin-top: 14px; font-size: 13px; color: rgba(255,255,255,0.5); }

        @media (max-width: 900px) {
          .content-grid { grid-template-columns: 1fr; }
          .sidebar { position: static; }
          .h1 { font-size: 32px; }
          .group-cards { grid-template-columns: 1fr; }
          .coverage-grid { grid-template-columns: 1fr; }
        }

        @media (max-width: 520px) {
          .h1 { font-size: 26px; }
          .hero { padding: 36px 0 40px; }
          .container { padding: 0 16px; }
          .bottom-cta-title { font-size: 26px; }
        }
      `}</style>
    </>
  );
}
