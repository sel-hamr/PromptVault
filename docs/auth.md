# Auth System

Covers credentials-based login/registration and OAuth sign-in (GitHub, Google) for the PromptVault application.

---

## Overview

The auth system supports two sign-in paths:

1. **Credentials** — email + password stored as a bcrypt hash in the `User.password_hash` column. Registration creates the user record; the client then signs in immediately after.
2. **OAuth** — GitHub and Google. NextAuth v4 handles the redirect flow and persists OAuth accounts via the Prisma adapter.

All sessions use JWT strategy (required for CredentialsProvider). The session token carries the user's database `id`.

### Credentials flow

```
User submits form
       │
       ▼
loginAction / registerAction        ← next-safe-action Server Action
  • Zod validation (server-side)
  • bcrypt verify / hash
  • db.user query / create
  • returns { success: true } or { error: "..." }
       │
       ▼ (on success)
signIn("credentials", { ... })      ← next-auth/react (client)
  • hits CredentialsProvider.authorize()
  • issues JWT, sets session cookie
  • redirects to /dashboard
```

### OAuth flow

```
User clicks "Continue with GitHub/Google"
       │
       ▼
signIn("github") / signIn("google") ← next-auth/react (client)
       │
       ▼
OAuth provider redirect → /api/auth/callback/[provider]
       │
       ▼
PrismaAdapter creates/links Account + User rows
  • issues JWT, sets session cookie
  • redirects to /dashboard
```

---

## Architecture

| Layer | File | Responsibility |
|---|---|---|
| NextAuth config | `lib/auth.ts` | Providers, JWT callbacks, session shape, sign-in page |
| Server Actions | `lib/actions/auth.actions.ts` | Server-side credential validation and user creation |
| Zod schemas | `lib/validators.ts` | Input shapes shared by Server Actions and RHF resolvers |
| Client forms | `components/forms/login-form.tsx`, `register-form.tsx` | RHF + `useAction` + `signIn` orchestration |
| Pages | `app/(auth)/login/page.tsx`, `app/(auth)/register/page.tsx` | Thin Server Components that render the form components |
| Session types | `types/next-auth.d.ts` | Augments `Session` and `JWT` to include `user.id` |
| Route handler | `app/api/auth/[...nextauth]/route.ts` | Mounts `handlers` from `lib/auth.ts` |

### Why two steps for credentials sign-in

`loginAction` only verifies the password — it never touches the session. The NextAuth session is established by calling `signIn("credentials", ...)` from the client after the action returns `{ success: true }`. This keeps mutation logic (Server Actions) separate from session management (NextAuth).

---

## Server Actions reference

Both actions are built with `actionClient` from `lib/safe-action.ts`. They receive Zod-parsed input as `parsedInput` and always return either `{ success: true }` or `{ error: string }`.

### `loginAction`

**File:** `lib/actions/auth.actions.ts`

**Input schema:** `loginSchema`

| Field | Type | Constraint |
|---|---|---|
| `email` | `string` | Valid email address |
| `password` | `string` | Minimum 8 characters |

**What it does:**

1. Looks up the user by email via `db.user.findUnique`.
2. Returns `{ error: "Invalid credentials" }` if no user exists or the user has no password (OAuth-only account).
3. Compares the submitted password against `user.password_hash` with `bcrypt.compare`.
4. Returns `{ error: "Invalid credentials" }` on mismatch.
5. Returns `{ success: true }` on success. The client is then responsible for calling `signIn("credentials", ...)`.

**Return shape:**

```ts
{ success: true }
// or
{ error: string }
```

---

### `registerAction`

**File:** `lib/actions/auth.actions.ts`

**Input schema:** `registerSchema`

| Field | Type | Constraint |
|---|---|---|
| `name` | `string` | Minimum 2 characters |
| `email` | `string` | Valid email address |
| `password` | `string` | Minimum 8 characters |
| `confirmPassword` | `string` | Must equal `password` (cross-field refinement) |

**What it does:**

1. Checks for an existing user with the same email; returns `{ error: "Email already in use" }` if found.
2. Hashes the password with `bcrypt.hash(password, 12)`.
3. Derives a unique `username` from `name`: lowercased, non-alphanumeric runs replaced with `_`, truncated to 20 characters, suffixed with a random 4-digit number (e.g. `ada_lovelace_4821`).
4. Creates the `User` record with `db.user.create`. On a database error returns `{ error: "Could not create account. Please try again." }`.
5. Returns `{ success: true }`. The client calls `signIn("credentials", ...)` to log the new user in immediately.

**Return shape:**

```ts
{ success: true }
// or
{ error: string }
```

