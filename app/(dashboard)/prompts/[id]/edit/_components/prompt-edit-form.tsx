"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { updatePromptAction } from "@/lib/actions/prompt.actions";
import { updatePromptSchema } from "@/lib/validators";
import { extractVariables } from "@/lib/markdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { MarkdownEditor, type PieceInsertHandle } from "./markdown-editor";
import { VariablesList } from "./variables-list";
import { PiecesPanel } from "./pieces-panel";
import { DirtyGuard } from "./dirty-guard";
import type { PromptDetail } from "../../_components/types";
import type { Category, Tag } from "../../../_components/types";
import type { EditPiece } from "./types";

type FormValues = Omit<z.infer<typeof updatePromptSchema>, "id">;

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

const SIDEBAR_TOP = "calc(var(--header-height, 57px) + 1px)";
const SIDEBAR_MAX_H = "calc(100vh - var(--header-height, 57px) - 2rem)";

interface Props {
  prompt: PromptDetail;
  categories: Category[];
  tags: Tag[];
  initialPieces: EditPiece[];
}

export function PromptEditForm({ prompt, categories, tags, initialPieces }: Props) {
  const router = useRouter();
  const editorRef = useRef<PieceInsertHandle>(null);
  const [discardOpen, setDiscardOpen] = useState(false);

  const promptTags = (prompt.tags ?? []).map((t) => t.tag_id);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(updatePromptSchema.omit({ id: true })),
    defaultValues: {
      title: prompt.title,
      description: prompt.description ?? "",
      content: prompt.content,
      model_target: prompt.model_target as FormValues["model_target"],
      visibility: prompt.visibility as FormValues["visibility"],
      category_id: prompt.category_id ?? null,
      variables: [],
      tag_ids: promptTags,
    },
  });

  const content = watch("content") ?? "";
  const selectedTagIds = watch("tag_ids") ?? [];

  const { execute, isPending } = useAction(updatePromptAction, {
    onSuccess: ({ data }) => {
      if (!data || "error" in data) {
        toast.error(
          data && "error" in data
            ? (data as { error: string }).error
            : "Failed to update prompt",
        );
        return;
      }
      if ("prompt" in data) {
        toast.success("Prompt updated");
        reset(undefined, { keepValues: true });
        router.push(`/prompts/${prompt.id}`);
      }
    },
    onError: () => toast.error("Failed to update prompt"),
  });

  const onSubmit = (values: FormValues) => {
    const variables = extractVariables(values.content ?? "").map((name) => ({ name }));
    execute({ ...values, id: prompt.id, variables });
  };

  const toggleTag = (tagId: string) => {
    const current = selectedTagIds;
    setValue(
      "tag_ids",
      current.includes(tagId) ? current.filter((id) => id !== tagId) : [...current, tagId],
      { shouldDirty: true },
    );
  };

  const handleCancel = () => {
    if (isDirty) {
      setDiscardOpen(true);
    } else {
      router.push(`/prompts/${prompt.id}`);
    }
  };

  return (
    <>
      <DirtyGuard
        isDirty={isDirty}
        open={discardOpen}
        onOpenChange={setDiscardOpen}
        onConfirm={() => router.push(`/prompts/${prompt.id}`)}
      />

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Sticky top bar */}
        <div className="sticky top-0 z-10 border-b border-border bg-background">
          <div className="container max-w-[1600px] flex items-center justify-between py-3 gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-base font-semibold">Edit prompt</h1>
              <p className="text-xs text-muted-foreground truncate">{prompt.title}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCancel}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={isPending}>
                {isPending ? "Saving…" : "Save changes"}
              </Button>
            </div>
          </div>
        </div>

        {/* Three-column layout */}
        <div className="container max-w-[1600px] py-6">
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[240px_1fr_300px]">

            {/* ── Left: Settings sidebar ─────────────────────────── */}
            <aside
              className="space-y-4 xl:sticky xl:self-start xl:overflow-y-auto"
              style={{ top: SIDEBAR_TOP, maxHeight: SIDEBAR_MAX_H }}
            >
              <div className="rounded-lg border border-border bg-card p-4 space-y-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Settings
                </p>

                <div className="space-y-1.5">
                  <Label htmlFor="model_target">Model</Label>
                  <Controller
                    name="model_target"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger id="model_target" className="w-full">
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
                    )}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="visibility">Visibility</Label>
                  <Controller
                    name="visibility"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger id="visibility" className="w-full">
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
                    )}
                  />
                </div>

                {categories.length > 0 && (
                  <div className="space-y-1.5">
                    <Label htmlFor="category_id">Category</Label>
                    <Controller
                      name="category_id"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value ?? "none"}
                          onValueChange={(v) => field.onChange(v === "none" ? null : v)}
                        >
                          <SelectTrigger id="category_id" className="w-full">
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
                      )}
                    />
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

                {tags.length === 0 && (
                  <p className="text-xs text-muted-foreground italic">No tags available</p>
                )}
              </div>

              {/* Variables */}
              <div className="rounded-lg border border-border bg-card p-4">
                <VariablesList content={content} />
              </div>
            </aside>

            {/* ── Center: Main editor ────────────────────────────── */}
            <div className="min-w-0 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Give your prompt a title"
                  aria-invalid={!!errors.title}
                  {...register("title")}
                />
                {errors.title && (
                  <p role="alert" className="text-xs text-destructive">
                    {errors.title.message}
                  </p>
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
                <Label>Content</Label>
                <Controller
                  name="content"
                  control={control}
                  render={({ field }) => (
                    <MarkdownEditor
                      ref={editorRef}
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      error={errors.content?.message}
                      minHeight={480}
                    />
                  )}
                />
              </div>
            </div>

            {/* ── Right: Pieces sidebar (always visible) ─────────── */}
            <aside
              className="xl:sticky xl:self-start xl:overflow-y-auto"
              style={{ top: SIDEBAR_TOP, maxHeight: SIDEBAR_MAX_H }}
            >
              <div className="rounded-lg border border-border bg-card p-4 h-full">
                <PiecesPanel
                  initialPieces={
                    initialPieces as {
                      id: string;
                      title: string;
                      content: string;
                      piece_type: string;
                    }[]
                  }
                  editorRef={editorRef}
                />
              </div>
            </aside>

          </div>
        </div>
      </form>
    </>
  );
}
