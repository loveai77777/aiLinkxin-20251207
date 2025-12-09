export interface Service {
  slug: string;
  name: string;
  summary: string;
  description?: string;
  target: string[];
  keywords: string[];
  category: string;
}

export const SERVICES: Service[] = [
  {
    slug: "ai-frontdesk",
    name: "AI Front Desk & Multilingual Support",
    summary: "24/7 AI receptionist and automated booking system for beauty salons and local businesses.",
    description:
      "Build a 24/7 intelligent front desk system for your business using advanced AI technology. Supports multilingual communication, automatically handles bookings, inquiries, and common questions, significantly improving customer experience and operational efficiency.",
    target: ["Beauty salons", "spa", "local business"],
    keywords: ["AI customer service", "Automated booking", "Multilingual front desk"],
    category: "ai-automation",
  },
  {
    slug: "ai-marketing-assistant",
    name: "AI Marketing Assistant",
    summary: "Intelligent content creation and marketing automation tools to grow your brand visibility.",
    target: ["Small and medium businesses", "Entrepreneurs", "Marketing teams"],
    keywords: ["Content marketing", "Automation", "AI content creation"],
    category: "ai-automation",
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return SERVICES.find((service) => service.slug === slug);
}

export function getAllServices(): Service[] {
  return SERVICES;
}




