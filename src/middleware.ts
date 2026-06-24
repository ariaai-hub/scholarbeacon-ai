import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = (path: string) => {
  const publicRoutes = ["/", "/sign-in", "/sign-up", "/api/webhooks/stripe"];
  return publicRoutes.some((route) => path.startsWith(route));
};

export default clerkMiddleware(async (auth, request) => {
  if (isPublicRoute(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  await auth.protect();
});

export const config = {
  matcher: [
    "/((?!.*\\..*|_next).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
};
