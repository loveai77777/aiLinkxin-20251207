import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import PlaybookForm from "@/components/admin/PlaybookForm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getPlaybook(id: number) {
  // Use same admin client as list page to ensure data consistency
  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase
    .from("playbooks")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

export default async function EditPlaybookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const playbook = await getPlaybook(parseInt(id));

  if (!playbook) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Playbook</h1>
      <PlaybookForm playbook={playbook} />
    </div>
  );
}



