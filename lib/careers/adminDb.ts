import { supabaseAdmin } from "../supabaseAdmin";

export type AdminJobRow = {
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
  salary_currency: string;
  salary_period: "year" | "month" | "hour";
  salary_display: string | null;
  summary: string | null;
  description: string | null;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  apply_url: string | null;
  source_type: string;
  status: string;
  featured: boolean;
  expires_at: string | null;
  published_at: string | null;
  contact_name: string | null;
  contact_email: string | null;
  payment_status: string;
  payment_tier: string;
  stripe_session_id: string | null;
  stripe_payment_intent_id: string | null;
  paid_at: string | null;
  submitted_via: string | null;
  created_at: string;
  updated_at: string;
};

export type JobInput = Partial<Omit<AdminJobRow, "id" | "created_at" | "updated_at">>;

const FIELDS = [
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
  "contact_name",
  "contact_email",
  "payment_status",
  "payment_tier",
  "stripe_session_id",
  "stripe_payment_intent_id",
  "paid_at",
  "submitted_via",
  "created_at",
  "updated_at",
].join(", ");

const VALID_WORK_MODE = new Set(["remote", "hybrid", "on_site"]);
const VALID_EMPLOYMENT = new Set(["full_time", "part_time", "contract", "internship"]);
const VALID_SALARY_PERIOD = new Set(["year", "month", "hour"]);
const VALID_STATUS = new Set([
  "draft",
  "pending_review",
  "approved",
  "rejected",
  "archived",
  "expired",
]);
const VALID_SOURCE = new Set(["manual", "self_serve", "imported", "partner", "sample"]);
const VALID_PAYMENT_STATUS = new Set(["unpaid", "paid", "refunded", "free"]);
const VALID_PAYMENT_TIER = new Set(["free", "standard", "featured"]);

function trimOrNull(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const t = v.trim();
  return t || null;
}

function numberOrNull(v: unknown): number | null {
  if (v == null || v === "") return null;
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : null;
}

function arrayOf(v: unknown): string[] {
  if (Array.isArray(v)) {
    return v.map((x) => String(x).trim()).filter(Boolean);
  }
  if (typeof v === "string") {
    return v
      .split(/\r?\n/)
      .map((x) => x.trim())
      .filter(Boolean);
  }
  return [];
}

