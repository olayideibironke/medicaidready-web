// lib/email.ts
import { Resend } from "resend";

function mustGet(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

const OWNER_ALERT_EMAIL = "medicaidready@hotmail.com";

function fromEmail() {
  // If you later verify a domain, set RESEND_FROM_EMAIL in Vercel.
  // For now, Resend’s default testing sender often works:
  return process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
}

export async function sendOwnerAlert(args: {
  subject: string;
  text: string;
  html?: string;
}) {
  const resend = new Resend(mustGet("RESEND_API_KEY"));

  return await resend.emails.send({
    from: fromEmail(),
    to: OWNER_ALERT_EMAIL,
    subject: args.subject,
    text: args.text,
    html: args.html,
  });
}
