import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  const authEnabled = Boolean(process.env.BASIC_AUTH_USER && process.env.BASIC_AUTH_PASS);
  const readOnly = process.env.READ_ONLY_MODE === "true";
  const accessControl = process.env.ACCESS_CONTROL_ENABLED === "true";

  res.status(200).json({
    ok: true,
    service: "medicaidready-web",
    authEnabled,
    accessControlEnabled: accessControl,
    readOnlyMode: readOnly,
    timestamp: new Date().toISOString(),
  });
}
