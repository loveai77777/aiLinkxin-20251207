"use client";

import { useMemo, useState } from "react";

export default function WhatsAppFloatingWidget() {
  const [open, setOpen] = useState(false);

  const greeting = useMemo(() => {
    return `Hi 👋 Thanks for contacting AILINKXIN.

We help small businesses capture more leads and reduce missed calls with AI Receptionist + automation (24/7 responses, lead intake, routing, and follow-ups).

If we don’t reply immediately, please submit our form:
https://www.ailinkxin.com/contact
or email: ailinkxinxin@gmail.com

We’ll get back to you ASAP.`;
  }, []);

  const waLink = useMemo(() => {
    const text = encodeURIComponent(greeting);
    return `https://wa.me/12409376868?text=${text}`;
  }, [greeting]);

  return (
    <>
      {/* Floating Button (always visible) */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 right-6 z-[9999] h-14 w-14 rounded-full shadow-xl bg-[#25D366] hover:brightness-95 active:scale-95 transition grid place-items-center"
      >
        {/* WhatsApp logo (white) */}
        <svg
          width="28"
          height="28"
          viewBox="0 0 32 32"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M16 3C9.37 3 4 8.03 4 14.23c0 2.67 1.03 5.12 2.74 7.02L6 29l7.94-2.02c.96.27 1.99.41 3.06.41 6.63 0 12-5.03 12-11.23C29 8.03 22.63 3 16 3Z"
            fill="#25D366"
          />
          <path
            d="M24.4 18.56c-.12-.2-.43-.32-.9-.56-.47-.24-2.77-1.34-3.2-1.49-.43-.15-.74-.24-1.05.24-.31.48-1.2 1.49-1.47 1.8-.27.31-.54.35-1 .12-.47-.24-1.97-.68-3.75-2.16-1.38-1.15-2.31-2.57-2.58-3.01-.27-.44-.03-.68.2-.9.2-.2.47-.52.7-.78.23-.26.31-.44.47-.73.16-.29.08-.56-.04-.78-.12-.22-1.05-2.55-1.44-3.5-.38-.92-.76-.79-1.05-.8h-.9c-.31 0-.8.12-1.22.56-.42.44-1.6 1.54-1.6 3.77 0 2.23 1.64 4.38 1.86 4.68.23.29 3.23 5.02 7.89 6.85 1.11.43 1.97.69 2.64.88 1.11.31 2.12.27 2.92.16.89-.13 2.77-1.1 3.15-2.15.39-1.05.39-1.95.27-2.15Z"
            fill="#fff"
          />
        </svg>
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-[9999] w-[320px] max-w-[calc(100vw-24px)] rounded-2xl border bg-white shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-black text-white">
            <div className="font-semibold">WhatsApp</div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md px-2 py-1 text-sm bg-white/10 hover:bg-white/20"
            >
              Close
            </button>
          </div>

          <div className="px-4 py-4 text-sm text-gray-700">
            <p className="mb-3">
              Tap below to start a WhatsApp chat (we’ll pre-fill a greeting).
              If we’re offline, please submit the contact form and we’ll reach
              out ASAP.
            </p>

            <div className="flex gap-2">
              <a
                href={waLink}
                target="_blank"
                rel="noreferrer"
                className="flex-1 rounded-xl bg-[#25D366] px-4 py-2 text-center text-white font-semibold hover:brightness-95"
              >
                Open WhatsApp
              </a>

              <a
                href="/contact"
                className="rounded-xl border px-4 py-2 text-center font-semibold hover:bg-gray-50"
              >
                Contact Form
              </a>
            </div>

            <div className="mt-2 text-xs text-gray-500">
              Or email: ailinkxinxin@gmail.com
            </div>
          </div>
        </div>
      )}
    </>
  );
}


