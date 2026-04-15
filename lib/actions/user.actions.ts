"use server";

import { actionClient } from "@/lib/safe-action";
import { db } from "@/lib/db";
import { z } from "zod";

export const getUserAction = actionClient
  .schema(z.object({ id: z.string() }))
  .action(async ({ parsedInput: { id } }) => {
    const user = await db.user.findUnique({ where: { id } });
    if (!user) return { error: "User not found" };
    return { user };
  });
