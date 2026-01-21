"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <div style={{ maxWidth: 720, margin: "80px auto", padding: 24 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700 }}>App crashed</h2>
          <p style={{ opacity: 0.8, marginTop: 8 }}>
            A fatal error occurred in the root layout.
          </p>

          <pre
            style={{
              marginTop: 16,
              padding: 12,
              borderRadius: 10,
              background: "#f5f5f5",
              overflow: "auto",
              whiteSpace: "pre-wrap",
            }}
          >
            {String(error?.message || error)}
          </pre>

          <button
            onClick={() => reset()}
            style={{
              marginTop: 16,
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid #ddd",
              cursor: "pointer",
            }}
          >
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}
