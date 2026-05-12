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

    if (!process.env[key]) process.env[key] = value;
  }
}

function hasArg(name) {
  return process.argv.includes(name);
}

function argValue(name, fallback = null) {
  const exact = process.argv.find((arg) => arg.startsWith(`${name}=`));
  if (!exact) return fallback;
  return exact.slice(name.length + 1);
}

function timestamp() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

function parseDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function jobAgeDate(job) {
  return (
    parseDate(job.published_at) ||
    parseDate(job.created_at) ||
    parseDate(job.updated_at)
  );
}

function sourceAllowed(job, mode) {
  if (mode === "all") return true;
  if (mode === "imported") return job.source_type === "imported";
  if (mode === "manual") return job.source_type === "manual";
  if (mode === "self_serve") return job.source_type === "self_serve";
  return job.source_type === "imported";
}

async function main() {
  loadDotEnvLocal();

  const dryRun = hasArg("--dry-run");
  const days = Number(argValue("--days", "45")) || 45;
  const sourceMode = argValue("--source", "imported");
  const limit = Number(argValue("--limit", "0")) || 0;

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

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);

  console.log("");
  console.log("MedicaidReady Careers old-job expiration");
  console.log(`Mode: ${dryRun ? "DRY RUN" : "LIVE UPDATE"}`);
  console.log(`Archive approved jobs older than: ${days} days`);
  console.log(`Source filter: ${sourceMode}`);
  console.log(`Cutoff date: ${cutoff.toISOString()}`);
  console.log("");

  const { data, error } = await supabase
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
        "published_at",
        "created_at",
        "updated_at",
        "expires_at",
      ].join(",")
    )
    .eq("status", "approved")
    .order("published_at", { ascending: true, nullsFirst: true });

  if (error) {
    console.error("Supabase query failed:", error.message);
    process.exit(1);
  }

  const jobs = data || [];

  const staleJobs = jobs.filter((job) => {
    if (!sourceAllowed(job, sourceMode)) return false;

    const ageDate = jobAgeDate(job);
    if (!ageDate) return false;

    return ageDate < cutoff;
  });

  const selectedJobs = limit > 0 ? staleJobs.slice(0, limit) : staleJobs;

  console.log(`Approved jobs checked: ${jobs.length}`);
  console.log(`Stale jobs found: ${staleJobs.length}`);
  console.log(`Selected for archive: ${selectedJobs.length}`);
  console.log("");

  if (selectedJobs.length > 0) {
    console.log("Preview:");
    for (const job of selectedJobs.slice(0, 20)) {
      const ageDate = jobAgeDate(job);
      console.log(
        `- ${job.title} — ${job.company} | ${job.source_type} | ${
          ageDate ? ageDate.toISOString().slice(0, 10) : "unknown date"
        }`
      );
    }

    if (selectedJobs.length > 20) {
      console.log(`...and ${selectedJobs.length - 20} more`);
    }
  }

  fs.mkdirSync(REPORTS_DIR, { recursive: true });

  const reportPath = path.join(
    REPORTS_DIR,
    `careers-expiration-${timestamp()}.json`
  );

  const report = {
    generated_at: new Date().toISOString(),
    dry_run: dryRun,
    days,
    source_mode: sourceMode,
    cutoff: cutoff.toISOString(),
    approved_jobs_checked: jobs.length,
    stale_jobs_found: staleJobs.length,
    selected_for_archive: selectedJobs.length,
    selected_jobs: selectedJobs,
  };

  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), "utf8");

  console.log("");
  console.log(`Report written to: ${reportPath}`);

  if (dryRun) {
    console.log("");
    console.log("Dry run only. No jobs were changed.");
    return;
  }

  if (selectedJobs.length === 0) {
    console.log("");
    console.log("No jobs to archive.");
    return;
  }

  const ids = selectedJobs.map((job) => job.id);
  const now = new Date().toISOString();

  const { data: updated, error: updateError } = await supabase
    .from("careers_jobs")
    .update({
      status: "archived",
      expires_at: now,
      updated_at: now,
    })
    .in("id", ids)
    .select("id,title,company,status");

  if (updateError) {
    console.error("Supabase update failed:", updateError.message);
    process.exit(1);
  }

  console.log("");
  console.log(`Archived ${updated ? updated.length : 0} stale jobs.`);
  console.log("Done.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});