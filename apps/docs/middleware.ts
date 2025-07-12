// apps/docs/src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // https://github.com/vercel/next.js/issues/65335
  // fuck nextjs rsc app router
  // Allow the request to go through to the page
  const response = NextResponse.next();

  // Delete the 'Vary' header from the response
  response.headers.delete("Vary");

  // Return the modified response
  return response;
}
