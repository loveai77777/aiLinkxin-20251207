import Link from "next/link";
import { createSeoMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = createSeoMetadata({
  title: "AI Playbook",
  description:
    "Practical guides and tutorials to help you master AI automation and business optimization step by step.",
  keywords: ["AI automation", "playbook", "tutorials", "workflow design"],
});

// TypeScript types matching future Supabase schema
export type Playbook = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: string;
  tags: string[];
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  timeEstimate: string;
  tools: string[];
  createdAt: string; // formatted date string
};

export type PlaybookFilterData = {
  categories: string[];
  tags: string[];
};

// TODO: Replace with Supabase query
const mockPlaybooks: Playbook[] = [
  {
    id: "1",
    slug: "ai-frontdesk-setup",
    title: "Setting Up Your AI Front Desk",
    summary: "Learn how to configure and deploy an AI-powered front desk system that handles customer inquiries 24/7. This guide covers everything from initial setup to advanced customization options.",
    category: "AI Automation",
    tags: ["front-desk", "customer-service", "automation", "beginner"],
    difficulty: "Beginner",
    timeEstimate: "20 min",
    tools: ["Dify", "OpenAI", "Zapier"],
    createdAt: "January 15, 2024",
  },
  {
    id: "2",
    slug: "whatsapp-bot-integration",
    title: "Building a WhatsApp Business Bot",
    summary: "Step-by-step tutorial on creating an intelligent WhatsApp bot that can handle customer conversations, schedule appointments, and provide instant support for your business.",
    category: "Messaging",
    tags: ["whatsapp", "chatbot", "messaging", "intermediate"],
    difficulty: "Intermediate",
    timeEstimate: "35 min",
    tools: ["Twilio", "OpenAI", "WhatsApp API"],
    createdAt: "January 10, 2024",
  },
  {
    id: "3",
    slug: "website-chatbot-deployment",
    title: "Deploying a Website Chatbot",
    summary: "Complete guide to embedding an AI chatbot on your website. Learn how to customize the bot's appearance, train it with your business knowledge, and integrate it with your existing tools.",
    category: "Web Integration",
    tags: ["chatbot", "website", "integration", "advanced"],
    difficulty: "Advanced",
    timeEstimate: "45 min",
    tools: ["React", "Dify", "Custom API"],
    createdAt: "January 5, 2024",
  },
  {
    id: "4",
    slug: "multilingual-support",
    title: "Implementing Multilingual AI Support",
    summary: "Enable your AI assistant to communicate in multiple languages. This playbook covers language detection, translation workflows, and best practices for international customer support.",
    category: "AI Automation",
    tags: ["multilingual", "translation", "international", "intermediate"],
    difficulty: "Intermediate",
    timeEstimate: "30 min",
    tools: ["OpenAI", "Google Translate API"],
    createdAt: "December 28, 2023",
  },
  {
    id: "5",
    slug: "lead-capture-automation",
    title: "Automated Lead Capture and Qualification",
    summary: "Set up an automated system that captures leads from multiple channels, qualifies them using AI, and routes them to your sales team. Includes CRM integration examples.",
    category: "Sales Automation",
    tags: ["lead-generation", "crm", "automation", "beginner"],
    difficulty: "Beginner",
    timeEstimate: "25 min",
    tools: ["HubSpot", "Zapier", "OpenAI"],
    createdAt: "December 20, 2023",
  },
  {
    id: "6",
    slug: "advanced-workflow-design",
    title: "Advanced Workflow Design Patterns",
    summary: "Master complex AI workflow patterns including conditional logic, multi-step processes, and error handling. Perfect for building sophisticated automation systems.",
    category: "Advanced Topics",
    tags: ["workflows", "automation", "advanced", "patterns"],
    difficulty: "Advanced",
    timeEstimate: "60 min",
    tools: ["Dify", "Custom Scripts", "API"],
    createdAt: "December 15, 2023",
  },
];

// TODO: Replace with Supabase query
const mockFilters: PlaybookFilterData = {
  categories: [
    "AI Automation",
    "Messaging",
    "Web Integration",
    "Sales Automation",
    "Advanced Topics",
  ],
  tags: [
    "front-desk",
    "customer-service",
    "automation",
    "whatsapp",
    "chatbot",
    "messaging",
    "website",
    "integration",
    "multilingual",
    "translation",
    "international",
    "lead-generation",
    "crm",
    "workflows",
    "patterns",
    "beginner",
    "intermediate",
    "advanced",
  ],
};

