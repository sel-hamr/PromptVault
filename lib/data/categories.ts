import { cache } from "react";
import { unstable_cache } from "next/cache";
import { db } from "@/lib/db";
import { CACHE_TAGS } from "./cache-tags";

export const fetchCategories = cache(
  unstable_cache(
    async () => db.category.findMany({ orderBy: [{ depth: "asc" }, { name: "asc" }] }),
    ["categories"],
    { tags: [CACHE_TAGS.categories], revalidate: 3600 }
  )
);
