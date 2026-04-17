import Link from "next/link";

import { SocialAuthButtons } from "@/components/forms/social-auth-buttons";
import { PasswordInput } from "@/components/forms/password-input";
import { AuthShell } from "@/components/layouts/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Create your account",
  description: "Create an account to get started.",
};

export default function RegisterPage() {
  return (
    <AuthShell
      title="Start your vault"
      subtitle="Free forever for personal libraries. No credit card required."
      footer={
        <>
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-foreground underline-offset-4 hover:underline"
          >
            Log in
          </Link>
        </>
      }
    >
      <SocialAuthButtons />

      {/* Divider */}
      <div className="my-5 flex items-center gap-3">
        <span className="h-px flex-1 bg-border/60" />
        <span className="text-[0.75rem] font-medium text-muted-foreground/60">
          or sign up with email
        </span>
        <span className="h-px flex-1 bg-border/60" />
      </div>

      <form className="grid gap-4" noValidate>
        <div className="grid gap-1.5">
          <Label htmlFor="name" className="text-[0.8375rem] font-medium">
            Full name
          </Label>
          <Input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Ada Lovelace"
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
          <Label htmlFor="email" className="text-[0.8375rem] font-medium">
            Work email
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
          <Label htmlFor="password" className="text-[0.8375rem] font-medium">
            Password
          </Label>
          <PasswordInput
            id="password"
            name="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            showStrengthHint
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
          Create account
        </Button>

        <p className="text-[0.75rem] leading-relaxed text-muted-foreground">
          By creating an account you agree to our{" "}
          <Link
            href="/terms"
            className="font-medium text-foreground/80 underline-offset-4 hover:underline"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="font-medium text-foreground/80 underline-offset-4 hover:underline"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </form>
    </AuthShell>
  );
}
