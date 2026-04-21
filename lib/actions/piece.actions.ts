"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { actionClient, authActionClient } from "@/lib/safe-action";
import {
  createPieceSchema,
  updatePieceSchema,
  pieceIdSchema,
  listPiecesSchema,
} from "@/lib/validators";

export const createPieceAction = authActionClient
  .schema(createPieceSchema)
  .action(async ({ parsedInput, ctx: { userId } }) => {
    const piece = await db.promptPiece.create({
      data: {
        ...parsedInput,
        user_id: userId,
        variables: parsedInput.variables,
      },
    });
    revalidatePath("/pieces");
    return { piece };
  });

export const updatePieceAction = authActionClient
  .schema(updatePieceSchema)
  .action(async ({ parsedInput, ctx: { userId } }) => {
    const { id, variables, ...rest } = parsedInput;

    const existing = await db.promptPiece.findUnique({ where: { id } });
    if (!existing) return { error: "Piece not found" };
    if (existing.user_id !== userId) return { error: "Forbidden" };

    const piece = await db.promptPiece.update({
      where: { id },
      data: {
        ...rest,
        ...(variables !== undefined
          ? { variables }
          : {}),
      },
    });
    revalidatePath("/pieces");
    return { piece };
  });

export const deletePieceAction = authActionClient
  .schema(pieceIdSchema)
  .action(async ({ parsedInput: { id }, ctx: { userId } }) => {
    const existing = await db.promptPiece.findUnique({ where: { id } });
    if (!existing) return { error: "Piece not found" };
    if (existing.user_id !== userId) return { error: "Forbidden" };

    await db.promptPiece.delete({ where: { id } });
    revalidatePath("/pieces");
    return { success: true };
  });

export const getPieceAction = actionClient
  .schema(pieceIdSchema)
  .action(async ({ parsedInput: { id } }) => {
    const piece = await db.promptPiece.findUnique({
      where: { id },
      include: { user: { select: { id: true, username: true } } },
    });
    if (!piece) return { error: "Piece not found" };
    return { piece };
  });

export const listPiecesAction = actionClient
  .schema(listPiecesSchema)
  .action(async ({ parsedInput }) => {
    const { piece_type, visibility, q, sort, take, cursor } = parsedInput;

    const where: Prisma.PromptPieceWhereInput = {
      ...(visibility ? { visibility } : {}),
      ...(piece_type ? { piece_type } : {}),
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { content: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    };

    const orderBy: Prisma.PromptPieceOrderByWithRelationInput =
      sort === "oldest"
        ? { created_at: "asc" }
        : sort === "updated"
          ? { updated_at: "desc" }
          : sort === "most_used"
            ? { use_count: "desc" }
            : sort === "title_asc"
              ? { title: "asc" }
              : sort === "title_desc"
                ? { title: "desc" }
                : { created_at: "desc" };

    const pieces = await db.promptPiece.findMany({
      where,
      orderBy,
      take: take + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    const hasMore = pieces.length > take;
    const items = hasMore ? pieces.slice(0, take) : pieces;
    const nextCursor = hasMore ? items[items.length - 1]?.id : null;

    return { pieces: items, nextCursor };
  });

export const incrementPieceUseAction = actionClient
  .schema(pieceIdSchema)
  .action(async ({ parsedInput: { id } }) => {
    await db.promptPiece.update({
      where: { id },
      data: { use_count: { increment: 1 } },
    });
    return { success: true };
  });
