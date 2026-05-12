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
  const positional = process.argv
    .slice(2)
    .filter((arg) => !arg.startsWith("--"));

  return positional[0] || null;
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
      "node scripts/archive-careers-broken-links.js reports/careers-audit-file.json --dry-run"
    );
    console.error(
      "node scripts/archive-careers-broken-links.js reports/careers-audit-file.json"
    );
    process.exit(1);
  }

  const fullReportPath = path.resolve(PROJECT_ROOT, reportPath);

  if (!fs.existsSync(fullReportPath)) {
    console.error(`Report file not found: ${fullReportPath}`);
    process.exit(1);
  }

  const report = JSON.parse(fs.readFileSync(fullReportPath, "utf8"));
  const brokenLinks = Array.isArray(report.broken_links)
    ? report.broken_links
    : [];

  const ids = [...new Set(brokenLinks.map((row) => row.id).filter(Boolean))];

  console.log(`Loaded report: ${fullReportPath}`);
  console.log(`Broken-link rows in report: ${brokenLinks.length}`);
  console.log(`Unique job IDs to archive: ${ids.length}`);

  if (ids.length === 0) {
    console.log("Nothing to archive.");
    return;
  }

  console.log("");
  console.log("Preview:");
  for (const row of brokenLinks.slice(0, 10)) {
    console.log(`- ${row.title} — ${row.company} (${row.status || row.result})`);
  }

  if (brokenLinks.length > 10) {
    console.log(`...and ${brokenLinks.length - 10} more`);
  }

  if (dryRun) {
    console.log("");
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
    .select("id,title,company,status,apply_url");

  if (error) {
    console.error("Supabase update failed:", error.message);
    process.exit(1);
  }

  console.log("");
  console.log(`Archived ${data ? data.length : 0} jobs.`);
  console.log("Done.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});