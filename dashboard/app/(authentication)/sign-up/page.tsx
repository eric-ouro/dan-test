import { signUpAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import CandyImages from "@/components/candy-images";

export default function Signup({ searchParams }: { searchParams: Message }) {
  if ("message" in searchParams) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col z-20 min-w-64 max-w-64 mx-auto p-6 bg-[#1c1c1c] dark:bg-[#313131FF] rounded-lg shadow-lg sans">
        <form className="z-10">
          <h1 className="text-4xl font-medium mb-2 text-background dark:text-foreground tracking-[-0.07em]">Sign up</h1>
          <p className="text-sm text-background dark:text-foreground">
            Already have an account?{" "}
            <Link className="text-background dark:text-foreground font-medium underline" href="/sign-in">
              Sign in
            </Link>
          </p>
          <div className="flex flex-col gap-1 [&>input]:mb-3 mt-6">
            <hr className="border-foreground/50 mb-6"></hr>
            <Label htmlFor="email" className="text-foreground">Email</Label>
            <Input name="email" className="dark:bg-foreground/10 dark:text-foreground" placeholder="you@example.com" required />
            <Label htmlFor="password" className="text-foreground">Password</Label>
            <Input
              type="password"
              name="password"
              placeholder="Your password"
              minLength={6}
              required
              className="dark:bg-foreground/10 dark:text-foreground"
            />
            <SubmitButton formAction={signUpAction} pendingText="Signing up..." className="mt-3 text-[#1c1c1c] bg-[#C5E6C3] hover:bg-[#C5E6C3dd] tracking-[-0.03em]">
              Sign up
            </SubmitButton>
            <FormMessage message={searchParams} />
          </div>
        </form>
      </div>
      <CandyImages />
    
      <div className="sans text-xs w-full flex justify-center opacity-30">
        Ouro Ciruclarity © 2025 – All rights reserved
      </div>
    
    </>
  );
}
