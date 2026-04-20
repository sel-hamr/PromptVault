"use client";

import { PasswordInput } from "@/components/forms/password-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRegisterForm } from "@/hooks/use-register-form";
import { cn } from "@/lib/utils";

export function RegisterForm() {
  const { form, serverError, isLoading, onSubmit } = useRegisterForm();

  return (
    <form
      className="grid gap-4"
      noValidate
      onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}
    >
      <div className="grid gap-1.5">
        <Label htmlFor="name" className="text-[0.8375rem] font-medium">
          Full name
        </Label>
        <Input
          id="name"
          type="text"
          autoComplete="name"
          placeholder="Ada Lovelace"
          className={cn(
            "h-11 text-[0.9rem] placeholder:text-muted-foreground/45",
            "border-border/60 bg-background",
            "focus-visible:border-foreground/25 focus-visible:ring-2 focus-visible:ring-foreground/8",
            "transition-shadow duration-150",
            form.formState.errors.name && "border-destructive",
          )}
          {...form.register("name")}
        />
        {form.formState.errors.name && (
          <p className="text-[0.775rem] text-destructive">
            {form.formState.errors.name.message}
          </p>
        )}
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="email" className="text-[0.8375rem] font-medium">
          Work email
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
          autoComplete="new-password"
          placeholder="At least 8 characters"
          showStrengthHint
          className={cn(form.formState.errors.password && "border-destructive")}
          {...form.register("password")}
        />
        {form.formState.errors.password && (
          <p className="text-[0.775rem] text-destructive">
            {form.formState.errors.password.message}
          </p>
        )}
      </div>

      <div className="grid gap-1.5">
        <Label
          htmlFor="confirmPassword"
          className="text-[0.8375rem] font-medium"
        >
          Confirm password
        </Label>
        <PasswordInput
          id="confirmPassword"
          autoComplete="new-password"
          placeholder="Repeat your password"
          className={cn(
            form.formState.errors.confirmPassword && "border-destructive",
          )}
          {...form.register("confirmPassword")}
        />
        {form.formState.errors.confirmPassword && (
          <p className="text-[0.775rem] text-destructive">
            {form.formState.errors.confirmPassword.message}
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
        {isLoading ? "Creating account..." : "Create account"}
      </Button>
    </form>
  );
}
