// apps/docs/src/middleware.ts
// https://github.com/vercel/next.js/issues/65335

import {
  NextResponse,
  type NextFetchEvent,
  type NextRequest,
} from "next/server";

export async function middleware(req: NextRequest, event: NextFetchEvent) {
  // --- Step 1: Check if this is an RSC data request ---
  // If the 'RSC' header is present, this is a data request, not a page load.
  // We MUST NOT cache these requests, so we let them pass through untouched.
  if (req.headers.get("RSC")) {
    return NextResponse.next();
  }

  // --- Step 2: Create a unique cache key for the page ---
  // Use a @ts-ignore directive to bypass the incorrect editor error.
  // We know that in the Cloudflare Workers runtime, `caches.default` exists.
  // @ts-ignore
  const cache = caches.default;
  const cacheKey = req.url;

  // --- Step 3: Check if we have a cached version of the page ---
  // Check for a cached response
  const cachedResponse = await cache.match(cacheKey);
  if (cachedResponse) {
    return cachedResponse;
  }

  // --- Step 4: If no cache, fetch the page from the Next.js server ---
  // This is a cache MISS.
  const response = await fetch(req);

  // --- Step 5: Prepare and store the response in the cache ---
  if (response.ok) {
    // We need to clone the response to avoid consuming the body.
    const responseToCache = response.clone();

    // Remove the problematic 'Vary' header from the response we are about to cache.
    responseToCache.headers.delete("Vary");

    // Set the Cache-Control header on the cloned response.
    responseToCache.headers.set(
      "Cache-Control",
      "public, s-maxage=31536000, stale-while-revalidate=60"
    );

    // Use event.waitUntil to cache the response without blocking the user.
    event.waitUntil(cache.put(cacheKey, responseToCache));
  }

  return response;
}

// Ensure the middleware runs on all page routes.
export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
};
