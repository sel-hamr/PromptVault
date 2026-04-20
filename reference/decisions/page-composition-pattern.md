# Page Composition Pattern

Standard pattern for building a new dashboard page with server data fetching, URL-driven filters, and server/client component split.

---

## 1. Data Layer — `lib/data/<resource>.ts`

Create a plain async function that queries the DB directly. No Server Actions for reads.

```ts
// lib/data/prompts.ts
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";

const include = {
  category: true,
  tags: { include: { tag: true } },
} satisfies Prisma.PromptInclude;

export type PromptWithRelations = Prisma.PromptGetPayload<{
  include: typeof include;
}>;

export async function fetchPrompts({
  userId, // optional — omit to fetch all
  q,
  sort = "newest",
}: {
  userId?: string;
  q?: string;
  sort?: string;
}): Promise<PromptWithRelations[]> {
  return db.prompt.findMany({
    where: {
      ...(userId ? { user_id: userId } : {}),
      ...(q ? { title: { contains: q, mode: "insensitive" } } : {}),
    },
    orderBy: sort === "oldest" ? { created_at: "asc" } : { created_at: "desc" },
    include,
  });
}
```

**Rules:**

- Export the Prisma payload type so components can import it instead of deriving from actions.
- Keep each resource in its own file: `lib/data/prompts.ts`, `lib/data/categories.ts`, etc.

---

## 2. URL Filter Hook — `_components/use-<resource>-filters.ts`

Encapsulates all `useSearchParams` / `router.replace` logic. Components call this hook — no prop drilling for filter state.

```ts
// _components/use-prompt-filters.ts
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export function usePromptFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      value ? params.set(key, value) : params.delete(key);
      router.replace(`?${params.toString()}`);
    },
    [router, searchParams],
  );

  const q = searchParams.get("q") ?? "";
  const sort = searchParams.get("sort") ?? "newest";
  const view = searchParams.get("view") ?? "grid";
  const hasFilters = !!(q || sort !== "newest");

  return { q, sort, view, hasFilters, updateParam };
}
```

---

## 3. Page — `app/(dashboard)/<route>/page.tsx`

Server Component. Reads `searchParams`, calls fetch functions, composes layout. No `useState`, no `useEffect`.

```tsx
// app/(dashboard)/prompts/page.tsx
import Link from "next/link";
import { Plus } from "lucide-react";
import { auth } from "@/lib/auth";
import { fetchPrompts } from "@/lib/data/prompts";
import { fetchCategories } from "@/lib/data/categories";
import { Button } from "@/components/ui/button";
import { PromptToolbar } from "./_components/prompt-toolbar";
import { PromptList } from "./_components/prompt-list";

type SearchParams = { q?: string; sort?: string; view?: string };
type Props = { searchParams: Promise<SearchParams> };

export default async function MyPromptsPage({ searchParams }: Props) {
  const session = await auth();
  const userId = session!.user!.id!;

  const { q = "", sort = "newest", view = "grid" } = await searchParams;
  const hasFilters = !!(q || sort !== "newest");

  const [prompts, categories] = await Promise.all([
    fetchPrompts({ userId, q: q || undefined, sort }),
    fetchCategories(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-end justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">My Prompts</h1>
          <p className="text-sm text-muted-foreground">
            {prompts.length} {prompts.length === 1 ? "prompt" : "prompts"}
            {hasFilters ? " matching your filters" : ""}
          </p>
        </div>
        {/* Navigation to create page — no dialog, no client state */}
        <Button asChild>
          <Link href="/compose">
            <Plus />
            New prompt
          </Link>
        </Button>
      </div>
      <PromptToolbar categories={categories} /> {/* client */}
      <PromptList prompts={prompts} view={view} hasFilters={hasFilters} />{" "}
      {/* server */}
    </div>
  );
}
```

**Rules:**

- `searchParams` is `Promise<…>` in Next.js 15 — always `await` it.
- Compute `hasFilters` on the server and pass it as a prop.
- Navigation to a create/edit page replaces dialogs when possible — keeps the page server-only.

---

## 4. Filter Toolbar — `_components/<resource>-toolbar.tsx` (Client)

Reads and writes URL params via the custom hook. Receives only static data (e.g. categories list) as props.

```tsx
"use client";

import { Input } from "@/components/ui/input";
import { usePromptFilters } from "./use-prompt-filters";

export function PromptToolbar({ categories }) {
  const { q, sort, view, updateParam } = usePromptFilters();

  return (
    <div className="flex gap-2">
      <Input
        defaultValue={q}
        onChange={(e) => updateParam("q", e.target.value)}
        placeholder="Search…"
      />
      {/* selects, view toggle — all call updateParam */}
    </div>
  );
}
```

---

## 5. List + Cards — Server Components

The list and card components are Server Components — no `"use client"`, no JS shipped to the browser for them. Interactive leaves (copy button, etc.) are small `"use client"` components imported inside.

```tsx
// _components/prompt-list.tsx  (server)
import { PromptCard } from "./prompt-card";

export function PromptList({ prompts, view, hasFilters }) {
  if (prompts.length === 0) return <EmptyState hasFilters={hasFilters} />;
  if (view === "list")
    return (
      <div>
        {prompts.map((p) => (
          <PromptListRow key={p.id} prompt={p} />
        ))}
      </div>
    );
  return (
    <div className="grid">
      {prompts.map((p) => (
        <PromptCard key={p.id} prompt={p} />
      ))}
    </div>
  );
}

// _components/prompt-card.tsx  (server)
import { CopyButton } from "@/components/ui/copy-button"; // client leaf

export function PromptCard({ prompt }) {
  return (
    <Link href={`/prompts/${prompt.id}`}>
      <CopyButton value={prompt.content} /> {/* only this is client */}
      <h3>{prompt.title}</h3>
      <p>{prompt.description}</p>
    </Link>
  );
}
```

---

## Data Flow Summary

```
URL (?q=&sort=&view=)
  └─► page.tsx (server) — awaits searchParams, calls fetchX()
        ├─► <Toolbar /> (client) — useSearchParams + router.replace via custom hook
        └─► <List /> (server)
              └─► <Card /> (server)
                    └─► <CopyButton /> (client leaf — only interactive part)
```

## Reusable Client Leaves (`components/ui/`)

Generic interactive components live in `components/ui/` so any page can use them:

| Component    | Props                                       | Purpose                |
| ------------ | ------------------------------------------- | ---------------------- |
| `CopyButton` | `value`, `successMessage?`, `errorMessage?` | Copy text to clipboard |

---

## Checklist for a New Page

- [ ] `lib/data/<resource>.ts` — fetch function with all filters optional
- [ ] `_components/use-<resource>-filters.ts` — URL param hook
- [ ] `_components/<resource>-toolbar.tsx` — `"use client"`, uses hook
- [ ] `_components/<resource>-list.tsx` — server, handles empty state
- [ ] `_components/<resource>-card.tsx` — server, imports client leaves
- [ ] `page.tsx` — server, reads `searchParams`, composes layout
- [ ] Create/edit flow → navigate to dedicated page, not a dialog
