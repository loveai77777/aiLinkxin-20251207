import { createSeoMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = createSeoMetadata({
  title: "AI Front Desk for Hair Salons",
  description: "24/7 AI receptionist and booking assistant for hair salons and styling studios. Try our demo AI front desk agent.",
  keywords: ["AI front desk", "hair salon", "AI receptionist", "booking assistant", "salon automation"],
});

export default function HairSalonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}









