"use client";

import { useState } from "react";

export default function LoginForm({ nextPath }: { nextPath: string }) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    try {
      const r = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, next: nextPath }),
      });

      if (!r.ok) {
        const data = await r.json().catch(() => ({}));
        throw new Error(data?.message || "Login failed");
      }

      // 登录成功：跳回 next
      window.location.href = nextPath || "/admin";
    } catch (e: any) {
      setErr(e?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: "80px auto", padding: 16 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>
        Admin Login
      </h1>

      <form onSubmit={onSubmit}>
        <label style={{ display: "block", marginBottom: 8 }}>
          Password
        </label>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter admin password"
          style={{
            width: "100%",
            padding: "10px 12px",
            borderRadius: 8,
            border: "1px solid #ccc",
            marginBottom: 12,
          }}
        />

        {err ? (
          <div style={{ color: "crimson", marginBottom: 12 }}>{err}</div>
        ) : null}

        <button
          type="submit"
          disabled={loading || !password.trim()}
          style={{
            width: "100%",
            padding: "10px 12px",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
          }}
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <div style={{ marginTop: 12, fontSize: 12, opacity: 0.7 }}>
        After login, you will be redirected to: <code>{nextPath}</code>
      </div>
    </div>
  );
}
