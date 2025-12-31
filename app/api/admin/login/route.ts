import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export const runtime = "nodejs"; // 确保在 Node 环境跑 bcrypt

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const password = (body?.password || "").toString();

    if (!password.trim()) {
      return NextResponse.json({ error: "Missing password" }, { status: 400 });
    }

    const hash = process.env.ADMIN_PASSWORD_HASH;
    if (!hash) {
      // 不要输出 hash 本身
      return NextResponse.json(
        { error: "Server missing ADMIN_PASSWORD_HASH" },
        { status: 500 }
      );
    }

    const ok = await bcrypt.compare(password, hash);
    if (!ok) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const res = NextResponse.json({ ok: true });

    // 设置登录 cookie（middleware 会检查这个）
    res.cookies.set("admin_auth", "1", {
      httpOnly: true,
      secure: true, // 线上 https 必须
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 14, // 14 天
    });

    return res;
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
