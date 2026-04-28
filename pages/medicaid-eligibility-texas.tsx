import Head from "next/head";
import Link from "next/link";

export default function MedicaidEligibilityTexas() {
  return (
    <>
      <Head>
        <title>Medicaid Eligibility in Texas 2026 — Do You Qualify?</title>
        <meta
          name="description"
          content="Find out if you qualify for Medicaid in Texas in 2026. Income limits, eligibility requirements, how to apply, and what's covered. Free eligibility check in 2 minutes."
        />
        <meta property="og:title" content="Medicaid Eligibility in Texas 2026 — Do You Qualify?" />
        <meta property="og:description" content="Texas Medicaid income limits, eligibility rules, and how to apply in 2026. Free check in 2 minutes." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://medicaidready.org/medicaid-eligibility-texas" />
        <link rel="canonical" href="https://medicaidready.org/medicaid-eligibility-texas" />
      </Head>

      <div className="page">

        {/* Hero */}
        <div className="hero">
          <div className="container">
            <div className="breadcrumb">
              <Link href="/" className="breadcrumb-link">Home</Link>
              <span className="breadcrumb-sep">›</span>
              <span className="breadcrumb-cur">Texas Medicaid Eligibility</span>
            </div>
            <div className="hero-tag">Updated for 2026 · Texas</div>
            <h1 className="h1">Medicaid Eligibility in Texas:<br /><span className="h1-em">Do You Qualify in 2026?</span></h1>
            <p className="hero-sub">
              Texas has some of the strictest Medicaid rules in the country — but millions of Texans still qualify.
              Here is everything you need to know about income limits, who qualifies, and how to apply.
            </p>
            <Link href="/quiz" className="hero-cta">
              Check My Eligibility Free — 2 Minutes
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>

        {/* Quick answer box */}
        <div className="container">
          <div className="answer-box">
            <div className="answer-box-title">
              <span className="answer-icon">💡</span>
              Quick Answer
            </div>
            <p className="answer-text">
              Texas <strong>did not expand Medicaid</strong> under the ACA, which means income limits are much lower than in most states.
              However, children, pregnant women, parents of dependent children, seniors, and people with disabilities
              may still qualify. If you are a single adult without children, qualifying is very difficult in Texas
              unless you have a disability.
            </p>
          </div>
        </div>

        {/* Main content */}
        <div className="main">
          <div className="container">
            <div className="content-grid">

              {/* Article content */}
              <article className="article">

                <h2 className="h2">Who Qualifies for Medicaid in Texas?</h2>
                <p className="p">
                  Texas Medicaid is divided into several programs, each covering a different group of people.
                  Unlike states that expanded Medicaid, Texas does not offer coverage to all low-income adults.
                  Here are the main groups who can qualify:
                </p>

                <div className="group-cards">
                  {[
                    { title: "Children", desc: "Children under 19 in households earning up to 198% of the federal poverty level (FPL) qualify through Medicaid or CHIP. This is one of the most accessible programs in Texas.", highlight: true },
                    { title: "Pregnant women", desc: "Pregnant women qualify up to 198% FPL for pregnancy-related services. Coverage includes prenatal care, labor and delivery, and 12 months of postpartum care.", highlight: true },
                    { title: "Parents and caretakers", desc: "Parents or caretakers of dependent children may qualify at very low income levels — often below 15% FPL for a family of three, which is around $370/month.", highlight: false },
                    { title: "Seniors (65+)", desc: "Adults 65 and older may qualify for Medicaid to cover long-term care, nursing home costs, and services not covered by Medicare.", highlight: true },
                    { title: "People with disabilities", desc: "Adults with qualifying physical or mental disabilities may qualify regardless of age, based on both income and disability status.", highlight: true },
                    { title: "Single adults without children", desc: "This is the hardest group to qualify in Texas. Without a disability or qualifying condition, most single adults do not qualify for Medicaid in Texas.", highlight: false },
                  ].map((group) => (
                    <div key={group.title} className={`group-card ${group.highlight ? "group-card-highlight" : "group-card-dim"}`}>
                      <div className="group-card-title">
                        <span className={`group-dot ${group.highlight ? "group-dot-green" : "group-dot-amber"}`} />
                        {group.title}
                      </div>
                      <p className="group-card-desc">{group.desc}</p>
                    </div>
                  ))}
                </div>

                <h2 className="h2">Texas Medicaid Income Limits 2026</h2>
                <p className="p">
                  Income limits in Texas are based on the federal poverty level (FPL) and vary depending on your
                  household size and which program you are applying for. Here are the key limits:
                </p>

                <div className="table-wrap">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Program</th>
                        <th>Income limit</th>
                        <th>Household of 1</th>
                        <th>Household of 3</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { program: "Children (Medicaid)", limit: "Up to 138% FPL", one: "~$1,732/mo", three: "~$2,972/mo" },
                        { program: "Children (CHIP)", limit: "138%–198% FPL", one: "~$2,486/mo", three: "~$4,264/mo" },
                        { program: "Pregnant women", limit: "Up to 198% FPL", one: "~$2,486/mo", three: "~$4,264/mo" },
                        { program: "Parents/caretakers", limit: "Up to ~15% FPL", one: "N/A", three: "~$370/mo" },
                        { program: "Seniors (65+)", limit: "Varies by program", one: "Varies", three: "Varies" },
                        { program: "Adults with disabilities", limit: "Varies by program", one: "Varies", three: "Varies" },
                      ].map((row, i) => (
                        <tr key={i}>
                          <td className="td-bold">{row.program}</td>
                          <td>{row.limit}</td>
                          <td>{row.one}</td>
                          <td>{row.three}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="info-box">
                  <strong>Important:</strong> Texas did not expand Medicaid under the Affordable Care Act. This means
                  the income limits for adults without children are among the lowest in the country. If you are a
                  single adult without a disability, you likely will not qualify for Medicaid in Texas — but you
                  may qualify for subsidized coverage through the ACA marketplace at healthcare.gov.
                </div>

                <h2 className="h2">What Does Texas Medicaid Cover?</h2>
                <p className="p">Texas Medicaid covers a wide range of healthcare services including:</p>

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

                <h2 className="h2">How to Apply for Medicaid in Texas</h2>
                <p className="p">
                  There are four ways to apply for Medicaid in Texas:
                </p>

                <div className="steps-list">
                  {[
                    { num: "1", title: "Apply online", desc: "Visit YourTexasBenefits.com to apply online. This is the fastest method and available 24/7." },
                    { num: "2", title: "Apply by phone", desc: "Call 2-1-1 and select option 2 to speak with a benefits counselor who can help you apply over the phone." },
                    { num: "3", title: "Apply in person", desc: "Visit your local Health and Human Services office. Bring documents including proof of identity, income, and residency." },
                    { num: "4", title: "Apply by mail", desc: "Download the paper application from hhs.texas.gov and mail it to your local HHS office." },
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
                <p className="p">When applying for Texas Medicaid, gather these documents in advance:</p>
                <ul className="doc-list">
                  {[
                    "Proof of identity (driver's license, state ID, or passport)",
                    "Proof of Texas residency (utility bill, lease, or bank statement)",
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

                <h2 className="h2">How Long Does Approval Take in Texas?</h2>
                <p className="p">
                  Texas is required to process most Medicaid applications within 45 days. For disability-related
                  applications the limit is 90 days. Pregnancy applications are often processed faster — sometimes
                  within a few days — because of the urgency of prenatal care.
                </p>
                <p className="p">
                  If your application is approved, coverage may be backdated up to 3 months before your application
                  date in some cases. This means medical bills you already have may be covered retroactively.
                </p>

                <h2 className="h2">What If You Are Denied?</h2>
                <p className="p">
                  If Texas denies your Medicaid application, you have the right to appeal. Here is what to do:
                </p>
                <div className="info-box">
                  <strong>Appeal deadline:</strong> You have 90 days from the date of your denial notice to request
                  a fair hearing. Do not miss this window. Call 2-1-1 or visit YourTexasBenefits.com to request your appeal.
                  Many denials are overturned on appeal — especially if you provide additional documentation.
                </div>

                <h2 className="h2">Frequently Asked Questions</h2>
                <div className="faq-list">
                  {[
                    { q: "Does Texas have expanded Medicaid?", a: "No. Texas is one of the few states that has not expanded Medicaid under the ACA. This means income limits for adults are much lower than in expansion states. Single adults without children or a disability generally do not qualify." },
                    { q: "Can I get Medicaid if I am working in Texas?", a: "Yes — being employed does not automatically disqualify you. What matters is your total household income compared to the income limit for your program. Many working parents and pregnant women qualify even with a job." },
                    { q: "How long does Texas Medicaid last?", a: "Once approved, Medicaid coverage is reviewed annually. You will receive a renewal notice and must confirm your income and household information each year to maintain coverage." },
                    { q: "Can undocumented immigrants get Medicaid in Texas?", a: "Generally no — full Medicaid requires proof of citizenship or eligible immigration status. However, emergency Medicaid is available to anyone regardless of immigration status for emergency medical conditions." },
                    { q: "What is CHIP and how is it different from Medicaid?", a: "CHIP (Children's Health Insurance Program) covers children in households that earn too much for Medicaid but still can't afford private insurance. In Texas, CHIP covers children up to 198% FPL. It has small premiums and co-pays unlike standard Medicaid." },
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
                    Not sure if you qualify? Answer 5 quick questions and get your personalized result in 2 minutes. Free, no account needed.
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
                  <div className="sidebar-card-title">Texas Medicaid Resources</div>
                  <div className="sidebar-links">
                    {[
                      { label: "Apply online", url: "https://www.yourtexasbenefits.com" },
                      { label: "Texas HHS website", url: "https://hhs.texas.gov/medicaid" },
                      { label: "Call 2-1-1 for help", url: "tel:211" },
                      { label: "Find a local HHS office", url: "https://hhs.texas.gov/about-hhs/find-us/office-locations" },
                    ].map((link) => (
                      <a key={link.label} href={link.url} className="sidebar-link" target="_blank" rel="noopener noreferrer">
                        {link.label}
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                          <path d="M2 10L10 2M10 2H5M10 2v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </a>
                    ))}
                  </div>
                </div>

                <div className="sidebar-card sidebar-card-plain">
                  <div className="sidebar-card-title">Other States</div>
                  <div className="sidebar-links">
                    {[
                      { label: "Florida Medicaid eligibility", url: "/medicaid-eligibility-florida" },
                      { label: "California Medicaid eligibility", url: "/medicaid-eligibility-california" },
                      { label: "New York Medicaid eligibility", url: "/medicaid-eligibility-new-york" },
                      { label: "Georgia Medicaid eligibility", url: "/medicaid-eligibility-georgia" },
                    ].map((link) => (
                      <Link key={link.label} href={link.url} className="sidebar-link">
                        {link.label}
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                          <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </Link>
                    ))}
                  </div>
                </div>
              </aside>

            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="bottom-cta">
          <div className="container">
            <div className="bottom-cta-inner">
              <h2 className="bottom-cta-title">Not sure if you qualify?</h2>
              <p className="bottom-cta-sub">Answer 5 quick questions and get your personalized Texas Medicaid eligibility result in 2 minutes. Free, no account needed.</p>
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

        /* Hero */
        .hero { background: #ffffff; border-bottom: 1px solid #e2e8f0; padding: 52px 0 56px; }

        .breadcrumb { display: flex; align-items: center; gap: 6px; font-size: 13px; color: #64748b; margin-bottom: 20px; }
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

        /* Answer box */
        .answer-box { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 14px; padding: 20px 24px; margin: 32px 0; display: flex; gap: 14px; align-items: flex-start; }
        .answer-icon { font-size: 20px; flex-shrink: 0; margin-top: 2px; }
        .answer-box-title { font-size: 14px; font-weight: 700; color: #1e40af; margin-bottom: 6px; }
        .answer-text { font-size: 15px; color: #1e3a5f; line-height: 1.7; margin: 0; }

        /* Main */
        .main { padding: 40px 0 60px; }

        .content-grid { display: grid; grid-template-columns: 1fr 300px; gap: 48px; align-items: start; }

        /* Article */
        .article { min-width: 0; }

        .h2 { font-size: 26px; font-weight: 700; letter-spacing: -0.03em; color: #0f172a; margin: 40px 0 14px; line-height: 1.3; }
        .h2:first-child { margin-top: 0; }

        .p { font-size: 16px; color: #334155; line-height: 1.8; margin: 0 0 16px; }

        /* Group cards */
        .group-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 20px 0 32px; }

        .group-card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px 20px; }
        .group-card-highlight { border-left: 3px solid #15803d; }
        .group-card-dim { border-left: 3px solid #d97706; }

        .group-card-title { display: flex; align-items: center; gap: 8px; font-size: 15px; font-weight: 600; color: #0f172a; margin-bottom: 8px; }
        .group-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
        .group-dot-green { background: #15803d; }
        .group-dot-amber { background: #d97706; }
        .group-card-desc { font-size: 14px; color: #475569; line-height: 1.65; margin: 0; }

        /* Table */
        .table-wrap { overflow-x: auto; margin: 20px 0 32px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(15,23,42,0.06); }
        .table { width: 100%; border-collapse: collapse; font-size: 14px; }
        .table thead { background: #0a3d6b; }
        .table th { padding: 12px 16px; text-align: left; font-size: 13px; font-weight: 600; color: #ffffff; white-space: nowrap; }
        .table td { padding: 12px 16px; border-top: 1px solid #f1f5f9; color: #334155; }
        .table tr:hover td { background: #f8fafc; }
        .td-bold { font-weight: 600; color: #0f172a; }

        /* Info box */
        .info-box { background: #fffbeb; border: 1px solid #fde68a; border-radius: 12px; padding: 16px 20px; font-size: 14px; color: #78350f; line-height: 1.7; margin: 20px 0 32px; }

        /* Coverage grid */
        .coverage-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 16px 0 32px; }
        .coverage-item { display: flex; align-items: center; gap: 10px; font-size: 14px; color: #334155; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px 14px; }

        /* Steps */
        .steps-list { display: flex; flex-direction: column; gap: 14px; margin: 16px 0 32px; }
        .step-item { display: flex; gap: 16px; align-items: flex-start; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px 20px; }
        .step-num { width: 32px; height: 32px; min-width: 32px; border-radius: 8px; background: #0a3d6b; color: #fff; font-size: 14px; font-weight: 700; display: flex; align-items: center; justify-content: center; }
        .step-title { font-size: 15px; font-weight: 600; color: #0f172a; margin-bottom: 4px; }
        .step-desc { font-size: 14px; color: #475569; line-height: 1.65; margin: 0; }

        /* Doc list */
        .doc-list { list-style: none; padding: 0; margin: 16px 0 32px; display: flex; flex-direction: column; gap: 10px; }
        .doc-item { display: flex; align-items: flex-start; gap: 10px; font-size: 15px; color: #334155; line-height: 1.6; }

        /* FAQ */
        .faq-list { display: flex; flex-direction: column; gap: 8px; margin: 16px 0; }
        .faq-item { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px 22px; }
        .faq-q { font-size: 15px; font-weight: 600; color: #0f172a; margin-bottom: 8px; }
        .faq-a { font-size: 14px; color: #475569; line-height: 1.75; }

        /* Sidebar */
        .sidebar { position: sticky; top: 80px; display: flex; flex-direction: column; gap: 16px; }

        .sidebar-card { background: #0a3d6b; border-radius: 16px; padding: 24px; }
        .sidebar-card-plain { background: #ffffff; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(15,23,42,0.06); }

        .sidebar-card-title { font-size: 16px; font-weight: 700; color: #ffffff; margin-bottom: 10px; }
        .sidebar-card-plain .sidebar-card-title { color: #0f172a; }

        .sidebar-card-desc { font-size: 14px; color: rgba(255,255,255,0.8); line-height: 1.65; margin: 0 0 18px; }

        .sidebar-cta { display: block; padding: 13px 16px; border-radius: 10px; background: #ffffff; color: #0a3d6b; font-size: 14px; font-weight: 600; text-align: center; text-decoration: none; transition: opacity 120ms; margin-bottom: 16px; }
        .sidebar-cta:hover { opacity: 0.92; }

        .sidebar-trust { display: flex; flex-direction: column; gap: 6px; }
        .sidebar-trust-item { font-size: 12px; color: rgba(255,255,255,0.7); }

        .sidebar-links { display: flex; flex-direction: column; gap: 2px; }
        .sidebar-link { display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; border-radius: 8px; font-size: 14px; color: #334155; text-decoration: none; transition: background 120ms; }
        .sidebar-link:hover { background: #f8fafc; color: #0a3d6b; }

        /* Bottom CTA */
        .bottom-cta { background: #0a3d6b; padding: 72px 0; margin-top: 40px; }
        .bottom-cta-inner { text-align: center; max-width: 520px; margin: 0 auto; }
        .bottom-cta-title { font-size: 32px; font-weight: 700; color: #fff; letter-spacing: -0.035em; margin: 0 0 12px; }
        .bottom-cta-sub { font-size: 16px; color: rgba(255,255,255,0.75); line-height: 1.65; margin: 0 0 28px; }
        .bottom-cta-btn { display: inline-flex; align-items: center; padding: 14px 28px; border-radius: 12px; background: #fff; color: #0a3d6b; font-size: 15px; font-weight: 600; text-decoration: none; transition: transform 120ms; }
        .bottom-cta-btn:hover { transform: translateY(-1px); }
        .bottom-cta-note { margin-top: 14px; font-size: 13px; color: rgba(255,255,255,0.5); }

        /* Responsive */
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
