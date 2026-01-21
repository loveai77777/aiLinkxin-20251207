// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

async function sha256Hex(input: string) {
  const enc = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 只保护 /admin/*
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // 放行登录页（避免死循环）
  if (pathname === "/admin/login" || pathname.startsWith("/admin/login/")) {
    return NextResponse.next();
  }

  const adminPassword = process.env.ADMIN_PASSWORD || "";
  const cookie = request.cookies.get("admin_auth")?.value || "";

  if (!adminPassword) {
    // 没配密码时，直接拦到登录（同时也提醒你必须配置 env）
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("next", pathname + request.nextUrl.search);
    return NextResponse.redirect(url);
  }

  const expected = await sha256Hex(adminPassword);

  if (cookie !== expected) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("next", pathname + request.nextUrl.search);

    const res = NextResponse.redirect(url);
    // 方便你 curl -I 看是否命中 middleware
    res.headers.set("X-Admin-Mw", "1");
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

