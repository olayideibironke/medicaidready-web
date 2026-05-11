import type { NextApiRequest, NextApiResponse } from "next";
import { clearSessionCookie } from "../../../../lib/careers/adminAuth";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "method_not_allowed" });
  }
  clearSessionCookie(res);
  return res.status(200).json({ ok: true });
}
