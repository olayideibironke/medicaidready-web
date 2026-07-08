import Head from "next/head";
import Link from "next/link";

const weeklyReports = [
  {
    title: "Remote Program Analyst Jobs Hiring This Week",
    eyebrow: "Weekly Hiring Report",
    summary:
      "Track remote Program Analyst openings, hiring signals, role patterns, salary ranges, and verified application links.",
    href: "/careers/jobs?query=Program%20Analyst&workMode=remote",
    metric: "Program Analyst",
    signal: "Remote demand",
  },
  {
    title: "Remote Data Analyst Jobs Hiring This Week",
    eyebrow: "Analytics Hiring",
    summary:
      "Explore remote Data Analyst roles across healthcare, technology, operations, finance, and public-sector employers.",
    href: "/careers/jobs?query=Data%20Analyst&workMode=remote",
    metric: "Data Analyst",
    signal: "Skills-driven",
  },
  {
    title: "Healthcare Analyst Jobs Hiring This Week",
    eyebrow: "Healthcare Careers",
    summary:
      "Reviewed healthcare analyst, claims, quality, EHR, Medicaid, compliance, and provider-data opportunities.",
    href: "/careers/jobs?query=Healthcare%20Analyst",
    metric: "Healthcare",
    signal: "Stable hiring",
  },
  {
    title: "Government & Public Sector Analyst Jobs",
    eyebrow: "Public Sector",
    summary:
      "Follow analyst, compliance, operations, contractor, program-support, and government-adjacent roles.",
    href: "/careers/jobs?query=Program%20Analyst",
    metric: "Public Sector",
    signal: "Career ladder",
  },
];

const marketSignals = [
  {
    label: "Verified discovery",
    value: "Reviewed links",
    detail:
      "Application links are checked during refresh cycles so job seekers waste less time on expired postings.",
  },
  {
    label: "Market direction",
    value: "Analyst growth",
    detail:
      "Program, data, business, operations, healthcare, compliance, and public-sector roles remain priority categories.",
  },
  {
    label: "Platform focus",
    value: "Career intelligence",
    detail:
      "MedicaidReady Careers is expanding beyond listings into reports, signals, employer research, and guidance.",
  },
];

const verificationItems = [
  {
    title: "Application links reviewed",
    detail: "Broken or expired apply links are identified during job audits.",
  },
  {
    title: "Duplicate listings cleaned",
    detail: "Duplicate title, company, location, and apply URL groups are reviewed before growth pushes.",
  },
  {
    title: "Fresh jobs imported",
    detail: "New approved roles are added through a controlled import process.",
  },
  {
    title: "Reports shaped by real activity",
    detail: "Insights are built around active jobs, employer movement, categories, and applicant needs.",
  },
];

const trendingCategories = [
  "Remote Program Analyst",
  "Remote Data Analyst",
  "Business Analyst",
  "Healthcare Analyst",
  "Government Contractor",
  "Compliance Analyst",
  "Operations Analyst",
  "Cybersecurity Analyst",
  "Cloud Support",
  "Provider Data",
  "Finance Analyst",
  "IT Specialist",
];

const salaryGuides = [
  {
    title: "Program Analyst Salary Guide",
    detail: "Role levels, public-sector pathways, remote ranges, and negotiation signals.",
    query: "Program Analyst",
  },
  {
    title: "Data Analyst Salary Guide",
    detail: "SQL, dashboards, Excel, Power BI, Python, and analytics compensation signals.",
    query: "Data Analyst",
  },
  {
    title: "Business Analyst Salary Guide",
    detail: "Requirements, operations, systems, product, and process improvement roles.",
    query: "Business Analyst",
  },
  {
    title: "Healthcare Analyst Salary Guide",
    detail: "Claims, quality, Medicaid, EHR, provider data, and compliance-focused roles.",
    query: "Healthcare Analyst",
  },
];

