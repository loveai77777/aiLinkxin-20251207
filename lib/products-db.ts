import { createSupabaseClient } from "@/lib/supabaseClient";

/**
 * Product from database (public.products table)
 * Only includes columns that actually exist in the table
 */
export type Product = {
  id: number;
  slug: string;
  name: string;
  short_description: string | null;
  category: string | null;
  tags: string[] | null;
  content_markdown: string | null;
  created_at: string | null;
  updated_at: string | null;
};

/**
 * Get all products from public.products table
 * Sorted by updated_at DESC (most recently updated first), fallback to created_at DESC
 */
export async function getAllProducts(): Promise<{
  products: Product[];
  error: string | null;
  count: number;
}> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    const errorMsg = "Supabase environment variables not configured";
    console.warn(`[getAllProducts] ${errorMsg}`);
    return { products: [], error: errorMsg, count: 0 };
  }

  const supabase = createSupabaseClient();

  // Only select columns that exist in public.products table
  const selectString = "id, slug, name, short_description, category, tags, content_markdown, created_at, updated_at";
  const query = supabase
    .from("products")
    .select(selectString)
    .order("updated_at", { ascending: false, nullsLast: true })
    .order("created_at", { ascending: false, nullsLast: true });

  const { data, error } = await query;

  if (error) {
    console.error("[getAllProducts] Supabase error:", {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
      query: `products.select("${selectString}").order(updated_at DESC, created_at DESC)`,
    });
    return { products: [], error: error.message || "Unknown error", count: 0 };
  }

  if (!data || data.length === 0) {
    console.log("[getAllProducts] No products found in database");
    return { products: [], error: null, count: 0 };
  }

  console.log(`[getAllProducts] Successfully fetched ${data.length} products`);

  const products = data.map((p: any) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    short_description: p.short_description || null,
    category: p.category || null,
    tags: Array.isArray(p.tags) ? p.tags : null,
    content_markdown: p.content_markdown || null,
    created_at: p.created_at || null,
    updated_at: p.updated_at || null,
  }));

  return { products, error: null, count: products.length };
}

/**
 * Get a single product by slug
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    const errorMsg = "Supabase environment variables not configured";
    console.warn(`[getProductBySlug] ${errorMsg}`);
    return null;
  }

  const supabase = createSupabaseClient();

  // Only select columns that exist in public.products table
  const selectString = "id, slug, name, short_description, category, tags, content_markdown, created_at, updated_at";
  const query = supabase
    .from("products")
    .select(selectString)
    .eq("slug", slug)
    .single();

  const { data: product, error } = await query;

  if (error) {
    console.error("[getProductBySlug] Supabase error:", {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
      query: `products.select("${selectString}").eq("slug", "${slug}").single()`,
    });
    return null;
  }

  if (!product) {
    console.log(`[getProductBySlug] No product found with slug: ${slug}`);
    return null;
  }

  console.log(`[getProductBySlug] Successfully fetched product: ${product.name} (slug: ${slug})`);

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    short_description: product.short_description || null,
    category: product.category || null,
    tags: Array.isArray(product.tags) ? product.tags : null,
    content_markdown: product.content_markdown || null,
    created_at: product.created_at || null,
    updated_at: product.updated_at || null,
  };
}

/**
 * Get recommended products for a given product
 * Excludes the current product, prefers same category or overlapping tags
 * Returns up to 6 products
 */
export async function getRecommendedProducts(
  currentSlug: string,
  currentCategory: string | null,
  currentTags: string[] | null
): Promise<Product[]> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    console.warn(`[getRecommendedProducts] Supabase environment variables not configured`);
    return [];
  }

  const supabase = createSupabaseClient();

  // Get all products except current
  const selectString = "id, slug, name, short_description, category, tags, content_markdown, created_at, updated_at";
  const { data, error } = await supabase
    .from("products")
    .select(selectString)
    .neq("slug", currentSlug)
    .order("updated_at", { ascending: false, nullsLast: true });

  if (error) {
    console.error("[getRecommendedProducts] Supabase error:", {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    });
    return [];
  }

  if (!data || data.length === 0) {
    return [];
  }

  // Map and score products
  const productsWithScores = data.map((p: any) => {
    const product: Product = {
      id: p.id,
      slug: p.slug,
      name: p.name,
      short_description: p.short_description || null,
      category: p.category || null,
      tags: Array.isArray(p.tags) ? p.tags : null,
      content_markdown: p.content_markdown || null,
      created_at: p.created_at || null,
      updated_at: p.updated_at || null,
    };

    let score = 0;

    // Same category: +10 points
    if (currentCategory && product.category?.toLowerCase() === currentCategory.toLowerCase()) {
      score += 10;
    }

    // Tag overlap: +1 point per overlapping tag
    if (currentTags && product.tags && Array.isArray(product.tags)) {
      const currentTagsLower = currentTags.map((t) => t.toLowerCase());
      const productTagsLower = product.tags.map((t) => t?.toLowerCase()).filter(Boolean);
      const overlap = productTagsLower.filter((tag) => currentTagsLower.includes(tag)).length;
      score += overlap;
    }

    return { product, score };
  });

  // Sort by score (descending), then by updated_at (descending)
  productsWithScores.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    const aDate = a.product.updated_at ? new Date(a.product.updated_at).getTime() : 0;
    const bDate = b.product.updated_at ? new Date(b.product.updated_at).getTime() : 0;
    return bDate - aDate;
  });

  // Return top 6
  return productsWithScores.slice(0, 6).map((item) => item.product);
}
