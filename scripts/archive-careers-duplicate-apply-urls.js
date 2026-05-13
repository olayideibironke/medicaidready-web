/* eslint-disable no-console */

const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

const PROJECT_ROOT = process.cwd();
const ENV_PATH = path.join(PROJECT_ROOT, ".env.local");

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

    if (!process.env[key]) process.env[key] = value;
  }
}

function hasArg(name) {
  return process.argv.includes(name);
}

function getReportPath() {
  const positional = process.argv.slice(2).filter((arg) => !arg.startsWith("--"));
  return positional[0] || null;
}

function pickKeeper(group) {
  const jobs = [...group.jobs];

  jobs.sort((a, b) => {
    const aManual = a.source_type === "manual" ? 1 : 0;
    const bManual = b.source_type === "manual" ? 1 : 0;

    if (aManual !== bManual) return bManual - aManual;

    const aUpdated = new Date(a.updated_at || a.created_at || 0).getTime();
    const bUpdated = new Date(b.updated_at || b.created_at || 0).getTime();

    return bUpdated - aUpdated;
  });

  return jobs[0];
}

async function main() {
  loadDotEnvLocal();

  const reportPath = getReportPath();
  const dryRun = hasArg("--dry-run");

  if (!reportPath) {
    console.error("Missing report path.");
    console.error("");
    console.error("Usage:");
    console.error(
      "node scripts/archive-careers-duplicate-apply-urls.js reports/careers-audit-file.json --dry-run"
    );
    console.error(
      "node scripts/archive-careers-duplicate-apply-urls.js reports/careers-audit-file.json"
    );
    process.exit(1);
  }

  const fullReportPath = path.resolve(PROJECT_ROOT, reportPath);

  if (!fs.existsSync(fullReportPath)) {
    console.error(`Report file not found: ${fullReportPath}`);
    process.exit(1);
  }

  const report = JSON.parse(fs.readFileSync(fullReportPath, "utf8"));

  const groups =
    report &&
    report.duplicates &&
    Array.isArray(report.duplicates.apply_urls)
      ? report.duplicates.apply_urls
      : [];

  const archiveIds = new Set();
  const decisions = [];

  for (const group of groups) {
    if (!Array.isArray(group.jobs) || group.jobs.length < 2) continue;

    const keeper = pickKeeper(group);
    const extras = group.jobs.filter((job) => job.id !== keeper.id);

    for (const extra of extras) {
      archiveIds.add(extra.id);
    }

    decisions.push({
      key: group.key,
      keep: keeper,
      archive: extras,
    });
  }

  const ids = [...archiveIds];

  console.log(`Loaded report: ${fullReportPath}`);
  console.log(`Duplicate apply URL groups: ${groups.length}`);
  console.log(`Unique duplicate jobs to archive: ${ids.length}`);
  console.log("");

  for (const decision of decisions) {
    console.log(`Apply URL: ${decision.key}`);
    console.log(`  KEEP: ${decision.keep.title} — ${decision.keep.company}`);
    for (const extra of decision.archive) {
      console.log(`  ARCHIVE: ${extra.title} — ${extra.company}`);
    }
    console.log("");
  }

  if (ids.length === 0) {
    console.log("Nothing to archive.");
    return;
  }

  if (dryRun) {
    console.log("Dry run only. No jobs were changed.");
    return;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRole) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, serviceRole, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("careers_jobs")
    .update({
      status: "archived",
      expires_at: now,
      updated_at: now,
    })
    .in("id", ids)
    .select("id,title,company,status");

  if (error) {
    console.error("Supabase update failed:", error.message);
    process.exit(1);
  }

  console.log(`Archived ${data ? data.length : 0} duplicate apply URL jobs.`);
  console.log("Done.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});