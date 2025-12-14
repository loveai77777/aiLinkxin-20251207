import { createSeoMetadata } from "@/lib/seo";
import ContactForm from "@/components/contact/ContactForm";
import type { Metadata } from "next";

export const metadata: Metadata = createSeoMetadata({
  title: "联系我们",
  description: "与我们取得联系，获取专业咨询和定制化解决方案。",
  keywords: ["联系", "咨询", "支持"],
});

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8 md:py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 items-start">
          {/* Left Section - Text Content */}
          <div className="flex flex-col space-y-4 sm:space-y-6">
            {/* "Get in touch" Badge */}
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 bg-white rounded-full border border-gray-200 shadow-sm w-fit">
              <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-pink-500 rounded-full"></div>
              <span className="text-xs sm:text-sm font-medium text-gray-700">Get in touch</span>
            </div>

            {/* Main Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Get started with our plan
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed">
              Enter your details, and our team will reach out to design a custom plan tailored to your needs.
            </p>
          </div>

          {/* Right Section - Form Card */}
          <div className="w-full">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}













