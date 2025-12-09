// app/page.tsx

import Link from "next/link";
import SoundWaveAnimation from "@/components/SoundWaveAnimation";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden text-slate-50 font-sans">
      {/* Full-screen dark gradient background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-[#05030d] via-[#080019] to-[#1a0730]" />

      <div className="mx-auto flex max-w-6xl flex-col gap-10 sm:gap-12 md:gap-16 px-4 sm:px-6 pt-6 sm:pt-8 pb-12 sm:pb-16 md:pt-10 md:pb-20">
        {/* HERO */}
        <section className="relative">
          {/* Purple glow behind hero card */}
          <div className="pointer-events-none absolute -inset-x-24 -top-32 -z-10 h-80 bg-[radial-gradient(circle_at_top,_rgba(168,85,247,0.35),_transparent_60%)] blur-3xl" />

          <div className="px-4 sm:px-6 py-8 sm:py-10 md:px-12 md:py-14">
            <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-purple-300">
              AILINKXIN • AI AGENTS
            </p>
            <h1 className="mt-2 sm:mt-3 text-2xl sm:text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">
              AI front desks and agents that actually run your business
            </h1>

            <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
              {/* Primary green 3D glowing button */}
              <Link
                href="/contact"
                prefetch={true}
                className="inline-flex items-center justify-center rounded-full
                           bg-[#38FF00]
                           px-5 sm:px-7 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-black
                           shadow-[0_14px_32px_rgba(56,255,0,0.6)]
                           ring-1 ring-[#38FF00]/50
                           transition-all duration-200
                           hover:-translate-y-[2px]
                           hover:shadow-[0_0_40px_rgba(56,255,0,0.8)]
                           active:translate-y-[0.5px] active:scale-95
                           active:shadow-[0_10px_24px_rgba(56,255,0,0.5)]
                           pointer-events-auto relative z-10 touch-manipulation
                           min-h-[44px] sm:min-h-[48px]"
                style={{ WebkitTapHighlightColor: "transparent" }}
              >
                Talk to an AI front desk expert
              </Link>

              {/* Secondary purple 3D glowing button */}
              <Link
                href="/solutions"
                prefetch={true}
                className="inline-flex items-center justify-center rounded-full
                           bg-gradient-to-b from-purple-400 via-purple-500 to-purple-700
                           px-5 sm:px-7 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-slate-50
                           shadow-[0_14px_32px_rgba(168,85,247,0.85)]
                           ring-1 ring-purple-300/80
                           transition-all duration-200
                           hover:-translate-y-[2px]
                           hover:shadow-[0_0_40px_rgba(168,85,247,0.95)]
                           active:translate-y-[0.5px] active:scale-95
                           active:shadow-[0_10px_24px_rgba(168,85,247,0.6)]
                           pointer-events-auto relative z-10 touch-manipulation
                           min-h-[44px] sm:min-h-[48px]"
                style={{ WebkitTapHighlightColor: "transparent" }}
              >
                See live AI assistant demo
              </Link>
            </div>

            {/* Sound Wave Animation */}
            <div className="mt-10 sm:mt-12 md:mt-16">
              <SoundWaveAnimation />
            </div>
          </div>
        </section>

        {/* WHAT WE BUILD */}
        <section className="space-y-4 sm:space-y-6">
          <div className="space-y-1.5 sm:space-y-2">
            <h2 className="text-lg sm:text-xl font-bold md:text-2xl">
              What we build for clients
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 md:text-base leading-relaxed">
              Practical AI agents that handle reception, booking and content so
              your team can stay focused on high-value work.
            </p>
          </div>

          <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
            {/* Card 1 */}
            <div className="flex flex-col rounded-xl sm:rounded-2xl border border-purple-300/30 bg-white/5 p-4 sm:p-6 shadow-[0_18px_55px_rgba(0,0,0,0.9)] backdrop-blur-xl relative">
              <h3 className="text-base sm:text-lg font-bold text-purple-100">
                AI Front Desk &amp; Multilingual Support
              </h3>
              <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-slate-200 leading-relaxed">
                24/7 AI receptionist for calls, SMS and web chat. Greets
                visitors, answers FAQs, captures leads and books appointments in
                multiple languages.
              </p>
              <Link
                href="/solutions"
                className="mt-3 sm:mt-4 inline-flex text-xs sm:text-sm font-semibold text-purple-200 hover:text-purple-100 relative z-20 cursor-pointer touch-manipulation active:scale-95"
                style={{ WebkitTapHighlightColor: "transparent" }}
              >
                View details →
              </Link>
            </div>

            {/* Card 2 */}
            <div className="flex flex-col rounded-xl sm:rounded-2xl border border-purple-300/30 bg-white/5 p-4 sm:p-6 shadow-[0_18px_55px_rgba(0,0,0,0.9)] backdrop-blur-xl relative">
              <h3 className="text-base sm:text-lg font-bold text-purple-100">
                AI Marketing Assistant
              </h3>
              <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-slate-200 leading-relaxed">
                An AI assistant that turns your notes, call summaries and ideas
                into ready-to-send campaigns and posts — in your brand voice.
              </p>
              <Link
                href="/solutions"
                className="mt-3 sm:mt-4 inline-flex text-xs sm:text-sm font-semibold text-purple-200 hover:text-purple-100 relative z-20 cursor-pointer touch-manipulation active:scale-95"
                style={{ WebkitTapHighlightColor: "transparent" }}
              >
                View details →
              </Link>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="space-y-4 sm:space-y-6">
          <div className="space-y-1.5 sm:space-y-2">
            <h2 className="text-lg sm:text-xl font-bold md:text-2xl">
              How working with AILINKXIN feels
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 md:text-base leading-relaxed">
              A simple, guided process from first idea to live AI agents.
            </p>
          </div>
          <div className="grid gap-3 sm:gap-4 md:grid-cols-3">
            {[
              {
                step: "1",
                title: "Discover & map your flows",
                body:
                  "We review your website, booking process and customer questions, and map where an AI agent can help today.",
              },
              {
                step: "2",
                title: "We design & configure your agents",
                body:
                  "We design the conversation, connect your calendar/CRM and tools, and test it end-to-end as if we were your receptionist.",
              },
              {
                step: "3",
                title: "Go live, then improve together",
                body:
                  "We launch under your brand, monitor real conversations and refine the agent with you over time.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-xl sm:rounded-2xl border border-white/15 bg-white/5 p-4 sm:p-5 shadow-[0_18px_55px_rgba(0,0,0,0.85)] backdrop-blur-xl"
              >
                <div className="mb-2 sm:mb-3 inline-flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-purple-500/85 text-[10px] sm:text-xs font-bold text-slate-950">
                  {item.step}
                </div>
                <h3 className="text-xs sm:text-sm font-bold md:text-base">
                  {item.title}
                </h3>
                <p className="mt-1.5 sm:mt-2 text-[11px] sm:text-xs text-slate-200 md:text-sm leading-relaxed">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="mb-4 rounded-2xl sm:rounded-3xl border border-purple-300/40 bg-gradient-to-r from-purple-600/60 via-purple-500/50 to-[#38FF00]/50 p-[1px] shadow-[0_26px_80px_rgba(0,0,0,0.95)]">
          <div className="flex flex-col items-start justify-between gap-4 rounded-2xl sm:rounded-3xl bg-slate-950/85 px-4 sm:px-6 py-5 sm:py-6 backdrop-blur-xl md:flex-row md:items-center md:px-10 md:py-8">
            <div>
              <h2 className="text-base sm:text-lg font-bold md:text-xl">
                Ready to explore your own AI front desk?
              </h2>
              <p className="mt-1.5 sm:mt-2 max-w-xl text-xs sm:text-sm text-slate-200 leading-relaxed">
                Share your website and booking process. We&apos;ll suggest a simple
                AI agent that you can launch first — and show you how it can
                grow with you.
              </p>
            </div>

            {/* Bottom CTA uses the same green 3D button style */}
            <Link
              href="/contact"
              prefetch={true}
              className="inline-flex items-center justify-center rounded-full
                         bg-[#38FF00]
                         px-5 sm:px-7 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-black
                         shadow-[0_14px_32px_rgba(56,255,0,0.6)]
                         ring-1 ring-[#38FF00]/50
                         transition-all duration-200
                         hover:-translate-y-[2px]
                         hover:shadow-[0_0_40px_rgba(56,255,0,0.8)]
                         active:translate-y-[0.5px] active:scale-95
                         active:shadow-[0_10px_24px_rgba(56,255,0,0.5)]
                         pointer-events-auto relative z-10 touch-manipulation w-full sm:w-auto
                         min-h-[44px] sm:min-h-[48px] justify-center"
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              Send us your website
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
