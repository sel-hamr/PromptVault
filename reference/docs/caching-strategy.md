# Caching Strategy — Server Actions to Data Layer

## Problem

Every `getXAction` and `listXAction` in `lib/actions/` is a Server Action, which compiles to a `POST` request. **POST requests are never cached** — not by Next.js, not by the browser. All read queries hit the database on every render.

Additionally, `revalidatePath` is URL-based: mutating one prompt busts `/dashboard` entirely, forcing unrelated data to re-fetch.

---

## Solution

Split Server Actions into two concerns:

| Concern | Location | Tool |
|---|---|---|
| Reads | `lib/data/` | `unstable_cache` + `React.cache()` |
| Writes | `lib/actions/` | Server Actions + `revalidateTag` |

Server Components call data functions directly. Server Actions handle mutations and invalidate cache tags on success.

---

## Directory Structure

```
lib/
  data/
    cache-tags.ts       ← shared tag constants
    prompts.ts          ← getPrompt, listPrompts
    pieces.ts           ← getPiece, listPieces
    categories.ts       ← listCategories
    tags.ts             ← listTags
    library.ts          ← getLibraryItem, listLibraryItems
  actions/
    prompt.actions.ts   ← mutations only (create, update, delete, fork, duplicate)
    piece.actions.ts    ← mutations only
    ...
```

---

## The Two Caching Primitives

### `React.cache()` — per-request deduplication

```ts
import { cache } from "react";

export const getPrompt = cache(async (id: string) => {
  return db.prompt.findUnique({ where: { id } });
});
```

- Deduplicates identical calls **within a single render pass**
- Does NOT persist across requests — resets every request
- No config needed, always safe
- Use when: multiple Server Components on the same page need the same record

### `unstable_cache()` — persistent cross-request cache

```ts
import { unstable_cache } from "next/cache";

export const getPrompt = unstable_cache(
  async (id: string) => db.prompt.findUnique({ where: { id } }),
  ["prompt"],
  { tags: ["prompts"], revalidate: 3600 }
);
```

- Persists across requests (survives between page loads)
- Invalidated explicitly via `revalidateTag` in Server Actions
- `revalidate: N` sets a TTL in seconds as a fallback
- Use when: data should be cached across multiple users/requests

### Combine both

Wrap `unstable_cache` with `React.cache()` to avoid multiple cache lookups within one render:

```ts
export const getPrompt = cache(
  unstable_cache(
    async (id: string) => db.prompt.findUnique({ where: { id } }),
    ["prompt"],
    { tags: ["prompts"] }
  )
);
```

---

## Cache Tags

Define tags as constants to keep queries and mutations in sync.

```ts
// lib/data/cache-tags.ts
export const CACHE_TAGS = {
  prompts: "prompts",
  prompt: (id: string) => `prompt-${id}`,
  pieces: "pieces",
  piece: (id: string) => `piece-${id}`,
  categories: "categories",
  tags: "tags",
  library: "library",
} as const;
```

---

## Implementation

### `lib/data/prompts.ts`

```ts
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { CACHE_TAGS } from "./cache-tags";

export const getPrompt = cache(
  unstable_cache(
    async (id: string) =>
      db.prompt.findUnique({
        where: { id },
        include: {
          user: { select: { id: true, username: true } },
          category: true,
          tags: { include: { tag: true } },
          forked_from: {
            select: {
              id: true,
              title: true,
              user: { select: { id: true, username: true } },
            },
          },
        },
      }),
    ["prompt"],
    { tags: [CACHE_TAGS.prompts] }
  )
);

type ListPromptsParams = {
  user_id?: string;
  category_id?: string;
  model_target?: string;
  visibility?: string;
  tag_slugs?: string[];
  q?: string;
  sort?: string;
  take: number;
  cursor?: string;
};

export const listPrompts = cache(
  unstable_cache(
    async (params: ListPromptsParams) => {
      const { user_id, category_id, model_target, visibility, tag_slugs, q, sort, take, cursor } = params;

      const where: Prisma.PromptWhereInput = {
        ...(user_id ? { user_id } : {}),
        ...(category_id ? { category_id } : {}),
        ...(model_target ? { model_target } : {}),
        ...(visibility ? { visibility } : {}),
        ...(tag_slugs?.length
          ? { tags: { some: { tag: { slug: { in: tag_slugs } } } } }
          : {}),
        ...(q
          ? {
              OR: [
                { title: { contains: q, mode: "insensitive" } },
                { description: { contains: q, mode: "insensitive" } },
                { content: { contains: q, mode: "insensitive" } },
              ],
            }
          : {}),
      };

      const orderBy: Prisma.PromptOrderByWithRelationInput =
        sort === "oldest" ? { created_at: "asc" }
        : sort === "top_rated" ? { avg_rating: "desc" }
        : sort === "most_forked" ? { fork_count: "desc" }
        : sort === "most_used" ? { use_count: "desc" }
        : { created_at: "desc" };

      const rows = await db.prompt.findMany({
        where,
        orderBy,
        take: take + 1,
        ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
        include: {
          user: { select: { id: true, username: true } },
          category: true,
          tags: { include: { tag: true } },
        },
      });

      const hasMore = rows.length > take;
      const items = hasMore ? rows.slice(0, take) : rows;
      return { prompts: items, nextCursor: hasMore ? (items.at(-1)?.id ?? null) : null };
    },
    ["prompts-list"],
    { tags: [CACHE_TAGS.prompts], revalidate: 60 }
  )
);
```

