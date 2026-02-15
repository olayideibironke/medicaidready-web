import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";

function mustGet(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

function normalizeEmail(v: unknown): string {
  return (v ?? "").toString().trim().toLowerCase();
}

function pickString(v: unknown): string {
  return (v ?? "").toString().trim();
}

function safeFromEmail(email: string) {
  const local = (email.split("@")[0] ?? "").trim() || "subscriber";
  return {
    name: local,
    organization: `${local} org`,
  };
}

// Defaults aligned with current app behavior
const DEFAULTS = {
  state: "MD",
  provider_type: "home_health",
};

// NOTE: Do NOT hardcode apiVersion here.
// The installed Stripe SDK pins the allowed apiVersion type, and overriding it can break builds.
// Let the Stripe library default/pinned version apply.
const stripe = new Stripe(mustGet("STRIPE_SECRET_KEY"));

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "method_not_allowed" });
  }

  try {
    const priceId = mustGet("STRIPE_PRICE_ID");

    const body = (req.body ?? {}) as any;
    const email = normalizeEmail(body.email);

    if (!email || !email.includes("@")) {
      return res.status(400).json({ ok: false, error: "invalid_email" });
    }

    const fallback = safeFromEmail(email);

    // Accept real values if provided, otherwise safe defaults
    const name = pickString(body.name) || fallback.name;
    const organization = pickString(body.organization) || fallback.organization;
    const state = pickString(body.state) || DEFAULTS.state;
    const provider_type = pickString(body.provider_type) || DEFAULTS.provider_type;

    const origin =
      (req.headers.origin as string | undefined) || `http://${req.headers.host}`;

    const sb = supabaseAdmin();

    // 1) Create deterministic submission row FIRST
    const { data: inserted, error: insertErr } = await sb
      .from("request_access_submissions")
      .insert({
        name,
        organization,
        email,
        state,
        provider_type,
        status: "pending",
      })
      .select("id")
      .single();

    if (insertErr || !inserted?.id) {
      return res.status(500).json({
        ok: false,
        error: "request_access_insert_failed",
        message:
          insertErr?.message ??
          "Failed to create request_access_submissions row",
      });
    }

    const submissionId = inserted.id as string;

    // 2) Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: email,
      client_reference_id: submissionId,

      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel`,

      metadata: {
        email,
        submission_id: submissionId,
        product: "medicaidready_dmv_plan",
      },

      // Attach metadata to the Subscription object itself
      subscription_data: {
        metadata: {
          email,
          submission_id: submissionId,
          product: "medicaidready_dmv_plan",
        },
      },
    });

    return res.status(200).json({
      ok: true,
      url: session.url,
      submissionId,
    });
  } catch (e: any) {
    return res.status(500).json({
      ok: false,
      error: "checkout_session_create_failed",
      message: e?.message ?? String(e),
    });
  }
}
