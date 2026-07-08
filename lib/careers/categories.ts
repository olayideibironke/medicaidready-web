import type { CareersJob } from "./sampleJobs";

export type CareersCategoryDef = {
  key: string;
  label: string;
  aliases: string[];
  strong: string[];
  keywords: string[];
  exclude?: string[];
};

type CategoryFaq = {
  question: string;
  answer: string;
  q: string;
  a: string;
};

type CategorySection = {
  title: string;
  heading: string;
  description: string;
  body: string;
};

export type CategoryConfig = CareersCategoryDef & {
  slug: string;
  title: string;
  heading: string;
  subheading: string;
  eyebrow: string;
  description: string;
  intro: string;
  metaTitle: string;
  metaDescription: string;
  seoTitle: string;
  seoDescription: string;
  heroTitle: string;
  heroDescription: string;
  searchQuery: string;
  href: string;
  legacySlugs: string[];
  popularSearches: string[];
  relatedSearches: string[];
  searches: string[];
  marketSignals: string[];
  highlights: string[];
  skills: string[];
  commonTitles: string[];
  roleTitles: string[];
  sections: CategorySection[];
  faq: CategoryFaq[];
  faqs: CategoryFaq[];
  relatedCategories: string[];
  ctaTitle: string;
  ctaDescription: string;
  [key: string]: any;
};

type FlexibleCareersJob = CareersJob & {
  category?: string | null;
  categories?: string[] | null;
  tags?: string[] | null;
  skills?: string[] | null;
  applyUrl?: string | null;
  apply_url?: string | null;
  sourceType?: string | null;
  source_type?: string | null;
};

