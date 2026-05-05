# PromptVault

A Next.js application for authoring, organizing, sharing, and reusing AI prompts. Users compose **prompts** from reusable building blocks (**pieces** like personas, formats, tones, constraints), tag and categorize them, fork community prompts, and target them at specific models (ChatGPT, Claude, Gemini, Midjourney, DALL·E, Stable Diffusion).

> Inferred from `prisma/schema.prisma`, the `app/(dashboard)` route tree (`prompts`, `pieces`, `library`, `compose`, `explore`), and `lib/actions/*`.

## Features

- **Prompt management** — create, edit, version, and rate prompts with rich content, variables (`Json` field), and visibility scopes (`PUBLIC` / `PRIVATE` / `UNLISTED`).
- **Reusable pieces** — typed building blocks (`PERSONA`, `FORMAT`, `CONSTRAINT`, `CONTEXT`, `TONE`, `CUSTOM`) tracked per user with use counts.
- **Compose workflow** — dedicated `/compose` route for assembling prompts from pieces.
- **Explore & library** — browse public prompts (`/explore`) and curate your saved set (`/library`).
- **Fork tracking** — prompts reference a `forked_from` parent and track `fork_count`.
- **Categories & tags** — hierarchical `Category` tree (self-referential `parent_id`, `depth`) plus many-to-many tagging via `PromptTag` / `ReferenceTag`.
- **References & snippets** — separate knowledge model (`Reference`, `Snippet`) for docs, skills, agents, patterns, and decisions.
- **Ratings & analytics** — `avg_rating`, `rating_count`, `use_count`, `version_count` denormalized on prompts.
- **Authentication** — credentials (bcrypt-hashed `password_hash`) plus GitHub and Google OAuth via NextAuth + Prisma adapter.
- **Global search & contact form** — search server actions (`lib/actions/search.actions.ts`) and a public contact page (`app/(landing)/contact`).
- **Settings** — account/preferences page under `/settings`.
- **File uploads** — UploadThing integration.
- **Transactional email** — Resend with `@react-email/components` templates.
- **Theming** — light/dark via `next-themes`, animated theme toggle.
- **Landing page** — hero, FAQ, app preview, mobile menu (`app/(landing)/page.tsx`).
- **Health check** — `app/health` page and `app/api/health-runtime` route.

## Tech Stack

| Area               | Choice                                                                  |
| ------------------ | ----------------------------------------------------------------------- |
| Framework          | Next.js 16 (App Router, React 19)                                       |
| Language           | TypeScript 5                                                            |
| Styling            | Tailwind CSS v4 (CSS-native config), `tailwind-merge`, `tw-animate-css` |
| UI primitives      | Radix UI, shadcn (`components/ui`), `lucide-react`, `cmdk`, `sonner`    |
| Animation          | Framer Motion                                                           |
| Forms / validation | React Hook Form + Zod (`@hookform/resolvers`)                           |
| Server actions     | `next-safe-action` (Zod-typed)                                          |
| Data fetching      | Server Components + `unstable_cache` with tag-based revalidation        |
| ORM / DB           | Prisma 7 + `@prisma/adapter-pg` on PostgreSQL 16                        |
| Auth               | NextAuth v4 + `@auth/prisma-adapter`, bcrypt for credentials            |
| Cache / rate limit | Upstash Redis (`@upstash/redis`)                                        |
| Email              | Resend + `@react-email/components`                                      |
| Uploads            | UploadThing                                                             |
| State              | Zustand, `nuqs` (URL state)                                             |
| Charts             | Recharts                                                                |
| Logging            | Pino (pretty in dev, JSON in prod)                                      |
| Security headers   | Nosecone                                                                |
| Env safety         | `@t3-oss/env-nextjs` + Zod                                              |
| Testing            | Vitest, Testing Library, MSW, Playwright                                |
| Tooling            | ESLint 9 (flat), Prettier, Husky, lint-staged, commitlint               |
| Deploy             | Netlify (`netlify.toml`); Vercel-compatible                             |

