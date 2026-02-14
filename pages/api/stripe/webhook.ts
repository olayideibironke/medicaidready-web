import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";

export const config = {
  api: { bodyParser: false },
};

function mustGet(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

async function readRawBody(req: NextApiRequest): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

function normalizeEmail(v: unknown): string {
  return (v ?? "").toString().trim().toLowerCase();
}

const stripe = new Stripe(mustGet("STRIPE_SECRET_KEY"), {
  apiVersion: "2023-10-16",
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).send("Method Not Allowed");
  }

  // 1) Verify Stripe signature (CRITICAL)
  let event: Stripe.Event;
  try {
    const sig = req.headers["stripe-signature"];
    if (!sig || typeof sig !== "string") {
      return res.status(400).send("Missing stripe-signature");
    }

    const rawBody = await readRawBody(req);
    event = stripe.webhooks.constructEvent(rawBody, sig, mustGet("STRIPE_WEBHOOK_SECRET"));
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err?.message ?? String(err)}`);
  }

  // 2) Handle events (ACK Stripe even if our DB update fails, to avoid endless retries)
  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      // Safety: only approve if Stripe says the session is actually paid (or no payment required)
      const paymentStatus = session.payment_status; // "paid" | "unpaid" | "no_payment_required" | etc.
      const isPaid = paymentStatus === "paid" || paymentStatus === "no_payment_required";
      if (!isPaid) {
        // eslint-disable-next-line no-console
        console.warn("checkout.session.completed but not paid yet:", {
          id: session.id,
          payment_status: paymentStatus,
        });
        return res.status(200).json({ received: true });
      }

      // Prefer submission_id from metadata when available (cleanest, avoids email ambiguity)
      const submissionId = (session.metadata?.submission_id ?? "").toString().trim();

      // Email fallback (still supported)
      const email = normalizeEmail(
        session.customer_details?.email ||
          session.customer_email ||
          session.metadata?.email ||
          ""
      );

      const sb = supabaseAdmin();

      // If we have submissionId, update that exact row.
      if (submissionId) {
        const { error } = await sb
          .from("request_access_submissions")
          .update({
            status: "approved",
          })
          .eq("id", submissionId);

        if (error) {
          // eslint-disable-next-line no-console
          console.error("Supabase update failed (by submission_id):", error.message, {
            submissionId,
            stripeSessionId: session.id,
          });
        }

        return res.status(200).json({ received: true });
      }

      // Otherwise update the most recent submission for this email.
      if (email) {
        // 1) Find most recent submission for email
        const { data: rows, error: selectErr } = await sb
          .from("request_access_submissions")
          .select("id, created_at, status")
          .eq("email", email)
          .order("created_at", { ascending: false })
          .limit(1);

        if (selectErr) {
          // eslint-disable-next-line no-console
          console.error("Supabase select failed:", selectErr.message, { email });
          return res.status(200).json({ received: true });
        }

        const row = rows?.[0];
        if (!row?.id) {
          // eslint-disable-next-line no-console
          console.warn("No request_access_submissions row found for email:", email);
          return res.status(200).json({ received: true });
        }

        // 2) Approve that specific row (do not mass-update all rows for that email)
        const { error: updateErr } = await sb
          .from("request_access_submissions")
          .update({
            status: "approved",
          })
          .eq("id", row.id);

        if (updateErr) {
          // eslint-disable-next-line no-console
          console.error("Supabase update failed (by latest id):", updateErr.message, {
            email,
            rowId: row.id,
            stripeSessionId: session.id,
          });
        }
      } else {
        // eslint-disable-next-line no-console
        console.warn("checkout.session.completed but no email or submission_id present:", {
          stripeSessionId: session.id,
        });
      }
    }

    return res.status(200).json({ received: true });
  } catch (e: any) {
    // eslint-disable-next-line no-console
    console.error("Webhook handler error:", e?.message ?? String(e));
    // Return 500 only for truly unexpected handler crashes
    return res.status(500).send("Webhook handler failed");
  }
}
