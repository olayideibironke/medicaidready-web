import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { Resend } from "resend";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";

export const config = {
  api: { bodyParser: false },
};

const GUIDE_DOWNLOAD_URL =
  "https://www.medicaidready.org/guides/complete-medicaid-application-guide-v2.pdf";

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

function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function notifyOwner(args: {
  subject: string;
  title: string;
  lines: string[];
  meta?: Record<string, unknown>;
}) {
  const ownerTo = "medicaidready@hotmail.com";
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("notifyOwner: missing RESEND_API_KEY");
    return;
  }

  const from =
    process.env.RESEND_FROM_EMAIL?.trim() ||
    "MedicaidReady <no-reply@medicaidready.org>";
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
      <div style="margin-top:16px; font-size:12px; color:#64748b;">MedicaidReady • automated notification</div>
    </div>
  `.trim();

  try {
    const resp = await resend.emails.send({
      from,
      to: ownerTo,
      subject: args.subject,
      html,
    });

    if ((resp as { error?: unknown })?.error) {
      console.error("Resend send error:", (resp as { error?: unknown }).error);
    } else {
      console.log("Resend owner email sent:", resp);
    }
  } catch (e: unknown) {
    console.error("Resend crashed:", e instanceof Error ? e.message : String(e));
  }
}

async function sendGuideEmail(customerEmail: string, submissionId: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("sendGuideEmail: missing RESEND_API_KEY");
    return;
  }

  const from =
    process.env.RESEND_FROM_EMAIL?.trim() ||
    "MedicaidReady <no-reply@medicaidready.org>";
  const resend = new Resend(apiKey);

  const html = `
    <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; color:#0f172a; max-width:600px; margin:0 auto;">

      <div style="background:#0a3d6b; padding:32px 40px; border-radius:16px 16px 0 0; text-align:center;">
        <div style="display:inline-flex; align-items:center; gap:10px; margin-bottom:8px;">
          <div style="width:36px; height:36px; background:rgba(255,255,255,0.15); border-radius:10px; display:inline-flex; align-items:center; justify-content:center;">
            <span style="color:white; font-size:18px;">+</span>
          </div>
          <span style="color:white; font-size:20px; font-weight:700;">MedicaidReady</span>
        </div>
        <h1 style="margin:16px 0 0; color:white; font-size:26px; font-weight:700; letter-spacing:-0.03em;">
          Your Application Guide is Ready
        </h1>
      </div>

      <div style="background:#ffffff; padding:40px; border:1px solid #e2e8f0; border-top:none; border-radius:0 0 16px 16px;">

        <p style="margin:0 0 20px; font-size:16px; line-height:1.7; color:#334155;">
          Thank you for purchasing the <strong>Complete Medicaid Application Guide</strong>. You now have everything you need to prepare for your Medicaid application.
        </p>

        <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:12px; padding:20px 24px; margin:0 0 28px;">
          <div style="font-size:14px; font-weight:700; color:#15803d; margin-bottom:12px; text-transform:uppercase; letter-spacing:0.06em;">What's included</div>
          <ul style="margin:0; padding-left:20px; color:#334155; font-size:15px; line-height:1.8;">
            <li>Step-by-step Medicaid application preparation walkthrough</li>
            <li>Documents you may need to collect before applying</li>
            <li>Income and household calculation worksheet</li>
            <li>What to do if your application is denied</li>
            <li>Timeline of what to expect after you apply</li>
            <li>Common mistakes that delay or derail applications</li>
          </ul>
        </div>

        <div style="text-align:center; margin:0 0 28px;">
          <a href="${GUIDE_DOWNLOAD_URL}"
             style="display:inline-block; padding:14px 32px; background:#0a3d6b; color:#ffffff; font-size:15px; font-weight:600; border-radius:10px; text-decoration:none;">
            Download Your Guide
          </a>
        </div>

        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:16px 20px; margin:0 0 24px;">
          <div style="font-size:13px; color:#64748b; margin-bottom:4px;">Order reference</div>
          <div style="font-size:14px; font-weight:600; color:#0f172a;">${escapeHtml(
            submissionId || "N/A"
          )}</div>
        </div>

        <p style="margin:0 0 8px; font-size:14px; color:#64748b; line-height:1.65;">
          If the download button does not open, copy and paste this link into your browser:
        </p>

        <p style="margin:0 0 20px; font-size:13px; color:#0a3d6b; line-height:1.65; word-break:break-all;">
          <a href="${GUIDE_DOWNLOAD_URL}" style="color:#0a3d6b;">${GUIDE_DOWNLOAD_URL}</a>
        </p>

        <p style="margin:0; font-size:14px; color:#64748b; line-height:1.65;">
          <strong style="color:#0f172a;">30-day money-back guarantee</strong> — if you're not satisfied for any reason, email us and we'll refund you in full.
        </p>

        <div style="margin-top:32px; padding-top:20px; border-top:1px solid #e2e8f0; font-size:12px; color:#94a3b8; text-align:center; line-height:1.6;">
          MedicaidReady • <a href="https://www.medicaidready.org" style="color:#94a3b8;">medicaidready.org</a><br/>
          You received this because you purchased the Medicaid Application Guide.
        </div>
      </div>
    </div>
  `.trim();

  try {
    const resp = await resend.emails.send({
      from,
      to: customerEmail,
      subject: "Your Medicaid Application Guide — MedicaidReady",
      html,
    });

    if ((resp as { error?: unknown })?.error) {
      console.error("sendGuideEmail error:", (resp as { error?: unknown }).error);
    } else {
      console.log("Guide email sent to:", customerEmail, resp);
    }
  } catch (e: unknown) {
    console.error("sendGuideEmail crashed:", e instanceof Error ? e.message : String(e));
  }
}

async function approveById(submissionId: string, patch: Record<string, unknown>) {
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
  patch: Record<string, unknown> = {}
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

async function revokeByEmailLatest(
  email: string,
  reason: string,
  patch: Record<string, unknown> = {}
) {
  const sb = supabaseAdmin();
  const { data: rows, error: selectErr } = await sb
    .from("request_access_submissions")
    .select("id, created_at")
    .eq("email", email)
    .order("created_at", { ascending: false })
    .limit(1);

  if (selectErr) {
    console.error("Supabase revokeByEmailLatest select failed:", selectErr.message, {
      email,
    });
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

const stripe = new Stripe(mustGet("STRIPE_SECRET_KEY"));

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).send("Method Not Allowed");
  }

  let event: Stripe.Event;

  try {
    const sig = req.headers["stripe-signature"];
    if (!sig || typeof sig !== "string") {
      return res.status(400).send("Missing stripe-signature");
    }

    const rawBody = await readRawBody(req);
    event = stripe.webhooks.constructEvent(rawBody, sig, mustGet("STRIPE_WEBHOOK_SECRET"));
  } catch (err: unknown) {
    return res
      .status(400)
      .send(`Webhook Error: ${err instanceof Error ? err.message : String(err)}`);
  }

  try {
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

      const email = normalizeEmail(
        session.customer_details?.email || session.customer_email || session.metadata?.email || ""
      );
      const submissionId = (session.metadata?.submission_id ?? "").toString().trim();
      const product = (session.metadata?.product ?? "").toString().trim();

      if (product === "medicaidready_application_guide") {
        console.log("Guide purchase detected for:", email);

        if (email) {
          await sendGuideEmail(email, submissionId);
        }

        if (submissionId) {
          const sb = supabaseAdmin();
          const { error } = await sb
            .from("eligibility_submissions")
            .update({
              guide_purchased: true,
              guide_purchased_at: new Date().toISOString(),
            })
            .eq("id", submissionId);

          if (error) {
            console.warn(
              "Could not update eligibility_submissions guide_purchased:",
              error.message
            );
          }
        }

        await notifyOwner({
          subject: "MedicaidReady • New guide purchase!",
          title: "New $9.99 guide purchase",
          lines: [
            `Customer email: <strong>${escapeHtml(email || "—")}</strong>`,
            `Submission ID: <strong>${escapeHtml(submissionId || "—")}</strong>`,
            `Stripe session: <strong>${escapeHtml(session.id)}</strong>`,
            `Amount: <strong>$9.99</strong>`,
            `Guide email sent: <strong>${email ? "Yes" : "No — missing email"}</strong>`,
            `Guide link: <strong>${escapeHtml(GUIDE_DOWNLOAD_URL)}</strong>`,
          ],
          meta: { eventType: event.type, sessionId: session.id, product },
        });

        return res.status(200).json({ received: true });
      }

      const stripeSubscriptionId =
        (typeof session.subscription === "string" ? session.subscription : "") || "";
      const stripeCustomerId =
        (typeof session.customer === "string" ? session.customer : "") || "";

      let subStatus: string | null = null;
      let periodEndIso: string | null = null;

      if (stripeSubscriptionId) {
        try {
          const subResp = await stripe.subscriptions.retrieve(stripeSubscriptionId);
          const subAny = (subResp as unknown as Record<string, unknown>)?.data ?? subResp;
          subStatus = ((subAny as Record<string, unknown>)?.status ?? null) as string | null;
          periodEndIso = toIsoOrNull(
            ((subAny as Record<string, unknown>)?.current_period_end ?? null) as number
          );
        } catch (e: unknown) {
          console.error(
            "Stripe subscription retrieve failed:",
            e instanceof Error ? e.message : String(e),
            { stripeSubscriptionId }
          );
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
        } else {
          console.warn("No request_access_submissions row found for email:", email);
        }
      } else {
        console.warn("checkout.session.completed missing submission_id and email", {
          stripeSessionId: session.id,
        });
      }

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
        meta: { eventType: event.type, sessionId: session.id, paymentStatus },
      });

      return res.status(200).json({ received: true });
    }

    if (event.type === "customer.subscription.updated") {
      const sub = event.data.object as Stripe.Subscription;
      const stripeSubscriptionId = safeString(sub.id);
      const status = safeString(sub.status);
      const currentPeriodEnd = (sub as unknown as Record<string, unknown>)
        .current_period_end as number | null | undefined;
      const periodEndIso = toIsoOrNull(currentPeriodEnd);
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
        await revokeByStripeSubscriptionId(
          stripeSubscriptionId,
          `subscription_${status || "not_active"}`,
          patch
        );
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

    if (event.type === "customer.subscription.deleted") {
      const sub = event.data.object as Stripe.Subscription;
      const stripeSubscriptionId = safeString(sub.id);
      if (!stripeSubscriptionId) return res.status(200).json({ received: true });

      const currentPeriodEnd = (sub as unknown as Record<string, unknown>)
        .current_period_end as number | null | undefined;
      const periodEndIso = toIsoOrNull(currentPeriodEnd);

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

    if (event.type === "invoice.payment_failed") {
      const invoice = event.data.object as Stripe.Invoice;
      const subField = (invoice as unknown as Record<string, unknown>)?.subscription;
      const stripeSubscriptionId = (typeof subField === "string" ? subField : "") || "";

      if (stripeSubscriptionId) {
        await revokeByStripeSubscriptionId(stripeSubscriptionId, "invoice_payment_failed", {
          stripe_subscription_status: "past_due",
        });
      } else {
        const email = normalizeEmail(
          ((invoice as unknown as Record<string, unknown>)?.customer_email as string) || ""
        );
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
          `Invoice: <strong>${escapeHtml(
            safeString((invoice as unknown as Record<string, unknown>)?.id || "—")
          )}</strong>`,
          `Stripe subscription: <strong>${escapeHtml(stripeSubscriptionId || "—")}</strong>`,
          `Customer email: <strong>${escapeHtml(
            normalizeEmail(
              ((invoice as unknown as Record<string, unknown>)?.customer_email as string) || ""
            ) || "—"
          )}</strong>`,
          `Action: <strong>revoked / past_due</strong>`,
        ],
        meta: { eventType: event.type },
      });

      return res.status(200).json({ received: true });
    }

    if (event.type === "invoice.paid") {
      const invoice = event.data.object as Stripe.Invoice;
      const subField = (invoice as unknown as Record<string, unknown>)?.subscription;
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
        const email = normalizeEmail(
          ((invoice as unknown as Record<string, unknown>)?.customer_email as string) || ""
        );

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
          `Invoice: <strong>${escapeHtml(
            safeString((invoice as unknown as Record<string, unknown>)?.id || "—")
          )}</strong>`,
          `Stripe subscription: <strong>${escapeHtml(stripeSubscriptionId || "—")}</strong>`,
          `Customer email: <strong>${escapeHtml(
            normalizeEmail(
              ((invoice as unknown as Record<string, unknown>)?.customer_email as string) || ""
            ) || "—"
          )}</strong>`,
          `Action: <strong>approved</strong>`,
        ],
        meta: { eventType: event.type },
      });

      return res.status(200).json({ received: true });
    }

    return res.status(200).json({ received: true });
  } catch (e: unknown) {
    console.error("Webhook handler error:", e instanceof Error ? e.message : String(e));
    return res.status(500).send("Webhook handler failed");
  }
}