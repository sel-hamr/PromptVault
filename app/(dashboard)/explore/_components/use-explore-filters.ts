"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import type {
  ExploreSortOption,
  ExploreViewMode,
  ExploreVisibility,
} from "./types";

export function useExploreFilters() {
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
    [router, searchParams],
  );

  const q = searchParams.get("q") ?? "";
  const category_id = searchParams.get("category_id") ?? "";
  const model_target = searchParams.get("model_target") ?? "";
  const visibility = (searchParams.get("visibility") ??
    "PUBLIC") as ExploreVisibility;
  const sort = (searchParams.get("sort") ?? "newest") as ExploreSortOption;
  const view = (searchParams.get("view") ?? "grid") as ExploreViewMode;

  const hasFilters =
    q.trim() !== "" ||
    category_id !== "" ||
    model_target !== "" ||
    visibility !== "PUBLIC" ||
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
