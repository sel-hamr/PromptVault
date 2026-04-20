"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import type { PromptsViewMode, SortOption } from "./types";

export function usePromptFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.replace(`?${params.toString()}`);
    },
    [router, searchParams]
  );

  const q = searchParams.get("q") ?? "";
  const category_id = searchParams.get("category_id") ?? "";
  const model_target = searchParams.get("model_target") ?? "";
  const visibility = searchParams.get("visibility") ?? "";
  const sort = (searchParams.get("sort") ?? "newest") as SortOption;
  const view = (searchParams.get("view") ?? "grid") as PromptsViewMode;

  const hasFilters =
    q.trim() !== "" ||
    category_id !== "" ||
    model_target !== "" ||
    visibility !== "" ||
    sort !== "newest";

  return {
    q,
    category_id,
    model_target,
    visibility,
    sort,
    view,
    hasFilters,
    updateParam,
  };
}
