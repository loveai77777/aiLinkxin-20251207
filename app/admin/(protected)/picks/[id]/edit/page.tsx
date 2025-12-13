import { createSupabaseClient } from "@/lib/supabaseClient";
import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getProduct(id: number) {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

async function getProductLinks(productId: number) {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("picks_product_links")
    .select("*")
    .eq("product_id", productId)
    .order("priority", { ascending: true });

  if (error) {
    console.error("Error fetching links:", error);
    return [];
  }

  return data || [];
}

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(parseInt(id));
  const links = await getProductLinks(parseInt(id));

  if (!product) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Product</h1>
      <ProductForm product={product} links={links} />
    </div>
  );
}

