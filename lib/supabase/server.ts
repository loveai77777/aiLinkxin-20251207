import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

/**
 * Creates a Supabase client for server-side use with authentication
 * Uses cookies to maintain session
 */
export async function createServerSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase environment variables not configured");
  }

  const cookieStore = await cookies();
  
  // Get auth cookies (Supabase uses sb-<project-ref>-auth-token format)
  // Also check for our custom cookies set by login
  const accessToken = 
    cookieStore.get("sb-access-token")?.value ||
    cookieStore.get(`sb-${supabaseUrl.split("//")[1]?.split(".")[0]}-auth-token`)?.value;
  
  const client = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      headers: accessToken ? {
        Authorization: `Bearer ${accessToken}`,
      } : {},
    },
  });

  // If we have an access token, try to get user
  if (accessToken) {
    try {
      const { data: { user } } = await client.auth.getUser(accessToken);
      if (user) {
        return client;
      }
    } catch (err) {
      // Token invalid, continue without auth
    }
  }
  
  return client;
}

/**
 * Get the current authenticated user on the server
 */
export async function getServerUser() {
  try {
    const supabase = await createServerSupabaseClient();
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("sb-access-token")?.value;
    
    if (!accessToken) {
      return null;
    }
    
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      return null;
    }
    
    return user;
  } catch (err) {
    return null;
  }
}

