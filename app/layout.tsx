import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.ailinkxin.com"), // change to your real domain if needed
  title: {
    // default: "新流 | 内容与服务网站",
    default:
      "AILINKXIN AI Automation Services | AI Customer Support & Marketing Automation",
    // template: "%s | 新流",
    template: "%s | AILINKXIN Enterprise AI Automation Services",
  },
  // description: "提供专业的 AI 自动化解决方案和实用内容指南。",
  description:
    "AILINKXIN | AI automation | intelligent customer service | automated marketing solutions.",
  // keywords: ["AI", "自动化", "服务", "内容"],
  keywords: [
    "AI automation",
    "n8n workflows",
    "automated marketing",
    "AI customer support",
  ],
  openGraph: {
    // title: "新流 | 内容与服务网站",
    title:
      "AILINKXIN | AI marketing automation | intelligent customer service",
    // same idea as description above
    description:
      "AILINKXIN | AI automation | intelligent customer service | automated marketing solutions.",
    url: "/",
    // siteName: "新流",
    siteName: "AILINKXIN Automation Services",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} bg-white text-gray-900 min-h-screen font-sans antialiased`}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}


