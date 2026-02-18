import type { NextApiRequest, NextApiResponse } from "next";
import { Resend } from "resend";

function mustGet(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "method_not_allowed" });
  }

  try {
    const resend = new Resend(mustGet("RESEND_API_KEY"));
    const from = mustGet("RESEND_FROM_EMAIL"); // already set in your Vercel env per project rules

    const subject = `MedicaidReady Test Email (${new Date().toISOString()})`;
    const text = [
      "This is a test email from MedicaidReady (Vercel).",
      "",
      `Time: ${new Date().toLocaleString()}`,
      `Env: ${process.env.VERCEL_ENV || "unknown"}`,
    ].join("\n");

    const result = await resend.emails.send({
      from,
      to: ["medicaidready@hotmail.com"],
      subject,
      text,
    });

    return res.status(200).json({ ok: true, result });
  } catch (e: any) {
    return res.status(500).json({
      ok: false,
      error: "send_failed",
      message: e?.message ?? String(e),
    });
  }
}
