import { supabaseAdmin } from "../supabaseAdmin";
import {
  SAMPLE_JOBS,
  type CareersJob,
  type CareersJobMode,
  type CareersJobType,
} from "./sampleJobs";

type CareersJobRow = {
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

type CareersJobWithApplyUrl = CareersJob & {
  applyUrl: string | null;
  apply_url: string | null;
  sourceType: string | null;
  source_type: string | null;
};

const TYPE_MAP: Record<string, CareersJobType> = {
  full_time: "Full-time",
  part_time: "Part-time",
  contract: "Contract",
  internship: "Internship",
};

const MODE_MAP: Record<string, CareersJobMode> = {
  remote: "Remote",
  hybrid: "Hybrid",
  on_site: "On-site",
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

function toNumberOrNull(v: number | string | null | undefined): number | null {
  if (v == null) return null;

  const n = typeof v === "number" ? v : Number(v);

  return Number.isFinite(n) ? n : null;
}

function formatSalary(row: CareersJobRow): string {
  if (row.salary_display && row.salary_display.trim()) {
    return row.salary_display.trim();
  }

  const min = toNumberOrNull(row.salary_min);
  const max = toNumberOrNull(row.salary_max);

  if (min == null && max == null) {
    return "";
  }

  const currency = row.salary_currency ?? "USD";
  const symbol = currency === "USD" ? "$" : `${currency} `;
  const periodLabel =
    row.salary_period === "hour"
      ? "/ hr"
      : row.salary_period === "month"
        ? "/ month"
        : "/ year";

  const fmt = (n: number) => `${symbol}${n.toLocaleString()}`;

  if (min != null && max != null) {
    return `${fmt(min)} – ${fmt(max)} ${periodLabel}`;
  }

  if (min != null) {
    return `${fmt(min)}+ ${periodLabel}`;
  }

  if (max != null) {
    return `up to ${fmt(max)} ${periodLabel}`;
  }

  return "";
}

export function rowToCareersJob(row: CareersJobRow): CareersJob {
  const applyUrl = typeof row.apply_url === "string" ? row.apply_url.trim() : "";

  const job: CareersJobWithApplyUrl = {
    id: row.slug,
    title: row.title,
    company: row.company,
    location: row.location ?? "",
    type: row.employment_type ? (TYPE_MAP[row.employment_type] ?? "Full-time") : "Full-time",
    remote: row.work_mode ? (MODE_MAP[row.work_mode] ?? "On-site") : "On-site",
    salary: formatSalary(row),
    postedAt: row.published_at ?? row.created_at,
    summary: row.summary ?? "",
    description: row.description ?? "",
    responsibilities: row.responsibilities ?? [],
    requirements: row.requirements ?? [],
    benefits: row.benefits ?? [],
    applyUrl: applyUrl || null,
    apply_url: applyUrl || null,
    sourceType: row.source_type ?? null,
    source_type: row.source_type ?? null,
  };

  return job;
}

export async function listApprovedJobs(): Promise<CareersJob[]> {
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
      console.warn("[careers] listApprovedJobs query failed:", error.message);
      return SAMPLE_JOBS;
    }

    if (!data || data.length === 0) {
      return SAMPLE_JOBS;
    }

    return (data as unknown as CareersJobRow[]).map(rowToCareersJob);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.warn("[careers] listApprovedJobs threw:", msg);
    return SAMPLE_JOBS;
  }
}

export async function getApprovedJobBySlug(slug: string): Promise<CareersJob | null> {
  try {
    const sb = supabaseAdmin();

    const { data, error } = await sb
      .from("careers_jobs")
      .select(SELECT_FIELDS)
      .eq("slug", slug)
      .eq("status", "approved")
      .maybeSingle();

    if (error) {
      console.warn("[careers] getApprovedJobBySlug query failed:", error.message);
    }

    if (data) {
      return rowToCareersJob(data as unknown as CareersJobRow);
    }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.warn("[careers] getApprovedJobBySlug threw:", msg);
  }

  return SAMPLE_JOBS.find((j) => j.id === slug) ?? null;
}

export async function listApprovedJobSlugs(): Promise<string[]> {
  try {
    const sb = supabaseAdmin();

    const { data, error } = await sb
      .from("careers_jobs")
      .select("slug")
      .eq("status", "approved");

    if (error) {
      console.warn("[careers] listApprovedJobSlugs query failed:", error.message);
    } else if (data && data.length > 0) {
      return (data as { slug: string }[]).map((r) => r.slug);
    }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.warn("[careers] listApprovedJobSlugs threw:", msg);
  }

  return SAMPLE_JOBS.map((j) => j.id);
}