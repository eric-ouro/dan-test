import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import CandyImages from "@/components/candy-images";

export default function Login({ searchParams }: { searchParams: Message }) {
  if ("message" in searchParams) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <>
      <form className="flex flex-col z-20 min-w-64 max-w-64 mx-auto p-6 bg-[#1c1c1c] rounded-lg shadow-lg sans">
        <h1 className="text-4xl font-medium mb-2 text-background tracking-[-0.07em]">Sign in</h1>
        <p className="text-sm text-background">
          Don't have an account?{" "}
          <Link className="text-background font-medium underline" href="/sign-up">
            Sign up
          </Link>
        </p>
        <div className="flex flex-col gap-1 [&>input]:mb-3 mt-8">
          <hr className="border-background/50 mb-6"></hr>
          <Label htmlFor="email" className="text-background">Email</Label>
          <Input name="email" placeholder="you@example.com" required />
          <Label htmlFor="password" className="text-background">Password</Label>
          <Input
            type="password"
            name="password"
            placeholder="Your password"
            minLength={6}
            required
          />
          <SubmitButton formAction={signInAction} pendingText="Signing in..." className="mt-3 text-[#1c1c1c] bg-[#9CC5D4] hover:bg-[#9CC5D4dd]  tracking-[-0.03em]">
            Sign in
          </SubmitButton>
          <FormMessage message={searchParams} />
        </div>
      </form>
      <CandyImages />
    
      <div className="sans text-xs w-full flex justify-center opacity-30">
        Ouro Ciruclarity © 2025 – All rights reserved
      </div>
    </>
  );
}
