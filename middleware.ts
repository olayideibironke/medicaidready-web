import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function isProtectedPath(pathname: string) {
  return (
    pathname.startsWith("/providers") ||
    pathname.startsWith("/api/providers")
  );
}

function unauthorized() {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="MedicaidReady"',
    },
  });
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only guard the provider surface area
  if (!isProtectedPath(pathname)) return NextResponse.next();

  const user = process.env.BASIC_AUTH_USER;
  const pass = process.env.BASIC_AUTH_PASS;

  // If env not set, do nothing (no disruption to local dev)
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
