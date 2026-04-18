"use client";

import { PasswordInput } from "@/components/forms/password-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLoginForm } from "@/hooks/use-login-form";
import { cn } from "@/lib/utils";

export function LoginForm() {
  const { form, serverError, isLoading, onSubmit } = useLoginForm();

  return (
    <form
      className="grid gap-4"
      noValidate
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <div className="grid gap-1.5">
        <Label htmlFor="email" className="text-[0.8375rem] font-medium">
          Email address
        </Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          className={cn(
            "h-11 text-[0.9rem] placeholder:text-muted-foreground/45",
            "border-border/60 bg-background",
            "focus-visible:border-foreground/25 focus-visible:ring-2 focus-visible:ring-foreground/8",
            "transition-shadow duration-150",
            form.formState.errors.email && "border-destructive",
          )}
          {...form.register("email")}
        />
        {form.formState.errors.email && (
          <p className="text-[0.775rem] text-destructive">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="password" className="text-[0.8375rem] font-medium">
          Password
        </Label>
        <PasswordInput
          id="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          className={cn(form.formState.errors.password && "border-destructive")}
          {...form.register("password")}
        />
        {form.formState.errors.password && (
          <p className="text-[0.775rem] text-destructive">
            {form.formState.errors.password.message}
          </p>
        )}
      </div>

      {serverError && (
        <p className="rounded-md border border-destructive/30 bg-destructive/8 px-3 py-2 text-[0.8125rem] text-destructive">
          {serverError}
        </p>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={isLoading}
        className={cn(
          "mt-1 h-11 w-full text-[0.9rem] font-semibold tracking-[-0.01em]",
          "transition-all duration-150 active:scale-[0.99]",
        )}
      >
        {isLoading ? "Signing in..." : "Log in"}
      </Button>
    </form>
  );
}
