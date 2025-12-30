import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import Script from "next/script";
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
    "Professional AI agent system for business automation.",
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
      "Professional AI agent system for business automation.",
    url: "https://www.ailinkxin.com",
    siteName: "AILINKXIN Automation Services",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://www.ailinkxin.com/og-image", // 动态生成的 OG 图片
        width: 1200,
        height: 630,
        alt: "AILINKXIN - AI Agent System",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AILINKXIN | AI Agent System | Intelligent Automation Services",
    description:
      "Professional AI agent system for business automation.",
    images: ["https://www.ailinkxin.com/og-image"], // 动态生成的 OG 图片
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} min-h-screen font-sans antialiased`}>
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-JWMKJG8QR0"
          strategy="afterInteractive"
        />
        <Script id="ga-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-JWMKJG8QR0');
          `}
        </Script>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}


