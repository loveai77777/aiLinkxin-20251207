import { createSeoMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = createSeoMetadata({
  title: "AI Front Desk for Beauty & Spa",
  description: "24/7 AI receptionist and booking assistant for facial and spa studios. Try our demo AI front desk agent.",
  keywords: ["AI front desk", "beauty spa", "AI receptionist", "booking assistant", "spa automation"],
});

export default function BeautySpaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}