export const CAREERS_CATEGORY_DEFS: CareersCategoryDef[] = [
  {
    key: "software_engineering",
    label: "Software Engineering",
    aliases: ["Software Engineering", "Technology & Engineering", "Engineering", "Developer"],
    strong: [
      "software engineer",
      "software developer",
      "frontend engineer",
      "front end engineer",
      "backend engineer",
      "back end engineer",
      "full stack engineer",
      "application engineer",
      "platform engineer",
      "principal software engineer",
      "senior software engineer",
      "forward deployed software engineer",
      "developer tools",
      "api engineer",
    ],
    keywords: [
      "software",
      "developer",
      "application development",
      "api",
      "codebase",
      "developer tools",
      "technical architecture",
    ],
  },
  {
    key: "cybersecurity",
    label: "Cybersecurity",
    aliases: [
      "Cybersecurity",
      "Cyber Security",
      "Security",
      "Information Security",
      "Application Security",
      "Infrastructure Security",
    ],
    strong: [
      "cybersecurity",
      "cyber security",
      "security engineer",
      "application security",
      "infrastructure security",
      "cloud security",
      "endpoint security",
      "data security",
      "information security",
      "security analyst",
      "security operations",
      "soc analyst",
      "vulnerability management",
      "threat detection",
      "iam analyst",
    ],
    keywords: [
      "security",
      "vulnerability",
      "threat",
      "secure development",
      "risk reduction",
      "security governance",
    ],
  },
  {
    key: "cloud_infrastructure",
    label: "Cloud, DevOps & Infrastructure",
    aliases: [
      "Cloud & Infrastructure",
      "Cloud / Azure",
      "Cloud Infrastructure",
      "Cloud",
      "DevOps / SRE",
      "DevOps",
      "SRE",
      "Infrastructure",
    ],
    strong: [
      "cloud engineer",
      "infrastructure engineer",
      "devops engineer",
      "site reliability engineer",
      "sre",
      "network engineer",
      "cloud architect",
      "azure architect",
      "solution architect",
      "solutions architect",
      "systems administrator",
      "systems engineer",
      "platform infrastructure",
      "storage layer",
    ],
    keywords: [
      "cloud",
      "infrastructure",
      "devops",
      "reliability",
      "terraform",
      "azure",
      "aws",
      "gcp",
      "google cloud",
      "kubernetes",
      "network",
      "endpoint",
      "architecture",
      "microsoft fabric",
    ],
  },
  {
    key: "data_science_analytics",
    label: "Data Science, AI & Analytics",
    aliases: [
      "Data Science & Analytics",
      "Data Analyst",
      "Data Analytics",
      "Analytics",
      "AI / Machine Learning",
      "Machine Learning",
      "Business Intelligence",
    ],
    strong: [
      "data scientist",
      "data analyst",
      "data engineer",
      "analytics engineer",
      "business intelligence analyst",
      "bi analyst",
      "reporting analyst",
      "machine learning engineer",
      "ml engineer",
      "ai engineer",
      "applied data scientist",
      "research analyst",
    ],
    keywords: [
      "analytics",
      "data",
      "modeling",
      "forecasting",
      "sql",
      "python",
      "power bi",
      "tableau",
      "dashboard",
      "reporting",
      "business intelligence",
      "metrics",
      "data-driven",
    ],
  },
  {
    key: "it_support_systems",
    label: "IT Support & Systems",
    aliases: [
      "IT Specialist",
      "Information Technology",
      "IT Support",
      "Technical Support",
      "Systems Support",
      "Help Desk",
      "Service Desk",
    ],
    strong: [
      "it specialist",
      "information technology specialist",
      "technical support specialist",
      "help desk analyst",
      "helpdesk analyst",
      "service desk analyst",
      "desktop support",
      "systems support",
      "it support analyst",
      "it systems analyst",
    ],
    keywords: [
      "information technology",
      "technical support",
      "ticketing",
      "help desk",
      "service desk",
      "hardware support",
      "software support",
    ],
  },
  {
    key: "product_management",
    label: "Product & Platform Management",
    aliases: ["Product Management", "Product Manager", "Platform Product", "Technical Product"],
    strong: [
      "product manager",
      "technical product manager",
      "platform product manager",
      "product analyst",
      "product owner",
      "product operations",
    ],
    keywords: [
      "product roadmap",
      "product strategy",
      "feature planning",
      "product requirements",
      "platform roadmap",
      "user stories",
    ],
  },
  {
    key: "program_project",
    label: "Program & Project Analyst",
    aliases: [
      "Program Analyst",
      "Project Analyst",
      "Project Management",
      "Program Management",
      "Management Analyst",
    ],
    strong: [
      "program analyst",
      "program manager",
      "project analyst",
      "project manager",
      "project coordinator",
      "program coordinator",
      "pmo analyst",
      "management analyst",
    ],
    keywords: [
      "program support",
      "project support",
      "stakeholder coordination",
      "workplan",
      "deliverables",
      "project management",
      "program operations",
    ],
  },
  {
    key: "business_analysis",
    label: "Business Analyst",
    aliases: [
      "Business Analyst",
      "Business Systems Analyst",
      "Requirements Analyst",
      "Process Analyst",
    ],
    strong: [
      "business analyst",
      "business systems analyst",
      "requirements analyst",
      "process analyst",
      "systems business analyst",
    ],
    keywords: [
      "requirements",
      "process improvement",
      "business process",
      "workflow",
      "stakeholder requirements",
      "functional requirements",
      "business requirements",
    ],
  },
  {
    key: "operations",
    label: "Operations",
    aliases: [
      "Operations",
      "Operations Analyst",
      "Business Operations",
      "Program Operations",
      "Administrative Operations",
    ],
    strong: [
      "operations analyst",
      "operations specialist",
      "operations manager",
      "business operations",
      "program operations",
      "logistics analyst",
      "workforce analyst",
      "administrative coordinator",
      "office coordinator",
    ],
    keywords: [
      "operations",
      "coordination",
      "logistics",
      "workflow support",
      "process support",
      "administrative",
      "service operations",
    ],
  },
  {
    key: "quality_testing",
    label: "Quality Assurance & Testing",
    aliases: ["Quality Analyst", "QA Analyst", "Testing", "Software Testing", "Test Analyst"],
    strong: [
      "qa analyst",
      "quality analyst",
      "test analyst",
      "software tester",
      "quality assurance analyst",
      "manual tester",
      "automation tester",
      "test engineer",
    ],
    keywords: [
      "quality assurance",
      "software testing",
      "test cases",
      "test plans",
      "defect tracking",
      "manual testing",
      "automated testing",
    ],
  },
  {
    key: "compliance_risk_regulatory",
    label: "Compliance, Risk & Regulatory",
    aliases: [
      "Compliance",
      "Risk",
      "Regulatory",
      "Compliance & Regulatory",
      "Risk Management",
      "Governance",
    ],
    strong: [
      "compliance analyst",
      "compliance specialist",
      "regulatory analyst",
      "regulatory specialist",
      "risk analyst",
      "audit analyst",
      "auditor",
      "privacy analyst",
      "hipaa compliance",
      "governance analyst",
      "controls analyst",
    ],
    keywords: [
      "compliance",
      "regulatory",
      "audit",
      "auditing",
      "privacy",
      "hipaa",
      "controls",
      "policy compliance",
      "risk management",
      "governance",
    ],
  },
  {
    key: "finance_accounting",
    label: "Finance & Accounting",
    aliases: [
      "Finance",
      "Finance Analyst",
      "Financial Analyst",
      "Accounting",
      "Budget Analyst",
      "Billing",
      "Revenue Cycle",
    ],
    strong: [
      "financial analyst",
      "finance analyst",
      "accountant",
      "accounting analyst",
      "budget analyst",
      "billing analyst",
      "revenue cycle analyst",
      "payroll analyst",
      "procurement analyst",
      "grant analyst",
      "contracts analyst",
    ],
    keywords: [
      "finance",
      "financial",
      "accounting",
      "budget",
      "billing",
      "revenue cycle",
      "payroll",
      "procurement",
      "grant",
      "contracts",
      "invoice",
    ],
  },
  {
    key: "government_public_sector",
    label: "Government & Public Sector",
    aliases: [
      "Government",
      "Public Sector",
      "Government Contractor",
      "Federal Contractor",
      "Public Service",
    ],
    strong: [
      "government contractor",
      "public sector",
      "federal contractor",
      "state government",
      "local government",
      "government program",
      "public service",
      "dod",
      "dhs",
      "cms",
      "va contract",
    ],
    keywords: [
      "government",
      "federal",
      "state agency",
      "public agency",
      "contractor",
      "public-sector",
      "public sector",
      "municipal",
      "county",
    ],
  },
  {
    key: "healthcare_analytics",
    label: "Healthcare Analytics",
    aliases: [
      "Healthcare Analyst",
      "Healthcare Analytics",
      "Health Data Analyst",
      "Clinical Data Analyst",
      "Healthcare Data & Analytics",
    ],
    strong: [
      "healthcare analyst",
      "clinical data analyst",
      "health data analyst",
      "population health analyst",
      "medical economics analyst",
      "hedis analyst",
      "healthcare analytics",
    ],
    keywords: [
      "healthcare data",
      "clinical data",
      "quality measures",
      "population health",
      "hedis",
      "value-based care",
      "medical economics",
      "health outcomes",
    ],
  },
  {
    key: "healthcare_it_systems",
    label: "Healthcare IT, EHR & Systems",
    aliases: [
      "Healthcare IT & Systems",
      "Healthcare IT",
      "Clinical Systems",
      "EHR / Epic / Cerner",
      "EHR",
      "Epic",
      "Cerner",
    ],
    strong: [
      "healthcare it",
      "clinical systems analyst",
      "application analyst",
      "health information technology",
      "clinical informatics",
      "epic analyst",
      "cerner analyst",
      "ehr analyst",
      "electronic health record",
    ],
    keywords: [
      "clinical systems",
      "health information",
      "ehr",
      "epic",
      "cerner",
      "clinical application",
      "healthcare systems",
    ],
  },
  {
    key: "medicaid_eligibility",
    label: "Medicaid Coverage & Eligibility",
    aliases: [
      "Medicaid",
      "Medicaid Analyst",
      "Medicaid Coverage & Eligibility",
      "Eligibility",
      "Enrollment",
      "Benefits Eligibility",
    ],
    strong: [
      "medicaid analyst",
      "medicaid eligibility",
      "eligibility specialist",
      "enrollment specialist",
      "benefits counselor",
      "benefits eligibility",
      "coverage specialist",
      "navigator",
      "patient access representative",
    ],
    keywords: [
      "medicaid",
      "eligibility",
      "enrollment",
      "coverage",
      "benefits",
      "patient access",
      "member eligibility",
    ],
  },
  {
    key: "care_workforce",
    label: "Care Workforce (CNA, GNA, Caregiver)",
    aliases: [
      "Care Workforce",
      "Care workforce (CNA, GNA, caregiver)",
      "CNA",
      "GNA",
      "Caregiver",
      "Direct Care",
      "Home Health Aide",
    ],
    strong: [
      "cna",
      "gna",
      "certified nursing assistant",
      "geriatric nursing assistant",
      "nursing assistant",
      "caregiver",
      "home health aide",
      "hha",
      "personal care aide",
      "personal care assistant",
      "direct care worker",
      "direct care aide",
      "direct support professional",
      "dsp",
      "patient care technician",
      "patient care tech",
      "resident aide",
      "resident assistant",
    ],
    keywords: [
      "companion care",
      "elder care",
      "senior care",
      "personal care",
      "direct support",
      "home care",
    ],
    exclude: [
      "security engineer",
      "software engineer",
      "cloud engineer",
      "data scientist",
      "data analyst",
      "devops",
      "infrastructure",
      "cybersecurity",
      "engineering",
      "application security",
      "domain engineering",
    ],
  },
  {
    key: "care_management",
    label: "Care Management & Coordination",
    aliases: [
      "Care Management",
      "Care Coordination",
      "Care management & coordination",
      "Case Management",
      "Service Coordination",
    ],
    strong: [
      "care manager",
      "care coordinator",
      "case manager",
      "case management",
      "care management",
      "service coordinator",
      "ltss coordinator",
      "social worker",
      "utilization management",
    ],
    keywords: [
      "care coordination",
      "member support",
      "patient support",
      "ltss",
      "discharge planning",
      "case coordination",
    ],
  },
  {
    key: "provider_data_credentialing",
    label: "Provider Data & Credentialing",
    aliases: [
      "Provider Data",
      "Provider Data & Credentialing",
      "Credentialing",
      "Provider Relations",
      "Provider Enrollment",
    ],
    strong: [
      "provider data",
      "credentialing specialist",
      "credentialing analyst",
      "provider enrollment",
      "provider relations",
      "provider configuration",
      "network analyst",
      "provider operations",
    ],
    keywords: [
      "credentialing",
      "provider network",
      "provider records",
      "network operations",
      "provider maintenance",
    ],
  },
  {
    key: "claims_payer_operations",
    label: "Claims & Payer Operations",
    aliases: [
      "Claims",
      "Claims systems & payer ops",
      "Claims & Payer Operations",
      "Payer Operations",
      "Payment Integrity",
    ],
    strong: [
      "claims analyst",
      "claims specialist",
      "claims processor",
      "claims configuration",
      "payment integrity",
      "payer operations",
      "edi analyst",
      "facets analyst",
      "qnxt analyst",
    ],
    keywords: [
      "claims",
      "payer",
      "payment integrity",
      "edi",
      "facets",
      "qnxt",
      "medical claims",
      "claim operations",
    ],
  },
  {
    key: "customer_support_success",
    label: "Customer Support & Success",
    aliases: [
      "Customer Support",
      "Customer Success",
      "Client Success",
      "Client Services",
      "Support Specialist",
    ],
    strong: [
      "customer support",
      "customer success",
      "client success",
      "support specialist",
      "client services",
      "customer service representative",
      "customer experience specialist",
    ],
    keywords: [
      "customer service",
      "customer experience",
      "client support",
      "user support",
      "support operations",
    ],
  },
  {
    key: "sales_business_development",
    label: "Sales & Business Development",
    aliases: [
      "Sales",
      "Business Development",
      "Account Executive",
      "Partnerships",
      "Account Management",
    ],
    strong: [
      "sales representative",
      "account executive",
      "business development",
      "sales manager",
      "partnerships manager",
      "client development",
      "account manager",
    ],
    keywords: [
      "sales",
      "partnerships",
      "pipeline",
      "prospecting",
      "revenue growth",
      "account management",
    ],
  },
];

