import Link from "next/link";
import { createSeoMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { createSupabaseClient } from "@/lib/supabaseClient";
import PlaybookNav from "@/components/PlaybookNav";
import PlaybookCard, { type PlaybookCardData } from "@/components/playbook/PlaybookCard";
import PlaybookBrowseClient from "./PlaybookBrowseClient";

// Force dynamic rendering to ensure fresh data from Supabase
export const dynamic = "force-dynamic";

export const metadata: Metadata = createSeoMetadata({
  title: "AI Playbook",
  description:
    "Practical guides and tutorials to help you master AI automation and business optimization step by step.",
  keywords: ["AI automation", "playbook", "tutorials", "workflow design"],
});

// Fetch playbooks from Supabase - NO filters, simple query
async function getPlaybooks(): Promise<{
  playbooks: PlaybookCardData[];
  error: string | null;
}> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    console.warn(
      "Supabase environment variables not configured, returning empty playbooks list"
    );
    return { playbooks: [], error: null };
  }

  const supabase = createSupabaseClient();

  // TODO: Add is_featured or sort_order field if available in DB
  const { data, error } = await supabase
    .from("playbooks")
    .select("id, slug, title, excerpt, updated_at, has_affiliate_links, is_featured, sort_order")
    .order("updated_at", { ascending: false });

  // Log both data and error for debugging
  console.log("[playbook] rows:", data?.length);
  console.log("[playbook] error:", error);

  // Check for RLS/permission errors
  const isRLSError =
    error &&
    (error.code === "PGRST116" ||
      error.message?.toLowerCase().includes("permission") ||
      error.message?.toLowerCase().includes("policy") ||
      error.message?.toLowerCase().includes("row-level security") ||
      error.message?.toLowerCase().includes("rls"));

  if (isRLSError) {
    return {
      playbooks: [],
      error: "RLS",
    };
  }

  if (error) {
    console.error("Error fetching playbooks:", error);
    return { playbooks: [], error: error.message || "Unknown error" };
  }

  if (!data || data.length === 0) {
    return { playbooks: [], error: null };
  }

  // Fetch tags for all playbooks (optional, won't break if this fails)
  const playbookIds = data.map((p) => p.id);
  const { data: playbookTagsData, error: tagsError } = await supabase
    .from("playbook_tags")
    .select(
      `
      playbook_id,
      tags!tag_id(id, slug, label)
    `
    )
    .in("playbook_id", playbookIds);

  if (tagsError) {
    console.error("Error fetching tags:", tagsError);
  }

  // Create a map of playbook_id -> tags
  const tagsMap = new Map<
    number,
    { id: number; label: string; slug: string }[]
  >();
  if (playbookTagsData) {
    playbookTagsData.forEach((pt) => {
      const playbookId = pt.playbook_id;
      const tag = pt.tags as unknown as
        | { id: number; slug: string; label: string }
        | null;
      if (
        tag &&
        typeof tag === "object" &&
        "id" in tag &&
        "slug" in tag &&
        "label" in tag
      ) {
        if (!tagsMap.has(playbookId)) {
          tagsMap.set(playbookId, []);
        }
        tagsMap.get(playbookId)!.push({
          id: Number(tag.id),
          label: String(tag.label),
          slug: String(tag.slug),
        });
      }
    });
  }

  // Map data to PlaybookCardData type
  const playbooks: PlaybookCardData[] = data.map((p: any) => {
    return {
      id: p.id,
      slug: p.slug,
      title: p.title,
      summary: p.excerpt || null,
      updatedAt: p.updated_at || null,
      publishedAt: null,
      readingMinutes: null,
      tags: tagsMap.get(p.id) || [],
      hasAffiliateLinks: p.has_affiliate_links || false,
    };
  });

  return { playbooks, error: null };
}

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
  const { playbooks, error } = await getPlaybooks();
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

        {/* RLS Error Warning Banner */}
        {error === "RLS" && (
          <div className="mb-8 mx-auto max-w-3xl">
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
              <p className="text-red-400 font-medium">
                Playbooks cannot be loaded due to access policy (RLS).
              </p>
              <p className="text-red-300/80 text-sm mt-1">
                Please check your Supabase Row Level Security policies for the
                playbooks table.
              </p>
            </div>
          </div>
        )}

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
