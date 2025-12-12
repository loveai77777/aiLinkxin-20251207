import { createClient } from "@supabase/supabase-js";

/**
 * Creates a Supabase client for server-side use
 * Reads from environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
 * 
 * This client is configured to disable caching for all requests,
 * ensuring that data is always fetched fresh from Supabase.
 */
export function createSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // During build time, if env vars are missing, return a mock client to prevent build failures
  // The functions using this client should handle empty results gracefully
  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a client with dummy values - queries will fail gracefully
    // This allows the build to succeed even without env vars configured
    console.warn(
      "⚠️ Supabase environment variables are missing. Playbook features will not work.\n" +
      "Please configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel."
    );
    // Use placeholder values - actual queries will return empty results
    return createClient(
      supabaseUrl || "https://placeholder.supabase.co",
      supabaseAnonKey || "placeholder-key",
      {
        global: {
          fetch: (url, options = {}) => {
            return fetch(url, {
              ...options,
              cache: "no-store",
            });
          },
        },
      }
    );
  }

  // Create client with custom fetch that disables caching
  // This ensures all Supabase queries bypass Next.js fetch cache
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      fetch: (url, options = {}) => {
        return fetch(url, {
          ...options,
          cache: "no-store",
        });
      },
    },
  });
}

