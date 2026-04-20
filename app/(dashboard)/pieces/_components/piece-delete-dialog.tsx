"use client";

import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { deletePieceAction } from "@/lib/actions/piece.actions";
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

interface PieceDeleteDialogProps {
  pieceId: string;
  pieceTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted: (id: string) => void;
}

export function PieceDeleteDialog({
  pieceId,
  pieceTitle,
  open,
  onOpenChange,
  onDeleted,
}: PieceDeleteDialogProps) {
  const { execute, isPending } = useAction(deletePieceAction, {
    onSuccess: ({ data }) => {
      if (data && "error" in data) {
        toast.error(data.error);
        return;
      }

      toast.success("Piece deleted");
      onDeleted(pieceId);
      onOpenChange(false);
    },
    onError: () => {
      toast.error("Failed to delete piece");
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete piece?</AlertDialogTitle>
          <AlertDialogDescription>
            &ldquo;{pieceTitle}&rdquo; will be permanently deleted. This action
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={isPending}
            onClick={(event) => {
              event.preventDefault();
              execute({ id: pieceId });
            }}
          >
            {isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
