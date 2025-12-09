import FrontdeskAgentPlayground from "@/components/FrontdeskAgentPlayground";

export default function CoachingConsultingFrontDeskPage() {
  return (
    <FrontdeskAgentPlayground
      industryId="coaching-consulting"
      title="AI Front Desk for Coaching & Consulting"
      subtitle="AI assistant to screen leads, answer common questions, and schedule sessions for coaches and consultants."
      initialMessage="Hi! I&apos;m your demo AI front-desk agent for a coaching or consulting business. You can ask up to 3 questions about services, pricing, or scheduling to see how I respond."
      chatHeaderTitle="Live demo agent – Coaching & Consulting"
    />
  );
}




