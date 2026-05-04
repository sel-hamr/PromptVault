"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { deleteAccountAction } from "@/lib/actions/settings.actions";
import { deleteAccountSchema } from "@/lib/validators";
import { z } from "zod";

type DeleteAccountInput = z.infer<typeof deleteAccountSchema>;

export function DeleteAccountDialog() {
  const [open, setOpen] = React.useState(false);

  const form = useForm<DeleteAccountInput>({
    resolver: zodResolver(deleteAccountSchema),
    defaultValues: { confirmation: "" as "delete my account", current_password: "" },
  });

  const { execute, isPending } = useAction(deleteAccountAction, {
    onSuccess: async ({ data }) => {
      if (data?.error) { toast.error(data.error); return; }
      toast.success("Account deleted");
      await signOut({ callbackUrl: "/" });
    },
    onError: () => toast.error("Something went wrong"),
  });

  function handleOpenChange(v: boolean) {
    setOpen(v);
    if (!v) form.reset();
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          Delete account
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete your account?</AlertDialogTitle>
          <AlertDialogDescription>
            This permanently deletes your account and all data. This action cannot
            be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <form
          onSubmit={form.handleSubmit((values) => execute(values))}
          className="flex flex-col gap-4 py-2"
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="delete-confirmation" className="text-sm">
              Type <span className="font-semibold">delete my account</span> to confirm
            </Label>
            <Input
              id="delete-confirmation"
              {...form.register("confirmation")}
              placeholder="delete my account"
            />
            {form.formState.errors.confirmation && (
              <p className="text-xs text-destructive">
                {form.formState.errors.confirmation.message}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="delete-password">Password</Label>
            <Input
              id="delete-password"
              type="password"
              {...form.register("current_password")}
              placeholder="Your current password"
            />
            {form.formState.errors.current_password && (
              <p className="text-xs text-destructive">
                {form.formState.errors.current_password.message}
              </p>
            )}
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel type="button" disabled={isPending}>
              Cancel
            </AlertDialogCancel>
            <Button
              type="submit"
              variant="destructive"
              disabled={isPending}
            >
              {isPending ? "Deleting…" : "Delete account"}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
