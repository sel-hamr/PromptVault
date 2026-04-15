import type { User } from "@prisma/client";

export type { User };

export type SafeUser = Omit<User, "password">;
