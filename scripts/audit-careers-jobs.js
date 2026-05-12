/* eslint-disable no-console */

const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

const PROJECT_ROOT = process.cwd();
const ENV_PATH = path.join(PROJECT_ROOT, ".env.local");
const REPORTS_DIR = path.join(PROJECT_ROOT, "reports");

function loadDotEnvLocal() {
  if (!fs.existsSync(ENV_PATH)) return;

  const lines = fs.readFileSync(ENV_PATH, "utf8").split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;

    const index = trimmed.indexOf("=");
    const key = trimmed.slice(0, index).trim();
    let value = trimmed.slice(index + 1).trim();

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

function argValue(name, fallback = null) {
  const exact = process.argv.find((arg) => arg.startsWith(`${name}=`));
  if (!exact) return fallback;
  return exact.slice(name.length + 1);
}

function hasArg(name) {
  return process.argv.includes(name);
}

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeUrl(value) {
  try {
    const raw = String(value || "").trim();

    if (!raw) return "";

    const url = new URL(raw);

    url.hash = "";
    url.searchParams.delete("utm_source");
    url.searchParams.delete("utm_medium");
    url.searchParams.delete("utm_campaign");
    url.searchParams.delete("utm_content");
    url.searchParams.delete("utm_term");

    return url.toString().replace(/\/$/, "").toLowerCase();
  } catch {
    return String(value || "").trim().toLowerCase();
  }
}

function csvEscape(value) {
  const text = value == null ? "" : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

function toCsv(rows, columns) {
  const header = columns.map(csvEscape).join(",");
  const body = rows
    .map((row) => columns.map((column) => csvEscape(row[column])).join(","))
    .join("\n");

  return `${header}\n${body}\n`;
}

function timestamp() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

function groupBy(rows, keyFn) {
  const map = new Map();

  for (const row of rows) {
    const key = keyFn(row);
    if (!key) continue;

    if (!map.has(key)) map.set(key, []);
    map.get(key).push(row);
  }

  return Array.from(map.entries())
    .filter(([, group]) => group.length > 1)
    .map(([key, group]) => ({ key, count: group.length, jobs: group }));
}

function simpleJob(row) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    company: row.company,
    location: row.location,
    status: row.status,
    source_type: row.source_type,
    apply_url: row.apply_url,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 15000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      redirect: "follow",
      signal: controller.signal,
      ...options,
      headers: {
        "User-Agent":
          "Mozilla/5.0 MedicaidReadyCareersBot/1.0 (+https://www.medicaidready.org/careers)",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        ...(options.headers || {}),
      },
    });

    if (response.body && typeof response.body.cancel === "function") {
      try {
        await response.body.cancel();
      } catch {
        // ignore body cancel errors
      }
    }

    return response;
  } finally {
    clearTimeout(timer);
  }
}

function classifyStatus(status) {
  if (status >= 200 && status < 400) return "ok";
  if ([401, 403, 429].includes(status)) return "blocked_or_rate_limited";
  if ([404, 410].includes(status)) return "broken";
  if (status >= 500) return "server_error";
  return "warning";
}

async function checkUrl(row) {
  const url = row.apply_url;

  if (!url || !String(url).trim()) {
    return {
      id: row.id,
      slug: row.slug,
      title: row.title,
      company: row.company,
      apply_url: url || "",
      result: "missing",
      status: "",
      final_url: "",
      error: "missing_apply_url",
    };
  }

  try {
    new URL(url);
  } catch {
    return {
      id: row.id,
      slug: row.slug,
      title: row.title,
      company: row.company,
      apply_url: url,
      result: "invalid",
      status: "",
      final_url: "",
      error: "invalid_url",
    };
  }

  try {
    let response;

    try {
      response = await fetchWithTimeout(url, { method: "HEAD" }, 12000);
    } catch {
      response = null;
    }

    if (
      !response ||
      [405, 403, 406, 501].includes(response.status) ||
      response.status >= 500
    ) {
      response = await fetchWithTimeout(url, { method: "GET" }, 18000);
    }

    const result = classifyStatus(response.status);

    return {
      id: row.id,
      slug: row.slug,
      title: row.title,
      company: row.company,
      apply_url: url,
      result,
      status: response.status,
      final_url: response.url || url,
      error: "",
    };
  } catch (error) {
    return {
      id: row.id,
      slug: row.slug,
      title: row.title,
      company: row.company,
      apply_url: url,
      result: "error",
      status: "",
      final_url: "",
      error: error && error.name === "AbortError" ? "timeout" : String(error.message || error),
    };
  }
}

async function runWithConcurrency(items, limit, worker) {
  const results = [];
  let index = 0;

  async function next() {
    while (index < items.length) {
      const currentIndex = index;
      index += 1;
      results[currentIndex] = await worker(items[currentIndex], currentIndex);
    }
  }

  const workers = Array.from({ length: Math.min(limit, items.length) }, next);
  await Promise.all(workers);

  return results;
}

