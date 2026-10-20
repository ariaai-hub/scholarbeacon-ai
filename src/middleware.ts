import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Public routes that don't need auth
const publicRoutes = [
  "/",
  "/sign-in",
  "/sign-up",
  "/son",
  "/son/dashboard",
  "/son/profile",
  "/api/webhooks/stripe",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes without any auth check
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // For all other routes, check for Clerk session cookie
  // If no session, redirect to sign-in
  const clerkSession = request.cookies.get("__session");

  if (!clerkSession) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("redirect_url", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
