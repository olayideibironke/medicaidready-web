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

function toIsoOrNull(unixSeconds?: number | null): string | null {
  if (!unixSeconds || typeof unixSeconds !== "number") return null;
  const ms = unixSeconds * 1000;
  const d = new Date(ms);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

function isGoodSubStatus(status?: string | null): boolean {
  // allow access when subscription is in a "good" state
  return status === "active" || status === "trialing";
}

async function approveById(submissionId: string, patch: Record<string, any>) {
  const sb = supabaseAdmin();
  const { error } = await sb
    .from("request_access_submissions")
    .update({
      status: "approved",
      access_revoked_at: null,
      access_revoked_reason: null,
      ...patch,
    })
    .eq("id", submissionId);

  if (error) {
    // eslint-disable-next-line no-console
    console.error("Supabase approveById failed:", error.message, { submissionId });
  }
}

async function revokeByStripeSubscriptionId(
  stripeSubscriptionId: string,
  reason: string,
  patch: Record<string, any> = {}
) {
  const sb = supabaseAdmin();

  // Revoke ONLY currently approved rows for this subscription id
  const { error } = await sb
    .from("request_access_submissions")
    .update({
      status: "revoked",
      access_revoked_at: new Date().toISOString(),
      access_revoked_reason: reason,
      ...patch,
    })
    .eq("stripe_subscription_id", stripeSubscriptionId);

  if (error) {
    // eslint-disable-next-line no-console
    console.error("Supabase revokeByStripeSubscriptionId failed:", error.message, {
      stripeSubscriptionId,
      reason,
    });
  }
}

async function revokeByEmailLatest(email: string, reason: string, patch: Record<string, any> = {}) {
  const sb = supabaseAdmin();

  const { data: rows, error: selectErr } = await sb
    .from("request_access_submissions")
    .select("id, created_at")
    .eq("email", email)
    .order("created_at", { ascending: false })
    .limit(1);

  if (selectErr) {
    // eslint-disable-next-line no-console
    console.error("Supabase revokeByEmailLatest select failed:", selectErr.message, { email });
    return;
  }

  const row = rows?.[0];
  if (!row?.id) {
    // eslint-disable-next-line no-console
    console.warn("revokeByEmailLatest: no row found for email", { email, reason });
    return;
  }

  const { error: updateErr } = await sb
    .from("request_access_submissions")
    .update({
      status: "revoked",
      access_revoked_at: new Date().toISOString(),
      access_revoked_reason: reason,
      ...patch,
    })
    .eq("id", row.id);

  if (updateErr) {
    // eslint-disable-next-line no-console
    console.error("Supabase revokeByEmailLatest update failed:", updateErr.message, {
      email,
      rowId: row.id,
      reason,
    });
  }
}

const stripe = new Stripe(mustGet("STRIPE_SECRET_KEY"), {
  apiVersion: "2023-10-16",
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).send("Method Not Allowed");
  }

  // 1) Verify Stripe signature
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

  // 2) Handle events (ACK Stripe even if our DB update fails)
  try {
    // A) checkout.session.completed -> approve + store subscription identifiers
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      // Only approve if paid (or no payment required)
      const paymentStatus = session.payment_status;
      const isPaid = paymentStatus === "paid" || paymentStatus === "no_payment_required";
      if (!isPaid) {
        // eslint-disable-next-line no-console
        console.warn("checkout.session.completed but not paid:", {
          id: session.id,
          payment_status: paymentStatus,
        });
        return res.status(200).json({ received: true });
      }

      const submissionId = (session.metadata?.submission_id ?? "").toString().trim();
      const email = normalizeEmail(
        session.customer_details?.email || session.customer_email || session.metadata?.email || ""
      );

      // In subscription mode, session.subscription should exist
      const stripeSubscriptionId =
        (typeof session.subscription === "string" ? session.subscription : "") || "";
      const stripeCustomerId =
        (typeof session.customer === "string" ? session.customer : "") || "";

      // Pull subscription status + period_end from Stripe if we have an id
      let subStatus: string | null = null;
      let periodEndIso: string | null = null;

      if (stripeSubscriptionId) {
        try {
          const sub = await stripe.subscriptions.retrieve(stripeSubscriptionId);
          subStatus = (sub.status ?? null) as string | null;
          periodEndIso = toIsoOrNull(sub.current_period_end ?? null);
        } catch (e: any) {
          // eslint-disable-next-line no-console
          console.error("Stripe subscription retrieve failed:", e?.message ?? String(e), {
            stripeSubscriptionId,
          });
        }
      }

      const patch = {
        stripe_customer_id: stripeCustomerId || null,
        stripe_subscription_id: stripeSubscriptionId || null,
        stripe_subscription_status: subStatus || (stripeSubscriptionId ? "active" : null),
        stripe_current_period_end: periodEndIso,
      };

      if (submissionId) {
        await approveById(submissionId, patch);
        return res.status(200).json({ received: true });
      }

      // Email fallback ONLY if submission_id missing (older sessions)
      if (email) {
        // best-effort approve latest for email + set stripe ids
        const sb = supabaseAdmin();
        const { data: rows, error: selectErr } = await sb
          .from("request_access_submissions")
          .select("id, created_at")
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

        await approveById(row.id, patch);
      } else {
        // eslint-disable-next-line no-console
        console.warn("checkout.session.completed missing submission_id and email", {
          stripeSessionId: session.id,
        });
      }

      return res.status(200).json({ received: true });
    }

    // B) customer.subscription.updated -> sync status/period_end, revoke if not good
    if (event.type === "customer.subscription.updated") {
      const sub = event.data.object as Stripe.Subscription;

      const stripeSubscriptionId = (sub.id ?? "").toString();
      const status = (sub.status ?? "").toString();
      const periodEndIso = toIsoOrNull(sub.current_period_end ?? null);

      const patch = {
        stripe_subscription_status: status,
        stripe_current_period_end: periodEndIso,
      };

      if (!stripeSubscriptionId) return res.status(200).json({ received: true });

      if (isGoodSubStatus(status)) {
        // Reactivate if recovered
        const sb = supabaseAdmin();
        const { error } = await sb
          .from("request_access_submissions")
          .update({
            status: "approved",
            access_revoked_at: null,
            access_revoked_reason: null,
            ...patch,
          })
          .eq("stripe_subscription_id", stripeSubscriptionId);

        if (error) {
          // eslint-disable-next-line no-console
          console.error("Supabase subscription.updated approve failed:", error.message, {
            stripeSubscriptionId,
            status,
          });
        }

        return res.status(200).json({ received: true });
      }

      await revokeByStripeSubscriptionId(
        stripeSubscriptionId,
        `subscription_${status || "not_active"}`,
        patch
      );

      return res.status(200).json({ received: true });
    }

    // C) customer.subscription.deleted -> revoke
    if (event.type === "customer.subscription.deleted") {
      const sub = event.data.object as Stripe.Subscription;

      const stripeSubscriptionId = (sub.id ?? "").toString();
      if (!stripeSubscriptionId) return res.status(200).json({ received: true });

      await revokeByStripeSubscriptionId(stripeSubscriptionId, "subscription_deleted", {
        stripe_subscription_status: "canceled",
        stripe_current_period_end: toIsoOrNull(sub.current_period_end ?? null),
      });

      return res.status(200).json({ received: true });
    }

    // D) invoice.payment_failed -> revoke (best effort via subscription id)
    if (event.type === "invoice.payment_failed") {
      const invoice = event.data.object as Stripe.Invoice;

      const stripeSubscriptionId =
        (typeof invoice.subscription === "string" ? invoice.subscription : "") || "";

      if (stripeSubscriptionId) {
        await revokeByStripeSubscriptionId(stripeSubscriptionId, "invoice_payment_failed", {
          stripe_subscription_status: "past_due",
        });
        return res.status(200).json({ received: true });
      }

      // fallback if needed
      const email = normalizeEmail((invoice.customer_email as any) || "");
      if (email) {
        await revokeByEmailLatest(email, "invoice_payment_failed_no_subscription_id", {
          stripe_subscription_status: "past_due",
        });
      }

      return res.status(200).json({ received: true });
    }

    // E) invoice.paid -> re-approve (recovered payments)
    if (event.type === "invoice.paid") {
      const invoice = event.data.object as Stripe.Invoice;

      const stripeSubscriptionId =
        (typeof invoice.subscription === "string" ? invoice.subscription : "") || "";

      const patch = {
        stripe_subscription_status: "active",
      };

      if (stripeSubscriptionId) {
        const sb = supabaseAdmin();
        const { error } = await sb
          .from("request_access_submissions")
          .update({
            status: "approved",
            access_revoked_at: null,
            access_revoked_reason: null,
            ...patch,
          })
          .eq("stripe_subscription_id", stripeSubscriptionId);

        if (error) {
          // eslint-disable-next-line no-console
          console.error("Supabase invoice.paid approve failed:", error.message, {
            stripeSubscriptionId,
          });
        }

        return res.status(200).json({ received: true });
      }

      // fallback if needed
      const email = normalizeEmail((invoice.customer_email as any) || "");
      if (email) {
        const sb = supabaseAdmin();
        const { data: rows, error: selectErr } = await sb
          .from("request_access_submissions")
          .select("id, created_at")
          .eq("email", email)
          .order("created_at", { ascending: false })
          .limit(1);

        if (!selectErr && rows?.[0]?.id) {
          await approveById(rows[0].id, patch);
        }
      }

      return res.status(200).json({ received: true });
    }

    return res.status(200).json({ received: true });
  } catch (e: any) {
    // eslint-disable-next-line no-console
    console.error("Webhook handler error:", e?.message ?? String(e));
    return res.status(500).send("Webhook handler failed");
  }
}
