import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isPublicPath = ["/auth/login", "/auth/registration"].includes(path);

  const token = request.cookies.get("accessToken")?.value || null;

  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/auth/login",
    "/auth/registration",
    "/notifications",
    "/heatmap",
    "/reports/:path*",
    "/profile",
  ],
};