async function main() {
  loadDotEnvLocal();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRole) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
    process.exit(1);
  }

  const checkLinks = hasArg("--check-links");
  const includeAllStatuses = hasArg("--all");
  const concurrency = Number(argValue("--concurrency", "5")) || 5;

  const supabase = createClient(url, serviceRole, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  let query = supabase
    .from("careers_jobs")
    .select(
      [
        "id",
        "slug",
        "title",
        "company",
        "location",
        "status",
        "source_type",
        "apply_url",
        "created_at",
        "updated_at",
      ].join(",")
    )
    .order("created_at", { ascending: false });

  if (!includeAllStatuses) {
    query = query.eq("status", "approved");
  }

  const { data, error } = await query;

  if (error) {
    console.error("Supabase query failed:", error.message);
    process.exit(1);
  }

  const jobs = data || [];

  fs.mkdirSync(REPORTS_DIR, { recursive: true });

  console.log(`Loaded ${jobs.length} ${includeAllStatuses ? "total" : "approved"} careers_jobs rows.`);

  const duplicateSlugs = groupBy(jobs, (job) => normalizeText(job.slug));
  const duplicateApplyUrls = groupBy(jobs, (job) => normalizeUrl(job.apply_url));
  const duplicateTitleCompany = groupBy(
    jobs,
    (job) => `${normalizeText(job.title)}::${normalizeText(job.company)}`
  );
  const duplicateTitleCompanyLocation = groupBy(
    jobs,
    (job) =>
      `${normalizeText(job.title)}::${normalizeText(job.company)}::${normalizeText(job.location)}`
  );

  const missingApplyUrls = jobs
    .filter((job) => !job.apply_url || !String(job.apply_url).trim())
    .map(simpleJob);

  let linkResults = [];
  if (checkLinks) {
    console.log(`Checking ${jobs.length} apply URLs with concurrency ${concurrency}...`);

    linkResults = await runWithConcurrency(jobs, concurrency, async (job, i) => {
      const result = await checkUrl(job);
      console.log(
        `[${i + 1}/${jobs.length}] ${result.result} ${result.status || ""} — ${job.title}`
      );
      return result;
    });
  }

  const brokenLinks = linkResults.filter((row) =>
    ["broken", "invalid", "missing"].includes(row.result)
  );

  const warningLinks = linkResults.filter((row) =>
    ["blocked_or_rate_limited", "server_error", "warning", "error"].includes(row.result)
  );

  const report = {
    generated_at: new Date().toISOString(),
    scope: includeAllStatuses ? "all_statuses" : "approved_only",
    checked_links: checkLinks,
    counts: {
      jobs: jobs.length,
      duplicate_slugs: duplicateSlugs.length,
      duplicate_apply_urls: duplicateApplyUrls.length,
      duplicate_title_company: duplicateTitleCompany.length,
      duplicate_title_company_location: duplicateTitleCompanyLocation.length,
      missing_apply_urls: missingApplyUrls.length,
      broken_links: brokenLinks.length,
      warning_links: warningLinks.length,
    },
    duplicates: {
      slugs: duplicateSlugs.map((g) => ({
        key: g.key,
        count: g.count,
        jobs: g.jobs.map(simpleJob),
      })),
      apply_urls: duplicateApplyUrls.map((g) => ({
        key: g.key,
        count: g.count,
        jobs: g.jobs.map(simpleJob),
      })),
      title_company: duplicateTitleCompany.map((g) => ({
        key: g.key,
        count: g.count,
        jobs: g.jobs.map(simpleJob),
      })),
      title_company_location: duplicateTitleCompanyLocation.map((g) => ({
        key: g.key,
        count: g.count,
        jobs: g.jobs.map(simpleJob),
      })),
    },
    missing_apply_urls: missingApplyUrls,
    broken_links: brokenLinks,
    warning_links: warningLinks,
  };

  const base = path.join(REPORTS_DIR, `careers-audit-${timestamp()}`);

  fs.writeFileSync(`${base}.json`, JSON.stringify(report, null, 2), "utf8");

  fs.writeFileSync(
    `${base}-duplicate-title-company.csv`,
    toCsv(
      duplicateTitleCompany.flatMap((group) =>
        group.jobs.map((job) => ({
          duplicate_key: group.key,
          duplicate_count: group.count,
          ...simpleJob(job),
        }))
      ),
      [
        "duplicate_key",
        "duplicate_count",
        "id",
        "slug",
        "title",
        "company",
        "location",
        "status",
        "source_type",
        "apply_url",
        "created_at",
        "updated_at",
      ]
    ),
    "utf8"
  );

  fs.writeFileSync(
    `${base}-duplicate-apply-urls.csv`,
    toCsv(
      duplicateApplyUrls.flatMap((group) =>
        group.jobs.map((job) => ({
          duplicate_key: group.key,
          duplicate_count: group.count,
          ...simpleJob(job),
        }))
      ),
      [
        "duplicate_key",
        "duplicate_count",
        "id",
        "slug",
        "title",
        "company",
        "location",
        "status",
        "source_type",
        "apply_url",
        "created_at",
        "updated_at",
      ]
    ),
    "utf8"
  );

  if (checkLinks) {
    fs.writeFileSync(
      `${base}-broken-links.csv`,
      toCsv(brokenLinks, [
        "id",
        "slug",
        "title",
        "company",
        "apply_url",
        "result",
        "status",
        "final_url",
        "error",
      ]),
      "utf8"
    );

    fs.writeFileSync(
      `${base}-warning-links.csv`,
      toCsv(warningLinks, [
        "id",
        "slug",
        "title",
        "company",
        "apply_url",
        "result",
        "status",
        "final_url",
        "error",
      ]),
      "utf8"
    );
  }

  console.log("");
  console.log("Audit complete.");
  console.log(`Jobs checked: ${jobs.length}`);
  console.log(`Duplicate title+company groups: ${duplicateTitleCompany.length}`);
  console.log(`Duplicate title+company+location groups: ${duplicateTitleCompanyLocation.length}`);
  console.log(`Duplicate apply URL groups: ${duplicateApplyUrls.length}`);
  console.log(`Missing apply URLs: ${missingApplyUrls.length}`);

  if (checkLinks) {
    console.log(`Broken links: ${brokenLinks.length}`);
    console.log(`Warning links: ${warningLinks.length}`);
  } else {
    console.log("Link checking skipped. Add --check-links to test apply URLs.");
  }

  console.log("");
  console.log(`Report written to: ${base}.json`);
  console.log("");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});