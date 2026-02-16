import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { Resend } from "resend";
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
  return status === "active" || status === "trialing";
}

function safeString(v: unknown): string {
  if (v == null) return "";
  return String(v);
}

/**
 * Owner email notifications
 * - Always emails the owner (medicaidready@hotmail.com) for key subscription lifecycle events.
 * - Uses RESEND_FROM_EMAIL if available; falls back to onboarding@resend.dev (works without domain verification).
 */
async function notifyOwner(args: {
  subject: string;
  title: string;
  lines: string[];
  meta?: Record<string, any>;
}) {
  const ownerTo = "medicaidready@hotmail.com";

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("notifyOwner: missing RESEND_API_KEY");
    return;
  }

  const from =
    process.env.RESEND_FROM_EMAIL?.trim() ||
    "MedicaidReady <onboarding@resend.dev>"; // safe fallback for testing

  const resend = new Resend(apiKey);

  const html = `
    <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; color:#0f172a;">
      <h2 style="margin:0 0 10px 0;">${args.title}</h2>
      <div style="margin:0 0 14px 0; color:#475569;">${args.subject}</div>
      <ul style="margin:0; padding-left:18px;">
        ${args.lines.map((l) => `<li style="margin:6px 0;">${l}</li>`).join("")}
      </ul>
      ${
        args.meta
          ? `<pre style="margin-top:14px; background:#f8fafc; border:1px solid #e2e8f0; padding:12px; border-radius:12px; overflow:auto;">${escapeHtml(
              JSON.stringify(args.meta, null, 2)
            )}</pre>`
          : ""
      }
      <div style="margin-top:16px; font-size:12px; color:#64748b;">
        MedicaidReady • automated notification
      </div>
    </div>
  `.trim();

  try {
    const resp = await resend.emails.send({
      from,
      to: ownerTo,
      subject: args.subject,
      html,
    });

    if ((resp as any)?.error) {
      console.error("Resend send error:", (resp as any).error);
    } else {
      console.log("Resend email sent:", resp);
    }
  } catch (e: any) {
    console.error("Resend crashed:", e?.message ?? String(e));
  }
}

function escapeHtml(s: string) {
  return s
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
    console.error("Supabase revokeByEmailLatest select failed:", selectErr.message, { email });
    return;
  }

  const row = rows?.[0];
  if (!row?.id) {
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
    console.error("Supabase revokeByEmailLatest update failed:", updateErr.message, {
      email,
      rowId: row.id,
      reason,
    });
  }
}

