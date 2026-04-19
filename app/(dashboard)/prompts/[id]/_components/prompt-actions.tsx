"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { GitFork, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { forkPromptAction } from "@/lib/actions/prompt.actions";
import { PromptDeleteDialog } from "../../_components/prompt-delete-dialog";
import type { PromptDetail } from "./types";
import type { Category, Tag } from "../../_components/types";

interface PromptActionsProps {
  prompt: PromptDetail;
  isOwner: boolean;
  canFork: boolean;
  categories?: Category[];
  tags?: Tag[];
}

export function PromptActions({
  prompt,
  isOwner,
  canFork,
  categories,
  tags,
}: PromptActionsProps) {
  const router = useRouter();
  const [forkOpen, setForkOpen] = useState(false);
  const [forkVisibility, setForkVisibility] = useState<
    "PUBLIC" | "PRIVATE" | "UNLISTED"
  >("PRIVATE");
  const [deleteOpen, setDeleteOpen] = useState(false);

  const { execute: execFork, isPending: isForking } = useAction(
    forkPromptAction,
    {
      onSuccess: ({ data }) => {
        if (!data || "error" in data) {
          toast.error(
            data && "error" in data
              ? (data as { error: string }).error
              : "Failed to fork prompt",
          );
          return;
        }
        toast.success("Prompt forked");
        setForkOpen(false);
        router.push(`/prompts/${data.prompt.id}`);
      },
      onError: () => toast.error("Failed to fork prompt"),
    },
  );

  if (!isOwner && !canFork) return null;

  return (
    <>
      <div className="rounded-lg border border-border bg-card p-4 space-y-2">
        {canFork && (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setForkOpen(true)}
          >
            <GitFork className="mr-2 size-4" aria-hidden />
            Fork prompt
          </Button>
        )}
        {isOwner && (
          <>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push(`/prompts/${prompt.id}/edit`)}
            >
              <Pencil className="mr-2 size-4" aria-hidden />
              Edit prompt
            </Button>
            <Button
              variant="outline"
              className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 className="mr-2 size-4" aria-hidden />
              Delete prompt
            </Button>
          </>
        )}
      </div>

      <Dialog open={forkOpen} onOpenChange={setForkOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Fork prompt</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Label htmlFor="fork-visibility">Visibility for your fork</Label>
            <Select
              value={forkVisibility}
              onValueChange={(v) =>
                setForkVisibility(v as typeof forkVisibility)
              }
            >
              <SelectTrigger id="fork-visibility" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PRIVATE">Private</SelectItem>
                <SelectItem value="PUBLIC">Public</SelectItem>
                <SelectItem value="UNLISTED">Unlisted</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setForkOpen(false)}
              disabled={isForking}
            >
              Cancel
            </Button>
            <Button
              onClick={() =>
                execFork({ id: prompt.id, visibility: forkVisibility })
              }
              disabled={isForking}
            >
              {isForking ? "Forking…" : "Fork"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <PromptDeleteDialog
        promptId={prompt.id}
        promptTitle={prompt.title}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onDeleted={() => router.push("/prompts")}
      />
    </>
  );
}
