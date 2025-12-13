import { createSeoMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { getAllProducts } from "@/lib/products-db";
import Link from "next/link";

// Force dynamic rendering - no caching
export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = createSeoMetadata({
  title: "Picks",
  description:
    "Curated picks: tools, apps, and products we've tried and found useful.",
  keywords: ["picks", "curated", "tools", "resources", "AI automation"],
});

interface PageProps {
  searchParams: Promise<{
    category?: string;
    tag?: string;
  }>;
}

export default async function PicksPage({ searchParams }: PageProps) {
  // Fetch products from Supabase on every request
  const { products: allProducts, error, count } = await getAllProducts();
  
  // Get filter params
  const params = await searchParams;
  const selectedCategory = params.category;
  const selectedTag = params.tag;

  // Filter products based on searchParams
  let filteredProducts = allProducts;
  if (selectedCategory) {
    filteredProducts = filteredProducts.filter(
      (p) => p.category?.toLowerCase() === selectedCategory.toLowerCase()
    );
  }
  if (selectedTag) {
    filteredProducts = filteredProducts.filter(
      (p) => p.tags?.some((tag) => tag.toLowerCase() === selectedTag.toLowerCase())
    );
  }

  // Extract distinct categories and tags from all products
  const categories = Array.from(
    new Set(
      allProducts
        .map((p) => p.category)
        .filter((c): c is string => c !== null && c !== "")
    )
  ).sort();

  // Extract all tags and count frequency
  const tagCounts = new Map<string, number>();
  allProducts.forEach((p) => {
    if (p.tags && Array.isArray(p.tags)) {
      p.tags.forEach((tag) => {
        if (tag) {
          tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
        }
      });
    }
  });
  // Sort tags by frequency (descending) and get top tags
  const popularTags = Array.from(tagCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([tag]) => tag);

  // Helper function to build filter URL
  const buildFilterUrl = (category?: string, tag?: string) => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (tag) params.set("tag", tag);
    const query = params.toString();
    return query ? `/picks?${query}` : "/picks";
  };

  return (
    <div className="min-h-screen bg-pink-50">
      <div className="mx-auto max-w-7xl px-4 py-16">
        {/* Hero Section */}
        <section className="py-12 mb-12">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              AILINKXIN PICKS
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Curated picks: tools, apps, and products we've tried and found useful.
            </p>
          </div>
        </section>

        {/* Filter Chips */}
        <section className="mb-8">
          {/* Categories Row */}
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">Categories</h2>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <Link
                href={buildFilterUrl(undefined, selectedTag)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  !selectedCategory
                    ? "bg-pink-200 border-2 border-pink-400 text-gray-900"
                    : "bg-white border border-pink-200 text-gray-600 hover:border-pink-300"
                }`}
              >
                All
              </Link>
              {categories.map((category) => (
                <Link
                  key={category}
                  href={buildFilterUrl(category, selectedTag)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory?.toLowerCase() === category.toLowerCase()
                      ? "bg-pink-200 border-2 border-pink-400 text-gray-900"
                      : "bg-white border border-pink-200 text-gray-600 hover:border-pink-300"
                  }`}
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>

          {/* Tags Row */}
          <div>
            <h2 className="text-sm font-semibold text-gray-700 mb-3">Tags</h2>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <Link
                href={buildFilterUrl(selectedCategory, undefined)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  !selectedTag
                    ? "bg-pink-200 border-2 border-pink-400 text-gray-900"
                    : "bg-white border border-pink-200 text-gray-600 hover:border-pink-300"
                }`}
              >
                All
              </Link>
              {popularTags.map((tag) => (
                <Link
                  key={tag}
                  href={buildFilterUrl(selectedCategory, tag)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedTag?.toLowerCase() === tag.toLowerCase()
                      ? "bg-pink-200 border-2 border-pink-400 text-gray-900"
                      : "bg-white border border-pink-200 text-gray-600 hover:border-pink-300"
                  }`}
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No products available yet.</p>
            {/* Dev-only debug info */}
            {process.env.NODE_ENV === "development" && (
              <div className="mt-4 p-4 bg-pink-100 border border-pink-200 rounded-2xl text-left max-w-2xl mx-auto shadow-sm">
                <p className="text-sm text-gray-800 mb-2">
                  <strong>Debug Info (dev only):</strong>
                </p>
                <p className="text-xs text-gray-600">
                  Products returned: {count}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Query: products.select("id, slug, name, short_description, category, tags, created_at, updated_at")
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Filtered: {filteredProducts.length} of {allProducts.length}
                </p>
                {error && (
                  <p className="text-xs text-red-600 mt-2">
                    Error: {error}
                  </p>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/picks/${product.slug}`}
                className="group block bg-pink-100 border border-pink-200 rounded-2xl p-8 hover:border-pink-300 hover:shadow-md hover:-translate-y-1 transition-all duration-200"
              >
                {/* Category Badge */}
                {product.category && (
                  <div className="mb-3">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-pink-200 border border-pink-300 text-gray-700">
                      {product.category}
                    </span>
                  </div>
                )}

                {/* Product Name */}
                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-pink-700 transition-colors">
                  {product.name}
                </h3>

                {/* Short Description */}
                {product.short_description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                    {product.short_description}
                  </p>
                )}

                {/* Tags (up to 3) */}
                {product.tags && product.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {product.tags.slice(0, 3).map((tag, idx) => (
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
                  {product.created_at && (
                    <time>
                      {new Date(product.created_at).toLocaleDateString("en-US", {
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
        )}
      </div>
    </div>
  );
}
