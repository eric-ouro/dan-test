import { signOutAction } from "@/app/actions";
import Link from "next/link";
import { Button } from "@components/ui/button";
import { createClient } from "@/utils/supabase/server";
import { ThemeSwitcher } from "@components/theme-switcher";
import { House } from "phosphor-react";
export default async function AuthButton() {
  const {
    data: { user },
  } = await createClient().auth.getUser();

  return user ? (
    <div className="flex items-center gap-4 z-30">
     
      <div className="dropdown">
        <button className=" border-none p-2 cursor-pointer text-xs rounded-sm">
          <div className="flex flex-col gap-0 text-left">
            <span className="text-[10px] text-neutral-400 uppercase leading-none tracking-[.03em]">
            {user.email}
            </span>
          </div>
        </button>
        <div className="dropdown-signout flex flex-col justify-between">
            <div className="p-2 bg-white dark:bg-neutral-600 rounded-sm">
            <div>
              <ThemeSwitcher/>
            </div>
            <div className="border-t  border-neutral-200 dark:border-neutral-800 my-2"></div>
              <form action={signOutAction}>
                <Button type="submit" variant={"ghost"} className={"flex flex-row justify-between w-[120px] px-3"} >
                  Sign out
                  <div className="w-4 h-4 ml-2 fill-muted-foreground fill-muted-foreground ">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256">
                      <path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,160H40V56H216V200ZM184,96a8,8,0,0,1-8,8H80a8,8,0,0,1,0-16h96A8,8,0,0,1,184,96Zm0,32a8,8,0,0,1-8,8H80a8,8,0,0,1,0-16h96A8,8,0,0,1,184,128Zm0,32a8,8,0,0,1-8,8H80a8,8,0,0,1,0-16h96A8,8,0,0,1,184,160Z"></path>
                    </svg>
                  </div>
                </Button>
              </form>
            </div>
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
