import { notFound } from "next/navigation";
import Link from "next/link";
import { createSupabaseClient } from "@/lib/supabaseClient";
import { createSeoMetadata } from "@/lib/seo";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{
    slug: string;
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

// Fetch playbook detail from Supabase
async function getPlaybookBySlug(slug: string) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return { playbook: null, categoryName: null, tags: [], error: null };
  }
  
  const supabase = createSupabaseClient();

  // Fetch playbook with category join
  const { data: playbook, error } = await supabase
    .from("playbooks")
    .select(
      `
      id,
      slug,
      title,
      subtitle,
      summary,
      content_markdown,
      cover_image_url,
      difficulty_level,
      reading_minutes,
      view_count,
      like_count,
      comment_count,
      average_rating,
      published_at,
      category_id,
      playbook_categories!category_id(name)
    `
    )
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error || !playbook) {
    return { playbook: null, categoryName: null, tags: [], error };
  }

  // Fetch tags for this playbook
  const { data: playbookTagsData } = await supabase
    .from("playbook_tags")
    .select(
      `
      tags!tag_id(id, slug, label)
    `
    )
    .eq("playbook_id", playbook.id);

  const tags: { id: number; slug: string; label: string }[] = [];
  if (playbookTagsData) {
    playbookTagsData.forEach((pt) => {
      const tag = pt.tags as unknown as { id: number; slug: string; label: string } | null;
      if (tag && typeof tag === 'object' && 'id' in tag && 'slug' in tag && 'label' in tag) {
        tags.push({
          id: Number(tag.id),
          slug: String(tag.slug),
          label: String(tag.label),
        });
      }
    });
  }

  const categoryData = playbook.playbook_categories as unknown as { name: string } | { name: string }[] | null;
  const category = Array.isArray(categoryData) ? categoryData[0] : categoryData;

  return {
    playbook,
    categoryName: category?.name || null,
    tags,
    error: null,
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { playbook } = await getPlaybookBySlug(slug);

  if (!playbook) {
    return {};
  }

  return createSeoMetadata({
    title: playbook.title,
    description: playbook.summary || playbook.subtitle || "",
    keywords: [],
    ogType: "article",
    publishedTime: playbook.published_at || undefined,
  });
}

export default async function PlaybookDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const { playbook, categoryName, tags, error } = await getPlaybookBySlug(slug);

  if (error || !playbook) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <article>
        {/* Header Section */}
        <header className="mb-8">
          {/* Category Badge */}
          {categoryName && (
            <div className="mb-4">
              <span className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-400 text-sm font-semibold rounded-full border border-emerald-500/30">
                {categoryName}
              </span>
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {playbook.title}
          </h1>

          {/* Subtitle */}
          {playbook.subtitle && (
            <p className="text-xl text-white mb-6">{playbook.subtitle}</p>
          )}

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-white mb-6">
            {playbook.published_at && (
              <time dateTime={playbook.published_at}>
                Published: {formatDate(playbook.published_at)}
              </time>
            )}
            {playbook.difficulty_level && (
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  />
                </svg>
                {playbook.difficulty_level}
              </span>
            )}
            {playbook.reading_minutes && (
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {formatReadingTime(playbook.reading_minutes)}
              </span>
            )}
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-white mb-6">
            {playbook.average_rating && Number(playbook.average_rating) > 0 && (
              <span>
                ⭐ {Number(playbook.average_rating).toFixed(1)} rating
              </span>
            )}
            {playbook.like_count && playbook.like_count > 0 && (
              <span>❤️ {playbook.like_count} likes</span>
            )}
            {playbook.comment_count && playbook.comment_count > 0 && (
              <span>💬 {playbook.comment_count} comments</span>
            )}
            {playbook.view_count && playbook.view_count > 0 && (
              <span>👁️ {playbook.view_count} views</span>
            )}
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {tags.map((tag) => (
                <span
                  key={tag.id}
                  className="px-2 py-1 bg-slate-800 text-white text-sm rounded-full border border-slate-700"
                >
                  #{tag.label}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Cover Image */}
        {playbook.cover_image_url && (
          <div className="mb-8">
            <img
              src={playbook.cover_image_url}
              alt={playbook.title}
              className="w-full h-auto rounded-lg"
            />
          </div>
        )}

        {/* Summary */}
        {playbook.summary && (
          <div className="mb-8 p-6 bg-slate-900 border border-slate-800 rounded-lg">
            <p className="text-lg text-white leading-relaxed">{playbook.summary}</p>
          </div>
        )}

        {/* Content */}
        {playbook.content_markdown && (
          <section className="prose prose-invert max-w-none">
            <div className="whitespace-pre-wrap text-white leading-relaxed">
              {playbook.content_markdown}
            </div>
          </section>
        )}

        {/* Back to List Link */}
        <div className="mt-12 pt-8 border-t border-slate-800">
          <Link
            href="/playbook"
            className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors"
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
      </article>
    </div>
  );
}
