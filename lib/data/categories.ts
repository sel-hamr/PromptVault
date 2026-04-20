import { db } from "@/lib/db";

export async function fetchCategories() {
  return db.category.findMany({
    orderBy: [{ depth: "asc" }, { name: "asc" }],
  });
}