## Project Structure

```
app/
  (auth)/             # /login, /register — public, centered layout
  (dashboard)/        # protected: dashboard, prompts, pieces, library, compose, explore, settings
  (landing)/          # marketing: landing page + /contact
  api/
    auth/[...nextauth]/  # NextAuth catch-all
    webhooks/            # generic webhook receiver
    health-runtime/      # runtime health probe
  health/             # status page
  globals.css
  layout.tsx

components/
  forms/              # form components (e.g. social-auth-buttons)
  layout/             # nav config, sidebar, headers
  layouts/            # page-level layout wrappers
  settings/           # settings UI blocks
  ui/                 # shadcn primitives
  theme-provider.tsx, theme-toggle.tsx

lib/
  actions/            # typed Server Actions (auth, prompt, piece, library, search, contact, settings, …)
  data/               # cached Prisma reads (cache-tags + unstable_cache)
  auth.ts             # NextAuth config
  db.ts               # Prisma singleton
  env.ts              # validated env vars
  logger.ts           # Pino
  mail.ts             # Resend client
  markdown.ts         # markdown helpers
  motion-variants.ts  # Framer Motion presets
  safe-action.ts      # next-safe-action clients (actionClient, authActionClient)
  utils.ts            # cn, formatDate, slugify
  validators.ts       # shared Zod schemas

prisma/
  schema.prisma       # User, Prompt, PromptPiece, Category, Tag, Reference, Snippet, …
  migrations/
  seed.ts, seed-pieces.ts, seed-prompts.ts

constants/            # ROUTES, settings-config
config/               # app config
hooks/                # custom React hooks
public/               # static assets
scripts/              # utility scripts
types/                # shared TS types
reference/            # internal docs / research notes
docker-compose.yml    # Postgres 16 + Redis 7
proxy.ts              # request proxy entry (Not واضح from code without further inspection)
```

Architecture style: **modular monolith**. Reads and writes are split by directory — `lib/data/*` for cached queries, `lib/actions/*` for typed mutations — and the App Router uses **route groups** (`(auth)`, `(dashboard)`, `(landing)`) for layout-scoped concerns.

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm (recommended; `pnpm-lock.yaml` and `pnpm-workspace.yaml` are checked in)
- Docker (for local Postgres + Redis)

### Installation

```bash
pnpm install
cp .env.example .env.local   # fill in secrets
docker compose up -d         # start Postgres (5432) and Redis (6379)
pnpm prisma migrate dev      # apply schema
pnpm db:seed                 # optional: seed base data
pnpm db:seed:pieces          # optional: seed pieces
pnpm db:seed:prompts         # optional: seed prompts
```

### Environment variables

From `.env.example` and `lib/env.ts`:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/myapp?schema=public
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
RESEND_API_KEY=
UPLOADTHING_TOKEN=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> `lib/env.ts` validates a subset of these at build time (DB, NextAuth, OAuth, Resend, app URL). Upstash and UploadThing keys are read directly where used.

### Run

```bash
pnpm dev      # http://localhost:3000
pnpm build    # runs `prisma generate && next build`
pnpm start    # production server
```

## Scripts

| Script                 | Purpose                                  |
| ---------------------- | ---------------------------------------- |
| `pnpm dev`             | Next.js dev server                       |
| `pnpm build`           | `prisma generate` then production build  |
| `pnpm start`           | Run the built app                        |
| `pnpm lint`            | ESLint 9 (flat config)                   |
| `pnpm db:seed`         | Seed base data                           |
| `pnpm db:seed:pieces`  | Seed prompt pieces                       |
| `pnpm db:seed:prompts` | Seed prompts                             |
| `pnpm vitest`          | Unit/integration tests (per `CLAUDE.md`) |
| `pnpm playwright test` | E2E tests (per `CLAUDE.md`)              |

## API Overview

This app is primarily a server-component + Server Actions design — there are few public REST endpoints:

