import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { supabaseAdmin } from "../../../../lib/supabaseAdmin";

function getStripeSecret(): string | null {
  const v = process.env.STRIPE_SECRET_KEY;
  return typeof v === "string" && v.trim() ? v.trim() : null;
}

function priceIdForTier(tier: string): string | null {
  if (tier === "standard") {
    const v = process.env.STRIPE_CAREERS_STANDARD_PRICE_ID;
    return typeof v === "string" && v.trim() ? v.trim() : null;
  }
  if (tier === "featured") {
    const v = process.env.STRIPE_CAREERS_FEATURED_PRICE_ID;
    return typeof v === "string" && v.trim() ? v.trim() : null;
  }
  return null;
}

function isOriginSafe(req: NextApiRequest): boolean {
  const origin = req.headers.origin;
  if (typeof origin !== "string" || !origin) return true;
  const host = req.headers.host;
  if (typeof host !== "string" || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "method_not_allowed" });
  }
  if (!isOriginSafe(req)) {
    return res.status(403).json({ ok: false, error: "bad_origin" });
  }

  const stripeSecret = getStripeSecret();
  if (!stripeSecret) {
    return res.status(503).json({ ok: false, error: "careers_payment_disabled" });
  }

  const body = (req.body ?? {}) as { jobId?: unknown; tier?: unknown };
  const jobId = typeof body.jobId === "string" ? body.jobId.trim() : "";
  const tierRaw = typeof body.tier === "string" ? body.tier.trim() : "";

  if (!jobId) {
    return res.status(400).json({ ok: false, error: "missing_job_id" });
  }
  if (tierRaw !== "standard" && tierRaw !== "featured") {
    return res.status(400).json({ ok: false, error: "invalid_tier" });
  }

  const priceId = priceIdForTier(tierRaw);
  if (!priceId) {
    return res
      .status(503)
      .json({ ok: false, error: "careers_payment_tier_disabled", tier: tierRaw });
  }

  try {
    const sb = supabaseAdmin();
    const { data: job, error } = await sb
      .from("careers_jobs")
      .select("id, title, company, contact_email, payment_status, status")
      .eq("id", jobId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!job) {
      return res.status(404).json({ ok: false, error: "job_not_found" });
    }
    if (job.payment_status === "paid") {
      return res
        .status(409)
        .json({ ok: false, error: "already_paid" });
    }

    const stripe = new Stripe(stripeSecret);
    const origin =
      (req.headers.origin as string | undefined) ||
      (req.headers.host ? `https://${req.headers.host}` : "");

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email:
        typeof job.contact_email === "string" && job.contact_email
          ? job.contact_email
          : undefined,
      client_reference_id: jobId,
      success_url: `${origin}/careers/post-a-job/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/careers/post-a-job/cancel?job_id=${encodeURIComponent(jobId)}`,
      metadata: {
        product: "medicaidready_careers_job_post",
        job_id: jobId,
        tier: tierRaw,
        job_title: String(job.title ?? "").slice(0, 200),
        company: String(job.company ?? "").slice(0, 200),
      },
    });

    if (session.id) {
      await sb
        .from("careers_jobs")
        .update({ stripe_session_id: session.id, payment_tier: tierRaw })
        .eq("id", jobId);
    }

    return res.status(200).json({ ok: true, url: session.url });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return res
      .status(500)
      .json({ ok: false, error: "checkout_failed", message: msg });
  }
}
