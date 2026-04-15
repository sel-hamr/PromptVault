"use server";

import { actionClient } from "@/lib/safe-action";
import { loginSchema, registerSchema } from "@/lib/validators";
import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";

export const loginAction = actionClient
  .schema(loginSchema)
  .action(async ({ parsedInput: { email, password } }) => {
    try {
      await signIn("credentials", { email, password, redirectTo: "/dashboard" });
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case "CredentialsSignin":
            return { error: "Invalid credentials" };
          default:
            return { error: "Something went wrong" };
        }
      }
      throw error;
    }
  });
