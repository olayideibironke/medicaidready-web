import Head from "next/head";
import Link from "next/link";

const hiringIndicators = [
  {
    label: "Verified job listings",
    value: "282",
    detail: "Active jobs reviewed after the latest refresh",
  },
  {
    label: "Broken links",
    value: "0",
    detail: "Application links cleared after audit cleanup",
  },
  {
    label: "Duplicate groups",
    value: "0",
    detail: "Duplicate title, company, and location groups removed",
  },
  {
    label: "Job categories tracked",
    value: "7+",
    detail: "Analyst, healthcare, finance, quality, remote, public sector, and more",
  },
];

const trendingCategories = [
  {
    title: "Remote Program Analyst",
    description:
      "Operational, policy, compliance, and workforce roles with remote or hybrid flexibility.",
    href: "/careers/jobs?query=Program%20Analyst",
    signal: "Strong remote interest",
  },
  {
    title: "Healthcare Analyst",
    description:
      "Healthcare operations, Medicaid, quality improvement, claims, and population health roles.",
    href: "/careers/jobs?query=Healthcare%20Analyst",
    signal: "High mission alignment",
  },
  {
    title: "Data Analyst",
    description:
      "Reporting, dashboards, SQL, Excel, Power BI, healthcare data, and business intelligence roles.",
    href: "/careers/jobs?query=Data%20Analyst",
    signal: "Consistent hiring demand",
  },
  {
    title: "Business Analyst",
    description:
      "Process improvement, requirements, stakeholder support, systems analysis, and documentation roles.",
    href: "/careers/jobs?query=Business%20Analyst",
    signal: "Reliable career pathway",
  },
];

const weeklyReports = [
  {
    title: "Remote Program Analyst Jobs Hiring This Week",
    summary:
      "A weekly look at verified remote and hybrid Program Analyst opportunities across healthcare, public sector, nonprofit, and operations teams.",
    status: "Live report",
    href: "/careers/insights/remote-program-analyst-jobs-this-week",
  },
  {
    title: "Remote Data Analyst Jobs Hiring This Week",
    summary:
      "Freshly reviewed Data Analyst roles focused on reporting, dashboards, healthcare data, Excel, SQL, and business intelligence.",
    status: "Live report",
    href: "/careers/insights/remote-data-analyst-jobs-this-week",
  },
  {
    title: "Healthcare Analyst Jobs Hiring This Week",
    summary:
      "Verified healthcare analyst opportunities connected to Medicaid, claims, operations, quality improvement, and care coordination.",
    status: "Live report",
    href: "/careers/insights/healthcare-analyst-jobs-this-week",
  },
];

const salarySnapshots = [
  {
    role: "Program Analyst",
    range: "$68k – $115k",
    note: "Higher ranges often appear in government, healthcare, compliance, and grants-related roles.",
  },
  {
    role: "Data Analyst",
    range: "$72k – $120k",
    note: "Roles requiring SQL, Power BI, Tableau, Python, or healthcare data experience often trend higher.",
  },
  {
    role: "Healthcare Analyst",
    range: "$70k – $118k",
    note: "Medicaid, claims, utilization, quality, and population health experience can improve competitiveness.",
  },
];

const verificationStandards = [
  "Active listings reviewed regularly",
  "Expired opportunities removed",
  "Duplicate listings cleaned before publication",
  "Application links reviewed before job refreshes are finalized",
  "Career reports built from real hiring activity",
];

const featuredEmployers = [
  "Healthcare organizations",
  "Government agencies",
  "Managed care teams",
  "Public health programs",
  "Nonprofit service providers",
  "Remote-first operations teams",
];

