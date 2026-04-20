"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { createPromptSchema, updatePromptSchema } from "@/lib/validators";
import { createPromptAction, updatePromptAction } from "@/lib/actions/prompt.actions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Category, Tag, PromptWithRelations } from "./types";

type CreateInput = z.infer<typeof createPromptSchema>;

const MODEL_TARGETS = [
  "CHATGPT",
  "CLAUDE",
  "MIDJOURNEY",
  "GEMINI",
  "DALLE",
  "STABLE_DIFFUSION",
  "UNIVERSAL",
] as const;

const VISIBILITIES = ["PUBLIC", "PRIVATE", "UNLISTED"] as const;

interface PromptFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Category[];
  tags: Tag[];
  prompt?: PromptWithRelations;
  onSaved: (prompt: PromptWithRelations) => void;
}

export function PromptFormDialog({
  open,
  onOpenChange,
  categories,
  tags,
  prompt,
  onSaved,
}: PromptFormDialogProps) {
  const isEdit = !!prompt;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateInput>({
    resolver: zodResolver(createPromptSchema),
    defaultValues: {
      title: "",
      description: "",
      content: "",
      model_target: "UNIVERSAL",
      visibility: "PRIVATE",
      category_id: null,
      variables: [],
      tag_ids: [],
    },
  });

  useEffect(() => {
    if (open) {
      if (prompt) {
        reset({
          title: prompt.title,
          description: prompt.description ?? "",
          content: prompt.content,
          model_target: prompt.model_target as CreateInput["model_target"],
          visibility: prompt.visibility as CreateInput["visibility"],
          category_id: prompt.category_id ?? null,
          variables: [],
          tag_ids: prompt.tags.map((t) => t.tag_id),
        });
      } else {
        reset({
          title: "",
          description: "",
          content: "",
          model_target: "UNIVERSAL",
          visibility: "PRIVATE",
          category_id: null,
          variables: [],
          tag_ids: [],
        });
      }
    }
  }, [open, prompt, reset]);

  const { execute: execCreate, isPending: isCreating } = useAction(
    createPromptAction,
    {
      onSuccess: ({ data }) => {
        if (!data || "error" in data) {
          toast.error(("error" in (data ?? {})) ? (data as { error: string }).error : "Failed to create prompt");
          return;
        }
        if ("prompt" in data) {
          toast.success("Prompt created");
          onSaved(data.prompt as PromptWithRelations);
          onOpenChange(false);
        }
      },
      onError: () => toast.error("Failed to create prompt"),
    }
  );

  const { execute: execUpdate, isPending: isUpdating } = useAction(
    updatePromptAction,
    {
      onSuccess: ({ data }) => {
        if (!data || "error" in data) {
          toast.error(("error" in (data ?? {})) ? (data as { error: string }).error : "Failed to update prompt");
          return;
        }
        if ("prompt" in data) {
          toast.success("Prompt updated");
          onSaved(data.prompt as PromptWithRelations);
          onOpenChange(false);
        }
      },
      onError: () => toast.error("Failed to update prompt"),
    }
  );

  const isPending = isCreating || isUpdating;

  const onSubmit = (values: CreateInput) => {
    if (isEdit && prompt) {
      const updateInput = z
        .object({ id: z.string() })
        .merge(updatePromptSchema.omit({ id: true }))
        .parse({ ...values, id: prompt.id });
      execUpdate(updateInput);
    } else {
      execCreate(values);
    }
  };

  const selectedTagIds = watch("tag_ids") ?? [];

  const toggleTag = (tagId: string) => {
    const current = selectedTagIds;
    if (current.includes(tagId)) {
      setValue(
        "tag_ids",
        current.filter((id) => id !== tagId)
      );
    } else {
      setValue("tag_ids", [...current, tagId]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit prompt" : "New prompt"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Give your prompt a title"
              aria-invalid={!!errors.title}
              {...register("title")}
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="Optional short description"
              {...register("description")}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              placeholder="Write your prompt content here…"
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Model</Label>
              <Select
                value={watch("model_target")}
                onValueChange={(v) =>
                  setValue("model_target", v as CreateInput["model_target"])
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  {MODEL_TARGETS.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m.replace("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Visibility</Label>
              <Select
                value={watch("visibility")}
                onValueChange={(v) =>
                  setValue("visibility", v as CreateInput["visibility"])
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select visibility" />
                </SelectTrigger>
                <SelectContent>
                  {VISIBILITIES.map((v) => (
                    <SelectItem key={v} value={v}>
                      {v.charAt(0) + v.slice(1).toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {categories.length > 0 && (
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select
                value={watch("category_id") ?? "none"}
                onValueChange={(v) =>
                  setValue("category_id", v === "none" ? null : v)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="No category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No category</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {tags.length > 0 && (
            <div className="space-y-1.5">
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => {
                  const selected = selectedTagIds.includes(tag.id);
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => toggleTag(tag.id)}
                      className={`inline-flex h-6 cursor-pointer items-center rounded-full border px-2.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                        selected
                          ? "border-transparent bg-primary text-primary-foreground"
                          : "border-border bg-background text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      {tag.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

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
                  ? "Saving…"
                  : "Creating…"
                : isEdit
                ? "Save changes"
                : "Create prompt"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
