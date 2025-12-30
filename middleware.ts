import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 允许访问登录页，避免死循环
  if (pathname === "/admin/login" || pathname.startsWith("/admin/login")) {
    const res = NextResponse.next();
    res.headers.set("x-admin-mw", "1");
    return res;
  }

  // 检查 cookie "admin_auth" 是否存在
  const adminAuth = request.cookies.get("admin_auth")?.value;

  // 未登录：重定向到登录页
  if (!adminAuth) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("next", pathname + request.nextUrl.search);

    const res = NextResponse.redirect(url);
    res.headers.set("x-admin-mw", "1");
    return res;
  }

  // 已登录：放行
  const res = NextResponse.next();
  res.headers.set("x-admin-mw", "1");
  return res;
}

export const config = {
  matcher: ["/admin/:path*"],
};
