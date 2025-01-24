import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const isAdmin = req.cookies.get("adminToken");

  if (req.nextUrl.pathname.startsWith("/admin") && !isAdmin) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
