import Link from "next/link";
import { createSeoMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { createSupabaseClient } from "@/lib/supabaseClient";
import PlaybookNav from "@/components/PlaybookNav";
import PlaybookCard, { type PlaybookCardData } from "@/components/playbook/PlaybookCard";
import PlaybookBrowseClient from "./PlaybookBrowseClient";
import { getPublishedPlaybooks } from "@/lib/playbooks-db";

// Force dynamic rendering to ensure fresh data from Supabase
export const dynamic = "force-dynamic";

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

// Fetch categories with their associated tags
async function getCategoriesWithTags() {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return [];
  }

  const supabase = createSupabaseClient();

  // Fetch all categories
  const { data: categoriesData } = await supabase
    .from("playbook_categories")
    .select("id, name")
    .order("name");

  if (!categoriesData || categoriesData.length === 0) {
    return [];
  }

  // For each category, get playbooks and their tags
  const categoriesWithTags = await Promise.all(
    categoriesData.map(async (category) => {
      // Get playbooks in this category (no status filter)
      const { data: playbooksData } = await supabase
        .from("playbooks")
        .select("id")
        .eq("category_id", category.id);

      if (!playbooksData || playbooksData.length === 0) {
        return { category: category.name, tags: [] };
      }

      const playbookIds = playbooksData.map((p) => p.id);

      // Get tags for these playbooks
      const { data: playbookTagsData } = await supabase
        .from("playbook_tags")
        .select("tag_id, tags!inner(label)")
        .in("playbook_id", playbookIds);

      // Extract unique tags
      const tagLabels = new Set<string>();
      if (playbookTagsData) {
        playbookTagsData.forEach((pt) => {
          const tag = pt.tags as unknown as { label: string } | null;
          if (tag && typeof tag === "object" && "label" in tag) {
            tagLabels.add(String(tag.label));
          }
        });
      }

      return {
        category: category.name,
        tags: Array.from(tagLabels).sort(),
      };
    })
  );

  return categoriesWithTags;
}

export default async function PlaybookPage() {
  const playbooks = await getPublishedPlaybooks();
  const filterData = await getFilterData();
  const categoriesWithTags = await getCategoriesWithTags();

  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      {/* Navigation Bar */}
      <PlaybookNav categoriesWithTags={categoriesWithTags} />

      {/* Main Content */}
      <div className="mt-8">
        {/* Hero Section */}
        <section className="py-12 mb-12">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              AILINKXIN PLAYBOOK
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Practical guides and tutorials to help you master AI automation
              and business optimization step by step.
            </p>
          </div>
        </section>


        {/* Browse and Filter Client Component */}
        <PlaybookBrowseClient
          initialPlaybooks={playbooks}
          dbCategories={filterData.categories}
          dbTags={filterData.tags}
        />
      </div>
    </div>
  );
}
