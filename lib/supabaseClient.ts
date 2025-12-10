import { createClient } from "@supabase/supabase-js";

/**
 * Creates a Supabase client for server-side use
 * Reads from environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
 */
export function createSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    const missingVars = [];
    if (!supabaseUrl) missingVars.push("NEXT_PUBLIC_SUPABASE_URL");
    if (!supabaseAnonKey) missingVars.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");

    throw new Error(
      `Missing Supabase environment variables: ${missingVars.join(", ")}.\n\n` +
      `Please create a .env.local file in the project root with:\n` +
      `NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url\n` +
      `NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key\n\n` +
      `You can find these values in your Supabase project settings: https://app.supabase.com/project/_/settings/api`
    );
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}

