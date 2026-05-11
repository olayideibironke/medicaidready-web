import type { NextApiRequest, NextApiResponse } from "next";
import {
  checkAdminKey,
  isAdminEnabled,
  isOriginSafe,
  setSessionCookie,
} from "../../../../lib/careers/adminAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "method_not_allowed" });
  }
  if (!isAdminEnabled()) {
    return res.status(503).json({ ok: false, error: "careers_admin_disabled" });
  }
  if (!isOriginSafe(req)) {
    return res.status(403).json({ ok: false, error: "bad_origin" });
  }

  const body = (req.body ?? {}) as { key?: unknown };
  const key = typeof body.key === "string" ? body.key.trim() : "";
  if (!key) {
    return res.status(400).json({ ok: false, error: "missing_key" });
  }
  if (!checkAdminKey(key)) {
    return res.status(401).json({ ok: false, error: "invalid_key" });
  }

  setSessionCookie(res, key);
  return res.status(200).json({ ok: true });
}
