import { createSeoMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = createSeoMetadata({
  title: "AI Front Desk for Massage & Wellness",
  description: "24/7 AI receptionist for massage, wellness, and holistic therapy studios. Try our demo AI front desk agent.",
  keywords: ["AI front desk", "massage wellness", "AI receptionist", "booking assistant", "wellness automation"],
});

export default function MassageWellnessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}


















