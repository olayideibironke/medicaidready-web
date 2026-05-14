import Head from "next/head";
import Link from "next/link";
import CareersShell from "../../components/careers/CareersShell";
import JobAlertCapture from "../../components/careers/JobAlertCapture";

const SITE_URL = "https://www.medicaidready.org";

type ResLink = {
  href: string;
  label: string;
  blurb: string;
  external?: boolean;
};

const MR_TOOLS: ResLink[] = [
  {
    href: "/quiz",
    label: "Free Medicaid eligibility check",
    blurb:
      "5 questions, ~2 minutes. Find out if you qualify in your state — no account needed.",
  },
  {
    href: "/pricing",
    label: "Complete Medicaid Application Guide",
    blurb:
      "State-specific step-by-step guide for $9.99. Documents to collect, where to apply, what to expect.",
  },
  {
    href: "/medicaid-eligibility-texas",
    label: "Medicaid eligibility — Texas",
    blurb:
      "Detailed Texas Medicaid eligibility breakdown by program, income limits, and what to apply for.",
  },
];

const OFFICIAL: ResLink[] = [
  {
    href: "https://www.medicaid.gov/",
    label: "Medicaid.gov",
    blurb:
      "Official federal Medicaid program information, state plans, waivers, and policy guidance.",
    external: true,
  },
  {
    href: "https://www.cms.gov/",
    label: "CMS.gov — Centers for Medicare & Medicaid Services",
    blurb:
      "The federal agency that administers Medicare, Medicaid, CHIP, and Marketplace programs.",
    external: true,
  },
  {
    href: "https://www.healthcare.gov/",
    label: "HealthCare.gov",
    blurb:
      "ACA Marketplace plans, enrollment periods, subsidies, and how Marketplace coverage interacts with Medicaid.",
    external: true,
  },
  {
    href: "https://www.benefits.gov/",
    label: "Benefits.gov",
    blurb:
      "Federal portal for finding government benefit programs you may qualify for, including Medicaid and SNAP.",
    external: true,
  },
];

const STATE_GUIDES: { state: string; slug: string }[] = [
  { state: "California", slug: "california" },
  { state: "Florida", slug: "florida" },
  { state: "Georgia", slug: "georgia" },
  { state: "Illinois", slug: "illinois" },
  { state: "Maryland", slug: "maryland" },
  { state: "Michigan", slug: "michigan" },
  { state: "New Jersey", slug: "new-jersey" },
  { state: "New York", slug: "new-york" },
  { state: "North Carolina", slug: "north-carolina" },
  { state: "Ohio", slug: "ohio" },
  { state: "Pennsylvania", slug: "pennsylvania" },
  { state: "Texas", slug: "texas" },
  { state: "Virginia", slug: "virginia" },
  { state: "Washington", slug: "washington" },
];

const WORKFORCE_PATHS: ResLink[] = [
  {
    href: "/careers/category/cna-jobs",
    label: "CNA — Certified Nursing Assistant",
    blurb:
      "What CNAs do, where they work, and active CNA roles in long-term care and hospitals.",
  },
  {
    href: "/careers/category/gna-jobs",
    label: "GNA — Geriatric Nursing Assistant",
    blurb:
      "Geriatric nursing assistant roles serving older adults in long-term care and skilled nursing.",
  },
  {
    href: "/careers/category/caregiver-jobs",
    label: "Caregiver & home care",
    blurb:
      "Caregiver, companion, personal care aide, and direct care roles in homes and community settings.",
  },
  {
    href: "/careers/category/home-health-aide-jobs",
    label: "Home Health Aide (HHA)",
    blurb:
      "Home health aide and home care support roles, including Medicaid-waiver-funded programs.",
  },
  {
    href: "/careers/category/direct-support-professional-jobs",
    label: "Direct Support Professional (DSP)",
    blurb:
      "DSP and disability-support roles tied to Medicaid waiver and community-based services.",
  },
  {
    href: "/careers/category/patient-care-tech-jobs",
    label: "Patient Care Tech (PCT)",
    blurb:
      "PCT and clinical support roles in hospitals, dialysis centers, rehab, and care facilities.",
  },
];