export default function CareersInsightsPage() {
  return (
    <>
      <Head>
        <title>Career Insights Center | MedicaidReady Careers</title>
        <meta
          name="description"
          content="Hiring trends, salary insights, and verified opportunities from MedicaidReady Careers. Explore weekly job market signals, verified listings, and career intelligence for healthcare, analyst, and public sector roles."
        />
      </Head>

      <main className="min-h-screen bg-slate-950 text-white">
        <section className="relative overflow-hidden border-b border-white/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(245,196,80,0.18),_transparent_32%),radial-gradient(circle_at_75%_10%,_rgba(59,130,246,0.18),_transparent_30%)]" />
          <div className="relative mx-auto max-w-7xl px-6 py-16 sm:py-20 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <div className="mb-5 inline-flex items-center rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-sm font-semibold text-amber-200">
                  MedicaidReady Career Insights
                </div>

                <h1 className="max-w-4xl text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                  Hiring trends, salary insights, and verified opportunities.
                </h1>

                <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
                  A premium career intelligence center built for job seekers who
                  want cleaner listings, stronger market signals, and verified
                  application paths across healthcare, analyst, public sector,
                  nonprofit, and remote career tracks.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/careers/jobs"
                    className="inline-flex items-center justify-center rounded-full bg-amber-400 px-6 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-amber-400/20 transition hover:bg-amber-300"
                  >
                    Browse verified jobs
                  </Link>
                  <Link
                    href="/careers"
                    className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
                  >
                    Back to Careers
                  </Link>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-2xl backdrop-blur">
                <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-5">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-200">
                      Verification Summary
                    </p>
                    <h2 className="mt-2 text-2xl font-bold text-white">
                      Clean job data, stronger search confidence.
                    </h2>
                  </div>
                  <div className="rounded-2xl bg-emerald-400/15 px-4 py-2 text-sm font-bold text-emerald-200">
                    Active
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  {verificationStandards.map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-3 rounded-2xl bg-slate-900/70 p-4"
                    >
                      <span className="mt-1 h-2.5 w-2.5 rounded-full bg-amber-300" />
                      <p className="text-sm leading-6 text-slate-200">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {hiringIndicators.map((item) => (
                <div
                  key={item.label}
                  className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-xl"
                >
                  <p className="text-sm font-medium text-slate-300">
                    {item.label}
                  </p>
                  <p className="mt-3 text-4xl font-extrabold text-white">
                    {item.value}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-slate-50 text-slate-950">
          <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
              <div className="rounded-3xl bg-slate-900 p-7 text-white shadow-xl">
                <p className="text-sm font-bold uppercase tracking-[0.22em] text-amber-300">
                  Weekly Market Summary
                </p>
                <h2 className="mt-4 text-3xl font-extrabold">
                  A cleaner view of what is actually hiring.
                </h2>
                <p className="mt-4 text-base leading-7 text-slate-300">
                  MedicaidReady Careers is moving beyond basic job listings.
                  The goal is to help job seekers understand where demand is
                  showing up, which categories are active, and which verified
                  opportunities are worth applying to now.
                </p>

                <div className="mt-7 rounded-2xl border border-amber-300/25 bg-amber-300/10 p-5">
                  <p className="text-sm font-bold text-amber-200">
                    Current platform signal
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-200">
                    Individual job pages and the verified jobs directory are
                    already showing strong organic search value. Career Insights
                    builds on that by turning verified hiring activity into
                    indexable weekly reports and practical career guidance.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {trendingCategories.map((category) => (
                  <Link
                    key={category.title}
                    href={category.href}
                    className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-amber-300 hover:shadow-xl"
                  >
                    <div className="mb-5 inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
                      {category.signal}
                    </div>
                    <h3 className="text-xl font-extrabold text-slate-950">
                      {category.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {category.description}
                    </p>
                    <p className="mt-5 text-sm font-bold text-slate-950 group-hover:text-amber-700">
                      Explore verified roles →
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white text-slate-950">
          <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
            <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.22em] text-amber-700">
                  Latest Hiring Reports
                </p>
                <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
                  Weekly intelligence built from verified job activity.
                </h2>
              </div>
              <Link
                href="/careers/jobs"
                className="inline-flex rounded-full border border-slate-300 px-5 py-3 text-sm font-bold text-slate-900 transition hover:border-amber-400 hover:bg-amber-50"
              >
                View all jobs
              </Link>
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
              {weeklyReports.map((report) => (
                <article
                  key={report.title}
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm"
                >
                  <div className="mb-5 inline-flex rounded-full bg-slate-900 px-3 py-1 text-xs font-bold text-amber-200">
                    {report.status}
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-950">
                    {report.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {report.summary}
                  </p>
                  <Link
                    href={report.href}
                    className="mt-6 inline-flex text-sm font-bold text-amber-700 hover:text-amber-800"
                  >
                    Read report →
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-slate-50 text-slate-950">
          <div className="mx-auto grid max-w-7xl gap-8 px-6 py-14 lg:grid-cols-[1fr_0.85fr] lg:px-8">
            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-amber-700">
                Salary Snapshot
              </p>
              <h2 className="mt-3 text-3xl font-extrabold">
                Practical salary signals for high-demand career tracks.
              </h2>

              <div className="mt-7 space-y-4">
                {salarySnapshots.map((item) => (
                  <div
                    key={item.role}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                  >
                    <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                      <h3 className="text-lg font-extrabold">{item.role}</h3>
                      <p className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-extrabold text-emerald-800">
                        {item.range}
                      </p>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {item.note}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-slate-900 p-7 text-white shadow-xl">
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-amber-300">
                Featured Hiring Areas
              </p>
              <h2 className="mt-3 text-3xl font-extrabold">
                Where verified opportunities are showing up.
              </h2>

              <div className="mt-7 grid gap-3">
                {featuredEmployers.map((employer) => (
                  <div
                    key={employer}
                    className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm font-semibold text-slate-200"
                  >
                    {employer}
                  </div>
                ))}
              </div>

              <Link
                href="/careers/companies"
                className="mt-7 inline-flex rounded-full bg-white px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-amber-100"
              >
                Explore companies
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-slate-950 text-white">
          <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 shadow-2xl lg:p-10">
              <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-center">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.22em] text-amber-300">
                    MedicaidReady Quality Standard
                  </p>
                  <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
                    Built for job seekers who are tired of messy job boards.
                  </h2>
                  <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
                    The Career Insights Center supports a better search
                    experience by combining verified jobs, link audits,
                    duplicate cleanup, salary context, and weekly market
                    reporting into one trusted career platform.
                  </p>
                </div>

                <div className="rounded-3xl bg-slate-900 p-6">
                  <p className="text-lg font-extrabold text-white">
                    Start with verified opportunities.
                  </p>
                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    Browse active analyst, healthcare, public sector, nonprofit,
                    remote, and operations roles reviewed through the
                    MedicaidReady Careers refresh workflow.
                  </p>
                  <Link
                    href="/careers/jobs"
                    className="mt-6 inline-flex w-full justify-center rounded-full bg-amber-400 px-6 py-3 text-sm font-extrabold text-slate-950 transition hover:bg-amber-300"
                  >
                    Browse verified jobs
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}