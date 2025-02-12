import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const isPublicPath = path === "/auth/login" || path === "/auth/registration";

  // Get the token from cookies
  const token = request.cookies.get("accessToken")?.value || "";

  // Redirect logic
  if (isPublicPath && token) {
    // If user is logged in and tries to access login/register page,
    // redirect to home page
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!isPublicPath && !token) {
    // If user is not logged in and tries to access protected route,
    // redirect to login page
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    "/",
    "/auth/login",
    "/auth/registration",
    "/notifications",
    "/heatmap",
    "/emergency-contact/:path*",
    "/profile",
  ],
};
