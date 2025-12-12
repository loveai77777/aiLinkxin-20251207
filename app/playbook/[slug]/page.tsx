import { notFound } from "next/navigation";
import Link from "next/link";
import { createSupabaseClient } from "@/lib/supabaseClient";
import { createSeoMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { getRecommendedPlaybooks, getApprovedComments } from "@/lib/playbook";
import PlaybookAudioPlayer from "@/components/PlaybookAudioPlayer";
import PlaybookComments from "@/components/PlaybookComments";
import ProductCard, { type ProductData } from "@/components/playbook/ProductCard";
import ProductRecommendationSection, {
  type ProductLinkData,
} from "@/components/playbook/ProductRecommendationSection";

// Force dynamic rendering to ensure fresh data from Supabase
export const dynamic = "force-dynamic";

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

// Fetch product recommendations for a playbook
async function getProductRecommendations(playbookId: number): Promise<{
  primaryProduct: ProductData | null;
  productLinks: ProductLinkData[];
}> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return { primaryProduct: null, productLinks: [] };
  }

  const supabase = createSupabaseClient();

  // Fetch primary product if primary_product_id exists
  // TODO: Verify primary_product_id field exists in playbooks table
  const { data: playbookData } = await supabase
    .from("playbooks")
    .select("primary_product_id")
    .eq("id", playbookId)
    .single();

  let primaryProduct: ProductData | null = null;
  if (playbookData?.primary_product_id) {
    // TODO: Verify products table structure matches expected schema
    const { data: productData } = await supabase
      .from("products")
      .select("id, slug, name, short_description, external_url")
      .eq("id", playbookData.primary_product_id)
      .single();

    if (productData) {
      primaryProduct = {
        id: productData.id,
        slug: productData.slug,
        name: productData.name,
        shortDescription: productData.short_description || null,
        externalUrl: productData.external_url || null,
      };
    }
  }

  // Fetch product links from playbook_product_links
  // TODO: Verify playbook_product_links table exists with expected schema
  const { data: productLinksData, error: linksError } = await supabase
    .from("playbook_product_links")
    .select(
      `
      product_id,
      placement,
      cta_text,
      sort_order,
      notes,
      products(id, slug, name, short_description, external_url)
    `
    )
    .eq("playbook_id", playbookId)
    .order("sort_order", { ascending: true, nullsFirst: true });

  const productLinks: ProductLinkData[] = [];
  if (productLinksData && !linksError) {
    for (const link of productLinksData) {
      const product = link.products as unknown as
        | {
            id: number;
            slug: string;
            name: string;
            short_description: string | null;
            external_url: string | null;
          }
        | null;

      if (product) {
        productLinks.push({
          product: {
            id: product.id,
            slug: product.slug,
            name: product.name,
            shortDescription: product.short_description || null,
            externalUrl: product.external_url || null,
          },
          placement: (link.placement as "hero" | "inline" | "footer") || "footer",
          ctaText: link.cta_text || null,
          sortOrder: link.sort_order || null,
          notes: link.notes || null,
        });
      }
    }
  }

  return { primaryProduct, productLinks };
}

