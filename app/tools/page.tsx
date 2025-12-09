import Link from "next/link";
import { createSeoMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = createSeoMetadata({
  title: "Tools & Resources",
  description:
    "Curated tools, apps, and products for AI automation, AI front desk, and online business.",
  keywords: ["tools", "resources", "affiliate", "AI automation"],
});

// TypeScript type matching future Supabase schema
export type Tool = {
  id: string;
  name: string;
  category: string;
  summary: string;
  affiliateUrl: string;
  logoUrl?: string;
  priority: number;
  isFeatured?: boolean;
  isActive: boolean;
};

// TODO: Replace with Supabase query
const tools: Tool[] = [
  {
    id: "1",
    name: "Dify",
    category: "AI Front Desk",
    summary: "Open-source AI application platform for building custom AI assistants and workflows.",
    affiliateUrl: "https://dify.ai?ref=ailinkxin",
    priority: 10,
    isFeatured: true,
    isActive: true,
  },
  {
    id: "2",
    name: "Zapier",
    category: "Automation",
    summary: "Connect your apps and automate workflows without coding.",
    affiliateUrl: "https://zapier.com?ref=ailinkxin",
    priority: 9,
    isActive: true,
  },
  {
    id: "3",
    name: "OpenAI API",
    category: "AI Front Desk",
    summary: "Access to GPT models and embeddings for building AI-powered features.",
    affiliateUrl: "https://openai.com?ref=ailinkxin",
    priority: 8,
    isActive: true,
  },
  {
    id: "4",
    name: "Calendly",
    category: "Automation",
    summary: "Automated scheduling tool that eliminates back-and-forth emails for appointments.",
    affiliateUrl: "https://calendly.com?ref=ailinkxin",
    priority: 7,
    isActive: true,
  },
  {
    id: "5",
    name: "HubSpot CRM",
    category: "CRM",
    summary: "Free CRM with powerful automation and marketing tools built-in.",
    affiliateUrl: "https://hubspot.com?ref=ailinkxin",
    priority: 6,
    isActive: true,
  },
  {
    id: "6",
    name: "Notion",
    category: "Learning",
    summary: "All-in-one workspace for notes, docs, databases, and team collaboration.",
    affiliateUrl: "https://notion.so?ref=ailinkxin",
    priority: 5,
    isActive: true,
  },
];

// TODO: Replace with Supabase query
const mockFilters = {
  categories: [
    "AI Front Desk",
    "Automation",
    "Website & Chat",
    "CRM",
    "Learning",
    "Hardware",
  ],
  tags: [
    "spa",
    "budget-friendly",
    "no-code",
    "popular",
    "free-tier",
    "API",
    "integrations",
    "booking",
    "scheduling",
    "developer-friendly",
    "all-in-one",
    "productivity",
    "documentation",
  ],
};

export default function ToolsPage() {
  // TODO: Replace mock data with Supabase queries
  const filterData = mockFilters;
  
  // Filter active tools and sort by priority
  const activeTools = tools
    .filter((t) => t.isActive)
    .sort((a, b) => b.priority - a.priority);

  return (
    <main className="min-h-screen bg-pink-50 text-slate-800 w-full">
      {/* Hero Section */}
      <section className="py-12 sm:py-16 w-full">
        <div className="w-full text-center">
          {/* Eyebrow */}
          <div className="mb-6">
            <span className="inline-block px-4 py-1.5 bg-pink-100 text-pink-500 text-xs font-semibold rounded-full border border-white">
              Curated tools & resources
            </span>
          </div>

          {/* H1 */}
          <h1 className="text-3xl sm:text-4xl font-semibold mb-6 text-slate-800">
            Tools & Resources for AI Automation
          </h1>

          {/* Body Text */}
          <div className="space-y-3 text-sm sm:text-base text-slate-600 w-full">
            <p>
              These are personally selected tools for AI automation and AI front desk solutions.
            </p>
            <p>
              Our goal is to save you time and reduce trial-and-error by sharing tools we actually use and trust.
            </p>
            <p>
              Some links are affiliate links, but our recommendations stay honest—we only share what we believe will help you.
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="border-t border-white bg-white/50 w-full">
        <div className="w-full py-8 space-y-6">
          {/* Categories */}
          <div>
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Categories
            </h2>
            <div className="flex flex-wrap gap-2">
              {filterData.categories.map((category) => (
                <button
                  key={category}
                  // TODO: Add filtering logic on click
                  className="rounded-full border border-white bg-white px-3 py-1 text-xs font-medium text-slate-600 hover:border-pink-300 hover:text-pink-500 transition-colors"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Tags
            </h2>
            <div className="flex flex-wrap gap-2">
              {filterData.tags.map((tag) => (
                <button
                  key={tag}
                  // TODO: Add filtering logic on click
                  className="rounded-full border border-white bg-white px-2.5 py-1 text-xs font-medium text-slate-600 hover:border-pink-300 hover:text-pink-500 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tools Grid Section */}
      <section className="py-12 w-full">
        <div className="w-full">
          {/* Header with Title and Search */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
            <h2 className="text-2xl font-semibold text-slate-800">All tools & resources</h2>
            <input
              type="text"
              placeholder="Search tools..."
              // TODO: Add search functionality
              className="w-full sm:w-auto sm:max-w-xs px-4 py-2 bg-white border border-white rounded-lg text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:border-pink-300 transition-colors"
            />
          </div>

          {/* Grid */}
          {activeTools.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500">No tools available yet.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {activeTools.map((tool) => (
                <div
                  key={tool.id}
                  className="flex flex-col rounded-xl border border-white bg-white/80 px-4 py-3 shadow-sm hover:shadow-md hover:border-pink-200 transition"
                >
                  {/* Top Row: Category Badge */}
                  <div className="flex items-start justify-between mb-2">
                    <span className="inline-flex items-center rounded-full bg-pink-100 px-2 py-0.5 text-[10px] font-medium text-slate-700">
                      {tool.category}
                    </span>
                  </div>

                  {/* Main Content */}
                  <div className="space-y-2 flex-grow mb-3">
                    {/* Logo (if exists) */}
                    {tool.logoUrl && (
                      <div className="mb-2">
                        <img
                          src={tool.logoUrl}
                          alt={tool.name}
                          className="h-8 w-auto object-contain"
                        />
                      </div>
                    )}

                    {/* Name */}
                    <h3 className="text-sm font-semibold text-slate-800">
                      {tool.name}
                    </h3>

                    {/* Summary */}
                    <p className="mt-1 line-clamp-2 text-xs text-slate-600 leading-relaxed">
                      {tool.summary}
                    </p>
                  </div>

                  {/* Bottom Row: Button */}
                  <div className="pt-2 border-t border-white flex items-center justify-end">
                    <a
                      href={tool.affiliateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center rounded-full bg-pink-400 px-3 py-1 text-[11px] font-semibold text-white hover:bg-pink-300 transition-colors"
                    >
                      Visit website
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Disclaimer & FAQ Section */}
      <section className="border-t border-white bg-white/50 w-full">
        <div className="w-full py-10 space-y-6">
          {/* Disclaimer */}
          <div className="space-y-3 text-sm text-slate-600">
            <p>
              Some links on this page are affiliate links. This means if you click through and make a purchase,
              we may receive a small commission at no extra cost to you.
            </p>
            <p>
              We only recommend tools and resources that we genuinely believe are helpful and that we have
              personally used or thoroughly researched.
            </p>
          </div>

          {/* FAQ */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-slate-800">Frequently Asked Questions</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-slate-800 mb-2">
                  Do you get paid for these recommendations?
                </h3>
                <p className="text-xs text-slate-600">
                  Some links are affiliate links, which means we may earn a small commission if you make a purchase.
                  This comes at no additional cost to you and helps us maintain this resource library.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-800 mb-2">
                  Will you recommend tools only because of commissions?
                </h3>
                <p className="text-xs text-slate-600">
                  No. We only include tools we genuinely use, trust, and believe will help you. Our reputation
                  depends on honest recommendations, not quick commissions.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-800 mb-2">
                  What if I'm on a tight budget?
                </h3>
                <p className="text-xs text-slate-600">
                  Many tools we recommend offer free tiers or affordable starter plans. We always note pricing
                  information and highlight budget-friendly options when available.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-800 mb-2">
                  How often do you update this list?
                </h3>
                <p className="text-xs text-slate-600">
                  We regularly review and update our recommendations based on new tools, changes in pricing,
                  and our own experience using these products.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
