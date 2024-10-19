import { createBrowserClient } from "@supabase/ssr";
import { readEnv } from "@utils/env";
import { Database } from "@utils/supabase/types";

export const createClient = () =>
  createBrowserClient<Database>(
    readEnv().NEXT_PUBLIC_SUPABASE_URL,
    readEnv().NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
