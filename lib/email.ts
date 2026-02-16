// lib/email.ts
import { Resend } from "resend";

function mustGet(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

function optionalGet(name: string) {
  const v = process.env[name];
  return v ? String(v) : "";
}

function safeText(v: unknown): string {
  if (v === null || v === undefined) return "";
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  try {
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
}

function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function prettyJson(obj: unknown) {
  const json = typeof obj === "string" ? obj : safeText(obj);
  return `<pre style="white-space:pre-wrap;margin:0;padding:12px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;font-size:12px;line-height:1.5;color:#0f172a;">${escapeHtml(
    json
  )}</pre>`;
}

const resend = new Resend(mustGet("RESEND_API_KEY"));

export async function sendOwnerAlert(args: {
  subject: string;
  title?: string;
  summary?: string;
  data?: unknown;
}) {
  const to = optionalGet("ALERT_TO_EMAIL") || optionalGet("OWNER_ALERT_EMAIL");
  if (!to) {
    // No recipient configured — skip silently (do not break webhooks)
    // eslint-disable-next-line no-console
    console.warn("sendOwnerAlert skipped: missing ALERT_TO_EMAIL (or OWNER_ALERT_EMAIL)");
    return;
  }

  const from = mustGet("RESEND_FROM_EMAIL");

  const title = args.title || args.subject;
  const summary = args.summary || "";

  const html = `
  <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; color:#0f172a;">
    <div style="padding:18px;border:1px solid #e2e8f0;border-radius:16px;background:#ffffff;max-width:720px;">
      <div style="font-weight:900;font-size:16px;margin-bottom:8px;">${escapeHtml(title)}</div>
      ${
        summary
          ? `<div style="color:#475569;font-size:13px;line-height:1.6;margin-bottom:12px;">${escapeHtml(
              summary
            )}</div>`
          : ""
      }
      ${args.data ? prettyJson(args.data) : ""}
      <div style="margin-top:14px;color:#64748b;font-size:12px;">
        MedicaidReady owner alert • ${escapeHtml(new Date().toLocaleString())}
      </div>
    </div>
  </div>`;

  await resend.emails.send({
    from,
    to,
    subject: args.subject,
    html,
  });
}
