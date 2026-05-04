"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { changePasswordAction } from "@/lib/actions/settings.actions";
import { changePasswordSchema, type ChangePasswordInput } from "@/lib/validators";

export function PasswordForm() {
  const form = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { current_password: "", new_password: "", confirm_password: "" },
  });

  const { execute, isPending } = useAction(changePasswordAction, {
    onSuccess: ({ data }) => {
      if (data?.error) { toast.error(data.error); return; }
      toast.success("Password changed");
      form.reset();
    },
    onError: () => toast.error("Something went wrong"),
  });

  return (
    <form
      onSubmit={form.handleSubmit((values) => execute(values))}
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="current-password">Current password</Label>
        <Input
          id="current-password"
          type="password"
          {...form.register("current_password")}
          className="max-w-sm"
        />
        {form.formState.errors.current_password && (
          <p className="text-xs text-destructive">
            {form.formState.errors.current_password.message}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="new-password">New password</Label>
        <Input
          id="new-password"
          type="password"
          {...form.register("new_password")}
          className="max-w-sm"
        />
        {form.formState.errors.new_password && (
          <p className="text-xs text-destructive">
            {form.formState.errors.new_password.message}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="confirm-password">Confirm new password</Label>
        <Input
          id="confirm-password"
          type="password"
          {...form.register("confirm_password")}
          className="max-w-sm"
        />
        {form.formState.errors.confirm_password && (
          <p className="text-xs text-destructive">
            {form.formState.errors.confirm_password.message}
          </p>
        )}
      </div>
      <div>
        <Button type="submit" disabled={isPending} size="sm">
          {isPending ? "Changing…" : "Change password"}
        </Button>
      </div>
    </form>
  );
}
