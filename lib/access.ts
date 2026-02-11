import type { NextApiRequest } from "next";

export type Role = "viewer" | "analyst" | "admin";

/**
 * Phase 31 hardening:
 * - If env vars are not set, system stays OPEN (local dev).
 * - If env vars are set, role is read from headers for now.
 *
 * Later we swap this to real auth (Supabase / JWT / SSO) without changing call sites.
 */

export function isAuthEnabled() {
  return Boolean(process.env.ACCESS_CONTROL_ENABLED === "true");
}

export function getRole(req: NextApiRequest): Role {
  // If access control not enabled, treat as admin to avoid breaking dev flow
  if (!isAuthEnabled()) return "admin";

  // Temporary role source (header) — replace with real auth later
  const header = (req.headers["x-medicaidready-role"] || "").toString().toLowerCase();

  if (header === "admin") return "admin";
  if (header === "analyst") return "analyst";
  return "viewer";
}

export function requireRole(req: NextApiRequest, allowed: Role[]) {
  const role = getRole(req);
  const ok = allowed.includes(role);

  return { ok, role };
}