const TECH_PATHS: ResLink[] = [
  {
    href: "/careers/category/healthcare-it-jobs",
    label: "Healthcare IT",
    blurb:
      "Clinical systems, application analyst, IT analyst, and healthcare technology roles.",
  },
  {
    href: "/careers/category/ehr-analyst-jobs",
    label: "EHR Analyst (Epic, Cerner)",
    blurb:
      "Electronic health record analyst, build, application, and workflow roles.",
  },
  {
    href: "/careers/category/claims-systems-jobs",
    label: "Claims systems & payer ops",
    blurb:
      "Claims configuration, QNXT, Facets, payment integrity, and payer-platform roles.",
  },
  {
    href: "/careers/category/healthcare-data-analyst-jobs",
    label: "Healthcare data analyst",
    blurb:
      "BI, reporting, SQL, Tableau, Power BI, and healthcare data analyst roles.",
  },
];

const POLICY_PATHS: ResLink[] = [
  {
    href: "/careers/category/medicaid-analyst-jobs",
    label: "Medicaid analyst",
    blurb:
      "Policy, program, operations, reporting, and compliance analyst roles in the Medicaid space.",
  },
  {
    href: "/careers/category/medicaid-eligibility-jobs",
    label: "Medicaid eligibility specialist",
    blurb:
      "Eligibility, enrollment, navigator, and patient-access roles across the Medicaid ecosystem.",
  },
  {
    href: "/careers/category/medicaid-care-management-jobs",
    label: "Care management",
    blurb:
      "RN care managers, case managers, social workers, and care coordinators supporting members.",
  },
  {
    href: "/careers/category/healthcare-compliance-jobs",
    label: "Healthcare compliance",
    blurb:
      "Compliance, regulatory, HIPAA, audit, and risk roles in healthcare.",
  },
];

