import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getProducts() {
  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase
    .from("products")
    .select("id, slug, name, category, status, updated_at")
    .neq("status", "archived")
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }

  return data || [];
}

export default async function AdminPicksPage() {
  const products = await getProducts();

  async function toggleStatus(formData: FormData) {
    "use server";
    
    const id = formData.get("id");
    const currentStatus = formData.get("currentStatus");
    const newStatus = currentStatus === "published" ? "draft" : "published";

    const supabase = createAdminSupabaseClient();
    const { error } = await supabase
      .from("products")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      console.error("Error updating status:", error);
      return;
    }

    redirect("/admin/picks");
  }

  async function deleteProduct(formData: FormData) {
    "use server";
    
    const id = formData.get("id");
    if (!id) return;

    const supabase = createAdminSupabaseClient();
    const { error } = await supabase
      .from("products")
      .update({ status: "archived", updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      console.error("Error archiving product:", error);
      return;
    }

    redirect("/admin/picks");
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Picks</h1>
        <Link
          href="/admin/picks/new"
          className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
        >
          New Product
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Slug
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Updated
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                  No products found
                </td>
              </tr>
            ) : (
              products.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{product.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{product.slug}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{product.category || "-"}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      product.status === "published"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {product.status || "draft"}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.updated_at
                    ? new Date(product.updated_at).toLocaleDateString()
                    : "-"}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/picks/${product.id}/edit`}
                      className="px-3 py-1 bg-emerald-600 text-white rounded hover:bg-emerald-700 text-sm"
                    >
                      Edit
                    </Link>
                    <form action={toggleStatus} className="inline">
                      <input type="hidden" name="id" value={product.id} />
                      <input
                        type="hidden"
                        name="currentStatus"
                        value={product.status || "draft"}
                      />
                      <button
                        type="submit"
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                      >
                        {product.status === "published" ? "Unpublish" : "Publish"}
                      </button>
                    </form>
                    <form action={deleteProduct} className="inline">
                      <input type="hidden" name="id" value={product.id} />
                      <button
                        type="submit"
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}



