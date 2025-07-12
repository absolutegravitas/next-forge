// apps/docs/src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // https://github.com/vercel/next.js/issues/65335
  // fuck nextjs rsc app router
  // Allow the request to go through to the page
  const response = NextResponse.next();

  // Delete the 'Vary' header to allow CDN caching
  response.headers.delete("Vary");

  return response;
}

// Add this config object to apply the middleware to all pages
export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
};
