const fs = require("fs");
const path = require("path");

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;

  const raw = fs.readFileSync(filePath, "utf8");

  raw.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) return;

    const eq = trimmed.indexOf("=");
    if (eq === -1) return;

    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!process.env[key]) {
      process.env[key] = value;
    }
  });
}

try {
  require("@next/env").loadEnvConfig(process.cwd());
} catch {
  loadEnvFile(path.join(process.cwd(), ".env.local"));
  loadEnvFile(path.join(process.cwd(), ".env"));
}

const { createClient } = require("@supabase/supabase-js");

const CATEGORY_DEFS = [
  {
    key: "technology_engineering",
    label: "Technology & Engineering",
    strong: [
      "software engineer",
      "software developer",
      "frontend engineer",
      "backend engineer",
      "full stack engineer",
      "application engineer",
      "platform engineer",
      "systems engineer",
      "domain engineering",
      "engineering specialist",
      "developer",
      "api platform",
    ],
    keywords: [
      "engineering",
      "software",
      "developer",
      "application",
      "platform",
      "api",
      "systems",
      "technical solutions",
      "technical operations",
    ],
  },
  {
    key: "cybersecurity",
    label: "Cybersecurity",
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
      "vulnerability management",
      "threat detection",
      "security analyst",
      "security operations",
      "soc analyst",
      "iam",
      "identity access",
    ],
    keywords: [
      "security",
      "vulnerability",
      "threat",
      "risk reduction",
      "secure development",
      "security practices",
      "governance-focused technical",
    ],
  },
  {
    key: "cloud_infrastructure",
    label: "Cloud & Infrastructure",
    strong: [
      "cloud engineer",
      "infrastructure engineer",
      "devops engineer",
      "site reliability engineer",
      "sre",
      "network engineer",
      "cloud architect",
      "systems administrator",
      "infrastructure security engineer",
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
    ],
  },
  {
    key: "data_science_analytics",
    label: "Data Science & Analytics",
    strong: [
      "data scientist",
      "data analyst",
      "data engineer",
      "analytics engineer",
      "business intelligence analyst",
      "bi analyst",
      "reporting analyst",
      "machine learning",
      "ml engineer",
      "research analyst",
    ],
    keywords: [
      "analytics",
      "data products",
      "modeling",
      "forecasting",
      "research",
      "sql",
      "python",
      "power bi",
      "tableau",
      "dashboard",
      "reporting",
      "business intelligence",
      "metrics",
    ],
  },
  {
    key: "program_project",
    label: "Program & Project Analyst",
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
      "user stories",
      "functional requirements",
    ],
  },
  {
    key: "operations",
    label: "Operations",
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
      "customer operations",
    ],
  },
  {
    key: "compliance_risk_regulatory",
    label: "Compliance, Risk & Regulatory",
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
      "quality assurance analyst",
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
      "quality assurance",
      "quality improvement",
      "policy compliance",
      "risk management",
    ],
  },
  {
    key: "finance_accounting",
    label: "Finance & Accounting",
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
    strong: [
      "healthcare analyst",
      "clinical data analyst",
      "health data analyst",
      "quality analyst",
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
    label: "Healthcare IT & Systems",
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
    ],
  },
  {
    key: "care_management",
    label: "Care Management & Coordination",
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
    strong: [
      "customer support",
      "customer success",
      "client success",
      "support specialist",
      "help desk",
      "service desk",
      "technical support",
      "client services",
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
    strong: [
      "sales representative",
      "account executive",
      "business development",
      "sales manager",
      "partnerships manager",
      "client development",
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

const SELECT_FIELDS = [
  "id",
  "slug",
  "title",
  "company",
  "category",
  "location",
  "work_mode",
  "employment_type",
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

function normalize(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9+#./\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function containsTerm(text, term) {
  const normalizedText = normalize(text);
  const normalizedTerm = normalize(term);

  if (!normalizedText || !normalizedTerm) return false;

  if (/^[a-z0-9]+$/.test(normalizedTerm)) {
    const boundaryMatch = new RegExp(
      `(^|[^a-z0-9])${escapeRegExp(normalizedTerm)}([^a-z0-9]|$)`
    );
    return boundaryMatch.test(normalizedText);
  }

  return normalizedText.includes(normalizedTerm);
}

function arrayText(value) {
  return Array.isArray(value) ? value.join(" ") : "";
}

function jobText(job) {
  return [
    job.title,
    job.company,
    job.category,
    job.location,
    job.work_mode,
    job.employment_type,
    job.summary,
    job.description,
    arrayText(job.responsibilities),
    arrayText(job.requirements),
    arrayText(job.benefits),
    job.apply_url,
    job.source_type,
  ]
    .filter(Boolean)
    .join(" ");
}

function scoreCategory(job, def) {
  const title = job.title || "";
  const summary = job.summary || "";
  const description = job.description || "";
  const category = job.category || "";
  const all = jobText(job);

  if ((def.exclude || []).some((term) => containsTerm(all, term))) {
    return 0;
  }

  let score = 0;
  const hits = [];

  for (const term of def.strong || []) {
    if (containsTerm(title, term)) {
      score += 10;
      hits.push(`title:${term}`);
    } else if (containsTerm(summary, term)) {
      score += 6;
      hits.push(`summary:${term}`);
    } else if (containsTerm(description, term)) {
      score += 4;
      hits.push(`description:${term}`);
    } else if (containsTerm(all, term)) {
      score += 3;
      hits.push(`text:${term}`);
    }
  }

  for (const term of def.keywords || []) {
    if (containsTerm(title, term)) {
      score += 5;
      hits.push(`title:${term}`);
    } else if (containsTerm(summary, term)) {
      score += 3;
      hits.push(`summary:${term}`);
    } else if (containsTerm(description, term)) {
      score += 2;
      hits.push(`description:${term}`);
    } else if (containsTerm(all, term)) {
      score += 1;
      hits.push(`text:${term}`);
    }
  }

  if (category) {
    const normalizedCategory = normalize(category);
    if (
      normalizedCategory === normalize(def.key) ||
      normalizedCategory === normalize(def.label) ||
      normalizedCategory.includes(normalize(def.label)) ||
      normalize(def.label).includes(normalizedCategory)
    ) {
      score += 12;
      hits.push(`db_category:${category}`);
    }
  }

  return { score, hits };
}

function categorizeJob(job) {
  const scored = CATEGORY_DEFS.map((def) => {
    const result = scoreCategory(job, def);
    if (typeof result === "number") {
      return { key: def.key, label: def.label, score: result, hits: [] };
    }

    return {
      key: def.key,
      label: def.label,
      score: result.score,
      hits: result.hits,
    };
  })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.label.localeCompare(b.label));

  const primary = scored[0] || null;
  const secondary = scored.filter((item) => primary && item.key !== primary.key && item.score >= Math.max(4, primary.score * 0.55));

  return {
    primary,
    allMatches: scored,
    secondary,
  };
}

function safeFilePart(value) {
  return value.replace(/[:.]/g, "-");
}

function toCsvValue(value) {
  const text = Array.isArray(value) ? value.join(" | ") : String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

function writeReports(report) {
  const reportsDir = path.join(process.cwd(), "reports");
  fs.mkdirSync(reportsDir, { recursive: true });

  const stamp = safeFilePart(new Date().toISOString());
  const jsonPath = path.join(reportsDir, `careers-category-audit-${stamp}.json`);
  const csvPath = path.join(reportsDir, `careers-category-audit-${stamp}.csv`);

  fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2), "utf8");

  const csvRows = [
    [
      "slug",
      "title",
      "company",
      "location",
      "work_mode",
      "employment_type",
      "database_category",
      "suggested_category",
      "suggested_score",
      "secondary_categories",
      "matched_terms",
      "summary",
      "apply_url",
    ],
  ];

  for (const item of report.jobs) {
    csvRows.push([
      item.slug,
      item.title,
      item.company,
      item.location,
      item.work_mode,
      item.employment_type,
      item.database_category,
      item.suggested_category,
      item.suggested_score,
      item.secondary_categories,
      item.matched_terms,
      item.summary,
      item.apply_url,
    ]);
  }

  fs.writeFileSync(
    csvPath,
    csvRows.map((row) => row.map(toCsvValue).join(",")).join("\n"),
    "utf8"
  );

  return { jsonPath, csvPath };
}

async function main() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL;

  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_KEY ||
    process.env.SUPABASE_SERVICE_ROLE;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error("");
    console.error("Missing Supabase environment variables.");
    console.error("Expected NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
    console.error("");
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const nowIso = new Date().toISOString();

  const { data, error } = await supabase
    .from("careers_jobs")
    .select(SELECT_FIELDS)
    .eq("status", "approved")
    .or(`expires_at.is.null,expires_at.gt.${nowIso}`)
    .order("featured", { ascending: false })
    .order("published_at", { ascending: false, nullsFirst: false });

  if (error) {
    console.error("Category audit query failed:");
    console.error(error.message);
    process.exit(1);
  }

  const jobs = data || [];

  const auditedJobs = jobs.map((job) => {
    const categorized = categorizeJob(job);
    const primary = categorized.primary;

    return {
      slug: job.slug,
      title: job.title,
      company: job.company,
      location: job.location || "",
      work_mode: job.work_mode || "",
      employment_type: job.employment_type || "",
      database_category: job.category || "",
      suggested_category: primary ? primary.label : "UNCATEGORIZED",
      suggested_category_key: primary ? primary.key : "uncategorized",
      suggested_score: primary ? primary.score : 0,
      secondary_categories: categorized.secondary.map((item) => item.label),
      matched_terms: primary ? primary.hits : [],
      all_matches: categorized.allMatches,
      summary: job.summary || "",
      apply_url: job.apply_url || "",
    };
  });

  const categoryCounts = auditedJobs.reduce((acc, job) => {
    acc[job.suggested_category] = (acc[job.suggested_category] || 0) + 1;
    return acc;
  }, {});

  const uncategorized = auditedJobs.filter((job) => job.suggested_category_key === "uncategorized");

  const multiMatch = auditedJobs.filter((job) => job.secondary_categories.length > 0);

  const dbCategoryMismatches = auditedJobs.filter((job) => {
    if (!job.database_category) return false;

    const db = normalize(job.database_category);
    const suggestedLabel = normalize(job.suggested_category);
    const suggestedKey = normalize(job.suggested_category_key);

    return db !== suggestedLabel && db !== suggestedKey && !suggestedLabel.includes(db) && !db.includes(suggestedLabel);
  });

  const report = {
    generated_at: new Date().toISOString(),
    total_jobs: auditedJobs.length,
    category_counts: Object.fromEntries(
      Object.entries(categoryCounts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    ),
    uncategorized_count: uncategorized.length,
    multi_match_count: multiMatch.length,
    database_category_mismatch_count: dbCategoryMismatches.length,
    uncategorized_jobs: uncategorized,
    multi_match_jobs: multiMatch,
    database_category_mismatches: dbCategoryMismatches,
    jobs: auditedJobs,
  };

  const { jsonPath, csvPath } = writeReports(report);

  console.log("");
  console.log("CAREERS CATEGORY AUDIT COMPLETE");
  console.log("================================");
  console.log(`Total approved active jobs: ${report.total_jobs}`);
  console.log(`Uncategorized jobs: ${report.uncategorized_count}`);
  console.log(`Multiple likely categories: ${report.multi_match_count}`);
  console.log(`Database category mismatches: ${report.database_category_mismatch_count}`);
  console.log("");
  console.log("CATEGORY COUNTS");
  console.log("---------------");

  for (const [category, count] of Object.entries(report.category_counts)) {
    console.log(`${String(count).padStart(4, " ")}  ${category}`);
  }

  if (uncategorized.length > 0) {
    console.log("");
    console.log("UNCATEGORIZED JOBS");
    console.log("------------------");

    uncategorized.slice(0, 25).forEach((job) => {
      console.log(`- ${job.title} | ${job.company} | ${job.slug}`);
    });

    if (uncategorized.length > 25) {
      console.log(`...and ${uncategorized.length - 25} more. See JSON report.`);
    }
  }

  if (dbCategoryMismatches.length > 0) {
    console.log("");
    console.log("DATABASE CATEGORY MISMATCHES");
    console.log("----------------------------");

    dbCategoryMismatches.slice(0, 25).forEach((job) => {
      console.log(
        `- ${job.title} | DB: ${job.database_category || "blank"} | Suggested: ${job.suggested_category}`
      );
    });

    if (dbCategoryMismatches.length > 25) {
      console.log(`...and ${dbCategoryMismatches.length - 25} more. See JSON report.`);
    }
  }

  console.log("");
  console.log(`JSON report: ${jsonPath}`);
  console.log(`CSV report:  ${csvPath}`);
  console.log("");
}

main().catch((error) => {
  console.error("Unexpected category audit failure:");
  console.error(error);
  process.exit(1);
});