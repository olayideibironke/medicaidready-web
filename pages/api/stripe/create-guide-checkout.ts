import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

function mustGet(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

function normalizeEmail(v: unknown): string {
  return (v ?? "").toString().trim().toLowerCase();
}

const stripe = new Stripe(mustGet("STRIPE_SECRET_KEY"));

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "method_not_allowed" });
  }

  try {
    const priceId = mustGet("STRIPE_GUIDE_PRICE_ID");
    const body = (req.body ?? {}) as Record<string, unknown>;

    const email = normalizeEmail(body.email);
    if (!email || !email.includes("@")) {
      return res.status(400).json({ ok: false, error: "invalid_email" });
    }

    const submissionId = (body.submissionId ?? "").toString().trim();

    const origin =
      (req.headers.origin as string | undefined) || `http://${req.headers.host}`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: email,
      client_reference_id: submissionId || undefined,
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}&product=guide`,
      cancel_url: `${origin}/quiz`,
      metadata: {
        email,
        submission_id: submissionId,
        product: "medicaidready_application_guide",
      },
    });

    return res.status(200).json({ ok: true, url: session.url });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("create-guide-checkout error:", msg);
    return res.status(500).json({ ok: false, error: "checkout_failed", message: msg });
  }
}
