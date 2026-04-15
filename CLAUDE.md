# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start dev server with Turbopack
pnpm build        # Production build
pnpm start        # Start production server
pnpm lint         # Run ESLint (flat config, ESLint 9)

pnpm vitest       # Run unit tests (watch mode)
pnpm vitest run   # Run unit tests once
pnpm vitest run tests/unit/foo.test.ts  # Run a single test file

pnpm playwright test          # Run E2E tests
pnpm playwright test e2e/foo  # Run a single E2E spec

docker compose up -d   # Start PostgreSQL (5432) and Redis (6379)
docker compose down    # Stop containers
```

## Architecture

### App Router layout

Two route groups keep auth and app concerns separate:

- `app/(auth)/` — unauthenticated pages (`/login`, `/register`). Layout centers content.
- `app/(dashboard)/` — protected pages (`/dashboard`, `/settings`). Layout calls `auth()` and redirects to `/login` if there is no session.
- `app/api/` — route handlers: Auth.js catch-all at `auth/[...nextauth]`, UploadThing at `uploadthing`, generic webhooks at `webhooks`.

### Data flow: Server Actions via `next-safe-action`

Mutations go through typed Server Actions in `lib/actions/`. Every action is built with `actionClient` from `lib/safe-action.ts` (a `createSafeActionClient()` wrapper). Actions receive a Zod-parsed `parsedInput` and return `{ error }` objects on failure or plain data on success. Zod schemas live in `lib/validators.ts` and are shared between actions and React Hook Form resolvers on the client.

### Auth

`lib/auth.ts` exports `{ handlers, auth, signIn, signOut }` from NextAuth v4 configured with the Prisma adapter and GitHub/Google OAuth providers. The `auth()` function works in both Server Components and route handlers. The `(dashboard)/layout.tsx` is the single auth gate — individual pages within the group are unprotected by default.

### Database

`lib/db.ts` exports a singleton `db` (PrismaClient) using the `globalThis` pattern to avoid exhausting connections in development with hot-reload.

### Environment variables

`lib/env.ts` uses `@t3-oss/env-nextjs` with Zod to validate all env vars at build time. Import `env` from there — never read `process.env` directly in application code.

### Key lib singletons

| File | Export | Purpose |
|---|---|---|
| `lib/db.ts` | `db` | Prisma client |
| `lib/auth.ts` | `auth`, `signIn`, `signOut`, `handlers` | Auth.js |
| `lib/mail.ts` | `resend` | Resend email client |
| `lib/logger.ts` | `logger` | Pino (pretty in dev, JSON in prod) |
| `lib/safe-action.ts` | `actionClient` | Base next-safe-action client |
| `lib/env.ts` | `env` | Type-safe env vars |
| `lib/utils.ts` | `cn`, `formatDate`, `slugify` | Shared helpers |

### Styling

Tailwind CSS v4 (CSS-native config, no `tailwind.config.ts`). Use `cn()` from `lib/utils.ts` (combines `clsx` + `tailwind-merge`) for all conditional class names. UI primitives go in `components/ui/` (shadcn/ui pattern — install with the shadcn CLI, then edit the copied source). Toasts use `sonner`. Dark mode via `next-themes`.

### File uploads

`lib/uploadthing.ts` defines the file router (`ourFileRouter`). The middleware in each route calls `auth()` to enforce authentication. The API endpoint is at `app/api/uploadthing/route.ts`.

### Testing

- Unit/integration: Vitest (`tests/unit/`), with `@testing-library/react` for components and MSW for network mocking.
- E2E: Playwright (`tests/e2e/`), configured in `playwright.config.ts`.

### Local dev infrastructure

`docker-compose.yml` runs PostgreSQL 16 on port 5432 and Redis 7 on port 6379. Copy `.env.example` to `.env.local` and fill in secrets before starting the app.
