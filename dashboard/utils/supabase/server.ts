import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { readEnv } from "@utils/env";

export const createClient = () => {
  const cookieStore = cookies();

  return createServerClient(
    readEnv().NEXT_PUBLIC_SUPABASE_URL,
    readEnv().NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
              cookieStore.set(name, value, options);
            });
          } catch {
            // This can be ignored because have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  );
};
