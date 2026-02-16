import type { NextApiRequest, NextApiResponse } from "next";
import { sendOwnerAlert } from "../../../lib/email";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "method_not_allowed" });
  }

  try {
    const result = await sendOwnerAlert({
      subject: `MedicaidReady Test Email (${new Date().toISOString()})`,
      text: [
        "This is a test email from your Vercel backend.",
        "",
        `Time: ${new Date().toLocaleString()}`,
        `Env: ${process.env.VERCEL_ENV || "unknown"}`,
      ].join("\n"),
    });

    return res.status(200).json({
      ok: true,
      result,
    });
  } catch (e: any) {
    return res.status(500).json({
      ok: false,
      error: "send_failed",
      message: e?.message ?? String(e),
    });
  }
}
