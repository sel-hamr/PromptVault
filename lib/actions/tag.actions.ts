"use server";

import { revalidatePath } from "next/cache";
import slugify from "slugify";
import { db } from "@/lib/db";
import { actionClient, authActionClient } from "@/lib/safe-action";
import {
  createTagSchema,
  listTagsSchema,
  attachTagSchema,
  tagIdSchema,
} from "@/lib/validators";

export const createTagAction = authActionClient
  .schema(createTagSchema)
  .action(async ({ parsedInput: { name } }) => {
    const slug = slugify(name, { lower: true, strict: true });
    const tag = await db.tag.upsert({
      where: { slug },
      create: { name, slug },
      update: {},
    });
    return { tag };
  });

export const listTagsAction = actionClient
  .schema(listTagsSchema)
  .action(async ({ parsedInput: { q, take } }) => {
    const tags = await db.tag.findMany({
      where: q ? { name: { contains: q, mode: "insensitive" } } : undefined,
      orderBy: { usage_count: "desc" },
      take,
    });
    return { tags };
  });

export const deleteTagAction = authActionClient
  .schema(tagIdSchema)
  .action(async ({ parsedInput: { id } }) => {
    await db.promptTag.deleteMany({ where: { tag_id: id } });
    await db.tag.delete({ where: { id } });
    return { success: true };
  });

export const attachTagAction = authActionClient
  .schema(attachTagSchema)
  .action(async ({ parsedInput: { prompt_id, tag_id }, ctx: { userId } }) => {
    const prompt = await db.prompt.findUnique({ where: { id: prompt_id } });
    if (!prompt) return { error: "Prompt not found" };
    if (prompt.user_id !== userId) return { error: "Forbidden" };

    await db.promptTag.upsert({
      where: { prompt_id_tag_id: { prompt_id, tag_id } },
      create: { prompt_id, tag_id },
      update: {},
    });
    await db.tag.update({
      where: { id: tag_id },
      data: { usage_count: { increment: 1 } },
    });

    revalidatePath(`/prompts/${prompt_id}`);
    return { success: true };
  });

export const detachTagAction = authActionClient
  .schema(attachTagSchema)
  .action(async ({ parsedInput: { prompt_id, tag_id }, ctx: { userId } }) => {
    const prompt = await db.prompt.findUnique({ where: { id: prompt_id } });
    if (!prompt) return { error: "Prompt not found" };
    if (prompt.user_id !== userId) return { error: "Forbidden" };

    await db.promptTag
      .delete({ where: { prompt_id_tag_id: { prompt_id, tag_id } } })
      .catch(() => null);
    await db.tag.update({
      where: { id: tag_id },
      data: { usage_count: { decrement: 1 } },
    });

    revalidatePath(`/prompts/${prompt_id}`);
    return { success: true };
  });
