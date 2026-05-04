"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateUsernameAction } from "@/lib/actions/settings.actions";
import { updateUsernameSchema, type UpdateUsernameInput } from "@/lib/validators";

export function UsernameForm({ currentUsername }: { currentUsername: string }) {
  const { update } = useSession();

  const form = useForm<UpdateUsernameInput>({
    resolver: zodResolver(updateUsernameSchema),
    defaultValues: { username: currentUsername },
  });

  const { execute, isPending } = useAction(updateUsernameAction, {
    onSuccess: async ({ data }) => {
      if (data?.error) {
        toast.error(data.error);
        return;
      }
      await update({ name: form.getValues("username") });
      toast.success("Username updated");
    },
    onError: () => toast.error("Something went wrong"),
  });

  return (
    <form
      onSubmit={form.handleSubmit((values) => execute(values))}
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          {...form.register("username")}
          placeholder="your_username"
          className="max-w-sm"
        />
        {form.formState.errors.username && (
          <p className="text-xs text-destructive">
            {form.formState.errors.username.message}
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          Only lowercase letters, numbers, and underscores. 3–30 characters.
        </p>
      </div>
      <div>
        <Button type="submit" disabled={isPending} size="sm">
          {isPending ? "Saving…" : "Save username"}
        </Button>
      </div>
    </form>
  );
}
