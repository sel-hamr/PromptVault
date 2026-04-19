"use client";

import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { deletePromptAction } from "@/lib/actions/prompt.actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface PromptDeleteDialogProps {
  promptId: string;
  promptTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted: (id: string) => void;
}

export function PromptDeleteDialog({
  promptId,
  promptTitle,
  open,
  onOpenChange,
  onDeleted,
}: PromptDeleteDialogProps) {
  const { execute, isPending } = useAction(deletePromptAction, {
    onSuccess: ({ data }) => {
      if (data && "error" in data) {
        toast.error(data.error);
        return;
      }
      toast.success("Prompt deleted");
      onDeleted(promptId);
      onOpenChange(false);
    },
    onError: () => {
      toast.error("Failed to delete prompt");
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete prompt?</AlertDialogTitle>
          <AlertDialogDescription>
            &ldquo;{promptTitle}&rdquo; will be permanently deleted. This action
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={isPending}
            onClick={(e) => {
              e.preventDefault();
              execute({ id: promptId });
            }}
          >
            {isPending ? "Deleting…" : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
