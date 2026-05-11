import { supabaseAdmin } from "../supabaseAdmin";
import { rowToCareersJob } from "./db";
import type { CareersJob } from "./sampleJobs";

export type CategoryFAQ = { q: string; a: string };

export type CategoryMatcher = {
  categories?: string[];
  titleKeywords?: string[];
  keywords?: string[];
  workMode?: "remote" | "hybrid" | "on_site";
};

export type CategoryConfig = {
  slug: string;
  eyebrow: string;
  heading: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  about: string[];
  emptyStateCopy: string;
  faq: CategoryFAQ[];
  related: string[];
  matcher: CategoryMatcher;
};

export const CATEGORY_CONFIGS: CategoryConfig[] = [
  {
    slug: "medicaid-analyst-jobs",
    eyebrow: "Medicaid analyst jobs",
    heading: "Medicaid analyst jobs",
    metaTitle:
      "Medicaid Analyst Jobs — Policy, Program, and Operations Roles | MedicaidReady Careers",
    metaDescription:
      "Open Medicaid analyst jobs across policy, program operations, and compliance. Curated weekly from health plans, providers, state agencies, and federal contractors.",
    intro:
      "Open analyst roles across the Medicaid space — policy, program operations, compliance, and reporting.",
    about: [
      "Medicaid analyst roles span policy research, program management, finance, and operations work. Most positions ask for one to five years of relevant experience and strong written communication. Some are remote; others require time on-site at a state Medicaid agency, managed care organization, or provider.",
      "Common titles in this category include Medicaid Policy Analyst, Program Analyst, Compliance Analyst, Reporting Analyst, Operations Analyst, and Healthcare Data Analyst. Many transitions into Medicaid analyst work come from public health, consulting, or other healthcare-adjacent backgrounds.",
      "Salary ranges vary widely. Entry-level analyst positions often start around $55K, while senior analysts at large MCOs and consulting firms can clear $100K. Federal contractors and state agencies typically pay close to GS-11 / GS-12 equivalents.",
    ],
    emptyStateCopy:
      "We do not have an open Medicaid analyst role in the board this week. New roles are added regularly — check back soon, or browse all current jobs.",
    faq: [
      {
        q: "What does a Medicaid analyst do?",
        a: "Medicaid analysts study program data, policy changes, and operational performance. Day-to-day work can include reviewing legislation, building reports for leadership, auditing claims and eligibility decisions, or supporting state agency communications.",
      },
      {
        q: "Do I need a Medicaid background to apply?",
        a: "Some roles require it; many do not. Strong analyst fundamentals — SQL, Excel, clear writing, working with stakeholders — transfer well from other healthcare or public-sector domains.",
      },
      {
        q: "Are these jobs remote?",
        a: "Some are. Use the work-mode filter on the main jobs page, or browse the dedicated remote Medicaid jobs category.",
      },
    ],
    related: [
      "medicaid-analytics-jobs",
      "healthcare-compliance-jobs",
      "remote-medicaid-jobs",
    ],
    matcher: {
      titleKeywords: ["analyst"],
      keywords: [
        "medicaid analyst",
        "policy analyst",
        "program analyst",
        "operations analyst",
      ],
    },
  },
  {
    slug: "medicaid-eligibility-jobs",
    eyebrow: "Medicaid eligibility jobs",
    heading: "Medicaid eligibility specialist jobs",
    metaTitle:
      "Medicaid Eligibility Specialist Jobs — Enrollment & Renewal Roles | MedicaidReady Careers",
    metaDescription:
      "Open Medicaid eligibility specialist and enrollment roles at health systems, FQHCs, and managed care plans. Help individuals and families qualify, apply, and renew.",
    intro:
      "Eligibility specialist, enrollment counselor, and benefits navigator roles across the Medicaid ecosystem.",
    about: [
      "Eligibility specialists are the front line of the Medicaid system. They screen patients and members, complete state applications, gather supporting documentation, and track renewals so coverage does not lapse.",
      "Common titles include Medicaid Eligibility Specialist, Enrollment Counselor, Benefits Navigator, Patient Access Coordinator, and Outreach Coordinator. Most require one or more years of public-benefits experience and strong empathy. Bilingual English / Spanish is a frequent plus.",
      "These roles are typically hybrid or on-site at FQHCs, hospitals, and county social-service agencies. Pay typically ranges from $40K to $60K depending on geography and certifications.",
    ],
    emptyStateCopy:
      "We do not have an open eligibility specialist role this week. New roles are added regularly — check back soon, or browse all current jobs.",
    faq: [
      {
        q: "What is the difference between an eligibility specialist and a navigator?",
        a: "They overlap heavily. Specialists usually focus on Medicaid and CHIP applications; navigators (under ACA programs) help with marketplace plans too. Both roles support enrollment and renewal end-to-end.",
      },
      {
        q: "Do I need a certification?",
        a: "Some states certify eligibility specialists or require navigator training. Most employers will sponsor or provide training as part of onboarding.",
      },
      {
        q: "Is this work remote?",
        a: "Most eligibility work is hybrid or on-site, since members often need in-person help with documents. Some MCO-side roles are remote.",
      },
    ],
    related: [
      "medicaid-care-management-jobs",
      "medicaid-analyst-jobs",
      "remote-medicaid-jobs",
    ],
    matcher: {
      categories: ["eligibility"],
      titleKeywords: ["eligibility", "enrollment", "navigator", "patient access"],
      keywords: ["medicaid eligibility", "enrollment specialist"],
    },
  },
  {
    slug: "medicaid-care-management-jobs",
    eyebrow: "Medicaid care management jobs",
    heading: "Medicaid care management jobs",
    metaTitle:
      "Medicaid Care Management Jobs — RN, Care Coordinator, and Case Manager Roles | MedicaidReady Careers",
    metaDescription:
      "Open Medicaid care management roles for RNs, social workers, and care coordinators. Support high-risk members through care plans and transitions of care.",
    intro:
      "RN care managers, care coordinators, and social-work-led case management for Medicaid members.",
    about: [
      "Care management connects high-risk Medicaid members to the right level of care, helps them avoid avoidable hospitalizations, and addresses the social drivers of health — housing, food, and transportation.",
      "Common titles include RN Care Manager, Care Coordinator, Case Manager, Social Worker, and Community Health Worker. Many roles are with managed care plans (MCOs) and are partially or fully remote with occasional field visits.",
      "RN care managers usually need an active state license; social-work tracks typically require an LSW, LMSW, or LCSW. Pay ranges from $55K (entry coordinator) to $95K+ (senior RN at a national plan).",
    ],
    emptyStateCopy:
      "We do not have an open care management role this week. New roles are added regularly — check back soon, or browse all current jobs.",
    faq: [
      {
        q: "Are care management jobs remote?",
        a: "Many MCO care management roles are mostly remote with occasional field visits. Provider-based roles are typically hybrid or on-site.",
      },
      {
        q: "Do I need an RN license?",
        a: "RN-titled roles need an active state license. Coordinator and case-manager titles often accept LSW / LCSW or relevant bachelor's-level experience.",
      },
      {
        q: "What is the difference between care management and case management?",
        a: "The terms are largely interchangeable. Both involve assessing members, building care plans, and coordinating across providers and community resources.",
      },
    ],
    related: [
      "medicaid-eligibility-jobs",
      "remote-medicaid-jobs",
      "healthcare-compliance-jobs",
    ],
    matcher: {
      categories: ["care_management"],
      titleKeywords: [
        "care manager",
        "care coordinator",
        "case manager",
        "care coordination",
        "social worker",
      ],
      keywords: ["care management", "case management", "transitions of care"],
    },
  },
  {
    slug: "remote-medicaid-jobs",
    eyebrow: "Remote Medicaid jobs",
    heading: "Remote Medicaid jobs",
    metaTitle:
      "Remote Medicaid Jobs — Work-from-Home Roles in the Medicaid Ecosystem | MedicaidReady Careers",
    metaDescription:
      "Open remote Medicaid jobs across policy, eligibility, care management, compliance, and analytics. All roles are remote-eligible at the time of posting.",
    intro:
      "Remote-friendly roles across policy, eligibility, care management, compliance, and analytics.",
    about: [
      "Remote Medicaid work has expanded significantly at managed care plans, federal contractors, policy shops, and analytics firms. Many roles are fully remote within the US; some require time-zone overlap or occasional state-agency travel.",
      "Common remote titles include Policy Analyst, Compliance Analyst, RN Care Manager, Healthcare Data Analyst, Program Manager, and Quality Improvement Specialist. Front-line eligibility work tends to remain hybrid or on-site.",
      "Confirm specifics in each listing — work-from-home status, state restrictions, and travel expectations vary by employer.",
    ],
    emptyStateCopy:
      "We do not have an open fully-remote Medicaid role this week. Many of our hybrid roles allow significant work-from-home time — browse all current jobs to see what is available.",
    faq: [
      {
        q: "Are these roles fully remote?",
        a: "Each listing is tagged 'Remote' at the time it was posted. Some may have state-of-residence restrictions or expect occasional travel. Always confirm specifics with the employer.",
      },
      {
        q: "Do remote roles pay less?",
        a: "Compensation varies by employer. Many MCOs and policy firms pay national rates regardless of location, while some adjust for cost of living.",
      },
      {
        q: "What roles are typically remote?",
        a: "Policy, analytics, compliance, MCO care management, program management, and many provider-side back-office roles. Front-line eligibility and member-facing work is more often hybrid or on-site.",
      },
    ],
    related: [
      "medicaid-analyst-jobs",
      "medicaid-care-management-jobs",
      "medicaid-analytics-jobs",
    ],
    matcher: {
      workMode: "remote",
    },
  },
  {
    slug: "healthcare-compliance-jobs",
    eyebrow: "Healthcare compliance jobs",
    heading: "Healthcare compliance jobs",
    metaTitle:
      "Healthcare Compliance Jobs — Medicaid Compliance Analyst, Officer, and Auditor Roles | MedicaidReady Careers",
    metaDescription:
      "Open healthcare compliance jobs in the Medicaid ecosystem: compliance analysts, compliance officers, auditors, and regulatory specialists at MCOs and providers.",
    intro:
      "Compliance, audit, and regulatory roles at Medicaid managed care organizations and providers.",
    about: [
      "Healthcare compliance is one of the most stable career tracks in the Medicaid ecosystem. Compliance professionals interpret CMS rules, monitor state Medicaid manuals, run internal audits, and prepare organizations for external review.",
      "Common titles include Compliance Analyst, Compliance Officer, Regulatory Specialist, Internal Auditor, and Privacy / HIPAA Specialist. Many roles require two to eight years of healthcare compliance experience; senior roles often look for CHC, CCEP, or HCCA credentials.",
      "Compliance work tends to be remote-friendly and pays well — typical ranges run from $65K (analyst) to $140K+ (director).",
    ],
    emptyStateCopy:
      "We do not have an open healthcare compliance role this week. New roles are added regularly — check back soon, or browse all current jobs.",
    faq: [
      {
        q: "Do I need a compliance certification?",
        a: "Helpful but not always required. CHC and CCEP are commonly preferred for senior roles. Many employers will sponsor certification once you are on the team.",
      },
      {
        q: "Is healthcare compliance remote-friendly?",
        a: "Yes — many compliance, audit, and regulatory roles at MCOs, federal contractors, and consulting firms are fully remote.",
      },
      {
        q: "Is this the same as billing compliance?",
        a: "Billing compliance is a sub-area of healthcare compliance focused on coding accuracy, denials, and revenue integrity. Most healthcare compliance teams cover broader regulatory work too.",
      },
    ],
    related: [
      "medicaid-analyst-jobs",
      "remote-medicaid-jobs",
      "medicaid-analytics-jobs",
    ],
    matcher: {
      categories: ["compliance"],
      titleKeywords: ["compliance", "regulatory", "auditor", "audit"],
      keywords: ["compliance officer", "compliance analyst", "hipaa"],
    },
  },
  {
    slug: "medicaid-analytics-jobs",
    eyebrow: "Medicaid analytics jobs",
    heading: "Medicaid analytics and data jobs",
    metaTitle:
      "Medicaid Analytics Jobs — Healthcare Data Analyst, BI, and Reporting Roles | MedicaidReady Careers",
    metaDescription:
      "Open Medicaid analytics and data jobs: healthcare data analysts, reporting specialists, BI developers, and data scientists at health plans, providers, and contractors.",
    intro:
      "Data analyst, reporting, BI, and analytics engineering roles in the Medicaid space.",
    about: [
      "Medicaid analytics roles work with claims, eligibility, and care management data to inform program design, monitor quality, and support value-based contracts. SQL fluency is universal; many teams also use Python, R, or BI tools like Tableau and Power BI.",
      "Common titles include Healthcare Data Analyst, Reporting Analyst, BI Developer, Data Scientist, and Analytics Engineer. Some roles sit on payer / MCO teams; others at state contractors, FQHCs, and health-policy think tanks.",
      "Pay typically ranges from $65K (analyst) to $160K+ (senior data scientist at a national MCO).",
    ],
    emptyStateCopy:
      "We do not have an open Medicaid analytics role this week. New roles are added regularly — check back soon, or browse all current jobs.",
    faq: [
      {
        q: "What technical skills are typical?",
        a: "SQL is universal. Python or R is common for senior roles. Familiarity with claims data (CPT, ICD-10, HCPCS) and quality measures (HEDIS) is a strong advantage.",
      },
      {
        q: "Can I switch in from a non-healthcare analytics role?",
        a: "Yes — strong SQL and Python fundamentals transfer well, and most teams will train on Medicaid-specific data models.",
      },
      {
        q: "Are analytics roles remote?",
        a: "Most are remote-friendly, especially at MCOs and consulting firms. Some state-contractor roles require a local presence.",
      },
    ],
    related: [
      "medicaid-analyst-jobs",
      "healthcare-compliance-jobs",
      "remote-medicaid-jobs",
    ],
    matcher: {
      categories: ["analytics", "data"],
      titleKeywords: [
        "data analyst",
        "data scientist",
        "data engineer",
        "analytics engineer",
        "reporting analyst",
        "bi analyst",
        "bi developer",
        "business intelligence",
      ],
      keywords: ["healthcare data", "claims data", "data scientist"],
    },
  },
];

