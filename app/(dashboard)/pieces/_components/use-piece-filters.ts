"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { PiecesSortOption, PieceType, PiecesViewMode } from "./types";

export function usePieceFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      value ? params.set(key, value) : params.delete(key);
      router.replace(`?${params.toString()}`);
    },
    [router, searchParams],
  );

  const resetFilters = useCallback(() => {
    router.replace("?");
  }, [router]);

  const q = searchParams.get("q") ?? "";
  const sort = (searchParams.get("sort") ?? "newest") as PiecesSortOption;
  const piece_type = (searchParams.get("piece_type") ?? "") as PieceType | "";
  const view = (searchParams.get("view") ?? "grid") as PiecesViewMode;
  const hasFilters = !!(q || piece_type || sort !== "newest");

  return { q, sort, piece_type, view, hasFilters, updateParam, resetFilters };
}
