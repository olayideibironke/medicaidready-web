import type { NextApiRequest, NextApiResponse } from "next";
import { subscribeJobAlert } from "../../../../lib/careers/jobAlertsDb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "method_not_allowed" });
  }

  const origin = req.headers.origin;
  const host = req.headers.host;
  if (typeof origin === "string" && origin && typeof host === "string" && host) {
    try {
      if (new URL(origin).host !== host) {
        return res.status(403).json({ ok: false, error: "bad_origin" });
      }
    } catch {
      return res.status(403).json({ ok: false, error: "bad_origin" });
    }
  }

  try {
    const body = (req.body ?? {}) as Record<string, unknown>;
    const email = typeof body.email === "string" ? body.email : "";
    const source = typeof body.source === "string" ? body.source : "unknown";
    const category = typeof body.category === "string" ? body.category : undefined;

    const result = await subscribeJobAlert({ email, source, category });
    return res
      .status(200)
      .json({ ok: true, alreadySubscribed: result.alreadySubscribed });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    const status = msg === "email_invalid" ? 400 : 500;
    return res.status(status).json({ ok: false, error: msg });
  }
}