---

## Using actions in components

Both form components follow the same pattern with `useAction` from `next-safe-action/hooks`.

```tsx
"use client";

import { useAction } from "next-safe-action/hooks";
import { signIn } from "next-auth/react";
import { loginAction } from "@/lib/actions/auth.actions";

const { execute, isPending, result } = useAction(loginAction, {
  onSuccess: async ({ data }) => {
    if (data && "success" in data && data.success) {
      // Action confirmed credentials are valid — now establish the session.
      await signIn("credentials", {
        email: values.email,
        password: values.password,
        callbackUrl: "/dashboard",
      });
    }
  },
});

// Trigger the action from an RHF submit handler:
function onSubmit(values: LoginInput) {
  execute(values);
}

// Read a server-returned error:
const serverError =
  result?.data && "error" in result.data ? result.data.error : null;
```

`isPending` is `true` while the Server Action is in-flight. The forms also track a local `signingIn` boolean for the period between the action resolving and `signIn` completing its redirect.

---

## Auth session

### Server Component

```ts
import { auth } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await auth();
  // session is null if unauthenticated
  const userId = session?.user.id;
  const email  = session?.user.email;
}
```

`auth()` is a thin wrapper around `getServerSession(authOptions)`. Call it in any Server Component or route handler. The `(dashboard)/layout.tsx` is the single auth gate — it calls `auth()` and redirects to `/login` when there is no session.

### Client Component

```tsx
"use client";

import { useSession } from "next-auth/react";

export function UserAvatar() {
  const { data: session, status } = useSession();
  if (status === "loading") return null;
  if (!session) return null;

  return <span>{session.user.email}</span>;
}
```

`session.user.id` is available because `types/next-auth.d.ts` augments the `Session` interface to include `id: string`.

---

## Environment variables

All variables are validated at build time via `lib/env.ts`. Missing or malformed values throw at startup.

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string (e.g. `postgresql://user:pass@localhost:5432/db`) |
| `NEXTAUTH_SECRET` | Yes | Random secret for JWT signing. Generate with `openssl rand -base64 32`. |
| `GITHUB_CLIENT_ID` | Yes | GitHub OAuth app client ID |
| `GITHUB_CLIENT_SECRET` | Yes | GitHub OAuth app client secret |
| `GOOGLE_CLIENT_ID` | Yes | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Yes | Google OAuth client secret |
| `NEXT_PUBLIC_APP_URL` | Yes | Public origin of the app (e.g. `http://localhost:3000`) |

Copy `.env.example` to `.env.local` and fill in all values before running `pnpm dev`.

---

## Validation schemas

Schemas are defined in `lib/validators.ts` and exported as both a Zod schema and an inferred TypeScript type.

### `loginSchema` / `LoginInput`

```ts
{
  email:    string  // must be a valid email address
  password: string  // minimum 8 characters
}
```

### `registerSchema` / `RegisterInput`

```ts
{
  name:            string  // minimum 2 characters
  email:           string  // must be a valid email address
  password:        string  // minimum 8 characters
  confirmPassword: string  // must equal password (cross-field refinement)
}
```

The `confirmPassword` field is validated with a `.refine()` call on the object — it never reaches the Server Action (the action's schema is `registerSchema`, which includes the refinement, so a mismatched `confirmPassword` is rejected before `registerAction` body runs).

---

## Error handling

### Action-level errors

Both actions return `{ error: string }` for all known failure cases. next-safe-action surfaces this inside `result.data`.

| Action | Error string | Cause |
|---|---|---|
| `loginAction` | `"Invalid credentials"` | User not found, no password on record, or bcrypt mismatch |
| `registerAction` | `"Email already in use"` | `db.user.findUnique` found an existing record |
| `registerAction` | `"Could not create account. Please try again."` | `db.user.create` threw (e.g. a constraint violation) |

### Validation errors

Zod validation runs server-side inside next-safe-action before the action body executes. If validation fails, `result.validationErrors` is populated (keyed by field name) and `result.data` is `undefined`. The forms also run the same schema client-side via `zodResolver`, so validation errors are typically caught before the action is ever called.

### How the forms display errors

```tsx
// Field-level (from React Hook Form):
{form.formState.errors.email && (
  <p className="text-destructive">{form.formState.errors.email.message}</p>
)}

// Server-returned error (from the action):
const serverError =
  result?.data && "error" in result.data ? result.data.error : null;

{serverError && (
  <p className="border border-destructive/30 bg-destructive/8 text-destructive">
    {serverError}
  </p>
)}
```

Field errors appear beneath the relevant input. The server error renders as a banner above the submit button.
