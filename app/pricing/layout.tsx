import { createSeoMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = createSeoMetadata({
  title: "Pricing",
  description: "View our pricing plans and choose the best option for your needs.",
  keywords: ["pricing", "plans", "pricing"],
});

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
