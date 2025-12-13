import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getPlaybooks() {
  const supabase = createAdminSupabaseClient();
  
  // Try to get all columns, but handle missing ones gracefully
  const { data, error } = await supabase
    .from("playbooks")
    .select("id, slug, title, updated_at")
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Error fetching playbooks:", error);
    return [];
  }

  // Check if status column exists by trying to fetch it separately
  let playbooksWithStatus = data || [];
  try {
    const { data: statusData } = await supabase
      .from("playbooks")
      .select("id, status")
      .in("id", playbooksWithStatus.map((p: any) => p.id));
    
    if (statusData) {
      const statusMap = new Map(statusData.map((s: any) => [s.id, s.status]));
      playbooksWithStatus = playbooksWithStatus.map((p: any) => ({
        ...p,
        status: statusMap.get(p.id) || null,
      }));
    }
  } catch (err) {
    // Status column doesn't exist, continue without it
    console.log("Status column not available");
  }

  return playbooksWithStatus;
}

export default async function AdminPlaybookPage() {
  const playbooks = await getPlaybooks();
  const hasStatusColumn = playbooks.length > 0 && playbooks[0]?.status !== undefined;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Playbook</h1>
        <Link
          href="/admin/playbook/new"
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
              {hasStatusColumn && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Updated
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {playbooks.length === 0 ? (
              <tr>
                <td colSpan={hasStatusColumn ? 5 : 4} className="px-6 py-4 text-center text-sm text-gray-500">
                  No playbooks found
                </td>
              </tr>
            ) : (
              playbooks.map((playbook: any) => (
                <tr key={playbook.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{playbook.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{playbook.slug}</div>
                  </td>
                  {hasStatusColumn && (
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
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {playbook.updated_at
                      ? new Date(playbook.updated_at).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      href={`/admin/playbook/${playbook.id}/edit`}
                      className="text-emerald-600 hover:text-emerald-900"
                    >
                      Edit
                    </Link>
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

