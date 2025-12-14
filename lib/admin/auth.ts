import { redirect } from "next/navigation";
import { getServerUser } from "@/lib/supabase/server";

/**
 * Protect admin routes - redirects to /admin/login if not authenticated
 */
export async function requireAuth() {
  const user = await getServerUser();
  
  if (!user) {
    redirect("/admin/login");
  }
  
  return user;
}


