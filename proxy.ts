// proxy.ts
import { NextRequest, NextResponse } from "next/server";

const ACCESS_CONTROL_ENABLED =
  String(process.env.ACCESS_CONTROL_ENABLED ?? "false").toLowerCase() === "true";

const BASIC_AUTH_ENABLED =
  String(process.env.BASIC_AUTH_ENABLED ?? "false").toLowerCase() === "true";

const ADMIN_USER = process.env.BASIC_AUTH_USER || "";
const ADMIN_PASS = process.env.BASIC_AUTH_PASS || "";

const ACCESS_PASSCODE = process.env.MEDICAIDREADY_ACCESS_PASSCODE || "";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

function redirectToRequestAccess(req: NextRequest) {
  const url = req.nextUrl.clone();
  url.pathname = "/request-access";
  url.searchParams.set("next", req.nextUrl.pathname);
  // Important: no WWW-Authenticate header => no browser popup
  return NextResponse.redirect(url, 302);
}

function decodeBasicAuth(req: NextRequest): { user: string; pass: string } | null {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) return null;

  const parts = authHeader.split(" ");
  const base64 = parts.length === 2 ? parts[1] : "";
  if (!base64) return null;

  const decoded = Buffer.from(base64, "base64").toString("utf-8");
  const [user, pass] = decoded.split(":");
  if (!user || pass === undefined) return null;

  return { user, pass };
}

async function isApprovedEmail(email: string): Promise<boolean> {
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) return false;

  const url =
    `${SUPABASE_URL}/rest/v1/request_access_submissions` +
    `?select=id&email=eq.${encodeURIComponent(email.toLowerCase())}` +
    `&status=eq.approved&limit=1`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
    },
  });

  if (!res.ok) return false;

  const data = (await res.json().catch(() => null)) as any;
  return Array.isArray(data) && data.length > 0;
}

export default async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Only run on /providers routes (matcher below), but keep guard anyway.
  if (!(pathname === "/providers" || pathname.startsWith("/providers/"))) {
    return NextResponse.next();
  }

  const authRequired = BASIC_AUTH_ENABLED || ACCESS_CONTROL_ENABLED;
  if (!authRequired) return NextResponse.next();

  const creds = decodeBasicAuth(req);

  // If no creds, DO NOT challenge with Basic Auth. Redirect instead (no popup).
  if (!creds) return redirectToRequestAccess(req);

  const user = creds.user.trim();
  const pass = creds.pass;

  // 1) Admin pass-through (only meaningful if someone sends an Authorization header)
  if (BASIC_AUTH_ENABLED && user === ADMIN_USER && pass === ADMIN_PASS) {
    return NextResponse.next();
  }

  // 2) Credentialed access (approved email + shared passcode)
  if (ACCESS_CONTROL_ENABLED) {
    if (!ACCESS_PASSCODE) return redirectToRequestAccess(req);
    if (pass !== ACCESS_PASSCODE) return redirectToRequestAccess(req);

    const ok = await isApprovedEmail(user);
    if (ok) return NextResponse.next();
  }

  return redirectToRequestAccess(req);
}

// Only match /providers UI routes.
export const config = {
  matcher: ["/providers", "/providers/:path*"],
};
