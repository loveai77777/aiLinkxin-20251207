import { requireAuth } from "@/lib/admin/auth";
import ProductForm from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function NewProductPage() {
  await requireAuth();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">New Product</h1>
      <ProductForm />
    </div>
  );
}
