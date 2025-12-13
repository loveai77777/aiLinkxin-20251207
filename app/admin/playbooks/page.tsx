import { requireAuth } from "@/lib/admin/auth";
import { createSupabaseClient } from "@/lib/supabaseClient";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getPlaybooks() {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("playbooks")
    .select("id, slug, title, status, published_at, updated_at")
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Error fetching playbooks:", error);
    return [];
  }

  return data || [];
}

export default async function AdminPlaybooksPage() {
  await requireAuth();
  const playbooks = await getPlaybooks();

  async function toggleStatus(formData: FormData) {
    "use server";
    await requireAuth();
    
    const id = formData.get("id");
    const currentStatus = formData.get("currentStatus");
    const newStatus = currentStatus === "published" ? "draft" : "published";

    const supabase = createSupabaseClient();
    const { error } = await supabase
      .from("playbooks")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      console.error("Error updating status:", error);
      return;
    }

    redirect("/admin/playbooks");
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Playbooks</h1>
        <Link
          href="/admin/playbooks/new"
          className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
        >
          New Playbook
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Slug
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
            {playbooks.map((playbook) => (
              <tr key={playbook.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{playbook.title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{playbook.slug}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      playbook.status === "published"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {playbook.status || "draft"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {playbook.updated_at
                    ? new Date(playbook.updated_at).toLocaleDateString()
                    : "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link
                    href={`/admin/playbooks/${playbook.id}/edit`}
                    className="text-emerald-600 hover:text-emerald-900 mr-4"
                  >
                    Edit
                  </Link>
                  <form action={toggleStatus} className="inline">
                    <input type="hidden" name="id" value={playbook.id} />
                    <input
                      type="hidden"
                      name="currentStatus"
                      value={playbook.status || "draft"}
                    />
                    <button
                      type="submit"
                      className="text-blue-600 hover:text-blue-900"
                    >
                      {playbook.status === "published" ? "Unpublish" : "Publish"}
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
