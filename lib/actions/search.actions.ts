"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { authActionClient } from "@/lib/safe-action";

const searchSchema = z.object({
  query: z.string().min(1).max(100),
});

export const globalSearchAction = authActionClient
  .schema(searchSchema)
  .action(async ({ parsedInput: { query }, ctx: { userId } }) => {
    const contains = { contains: query, mode: "insensitive" as const };

    const [prompts, pieces, references, tags] = await Promise.all([
      db.prompt.findMany({
        where: {
          user_id: userId,
          OR: [{ title: contains }, { description: contains }],
        },
        select: { id: true, title: true, description: true },
        take: 5,
      }),
      db.promptPiece.findMany({
        where: { user_id: userId, title: contains },
        select: { id: true, title: true, piece_type: true },
        take: 5,
      }),
      db.reference.findMany({
        where: {
          user_id: userId,
          OR: [{ title: contains }, { description: contains }],
        },
        select: { id: true, title: true, type: true },
        take: 5,
      }),
      db.tag.findMany({
        where: { name: contains },
        select: { id: true, name: true, slug: true },
        take: 5,
      }),
    ]);

    return { prompts, pieces, references, tags };
  });
