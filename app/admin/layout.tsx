import Link from "next/link";
import LogoutButton from "@/components/admin/LogoutButton";

// Admin layout - separate from public site, minimal design
// Only applies to /admin/* routes (not /admin/login which has its own layout)
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-6">
              <h1 className="text-xl font-bold text-gray-900">AILINKXIN Admin</h1>
              <Link
                href="/admin"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Dashboard
              </Link>
              <Link
                href="/admin/picks"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Picks
              </Link>
              <Link
                href="/admin/playbook"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Playbook
              </Link>
            </div>
            <LogoutButton />
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}


