import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

interface CookieMutation {
  name: string;
  value: string;
  options?: Record<string, unknown>;
}

export async function createSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(items: CookieMutation[]) {
        const mutableCookieStore = cookieStore as unknown as {
          set?: (name: string, value: string, options?: Record<string, unknown>) => void;
        };

        for (const item of items) {
          mutableCookieStore.set?.(item.name, item.value, item.options);
        }
      },
    },
  });
}
