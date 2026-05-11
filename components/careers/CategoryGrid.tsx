import Link from "next/link";

type Item = {
  slug: string;
  label: string;
  blurb: string;
};

const ITEMS: Item[] = [
  {
    slug: "medicaid-analyst-jobs",
    label: "Medicaid analyst jobs",
    blurb: "Policy, program, and compliance analyst roles.",
  },
  {
    slug: "medicaid-eligibility-jobs",
    label: "Medicaid eligibility jobs",
    blurb: "Eligibility, enrollment, and benefits navigator roles.",
  },
  {
    slug: "medicaid-care-management-jobs",
    label: "Care management jobs",
    blurb: "RN care managers, case managers, and coordinators.",
  },
  {
    slug: "remote-medicaid-jobs",
    label: "Remote Medicaid jobs",
    blurb: "Fully-remote roles across the Medicaid space.",
  },
  {
    slug: "healthcare-compliance-jobs",
    label: "Healthcare compliance jobs",
    blurb: "Compliance, regulatory, and audit roles in Medicaid.",
  },
  {
    slug: "medicaid-analytics-jobs",
    label: "Medicaid analytics jobs",
    blurb: "Healthcare data, BI, and analytics engineering.",
  },
];

export default function CategoryGrid({ heading = "Browse by category" }: { heading?: string }) {
  return (
    <div className="cat-grid-wrap">
      <h2 className="cat-grid-heading">{heading}</h2>
      <div className="cat-grid">
        {ITEMS.map((item) => (
          <Link key={item.slug} href={`/careers/category/${item.slug}`} className="cat-grid-card">
            <div className="cat-grid-card-label">{item.label}</div>
            <div className="cat-grid-card-blurb">{item.blurb}</div>
            <span className="cat-grid-card-link">View jobs →</span>
          </Link>
        ))}
      </div>

      <style jsx>{`
        .cat-grid-wrap {
          margin-top: 24px;
        }
        .cat-grid-heading {
          font-size: 18px;
          font-weight: 700;
          color: #0f172a;
          letter-spacing: -0.02em;
          margin: 0 0 14px;
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
