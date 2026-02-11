import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function isProtectedPath(pathname: string) {
  return pathname.startsWith("/providers") || pathname.startsWith("/api/providers");
}

function isProvidersApi(pathname: string) {
  return pathname.startsWith("/api/providers");
}

function isWriteMethod(method: string) {
  return ["POST", "PUT", "PATCH", "DELETE"].includes(method.toUpperCase());
}

function unauthorized() {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="MedicaidReady"' },
  });
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // --- Read-only kill switch for provider writes ---
  const readOnly = process.env.READ_ONLY_MODE === "true";
  if (readOnly && isProvidersApi(pathname) && isWriteMethod(req.method)) {
    return NextResponse.json(
      { ok: false, error: "read_only_mode", message: "Writes are disabled (READ_ONLY_MODE=true)." },
      { status: 403 }
    );
  }

  // --- Optional Basic Auth perimeter (env-driven) ---
  if (!isProtectedPath(pathname)) return NextResponse.next();

  const user = process.env.BASIC_AUTH_USER;
  const pass = process.env.BASIC_AUTH_PASS;

  // If env not set, do nothing
  if (!user || !pass) return NextResponse.next();

  const auth = req.headers.get("authorization");
  if (!auth || !auth.startsWith("Basic ")) return unauthorized();

  try {
    const encoded = auth.slice("Basic ".length);
    const decoded = Buffer.from(encoded, "base64").toString("utf8");
    const [u, p] = decoded.split(":");

    if (u === user && p === pass) return NextResponse.next();
    return unauthorized();
  } catch {
    return unauthorized();
  }
}

export const config = {
  matcher: ["/providers/:path*", "/api/providers/:path*"],
};
