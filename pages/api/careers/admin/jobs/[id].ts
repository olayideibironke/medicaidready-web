import type { NextApiRequest, NextApiResponse } from "next";
import { isOriginSafe, requireAdmin } from "../../../../../lib/careers/adminAuth";
import {
  adminDeleteJob,
  adminGetJob,
  adminUpdateJob,
} from "../../../../../lib/careers/adminDb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = requireAdmin(req);
  if (!auth.ok) {
    return res.status(auth.status).json({ ok: false, error: auth.error });
  }

  const id = String(req.query.id ?? "").trim();
  if (!id) {
    return res.status(400).json({ ok: false, error: "missing_id" });
  }

  if (req.method === "GET") {
    try {
      const job = await adminGetJob(id);
      if (!job) return res.status(404).json({ ok: false, error: "not_found" });
      return res.status(200).json({ ok: true, job });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      return res
        .status(500)
        .json({ ok: false, error: "get_failed", message: msg });
    }
  }

  if (req.method === "PATCH") {
    if (!isOriginSafe(req)) {
      return res.status(403).json({ ok: false, error: "bad_origin" });
    }
    try {
      const body = (req.body ?? {}) as Record<string, unknown>;
      const job = await adminUpdateJob(id, body);
      return res.status(200).json({ ok: true, job });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      const status = msg === "not_found" ? 404 : 500;
      return res
        .status(status)
        .json({ ok: false, error: "update_failed", message: msg });
    }
  }

  if (req.method === "DELETE") {
    if (!isOriginSafe(req)) {
      return res.status(403).json({ ok: false, error: "bad_origin" });
    }
    try {
      await adminDeleteJob(id);
      return res.status(200).json({ ok: true });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      return res
        .status(500)
        .json({ ok: false, error: "delete_failed", message: msg });
    }
  }

  res.setHeader("Allow", "GET, PATCH, DELETE");
  return res.status(405).json({ ok: false, error: "method_not_allowed" });
}
