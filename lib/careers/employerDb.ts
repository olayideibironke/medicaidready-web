import { supabaseAdmin } from "../supabaseAdmin";
import { slugify } from "./adminDb";

export type EmployerSubmissionInput = {
  title: string;
  company: string;
  contactName?: string;
  contactEmail: string;
  category?: string;
  location?: string;
  workMode?: string;
  employmentType?: string;
  salaryMin?: number | string | null;
  salaryMax?: number | string | null;
  salaryCurrency?: string;
  salaryPeriod?: string;
  salaryDisplay?: string;
  summary?: string;
  description: string;
  responsibilities?: string[] | string;
  requirements?: string[] | string;
  benefits?: string[] | string;
  applyUrl?: string;
  paymentTier?: string;
};

export type EmployerSubmissionResult = {
  id: string;
  slug: string;
  payment_tier: "free" | "standard" | "featured";
  payment_status: "free" | "unpaid";
};

const VALID_WORK_MODE = new Set(["remote", "hybrid", "on_site"]);
const VALID_EMPLOYMENT = new Set(["full_time", "part_time", "contract", "internship"]);
const VALID_TIER = new Set(["free", "standard", "featured"]);
const VALID_SALARY_PERIOD = new Set(["year", "month", "hour"]);

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
    return v.map((x) => String(x).trim()).filter(Boolean).slice(0, 50);
  }
  if (typeof v === "string") {
    return v
      .split(/\r?\n/)
      .map((x) => x.trim())
      .filter(Boolean)
      .slice(0, 50);
  }
  return [];
}

function isValidEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

function isHttpUrl(s: string): boolean {
  try {
    const u = new URL(s);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export async function createEmployerSubmission(
  input: EmployerSubmissionInput
): Promise<EmployerSubmissionResult> {
  const title = trimOrNull(input.title);
  if (!title) throw new Error("title_required");

  const company = trimOrNull(input.company);
  if (!company) throw new Error("company_required");

  const contactEmailRaw = trimOrNull(input.contactEmail);
  if (!contactEmailRaw || !isValidEmail(contactEmailRaw)) {
    throw new Error("contact_email_invalid");
  }

  const description = trimOrNull(input.description);
  if (!description) throw new Error("description_required");

  const applyUrlRaw = trimOrNull(input.applyUrl);
  if (applyUrlRaw && !isHttpUrl(applyUrlRaw)) {
    throw new Error("apply_url_invalid");
  }

  const tierRaw = trimOrNull(input.paymentTier) || "free";
  const tier: "free" | "standard" | "featured" = VALID_TIER.has(tierRaw)
    ? (tierRaw as "free" | "standard" | "featured")
    : "free";

  const workMode = trimOrNull(input.workMode);
  const workModeFinal =
    workMode && VALID_WORK_MODE.has(workMode) ? workMode : null;

  const employmentType = trimOrNull(input.employmentType);
  const employmentTypeFinal =
    employmentType && VALID_EMPLOYMENT.has(employmentType) ? employmentType : null;

  const salaryPeriodRaw = trimOrNull(input.salaryPeriod);
  const salaryPeriod =
    salaryPeriodRaw && VALID_SALARY_PERIOD.has(salaryPeriodRaw)
      ? salaryPeriodRaw
      : "year";

  const salaryCurrencyRaw = trimOrNull(input.salaryCurrency)?.toUpperCase();
  const salaryCurrency =
    salaryCurrencyRaw && salaryCurrencyRaw.length === 3 ? salaryCurrencyRaw : "USD";

  const slug = slugify(`${title}-${company}-${Date.now().toString(36)}`);
  const paymentStatus: "free" | "unpaid" = tier === "free" ? "free" : "unpaid";

  const sb = supabaseAdmin();
  const { data, error } = await sb
    .from("careers_jobs")
    .insert({
      slug,
      title,
      company,
      contact_name: trimOrNull(input.contactName),
      contact_email: contactEmailRaw.toLowerCase(),
      category: trimOrNull(input.category),
      location: trimOrNull(input.location),
      work_mode: workModeFinal,
      employment_type: employmentTypeFinal,
      salary_min: numberOrNull(input.salaryMin),
      salary_max: numberOrNull(input.salaryMax),
      salary_currency: salaryCurrency,
      salary_period: salaryPeriod,
      salary_display: trimOrNull(input.salaryDisplay),
      summary: trimOrNull(input.summary),
      description,
      responsibilities: arrayOf(input.responsibilities),
      requirements: arrayOf(input.requirements),
      benefits: arrayOf(input.benefits),
      apply_url: applyUrlRaw,
      source_type: "self_serve",
      status: "pending_review",
      featured: false,
      payment_status: paymentStatus,
      payment_tier: tier,
      submitted_via: "self_serve_form",
    })
    .select("id, slug, payment_tier, payment_status")
    .single();

  if (error) throw new Error(error.message);

  return {
    id: data.id as string,
    slug: data.slug as string,
    payment_tier: tier,
    payment_status: paymentStatus,
  };
}

export type MarkPaidInput = {
  jobId: string;
  tier: "standard" | "featured";
  stripeSessionId?: string | null;
  stripePaymentIntentId?: string | null;
};

export async function markJobPaid(input: MarkPaidInput): Promise<void> {
  if (!input.jobId) throw new Error("job_id_required");
  if (input.tier !== "standard" && input.tier !== "featured") {
    throw new Error("invalid_tier");
  }

  const sb = supabaseAdmin();
  const { error } = await sb
    .from("careers_jobs")
    .update({
      payment_status: "paid",
      payment_tier: input.tier,
      stripe_session_id: input.stripeSessionId ?? null,
      stripe_payment_intent_id: input.stripePaymentIntentId ?? null,
      paid_at: new Date().toISOString(),
      featured: input.tier === "featured",
    })
    .eq("id", input.jobId);

  if (error) throw new Error(error.message);
}

export async function getJobIdForCheckoutByStripeSession(
  sessionId: string
): Promise<string | null> {
  const sb = supabaseAdmin();
  const { data, error } = await sb
    .from("careers_jobs")
    .select("id")
    .eq("stripe_session_id", sessionId)
    .maybeSingle();
  if (error) return null;
  return (data?.id as string | undefined) ?? null;
}