const careerGuides = [
  "How to Become a Program Analyst",
  "Remote Job Search Guide",
  "Resume Tips for Data Analysts",
  "Government Contractor Career Guide",
  "Healthcare Analytics Certifications",
  "Interview Prep for Analyst Roles",
  "Salary Negotiation for Career Switchers",
  "How to Read Job Descriptions Better",
];

const employerSpotlights = [
  {
    name: "CareFirst BlueCross BlueShield",
    focus: "Healthcare, data, operations",
  },
  {
    name: "GAP Solutions",
    focus: "Government support, program roles",
  },
  {
    name: "Kentro",
    focus: "Technology, federal contracting",
  },
  {
    name: "Amerit Fleet Solutions",
    focus: "Operations, field support",
  },
  {
    name: "GitHub",
    focus: "Technology, remote roles",
  },
  {
    name: "Blue Water Thinking",
    focus: "Healthcare consulting, analysis",
  },
];

const skillSignals = [
  "SQL",
  "Power BI",
  "Excel",
  "Python",
  "Tableau",
  "Project Management",
  "Azure",
  "Epic",
  "Compliance",
  "Data Reporting",
  "Stakeholder Support",
  "Process Improvement",
];

const intelligencePillars = [
  {
    title: "Jobs",
    detail: "Verified opportunities across analyst, healthcare, government, technology, compliance, and remote categories.",
  },
  {
    title: "Signals",
    detail: "Clear direction on what roles are growing, what skills employers want, and where hiring is moving.",
  },
  {
    title: "Employers",
    detail: "Employer spotlights, hiring volume patterns, role clusters, and companies worth watching.",
  },
  {
    title: "Guidance",
    detail: "Practical career guides for resumes, interviews, salary expectations, remote work, and career switching.",
  },
];

const editorialQueue = [
  "Remote Program Analyst Jobs This Week",
  "Remote Data Analyst Jobs This Week",
  "Healthcare Analyst Hiring Report",
  "Government Contractor Hiring Report",
  "Business Analyst Career Guide",
  "Skills Employers Want This Month",
];

const newsroomStats = [
  {
    value: "282",
    label: "Reviewed jobs",
  },
  {
    value: "0",
    label: "Broken links",
  },
  {
    value: "0",
    label: "Duplicate apply URLs",
  },
];

function jobSearchHref(query: string) {
  return `/careers/jobs?query=${encodeURIComponent(query)}`;
}

