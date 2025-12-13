import { createSupabaseClient } from "@/lib/supabaseClient";
import type { PlaybookCardData } from "@/components/playbook/PlaybookCard";

/**
 * Published Playbook from database
 */
export type PublishedPlaybook = {
  id: number;
  slug: string;
  title: string;
  subtitle: string | null;
  summary: string | null;
  content_markdown: string | null;
  cover_image_url: string | null;
  published_at: string | null;
  updated_at: string | null;
  reading_minutes: number | null;
  category_id: number | null;
  difficulty_level: string | null;
  view_count: number | null;
  like_count: number | null;
  comment_count: number | null;
  average_rating: number | null;
  has_affiliate_links: boolean | null;
  affiliate_disclosure_override: string | null;
  primary_product_id: number | null;
  audio_url: string | null;
  audio_duration_seconds: number | null;
};

/**
 * Get all published playbooks, sorted by published_at DESC
 */
export async function getPublishedPlaybooks(): Promise<PlaybookCardData[]> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    console.warn(
      "Supabase environment variables not configured, returning empty playbooks list"
    );
    return [];
  }

  const supabase = createSupabaseClient();

  // Fetch published playbooks
  const { data, error } = await supabase
    .from("playbooks")
    .select("id, slug, title, summary, published_at, updated_at, reading_minutes, has_affiliate_links")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Error fetching published playbooks:", error);
    return [];
  }

  if (!data || data.length === 0) {
    return [];
  }

  // Fetch tags for all playbooks
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
  const playbooks: PlaybookCardData[] = data.map((p: any) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    summary: p.summary || null,
    updatedAt: p.updated_at || null,
    publishedAt: p.published_at || null,
    readingMinutes: p.reading_minutes || null,
    tags: tagsMap.get(p.id) || [],
    hasAffiliateLinks: p.has_affiliate_links || false,
  }));

  return playbooks;
}

/**
 * Get a single published playbook by slug
 */
export async function getPlaybookBySlug(
  slug: string
): Promise<PublishedPlaybook | null> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    console.warn(
      "Supabase environment variables not configured, returning null"
    );
    return null;
  }

  const supabase = createSupabaseClient();

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
      published_at,
      updated_at,
      reading_minutes,
      category_id,
      difficulty_level,
      view_count,
      like_count,
      comment_count,
      average_rating,
      has_affiliate_links,
      affiliate_disclosure_override,
      primary_product_id,
      audio_url,
      audio_duration_seconds
    `
    )
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error || !playbook) {
    console.error("Error fetching playbook by slug:", error);
    return null;
  }

  return {
    id: playbook.id,
    slug: playbook.slug,
    title: playbook.title,
    subtitle: playbook.subtitle || null,
    summary: playbook.summary || null,
    content_markdown: playbook.content_markdown || null,
    cover_image_url: playbook.cover_image_url || null,
    published_at: playbook.published_at || null,
    updated_at: playbook.updated_at || null,
    reading_minutes: playbook.reading_minutes || null,
    category_id: playbook.category_id || null,
    difficulty_level: playbook.difficulty_level || null,
    view_count: playbook.view_count || null,
    like_count: playbook.like_count || null,
    comment_count: playbook.comment_count || null,
    average_rating: playbook.average_rating || null,
    has_affiliate_links: playbook.has_affiliate_links || null,
    affiliate_disclosure_override: playbook.affiliate_disclosure_override || null,
    primary_product_id: playbook.primary_product_id || null,
    audio_url: playbook.audio_url || null,
    audio_duration_seconds: playbook.audio_duration_seconds || null,
  };
}

