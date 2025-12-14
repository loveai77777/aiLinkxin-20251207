import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/admin/picks"
          className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Manage Picks</h2>
          <p className="text-gray-600 text-sm">Create and edit product picks</p>
        </Link>

        <Link
          href="/admin/playbooks"
          className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Manage Playbooks</h2>
          <p className="text-gray-600 text-sm">Create and edit playbook articles</p>
        </Link>

        <Link
          href="/admin/products"
          className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:shadow-md transition-shadow opacity-50 cursor-not-allowed"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Products / Solutions</h2>
          <p className="text-gray-600 text-sm">Coming soon</p>
        </Link>
      </div>
    </div>
  );
}

