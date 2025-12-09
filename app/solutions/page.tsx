import Link from "next/link";
import { createSeoMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = createSeoMetadata({
  title: "服务",
  description: "探索我们的 AI 自动化解决方案，帮助您的业务更高效、更智能。",
  keywords: ["AI 自动化", "服务", "解决方案"],
});

export default function SolutionsPage() {
  return (
    <article className="min-h-screen bg-white py-8 sm:py-12 md:py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          {/* Left Side - Text Content */}
          <div className="flex flex-col space-y-4 sm:space-y-6">
            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              AI Receptionist
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed">
              24/7 intelligent customer service that handles calls, answers questions, and captures leads.
            </p>

            {/* CTA Button */}
            <div className="flex items-center gap-4">
              <Link
                href="/solutions/ai-frontdesk-beauty-spa"
                prefetch={true}
                className="inline-block bg-black text-white font-bold py-2.5 sm:py-3 px-5 sm:px-6 rounded-lg transition-all duration-200 hover:bg-gray-900 active:scale-95 touch-manipulation text-sm sm:text-base min-h-[44px] sm:min-h-[48px] flex items-center justify-center"
                style={{ WebkitTapHighlightColor: "transparent" }}
              >
                Learn more →
              </Link>
            </div>
          </div>

          {/* Right Side - Image */}
          <div className="relative w-full h-[400px] sm:h-[500px] md:h-[600px]">
            <div className="relative w-full h-full rounded-3xl overflow-hidden bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500">
              {/* Placeholder for AI Receptionist image */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <svg
                    className="w-32 h-32 mx-auto mb-4 opacity-80"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <p className="text-xl font-semibold">AI Receptionist</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}













