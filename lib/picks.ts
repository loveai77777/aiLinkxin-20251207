import { createSupabaseClient } from "@/lib/supabaseClient";

/**
 * Picks Product Link 类型
 */
export type PicksProductLink = {
  id: number;
  productId: number;
  linkLabel: string | null;
  affiliateNetwork: string | null;
  merchantName: string | null;
  affiliateUrl: string | null;
  destinationUrl: string | null;
  countryCodes: string[];
  ctaText: string | null;
  notePublic: string | null;
  status: string;
  priority: number;
};

/**
 * Picks Product 类型
 */
export type PicksProduct = {
  id: number;
  slug: string;
  name: string;
  shortDescription: string | null;
  description: string | null;
  heroImageUrl: string | null;
  introVideoUrl: string | null;
  productType: string | null;
  status: string;
  isFeatured: boolean;
  sortOrder: number | null;
  categories: string[];
  tags: string[];
  links: PicksProductLink[];
};

/**
 * 从 Supabase 获取所有已发布的 picks products 及其链接
 */
export async function getPicksProducts(): Promise<{
  products: PicksProduct[];
  error: string | null;
}> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    console.warn(
      "Supabase environment variables not configured, returning empty picks products list"
    );
    return { products: [], error: null };
  }

  const supabase = createSupabaseClient();

  // 获取所有已发布的产品
  const { data: productsData, error: productsError } = await supabase
    .from("picks_products")
    .select("id, slug, name, short_description, description, hero_image_url, intro_video_url, product_type, status, is_featured, sort_order, categories, tags")
    .eq("status", "published")
    .order("sort_order", { ascending: true, nullsFirst: false })
    .order("id", { ascending: false });

  if (productsError) {
    console.error("Error fetching picks products:", productsError);
    return { products: [], error: productsError.message || "Unknown error" };
  }

  if (!productsData || productsData.length === 0) {
    return { products: [], error: null };
  }

  // 获取所有产品的链接
  const productIds = productsData.map((p) => p.id);
  const { data: linksData, error: linksError } = await supabase
    .from("picks_product_links")
    .select("id, product_id, link_label, affiliate_network, merchant_name, affiliate_url, destination_url, country_codes, cta_text, note_public, status, priority")
    .in("product_id", productIds)
    .eq("status", "active")
    .order("priority", { ascending: true });

  if (linksError) {
    console.error("Error fetching picks product links:", linksError);
    // 继续处理，即使链接获取失败
  }

  // 创建 product_id -> links 的映射
  const linksMap = new Map<number, PicksProductLink[]>();
  if (linksData) {
    linksData.forEach((link: any) => {
      const productId = link.product_id;
      if (!linksMap.has(productId)) {
        linksMap.set(productId, []);
      }
      linksMap.get(productId)!.push({
        id: link.id,
        productId: link.product_id,
        linkLabel: link.link_label,
        affiliateNetwork: link.affiliate_network,
        merchantName: link.merchant_name,
        affiliateUrl: link.affiliate_url,
        destinationUrl: link.destination_url,
        countryCodes: Array.isArray(link.country_codes) ? link.country_codes : [],
        ctaText: link.cta_text,
        notePublic: link.note_public,
        status: link.status,
        priority: link.priority || 999,
      });
    });
  }

  // 映射数据到 PicksProduct 类型
  const products: PicksProduct[] = productsData.map((p: any) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    shortDescription: p.short_description || null,
    description: p.description || null,
    heroImageUrl: p.hero_image_url || null,
    introVideoUrl: p.intro_video_url || null,
    productType: p.product_type || null,
    status: p.status,
    isFeatured: p.is_featured || false,
    sortOrder: p.sort_order || null,
    categories: Array.isArray(p.categories) ? p.categories : [],
    tags: Array.isArray(p.tags) ? p.tags : [],
    links: linksMap.get(p.id) || [],
  }));

  return { products, error: null };
}

/**
 * 从 picks_products 聚合所有唯一的 categories 和 tags
 */
export async function getPicksFilterData(): Promise<{
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

  // 获取所有已发布产品的 categories 和 tags
  const { data: productsData } = await supabase
    .from("picks_products")
    .select("categories, tags")
    .eq("status", "published");

  if (!productsData || productsData.length === 0) {
    return { categories: [], tags: [] };
  }

  // 聚合所有唯一的 categories
  const categoriesSet = new Set<string>();
  const tagsSet = new Set<string>();

  productsData.forEach((p: any) => {
    if (Array.isArray(p.categories)) {
      p.categories.forEach((cat: string) => {
        if (cat && typeof cat === "string") {
          categoriesSet.add(cat);
        }
      });
    }
    if (Array.isArray(p.tags)) {
      p.tags.forEach((tag: string) => {
        if (tag && typeof tag === "string") {
          tagsSet.add(tag);
        }
      });
    }
  });

  return {
    categories: Array.from(categoriesSet).sort(),
    tags: Array.from(tagsSet).sort(),
  };
}





