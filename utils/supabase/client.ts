import { createBrowserClient } from "@supabase/ssr";

// Supabase-client voor gebruik in Client Components (draait in de browser).
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}