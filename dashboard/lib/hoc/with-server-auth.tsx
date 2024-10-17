import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { User } from "@supabase/supabase-js";

export interface AuthedPageProps {
  user: User;
  supabase: SupabaseClient;
}

export default function withAuth<P extends AuthedPageProps>(
  Component: React.ComponentType<P>,
) {
  return async (props: Omit<P, keyof AuthedPageProps>) => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return redirect("/sign-in");
    }

    return <Component {...(props as P)} user={user} supabase={supabase} />;
  };
}
