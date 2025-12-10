import Link from "next/link";
import { createSeoMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { createSupabaseClient } from "@/lib/supabaseClient";
import PlaybookNav from "@/components/PlaybookNav";

export const metadata: Metadata = createSeoMetadata({
  title: "AI Playbook",
  description:
    "Practical guides and tutorials to help you master AI automation and business optimization step by step.",
  keywords: ["AI automation", "playbook", "tutorials", "workflow design"],
});

// TypeScript type matching Supabase schema
export type PlaybookCard = {
  id: number;
  slug: string;
  title: string;
  summary: string | null;
  categoryName: string | null;
  difficultyLevel: string | null;
  readingMinutes: number | null;
  publishedAt: string | null;
  tags: { id: number; label: string; slug: string }[];
  isHot: boolean;
  isPinned: boolean;
  averageRating: number;
  likeCount: number;
  commentCount: number;
};

export type PlaybookFilterData = {
  categories: string[];
  tags: string[];
};

// Helper function to format date
function formatDate(dateString: string | null): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Helper function to format reading time
function formatReadingTime(minutes: number | null): string {
  if (!minutes) return "";
  return `${minutes} min`;
}

// Fetch playbooks from Supabase
async function getPlaybooks(): Promise<PlaybookCard[]> {
  // Check if Supabase env vars are configured
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.warn("Supabase environment variables not configured, returning empty playbooks list");
    return [];
  }
  
  const supabase = createSupabaseClient();

  // Fetch all published playbooks with category join
  // Using category_id foreign key relationship
  const { data: playbooksData, error: playbooksError } = await supabase
    .from("playbooks")
    .select(
      `
      id,
      slug,
      title,
      summary,
      difficulty_level,
      reading_minutes,
      published_at,
      is_hot,
      is_pinned,
      average_rating,
      like_count,
      comment_count,
      category_id,
      playbook_categories!category_id(name)
    `
    )
    .eq("status", "published")
    .order("is_pinned", { ascending: false })
    .order("is_hot", { ascending: false })
    .order("published_at", { ascending: false, nullsFirst: false });

  if (playbooksError) {
    console.error("Error fetching playbooks:", playbooksError);
    return [];
  }

  if (!playbooksData || playbooksData.length === 0) {
    return [];
  }

  // Fetch tags for all playbooks
  const playbookIds = playbooksData.map((p) => p.id);
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
  const tagsMap = new Map<number, { id: number; label: string; slug: string }[]>();
  if (playbookTagsData) {
    playbookTagsData.forEach((pt) => {
      const playbookId = pt.playbook_id;
      const tag = pt.tags as unknown as { id: number; slug: string; label: string } | null;
      if (tag && typeof tag === 'object' && 'id' in tag && 'slug' in tag && 'label' in tag) {
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

  // Map data to PlaybookCard type
  const playbooks: PlaybookCard[] = playbooksData.map((p: any) => {
    const categoryData = p.playbook_categories as unknown as { name: string } | { name: string }[] | null;
    const category = Array.isArray(categoryData) ? categoryData[0] : categoryData;
    return {
      id: p.id,
      slug: p.slug,
      title: p.title,
      summary: p.summary,
      categoryName: category?.name || null,
      difficultyLevel: p.difficulty_level,
      readingMinutes: p.reading_minutes,
      publishedAt: p.published_at,
      tags: tagsMap.get(p.id) || [],
      isHot: p.is_hot || false,
      isPinned: p.is_pinned || false,
      averageRating: p.average_rating ? Number(p.average_rating) : 0,
      likeCount: p.like_count || 0,
      commentCount: p.comment_count || 0,
    };
  });

  return playbooks;
}

// Fetch filter data (categories and tags) from Supabase
async function getFilterData(): Promise<PlaybookFilterData> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
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
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
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
      // Get playbooks in this category
      const { data: playbooksData } = await supabase
        .from("playbooks")
        .select("id")
        .eq("status", "published")
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
          if (tag && typeof tag === 'object' && 'label' in tag) {
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
  const playbooks = await getPlaybooks();
  const filterData = await getFilterData();
  const categoriesWithTags = await getCategoriesWithTags();

  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      {/* Navigation Bar */}
      <PlaybookNav categoriesWithTags={categoriesWithTags} />

      {/* Main Content */}
      <div className="mt-8">
      {/* Hero Section */}
          <section className="py-20">
        <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                AILINKXIN PLAYBOOK
          </h1>
              <input
                type="text"
                placeholder="Search playbooks..."
                className="w-full max-w-xs px-6 py-4 rounded-full text-white placeholder-gray-300 focus:outline-none transition-colors mx-auto"
            style={{
                  backgroundColor: 'rgba(15, 118, 110, 0.6)',
                  border: '1px solid rgba(20, 184, 166, 0.4)',
                  borderRadius: '9999px',
                  height: '3.5rem',
                }}
              />
        </div>
      </section>

      {/* All Playbooks Section */}
          <section id="all-playbooks" className="py-16">
        <div className="max-w-5xl mx-auto">
          {/* Playbooks Grid */}
          {playbooks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-white text-xl">No playbooks available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {playbooks.map((playbook) => (
                <Link
                  key={playbook.id}
                  href={`/playbook/${playbook.slug}`}
                  className="group bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-emerald-500/70 hover:bg-slate-800/50 transition-all duration-200"
                >
                  {/* Header: Category Badge + Published Date */}
                  <div className="flex items-start justify-between mb-4">
                    {playbook.categoryName && (
                    <span className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-400 text-sm font-semibold rounded-full border border-emerald-500/30">
                        {playbook.categoryName}
                    </span>
                    )}
                    {playbook.publishedAt && (
                      <time className="text-sm text-white">
                        {formatDate(playbook.publishedAt)}
                    </time>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors">
                    {playbook.title}
                  </h3>

                  {/* Summary */}
                  {playbook.summary && (
                    <p className="text-white text-base mb-4 line-clamp-3 leading-relaxed">
                    {playbook.summary}
                  </p>
                  )}

                  {/* Meta Info: Difficulty, Reading Time */}
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    {playbook.difficultyLevel && (
                      <span className="flex items-center gap-1.5 text-sm text-white">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                        {playbook.difficultyLevel}
                    </span>
                    )}
                    {playbook.readingMinutes && (
                      <span className="flex items-center gap-1.5 text-sm text-white">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                        {formatReadingTime(playbook.readingMinutes)}
                          </span>
                    )}
                  </div>

                  {/* Tags */}
                  {playbook.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-900">
                      {playbook.tags.map((tag) => (
                        <span
                          key={tag.id}
                          className="px-2 py-1 bg-slate-800 text-white text-sm rounded-full border border-slate-700"
                        >
                          #{tag.label}
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
      </div>
    </div>
  );
}
