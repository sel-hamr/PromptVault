"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateEmailAction } from "@/lib/actions/settings.actions";
import { updateEmailSchema, type UpdateEmailInput } from "@/lib/validators";

export function EmailForm({ currentEmail }: { currentEmail: string }) {
  const form = useForm<UpdateEmailInput>({
    resolver: zodResolver(updateEmailSchema),
    defaultValues: { email: currentEmail, current_password: "" },
  });

  const { execute, isPending } = useAction(updateEmailAction, {
    onSuccess: ({ data }) => {
      if (data?.error) { toast.error(data.error); return; }
      toast.success("Email updated");
      form.setValue("current_password", "");
    },
    onError: () => toast.error("Something went wrong"),
  });

  return (
    <form
      onSubmit={form.handleSubmit((values) => execute(values))}
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          type="email"
          {...form.register("email")}
          className="max-w-sm"
        />
        {form.formState.errors.email && (
          <p className="text-xs text-destructive">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email-password">Confirm with password</Label>
        <Input
          id="email-password"
          type="password"
          {...form.register("current_password")}
          placeholder="Your current password"
          className="max-w-sm"
        />
        {form.formState.errors.current_password && (
          <p className="text-xs text-destructive">
            {form.formState.errors.current_password.message}
          </p>
        )}
      </div>
      <div>
        <Button type="submit" disabled={isPending} size="sm">
          {isPending ? "Saving…" : "Update email"}
        </Button>
      </div>
    </form>
  );
}
