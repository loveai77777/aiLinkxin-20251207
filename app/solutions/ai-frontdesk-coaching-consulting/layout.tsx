import { createSeoMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = createSeoMetadata({
  title: "AI Front Desk for Coaching & Consulting",
  description: "AI assistant to screen leads, answer common questions, and schedule sessions for coaches and consultants. Try our demo AI front desk agent.",
  keywords: ["AI front desk", "coaching consulting", "AI receptionist", "lead screening", "consulting automation"],
});

export default function CoachingConsultingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}








