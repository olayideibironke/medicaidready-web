#!/usr/bin/env node
/*
  MedicaidReady Careers bulk job importer

  Usage:
    node scripts/import-careers-jobs.js data/careers_seed_jobs_50.json --dry-run
    node scripts/import-careers-jobs.js data/careers_seed_jobs_50.json
    node scripts/import-careers-jobs.js data/careers_seed_jobs_50.json --force-status pending_review

  This script:
  - Reads .env.local automatically.
  - Uses NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY.
  - Upserts into careers_jobs by slug.
  - Does not touch any existing MedicaidReady quiz, guide, Stripe, PDF, or provider tables.
*/

const fs = require("fs");
const path = require("path");

const ALLOWED_STATUS = new Set([
  "draft",
  "pending_review",
  "approved",
  "rejected",
  "archived",
  "expired",
]);

const ALLOWED_WORK_MODE = new Set(["remote", "hybrid", "on_site"]);
const ALLOWED_EMPLOYMENT_TYPE = new Set([
  "full_time",
  "part_time",
  "contract",
  "internship",
]);
const ALLOWED_SALARY_PERIOD = new Set(["year", "month", "hour"]);
const ALLOWED_SOURCE_TYPE = new Set(["manual", "self_serve", "imported", "partner", "sample"]);
const ALLOWED_PAYMENT_STATUS = new Set(["unpaid", "paid", "refunded", "free"]);
const ALLOWED_PAYMENT_TIER = new Set(["free", "standard", "featured"]);