function ResCard({ link }: { link: ResLink }) {
  const ExternalArrow = (
    <svg
      width="11"
      height="11"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 9l5-5M5 4h5v5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  if (link.external) {
    return (
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        className="res-card"
      >
        <div className="res-card-title">
          {link.label}
          <span className="res-card-ext" aria-hidden="true">
            {ExternalArrow}
          </span>
        </div>
        <div className="res-card-body">{link.blurb}</div>
        <span className="res-card-link">
          Visit site
          <span aria-hidden="true">{ExternalArrow}</span>
        </span>
      </a>
    );
  }
  return (
    <Link href={link.href} className="res-card">
      <div className="res-card-title">{link.label}</div>
      <div className="res-card-body">{link.blurb}</div>
      <span className="res-card-link">
        Open
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M3 6h6M7 3l3 3-3 3"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </Link>
  );
}

export default function CareersResources() {
  const url = `${SITE_URL}/careers/resources`;
  const metaTitle =
    "Career Resources for Healthcare and Medicaid Jobs | MedicaidReady Careers";
  const metaDescription =
    "Curated resources for healthcare and Medicaid job seekers: free eligibility check, application guide, official federal portals, state Medicaid pages, and category-specific career paths.";

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
        <section className="careers-section">
          <div className="careers-container">
            <div className="careers-eyebrow">Career resources</div>
            <h1 className="careers-h1">
              Tools and guides for your Medicaid &amp; healthcare career search.
            </h1>
            <p className="careers-lead">
              A curated, honest set of resources — free MedicaidReady tools, official
              federal portals, state-specific Medicaid pages, and career paths in the
              Medicaid and healthcare ecosystem.
            </p>

            <div className="res-jump" aria-label="Section shortcuts">
              <a href="#mr-tools" className="res-jump-link">MedicaidReady tools</a>
              <a href="#official" className="res-jump-link">Official portals</a>
              <a href="#state" className="res-jump-link">State Medicaid pages</a>
              <a href="#workforce" className="res-jump-link">Care workforce</a>
              <a href="#tech" className="res-jump-link">Healthcare tech</a>
              <a href="#policy" className="res-jump-link">Coverage &amp; policy</a>
            </div>

            <section id="mr-tools" className="res-section">
              <h2 className="res-h2">MedicaidReady tools</h2>
              <p className="res-sub">
                Use these first if you (or someone you&apos;re helping) need to
                understand Medicaid coverage before applying for a role.
              </p>
              <div className="res-grid">
                {MR_TOOLS.map((l) => (
                  <ResCard key={l.href} link={l} />
                ))}
              </div>
            </section>

            <section id="official" className="res-section">
              <h2 className="res-h2">Official federal portals</h2>
              <p className="res-sub">
                Authoritative federal sources for Medicaid, Medicare, ACA, and
                public-benefit programs.
              </p>
              <div className="res-grid">
                {OFFICIAL.map((l) => (
                  <ResCard key={l.href} link={l} />
                ))}
              </div>
            </section>

            <section id="state" className="res-section">
              <h2 className="res-h2">State Medicaid eligibility pages</h2>
              <p className="res-sub">
                Each MedicaidReady state page covers income limits, expansion status,
                eligibility groups, and how to apply. Browse a sample below — all 50
                states + DC are covered.
              </p>
              <div className="res-state-grid">
                {STATE_GUIDES.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/medicaid-eligibility/${s.slug}`}
                    className="res-state-pill"
                  >
                    {s.state}
                  </Link>
                ))}
              </div>
            </section>

            <section id="workforce" className="res-section">
              <h2 className="res-h2">Care workforce paths</h2>
              <p className="res-sub">
                Frontline care roles — CNA, GNA, caregiver, HHA, DSP, PCT. What the
                roles do, who hires, and active openings on MedicaidReady Careers.
              </p>
              <div className="res-grid">
                {WORKFORCE_PATHS.map((l) => (
                  <ResCard key={l.href} link={l} />
                ))}
              </div>
            </section>

            <section id="tech" className="res-section">
              <h2 className="res-h2">Healthcare technology paths</h2>
              <p className="res-sub">
                Roles for people who already work in clinical systems, payer
                technology, claims operations, EHRs, and healthcare data.
              </p>
              <div className="res-grid">
                {TECH_PATHS.map((l) => (
                  <ResCard key={l.href} link={l} />
                ))}
              </div>
            </section>

            <section id="policy" className="res-section">
              <h2 className="res-h2">Coverage, policy, and compliance paths</h2>
              <p className="res-sub">
                Roles in Medicaid policy, eligibility, care management, and
                regulatory/compliance work.
              </p>
              <div className="res-grid">
                {POLICY_PATHS.map((l) => (
                  <ResCard key={l.href} link={l} />
                ))}
              </div>
            </section>

            <div style={{ marginTop: 36, maxWidth: 640 }}>
              <JobAlertCapture source="careers_resources_page" />
            </div>

            <p className="res-disclaimer">
              External links go to third-party sites that MedicaidReady does not
              operate. They open in a new tab and are provided for your convenience.
            </p>
          </div>
        </section>
      </CareersShell>

      <style jsx>{`
        .res-jump {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin: 22px 0 4px;
        }
        .res-jump-link {
          padding: 6px 12px;
          border-radius: 999px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          color: #042C53;
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          transition: border-color 120ms, background 120ms, color 120ms;
        }
        .res-jump-link:hover {
          border-color: #BA7517;
          color: #BA7517;
          background: #fff7e6;
        }

        .res-section {
          margin-top: 40px;
          scroll-margin-top: 140px;
        }
        .res-h2 {
          font-size: 22px;
          font-weight: 700;
          color: #042C53;
          letter-spacing: -0.025em;
          margin: 0 0 8px;
        }
        .res-sub {
          font-size: 15px;
          color: #475569;
          line-height: 1.6;
          margin: 0 0 18px;
          max-width: 740px;
        }

        .res-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }
        .res-card {
          display: flex;
          flex-direction: column;
          gap: 8px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 20px 22px;
          text-decoration: none !important;
          color: inherit;
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
          transition: border-color 140ms, transform 100ms, box-shadow 140ms;
        }
        .res-card:hover {
          border-color: #BA7517;
          transform: translateY(-1px);
          box-shadow: 0 8px 22px rgba(4, 44, 83, 0.08);
          color: inherit;
        }
        .res-card-title {
          font-size: 15px;
          font-weight: 700;
          color: #042C53;
          letter-spacing: -0.01em;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .res-card-ext {
          display: inline-flex;
          color: #BA7517;
        }
        .res-card-body {
          font-size: 13.5px;
          color: #475569;
          line-height: 1.6;
          flex: 1;
        }
        .res-card-link {
          font-size: 13px;
          font-weight: 700;
          color: #BA7517;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          margin-top: 6px;
        }

        .res-state-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .res-state-pill {
          padding: 8px 14px;
          border-radius: 999px;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          color: #042C53;
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          transition: border-color 120ms, background 120ms;
        }
        .res-state-pill:hover {
          border-color: #BA7517;
          background: #fff7e6;
          color: #042C53;
        }

        .res-disclaimer {
          margin: 32px 0 0;
          font-size: 12px;
          color: #94a3b8;
          line-height: 1.5;
        }

        @media (max-width: 960px) {
          .res-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 600px) {
          .res-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
}
