import type { NextApiRequest, NextApiResponse } from "next";

const COOKIE_NAME = "careers_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 8;
const MIN_KEY_LENGTH = 12;

function getExpectedKey(): string | null {
  const raw = process.env.CAREERS_ADMIN_KEY;
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim();
  if (trimmed.length < MIN_KEY_LENGTH) return null;
  return trimmed;
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

function readCookie(req: NextApiRequest, name: string): string | null {
  const raw = req.headers.cookie;
  if (typeof raw !== "string" || !raw) return null;
  const parts = raw.split(/;\s*/);
  for (const p of parts) {
    const idx = p.indexOf("=");
    if (idx === -1) continue;
    if (p.slice(0, idx) === name) {
      try {
        return decodeURIComponent(p.slice(idx + 1));
      } catch {
        return null;
      }
    }
  }
  return null;
}

export type AuthCheck =
  | { ok: true }
  | { ok: false; status: number; error: string };

export function isAdminEnabled(): boolean {
  return getExpectedKey() !== null;
}

export function requireAdmin(req: NextApiRequest): AuthCheck {
  const expected = getExpectedKey();
  if (!expected) {
    return {
      ok: false,
      status: 503,
      error: "careers_admin_disabled",
    };
  }
  const cookieValue = readCookie(req, COOKIE_NAME);
  if (!cookieValue) {
    return { ok: false, status: 401, error: "unauthorized" };
  }
  if (!constantTimeEqual(cookieValue, expected)) {
    return { ok: false, status: 401, error: "unauthorized" };
  }
  return { ok: true };
}

export function checkAdminKey(key: string): boolean {
  const expected = getExpectedKey();
  if (!expected) return false;
  if (typeof key !== "string") return false;
  return constantTimeEqual(key, expected);
}

function buildCookie(value: string, maxAgeSeconds: number): string {
  const secure = process.env.NODE_ENV === "production";
  const parts = [
    `${COOKIE_NAME}=${encodeURIComponent(value)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${maxAgeSeconds}`,
  ];
  if (secure) parts.push("Secure");
  return parts.join("; ");
}

export function setSessionCookie(res: NextApiResponse, key: string) {
  res.setHeader("Set-Cookie", buildCookie(key, SESSION_TTL_SECONDS));
}

export function clearSessionCookie(res: NextApiResponse) {
  res.setHeader("Set-Cookie", buildCookie("", 0));
}

export function isOriginSafe(req: NextApiRequest): boolean {
  const origin = req.headers.origin;
  if (typeof origin !== "string" || !origin) {
    return true;
  }
  const host = req.headers.host;
  if (typeof host !== "string" || !host) return false;
  try {
    const u = new URL(origin);
    return u.host === host;
  } catch {
    return false;
  }
}