function loadDotEnvLocal() {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;

  const content = fs.readFileSync(envPath, "utf8");
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;

    const key = trimmed.slice(0, idx).trim();
    let value = trimmed.slice(idx + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

function argValue(flag) {
  const idx = process.argv.indexOf(flag);
  if (idx === -1) return null;
  return process.argv[idx + 1] || null;
}

function slugify(value) {
  return String(value || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-")
    .toLowerCase()
    .slice(0, 90);
}

function asNullableString(value) {
  if (value === null || value === undefined) return null;
  const s = String(value).trim();
  return s ? s : null;
}

function asStringArray(value) {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item || "").trim())
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(/\r?\n/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function asNumberOrNull(value) {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function asIsoOrNull(value) {
  const s = asNullableString(value);
  if (!s) return null;
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

function isValidHttpUrl(value) {
  try {
    const u = new URL(value);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

function sanitizeJob(raw, index, forceStatus) {
  const title = asNullableString(raw.title);
  const company = asNullableString(raw.company);
  const applyUrl = asNullableString(raw.apply_url || raw.applyUrl);

  if (!title) throw new Error(`Row ${index + 1}: missing title`);
  if (!company) throw new Error(`Row ${index + 1}: missing company`);
  if (!applyUrl || !isValidHttpUrl(applyUrl)) {
    throw new Error(`Row ${index + 1}: missing/invalid apply_url for ${title}`);
  }

  const workMode = asNullableString(raw.work_mode || raw.workMode) || "remote";
  if (!ALLOWED_WORK_MODE.has(workMode)) {
    throw new Error(`Row ${index + 1}: invalid work_mode "${workMode}"`);
  }

  const employmentType =
    asNullableString(raw.employment_type || raw.employmentType) || "full_time";
  if (!ALLOWED_EMPLOYMENT_TYPE.has(employmentType)) {
    throw new Error(`Row ${index + 1}: invalid employment_type "${employmentType}"`);
  }

  const salaryPeriod =
    asNullableString(raw.salary_period || raw.salaryPeriod) || "year";
  if (!ALLOWED_SALARY_PERIOD.has(salaryPeriod)) {
    throw new Error(`Row ${index + 1}: invalid salary_period "${salaryPeriod}"`);
  }

  const status = forceStatus || asNullableString(raw.status) || "pending_review";
  if (!ALLOWED_STATUS.has(status)) {
    throw new Error(`Row ${index + 1}: invalid status "${status}"`);
  }

  const sourceType = asNullableString(raw.source_type || raw.sourceType) || "imported";
  if (!ALLOWED_SOURCE_TYPE.has(sourceType)) {
    throw new Error(`Row ${index + 1}: invalid source_type "${sourceType}"`);
  }

  const paymentStatus = asNullableString(raw.payment_status || raw.paymentStatus) || "free";
  if (!ALLOWED_PAYMENT_STATUS.has(paymentStatus)) {
    throw new Error(`Row ${index + 1}: invalid payment_status "${paymentStatus}"`);
  }

  const paymentTier = asNullableString(raw.payment_tier || raw.paymentTier) || "free";
  if (!ALLOWED_PAYMENT_TIER.has(paymentTier)) {
    throw new Error(`Row ${index + 1}: invalid payment_tier "${paymentTier}"`);
  }

  const slug = asNullableString(raw.slug) || slugify(`${title} ${company}`);

  return {
    slug,
    title,
    company,
    category: asNullableString(raw.category),
    location: asNullableString(raw.location),
    work_mode: workMode,
    employment_type: employmentType,
    salary_min: asNumberOrNull(raw.salary_min ?? raw.salaryMin),
    salary_max: asNumberOrNull(raw.salary_max ?? raw.salaryMax),
    salary_currency: asNullableString(raw.salary_currency || raw.salaryCurrency) || "USD",
    salary_period: salaryPeriod,
    salary_display: asNullableString(raw.salary_display || raw.salaryDisplay),
    summary: asNullableString(raw.summary),
    description: asNullableString(raw.description),
    responsibilities: asStringArray(raw.responsibilities),
    requirements: asStringArray(raw.requirements),
    benefits: asStringArray(raw.benefits),
    apply_url: applyUrl,
    source_type: sourceType,
    status,
    featured: Boolean(raw.featured),
    expires_at: asIsoOrNull(raw.expires_at || raw.expiresAt),
    published_at: asIsoOrNull(raw.published_at || raw.publishedAt) || new Date().toISOString(),
    contact_name: asNullableString(raw.contact_name || raw.contactName),
    contact_email: asNullableString(raw.contact_email || raw.contactEmail),
    payment_status: paymentStatus,
    payment_tier: paymentTier,
    submitted_via: asNullableString(raw.submitted_via || raw.submittedVia) || "seed_import",
  };
}

async function upsertCareersJobs(rows) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL in .env.local");
  }

  if (!serviceRoleKey) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY in .env.local");
  }

  const endpoint = `${supabaseUrl.replace(/\/$/, "")}/rest/v1/careers_jobs?on_conflict=slug`;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=representation",
    },
    body: JSON.stringify(rows),
  });

  const text = await res.text();

  if (!res.ok) {
    throw new Error(`Supabase upsert failed (${res.status}): ${text}`);
  }

  try {
    return JSON.parse(text);
  } catch {
    return [];
  }
}

async function main() {
  loadDotEnvLocal();

  const inputPath = process.argv[2];
  const dryRun = process.argv.includes("--dry-run");
  const forceStatus = argValue("--force-status");

  if (!inputPath || inputPath.startsWith("--")) {
    console.error("Usage: node scripts/import-careers-jobs.js data/careers_seed_jobs_50.json [--dry-run] [--force-status approved|pending_review]");
    process.exit(1);
  }

  if (forceStatus && !ALLOWED_STATUS.has(forceStatus)) {
    console.error(`Invalid --force-status value: ${forceStatus}`);
    process.exit(1);
  }

  const fullPath = path.resolve(process.cwd(), inputPath);
  if (!fs.existsSync(fullPath)) {
    console.error(`File not found: ${fullPath}`);
    process.exit(1);
  }

  const raw = JSON.parse(fs.readFileSync(fullPath, "utf8"));
  if (!Array.isArray(raw)) {
    throw new Error("Seed file must be a JSON array.");
  }

  const rows = raw.map((job, index) => sanitizeJob(job, index, forceStatus));
  const duplicateSlugs = rows
    .map((row) => row.slug)
    .filter((slug, index, arr) => arr.indexOf(slug) !== index);

  if (duplicateSlugs.length > 0) {
    throw new Error(`Duplicate slugs in input: ${[...new Set(duplicateSlugs)].join(", ")}`);
  }

  console.log(`Prepared ${rows.length} careers_jobs rows.`);
  console.log(`Status counts: ${JSON.stringify(rows.reduce((acc, row) => {
    acc[row.status] = (acc[row.status] || 0) + 1;
    return acc;
  }, {}), null, 2)}`);

  if (dryRun) {
    console.log("Dry run only. No rows were inserted.");
    console.log("First row preview:");
    console.log(JSON.stringify(rows[0], null, 2));
    return;
  }

  const inserted = await upsertCareersJobs(rows);
  console.log(`Supabase upsert complete. Rows returned: ${inserted.length}`);
  console.log("Done.");
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
