import { createSeoMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = createSeoMetadata({
  title: "AI Front Desk for Clinics & Dentists",
  description: "AI assistant for small medical clinics and dental practices to handle patient inquiries and appointment requests. Try our demo AI front desk agent.",
  keywords: ["AI front desk", "clinics dentists", "AI receptionist", "patient assistant", "medical automation"],
});

export default function ClinicsDentistsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}








