import type { NextApiRequest, NextApiResponse } from "next";
import { createEmployerSubmission } from "../../../../lib/careers/employerDb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "method_not_allowed" });
  }

  const origin = req.headers.origin;
  const host = req.headers.host;
  if (typeof origin === "string" && origin && typeof host === "string" && host) {
    try {
      const u = new URL(origin);
      if (u.host !== host) {
        return res.status(403).json({ ok: false, error: "bad_origin" });
      }
    } catch {
      return res.status(403).json({ ok: false, error: "bad_origin" });
    }
  }

  try {
    const body = (req.body ?? {}) as Record<string, unknown>;
    const result = await createEmployerSubmission({
      title: String(body.title ?? ""),
      company: String(body.company ?? ""),
      contactName: typeof body.contactName === "string" ? body.contactName : undefined,
      contactEmail: String(body.contactEmail ?? ""),
      category: typeof body.category === "string" ? body.category : undefined,
      location: typeof body.location === "string" ? body.location : undefined,
      workMode: typeof body.workMode === "string" ? body.workMode : undefined,
      employmentType:
        typeof body.employmentType === "string" ? body.employmentType : undefined,
      salaryMin: body.salaryMin as number | string | null | undefined,
      salaryMax: body.salaryMax as number | string | null | undefined,
      salaryCurrency:
        typeof body.salaryCurrency === "string" ? body.salaryCurrency : undefined,
      salaryPeriod:
        typeof body.salaryPeriod === "string" ? body.salaryPeriod : undefined,
      salaryDisplay:
        typeof body.salaryDisplay === "string" ? body.salaryDisplay : undefined,
      summary: typeof body.summary === "string" ? body.summary : undefined,
      description: String(body.description ?? ""),
      responsibilities: body.responsibilities as string | string[] | undefined,
      requirements: body.requirements as string | string[] | undefined,
      benefits: body.benefits as string | string[] | undefined,
      applyUrl: typeof body.applyUrl === "string" ? body.applyUrl : undefined,
      paymentTier:
        typeof body.paymentTier === "string" ? body.paymentTier : undefined,
    });

    return res.status(201).json({
      ok: true,
      jobId: result.id,
      slug: result.slug,
      paymentTier: result.payment_tier,
      paymentStatus: result.payment_status,
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    const userErrors = new Set([
      "title_required",
      "company_required",
      "contact_email_invalid",
      "description_required",
      "apply_url_invalid",
    ]);
    const status = userErrors.has(msg) ? 400 : 500;
    return res.status(status).json({ ok: false, error: msg });
  }
}
