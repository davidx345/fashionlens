import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define the authentication token cookie name
const AUTH_TOKEN_COOKIE_NAME = 'authToken'; // Ensure this matches the cookie name set by your backend

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_TOKEN_COOKIE_NAME)?.value;

  // Protected routes: /dashboard and its children
  // Re-enable this block to enforce authentication for dashboard
  if (pathname.startsWith('/dashboard')) {
    if (!token) {
      // No token, redirect to login
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirectedFrom', pathname); // Optional: pass original path for post-login redirect
      return NextResponse.redirect(loginUrl);
    }
  }

  // Auth routes: /login and /register
  if (pathname === '/login' || pathname === '/register') {
    if (token) {
      // User is authenticated, redirect to dashboard
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

// Specify the paths this middleware should apply to
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (public images folder)
     * - manifest.json (PWA manifest)
     * - robots.txt (SEO)
     * - sitemap.xml (SEO)
     *
     * And apply to:
     * - /dashboard and its children
     * - /login
     * - /register
     */
    '/dashboard/:path*',
    '/login',
    '/register',
  ],
};
