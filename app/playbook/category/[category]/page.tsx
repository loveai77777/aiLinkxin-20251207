import Link from "next/link";
import { createSupabaseClient } from "@/lib/supabaseClient";
import { createSeoMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    category: string;
  }>;
}

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

// Fetch playbooks by category
async function getPlaybooksByCategory(categorySlug: string) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return { playbooks: [], categoryName: null };
  }
  
  const supabase = createSupabaseClient();

  // First, get the category name from slug
  const categorySlugDecoded = decodeURIComponent(categorySlug);
  const categoryNameWithSpaces = categorySlugDecoded.replace(/-/g, " ");
  
  // Find category by name (case-insensitive)
  let { data: categoryData } = await supabase
    .from("playbook_categories")
    .select("id, name")
    .ilike("name", categoryNameWithSpaces)
    .maybeSingle();
  
  // If not found, try with different format
  if (!categoryData) {
    const { data: altCategoryData } = await supabase
      .from("playbook_categories")
      .select("id, name")
      .ilike("name", `%${categorySlugDecoded}%`)
      .limit(1)
      .maybeSingle();
    categoryData = altCategoryData;
  }
  
  const categoryDataFinal = categoryData;

  if (!categoryDataFinal) {
    return { playbooks: [], categoryName: null };
  }

  // Fetch playbooks with this category
  const { data: playbooksData, error } = await supabase
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
    .eq("category_id", categoryDataFinal.id)
    .order("is_pinned", { ascending: false })
    .order("is_hot", { ascending: false })
    .order("published_at", { ascending: false, nullsFirst: false });

  if (error || !playbooksData) {
    return { playbooks: [], categoryName: categoryDataFinal?.name || null };
  }

  // Fetch tags for all playbooks
  const playbookIds = playbooksData.map((p) => p.id);
  const { data: playbookTagsData } = await supabase
    .from("playbook_tags")
    .select(
      `
      playbook_id,
      tags!tag_id(id, slug, label)
    `
    )
    .in("playbook_id", playbookIds);

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

  const playbooks = playbooksData.map((p: any) => {
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
    };
  });

  return { playbooks, categoryName: categoryDataFinal.name };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const categoryName = decodeURIComponent(category).replace(/-/g, " ");
  
  return createSeoMetadata({
    title: `${categoryName} - AI Playbooks`,
    description: `Browse AI Playbooks in the ${categoryName} category`,
  });
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;
  const { playbooks, categoryName } = await getPlaybooksByCategory(category);

  if (!categoryName) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <article>
        {/* Header */}
        <header className="mb-8">
          <div className="mb-4">
            <Link
              href="/playbook"
              className="inline-flex items-center gap-2 text-white hover:text-emerald-400 transition-colors mb-4"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Playbooks
            </Link>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {categoryName}
          </h1>
          <p className="text-xl text-white mb-6">
            {playbooks.length} {playbooks.length === 1 ? "playbook" : "playbooks"} in this category
          </p>
        </header>

        {/* Playbooks List */}
        {playbooks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-white text-xl">No playbooks found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {playbooks.map((playbook) => (
              <Link
                key={playbook.id}
                href={`/playbook/${playbook.slug}`}
                className="group bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-emerald-500/70 hover:bg-slate-800/50 transition-all duration-200"
              >
                {/* Header */}
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

                {/* Meta Info */}
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
      </article>
    </div>
  );
}

