import { createBrowserClient } from "@supabase/ssr";
import { readEnv } from "@utils/env";

export const createClient = () =>
  createBrowserClient(
    readEnv().NEXT_PUBLIC_SUPABASE_URL,
    readEnv().NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
