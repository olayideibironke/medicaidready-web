import type { NextApiRequest, NextApiResponse } from "next";
import { isOriginSafe, requireAdmin } from "../../../../../lib/careers/adminAuth";
import { adminCreateJob, adminListJobs } from "../../../../../lib/careers/adminDb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = requireAdmin(req);
  if (!auth.ok) {
    return res.status(auth.status).json({ ok: false, error: auth.error });
  }

  if (req.method === "GET") {
    try {
      const jobs = await adminListJobs();
      return res.status(200).json({ ok: true, jobs });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      return res
        .status(500)
        .json({ ok: false, error: "list_failed", message: msg });
    }
  }

  if (req.method === "POST") {
    if (!isOriginSafe(req)) {
      return res.status(403).json({ ok: false, error: "bad_origin" });
    }
    try {
      const body = (req.body ?? {}) as Record<string, unknown>;
      const job = await adminCreateJob(body);
      return res.status(201).json({ ok: true, job });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      const status = msg === "title_required" || msg === "company_required" ? 400 : 500;
      return res
        .status(status)
        .json({ ok: false, error: "create_failed", message: msg });
    }
  }

  res.setHeader("Allow", "GET, POST");
  return res.status(405).json({ ok: false, error: "method_not_allowed" });
}
