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

async function main() {
  loadDotEnvLocal();

  const dryRun = hasArg("--dry-run");

  const duplicateJobIdsToArchive = [
    "6ab61257-4207-4bfe-9e4d-b63733238120",
    "1eb997df-a7be-4081-9ccb-a59d16c736b8",
  ];

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL in .env.local");
  if (!serviceRole) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY in .env.local");

  const supabase = createClient(supabaseUrl, serviceRole, {
    auth: { persistSession: false },
  });

  console.log(`Duplicate job IDs to archive: ${duplicateJobIdsToArchive.length}`);

  const { data: jobs, error: fetchError } = await supabase
    .from("careers_jobs")
    .select("id, slug, title, company, status, created_at")
    .in("id", duplicateJobIdsToArchive);

  if (fetchError) throw fetchError;

  console.log("");
  console.log("Preview:");
  for (const job of jobs || []) {
    console.log(`- ${job.title} — ${job.company} — ${job.slug} — ${job.status}`);
  }

  if (dryRun) {
    console.log("");
    console.log("Dry run only. No jobs were changed.");
    return;
  }

  const { error: updateError } = await supabase
    .from("careers_jobs")
    .update({
      status: "archived",
      updated_at: new Date().toISOString(),
    })
    .in("id", duplicateJobIdsToArchive);

  if (updateError) throw updateError;

  console.log("");
  console.log(`Archived ${duplicateJobIdsToArchive.length} duplicate jobs.`);
  console.log("Done.");
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});