const LEGACY_SLUGS_BY_KEY: Record<string, string[]> = {
  software_engineering: ["software-engineering-jobs", "technology-engineering-jobs"],
  cybersecurity: ["cybersecurity-jobs", "security-jobs"],
  cloud_infrastructure: ["cloud-infrastructure-jobs", "devops-sre-jobs", "cloud-azure-jobs"],
  data_science_analytics: [
    "data-science-analytics-jobs",
    "data-analyst-jobs",
    "analytics-jobs",
    "ai-machine-learning-jobs",
  ],
  it_support_systems: ["it-specialist-jobs", "it-support-jobs"],
  product_management: ["product-management-jobs"],
  program_project: ["program-analyst-jobs", "project-analyst-jobs"],
  business_analysis: ["business-analyst-jobs"],
  operations: ["operations-jobs", "operations-analyst-jobs"],
  quality_testing: ["quality-analyst-jobs", "qa-testing-jobs"],
  compliance_risk_regulatory: ["compliance-jobs", "risk-regulatory-jobs"],
  finance_accounting: ["finance-jobs", "financial-analyst-jobs", "accounting-jobs"],
  government_public_sector: ["government-jobs", "public-sector-jobs", "government-contractor-jobs"],
  healthcare_analytics: ["healthcare-analyst-jobs", "healthcare-data-analytics-jobs"],
  healthcare_it_systems: [
    "healthcare-it-jobs",
    "ehr-epic-cerner-jobs",
    "healthcare-it-systems-jobs",
  ],
  medicaid_eligibility: ["medicaid-analyst-jobs", "medicaid-eligibility-jobs"],
  care_workforce: ["care-workforce-jobs", "cna-gna-caregiver-jobs", "caregiver-jobs"],
  care_management: ["care-management-jobs", "care-coordination-jobs"],
  provider_data_credentialing: ["provider-data-jobs", "provider-data-credentialing-jobs"],
  claims_payer_operations: ["claims-jobs", "claims-payer-operations-jobs"],
  customer_support_success: ["customer-support-jobs", "customer-success-jobs"],
  sales_business_development: ["sales-business-development-jobs", "sales-jobs"],
};

