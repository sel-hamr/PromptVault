# Server-Side Data Fetching with URL Query Parameters

This document describes the standard pattern used in this project for fetching and filtering data on the server, driven by URL query parameters.

---

## 1. Page Component (Server) — Read Query Params and Fetch Data

A page inside `app/(dashboard)/` is a **Server Component** by default. Next.js passes the current URL's query string as the `searchParams` prop.

```ts
// app/(dashboard)/prompts/page.tsx

import { PromptFilters } from "@/components/prompts/prompt-filters";
import { PromptList } from "@/components/prompts/prompt-list";
import { fetchPrompts } from "@/lib/data/prompts";

type SearchParams = {
  query?: string;
  status?: string;
  page?: string;
};

type Props = {
  searchParams: Promise<SearchParams>; // Next 15 — await before use
};

export default async function PromptsPage({ searchParams }: Props) {
  const { query = "", status = "all", page = "1" } = await searchParams;

  const prompts = await fetchPrompts({
    query,
    status,
    page: Number(page),
  });

  return (
    <div className="flex flex-col gap-6 p-6">
      <PromptFilters />
      <PromptList prompts={prompts} />
    </div>
  );
}
```

```ts
// lib/data/prompts.ts

import { db } from "@/lib/db";

type FetchPromptsArgs = {
  query: string;
  status: string;
  page: number;
};

export async function fetchPrompts({ query, status, page }: FetchPromptsArgs) {
  const pageSize = 20;

  return db.prompt.findMany({
    where: {
      ...(query ? { title: { contains: query, mode: "insensitive" } } : {}),
      ...(status !== "all" ? { status } : {}),
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: { createdAt: "desc" },
  });
}
```

**Key points:**
- The page reads `searchParams` — no `useState`, no `useEffect`.
- Any change to the URL causes Next.js to re-render the page on the server with fresh data.
- `fetchPrompts` talks directly to the database via Prisma — no API round-trip needed from the server.

---

## 2. Filter Component (Client) — Read and Update URL Query Params

Filters live in a `"use client"` component. They read the current URL with `useSearchParams()` and push a new URL with `useRouter()` when the user interacts.

```tsx
// components/prompts/prompt-filters.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function PromptFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }

      // Reset to page 1 whenever a filter changes
      params.set("page", "1");

      router.replace(`?${params.toString()}`);
    },
    [router, searchParams]
  );

  return (
    <div className="flex items-center gap-3">
      {/* Text search — debounce in production to avoid excessive navigations */}
      <Input
        placeholder="Search prompts…"
        defaultValue={searchParams.get("query") ?? ""}
        onChange={(e) => updateParam("query", e.target.value)}
        className="w-64"
      />

      {/* Status filter */}
      <Select
        value={searchParams.get("status") ?? "all"}
        onValueChange={(value) => updateParam("status", value)}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="draft">Draft</SelectItem>
          <SelectItem value="published">Published</SelectItem>
          <SelectItem value="archived">Archived</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
```

**Key points:**
- `useSearchParams()` reads the live query string — no prop drilling needed.
- `router.replace()` updates the URL without adding a new browser history entry (use `router.push()` if back-navigation matters).
- Always reset `page` to `1` when any filter changes so users don't land on an empty page.
- For text inputs, add a debounce (e.g., `use-debounce` or a `setTimeout` ref) to avoid pushing a new URL on every keystroke.

---

## 3. Card and List Components — Server vs. Client Split

### The rule

> **Render data on the server. Push interactivity to the smallest leaf client component.**

The list and card components that display data are **Server Components**. They receive data as props from the page and produce HTML with zero client JS. Only the parts the user clicks or types into are `"use client"`.

### List container (server)

```tsx
// components/prompts/prompt-list.tsx
// No "use client" — this is a Server Component

import { PromptCard } from "./prompt-card";
import type { Prompt } from "@prisma/client";

type Props = {
  prompts: Prompt[];
};

export function PromptList({ prompts }: Props) {
  if (prompts.length === 0) {
    return <p className="text-muted-foreground">No prompts found.</p>;
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {prompts.map((prompt) => (
        <li key={prompt.id}>
          <PromptCard prompt={prompt} />
        </li>
      ))}
    </ul>
  );
}
```

### Card (server) with an interactive leaf (client)

```tsx
// components/prompts/prompt-card.tsx
// Server Component — renders static data

import { CopyButton } from "./copy-button";
import { formatDate } from "@/lib/utils";
import type { Prompt } from "@prisma/client";

type Props = {
  prompt: Prompt;
};

export function PromptCard({ prompt }: Props) {
  return (
    <div className="rounded-lg border bg-card p-4 flex flex-col gap-2">
      <div className="flex items-start justify-between">
        <h3 className="font-semibold truncate">{prompt.title}</h3>
        {/* Only the button needs to be a client component */}
        <CopyButton value={prompt.content} />
      </div>
      <p className="text-sm text-muted-foreground line-clamp-2">
        {prompt.description}
      </p>
      <span className="text-xs text-muted-foreground">
        {formatDate(prompt.createdAt)}
      </span>
    </div>
  );
}
```

```tsx
// components/prompts/copy-button.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";

type Props = {
  value: string;
};

export function CopyButton({ value }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button variant="ghost" size="icon" onClick={handleCopy}>
      {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
    </Button>
  );
}
```

**Key points:**
- `PromptList` and `PromptCard` are server components — they ship no JS to the browser.
- `CopyButton` receives only the `value` string it needs — not the full `Prompt` object.
- The same pattern applies to any interactive leaf: a favorite toggle, a share dropdown, a delete button that calls a Server Action.

---

## Data Flow Summary

```
URL (query string)
  └─► page.tsx (server) — reads searchParams, calls fetchPrompts()
        ├─► <PromptFilters /> (client) — reads + writes searchParams via router
        └─► <PromptList /> (server)
              └─► <PromptCard /> (server)
                    └─► <CopyButton /> (client) — handles click interaction
```