export default function CareerInsightsPage() {
  return (
    <>
      <Head>
        <title>Career Insights | MedicaidReady Careers</title>
        <meta
          name="description"
          content="MedicaidReady Career Insights provides weekly hiring reports, salary intelligence, employer spotlights, skill trends, and verified job market updates for analyst, healthcare, government, technology, and remote roles."
        />
        <meta property="og:title" content="Career Insights | MedicaidReady Careers" />
        <meta
          property="og:description"
          content="Weekly hiring reports, salary intelligence, employer spotlights, skill trends, and verified job market updates."
        />
      </Head>

      <main className="min-h-screen bg-[#061b3a] text-white">
        <section className="relative overflow-hidden border-b border-white/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,185,66,0.22),transparent_36%),radial-gradient(circle_at_left,rgba(42,133,255,0.18),transparent_38%)]" />
          <div className="absolute left-1/2 top-20 h-72 w-72 -translate-x-1/2 rounded-full bg-[#f5b942]/10 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-6 py-8">
            <nav className="mb-14 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/[0.06] px-5 py-4 shadow-2xl shadow-black/20 backdrop-blur">
              <Link href="/careers" className="text-xl font-black tracking-tight">
                MedicaidReady <span className="text-[#f5b942]">Careers</span>
              </Link>

              <div className="flex flex-wrap gap-4 text-sm font-semibold text-white/75">
                <Link href="/careers/jobs" className="hover:text-white">
                  Find Jobs
                </Link>
                <Link href="/careers/companies" className="hover:text-white">
                  Companies
                </Link>
                <Link href="/careers/insights" className="text-[#f5b942]">
                  Career Insights
                </Link>
                <Link href="/careers/resources" className="hover:text-white">
                  Career Resources
                </Link>
                <Link href="/careers/employers" className="hover:text-white">
                  For Employers
                </Link>
              </div>
            </nav>

            <div className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
              <div>
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#f5b942]/30 bg-[#f5b942]/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-[#f5b942]">
                  Career Intelligence Center
                </div>

                <h1 className="max-w-5xl text-4xl font-black leading-tight tracking-tight md:text-6xl">
                  Understand the hiring market before you apply.
                </h1>

                <p className="mt-6 max-w-2xl text-lg leading-8 text-white/75">
                  MedicaidReady Careers combines verified jobs with weekly hiring
                  reports, market signals, salary intelligence, employer spotlights,
                  and practical guidance for modern professionals.
                </p>

                <div className="mt-8 flex flex-wrap gap-4">
                  <Link
                    href="#reports"
                    className="rounded-full bg-[#f5b942] px-6 py-3 text-sm font-black text-[#061b3a] shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:bg-[#ffd978]"
                  >
                    View Hiring Reports
                  </Link>
                  <Link
                    href="/careers/jobs"
                    className="rounded-full border border-white/20 px-6 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-white/10"
                  >
                    Browse Verified Jobs
                  </Link>
                </div>

                <div className="mt-10 grid max-w-2xl gap-3 sm:grid-cols-3">
                  {newsroomStats.map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-3xl border border-white/10 bg-white/[0.07] p-5"
                    >
                      <div className="text-3xl font-black text-[#f5b942]">
                        {stat.value}
                      </div>
                      <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-white/60">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/10 p-5 shadow-2xl shadow-black/30 backdrop-blur">
                <div className="rounded-[1.5rem] bg-white p-6 text-[#061b3a]">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-black uppercase tracking-[0.2em] text-[#1f7ae0]">
                      Verification Standard
                    </p>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                      Active
                    </span>
                  </div>

                  <h2 className="mt-4 text-2xl font-black">
                    Cleaner job discovery, stronger career decisions.
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    The platform is maintained around a simple promise: help people
                    spend less time chasing bad listings and more time applying with
                    direction.
                  </p>

                  <div className="mt-6 grid gap-3">
                    {verificationItems.map((item) => (
                      <div key={item.title} className="rounded-2xl bg-slate-50 p-4">
                        <p className="font-black">✓ {item.title}</p>
                        <p className="mt-1 text-sm leading-6 text-slate-600">
                          {item.detail}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {marketSignals.map((signal) => (
                <div
                  key={signal.label}
                  className="rounded-3xl border border-white/10 bg-white/[0.07] p-5 shadow-xl shadow-black/10"
                >
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-[#f5b942]">
                    {signal.label}
                  </p>
                  <div className="mt-3 text-2xl font-black">{signal.value}</div>
                  <p className="mt-2 text-sm leading-6 text-white/65">
                    {signal.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-white/10 bg-white/[0.035]">
          <div className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.22em] text-[#f5b942]">
                This Week&apos;s Brief
              </p>
              <h2 className="mt-2 text-2xl font-black">What job seekers should watch.</h2>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-[#061b3a] p-5">
                <p className="text-sm font-black text-[#f5b942]">Roles</p>
                <p className="mt-2 text-sm leading-6 text-white/70">
                  Analyst, compliance, operations, technology, and public-sector
                  jobs continue to shape the platform.
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-[#061b3a] p-5">
                <p className="text-sm font-black text-[#f5b942]">Skills</p>
                <p className="mt-2 text-sm leading-6 text-white/70">
                  SQL, Excel, Power BI, reporting, project coordination, and
                  stakeholder support remain strong signals.
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-[#061b3a] p-5">
                <p className="text-sm font-black text-[#f5b942]">Strategy</p>
                <p className="mt-2 text-sm leading-6 text-white/70">
                  Apply smarter by tracking employers, role clusters, salary ranges,
                  and weekly hiring movement.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="reports" className="mx-auto max-w-7xl px-6 py-16">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.22em] text-[#f5b942]">
                Weekly Hiring Reports
              </p>
              <h2 className="mt-2 text-3xl font-black md:text-4xl">
                Fresh reports for serious job seekers.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65">
                Reports are designed to help professionals understand where hiring is
                active, what kinds of roles are appearing, and where to focus next.
              </p>
            </div>
            <Link href="/careers/jobs" className="text-sm font-black text-[#f5b942]">
              Browse all jobs →
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {weeklyReports.map((report) => (
              <Link
                key={report.title}
                href={report.href}
                className="group rounded-[2rem] border border-white/10 bg-white/[0.07] p-6 shadow-xl shadow-black/10 transition duration-300 hover:-translate-y-1 hover:bg-white/[0.11]"
              >
                <div className="flex items-start justify-between gap-4">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-[#f5b942]">
                    {report.eyebrow}
                  </p>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/70">
                    {report.signal}
                  </span>
                </div>
                <h3 className="mt-4 text-2xl font-black leading-tight">
                  {report.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-white/65">
                  {report.summary}
                </p>
                <div className="mt-6 flex items-center justify-between gap-4">
                  <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs font-bold text-white/65">
                    {report.metric}
                  </span>
                  <span className="text-sm font-black text-[#f5b942] transition group-hover:translate-x-1">
                    Read report →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-8">
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-[2rem] bg-white p-7 text-[#061b3a] shadow-2xl shadow-black/20">
              <p className="text-sm font-black uppercase tracking-[0.22em] text-[#1f7ae0]">
                Trending Categories
              </p>
              <h2 className="mt-3 text-3xl font-black">Where hiring is moving.</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                These categories reflect the broader direction of MedicaidReady
                Careers as it expands into a true career intelligence platform.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                {trendingCategories.map((category) => (
                  <Link
                    key={category}
                    href={jobSearchHref(category)}
                    className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-bold transition hover:-translate-y-0.5 hover:border-[#f5b942] hover:bg-white"
                  >
                    {category}
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-7 shadow-2xl shadow-black/10">
              <p className="text-sm font-black uppercase tracking-[0.22em] text-[#f5b942]">
                Skills Intelligence
              </p>
              <h2 className="mt-3 text-3xl font-black">Skills employers keep asking for.</h2>
              <p className="mt-3 text-sm leading-6 text-white/65">
                Skills intelligence will help job seekers quickly see which keywords,
                tools, and capabilities appear across active roles.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {skillSignals.map((skill) => (
                  <Link
                    key={skill}
                    href={jobSearchHref(skill)}
                    className="rounded-2xl border border-white/10 bg-white/[0.07] p-4 text-center text-sm font-black transition hover:-translate-y-0.5 hover:bg-white/[0.12]"
                  >
                    {skill}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-12">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-7">
            <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.22em] text-[#f5b942]">
                  Employer Intelligence
                </p>
                <h2 className="mt-3 text-3xl font-black">Employers to watch.</h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65">
                  Employer spotlights will help job seekers understand who is hiring,
                  what kinds of roles are active, and where opportunities may be growing.
                </p>
              </div>
              <Link
                href="/careers/companies"
                className="rounded-full border border-white/20 px-5 py-3 text-sm font-black text-white transition hover:bg-white/10"
              >
                Browse Companies
              </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {employerSpotlights.map((employer) => (
                <Link
                  key={employer.name}
                  href={jobSearchHref(employer.name)}
                  className="rounded-3xl border border-white/10 bg-[#061b3a] p-5 transition hover:-translate-y-1 hover:bg-[#08244c]"
                >
                  <p className="text-lg font-black">{employer.name}</p>
                  <p className="mt-2 text-sm leading-6 text-white/60">
                    {employer.focus}
                  </p>
                  <p className="mt-5 text-sm font-black text-[#f5b942]">
                    View related roles →
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-6 px-6 py-12 lg:grid-cols-2">
          <div className="rounded-[2rem] bg-white p-7 text-[#061b3a] shadow-2xl shadow-black/20">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-[#1f7ae0]">
              Salary Center
            </p>
            <h2 className="mt-3 text-3xl font-black">Salary intelligence for smarter applications.</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Salary pages will help professionals understand expected ranges before
              they apply, interview, or negotiate.
            </p>

            <div className="mt-6 grid gap-3">
              {salaryGuides.map((guide) => (
                <Link
                  key={guide.title}
                  href={jobSearchHref(guide.query)}
                  className="rounded-2xl border border-slate-200 p-4 transition hover:-translate-y-0.5 hover:bg-slate-50"
                >
                  <p className="font-black">{guide.title} →</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {guide.detail}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] bg-[#f5b942] p-7 text-[#061b3a] shadow-2xl shadow-black/20">
            <p className="text-sm font-black uppercase tracking-[0.22em]">
              Career Guides
            </p>
            <h2 className="mt-3 text-3xl font-black">Practical help before the application.</h2>
            <p className="mt-3 text-sm font-semibold leading-6 text-[#061b3a]/75">
              Career guides will support resumes, interviews, skills,
              certifications, remote work, salary negotiation, and realistic next
              steps.
            </p>

            <div className="mt-6 grid gap-3">
              {careerGuides.map((guide) => (
                <Link
                  key={guide}
                  href="/careers/resources"
                  className="rounded-2xl bg-white/75 p-4 font-black transition hover:-translate-y-0.5 hover:bg-white"
                >
                  {guide} →
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-7">
              <p className="text-sm font-black uppercase tracking-[0.22em] text-[#f5b942]">
                Editorial Roadmap
              </p>
              <h2 className="mt-3 text-3xl font-black">The next layer of authority.</h2>
              <p className="mt-3 text-sm leading-6 text-white/65">
                The long-term advantage is publishing useful career intelligence
                consistently, so professionals return even when they are not applying
                the same day.
              </p>

              <div className="mt-6 grid gap-3">
                {editorialQueue.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 font-bold"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] bg-white p-7 text-[#061b3a]">
              <p className="text-sm font-black uppercase tracking-[0.22em] text-[#1f7ae0]">
                Intelligence Platform
              </p>
              <h2 className="mt-3 text-3xl font-black">Not another job board.</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                MedicaidReady Careers is being built around the full decision cycle:
                discover jobs, understand the market, identify skills, compare
                employers, and apply with confidence.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {intelligencePillars.map((pillar) => (
                  <div key={pillar.title} className="rounded-3xl bg-slate-50 p-5">
                    <p className="text-xl font-black">{pillar.title}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {pillar.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-12 pb-20">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.07] p-8 text-center shadow-2xl shadow-black/20">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(245,185,66,0.18),transparent_34%)]" />
            <div className="relative">
              <p className="text-sm font-black uppercase tracking-[0.22em] text-[#f5b942]">
                Career Intelligence Platform
              </p>
              <h2 className="mt-3 text-3xl font-black md:text-4xl">
                The place professionals visit before they move.
              </h2>
              <p className="mx-auto mt-4 max-w-3xl text-white/70">
                MedicaidReady Careers is evolving into a trusted destination for
                verified opportunities, hiring trends, salary signals, employer
                research, skill intelligence, and practical career guidance.
              </p>

              <div className="mt-7 flex flex-wrap justify-center gap-4">
                <Link
                  href="/careers/jobs"
                  className="rounded-full bg-[#f5b942] px-7 py-3 text-sm font-black text-[#061b3a] transition hover:-translate-y-0.5 hover:bg-[#ffd978]"
                >
                  Browse Verified Jobs
                </Link>
                <Link
                  href="/careers/resources"
                  className="rounded-full border border-white/20 px-7 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-white/10"
                >
                  Explore Resources
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}