export function normalizeCareersText(value: unknown): string {
  return String(value ?? "")
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9+#./\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function slugifyCategory(value: string): string {
  return normalizeCareersText(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function categorySearchQuery(def: CareersCategoryDef): string {
  return (def.aliases[0] || def.label).replace(/\s+jobs$/i, "");
}

function makeFaq(def: CareersCategoryDef): CategoryFaq[] {
  const question = `What types of ${def.label.toLowerCase()} jobs are listed on MedicaidReady Careers?`;
  const answer = `This category includes verified ${def.label.toLowerCase()} opportunities matched by job title, database category, skills, and role descriptions.`;

  return [
    {
      question,
      answer,
      q: question,
      a: answer,
    },
  ];
}

function buildCategoryConfig(def: CareersCategoryDef): CategoryConfig {
  const slug = `${slugifyCategory(def.label)}-jobs`;
  const legacySlugs = Array.from(new Set([slug, ...(LEGACY_SLUGS_BY_KEY[def.key] || [])]));
  const relatedCategories = CAREERS_CATEGORY_DEFS.filter((item) => item.key !== def.key)
    .slice(0, 4)
    .map((item) => item.label);
  const commonTitles = def.strong.slice(0, 8);
  const skills = def.keywords.slice(0, 8);
  const faq = makeFaq(def);

  return {
    ...def,
    slug,
    title: `${def.label} Jobs`,
    heading: `${def.label} Jobs`,
    subheading: `Explore verified ${def.label.toLowerCase()} roles with reviewed application links and clean job listings.`,
    eyebrow: "Verified Career Category",
    description: `Browse verified ${def.label.toLowerCase()} opportunities across MedicaidReady Careers.`,
    intro: `MedicaidReady Careers organizes ${def.label.toLowerCase()} roles into a clean, searchable category so job seekers can quickly find relevant openings without chasing broken links or duplicate listings.`,
    metaTitle: `${def.label} Jobs | MedicaidReady Careers`,
    metaDescription: `Find verified ${def.label.toLowerCase()} jobs with reviewed application links, clean listings, and career intelligence from MedicaidReady Careers.`,
    seoTitle: `${def.label} Jobs | MedicaidReady Careers`,
    seoDescription: `Find verified ${def.label.toLowerCase()} jobs with reviewed application links, clean listings, and career intelligence from MedicaidReady Careers.`,
    heroTitle: `${def.label} Jobs`,
    heroDescription: `Explore verified ${def.label.toLowerCase()} roles, hiring signals, and active opportunities.`,
    searchQuery: categorySearchQuery(def),
    href: `/careers/category/${slug}`,
    legacySlugs,
    popularSearches: def.aliases.slice(0, 6),
    relatedSearches: def.aliases.slice(0, 6),
    searches: def.aliases.slice(0, 6),
    marketSignals: [
      "Reviewed application links",
      "Cleaned duplicate listings",
      "Category-based job discovery",
    ],
    highlights: [
      "Verified opportunities",
      "Fresh job discovery",
      "Cleaner category filtering",
    ],
    skills,
    commonTitles,
    roleTitles: commonTitles,
    sections: [
      {
        title: `About ${def.label} roles`,
        heading: `About ${def.label} roles`,
        description: `This category helps job seekers browse verified ${def.label.toLowerCase()} openings and related career paths.`,
        body: `This category helps job seekers browse verified ${def.label.toLowerCase()} openings and related career paths.`,
      },
    ],
    faq,
    faqs: faq,
    relatedCategories,
    ctaTitle: `Find verified ${def.label.toLowerCase()} jobs`,
    ctaDescription: `Browse active opportunities, compare roles, and use MedicaidReady Careers to understand where the hiring market is moving.`,
  };
}

export const CATEGORY_CONFIGS: CategoryConfig[] = CAREERS_CATEGORY_DEFS.map(buildCategoryConfig);

export const CATEGORY_SLUGS: string[] = Array.from(
  new Set(CATEGORY_CONFIGS.flatMap((category) => category.legacySlugs))
);

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function containsCareersTerm(text: unknown, term: string): boolean {
  const normalizedText = normalizeCareersText(text);
  const normalizedTerm = normalizeCareersText(term);

  if (!normalizedText || !normalizedTerm) return false;

  if (/^[a-z0-9]+$/.test(normalizedTerm)) {
    const boundaryMatch = new RegExp(
      `(^|[^a-z0-9])${escapeRegExp(normalizedTerm)}([^a-z0-9]|$)`
    );

    return boundaryMatch.test(normalizedText);
  }

  return normalizedText.includes(normalizedTerm);
}

function arrayText(value: unknown): string {
  return Array.isArray(value) ? value.filter(Boolean).join(" ") : "";
}

export function careersJobSearchText(job: CareersJob): string {
  const flexibleJob = job as FlexibleCareersJob;

  return [
    job.title,
    job.company,
    flexibleJob.category,
    arrayText(flexibleJob.categories),
    arrayText(flexibleJob.tags),
    arrayText(flexibleJob.skills),
    job.location,
    job.remote,
    job.type,
    job.summary,
    job.description,
    arrayText(job.responsibilities),
    arrayText(job.requirements),
    arrayText(job.benefits),
    flexibleJob.applyUrl,
    flexibleJob.apply_url,
    flexibleJob.sourceType,
    flexibleJob.source_type,
  ]
    .filter(Boolean)
    .join(" ");
}

function acceptedCategoryTerms(def: CareersCategoryDef): string[] {
  return [def.key, def.label, ...def.aliases].filter(Boolean);
}

export function getCategoryConfig(slug: string): CategoryConfig | null {
  const normalizedSlug = slugifyCategory(slug);

  return (
    CATEGORY_CONFIGS.find((category) =>
      category.legacySlugs.some((legacySlug) => slugifyCategory(legacySlug) === normalizedSlug)
    ) ||
    CATEGORY_CONFIGS.find((category) =>
      acceptedCategoryTerms(category).some(
        (term) => normalizeCareersText(term) === normalizeCareersText(slug)
      )
    ) ||
    null
  );
}

export function findCareersCategoryByInput(value: unknown): CareersCategoryDef | null {
  const normalizedInput = normalizeCareersText(value);

  if (!normalizedInput) return null;

  const config = getCategoryConfig(String(value));
  if (config) return config;

  return (
    CAREERS_CATEGORY_DEFS.find((def) =>
      acceptedCategoryTerms(def).some((term) => normalizeCareersText(term) === normalizedInput)
    ) ?? null
  );
}

export function jobHasDirectCareersCategoryMatch(
  job: CareersJob,
  def: CareersCategoryDef
): boolean {
  const flexibleJob = job as FlexibleCareersJob;
  const jobCategoryValues = [
    flexibleJob.category,
    ...(Array.isArray(flexibleJob.categories) ? flexibleJob.categories : []),
  ]
    .filter(Boolean)
    .map((value) => normalizeCareersText(value));

  if (jobCategoryValues.length === 0) return false;

  const accepted = acceptedCategoryTerms(def).map((term) => normalizeCareersText(term));

  return jobCategoryValues.some((jobCategory) =>
    accepted.some(
      (acceptedCategory) =>
        jobCategory === acceptedCategory ||
        jobCategory.includes(acceptedCategory) ||
        acceptedCategory.includes(jobCategory)
    )
  );
}

export function scoreCareersCategory(
  job: CareersJob,
  def: CareersCategoryDef
): { score: number; hits: string[] } {
  const title = job.title || "";
  const summary = job.summary || "";
  const description = job.description || "";
  const all = careersJobSearchText(job);

  if (def.exclude?.some((term) => containsCareersTerm(all, term))) {
    return { score: 0, hits: [] };
  }

  let score = 0;
  const hits: string[] = [];

  if (jobHasDirectCareersCategoryMatch(job, def)) {
    score += 40;
    hits.push("database-category");
  }

  for (const term of def.strong) {
    if (containsCareersTerm(title, term)) {
      score += 12;
      hits.push(`title:${term}`);
    } else if (containsCareersTerm(summary, term)) {
      score += 7;
      hits.push(`summary:${term}`);
    } else if (containsCareersTerm(description, term)) {
      score += 5;
      hits.push(`description:${term}`);
    } else if (containsCareersTerm(all, term)) {
      score += 4;
      hits.push(`text:${term}`);
    }
  }

  for (const term of def.keywords) {
    if (containsCareersTerm(title, term)) {
      score += 6;
      hits.push(`title:${term}`);
    } else if (containsCareersTerm(summary, term)) {
      score += 4;
      hits.push(`summary:${term}`);
    } else if (containsCareersTerm(description, term)) {
      score += 2;
      hits.push(`description:${term}`);
    } else if (containsCareersTerm(all, term)) {
      score += 1;
      hits.push(`text:${term}`);
    }
  }

  return { score, hits };
}

export function getBestCareersCategory(job: CareersJob): CareersCategoryDef | null {
  const scored = CAREERS_CATEGORY_DEFS.map((def) => ({
    def,
    ...scoreCareersCategory(job, def),
  }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.def.label.localeCompare(b.def.label));

  return scored[0]?.def ?? null;
}

export function jobMatchesCareersCategory(
  job: CareersJob,
  def: CareersCategoryDef
): boolean {
  if (jobHasDirectCareersCategoryMatch(job, def)) return true;

  const result = scoreCareersCategory(job, def);

  return result.score >= 7;
}

function categoryConfigInputValue(
  categoryInput: CategoryConfig | CareersCategoryDef | string
): string {
  if (typeof categoryInput === "string") return categoryInput;

  if ("slug" in categoryInput && typeof categoryInput.slug === "string") {
    return categoryInput.slug;
  }

  return categoryInput.key || categoryInput.label;
}

function filterJobsForCategory(
  jobs: CareersJob[],
  categoryInput: CategoryConfig | CareersCategoryDef | string
): CareersJob[] {
  const config = getCategoryConfig(categoryConfigInputValue(categoryInput));

  if (!config) return [];

  const def = CAREERS_CATEGORY_DEFS.find((category) => category.key === config.key);

  if (!def) return [];

  return jobs.filter((job) => jobMatchesCareersCategory(job, def));
}

export function listJobsForCategory(slug: string): Promise<CareersJob[]>;
export function listJobsForCategory(
  jobs: CareersJob[],
  category: CategoryConfig | CareersCategoryDef | string
): CareersJob[];
export function listJobsForCategory(
  jobsOrSlug: CareersJob[] | string,
  category?: CategoryConfig | CareersCategoryDef | string
): Promise<CareersJob[]> | CareersJob[] {
  if (typeof jobsOrSlug === "string" && category === undefined) {
    return import("./db").then(async ({ listApprovedJobs }) => {
      const jobs = await listApprovedJobs();

      return filterJobsForCategory(jobs, jobsOrSlug);
    });
  }

  if (Array.isArray(jobsOrSlug) && category !== undefined) {
    return filterJobsForCategory(jobsOrSlug, category);
  }

  return [];
}