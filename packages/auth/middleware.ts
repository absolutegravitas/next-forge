import type { NextRequest } from "next/server";
import { NextResponse } from 'next/server';
import { auth } from './server';

// Protected routes configuration
const protectedRoutes = ["/dashboard", "/settings", "/profile"];

const isProtectedRoute = (request: NextRequest): boolean => {
  return protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );
};

export const authMiddleware = async (request: NextRequest) => {
  // Extract Cloudflare headers for better context
  const cfHeaders = {
    'cf-connecting-ip': request.headers.get('cf-connecting-ip'),
    'cf-ipcountry': request.headers.get('cf-ipcountry'),
    'cf-region': request.headers.get('cf-region'),
    'cf-timezone': request.headers.get('cf-timezone'),
    'cf-city': request.headers.get('cf-city'),
  };

  try {
    // Get session with enhanced context
    const session = await auth.api.getSession({
      headers: {
        cookie: request.headers.get('cookie') || '',
        // Pass Cloudflare headers for geolocation enrichment
        ...cfHeaders,
      },
    });
    
    // Check if route is protected and user is not authenticated
    if (isProtectedRoute(request) && !session?.user) {
      const signInUrl = new URL("/sign-in", request.url);
      signInUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
      return NextResponse.redirect(signInUrl);
    }

    // If user is authenticated and accessing auth pages, redirect to dashboard
    const authPages = ["/sign-in", "/sign-up"];
    if (session?.user && authPages.includes(request.nextUrl.pathname)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Continue with the request
    const response = NextResponse.next();

    // Add Cloudflare context to response headers for client-side access
    if (cfHeaders['cf-connecting-ip']) {
      response.headers.set('x-user-ip', cfHeaders['cf-connecting-ip']);
    }
    if (cfHeaders['cf-ipcountry']) {
      response.headers.set('x-user-country', cfHeaders['cf-ipcountry']);
    }
    if (cfHeaders['cf-region']) {
      response.headers.set('x-user-region', cfHeaders['cf-region']);
    }
    if (cfHeaders['cf-city']) {
      response.headers.set('x-user-city', cfHeaders['cf-city']);
    }

    return response;

  } catch (error) {
    console.error('Auth middleware error:', error);
    
    // On error, still check if route is protected
    if (isProtectedRoute(request)) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
    
    return NextResponse.next();
  }
};
