import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

function mustGet(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

function pickString(v: unknown): string {
  return (v ?? "").toString().trim();
}

const stripe = new Stripe(mustGet("STRIPE_SECRET_KEY"), {
  apiVersion: "2023-10-16",
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ ok: false, error: "method_not_allowed" });
  }

  try {
    const sessionId = pickString(req.query.session_id);

    if (!sessionId || !sessionId.startsWith("cs_")) {
      return res.status(400).json({ ok: false, error: "invalid_session_id" });
    }

    // Expand subscription/customer for easier future use (optional but handy)
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["subscription", "customer"],
    });

    const metadataSubmissionId = pickString(session?.metadata?.submission_id);
    const clientRef = pickString(session?.client_reference_id);

    const submissionId = metadataSubmissionId || clientRef;

    if (!submissionId) {
      return res.status(404).json({
        ok: false,
        error: "submission_id_not_found",
        message: "No submission_id found on Stripe session.",
      });
    }

    // Set cookie so subsequent /api/providers calls can pass gating
    // - httpOnly: protect from JS
    // - sameSite: Lax works well for same-site navigation
    // - path: make it available to whole app
    // NOTE: secure should be true in production behind https
    const secure = process.env.NODE_ENV === "production";

    res.setHeader(
      "Set-Cookie",
      `submission_id=${encodeURIComponent(submissionId)}; Path=/; HttpOnly; SameSite=Lax; ${
        secure ? "Secure; " : ""
      }Max-Age=${60 * 60 * 24 * 30}`
    );

    return res.status(200).json({
      ok: true,
      submissionId,
      customer: typeof session.customer === "string" ? session.customer : (session.customer as any)?.id ?? null,
      subscription:
        typeof session.subscription === "string" ? session.subscription : (session.subscription as any)?.id ?? null,
    });
  } catch (e: any) {
    return res.status(500).json({
      ok: false,
      error: "resolve_submission_failed",
      message: e?.message ?? String(e),
    });
  }
}
