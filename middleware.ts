import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 允许访问 /admin/login，避免死循环
  if (pathname === "/admin/login" || pathname.startsWith("/admin/login/")) {
    return NextResponse.next();
  }

  // 检查 cookie "admin_auth" 是否存在
  const adminAuth = request.cookies.get("admin_auth")?.value;

  // 如果 cookie 不存在，重定向到登录页
  if (!adminAuth) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("next", pathname + request.nextUrl.search);
    return NextResponse.redirect(url);
  }

  // 已登录，放行
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
