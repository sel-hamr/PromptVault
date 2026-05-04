"use server";

import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { authActionClient } from "@/lib/safe-action";
import {
  updateUsernameSchema,
  updateEmailSchema,
  changePasswordSchema,
  deleteAccountSchema,
} from "@/lib/validators";

export const updateUsernameAction = authActionClient
  .schema(updateUsernameSchema)
  .action(async ({ parsedInput: { username }, ctx: { userId } }) => {
    const existing = await db.user.findFirst({
      where: { username, NOT: { id: userId } },
    });
    if (existing) return { error: "Username is already taken" };

    await db.user.update({ where: { id: userId }, data: { username } });
    return { success: true };
  });

export const updateEmailAction = authActionClient
  .schema(updateEmailSchema)
  .action(async ({ parsedInput: { email, current_password }, ctx: { userId } }) => {
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) return { error: "User not found" };

    const valid = await bcrypt.compare(current_password, user.password_hash);
    if (!valid) return { error: "Current password is incorrect" };

    const taken = await db.user.findFirst({
      where: { email, NOT: { id: userId } },
    });
    if (taken) return { error: "Email is already in use" };

    await db.user.update({ where: { id: userId }, data: { email } });
    return { success: true };
  });

export const changePasswordAction = authActionClient
  .schema(changePasswordSchema)
  .action(async ({ parsedInput: { current_password, new_password }, ctx: { userId } }) => {
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) return { error: "User not found" };

    const valid = await bcrypt.compare(current_password, user.password_hash);
    if (!valid) return { error: "Current password is incorrect" };

    const hashed = await bcrypt.hash(new_password, 12);
    await db.user.update({
      where: { id: userId },
      data: { password_hash: hashed },
    });
    return { success: true };
  });

export const deleteAccountAction = authActionClient
  .schema(deleteAccountSchema)
  .action(async ({ parsedInput: { current_password }, ctx: { userId } }) => {
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) return { error: "User not found" };

    const valid = await bcrypt.compare(current_password, user.password_hash);
    if (!valid) return { error: "Password is incorrect" };

    await db.user.delete({ where: { id: userId } });
    return { success: true };
  });
