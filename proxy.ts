// proxy.ts
import { NextRequest, NextResponse } from "next/server";

const BASIC_AUTH_ENABLED =
  String(process.env.BASIC_AUTH_ENABLED ?? "false").toLowerCase() === "true";

const USER = process.env.BASIC_AUTH_USER || "";
const PASS = process.env.BASIC_AUTH_PASS || "";

function unauthorized() {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Secure Area"',
    },
  });
}

export default function proxy(req: NextRequest) {
  if (!BASIC_AUTH_ENABLED) return NextResponse.next();

  const authHeader = req.headers.get("authorization");
  if (!authHeader) return unauthorized();

  const parts = authHeader.split(" ");
  const base64 = parts.length === 2 ? parts[1] : "";
  if (!base64) return unauthorized();

  const decoded = Buffer.from(base64, "base64").toString("utf-8");
  const [username, password] = decoded.split(":");

  if (username === USER && password === PASS) {
    return NextResponse.next();
  }

  return unauthorized();
}

export const config = {
  matcher: "/:path*",
};
