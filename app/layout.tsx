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
  metadataBase: new URL("https://www.ailinkxin.com"),
  title: {
    default:
      "AILINKXIN AI Automation Services | AI Customer Support & Marketing Automation",
    template: "%s | AILINKXIN Enterprise AI Automation Services",
  },
  description:
    "Professional AI agent system for intelligent customer service, automated marketing, and business automation solutions.",
  keywords: [
    "AI agent system",
    "AI automation",
    "AI customer support",
    "automated marketing",
    "intelligent agents",
    "business automation",
  ],
  openGraph: {
    title: "AILINKXIN | AI Agent System | Intelligent Automation Services",
    description:
      "Professional AI agent system for intelligent customer service, automated marketing, and business automation solutions.",
    url: "https://www.ailinkxin.com",
    siteName: "AILINKXIN Automation Services",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://www.ailinkxin.com/og-image.png", // 替换为你的 logo 图片 URL
        width: 1200,
        height: 630,
        alt: "AILINKXIN - AI Automation Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AILINKXIN | AI Agent System | Intelligent Automation Services",
    description:
      "Professional AI agent system for intelligent customer service, automated marketing, and business automation solutions.",
    images: ["https://www.ailinkxin.com/og-image.png"], // 替换为你的 logo 图片 URL
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


