"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { actionClient, authActionClient } from "@/lib/safe-action";
import {
  createPromptSchema,
  updatePromptSchema,
  promptIdSchema,
  listPromptsSchema,
  forkPromptSchema,
} from "@/lib/validators";

export const createPromptAction = authActionClient
  .schema(createPromptSchema)
  .action(async ({ parsedInput, ctx: { userId } }) => {
    const { tag_ids, category_id, ...data } = parsedInput;

    const prompt = await db.prompt.create({
      data: {
        ...data,
        user_id: userId,
        category_id: category_id ?? null,
        variables: data.variables as Prisma.InputJsonValue,
        tags: tag_ids.length
          ? { create: tag_ids.map((tag_id) => ({ tag_id })) }
          : undefined,
      },
    });

    if (tag_ids.length) {
      await db.tag.updateMany({
        where: { id: { in: tag_ids } },
        data: { usage_count: { increment: 1 } },
      });
    }
    if (category_id) {
      await db.category.update({
        where: { id: category_id },
        data: { prompt_count: { increment: 1 } },
      });
    }

    revalidatePath("/dashboard");
    return { prompt };
  });

export const updatePromptAction = authActionClient
  .schema(updatePromptSchema)
  .action(async ({ parsedInput, ctx: { userId } }) => {
    const { id, tag_ids, variables, ...rest } = parsedInput;

    const existing = await db.prompt.findUnique({ where: { id } });
    if (!existing) return { error: "Prompt not found" };
    if (existing.user_id !== userId) return { error: "Forbidden" };

    const prompt = await db.prompt.update({
      where: { id },
      data: {
        ...rest,
        ...(variables !== undefined
          ? { variables: variables as Prisma.InputJsonValue }
          : {}),
        version_count: { increment: 1 },
      },
    });

    if (tag_ids) {
      await db.promptTag.deleteMany({ where: { prompt_id: id } });
      if (tag_ids.length) {
        await db.promptTag.createMany({
          data: tag_ids.map((tag_id) => ({ prompt_id: id, tag_id })),
        });
      }
    }

    revalidatePath("/dashboard");
    revalidatePath(`/prompts/${id}`);
    return { prompt };
  });

export const deletePromptAction = authActionClient
  .schema(promptIdSchema)
  .action(async ({ parsedInput: { id }, ctx: { userId } }) => {
    const existing = await db.prompt.findUnique({ where: { id } });
    if (!existing) return { error: "Prompt not found" };
    if (existing.user_id !== userId) return { error: "Forbidden" };

    await db.promptTag.deleteMany({ where: { prompt_id: id } });
    await db.prompt.delete({ where: { id } });

    if (existing.category_id) {
      await db.category.update({
        where: { id: existing.category_id },
        data: { prompt_count: { decrement: 1 } },
      });
    }

    revalidatePath("/dashboard");
    return { success: true };
  });

export const getPromptAction = actionClient
  .schema(promptIdSchema)
  .action(async ({ parsedInput: { id } }) => {
    const prompt = await db.prompt.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, username: true } },
        category: true,
        tags: { include: { tag: true } },
        forked_from: {
          select: {
            id: true,
            title: true,
            user: { select: { id: true, username: true } },
          },
        },
      },
    });
    if (!prompt) return { error: "Prompt not found" };
    return { prompt };
  });

export const listPromptsAction = actionClient
  .schema(listPromptsSchema)
  .action(async ({ parsedInput }) => {
    const { user_id, category_id, model_target, visibility, tag_slugs, q, sort, take, cursor } =
      parsedInput;

    const where: Prisma.PromptWhereInput = {
      ...(user_id ? { user_id } : {}),
      ...(category_id ? { category_id } : {}),
      ...(model_target ? { model_target } : {}),
      ...(visibility ? { visibility } : {}),
      ...(tag_slugs?.length
        ? { tags: { some: { tag: { slug: { in: tag_slugs } } } } }
        : {}),
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { description: { contains: q, mode: "insensitive" } },
              { content: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    };

    const orderBy: Prisma.PromptOrderByWithRelationInput =
      sort === "oldest"
        ? { created_at: "asc" }
        : sort === "top_rated"
        ? { avg_rating: "desc" }
        : sort === "most_forked"
        ? { fork_count: "desc" }
        : sort === "most_used"
        ? { use_count: "desc" }
        : { created_at: "desc" };

    const prompts = await db.prompt.findMany({
      where,
      orderBy,
      take: take + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      include: {
        user: { select: { id: true, username: true } },
        category: true,
        tags: { include: { tag: true } },
      },
    });

    const hasMore = prompts.length > take;
    const items = hasMore ? prompts.slice(0, take) : prompts;
    const nextCursor = hasMore ? items[items.length - 1]?.id : null;

    return { prompts: items, nextCursor };
  });

export const duplicatePromptAction = authActionClient
  .schema(promptIdSchema)
  .action(async ({ parsedInput: { id }, ctx: { userId } }) => {
    const source = await db.prompt.findUnique({
      where: { id },
      include: { tags: true },
    });
    if (!source) return { error: "Prompt not found" };
    if (source.visibility === "PRIVATE" && source.user_id !== userId) {
      return { error: "Forbidden" };
    }

    const prompt = await db.prompt.create({
      data: {
        user_id: userId,
        title: `${source.title} (copy)`,
        description: source.description,
        content: source.content,
        model_target: source.model_target,
        visibility: "PRIVATE",
        category_id: source.user_id === userId ? source.category_id : null,
        variables: source.variables as Prisma.InputJsonValue,
        tags: source.tags.length
          ? { create: source.tags.map((t) => ({ tag_id: t.tag_id })) }
          : undefined,
      },
    });

    revalidatePath("/dashboard");
    return { prompt };
  });

export const forkPromptAction = authActionClient
  .schema(forkPromptSchema)
  .action(async ({ parsedInput: { id, visibility }, ctx: { userId } }) => {
    const source = await db.prompt.findUnique({
      where: { id },
      include: { tags: true },
    });
    if (!source) return { error: "Prompt not found" };
    if (source.visibility === "PRIVATE") return { error: "Cannot fork a private prompt" };
    if (source.user_id === userId) return { error: "Cannot fork your own prompt" };

    const prompt = await db.prompt.create({
      data: {
        user_id: userId,
        title: source.title,
        description: source.description,
        content: source.content,
        model_target: source.model_target,
        visibility,
        forked_from_id: source.id,
        variables: source.variables as Prisma.InputJsonValue,
        tags: source.tags.length
          ? { create: source.tags.map((t) => ({ tag_id: t.tag_id })) }
          : undefined,
      },
    });

    await db.prompt.update({
      where: { id: source.id },
      data: { fork_count: { increment: 1 } },
    });

    revalidatePath("/dashboard");
    return { prompt };
  });

export const incrementPromptUseAction = actionClient
  .schema(promptIdSchema)
  .action(async ({ parsedInput: { id } }) => {
    await db.prompt.update({
      where: { id },
      data: { use_count: { increment: 1 } },
    });
    return { success: true };
  });
