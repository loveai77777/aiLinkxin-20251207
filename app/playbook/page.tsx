import Link from "next/link";
import { createSeoMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { createSupabaseClient } from "@/lib/supabaseClient";
import PlaybookCard, { type PlaybookCardData } from "@/components/playbook/PlaybookCard";
import PlaybookBrowseClient from "./PlaybookBrowseClient";
import { getPublishedPlaybooks } from "@/lib/playbooks-db";

// Force dynamic rendering to ensure fresh data from Supabase
export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = createSeoMetadata({
  title: "AI Playbook",
  description:
    "Practical guides and tutorials to help you master AI automation and business optimization step by step.",
  keywords: ["AI automation", "playbook", "tutorials", "workflow design"],
});

// Fetch filter data (categories and tags) from Supabase
async function getFilterData(): Promise<{
  categories: string[];
  tags: string[];
}> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return { categories: [], tags: [] };
  }

  const supabase = createSupabaseClient();

  // Fetch all categories
  const { data: categoriesData } = await supabase
    .from("playbook_categories")
    .select("name")
    .order("name");

  // Fetch all tags
  const { data: tagsData } = await supabase
    .from("tags")
    .select("label")
    .order("label");

  return {
    categories: categoriesData?.map((c) => c.name) || [],
    tags: tagsData?.map((t) => t.label) || [],
  };
}

export default async function PlaybookPage() {
  const playbooks = await getPublishedPlaybooks();
  const filterData = await getFilterData();

  // Fetch category names for playbooks
  const supabase = createSupabaseClient();
  const playbookIds = playbooks.map((p) => p.id);
  
  // Get category_id for each playbook
  const { data: playbooksWithCategories } = await supabase
    .from("playbooks")
    .select("id, category_id, playbook_categories!category_id(name)")
    .in("id", playbookIds);

  // Create a map of playbook_id -> category_name
  const categoryMap = new Map<number, string | null>();
  if (playbooksWithCategories) {
    playbooksWithCategories.forEach((p: any) => {
      const category = p.playbook_categories as unknown as { name: string } | { name: string }[] | null;
      const categoryName = Array.isArray(category) ? category[0]?.name : category?.name;
      categoryMap.set(p.id, categoryName || null);
    });
  }

  // Add category to playbooks
  const playbooksWithCategory = playbooks.map((playbook) => ({
    ...playbook,
    categoryName: categoryMap.get(playbook.id) || null,
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:py-16">
      {/* Main Content */}
      <div className="mt-4 md:mt-8">
        {/* Hero Section */}
        <section className="py-6 md:py-12 mb-6 md:mb-12">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 text-white">
              AILINKXIN PLAYBOOK
            </h1>
            <p className="text-sm md:text-lg text-gray-400 max-w-2xl mx-auto px-2">
              Practical guides and tutorials to help you master AI automation
              and business optimization step by step.
            </p>
          </div>
        </section>


        {/* Browse and Filter Client Component */}
        <PlaybookBrowseClient
          initialPlaybooks={playbooksWithCategory}
          dbCategories={filterData.categories}
          dbTags={filterData.tags}
        />
      </div>
    </div>
  );
}
