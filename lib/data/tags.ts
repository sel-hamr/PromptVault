import { db } from "@/lib/db";

export async function fetchTags(take = 100) {
  return db.tag.findMany({
    orderBy: { usage_count: "desc" },
    take,
  });
}
