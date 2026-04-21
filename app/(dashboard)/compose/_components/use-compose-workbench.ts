"use client";

import { useMemo, useRef, useState, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { createPromptAction } from "@/lib/actions/prompt.actions";
import { createTagAction } from "@/lib/actions/tag.actions";
import { extractVariables } from "@/lib/markdown";
import type { Category, Tag } from "../../prompts/_components/types";
import type { PieceInsertHandle } from "../../prompts/[id]/edit/_components/markdown-editor";
import {
  TYPE_FILTERS,
  type ComposePiece,
  type ModelTarget,
  type Visibility,
} from "./compose-constants";

export interface UseComposeWorkbenchInput {
  initialPieces: ComposePiece[];
  categories: Category[];
  tags: Tag[];
}

export function useComposeWorkbench({
  initialPieces,
  tags,
}: UseComposeWorkbenchInput) {
  const router = useRouter();
  const editorRef = useRef<PieceInsertHandle | null>(null);

  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] =
    useState<(typeof TYPE_FILTERS)[number]>("ALL");
  const [content, setContent] = useState("");

  const [title, setTitle] = useState("Composed Prompt");
  const [description, setDescription] = useState(
    "Built from reusable prompt pieces in Compose.",
  );
  const [modelTarget, setModelTarget] = useState<ModelTarget>("UNIVERSAL");
  const [visibility, setVisibility] = useState<Visibility>("PRIVATE");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [availableTags, setAvailableTags] = useState<Tag[]>(tags);
  const [tagIds, setTagIds] = useState<string[]>([]);
  const [newTagName, setNewTagName] = useState("");

  const isContentEmpty = content.trim().length === 0;

  const detectedVariables = useMemo(() => extractVariables(content), [content]);

  const filteredPieces = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return initialPieces.filter((piece) => {
      const typeMatch = typeFilter === "ALL" || piece.piece_type === typeFilter;
      const queryMatch =
        normalizedQuery.length === 0 ||
        piece.title.toLowerCase().includes(normalizedQuery) ||
        piece.content.toLowerCase().includes(normalizedQuery);
      return typeMatch && queryMatch;
    });
  }, [initialPieces, query, typeFilter]);

  const { execute, isPending } = useAction(createPromptAction, {
    onSuccess: ({ data }) => {
      if (!data || "error" in data) {
        toast.error(
          data && "error" in data
            ? (typeof data.error === "string" ? data.error : "Failed to save prompt")
            : "Failed to save prompt",
        );
        return;
      }
      if ("prompt" in data) {
        toast.success("Prompt saved from composer");
        router.push(`/prompts/${data.prompt.id}`);
      }
    },
    onError: () => toast.error("Failed to save prompt"),
  });

  const { execute: executeCreateTag, isPending: isCreatingTag } = useAction(
    createTagAction,
    {
      onSuccess: ({ data }) => {
        if (!data || "error" in data) {
          toast.error(
            data && "error" in data
              ? (typeof data.error === "string" ? data.error : "Failed to create tag")
              : "Failed to create tag",
          );
          return;
        }

        if ("tag" in data) {
          setAvailableTags((prev) => {
            if (prev.some((tag) => tag.id === data.tag.id)) return prev;
            return [data.tag, ...prev];
          });
          setTagIds((prev) =>
            prev.includes(data.tag.id) ? prev : [...prev, data.tag.id],
          );
          setNewTagName("");
          toast.success("Tag added");
        }
      },
      onError: () => toast.error("Failed to create tag"),
    },
  );

  const insertPiece = (piece: ComposePiece) => {
    editorRef.current?.insert(piece.content);
  };

  const appendPiece = (piece: ComposePiece) => {
    editorRef.current?.append(piece.content);
  };

  const toggleTag = (tagId: string) => {
    setTagIds((prev) =>
      prev.includes(tagId)
        ? prev.filter((current) => current !== tagId)
        : [...prev, tagId],
    );
  };

  const handleAddTag = () => {
    const value = newTagName.trim();
    if (value.length === 0) return;

    const existing = availableTags.find(
      (tag) => tag.name.toLowerCase() === value.toLowerCase(),
    );

    if (existing) {
      setTagIds((prev) =>
        prev.includes(existing.id) ? prev : [...prev, existing.id],
      );
      setNewTagName("");
      return;
    }

    executeCreateTag({ name: value });
  };

  const handleTagInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    handleAddTag();
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success("Composed prompt copied");
    } catch {
      toast.error("Unable to copy");
    }
  };

  const handleSave = () => {
    if (title.trim().length === 0) {
      toast.error("Please add a title before saving");
      return;
    }
    if (isContentEmpty) {
      toast.error("Prompt content is empty");
      return;
    }

    execute({
      title: title.trim(),
      description: description.trim() || undefined,
      content,
      model_target: modelTarget,
      visibility,
      category_id: categoryId,
      variables: detectedVariables.map((name) => ({ name })),
      tag_ids: tagIds,
    });
  };

  return {
    editorRef,
    query,
    setQuery,
    typeFilter,
    setTypeFilter,
    content,
    setContent,
    title,
    setTitle,
    description,
    setDescription,
    modelTarget,
    setModelTarget,
    visibility,
    setVisibility,
    categoryId,
    setCategoryId,
    availableTags,
    tagIds,
    newTagName,
    setNewTagName,
    isContentEmpty,
    filteredPieces,
    isPending,
    isCreatingTag,
    insertPiece,
    appendPiece,
    toggleTag,
    handleAddTag,
    handleTagInputKeyDown,
    handleCopy,
    handleSave,
  };
}
