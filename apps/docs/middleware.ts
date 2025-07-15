// apps/docs/middleware.ts
// basic middleware to handle RSC requests and optimize caching for Next.js
import {
  NextResponse,
  type NextFetchEvent,
  type NextRequest,
} from "next/server";

export async function middleware(req: NextRequest, event: NextFetchEvent) {
  // Check if this is an RSC data request
  if (req.headers.get("RSC")) {
    // Let RSC requests pass through but remove problematic headers from response
    const response = NextResponse.next();

    // Remove headers that cause cache fragmentation
    response.headers.delete("Vary");
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=3600, stale-while-revalidate=60"
    );

    return response;
  }

  // For regular page requests, also optimize caching
  const response = NextResponse.next();

  // Remove problematic headers
  response.headers.delete("Vary");
  response.headers.set(
    "Cache-Control",
    "public, s-maxage=31536000, stale-while-revalidate=60"
  );

  return response;
}

// Ensure the middleware runs on all page routes
export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
};
