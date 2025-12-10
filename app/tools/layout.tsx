import React from "react";

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          body {
            background-color: #fdf2f8 !important;
          }
          main {
            background-color: #fdf2f8 !important;
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
          }
        `
      }} />
      <div className="bg-pink-50 min-h-screen w-full">
        {children}
      </div>
    </>
  );
}

