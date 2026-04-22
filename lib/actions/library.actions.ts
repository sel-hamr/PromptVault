"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { authActionClient } from "@/lib/safe-action";
import {
  createReferenceSchema,
  updateReferenceSchema,
  referenceIdSchema,
  createSnippetSchema,
  updateSnippetSchema,
  snippetIdSchema,
  reorderSnippetsSchema,
} from "@/lib/validators";

export const createReferenceAction = authActionClient
  .schema(createReferenceSchema)
  .action(async ({ parsedInput, ctx: { userId } }) => {
    const { tag_ids, source_url, ...data } = parsedInput;

    const reference = await db.reference.create({
      data: {
        ...data,
        user_id: userId,
        source_url: source_url || null,
        tags: tag_ids.length
          ? { create: tag_ids.map((tag_id) => ({ tag_id })) }
          : undefined,
      },
    });

    revalidatePath("/library");
    return { reference };
  });

export const updateReferenceAction = authActionClient
  .schema(updateReferenceSchema)
  .action(async ({ parsedInput, ctx: { userId } }) => {
    const { id, tag_ids, source_url, ...data } = parsedInput;

    const existing = await db.reference.findFirst({ where: { id, user_id: userId } });
    if (!existing) throw new Error("Not found");

    const reference = await db.reference.update({
      where: { id },
      data: {
        ...data,
        ...(source_url !== undefined ? { source_url: source_url || null } : {}),
        ...(tag_ids !== undefined
          ? {
              tags: {
                deleteMany: {},
                create: tag_ids.map((tag_id) => ({ tag_id })),
              },
            }
          : {}),
      },
    });

    revalidatePath("/library");
    revalidatePath(`/library/${id}`);
    return { reference };
  });

export const deleteReferenceAction = authActionClient
  .schema(referenceIdSchema)
  .action(async ({ parsedInput: { id }, ctx: { userId } }) => {
    const existing = await db.reference.findFirst({ where: { id, user_id: userId } });
    if (!existing) throw new Error("Not found");

    await db.reference.delete({ where: { id } });

    revalidatePath("/library");
    return { id };
  });

export const incrementReferenceUseAction = authActionClient
  .schema(referenceIdSchema)
  .action(async ({ parsedInput: { id }, ctx: { userId } }) => {
    await db.reference.updateMany({
      where: { id, user_id: userId },
      data: { use_count: { increment: 1 } },
    });
  });

// ---------- Snippet actions ----------

export const createSnippetAction = authActionClient
  .schema(createSnippetSchema)
  .action(async ({ parsedInput, ctx: { userId } }) => {
    const ref = await db.reference.findFirst({
      where: { id: parsedInput.reference_id, user_id: userId },
    });
    if (!ref) throw new Error("Not found");

    const snippet = await db.snippet.create({ data: parsedInput });

    revalidatePath(`/library/${parsedInput.reference_id}`);
    return { snippet };
  });

export const updateSnippetAction = authActionClient
  .schema(updateSnippetSchema)
  .action(async ({ parsedInput, ctx: { userId } }) => {
    const { id, reference_id, ...data } = parsedInput;

    if (reference_id) {
      const ref = await db.reference.findFirst({
        where: { id: reference_id, user_id: userId },
      });
      if (!ref) throw new Error("Not found");
    }

    const snippet = await db.snippet.update({ where: { id }, data });

    const refId = reference_id ?? (await db.snippet.findUnique({ where: { id } }))?.reference_id;
    if (refId) revalidatePath(`/library/${refId}`);
    return { snippet };
  });

export const deleteSnippetAction = authActionClient
  .schema(snippetIdSchema)
  .action(async ({ parsedInput: { id }, ctx: { userId } }) => {
    const snippet = await db.snippet.findFirst({
      where: { id },
      include: { reference: { select: { user_id: true, id: true } } },
    });
    if (!snippet || snippet.reference.user_id !== userId) throw new Error("Not found");

    await db.snippet.delete({ where: { id } });

    revalidatePath(`/library/${snippet.reference.id}`);
    return { id };
  });

export const incrementSnippetCopyAction = authActionClient
  .schema(snippetIdSchema)
  .action(async ({ parsedInput: { id } }) => {
    await db.snippet.update({
      where: { id },
      data: { copy_count: { increment: 1 } },
    });
  });

export const reorderSnippetsAction = authActionClient
  .schema(reorderSnippetsSchema)
  .action(async ({ parsedInput: { reference_id, ordered_ids }, ctx: { userId } }) => {
    const ref = await db.reference.findFirst({ where: { id: reference_id, user_id: userId } });
    if (!ref) throw new Error("Not found");

    await Promise.all(
      ordered_ids.map((snippetId, index) =>
        db.snippet.update({ where: { id: snippetId }, data: { order: index } })
      )
    );

    revalidatePath(`/library/${reference_id}`);
  });
