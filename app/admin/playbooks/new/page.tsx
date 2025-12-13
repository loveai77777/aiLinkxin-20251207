import { requireAuth } from "@/lib/admin/auth";
import PlaybookForm from "@/components/admin/PlaybookForm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function NewPlaybookPage() {
  await requireAuth();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">New Playbook</h1>
      <PlaybookForm />
    </div>
  );
}
