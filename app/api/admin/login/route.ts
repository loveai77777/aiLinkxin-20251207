// app/api/admin/login/route.ts
import { NextResponse } from "next/server";

async function sha256Hex(input: string) {
  const enc = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function POST(req: Request) {
  const adminPassword = process.env.ADMIN_PASSWORD || "";

  if (!adminPassword) {
    return NextResponse.json(
      { error: "ADMIN_PASSWORD is not set" },
      { status: 500 }
    );
  }

  const body = await req.json().catch(() => null);
  const password = typeof body?.password === "string" ? body.password : "";

  if (!password || password !== adminPassword) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  // cookie 值用 hash（比直接写 1 更好）
  const token = await sha256Hex(adminPassword);

  const res = NextResponse.json({ ok: true });

  // 在开发环境（localhost）中，secure 应该为 false
  const isProduction = process.env.NODE_ENV === "production";
  const isHttps = req.url.startsWith("https://");
  
  res.cookies.set({
    name: "admin_auth",
    value: token,
    httpOnly: true,
    secure: isProduction && isHttps, // 仅在 HTTPS 生产环境中使用 secure
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return res;
}
