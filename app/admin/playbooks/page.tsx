import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getPlaybooks() {
  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase
    .from("playbooks")
    .select("id, slug, title, status, published_at, updated_at")
    .neq("status", "archived")
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Error fetching playbooks:", error);
    return [];
  }

  return data || [];
}

export default async function AdminPlaybooksPage() {
  const playbooks = await getPlaybooks();

  async function toggleStatus(formData: FormData) {
    "use server";
    
    const id = formData.get("id");
    const currentStatus = formData.get("currentStatus");
    const newStatus = currentStatus === "published" ? "draft" : "published";

    const supabase = createAdminSupabaseClient();
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

  async function deletePlaybook(formData: FormData) {
    "use server";
    
    const id = formData.get("id");
    if (!id) return;

    const supabase = createAdminSupabaseClient();
    const { error } = await supabase
      .from("playbooks")
      .update({ status: "archived" })
      .eq("id", id);

    if (error) {
      console.error("Error archiving playbook:", error);
      return;
    }

    redirect("/admin/playbooks");
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Playbooks</h1>
        <div className="flex gap-2">
          <Link
            href="/admin/playbooks/categories-tags"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Manage Categories & Tags
          </Link>
          <Link
            href="/admin/playbooks/new"
            className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
          >
            New Playbook
          </Link>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Slug
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Updated
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {playbooks.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                  No playbooks found
                </td>
              </tr>
            ) : (
              playbooks.map((playbook) => (
                <tr key={playbook.id}>
                  <td className="px-4 py-4">
                    <div className="text-sm font-medium text-gray-900 max-w-xs truncate" title={playbook.title}>
                      {playbook.title}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-500 max-w-xs truncate" title={playbook.slug}>
                      {playbook.slug}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        playbook.status === "published"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {playbook.status || "draft"}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {playbook.updated_at
                      ? new Date(playbook.updated_at).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/playbooks/${playbook.id}/edit`}
                        className="px-3 py-1 bg-emerald-600 text-white rounded hover:bg-emerald-700 text-sm"
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
                          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                        >
                          {playbook.status === "published" ? "Unpublish" : "Publish"}
                        </button>
                      </form>
                      <form action={deletePlaybook} className="inline">
                        <input type="hidden" name="id" value={playbook.id} />
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



