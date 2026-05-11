export type CareersJobType = "Full-time" | "Part-time" | "Contract" | "Internship";
export type CareersJobMode = "Remote" | "Hybrid" | "On-site";

export type CareersJob = {
  id: string;
  title: string;
  company: string;
  location: string;
  type: CareersJobType;
  remote: CareersJobMode;
  salary: string;
  postedAt: string;
  summary: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
};

export const SAMPLE_JOBS: CareersJob[] = [
  {
    id: "medicaid-eligibility-specialist-baltimore",
    title: "Medicaid Eligibility Specialist",
    company: "Bayview Community Health",
    location: "Baltimore, MD",
    type: "Full-time",
    remote: "Hybrid",
    salary: "$48,000 – $58,000 / year",
    postedAt: "2026-04-28",
    summary:
      "Help individuals and families navigate Medicaid eligibility, applications, and renewals.",
    description:
      "Bayview Community Health is hiring a Medicaid Eligibility Specialist to support our patients through the Medicaid application and renewal process. You will work directly with members of our community to gather documentation, complete state applications, and follow up with the Maryland Department of Health.",
    responsibilities: [
      "Screen patients for Medicaid and CHIP eligibility",
      "Complete and submit applications via Maryland Health Connection",
      "Track renewals and proactively contact members ahead of recertification deadlines",
      "Coordinate with case managers and clinical staff on documentation",
      "Maintain accurate records in our case management system",
    ],
    requirements: [
      "1+ years experience with Medicaid, SNAP, or other public benefit programs",
      "Familiarity with Maryland Health Connection or similar state portals",
      "Strong written and verbal communication skills",
      "Bilingual English / Spanish strongly preferred",
    ],
    benefits: [
      "Health, dental, and vision insurance",
      "403(b) retirement with employer match",
      "Paid time off and 10 paid holidays",
      "Continuing education stipend",
    ],
  },
  {
    id: "medicaid-compliance-analyst-richmond",
    title: "Medicaid Compliance Analyst",
    company: "Capstone Home Health Services",
    location: "Richmond, VA",
    type: "Full-time",
    remote: "Remote",
    salary: "$62,000 – $78,000 / year",
    postedAt: "2026-05-02",
    summary:
      "Own day-to-day Medicaid compliance for a multi-state home health agency.",
    description:
      "Capstone is a fast-growing home health provider operating across VA, MD, and DC. We are hiring a Medicaid Compliance Analyst to monitor regulatory changes, audit internal documentation, and support new-state expansion.",
    responsibilities: [
      "Track Medicaid policy changes across VA, MD, and DC",
      "Review provider enrollment and revalidation packages",
      "Run internal compliance audits and prepare remediation plans",
      "Support quarterly compliance reporting to leadership",
    ],
    requirements: [
      "2+ years in healthcare compliance, ideally Medicaid or Medicare",
      "Working knowledge of CMS regulations and state Medicaid manuals",
      "Detail-oriented with strong documentation habits",
    ],
    benefits: [
      "Fully remote",
      "Health, dental, vision",
      "Unlimited PTO",
      "$1,500 annual learning budget",
    ],
  },
  {
    id: "billing-coordinator-medicaid-dc",
    title: "Healthcare Billing Coordinator – Medicaid",
    company: "Anacostia Family Practice",
    location: "Washington, DC",
    type: "Full-time",
    remote: "On-site",
    salary: "$45,000 – $55,000 / year",
    postedAt: "2026-05-04",
    summary:
      "Process Medicaid claims, denials, and resubmissions for a busy DC primary care practice.",
    description:
      "Anacostia Family Practice serves more than 6,000 Medicaid members across Washington, DC. We are looking for a billing coordinator who can keep our claim cycle running smoothly and minimize denials.",
    responsibilities: [
      "Submit clean Medicaid and managed care claims daily",
      "Work denials and resubmissions within timely-filing windows",
      "Reconcile EOBs and post payments",
      "Communicate with payers on escalated issues",
    ],
    requirements: [
      "2+ years medical billing experience",
      "Familiarity with DC Medicaid (DHCF) and major MCOs",
      "Comfort with one or more practice management systems (eClinicalWorks, Athena, NextGen)",
    ],
    benefits: [
      "Health, dental, vision",
      "401(k) with 4% match",
      "Annual performance bonus",
    ],
  },
  {
    id: "outreach-coordinator-medicaid-houston",
    title: "Medicaid Outreach Coordinator",
    company: "Lone Star Community Network",
    location: "Houston, TX",
    type: "Full-time",
    remote: "Hybrid",
    salary: "$42,000 – $50,000 / year",
    postedAt: "2026-05-05",
    summary:
      "Lead community-based outreach for Medicaid and CHIP enrollment in greater Houston.",
    description:
      "Lone Star Community Network is a non-profit focused on closing the coverage gap for working families in Texas. As Outreach Coordinator, you will run enrollment events, train volunteers, and partner with schools and faith-based organizations.",
    responsibilities: [
      "Plan and run weekly community enrollment events",
      "Train and supervise a team of 6 volunteer navigators",
      "Build partnerships with schools, churches, and clinics",
      "Track outcomes and report to grant funders",
    ],
    requirements: [
      "Experience in community organizing, public health, or non-profit outreach",
      "Comfort presenting to groups",
      "Bilingual English / Spanish required",
    ],
    benefits: [
      "Health, dental, vision",
      "Generous PTO and holiday schedule",
      "Mileage reimbursement",
    ],
  },
  {
    id: "policy-associate-medicaid-remote",
    title: "Medicaid Policy Associate",
    company: "Bridge Health Policy Group",
    location: "Remote (US)",
    type: "Full-time",
    remote: "Remote",
    salary: "$70,000 – $90,000 / year",
    postedAt: "2026-05-06",
    summary:
      "Research and write on state Medicaid policy for clients across the country.",
    description:
      "Bridge Health Policy Group helps payers, providers, and advocacy organizations understand and respond to changes in state Medicaid programs. We are hiring a Policy Associate to help expand our research output.",
    responsibilities: [
      "Track legislation and regulatory action across all 50 states",
      "Write briefs, memos, and external publications",
      "Support client engagements with research and analysis",
      "Present findings on internal and client calls",
    ],
    requirements: [
      "Bachelor's degree in public policy, public health, or a related field",
      "1–3 years of relevant policy or research experience",
      "Excellent writing — work samples required",
    ],
    benefits: [
      "Fully remote, async-friendly culture",
      "Health, dental, vision",
      "20 days PTO + federal holidays",
    ],
  },
  {
    id: "rn-care-manager-medicaid-tampa",
    title: "RN Care Manager – Medicaid",
    company: "Sunshine Managed Care",
    location: "Tampa, FL",
    type: "Full-time",
    remote: "Remote",
    salary: "$78,000 – $92,000 / year",
    postedAt: "2026-05-08",
    summary:
      "Telephonic and field-based care management for high-risk Medicaid members.",
    description:
      "Sunshine Managed Care is a Florida Medicaid managed care plan serving more than 200,000 members. We are hiring an RN Care Manager to support our highest-risk members through care planning, transitions of care, and social-determinants navigation.",
    responsibilities: [
      "Conduct comprehensive health assessments",
      "Develop and maintain individualized care plans",
      "Coordinate transitions of care (hospital → home, SNF → community)",
      "Connect members with community resources for housing, food, and transportation",
    ],
    requirements: [
      "Active FL RN license",
      "3+ years clinical RN experience",
      "Care management or case management experience preferred",
      "Comfortable with telephonic outreach + occasional field visits",
    ],
    benefits: [
      "Health, dental, vision starting day 1",
      "401(k) with 6% match",
      "Mileage reimbursement",
      "Mostly remote with occasional field work",
    ],
  },
];

export function getJobById(id: string): CareersJob | null {
  return SAMPLE_JOBS.find((j) => j.id === id) ?? null;
}
