import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  const authEnabled = Boolean(process.env.BASIC_AUTH_USER && process.env.BASIC_AUTH_PASS);

  res.status(200).json({
    ok: true,
    service: "medicaidready-web",
    authEnabled,
    timestamp: new Date().toISOString(),
  });
}
