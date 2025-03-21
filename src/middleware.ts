import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublicPath = [
    "/auth/login",
    "/auth/registration",
    "/auth/reset",
    "/auth/forgot-password",
  ].includes(path);
  const isProtectedPath = path.startsWith("/admin");

  const token = request.cookies.get("accessToken")?.value || null;
  const role = request.cookies.get("role")?.value || null;
  const isBanned = request.cookies.get("isBanned")?.value || null;

  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  if (isBanned) {
    return NextResponse.redirect(new URL("/banned", request.url));
  }
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (isProtectedPath && role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/auth/login",
    "/auth/registration",
    "/auth/reset",
    "/auth/forgot-password",
    "/banned",
    "/notifications",
    "/heatmap",
    "/reports/:path*",
    "/profile",
    "/profile/:path*",
    "/settings",
    "/admin/:path*",
    "/hot/reports",
    "/bookmarked",
  ],
};