| Path                         | Purpose                                         |
| ---------------------------- | ----------------------------------------------- |
| `app/api/auth/[...nextauth]` | NextAuth handlers (sign-in, callbacks, session) |
| `app/api/webhooks`           | Generic webhook receiver                        |
| `app/api/health-runtime`     | Runtime health probe                            |

Mutations are exposed as **typed Server Actions** in `lib/actions/`:

- `auth.actions.ts` — register, credential sign-in helpers
- `prompt.actions.ts`, `piece.actions.ts`, `category.actions.ts`, `tag.actions.ts`
- `library.actions.ts` — save/unsave to user library
- `search.actions.ts` — global search
- `settings.actions.ts`, `user.actions.ts`, `contact.actions.ts`

Each action chains `.schema(zodSchema).action(...)` and returns `{ error }` on failure or plain data on success. After a write, the action revalidates the relevant cache tag from `lib/data/cache-tags.ts`.

## Architecture Notes

- **Auth gate at the layout** — `app/(dashboard)/layout.tsx` calls `auth()` and redirects to `/login` if there is no session, so individual dashboard pages don't repeat the check.
- **Cached reads, tagged invalidation** — every function in `lib/data/*` wraps Prisma in `unstable_cache` with explicit cache keys and tags. Mutations call `revalidateTag(...)` to bust them.
- **Two safe-action clients** — `actionClient` (no auth) and `authActionClient` (injects `ctx.userId`).
- **Singleton Prisma** — `lib/db.ts` uses the `globalThis` pattern to survive hot reload.
- **Validated env at build time** — never `process.env` in app code; import `env` from `lib/env.ts`.
- **Centralized routes** — all paths in `constants/routes.ts` (`ROUTES`); never hardcode strings.
- **Tailwind v4** — no `tailwind.config.ts`; tokens live in CSS. Use `cn()` (`lib/utils.ts`) for conditional classes.
- **Snake_case columns, cuid IDs** — visible across the Prisma schema (`user_id`, `created_at`, `forked_from_id`).
- **Denormalized counters** — `avg_rating`, `rating_count`, `fork_count`, `use_count`, `version_count` on `Prompt`; `usage_count` on `Tag`. Implies write-side maintenance in actions.

## Known Limitations

- `prisma/schema.prisma` declares `provider = "postgresql"` but no `url = env("DATABASE_URL")` line — connection URL is presumably wired via `prisma.config.ts`. Worth verifying when migrating.
- The `User` model uses `password_hash` directly and is **not** wired to NextAuth's `Account` / `Session` tables, even though `@auth/prisma-adapter` is installed. Credentials and OAuth users may live in different shapes — Not واضح from code alone whether OAuth provisioning is fully implemented.
- No `LICENSE` file is present in the repo.
- `proxy.ts` at the root has no obvious caller — Not واضح from code.
- E2E and unit test directories (`tests/e2e`, `tests/unit`) are referenced in `CLAUDE.md` but were not located during this scan; tests may not yet be populated.

## Contributing

1. Fork and create a feature branch (`feat/...`, `fix/...` — Conventional Commits enforced via commitlint).
2. `pnpm install`, run the Docker stack, copy `.env.example`.
3. Run `pnpm lint` and tests before opening a PR. Husky + lint-staged run on commit.
4. Keep mutations in `lib/actions/*` and reads in `lib/data/*`; update `cache-tags.ts` when adding new resources.
5. Add new routes to `constants/routes.ts` and nav items to `components/layout/nav-config.ts`.

---

### Onboarding tips

- Read `CLAUDE.md` first — it's the canonical architecture doc.
- Start at `app/(dashboard)/layout.tsx` to see the auth gate, then follow a feature end-to-end: e.g. `app/(dashboard)/prompts/page.tsx` → `lib/data/prompts.ts` (read) → `lib/actions/prompt.actions.ts` (write) → `lib/validators.ts` (schema).
- When adding a new resource: schema → migration → `lib/data/<x>.ts` (with cache tag) → `lib/actions/<x>.actions.ts` → route under `app/(dashboard)/<x>/`.
