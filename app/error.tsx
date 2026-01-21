"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div style={{ maxWidth: 720, margin: "80px auto", padding: 24 }}>
      <h2 style={{ fontSize: 22, fontWeight: 700 }}>Something went wrong</h2>
      <p style={{ opacity: 0.8, marginTop: 8 }}>
        An unexpected error occurred while rendering this page.
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
        Try again
      </button>
    </div>
  );
}










