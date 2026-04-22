"use client";

import { useState, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import {
  createReferenceAction,
  updateReferenceAction,
} from "@/lib/actions/library.actions";
import { createTagAction } from "@/lib/actions/tag.actions";
import {
  createReferenceSchema,
  updateReferenceSchema,
  type CreateReferenceInput,
  type UpdateReferenceInput,
} from "@/lib/validators";
import type { ReferenceWithRelations } from "@/lib/data/library";

export type ReferenceTag = { id: string; name: string; slug: string };

type ReferenceFormValues = CreateReferenceInput & { id?: string };

interface UseReferenceFormParams {
  reference?: ReferenceWithRelations;
  initialTags: ReferenceTag[];
}

export function useReferenceForm({
  reference,
  initialTags,
}: UseReferenceFormParams) {
  const router = useRouter();
  const isEdit = Boolean(reference);

  const [availableTags, setAvailableTags] =
    useState<ReferenceTag[]>(initialTags);
  const [newTagName, setNewTagName] = useState("");

  const defaultTagIds = reference?.tags.map((tag) => tag.tag_id) ?? [];

  const form = useForm<ReferenceFormValues>({
    resolver: zodResolver(
      isEdit ? updateReferenceSchema : createReferenceSchema,
    ),
    defaultValues: {
      ...(isEdit ? { id: reference.id } : {}),
      title: reference?.title ?? "",
      content: reference?.content ?? "",
      description: reference?.description ?? "",
      source_url: reference?.source_url ?? "",
      type: (reference?.type ?? "DOC") as CreateReferenceInput["type"],
      tag_ids: defaultTagIds,
    },
  });

  const selectedTagIds = form.watch("tag_ids") ?? [];

  const { execute: createRef, isPending: isCreating } = useAction(
    createReferenceAction,
    {
      onSuccess: ({ data }) => {
        const referenceId = data?.reference.id;
        if (!referenceId) {
          toast.error("Failed to save reference");
          return;
        }

        toast.success("Reference saved");
        router.push(`/library/${referenceId}`);
      },
      onError: () => toast.error("Failed to save reference"),
    },
  );

  const { execute: updateRef, isPending: isUpdating } = useAction(
    updateReferenceAction,
    {
      onSuccess: () => {
        if (!reference) {
          toast.error("Failed to update reference");
          return;
        }

        toast.success("Reference updated");
        router.push(`/library/${reference.id}`);
      },
      onError: () => toast.error("Failed to update reference"),
    },
  );

  const { execute: createTag, isPending: isCreatingTag } = useAction(
    createTagAction,
    {
      onSuccess: ({ data }) => {
        if (!data || !("tag" in data)) return;

        setAvailableTags((prev) => {
          if (prev.some((tag) => tag.id === data.tag.id)) return prev;
          return [data.tag, ...prev];
        });

        const currentTagIds = form.getValues("tag_ids") ?? [];
        if (!currentTagIds.includes(data.tag.id)) {
          form.setValue("tag_ids", [...currentTagIds, data.tag.id], {
            shouldDirty: true,
          });
        }

        setNewTagName("");
        toast.success("Tag added");
      },
      onError: () => toast.error("Failed to create tag"),
    },
  );

  const isPending = isCreating || isUpdating;

  const onSubmit = form.handleSubmit((values) => {
    if (isEdit) {
      updateRef(values as UpdateReferenceInput);
      return;
    }

    createRef(values as CreateReferenceInput);
  });

  const toggleTag = (tagId: string) => {
    const currentTagIds = form.getValues("tag_ids") ?? [];
    const nextTagIds = currentTagIds.includes(tagId)
      ? currentTagIds.filter((id) => id !== tagId)
      : [...currentTagIds, tagId];

    form.setValue("tag_ids", nextTagIds, { shouldDirty: true });
  };

  const handleAddTag = () => {
    const value = newTagName.trim();
    if (!value) return;

    const existing = availableTags.find(
      (tag) => tag.name.toLowerCase() === value.toLowerCase(),
    );
    if (existing) {
      const currentTagIds = form.getValues("tag_ids") ?? [];
      if (!currentTagIds.includes(existing.id)) {
        form.setValue("tag_ids", [...currentTagIds, existing.id], {
          shouldDirty: true,
        });
      }

      setNewTagName("");
      return;
    }

    createTag({ name: value });
  };

  const handleTagInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAddTag();
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return {
    form,
    isEdit,
    isPending,
    isCreatingTag,
    availableTags,
    newTagName,
    selectedTagIds,
    setNewTagName,
    onSubmit,
    toggleTag,
    handleAddTag,
    handleTagInputKeyDown,
    handleCancel,
  };
}
