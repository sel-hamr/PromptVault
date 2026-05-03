import { cache } from "react";
import { unstable_cache } from "next/cache";
import { db } from "@/lib/db";
import { CACHE_TAGS } from "./cache-tags";

export const fetchTags = cache(
  unstable_cache(
    async (take = 100) => db.tag.findMany({ orderBy: { usage_count: "desc" }, take }),
    ["tags"],
    { tags: [CACHE_TAGS.tags], revalidate: 300 }
  )
);