function isoOrNull(v: unknown): string | null {
  if (typeof v !== "string" || !v.trim()) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function sanitizeForWrite(input: JobInput): Record<string, unknown> {
  const patch: Record<string, unknown> = {};

  if ("slug" in input) {
    const v = trimOrNull(input.slug);
    if (v) patch.slug = slugify(v);
  }
  if ("title" in input) patch.title = trimOrNull(input.title);
  if ("company" in input) patch.company = trimOrNull(input.company);
  if ("category" in input) patch.category = trimOrNull(input.category);
  if ("location" in input) patch.location = trimOrNull(input.location);

  if ("work_mode" in input) {
    const v = trimOrNull(input.work_mode);
    patch.work_mode = v && VALID_WORK_MODE.has(v) ? v : null;
  }
  if ("employment_type" in input) {
    const v = trimOrNull(input.employment_type);
    patch.employment_type = v && VALID_EMPLOYMENT.has(v) ? v : null;
  }

  if ("salary_min" in input) patch.salary_min = numberOrNull(input.salary_min);
  if ("salary_max" in input) patch.salary_max = numberOrNull(input.salary_max);

  if ("salary_currency" in input) {
    const v = trimOrNull(input.salary_currency)?.toUpperCase();
    if (v && v.length === 3) patch.salary_currency = v;
    else if (input.salary_currency === "" || input.salary_currency == null)
      patch.salary_currency = "USD";
  }

  if ("salary_period" in input) {
    const v = trimOrNull(input.salary_period);
    if (v && VALID_SALARY_PERIOD.has(v)) patch.salary_period = v;
  }
  if ("salary_display" in input) patch.salary_display = trimOrNull(input.salary_display);

  if ("summary" in input) patch.summary = trimOrNull(input.summary);
  if ("description" in input) patch.description = trimOrNull(input.description);
  if ("responsibilities" in input) patch.responsibilities = arrayOf(input.responsibilities);
  if ("requirements" in input) patch.requirements = arrayOf(input.requirements);
  if ("benefits" in input) patch.benefits = arrayOf(input.benefits);

  if ("apply_url" in input) patch.apply_url = trimOrNull(input.apply_url);
  if ("source_type" in input) {
    const v = trimOrNull(input.source_type);
    if (v && VALID_SOURCE.has(v)) patch.source_type = v;
  }
  if ("status" in input) {
    const v = trimOrNull(input.status);
    if (v && VALID_STATUS.has(v)) patch.status = v;
  }
  if ("featured" in input) patch.featured = Boolean(input.featured);

  if ("expires_at" in input) patch.expires_at = isoOrNull(input.expires_at);
  if ("published_at" in input) patch.published_at = isoOrNull(input.published_at);

  if ("contact_name" in input) patch.contact_name = trimOrNull(input.contact_name);
  if ("contact_email" in input) {
    const v = trimOrNull(input.contact_email);
    patch.contact_email = v ? v.toLowerCase() : null;
  }
  if ("payment_status" in input) {
    const v = trimOrNull(input.payment_status);
    if (v && VALID_PAYMENT_STATUS.has(v)) patch.payment_status = v;
  }
  if ("payment_tier" in input) {
    const v = trimOrNull(input.payment_tier);
    if (v && VALID_PAYMENT_TIER.has(v)) patch.payment_tier = v;
  }
  if ("paid_at" in input) patch.paid_at = isoOrNull(input.paid_at);

  return patch;
}

export async function adminListJobs(): Promise<AdminJobRow[]> {
  const sb = supabaseAdmin();
  const { data, error } = await sb
    .from("careers_jobs")
    .select(FIELDS)
    .order("updated_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as AdminJobRow[];
}

export async function adminGetJob(id: string): Promise<AdminJobRow | null> {
  const sb = supabaseAdmin();
  const { data, error } = await sb
    .from("careers_jobs")
    .select(FIELDS)
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data ?? null) as unknown as AdminJobRow | null;
}

export async function adminCreateJob(input: JobInput): Promise<AdminJobRow> {
  const title = trimOrNull(input.title);
  const company = trimOrNull(input.company);
  if (!title) throw new Error("title_required");
  if (!company) throw new Error("company_required");

  const slug =
    (input.slug && slugify(String(input.slug))) ||
    slugify(`${title}-${company}-${Date.now().toString(36)}`);

  const patch = sanitizeForWrite({ ...input, slug });
  if (!patch.status) patch.status = "draft";
  if (!patch.source_type) patch.source_type = "manual";
  if (!patch.salary_currency) patch.salary_currency = "USD";
  if (!patch.salary_period) patch.salary_period = "year";
  if (!patch.payment_status) patch.payment_status = "free";
  if (!patch.payment_tier) patch.payment_tier = "free";

  const sb = supabaseAdmin();
  const { data, error } = await sb
    .from("careers_jobs")
    .insert(patch)
    .select(FIELDS)
    .single();
  if (error) throw new Error(error.message);
  return data as unknown as AdminJobRow;
}

export async function adminUpdateJob(id: string, input: JobInput): Promise<AdminJobRow> {
  const patch = sanitizeForWrite(input);
  if (Object.keys(patch).length === 0) {
    const existing = await adminGetJob(id);
    if (!existing) throw new Error("not_found");
    return existing;
  }
  const sb = supabaseAdmin();
  const { data, error } = await sb
    .from("careers_jobs")
    .update(patch)
    .eq("id", id)
    .select(FIELDS)
    .single();
  if (error) throw new Error(error.message);
  return data as unknown as AdminJobRow;
}

export async function adminDeleteJob(id: string): Promise<void> {
  const sb = supabaseAdmin();
  const { error } = await sb.from("careers_jobs").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