// NOTE: Do NOT hardcode apiVersion here.
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

      // DB approve
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
        } else {
          console.warn("No request_access_submissions row found for email:", email);
        }
      } else {
        console.warn("checkout.session.completed missing submission_id and email", {
          stripeSessionId: session.id,
        });
      }

      // OWNER EMAIL
      await notifyOwner({
        subject: "MedicaidReady • New subscription (checkout completed)",
        title: "New subscription / checkout completed",
        lines: [
          `Customer email: <strong>${escapeHtml(email || "—")}</strong>`,
          `Submission ID: <strong>${escapeHtml(submissionId || "—")}</strong>`,
          `Stripe customer: <strong>${escapeHtml(stripeCustomerId || "—")}</strong>`,
          `Stripe subscription: <strong>${escapeHtml(stripeSubscriptionId || "—")}</strong>`,
          `Subscription status: <strong>${escapeHtml(subStatus || "—")}</strong>`,
          `Period end: <strong>${escapeHtml(periodEndIso || "—")}</strong>`,
          `Stripe session: <strong>${escapeHtml(session.id)}</strong>`,
        ],
        meta: {
          eventType: event.type,
          sessionId: session.id,
          paymentStatus,
        },
      });

      return res.status(200).json({ received: true });
    }

    // B) customer.subscription.updated -> sync status/period_end, revoke if not good
    if (event.type === "customer.subscription.updated") {
      const sub = event.data.object as Stripe.Subscription;

      const stripeSubscriptionId = safeString(sub.id);
      const status = safeString(sub.status);
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
          console.error("Supabase subscription.updated approve failed:", error.message, {
            stripeSubscriptionId,
            status,
          });
        }
      } else {
        await revokeByStripeSubscriptionId(stripeSubscriptionId, `subscription_${status || "not_active"}`, patch);
      }

      await notifyOwner({
        subject: "MedicaidReady • Subscription updated",
        title: "Subscription updated",
        lines: [
          `Stripe subscription: <strong>${escapeHtml(stripeSubscriptionId)}</strong>`,
          `Status: <strong>${escapeHtml(status || "—")}</strong>`,
          `Period end: <strong>${escapeHtml(periodEndIso || "—")}</strong>`,
          `Action: <strong>${escapeHtml(isGoodSubStatus(status) ? "approved" : "revoked")}</strong>`,
        ],
        meta: { eventType: event.type },
      });

      return res.status(200).json({ received: true });
    }

    // C) customer.subscription.deleted -> revoke
    if (event.type === "customer.subscription.deleted") {
      const sub = event.data.object as Stripe.Subscription;

      const stripeSubscriptionId = safeString(sub.id);
      if (!stripeSubscriptionId) return res.status(200).json({ received: true });

      const periodEndIso = toIsoOrNull((sub as any).current_period_end ?? null);

      await revokeByStripeSubscriptionId(stripeSubscriptionId, "subscription_deleted", {
        stripe_subscription_status: "canceled",
        stripe_current_period_end: periodEndIso,
      });

      await notifyOwner({
        subject: "MedicaidReady • Subscription canceled",
        title: "Subscription canceled",
        lines: [
          `Stripe subscription: <strong>${escapeHtml(stripeSubscriptionId)}</strong>`,
          `Period end: <strong>${escapeHtml(periodEndIso || "—")}</strong>`,
          `Action: <strong>revoked</strong>`,
        ],
        meta: { eventType: event.type },
      });

      return res.status(200).json({ received: true });
    }

    // D) invoice.payment_failed -> revoke
    if (event.type === "invoice.payment_failed") {
      const invoice = event.data.object as Stripe.Invoice;

      const subField = (invoice as any)?.subscription;
      const stripeSubscriptionId = (typeof subField === "string" ? subField : "") || "";

      if (stripeSubscriptionId) {
        await revokeByStripeSubscriptionId(stripeSubscriptionId, "invoice_payment_failed", {
          stripe_subscription_status: "past_due",
        });
      } else {
        const email = normalizeEmail((invoice as any)?.customer_email || "");
        if (email) {
          await revokeByEmailLatest(email, "invoice_payment_failed_no_subscription_id", {
            stripe_subscription_status: "past_due",
          });
        }
      }

      await notifyOwner({
        subject: "MedicaidReady • Payment failed",
        title: "Invoice payment failed",
        lines: [
          `Invoice: <strong>${escapeHtml(safeString((invoice as any)?.id || "—"))}</strong>`,
          `Stripe subscription: <strong>${escapeHtml(stripeSubscriptionId || "—")}</strong>`,
          `Customer email: <strong>${escapeHtml(normalizeEmail((invoice as any)?.customer_email || "") || "—")}</strong>`,
          `Action: <strong>revoked / past_due</strong>`,
        ],
        meta: { eventType: event.type },
      });

      return res.status(200).json({ received: true });
    }

    // E) invoice.paid -> re-approve
    if (event.type === "invoice.paid") {
      const invoice = event.data.object as Stripe.Invoice;

      const subField = (invoice as any)?.subscription;
      const stripeSubscriptionId = (typeof subField === "string" ? subField : "") || "";

      const patch = { stripe_subscription_status: "active" };

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
          console.error("Supabase invoice.paid approve failed:", error.message, {
            stripeSubscriptionId,
          });
        }
      } else {
        const email = normalizeEmail((invoice as any)?.customer_email || "");
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
      }

      await notifyOwner({
        subject: "MedicaidReady • Payment received",
        title: "Invoice paid",
        lines: [
          `Invoice: <strong>${escapeHtml(safeString((invoice as any)?.id || "—"))}</strong>`,
          `Stripe subscription: <strong>${escapeHtml(stripeSubscriptionId || "—")}</strong>`,
          `Customer email: <strong>${escapeHtml(normalizeEmail((invoice as any)?.customer_email || "") || "—")}</strong>`,
          `Action: <strong>approved</strong>`,
        ],
        meta: { eventType: event.type },
      });

      return res.status(200).json({ received: true });
    }

    return res.status(200).json({ received: true });
  } catch (e: any) {
    console.error("Webhook handler error:", e?.message ?? String(e));
    return res.status(500).send("Webhook handler failed");
  }
}
