import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // This function runs only if the user is authenticated
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Check if user is trying to access dashboard routes
        if (req.nextUrl.pathname.startsWith('/dashboard')) {
          // Allow access only if user has a token (is authenticated)
          return !!token;
        }
        // Allow access to all other routes
        return true;
      },
    },
    pages: {
      signIn: '/login',
    },
  }
);

export const config = {
  matcher: ['/dashboard/:path*']
};
