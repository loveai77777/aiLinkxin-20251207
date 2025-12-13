import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isAdminPath = pathname.startsWith("/admin");
  const isLoginPath = pathname === "/admin/login";
  const isApiLoginPath = pathname === "/api/admin/login";
  const isApiLogoutPath = pathname === "/api/admin/logout";
  const isLogoutPath = pathname === "/admin/logout";

  // Not an admin path - allow through
  if (!isAdminPath) {
    return NextResponse.next();
  }

  // Allow API routes - do not redirect API calls
  const isApiAdminPath = pathname.startsWith("/api/admin");
  if (isApiLoginPath || isApiLogoutPath || isApiAdminPath) {
    return NextResponse.next();
  }

  // Check authentication using admin_auth cookie
  const adminAuth = request.cookies.get("admin_auth")?.value;
  const isAuthenticated = adminAuth === "1";

  // Handle /admin/login
  if (isLoginPath) {
    if (isAuthenticated) {
      // Already logged in - redirect to dashboard
      return NextResponse.redirect(new URL("/admin", request.url));
    } else {
      // Not logged in - allow login page
      return NextResponse.next();
    }
  }

  // Handle /admin/logout and API logout
  if (isLogoutPath) {
    return NextResponse.next();
  }

  // Handle other /admin/* paths
  if (!isAuthenticated) {
    // Not authenticated - redirect to login
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  // Authenticated - allow through
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};


