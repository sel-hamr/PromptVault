import NextAuth, { type NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth/next";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { env } from "@/lib/env";
import { ROUTES } from "@/constants/routes";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    GitHubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    }),
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password_hash) {
          return null;
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password_hash
        );

        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.username,
        };
      },
    }),
  ],
  // JWT strategy is required for CredentialsProvider.
  // OAuth accounts are still stored via PrismaAdapter for account linking.
  session: { strategy: "jwt" },
  pages: {
    signIn: ROUTES.login,
    error: ROUTES.login,
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id;
      }
      return session;
    },
  },
};

// Route handler — used by app/api/auth/[...nextauth]/route.ts
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const handler = NextAuth(authOptions);

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
export const handlers = { GET: handler, POST: handler };

// Server Component / Route Handler session helper (replaces v5's auth())
export async function auth() {
  return getServerSession(authOptions);
}

// Re-export for any server code that imports signIn/signOut by name.
// In v4, these are client-side operations — server actions should NOT call
// these directly. They are provided here as no-op stubs so existing imports
// compile; the real sign-in flow is triggered from the client via
// next-auth/react's signIn().
export const signIn = undefined;
export const signOut = undefined;