### `lib/data/pieces.ts`

```ts
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { CACHE_TAGS } from "./cache-tags";

export const getPiece = cache(
  unstable_cache(
    async (id: string) =>
      db.promptPiece.findUnique({
        where: { id },
        include: { user: { select: { id: true, username: true } } },
      }),
    ["piece"],
    { tags: [CACHE_TAGS.pieces] }
  )
);

type ListPiecesParams = {
  piece_type?: string;
  visibility?: string;
  q?: string;
  sort?: string;
  take: number;
  cursor?: string;
};

export const listPieces = cache(
  unstable_cache(
    async (params: ListPiecesParams) => {
      const { piece_type, visibility, q, sort, take, cursor } = params;

      const where: Prisma.PromptPieceWhereInput = {
        ...(visibility ? { visibility } : {}),
        ...(piece_type ? { piece_type } : {}),
        ...(q
          ? {
              OR: [
                { title: { contains: q, mode: "insensitive" } },
                { content: { contains: q, mode: "insensitive" } },
              ],
            }
          : {}),
      };

      const orderBy: Prisma.PromptPieceOrderByWithRelationInput =
        sort === "oldest" ? { created_at: "asc" }
        : sort === "updated" ? { updated_at: "desc" }
        : sort === "most_used" ? { use_count: "desc" }
        : sort === "title_asc" ? { title: "asc" }
        : sort === "title_desc" ? { title: "desc" }
        : { created_at: "desc" };

      const rows = await db.promptPiece.findMany({
        where,
        orderBy,
        take: take + 1,
        ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
        include: { user: { select: { id: true, username: true } } },
      });

      const hasMore = rows.length > take;
      const items = hasMore ? rows.slice(0, take) : rows;
      return { pieces: items, nextCursor: hasMore ? (items.at(-1)?.id ?? null) : null };
    },
    ["pieces-list"],
    { tags: [CACHE_TAGS.pieces], revalidate: 60 }
  )
);
```

---

## Updating Server Actions

Replace `revalidatePath` with `revalidateTag` in every write action.

### Before (`prompt.actions.ts`)

```ts
import { revalidatePath } from "next/cache";

// inside createPromptAction
revalidatePath("/dashboard");

// inside updatePromptAction
revalidatePath("/dashboard");
revalidatePath(`/prompts/${id}`);
```

### After

```ts
import { revalidateTag } from "next/cache";
import { CACHE_TAGS } from "@/lib/data/cache-tags";

// inside createPromptAction
revalidateTag(CACHE_TAGS.prompts);

// inside updatePromptAction and deletePromptAction
revalidateTag(CACHE_TAGS.prompts);           // bust all list caches
revalidateTag(CACHE_TAGS.prompt(id));        // bust this item's detail cache
```

Apply the same pattern in `piece.actions.ts`, `library.actions.ts`, etc.

---

## Using Data Functions in Server Components

```ts
// app/(dashboard)/dashboard/page.tsx
import { listPrompts } from "@/lib/data/prompts";

export default async function DashboardPage() {
  const { prompts } = await listPrompts({ take: 20, visibility: "PUBLIC" });
  return <PromptList prompts={prompts} />;
}
```

```ts
// app/(dashboard)/prompts/[id]/page.tsx
import { getPrompt } from "@/lib/data/prompts";
import { notFound } from "next/navigation";

export default async function PromptPage({ params }: { params: { id: string } }) {
  const prompt = await getPrompt(params.id);
  if (!prompt) notFound();
  return <PromptDetail prompt={prompt} />;
}
```

No Server Action call needed — the data function is called directly and its result is cached.

---

## What to Remove

Once data functions are in place, delete the read actions from `lib/actions/`:

| Remove from actions | Replaced by |
|---|---|
| `getPromptAction` | `lib/data/prompts.ts → getPrompt` |
| `listPromptsAction` | `lib/data/prompts.ts → listPrompts` |
| `getPieceAction` | `lib/data/pieces.ts → getPiece` |
| `listPiecesAction` | `lib/data/pieces.ts → listPieces` |

---

## Client Components

Client components cannot call `unstable_cache` functions directly (server-only).

**Option 1 (preferred):** Pass data as props from a Server Component parent.

```tsx
// Server Component
const { prompts } = await listPrompts({ take: 20 });
return <PromptListClient initialPrompts={prompts} />;
```

**Option 2 (truly dynamic):** Add a `GET` Route Handler in `app/api/` for client-side fetching. The Route Handler calls the same `lib/data/` function internally.

---

## Migration Checklist

- [ ] Create `lib/data/cache-tags.ts`
- [ ] Create `lib/data/prompts.ts` with `getPrompt` + `listPrompts`
- [ ] Create `lib/data/pieces.ts` with `getPiece` + `listPieces`
- [ ] Create `lib/data/categories.ts` with `listCategories`
- [ ] Create `lib/data/tags.ts` with `listTags`
- [ ] Create `lib/data/library.ts` with `getLibraryItem` + `listLibraryItems`
- [ ] Replace `revalidatePath` with `revalidateTag` in all write actions
- [ ] Update Server Components to call data functions instead of read actions
- [ ] Delete removed read actions from `lib/actions/`
