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

function normalize(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function dateValue(job) {
  const value = job.published_at || job.created_at || job.updated_at;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

async function main() {
  loadDotEnvLocal();

  const dryRun = hasArg("--dry-run");

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL in .env.local");
  if (!serviceRole) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY in .env.local");

  const supabase = createClient(supabaseUrl, serviceRole, {
    auth: { persistSession: false },
  });

  const { data: jobs, error } = await supabase
    .from("careers_jobs")
    .select("id, slug, title, company, location, status, published_at, created_at, updated_at")
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (error) throw error;

  const groups = new Map();

  for (const job of jobs || []) {
    const key = [
      normalize(job.title),
      normalize(job.company),
      normalize(job.location),
    ].join("::");

    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(job);
  }

  const archiveIds = [];

  console.log("Duplicate groups found:");

  for (const [key, group] of groups.entries()) {
    if (group.length <= 1) continue;

    const sorted = [...group].sort((a, b) => dateValue(b) - dateValue(a));
    const keep = sorted[0];
    const remove = sorted.slice(1);

    console.log("");
    console.log(`Group: ${key}`);
    console.log(`KEEP: ${keep.title} — ${keep.company} — ${keep.slug}`);

    for (const job of remove) {
      console.log(`ARCHIVE: ${job.title} — ${job.company} — ${job.slug}`);
      archiveIds.push(job.id);
    }
  }

  console.log("");
  console.log(`Duplicate jobs to archive: ${archiveIds.length}`);

  if (archiveIds.length === 0) {
    console.log("Nothing to archive.");
    return;
  }

  if (dryRun) {
    console.log("Dry run only. No jobs were changed.");
    return;
  }

  const { error: updateError } = await supabase
    .from("careers_jobs")
    .update({
      status: "archived",
      updated_at: new Date().toISOString(),
    })
    .in("id", archiveIds);

  if (updateError) throw updateError;

  console.log(`Archived ${archiveIds.length} duplicate jobs.`);
  console.log("Done.");
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});