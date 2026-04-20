"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { createPieceSchema } from "@/lib/validators";
import {
  createPieceAction,
  updatePieceAction,
} from "@/lib/actions/piece.actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PIECE_TYPE_OPTIONS, type Piece } from "./types";

interface PieceFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  piece?: Piece;
  onSaved: (piece: Piece) => void;
}

type PieceFormInput = z.infer<typeof createPieceSchema>;

const VISIBILITY_OPTIONS = ["PRIVATE", "UNLISTED", "PUBLIC"] as const;

function extractVariablesFromContent(content: string): Array<{ name: string }> {
  const pattern = /{{\s*([A-Za-z0-9_.-]+)\s*}}/g;
  const names = new Set<string>();

  for (const match of content.matchAll(pattern)) {
    if (match[1]) names.add(match[1]);
  }

  return Array.from(names).map((name) => ({ name }));
}

export function PieceFormDialog({
  open,
  onOpenChange,
  piece,
  onSaved,
}: PieceFormDialogProps) {
  const isEdit = !!piece;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<PieceFormInput>({
    resolver: zodResolver(createPieceSchema),
    defaultValues: {
      title: "",
      content: "",
      piece_type: "CUSTOM",
      visibility: "PRIVATE",
      variables: [],
    },
  });

  useEffect(() => {
    if (!open) return;

    if (piece) {
      reset({
        title: piece.title,
        content: piece.content,
        piece_type: piece.piece_type,
        visibility: piece.visibility,
        variables: [],
      });
      return;
    }

    reset({
      title: "",
      content: "",
      piece_type: "CUSTOM",
      visibility: "PRIVATE",
      variables: [],
    });
  }, [open, piece, reset]);

  const { execute: executeCreate, isPending: isCreating } = useAction(
    createPieceAction,
    {
      onSuccess: ({ data }) => {
        if (!data || "error" in data) {
          toast.error(
            data && "error" in data ? data.error : "Failed to create piece",
          );
          return;
        }

        toast.success("Piece created");
        onSaved(data.piece as Piece);
        onOpenChange(false);
      },
      onError: () => toast.error("Failed to create piece"),
    },
  );

  const { execute: executeUpdate, isPending: isUpdating } = useAction(
    updatePieceAction,
    {
      onSuccess: ({ data }) => {
        if (!data || "error" in data) {
          toast.error(
            data && "error" in data ? data.error : "Failed to update piece",
          );
          return;
        }

        toast.success("Piece updated");
        onSaved(data.piece as Piece);
        onOpenChange(false);
      },
      onError: () => toast.error("Failed to update piece"),
    },
  );

  const isPending = isCreating || isUpdating;

  const onSubmit = (values: PieceFormInput) => {
    const payload = {
      ...values,
      variables: extractVariablesFromContent(values.content),
    };

    if (isEdit && piece) {
      executeUpdate({ id: piece.id, ...payload });
      return;
    }

    executeCreate(payload);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit piece" : "New piece"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="piece-title">Title</Label>
            <Input
              id="piece-title"
              placeholder="Name this reusable piece"
              aria-invalid={!!errors.title}
              {...register("title")}
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select
                value={watch("piece_type")}
                onValueChange={(value) =>
                  setValue("piece_type", value as PieceFormInput["piece_type"])
                }
              >
                <SelectTrigger
                  className="w-full"
                  aria-label="Select piece category"
                >
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {PIECE_TYPE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Visibility</Label>
              <Select
                value={watch("visibility")}
                onValueChange={(value) =>
                  setValue("visibility", value as PieceFormInput["visibility"])
                }
              >
                <SelectTrigger
                  className="w-full"
                  aria-label="Select piece visibility"
                >
                  <SelectValue placeholder="Select visibility" />
                </SelectTrigger>
                <SelectContent>
                  {VISIBILITY_OPTIONS.map((value) => (
                    <SelectItem key={value} value={value}>
                      {value.charAt(0) + value.slice(1).toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="piece-content">Content</Label>
            <Textarea
              id="piece-content"
              placeholder="Write your reusable snippet. Variables like {{topic}} are detected automatically."
              className="min-h-32 font-mono text-sm"
              aria-invalid={!!errors.content}
              {...register("content")}
            />
            {errors.content && (
              <p className="text-xs text-destructive">
                {errors.content.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending
                ? isEdit
                  ? "Saving..."
                  : "Creating..."
                : isEdit
                  ? "Save changes"
                  : "Create piece"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
