"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function AdminLoginInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const nextPath = useMemo(() => {
    const n = searchParams.get("next");
    // 防止奇怪值，必须以 / 开头
    if (!n || !n.startsWith("/")) return "/admin/playbooks";
    return n;
  }, [searchParams]);

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setErr(data?.error || "Login failed");
        setLoading(false);
        return;
      }

      setOk(true);
      // 成功后跳转到 next
      router.replace(nextPath);
      router.refresh();
    } catch (e: any) {
      setErr(e?.message || "Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-black/30 p-6 shadow-xl">
        <h1 className="text-2xl font-semibold">Admin Login</h1>
        <p className="mt-1 text-sm text-white/70">
          Enter password to access admin.
        </p>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="block text-sm mb-2 text-white/80">Password</label>
            <input
              type="password"
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-white/30"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              placeholder="••••••••"
            />
          </div>

          {err && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {err}
            </div>
          )}

          {ok && (
            <div className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-200">
              Success. Redirecting...
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !password.trim()}
            className="w-full rounded-xl bg-white text-black px-4 py-3 font-medium disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <div className="text-xs text-white/50">
            After login, you will be redirected to:{" "}
            <span className="text-white/70">{nextPath}</span>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <AdminLoginInner />
    </Suspense>
  );
}
