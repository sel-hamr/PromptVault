import Link from "next/link";

import { SocialAuthButtons } from "@/components/forms/social-auth-buttons";
import { PasswordInput } from "@/components/forms/password-input";
import { AuthShell } from "@/components/layouts/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Log in",
  description: "Log in to continue to your workspace.",
};

export default function LoginPage() {
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to your vault — your prompts, pieces, and compositions are waiting."
      footer={
        <>
          Don&rsquo;t have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-foreground underline-offset-4 hover:underline"
          >
            Sign up free
          </Link>
        </>
      }
    >
      <SocialAuthButtons />

      {/* Divider */}
      <div className="my-5 flex items-center gap-3">
        <span className="h-px flex-1 bg-border/60" />
        <span className="text-[0.75rem] font-medium text-muted-foreground/60">
          or continue with email
        </span>
        <span className="h-px flex-1 bg-border/60" />
      </div>

      <form className="grid gap-4" noValidate>
        <div className="grid gap-1.5">
          <Label htmlFor="email" className="text-[0.8375rem] font-medium">
            Email address
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            className={cn(
              "h-11 text-[0.9rem] placeholder:text-muted-foreground/45",
              "border-border/60 bg-background",
              "focus-visible:border-foreground/25 focus-visible:ring-2 focus-visible:ring-foreground/8",
              "transition-shadow duration-150"
            )}
            required
          />
        </div>

        <div className="grid gap-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-[0.8375rem] font-medium">
              Password
            </Label>
            <Link
              href="/forgot-password"
              className="text-[0.775rem] font-medium text-muted-foreground/80 underline-offset-4 hover:text-foreground hover:underline transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <PasswordInput
            id="password"
            name="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            required
          />
        </div>

        <Button
          type="submit"
          size="lg"
          className={cn(
            "mt-1 h-11 w-full text-[0.9rem] font-semibold tracking-[-0.01em]",
            "transition-all duration-150 active:scale-[0.99]"
          )}
        >
          Log in
        </Button>
      </form>
    </AuthShell>
  );
}
