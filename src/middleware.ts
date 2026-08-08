import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySession } from "./lib/auth";

const protectedRoutes = ["/admin", "/api/admin"];
const publicRoutes = ["/admin/login", "/api/admin/login"];

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route)) && !publicRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  const cookie = req.cookies.get("session")?.value;
  const session = cookie ? await verifySession(cookie) : null;

  // Redirect to login if accessing a protected route without a session
  if (isProtectedRoute && !session) {
    if (path.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/admin/login", req.nextUrl));
  }

  // Redirect to dashboard if logged in and trying to access the login page
  if (isPublicRoute && session && path === "/admin/login") {
    return NextResponse.redirect(new URL("/admin", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
