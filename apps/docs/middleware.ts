// apps/docs/middleware.ts
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
// // apps/docs/middleware.ts
// import {
//   NextResponse,
//   type NextFetchEvent,
//   type NextRequest,
// } from "next/server";

// export async function middleware(req: NextRequest, event: NextFetchEvent) {
//   const url = new URL(req.url);
//   const isRSCRequest = req.headers.get("RSC") !== null;

//   // --- Step 1: Handle RSC requests with improved caching ---
//   if (isRSCRequest) {
//     // For RSC requests, create a normalized cache key that focuses on the actual content
//     // rather than the navigation state
//     const normalizedPath = url.pathname;
//     const searchParams = new URLSearchParams(url.search);

//     // Remove RSC-specific parameters that don't affect content
//     searchParams.delete("_rsc");

//     // Create a content-based cache key for RSC requests
//     const contentCacheKey = `${normalizedPath}?${searchParams.toString()}`;

//     // @ts-ignore
//     const cache = caches.default;
//     const rscCacheKey = `rsc:${contentCacheKey}`;

//     // Check for cached RSC response
//     const cachedRSCResponse = await cache.match(rscCacheKey);
//     if (cachedRSCResponse) {
//       return cachedRSCResponse;
//     }

//     // If not cached, fetch and cache the RSC response
//     const response = await fetch(req);

//     if (response.ok) {
//       const responseToCache = response.clone();

//       // Remove problematic headers for RSC caching
//       responseToCache.headers.delete("Vary");
//       responseToCache.headers.delete("Set-Cookie");

//       // Set appropriate cache headers for RSC responses
//       responseToCache.headers.set(
//         "Cache-Control",
//         "public, s-maxage=3600, stale-while-revalidate=60"
//       );

//       // Cache RSC responses for a shorter duration since they might be more dynamic
//       event.waitUntil(
//         cache.put(rscCacheKey, responseToCache).then(() => {
//           console.log(`RSC Cached: ${rscCacheKey}`);
//         })
//       );
//     }

//     return response;
//   }

//   // --- Step 2: Handle regular page requests ---
//   // @ts-ignore
//   const cache = caches.default;
//   const cacheKey = req.url;

//   // Check for cached page response
//   const cachedResponse = await cache.match(cacheKey);
//   if (cachedResponse) {
//     console.log(`Page Cache HIT: ${cacheKey}`);
//     // Add cache hit header for debugging
//     cachedResponse.headers.set("X-Cache-Status", "HIT");
//     return cachedResponse;
//   }

//   console.log(`Page Cache MISS: ${cacheKey}`);

//   // --- Step 3: Fetch and cache page response ---
//   const response = await fetch(req);

//   if (response.ok) {
//     const responseToCache = response.clone();

//     // Remove problematic headers that prevent effective caching
//     responseToCache.headers.delete("Vary");
//     responseToCache.headers.delete("Set-Cookie");

//     // Set long-term cache headers for static documentation
//     responseToCache.headers.set(
//       "Cache-Control",
//       "public, s-maxage=31536000, stale-while-revalidate=60"
//     );

//     // Add cache identification header
//     responseToCache.headers.set("X-Cache-Status", "MISS");

//     event.waitUntil(
//       cache.put(cacheKey, responseToCache).then(() => {
//         console.log(`Page Cached: ${cacheKey}`);
//       })
//     );
//   }

//   return response;
// }

// // Updated matcher to be more specific about what should be cached
// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except for the ones starting with:
//      * - api (API routes)
//      * - _next/static (static files)
//      * - _next/image (image optimization files)
//      * - favicon.ico (favicon file)
//      * - robots.txt, sitemap.xml (SEO files)
//      */
//     "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
//   ],
// };
