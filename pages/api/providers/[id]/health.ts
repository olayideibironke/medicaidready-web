import type { NextApiRequest, NextApiResponse } from "next";

function getId(req: NextApiRequest): string | null {
  const raw = req.query?.id;
  if (typeof raw === "string" && raw.trim()) return raw.trim();
  if (Array.isArray(raw) && raw[0]?.trim()) return raw[0].trim();
  return null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = getId(req);

  if (!id) {
    return res.status(400).json({
      ok: false,
      error: "missing_provider_id",
      message: "Provider id is required in the URL path.",
    });
  }

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({
      ok: false,
      error: "method_not_allowed",
      message: "Use GET.",
    });
  }

  return res.status(200).json({
    ok: true,
    providerId: id,
    service: "providers/[id]/health",
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
}
