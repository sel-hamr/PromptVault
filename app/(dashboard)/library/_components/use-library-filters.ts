"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export function useLibraryFilters() {
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
      params.delete("page");
      router.replace(`?${params.toString()}`);
    },
    [router, searchParams]
  );

  const q = searchParams.get("q") ?? "";
  const type = searchParams.get("type") ?? "";
  const tag_slug = searchParams.get("tag_slug") ?? "";

  const hasFilters = q.trim() !== "" || type !== "" || tag_slug !== "";

  return { q, type, tag_slug, hasFilters, updateParam };
}
