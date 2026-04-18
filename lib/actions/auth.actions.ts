"use server";

import { actionClient } from "@/lib/safe-action";
import { loginSchema, registerSchema } from "@/lib/validators";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

// loginAction validates credentials server-side and returns success/error.
// The client is responsible for calling signIn("credentials", ...) from
// next-auth/react to establish the session after receiving { success: true }.
export const loginAction = actionClient
  .schema(loginSchema)
  .action(async ({ parsedInput: { email, password } }) => {
    const user = await db.user.findUnique({ where: { email } });

    if (!user || !user.password_hash) {
      return { error: "Invalid credentials" };
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return { error: "Invalid credentials" };
    }

    return { success: true };
  });

export const registerAction = actionClient
  .schema(registerSchema)
  .action(async ({ parsedInput: { name, email, password } }) => {
    // 1. Guard against duplicate email
    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return { error: "Email already in use" };
    }

    // 2. Hash the password
    const hashed = await bcrypt.hash(password, 12);

    // 3. Derive a unique username from the display name
    //    Pattern: lowercase, non-alphanumeric runs → underscore, max 20 chars,
    //    trailing 4-digit suffix for uniqueness.
    const base = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_|_$/g, "")
      .slice(0, 20);
    const suffix = Math.floor(1000 + Math.random() * 9000).toString();
    const username = `${base}_${suffix}`;

    // 4. Persist the new user
    try {
      await db.user.create({
        data: {
          email,
          username,
          password_hash: hashed,
        },
      });
    } catch {
      return { error: "Could not create account. Please try again." };
    }

    // Return success — client will call signIn("credentials", ...) to log in
    return { success: true };
  });
