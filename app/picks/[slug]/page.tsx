import { notFound } from "next/navigation";
import { createSeoMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { getProductBySlug, getRecommendedProducts } from "@/lib/products-db";
import Link from "next/link";
import PicksMarkdownContent from "@/components/PicksMarkdownContent";

// Force dynamic rendering - no caching
export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {};
  }

  return createSeoMetadata({
    title: product.name,
    description: product.short_description || "",
    keywords: [],
  });
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

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Get recommended products
  const recommendedProducts = await getRecommendedProducts(
    product.slug,
    product.category,
    product.tags
  );

  // Helper function to build tag filter URL
  const buildTagUrl = (tag: string) => {
    const params = new URLSearchParams();
    if (product.category) params.set("category", product.category);
    params.set("tag", tag);
    return `/picks?${params.toString()}`;
  };

  return (
    <div className="min-h-screen bg-pink-50">
      <div className="mx-auto max-w-4xl px-4 py-16">
        <article>
          {/* Header */}
          <header className="mb-8">
            {/* H1: Product Name */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>

            {/* Subtitle: Short Description */}
            {product.short_description && (
              <p className="text-xl text-gray-700 mb-4">{product.short_description}</p>
            )}

            {/* Tip note */}
            <p className="text-sm text-gray-500 mb-6 italic">
              Tip: You can copy short excerpts.
            </p>

            {/* Meta Row: Category + Tags + Updated Date */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-8 pb-6 border-b border-pink-200">
              {product.category && (
                <span className="inline-block px-3 py-1 rounded-full bg-pink-200 border border-pink-300 text-gray-700 font-medium">
                  {product.category}
                </span>
              )}
              {product.tags && product.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-block px-2 py-1 rounded-full bg-white border border-pink-200 text-gray-600 text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              {product.updated_at && (
                <time className="text-gray-500">
                  Updated {formatDate(product.updated_at)}
                </time>
              )}
            </div>
          </header>

          {/* Article Content */}
          <div className="prose prose-pink max-w-none">
            {product.content_markdown ? (
              <PicksMarkdownContent content={product.content_markdown} />
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-gray-600">Article coming soon.</p>
              </div>
            )}
          </div>

          {/* Related Tags Section */}
          {product.tags && product.tags.length > 0 && (
            <section className="mt-12 pt-8 border-t border-pink-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Related tags</h2>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, idx) => (
                  <Link
                    key={idx}
                    href={buildTagUrl(tag)}
                    className="inline-block px-4 py-2 rounded-full text-sm font-medium bg-white border border-pink-200 text-gray-600 hover:border-pink-300 hover:bg-pink-50 transition-all"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Recommended Picks Section */}
          {recommendedProducts.length > 0 && (
            <section className="mt-12 pt-8 border-t border-pink-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Recommended picks</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendedProducts.map((recProduct) => (
                  <Link
                    key={recProduct.id}
                    href={`/picks/${recProduct.slug}`}
                    className="group block bg-pink-100 border border-pink-200 rounded-2xl p-8 hover:border-pink-300 hover:shadow-md hover:-translate-y-1 transition-all duration-200"
                  >
                    {/* Category Badge */}
                    {recProduct.category && (
                      <div className="mb-3">
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-pink-200 border border-pink-300 text-gray-700">
                          {recProduct.category}
                        </span>
                      </div>
                    )}

                    {/* Product Name */}
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-pink-700 transition-colors">
                      {recProduct.name}
                    </h3>

                    {/* Short Description */}
                    {recProduct.short_description && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                        {recProduct.short_description}
                      </p>
                    )}

                    {/* Tags (up to 3) */}
                    {recProduct.tags && recProduct.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {recProduct.tags.slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-white border border-pink-200 text-gray-600"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Meta: Date */}
                    <div className="flex items-center gap-3 text-xs text-gray-500 pt-4 border-t border-pink-200">
                      {recProduct.created_at && (
                        <time>
                          {new Date(recProduct.created_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </time>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Back to List Link */}
          <div className="mt-12 pt-8 border-t border-pink-200">
            <Link
              href="/picks"
              className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 transition-colors"
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
              Back to Picks
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}

