import { getAdminSession } from "@/lib/admin/session";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/admin/LogoutButton";

// Protected layout - only wraps pages in (protected) route group
export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check session (middleware already protects, but double-check)
  const isAuthenticated = await getAdminSession();
  
  if (!isAuthenticated) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-6">
              <h1 className="text-xl font-bold text-gray-900">AILINKXIN Admin</h1>
              <a
                href="/"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                ← Back to main site
              </a>
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