// Fetch playbook detail from Supabase
async function getPlaybookBySlug(slug: string) {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return { playbook: null, categoryName: null, tags: [], error: null };
  }

  const supabase = createSupabaseClient();

  // Fetch playbook with category join
  // TODO: Add has_affiliate_links, affiliate_disclosure_override, primary_product_id if they exist
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
      audio_url,
      audio_duration_seconds,
      has_affiliate_links,
      affiliate_disclosure_override,
      primary_product_id,
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
        tags.push({
          id: Number(tag.id),
          slug: String(tag.slug),
          label: String(tag.label),
        });
      }
    });
  }

  const categoryData = playbook.playbook_categories as unknown as
    | { name: string }
    | { name: string }[]
    | null;
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

  // Get recommended playbooks (based on category + tags)
  const recommendedPlaybooks = await getRecommendedPlaybooks(
    playbook.id,
    playbook.category_id,
    tags.map((t) => t.id)
  );

  // Get approved comments
  const comments = await getApprovedComments(playbook.id);

  // Get product recommendations
  const { primaryProduct, productLinks } = await getProductRecommendations(
    playbook.id
  );

  // Group product links by placement
  const heroProducts = productLinks.filter((p) => p.placement === "hero");
  const inlineProducts = productLinks.filter((p) => p.placement === "inline");
  const footerProducts = productLinks.filter((p) => p.placement === "footer");

  // Determine if we should show affiliate disclosure
  const hasAffiliateLinks =
    playbook.has_affiliate_links ||
    !!primaryProduct ||
    productLinks.length > 0;

  // Split content into sections for inline product placement
  // Simple approach: split by double newlines or markdown headers
  const contentSections = playbook.content_markdown
    ? playbook.content_markdown.split(/\n\n+/)
    : [];
  const midPoint = Math.floor(contentSections.length / 2);

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

          {/* Hero Product Recommendation */}
          {(primaryProduct || heroProducts.length > 0) && (
            <div className="mb-6 p-4 bg-slate-900 border border-slate-800 rounded-lg">
              <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide">
                Recommended
              </p>
              {primaryProduct ? (
                <ProductCard
                  product={primaryProduct}
                  ctaText={null}
                  compact={false}
                />
              ) : (
                heroProducts.length > 0 && (
                  <ProductCard
                    product={heroProducts[0].product}
                    ctaText={heroProducts[0].ctaText}
                    compact={false}
                  />
                )
              )}
            </div>
          )}

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-white mb-4">
            {playbook.published_at && (
              <time dateTime={playbook.published_at}>
                Published: {formatDate(playbook.published_at)}
              </time>
            )}
            {playbook.difficulty_level && (
              <span className="flex items-center gap-1.5">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
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
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
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

          {/* Audio Player */}
          <div className="mb-6">
            <PlaybookAudioPlayer
              audioUrl={playbook.audio_url}
              audioDurationSeconds={playbook.audio_duration_seconds}
            />
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-white mb-6">
            {playbook.average_rating &&
              Number(playbook.average_rating) > 0 && (
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
            <p className="text-lg text-white leading-relaxed">
              {playbook.summary}
            </p>
          </div>
        )}

        {/* Content with Inline Products */}
        {playbook.content_markdown && (
          <section className="prose prose-invert max-w-none mb-12">
            {/* First half of content */}
            {contentSections.slice(0, midPoint).map((section, idx) => (
              <div
                key={`section-${idx}`}
                className="whitespace-pre-wrap text-white leading-relaxed mb-6"
              >
                {section}
              </div>
            ))}

            {/* Inline Product Recommendations */}
            {inlineProducts.length > 0 && (
              <div className="my-8 p-4 bg-slate-900 border border-slate-800 rounded-lg">
                <p className="text-xs text-gray-500 mb-3 uppercase tracking-wide">
                  Recommended Resources
                </p>
                <div className="space-y-3">
                  {inlineProducts.map((productLink, idx) => (
                    <ProductCard
                      key={`inline-${productLink.product.id}-${idx}`}
                      product={productLink.product}
                      ctaText={productLink.ctaText}
                      compact={true}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Second half of content */}
            {contentSections.slice(midPoint).map((section, idx) => (
              <div
                key={`section-${midPoint + idx}`}
                className="whitespace-pre-wrap text-white leading-relaxed mb-6"
              >
                {section}
              </div>
            ))}
          </section>
        )}

        {/* Footer Product Recommendations */}
        {footerProducts.length > 0 && (
          <div className="mb-12 p-4 bg-slate-900 border border-slate-800 rounded-lg">
            <p className="text-sm font-medium text-white mb-4">
              Additional Resources
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {footerProducts.map((productLink, idx) => (
                <ProductCard
                  key={`footer-${productLink.product.id}-${idx}`}
                  product={productLink.product}
                  ctaText={productLink.ctaText}
                  compact={true}
                />
              ))}
            </div>
          </div>
        )}

        {/* Tools & Resources Section */}
        <ProductRecommendationSection
          products={[...heroProducts, ...inlineProducts, ...footerProducts]}
          affiliateDisclosureOverride={playbook.affiliate_disclosure_override}
          hasAffiliateLinks={hasAffiliateLinks}
        />

        {/* Recommended Playbooks Section */}
        {recommendedPlaybooks.length > 0 && (
          <section className="mt-12 pt-8 border-t border-slate-800">
            <h2 className="text-2xl font-bold text-white mb-6">
              Recommended Playbooks
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendedPlaybooks.map((recommended) => (
                <Link
                  key={recommended.id}
                  href={`/playbook/${recommended.slug}`}
                  className="p-4 bg-slate-900 border border-slate-800 rounded-lg hover:border-emerald-500/70 hover:bg-slate-800/50 transition-all"
                >
                  <h3 className="text-lg font-semibold text-white mb-2 hover:text-emerald-400 transition-colors">
                    {recommended.title}
                  </h3>
                  <div className="flex items-center gap-3 text-sm text-gray-400">
                    {recommended.published_at && (
                      <time>{formatDate(recommended.published_at)}</time>
                    )}
                    {recommended.reading_minutes && (
                      <span>{formatReadingTime(recommended.reading_minutes)}</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Comments Section */}
        <PlaybookComments
          playbookId={playbook.id}
          initialComments={comments}
        />

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
