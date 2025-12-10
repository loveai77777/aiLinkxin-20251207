import React from "react";

export default function PlaybookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          body {
            background-color: #000000 !important;
          }
          main {
            background-color: #000000 !important;
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
          }
          [data-playbook-layout] {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            font-size: 16px;
            line-height: 1.6;
            letter-spacing: 0;
            color: #ffffff !important;
          }
          [data-playbook-layout] * {
            color: #ffffff !important;
          }
          [data-playbook-layout] h1,
          [data-playbook-layout] h2,
          [data-playbook-layout] h3,
          [data-playbook-layout] h4,
          [data-playbook-layout] h5,
          [data-playbook-layout] h6 {
            line-height: 1.3;
            letter-spacing: -0.01em;
          }
          [data-playbook-layout] p {
            line-height: 1.6;
            letter-spacing: 0;
            margin-bottom: 1rem;
          }
        `
      }} />
      <div className="bg-black text-white min-h-screen w-full" data-playbook-layout>
        {children}
      </div>
    </>
  );
}

