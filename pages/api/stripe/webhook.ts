// pages/api/stripe/webhook.ts
import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";

export const config = {
  api: { bodyParser: false },
};

const OWNER_EMAIL = "medicaidready@hotmail.com";

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
  return status === "active" || status === "trialing";
}

function safeText(v: unknown): string {
  if (v === null || v === undefined) return "";
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  try {
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
}

function fmtMoney(amount?: number | null, currency?: string | null) {
  if (typeof amount !== "number" || !Number.isFinite(amount)) return "—";
  const cur = (currency || "usd").toUpperCase();
  return `${(amount / 100).toFixed(2)} ${cur}`;
}

/**
 * Owner email notifications (Resend REST).
 * Requires:
 * - RESEND_API_KEY
 * - RESEND_FROM_EMAIL (verified sender)
 */
async function notifyOwner(args: {
  subject: string;
  heading: string;
  lines: Array<string>;
  meta?: Record<string, unknown>;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  // Don't break the webhook if email isn't configured.
  if (!apiKey || !from) {
    // eslint-disable-next-line no-console
    console.warn("Owner email notification skipped (missing RESEND_API_KEY or RESEND_FROM_EMAIL).", {
      hasApiKey: !!apiKey,
      hasFrom: !!from,
      subject: args.subject,
    });
    return;
  }

  const metaBlock =
    args.meta && Object.keys(args.meta).length > 0
      ? `<pre style="margin:12px 0 0;padding:12px;border:1px solid rgba(15,23,42,0.12);border-radius:12px;background:#f8fafc;white-space:pre-wrap;word-break:break-word;font-size:12px;line-height:1.4;">${escapeHtml(
          JSON.stringify(args.meta, null, 2)
        )}</pre>`
      : "";

  const html = `
  <div style="font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial; color:#0f172a;">
    <div style="max-width:680px;margin:0 auto;padding:18px;">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;">
        <div style="width:40px;height:40px;border-radius:14px;background:#0f172a;color:#fff;display:grid;place-items:center;font-weight:800;">MR</div>
        <div>
          <div style="font-weight:800;line-height:1.1;">MedicaidReady</div>
          <div style="color:#64748b;font-size:12px;margin-top:2px;">Owner notification</div>
        </div>
      </div>

      <h2 style="margin:0 0 10px;font-size:18px;">${escapeHtml(args.heading)}</h2>

      <div style="border:1px solid rgba(15,23,42,0.12);border-radius:16px;padding:14px;background:#fff;">
        ${args.lines
          .map(
            (l) =>
              `<div style="margin:6px 0;font-size:13px;line-height:1.5;color:#0f172a;">${escapeHtml(
                l
              )}</div>`
          )
          .join("")}
        ${metaBlock}
      </div>

      <div style="margin-top:12px;color:#64748b;font-size:12px;">
        Timestamp: <strong style="color:#0f172a;">${new Date().toLocaleString()}</strong>
      </div>
    </div>
  </div>
  `.trim();

  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [OWNER_EMAIL],
        subject: args.subject,
        html,
      }),
    });

    if (!r.ok) {
      const txt = await r.text().catch(() => "");
      // eslint-disable-next-line no-console
      console.error("Resend email failed:", r.status, txt);
    }
  } catch (e: any) {
    // eslint-disable-next-line no-console
    console.error("Resend email crashed:", e?.message ?? String(e));
  }
}

function escapeHtml(input: string) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
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

