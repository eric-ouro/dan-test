import { signOutAction } from "@/app/actions";
import Link from "next/link";
import { Button } from "@components/ui/button";
import { createClient } from "@/utils/supabase/server";

export default async function AuthButton() {
  const {
    data: { user },
  } = await createClient().auth.getUser();

  return user ? (
    <div className="flex items-center gap-4 z-30">
     
      <div className="dropdown">
        <button className="bg-white border-none p-2 cursor-pointer text-xs rounded-sm">
          <div className="flex flex-col gap-0 text-left">
            <span className="text-[10px] text-neutral-400 uppercase leading-none tracking-[.03em]">
            {user.email}
            </span>
          </div>
        </button>
        <div className="dropdown-signout">
            <form action={signOutAction}>
              <Button type="submit" variant={"outline"} >
                Sign out
            </Button>
          </form>
        </div>
      </div>
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/sign-in">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}
