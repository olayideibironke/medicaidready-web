import type { NextApiRequest, NextApiResponse } from "next";

function present(v: any) {
  return Boolean(v && String(v).trim().length > 0);
}

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  const checks = {
    BASIC_AUTH_USER: present(process.env.BASIC_AUTH_USER),
    BASIC_AUTH_PASS: present(process.env.BASIC_AUTH_PASS),
    READ_ONLY_MODE: present(process.env.READ_ONLY_MODE),
    ACCESS_CONTROL_ENABLED: present(process.env.ACCESS_CONTROL_ENABLED),
  };

  const ok = Object.values(checks).every(Boolean);

  res.status(ok ? 200 : 500).json({
    ok,
    checks,
    timestamp: new Date().toISOString(),
  });
}