// NOTE: Do NOT hardcode apiVersion here.
// Stripe SDK types pin allowed apiVersion; overriding can break builds.
const stripe = new Stripe(mustGet("STRIPE_SECRET_KEY"));

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

      const paymentStatus = session.payment_status;
      const isPaid = paymentStatus === "paid" || paymentStatus === "no_payment_required";
      if (!isPaid) {
        // eslint-disable-next-line no-console
        console.warn("checkout.session.completed but not paid:", {
          id: session.id,
          payment_status: paymentStatus,
        });

        await notifyOwner({
          subject: "MedicaidReady — Checkout completed (NOT paid)",
          heading: "Checkout completed, but payment not confirmed",
          lines: [
            `Stripe session: ${session.id}`,
            `Payment status: ${paymentStatus}`,
            `Customer email: ${normalizeEmail(
              session.customer_details?.email || session.customer_email || session.metadata?.email || ""
            ) || "—"}`,
          ],
          meta: {
            eventType: event.type,
            sessionId: session.id,
            payment_status: paymentStatus,
          },
        });

        return res.status(200).json({ received: true });
      }

      const submissionId = (session.metadata?.submission_id ?? "").toString().trim();
      const email = normalizeEmail(
        session.customer_details?.email || session.customer_email || session.metadata?.email || ""
      );

      const stripeSubscriptionId = (typeof session.subscription === "string" ? session.subscription : "") || "";
      const stripeCustomerId = (typeof session.customer === "string" ? session.customer : "") || "";

      let subStatus: string | null = null;
      let periodEndIso: string | null = null;

      if (stripeSubscriptionId) {
        try {
          const subResp = await stripe.subscriptions.retrieve(stripeSubscriptionId);
          const subAny = (subResp as any)?.data ?? subResp;

          subStatus = (subAny?.status ?? null) as string | null;
          periodEndIso = toIsoOrNull((subAny?.current_period_end ?? null) as any);
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
      } else if (email) {
        const sb = supabaseAdmin();
        const { data: rows, error: selectErr } = await sb
          .from("request_access_submissions")
          .select("id, created_at")
          .eq("email", email)
          .order("created_at", { ascending: false })
          .limit(1);

        if (!selectErr && rows?.[0]?.id) {
          await approveById(rows[0].id, patch);
        } else if (selectErr) {
          // eslint-disable-next-line no-console
          console.error("Supabase select failed:", selectErr.message, { email });
        } else {
          // eslint-disable-next-line no-console
          console.warn("No request_access_submissions row found for email:", email);
        }
      } else {
        // eslint-disable-next-line no-console
        console.warn("checkout.session.completed missing submission_id and email", {
          stripeSessionId: session.id,
        });
      }

      await notifyOwner({
        subject: "MedicaidReady — New subscription payment succeeded",
        heading: "New subscription created (payment succeeded)",
        lines: [
          `Customer email: ${email || "—"}`,
          `Submission ID: ${submissionId || "—"}`,
          `Stripe customer: ${stripeCustomerId || "—"}`,
          `Stripe subscription: ${stripeSubscriptionId || "—"}`,
          `Subscription status: ${subStatus || "—"}`,
          `Current period end: ${periodEndIso || "—"}`,
          `Stripe session: ${session.id}`,
        ],
        meta: {
          eventType: event.type,
          sessionId: session.id,
          submission_id: submissionId || null,
          email: email || null,
          stripe_customer_id: stripeCustomerId || null,
          stripe_subscription_id: stripeSubscriptionId || null,
          stripe_subscription_status: subStatus || null,
          stripe_current_period_end: periodEndIso,
        },
      });

      return res.status(200).json({ received: true });
    }

    // B) customer.subscription.updated -> sync status/period_end, revoke if not good
    if (event.type === "customer.subscription.updated") {
      const sub = event.data.object as Stripe.Subscription;

      const stripeSubscriptionId = (sub.id ?? "").toString();
      const status = (sub.status ?? "").toString();
      const periodEndIso = toIsoOrNull((sub as any).current_period_end ?? null);

      const patch = {
        stripe_subscription_status: status,
        stripe_current_period_end: periodEndIso,
      };

      if (!stripeSubscriptionId) return res.status(200).json({ received: true });

      if (isGoodSubStatus(status)) {
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
      } else {
        await revokeByStripeSubscriptionId(stripeSubscriptionId, `subscription_${status || "not_active"}`, patch);
      }

      await notifyOwner({
        subject: `MedicaidReady — Subscription updated (${status || "unknown"})`,
        heading: "Subscription status updated",
        lines: [
          `Stripe subscription: ${stripeSubscriptionId}`,
          `Status: ${status || "—"}`,
          `Current period end: ${periodEndIso || "—"}`,
        ],
        meta: {
          eventType: event.type,
          stripe_subscription_id: stripeSubscriptionId,
          status,
          current_period_end: periodEndIso,
          cancel_at_period_end: (sub as any)?.cancel_at_period_end ?? null,
          canceled_at: toIsoOrNull((sub as any)?.canceled_at ?? null),
        },
      });

      return res.status(200).json({ received: true });
    }

    // C) customer.subscription.deleted -> revoke
    if (event.type === "customer.subscription.deleted") {
      const sub = event.data.object as Stripe.Subscription;

      const stripeSubscriptionId = (sub.id ?? "").toString();
      if (!stripeSubscriptionId) return res.status(200).json({ received: true });

      const periodEndIso = toIsoOrNull((sub as any).current_period_end ?? null);

      await revokeByStripeSubscriptionId(stripeSubscriptionId, "subscription_deleted", {
        stripe_subscription_status: "canceled",
        stripe_current_period_end: periodEndIso,
      });

      await notifyOwner({
        subject: "MedicaidReady — Subscription canceled",
        heading: "Subscription canceled / deleted",
        lines: [`Stripe subscription: ${stripeSubscriptionId}`, `Current period end: ${periodEndIso || "—"}`],
        meta: {
          eventType: event.type,
          stripe_subscription_id: stripeSubscriptionId,
          status: safeText((sub as any)?.status),
          canceled_at: toIsoOrNull((sub as any)?.canceled_at ?? null),
          ended_at: toIsoOrNull((sub as any)?.ended_at ?? null),
          current_period_end: periodEndIso,
        },
      });

      return res.status(200).json({ received: true });
    }

    // D) invoice.payment_failed -> revoke
    if (event.type === "invoice.payment_failed") {
      const invoice = event.data.object as Stripe.Invoice;

      const subField = (invoice as any)?.subscription;
      const stripeSubscriptionId = (typeof subField === "string" ? subField : "") || "";

      const email = normalizeEmail((invoice as any)?.customer_email || "");
      const amountDue = (invoice as any)?.amount_due ?? null;
      const currency = (invoice as any)?.currency ?? null;

      if (stripeSubscriptionId) {
        await revokeByStripeSubscriptionId(stripeSubscriptionId, "invoice_payment_failed", {
          stripe_subscription_status: "past_due",
        });
      } else if (email) {
        await revokeByEmailLatest(email, "invoice_payment_failed_no_subscription_id", {
          stripe_subscription_status: "past_due",
        });
      }

      await notifyOwner({
        subject: "MedicaidReady — Payment failed (subscription at risk)",
        heading: "Invoice payment failed",
        lines: [
          `Customer email: ${email || "—"}`,
          `Stripe subscription: ${stripeSubscriptionId || "—"}`,
          `Amount due: ${fmtMoney(amountDue, currency)}`,
          `Invoice: ${invoice.id}`,
        ],
        meta: {
          eventType: event.type,
          invoiceId: invoice.id,
          subscription: stripeSubscriptionId || null,
          customer_email: email || null,
          amount_due: amountDue,
          currency,
          hosted_invoice_url: (invoice as any)?.hosted_invoice_url ?? null,
          attempt_count: (invoice as any)?.attempt_count ?? null,
        },
      });

      return res.status(200).json({ received: true });
    }

    // E) invoice.paid -> re-approve (includes renewals)
    if (event.type === "invoice.paid") {
      const invoice = event.data.object as Stripe.Invoice;

      const subField = (invoice as any)?.subscription;
      const stripeSubscriptionId = (typeof subField === "string" ? subField : "") || "";

      const email = normalizeEmail((invoice as any)?.customer_email || "");
      const amountPaid = (invoice as any)?.amount_paid ?? null;
      const currency = (invoice as any)?.currency ?? null;
      const billingReason = safeText((invoice as any)?.billing_reason);

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
      } else if (email) {
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

      await notifyOwner({
        subject: "MedicaidReady — Payment received (invoice paid)",
        heading: "Invoice paid (includes monthly renewals)",
        lines: [
          `Customer email: ${email || "—"}`,
          `Stripe subscription: ${stripeSubscriptionId || "—"}`,
          `Amount paid: ${fmtMoney(amountPaid, currency)}`,
          `Billing reason: ${billingReason || "—"}`,
          `Invoice: ${invoice.id}`,
        ],
        meta: {
          eventType: event.type,
          invoiceId: invoice.id,
          subscription: stripeSubscriptionId || null,
          customer_email: email || null,
          amount_paid: amountPaid,
          currency,
          billing_reason: billingReason || null,
          hosted_invoice_url: (invoice as any)?.hosted_invoice_url ?? null,
        },
      });

      return res.status(200).json({ received: true });
    }

    // default
    return res.status(200).json({ received: true });
  } catch (e: any) {
    // eslint-disable-next-line no-console
    console.error("Webhook handler error:", e?.message ?? String(e));

    // Best-effort owner email (do not block Stripe ACK)
    await notifyOwner({
      subject: "MedicaidReady — Webhook handler error",
      heading: "Webhook handler crashed",
      lines: [`Event type: ${event?.type || "—"}`, `Error: ${e?.message ?? String(e)}`],
      meta: {
        eventType: event?.type || null,
        eventId: (event as any)?.id || null,
      },
    });

    return res.status(500).send("Webhook handler failed");
  }
}
