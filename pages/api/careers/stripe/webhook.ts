import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { markJobPaid } from "../../../../lib/careers/employerDb";

export const config = {
  api: { bodyParser: false },
};

async function readRawBody(req: NextApiRequest): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

function envOrNull(name: string): string | null {
  const v = process.env[name];
  return typeof v === "string" && v.trim() ? v.trim() : null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).send("Method Not Allowed");
  }

  const stripeSecret = envOrNull("STRIPE_SECRET_KEY");
  const webhookSecret = envOrNull("STRIPE_CAREERS_WEBHOOK_SECRET");
  if (!stripeSecret || !webhookSecret) {
    return res.status(503).send("careers_webhook_disabled");
  }

  const sig = req.headers["stripe-signature"];
  if (typeof sig !== "string" || !sig) {
    return res.status(400).send("Missing stripe-signature");
  }

  const stripe = new Stripe(stripeSecret);
  let event: Stripe.Event;
  try {
    const rawBody = await readRawBody(req);
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return res.status(400).send(`Webhook Error: ${msg}`);
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const product = session.metadata?.product ?? "";
      if (product !== "medicaidready_careers_job_post") {
        return res.status(200).json({ received: true, ignored: "not_careers_product" });
      }

      const paid =
        session.payment_status === "paid" ||
        session.payment_status === "no_payment_required";
      if (!paid) {
        return res
          .status(200)
          .json({ received: true, ignored: "not_paid", payment_status: session.payment_status });
      }

      const jobId =
        (session.metadata?.job_id ?? "").toString().trim() ||
        (session.client_reference_id ?? "").toString().trim();
      const tierRaw = (session.metadata?.tier ?? "").toString().trim();
      const tier: "standard" | "featured" =
        tierRaw === "featured" ? "featured" : "standard";

      if (!jobId) {
        console.warn("[careers/stripe] checkout.session.completed missing job_id", {
          sessionId: session.id,
        });
        return res.status(200).json({ received: true, ignored: "missing_job_id" });
      }

      const paymentIntentId =
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : (session.payment_intent as Stripe.PaymentIntent | null)?.id ?? null;

      await markJobPaid({
        jobId,
        tier,
        stripeSessionId: session.id,
        stripePaymentIntentId: paymentIntentId,
      });

      return res.status(200).json({ received: true, jobId, tier });
    }

    return res.status(200).json({ received: true, ignored: event.type });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[careers/stripe] webhook handler error:", msg);
    return res.status(500).send("Webhook handler failed");
  }
}
