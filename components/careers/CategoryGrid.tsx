import Link from "next/link";

type Item = {
  slug: string;
  label: string;
  blurb: string;
  group: "Coverage" | "Care Workforce" | "Healthcare Tech";
};

const ITEMS: Item[] = [
  {
    slug: "medicaid-analyst-jobs",
    label: "Medicaid analyst jobs",
    blurb: "Policy, program, operations, and analyst roles.",
    group: "Coverage",
  },
  {
    slug: "medicaid-eligibility-jobs",
    label: "Medicaid eligibility jobs",
    blurb: "Eligibility, enrollment, and benefits navigator roles.",
    group: "Coverage",
  },
  {
    slug: "medicaid-care-management-jobs",
    label: "Care management jobs",
    blurb: "RN care managers, case managers, and coordinators.",
    group: "Coverage",
  },
  {
    slug: "remote-medicaid-jobs",
    label: "Remote Medicaid jobs",
    blurb: "Remote roles across Medicaid and healthcare operations.",
    group: "Coverage",
  },
  {
    slug: "healthcare-compliance-jobs",
    label: "Healthcare compliance jobs",
    blurb: "Compliance, regulatory, audit, and HIPAA roles.",
    group: "Coverage",
  },
  {
    slug: "medicaid-analytics-jobs",
    label: "Medicaid analytics jobs",
    blurb: "Healthcare data, BI, reporting, and analytics roles.",
    group: "Coverage",
  },
  {
    slug: "cna-jobs",
    label: "CNA jobs",
    blurb: "Certified nursing assistant roles in care settings.",
    group: "Care Workforce",
  },
  {
    slug: "gna-jobs",
    label: "GNA jobs",
    blurb: "Geriatric nursing assistant roles for long-term care.",
    group: "Care Workforce",
  },
  {
    slug: "caregiver-jobs",
    label: "Caregiver jobs",
    blurb: "Caregiver, companion, and personal care roles.",
    group: "Care Workforce",
  },
  {
    slug: "home-health-aide-jobs",
    label: "Home health aide jobs",
    blurb: "HHA and home care support roles.",
    group: "Care Workforce",
  },
  {
    slug: "patient-care-tech-jobs",
    label: "Patient care tech jobs",
    blurb: "PCT and clinical support roles in healthcare settings.",
    group: "Care Workforce",
  },
  {
    slug: "direct-support-professional-jobs",
    label: "Direct support professional jobs",
    blurb: "DSP roles supporting people with daily living needs.",
    group: "Care Workforce",
  },
  {
    slug: "healthcare-it-jobs",
    label: "Healthcare IT jobs",
    blurb: "Health systems, payer technology, and IT operations.",
    group: "Healthcare Tech",
  },
  {
    slug: "ehr-analyst-jobs",
    label: "EHR analyst jobs",
    blurb: "Epic, Cerner, clinical systems, and EHR analyst roles.",
    group: "Healthcare Tech",
  },
  {
    slug: "healthcare-data-analyst-jobs",
    label: "Healthcare data analyst jobs",
    blurb: "Data analyst, BI, reporting, and healthcare analytics roles.",
    group: "Healthcare Tech",
  },
  {
    slug: "claims-systems-jobs",
    label: "Claims systems jobs",
    blurb: "Claims, QNXT, payer systems, configuration, and testing roles.",
    group: "Healthcare Tech",
  },
  {
    slug: "provider-data-jobs",
    label: "Provider data jobs",
    blurb: "Provider data, credentialing, network, and directory roles.",
    group: "Healthcare Tech",
  },
  {
    slug: "healthcare-product-manager-jobs",
    label: "Healthcare product manager jobs",
    blurb: "Product, program, and platform roles in healthcare tech.",
    group: "Healthcare Tech",
  },
];

const GROUPS: Item["group"][] = ["Coverage", "Care Workforce", "Healthcare Tech"];

export default function CategoryGrid({ heading = "Browse by category" }: { heading?: string }) {
  return (
    <div className="cat-grid-wrap">
      <h2 className="cat-grid-heading">{heading}</h2>

      {GROUPS.map((group) => (
        <div key={group} className="cat-grid-group">
          <div className="cat-grid-group-title">{group}</div>
          <div className="cat-grid">
            {ITEMS.filter((item) => item.group === group).map((item) => (
              <Link key={item.slug} href={`/careers/category/${item.slug}`} className="cat-grid-card">
                <div className="cat-grid-card-label">{item.label}</div>
                <div className="cat-grid-card-blurb">{item.blurb}</div>
                <span className="cat-grid-card-link">View jobs →</span>
              </Link>
            ))}
          </div>
        </div>
      ))}

      <style jsx>{`
        .cat-grid-wrap {
          margin-top: 24px;
        }
        .cat-grid-heading {
          font-size: 18px;
          font-weight: 700;
          color: #0f172a;
          letter-spacing: -0.02em;
          margin: 0 0 18px;
        }
        .cat-grid-group {
          margin-top: 22px;
        }
        .cat-grid-group:first-of-type {
          margin-top: 0;
        }
        .cat-grid-group-title {
          font-size: 12px;
          font-weight: 800;
          color: #1565c0;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin: 0 0 10px;
        }
        .cat-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }
        .cat-grid-card {
          display: block;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 16px 18px;
          text-decoration: none;
          color: inherit;
          transition: border-color 140ms, transform 100ms, box-shadow 140ms;
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.05);
        }
        .cat-grid-card:hover {
          border-color: #93c5fd;
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(15, 23, 42, 0.07);
          color: inherit;
        }
        .cat-grid-card-label {
          font-size: 14px;
          font-weight: 700;
          color: #0f172a;
          letter-spacing: -0.01em;
          margin: 0 0 4px;
        }
        .cat-grid-card-blurb {
          font-size: 13px;
          color: #475569;
          line-height: 1.5;
          margin: 0 0 8px;
        }
        .cat-grid-card-link {
          font-size: 12px;
          font-weight: 600;
          color: #1565c0;
        }
        @media (max-width: 880px) {
          .cat-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (max-width: 540px) {
          .cat-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