export default function PlaybookPage() {
  // TODO: Replace mock data with Supabase queries
  const playbooks = mockPlaybooks;
  const filterData = mockFilters;

  return (
    <main className="min-h-screen bg-black text-gray-300">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 text-gray-300">
            AI Playbooks
          </h1>
          <p className="text-2xl md:text-3xl text-gray-400 mb-8 leading-relaxed max-w-2xl mx-auto">
            Step-by-step guides to help you build and deploy AI-powered solutions for your business.
          </p>
          <Link
            href="#all-playbooks"
            className="relative inline-flex items-center gap-2 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 hover:scale-105 active:scale-100"
            style={{
              background: 'linear-gradient(135deg, #065f46 0%, #047857 50%, #059669 100%)',
              boxShadow: `
                0 4px 15px rgba(5, 150, 105, 0.4),
                0 2px 8px rgba(0, 0, 0, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.2),
                inset 0 -1px 0 rgba(0, 0, 0, 0.2)
              `,
            }}
          >
            {/* Glossy highlight overlay */}
            <div
              className="absolute inset-0 rounded-lg pointer-events-none"
              style={{
                background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 50%)',
                borderRadius: '0.5rem',
              }}
            />
            <span className="relative z-10 text-lg">View all playbooks</span>
            <svg
              className="w-5 h-5 relative z-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </Link>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-12 px-4 border-t border-slate-800">
        <div className="max-w-5xl mx-auto">
          {/* Categories */}
          <div className="mb-8">
            <h2 className="text-base font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Categories
            </h2>
            <div className="flex flex-wrap gap-3">
              {filterData.categories.map((category) => (
                <button
                  key={category}
                  // TODO: Add filtering logic on click
                  className="px-4 py-2 bg-slate-950 hover:bg-slate-900 text-gray-300 rounded-full text-base font-medium transition-colors border border-slate-800 hover:border-emerald-500/70"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <h2 className="text-base font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Tags
            </h2>
            <div className="flex flex-wrap gap-2">
              {filterData.tags.map((tag) => (
                <button
                  key={tag}
                  // TODO: Add filtering logic on click
                  className="px-3 py-1.5 bg-slate-950 hover:bg-slate-900 text-gray-400 rounded-full text-sm font-medium transition-colors border border-slate-800 hover:border-emerald-500/70"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* All Playbooks Section */}
      <section id="all-playbooks" className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Search Input */}
          <div className="mb-8">
            <input
              type="text"
              placeholder="Search playbooks..."
              // TODO: Add search functionality
              className="w-full max-w-md px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-gray-300 placeholder-gray-500 focus:outline-none focus:border-emerald-500/70 transition-colors"
            />
          </div>

          {/* Playbooks Grid */}
          {playbooks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-xl">No playbooks available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {playbooks.map((playbook) => (
                <Link
                  key={playbook.id}
                  href={`/playbook/${playbook.slug}`}
                  className="group bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-emerald-500/70 hover:bg-slate-800/50 transition-all duration-200"
                >
                  {/* Header: Category Badge + Created Date */}
                  <div className="flex items-start justify-between mb-4">
                    <span className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-400 text-sm font-semibold rounded-full border border-emerald-500/30">
                      {playbook.category}
                    </span>
                    <time className="text-sm text-gray-400">
                      {playbook.createdAt}
                    </time>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-gray-300 mb-3 group-hover:text-emerald-400 transition-colors">
                    {playbook.title}
                  </h3>

                  {/* Summary */}
                  <p className="text-gray-400 text-base mb-4 line-clamp-3 leading-relaxed">
                    {playbook.summary}
                  </p>

                  {/* Meta Info: Difficulty, Time, Tools */}
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className="flex items-center gap-1.5 text-sm text-gray-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                      {playbook.difficulty}
                    </span>
                    <span className="flex items-center gap-1.5 text-sm text-gray-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {playbook.timeEstimate}
                    </span>
                    {playbook.tools.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {playbook.tools.map((tool) => (
                          <span
                            key={tool}
                            className="px-2 py-0.5 bg-slate-800 text-gray-400 text-sm rounded border border-slate-700"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  {playbook.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-900">
                      {playbook.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-slate-800 text-gray-400 text-sm rounded-full border border-slate-700"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