export const CATEGORY_SLUGS: string[] = CATEGORY_CONFIGS.map((c) => c.slug);

const CONFIG_MAP: Record<string, CategoryConfig> = Object.fromEntries(
  CATEGORY_CONFIGS.map((c) => [c.slug, c])
);

export function getCategoryConfig(slug: string): CategoryConfig | null {
  return CONFIG_MAP[slug] ?? null;
}

type CategoryRow = {
  id: string;
  slug: string;
  title: string;
  company: string;
  category: string | null;
  location: string | null;
  work_mode: "remote" | "hybrid" | "on_site" | null;
  employment_type: "full_time" | "part_time" | "contract" | "internship" | null;
  salary_min: number | string | null;
  salary_max: number | string | null;
  salary_currency: string | null;
  salary_period: "year" | "month" | "hour" | null;
  salary_display: string | null;
  summary: string | null;
  description: string | null;
  responsibilities: string[] | null;
  requirements: string[] | null;
  benefits: string[] | null;
  apply_url: string | null;
  source_type: string | null;
  status: string;
  featured: boolean;
  expires_at: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

const SELECT_FIELDS = [
  "id",
  "slug",
  "title",
  "company",
  "category",
  "location",
  "work_mode",
  "employment_type",
  "salary_min",
  "salary_max",
  "salary_currency",
  "salary_period",
  "salary_display",
  "summary",
  "description",
  "responsibilities",
  "requirements",
  "benefits",
  "apply_url",
  "source_type",
  "status",
  "featured",
  "expires_at",
  "published_at",
  "created_at",
  "updated_at",
].join(", ");

function lc(s: string | null | undefined): string {
  return typeof s === "string" ? s.toLowerCase() : "";
}

function rowMatchesCategory(row: CategoryRow, matcher: CategoryMatcher): boolean {
  if (matcher.workMode && row.work_mode === matcher.workMode) {
    return true;
  }

  if (matcher.categories && row.category) {
    const cat = row.category.toLowerCase();
    if (matcher.categories.some((c) => c.toLowerCase() === cat)) {
      return true;
    }
  }

  const title = lc(row.title);
  if (matcher.titleKeywords?.some((k) => title.includes(k.toLowerCase()))) {
    return true;
  }

  if (matcher.keywords && matcher.keywords.length > 0) {
    const haystack = [
      row.title,
      row.summary,
      row.description,
      ...(row.responsibilities ?? []),
    ]
      .filter((x): x is string => typeof x === "string" && x.length > 0)
      .join(" ")
      .toLowerCase();

    if (matcher.keywords.some((k) => haystack.includes(k.toLowerCase()))) {
      return true;
    }
  }

  return false;
}

export async function listJobsForCategory(slug: string): Promise<CareersJob[]> {
  const config = getCategoryConfig(slug);
  if (!config) return [];

  try {
    const sb = supabaseAdmin();
    const nowIso = new Date().toISOString();

    const { data, error } = await sb
      .from("careers_jobs")
      .select(SELECT_FIELDS)
      .eq("status", "approved")
      .or(`expires_at.is.null,expires_at.gt.${nowIso}`)
      .order("featured", { ascending: false })
      .order("published_at", { ascending: false, nullsFirst: false });

    if (error) {
      console.warn(
        `[careers] listJobsForCategory(${slug}) query failed:`,
        error.message
      );
      return [];
    }

    if (!data || data.length === 0) return [];

    const rows = data as unknown as CategoryRow[];
    const matching = rows.filter((r) => rowMatchesCategory(r, config.matcher));

    return matching.map((r) =>
      rowToCareersJob(r as unknown as Parameters<typeof rowToCareersJob>[0])
    );
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.warn(`[careers] listJobsForCategory(${slug}) threw:`, msg);
    return [];
  }
}
