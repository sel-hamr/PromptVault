"use server";

import { revalidatePath } from "next/cache";
import slugify from "slugify";
import { db } from "@/lib/db";
import { actionClient, authActionClient } from "@/lib/safe-action";
import {
  createCategorySchema,
  updateCategorySchema,
  categoryIdSchema,
} from "@/lib/validators";

async function uniqueSlug(name: string) {
  const base = slugify(name, { lower: true, strict: true });
  let slug = base;
  let n = 1;
  while (await db.category.findUnique({ where: { slug } })) {
    n += 1;
    slug = `${base}-${n}`;
  }
  return slug;
}

export const createCategoryAction = authActionClient
  .schema(createCategorySchema)
  .action(async ({ parsedInput: { name, parent_id } }) => {
    let depth = 0;
    if (parent_id) {
      const parent = await db.category.findUnique({ where: { id: parent_id } });
      if (!parent) return { error: "Parent category not found" };
      depth = parent.depth + 1;
    }

    const slug = await uniqueSlug(name);
    const category = await db.category.create({
      data: { name, slug, parent_id: parent_id ?? null, depth },
    });

    revalidatePath("/dashboard");
    return { category };
  });

export const updateCategoryAction = authActionClient
  .schema(updateCategorySchema)
  .action(async ({ parsedInput: { id, name, parent_id } }) => {
    const existing = await db.category.findUnique({ where: { id } });
    if (!existing) return { error: "Category not found" };

    let depth = existing.depth;
    if (parent_id !== undefined) {
      if (parent_id === id) return { error: "Category cannot be its own parent" };
      if (parent_id) {
        const parent = await db.category.findUnique({ where: { id: parent_id } });
        if (!parent) return { error: "Parent category not found" };
        depth = parent.depth + 1;
      } else {
        depth = 0;
      }
    }

    const category = await db.category.update({
      where: { id },
      data: {
        ...(name ? { name, slug: await uniqueSlug(name) } : {}),
        ...(parent_id !== undefined ? { parent_id, depth } : {}),
      },
    });

    revalidatePath("/dashboard");
    return { category };
  });

export const deleteCategoryAction = authActionClient
  .schema(categoryIdSchema)
  .action(async ({ parsedInput: { id } }) => {
    const children = await db.category.count({ where: { parent_id: id } });
    if (children > 0) return { error: "Cannot delete a category with subcategories" };

    await db.prompt.updateMany({
      where: { category_id: id },
      data: { category_id: null },
    });
    await db.category.delete({ where: { id } });

    revalidatePath("/dashboard");
    return { success: true };
  });

export const listCategoriesAction = actionClient.action(async () => {
  const categories = await db.category.findMany({
    orderBy: [{ depth: "asc" }, { name: "asc" }],
  });
  return { categories };
});
