import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, type Prisma } from "@prisma/client";
import slugify from "slugify";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const db = new PrismaClient({ adapter });

const TARGET_EMAIL = "selham9@gmail.com";

type ModelTarget =
  | "CHATGPT"
  | "CLAUDE"
  | "MIDJOURNEY"
  | "GEMINI"
  | "DALLE"
  | "STABLE_DIFFUSION"
  | "UNIVERSAL";

type Visibility = "PUBLIC" | "PRIVATE" | "UNLISTED";

const CATEGORY_TREE: Array<{ name: string; children: string[] }> = [
  {
    name: "Coding",
    children: ["Code Review", "Debugging", "Refactoring", "Documentation", "Testing"],
  },
  {
    name: "TypeScript",
    children: ["Types & Generics", "Migrations"],
  },
  {
    name: "React",
    children: ["Components", "Hooks", "Performance"],
  },
  {
    name: "Next.js",
    children: ["App Router", "Server Actions", "API Routes"],
  },
  {
    name: "Node.js",
    children: ["Backend", "Tooling"],
  },
];

const TAG_NAMES = [
  "typescript",
  "react",
  "nextjs",
  "nodejs",
  "prisma",
  "zod",
  "testing",
  "vitest",
  "playwright",
  "performance",
  "accessibility",
  "refactor",
  "debugging",
  "code-review",
  "server-actions",
  "app-router",
  "tailwind",
  "shadcn",
  "documentation",
  "migration",
];

type PromptSeed = {
  title: string;
  description: string;
  content: string;
  model_target: ModelTarget;
  visibility: Visibility;
  category_slug?: string;
  tags?: string[];
  variables?: Array<{ name: string; label?: string; default?: string }>;
};

const PROMPTS: PromptSeed[] = [
  {
    title: "TypeScript PR review",
    description:
      "Senior-level review of a TypeScript pull request, focused on correctness and types.",
    content:
      "Review the following diff as a staff TypeScript engineer. Check for: type safety (no implicit `any`, no unjustified `as`), error handling, async/await correctness, edge cases, performance, and readability. For each issue, output a row in a markdown table with columns: File:Line, Severity (low/med/high), Issue, Suggested fix.\n\nDiff:\n{{diff}}",
    model_target: "CLAUDE",
    visibility: "PRIVATE",
    category_slug: "code-review",
    tags: ["typescript", "code-review", "refactor"],
    variables: [{ name: "diff", label: "Git diff" }],
  },
  {
    title: "Explain a TypeScript error",
    description: "Translate a cryptic TS error into a plain-English fix.",
    content:
      "Explain the following TypeScript error in plain English: (1) what the compiler is actually complaining about, (2) why the types don't line up, (3) the minimal fix, (4) one safer alternative if the minimal fix uses `as` or `!`.\n\nError:\n{{error}}\n\nRelevant code:\n{{code}}",
    model_target: "CLAUDE",
    visibility: "PRIVATE",
    category_slug: "types-and-generics",
    tags: ["typescript", "debugging"],
    variables: [
      { name: "error", label: "TypeScript error message" },
      { name: "code", label: "Code excerpt" },
    ],
  },
  {
    title: "Remove `any` from a module",
    description: "Refactor a file to remove `any` and tighten its types.",
    content:
      "Refactor the following code to remove every `any` and unjustified `as` assertion. Use narrow types, discriminated unions, and `unknown` with type guards where appropriate. Preserve the public API. Output a unified diff.\n\nFile:\n{{file_contents}}",
    model_target: "CLAUDE",
    visibility: "PRIVATE",
    category_slug: "refactoring",
    tags: ["typescript", "refactor"],
    variables: [{ name: "file_contents" }],
  },
  {
    title: "Generate Zod schema from TS type",
    description: "Convert a TypeScript type into a runtime-validated Zod schema.",
    content:
      "Generate a Zod schema that matches the following TypeScript type exactly. Add `.min()`, `.max()`, `.email()`, `.url()` where the field name implies a constraint. Export both the schema and an inferred type alias.\n\nType:\n{{type}}",
    model_target: "CLAUDE",
    visibility: "PRIVATE",
    category_slug: "types-and-generics",
    tags: ["typescript", "zod"],
    variables: [{ name: "type", label: "TypeScript type definition" }],
  },
  {
    title: "Debug a Node.js stack trace",
    description: "Diagnose a Node.js error and propose a minimal fix.",
    content:
      "Diagnose this Node.js error. List the most likely root causes ordered by probability with a one-line justification for each. Then propose the minimal fix and one defensive change to prevent the same class of bug.\n\nStack trace:\n{{stack_trace}}\n\nContext (what the user was doing):\n{{context}}",
    model_target: "CLAUDE",
    visibility: "PRIVATE",
    category_slug: "debugging",
    tags: ["nodejs", "debugging"],
    variables: [
      { name: "stack_trace" },
      { name: "context", default: "" },
    ],
  },
  {
    title: "React component a11y audit",
    description: "WCAG AA review of a React component.",
    content:
      "Audit the following React component against WCAG 2.1 AA. Check: keyboard navigation, focus management, ARIA roles and labels, color contrast, screen-reader semantics, and reduced-motion support. Output a markdown table: Issue, Severity, Fix (with code snippet).\n\nComponent:\n{{component}}",
    model_target: "CLAUDE",
    visibility: "PRIVATE",
    category_slug: "components",
    tags: ["react", "accessibility"],
    variables: [{ name: "component", label: "React component source" }],
  },
  {
    title: "Optimize React re-renders",
    description: "Identify and fix unnecessary re-renders in a React tree.",
    content:
      "Identify unnecessary re-renders in the following React component. For each, explain the cause (prop identity, context, parent re-render, etc.) and the fix. Only suggest `useMemo`/`useCallback`/`React.memo` when there is a measurable cost — prefer composition (lifting state, splitting components) first.\n\nComponent:\n{{component}}",
    model_target: "CLAUDE",
    visibility: "PRIVATE",
    category_slug: "performance",
    tags: ["react", "performance"],
    variables: [{ name: "component" }],
  },
  {
    title: "Class to function component",
    description: "Migrate a React class component to a function component with hooks.",
    content:
      "Convert the following React class component to a function component using hooks. Map: `state` → `useState`, lifecycle methods → `useEffect` with the right dependency array, refs → `useRef`. Preserve the public props API. Output a unified diff.\n\nClass component:\n{{component}}",
    model_target: "CLAUDE",
    visibility: "PRIVATE",
    category_slug: "components",
    tags: ["react", "refactor", "migration"],
    variables: [{ name: "component" }],
  },
  {
    title: "Pages Router → App Router",
    description: "Migrate a Next.js Pages Router route to the App Router.",
    content:
      "Migrate the following Next.js Pages Router route to the App Router. Convert: `getServerSideProps`/`getStaticProps` → Server Component data fetching, API routes → route handlers or Server Actions, `_app.tsx` concerns → root layout. Default to Server Components; only use `'use client'` when state, effects, or browser APIs require it. Output the new file tree and each new file's contents.\n\nExisting route:\n{{route}}",
    model_target: "CLAUDE",
    visibility: "PRIVATE",
    category_slug: "app-router",
    tags: ["nextjs", "app-router", "migration"],
    variables: [{ name: "route", label: "Existing pages/ route source" }],
  },
  {
    title: "Server Action with next-safe-action",
    description: "Generate a typed Server Action with Zod input validation.",
    content:
      "Generate a Next.js Server Action using `next-safe-action`. Requirements:\n- Action name: {{name}}\n- Inputs: {{inputs}}\n- Side effect: {{effect}}\n- Auth required: {{auth_required}}\n\nOutput: (1) the Zod schema in `lib/validators.ts`, (2) the action in `lib/actions/{{name}}.actions.ts` using `actionClient` from `lib/safe-action.ts`, returning either the result or `{ error }`.",
    model_target: "CLAUDE",
    visibility: "PRIVATE",
    category_slug: "server-actions",
    tags: ["nextjs", "server-actions", "zod", "typescript"],
    variables: [
      { name: "name", default: "createPost" },
      { name: "inputs", default: "title: string, body: string" },
      { name: "effect", default: "insert into posts table via Prisma" },
      { name: "auth_required", default: "yes" },
    ],
  },
  {
    title: "Next.js API route with Zod",
    description: "Scaffold a route handler with auth, Zod validation, and typed errors.",
    content:
      "Generate a Next.js App Router route handler at `app/api/{{path}}/route.ts`. Requirements:\n- Methods: {{methods}}\n- Auth: call `auth()` from `lib/auth.ts`; return 401 if no session.\n- Validate the request body/query with Zod; return 400 with `{ error, issues }` on failure.\n- Use Prisma `db` from `lib/db.ts`.\n- Return typed JSON responses.\n\nDescribe the endpoint: {{description}}",
    model_target: "CLAUDE",
    visibility: "PRIVATE",
    category_slug: "api-routes",
    tags: ["nextjs", "zod", "typescript"],
    variables: [
      { name: "path" },
      { name: "methods", default: "GET, POST" },
      { name: "description" },
    ],
  },
  {
    title: "Prisma migration plan",
    description: "Plan a safe Prisma schema change with rollback.",
    content:
      "Plan a Prisma migration for the following schema change. Output:\n1. The updated `schema.prisma` snippet.\n2. The migration order (add column → backfill → enforce NOT NULL, etc.) to avoid downtime.\n3. Backfill SQL if needed.\n4. Rollback steps.\n5. Risks (locks, long-running queries on large tables).\n\nChange:\n{{change}}",
    model_target: "CLAUDE",
    visibility: "PRIVATE",
    category_slug: "migrations",
    tags: ["prisma", "migration"],
    variables: [{ name: "change", label: "Describe the schema change" }],
  },
  {
    title: "Vitest unit test",
    description: "Generate Vitest tests for a TypeScript function.",
    content:
      "Write Vitest unit tests for the following function. Cover: the happy path, each branch, boundary conditions, and one failure case. Use `describe`/`it`, no snapshots. If the function calls external services, mock them with `vi.mock`. Output a single test file.\n\nFunction:\n{{function}}",
    model_target: "CLAUDE",
    visibility: "PRIVATE",
    category_slug: "testing",
    tags: ["testing", "vitest", "typescript"],
    variables: [{ name: "function", label: "Function source" }],
  },
  {
    title: "Playwright E2E spec",
    description: "Write a Playwright spec for a user journey.",
    content:
      "Write a Playwright E2E spec for the following user journey. Use role-based selectors (`getByRole`, `getByLabel`). Avoid `page.locator('css')` unless no semantic option exists. Include at least one assertion per major step.\n\nJourney:\n{{journey}}",
    model_target: "CLAUDE",
    visibility: "PRIVATE",
    category_slug: "testing",
    tags: ["testing", "playwright"],
    variables: [{ name: "journey", default: "User signs up, logs in, creates a post, sees it on the dashboard." }],
  },
  {
    title: "Tailwind v4 + shadcn refactor",
    description: "Modernize a component to Tailwind v4 + shadcn conventions.",
    content:
      "Refactor the following component to match this project's conventions: Tailwind CSS v4 (no `tailwind.config.ts`), shadcn/ui primitives from `components/ui/`, conditional classes via `cn()` from `lib/utils.ts`. Replace ad-hoc UI elements with shadcn equivalents where they exist (Button, Input, Dialog, etc.). Output a unified diff.\n\nComponent:\n{{component}}",
    model_target: "CLAUDE",
    visibility: "PRIVATE",
    category_slug: "components",
    tags: ["react", "tailwind", "shadcn", "refactor"],
    variables: [{ name: "component" }],
  },
  {
    title: "JSDoc + signature for a function",
    description: "Document a function with JSDoc and tighten its signature.",
    content:
      "For the following function, output: (1) a tightened TypeScript signature with explicit param and return types, (2) a JSDoc block above it covering @param, @returns, @throws, and one @example. Do not change the function body unless types require it.\n\nFunction:\n{{function}}",
    model_target: "CLAUDE",
    visibility: "PRIVATE",
    category_slug: "documentation",
    tags: ["typescript", "documentation"],
    variables: [{ name: "function" }],
  },
  {
    title: "Diagnose hydration mismatch",
    description: "Find the cause of a Next.js hydration error.",
    content:
      "Diagnose this Next.js hydration mismatch. List the common causes ordered by probability for this code (Date.now/Math.random, locale formatting, conditional rendering on `typeof window`, mismatched server/client data, third-party scripts). Identify which applies here and the minimal fix.\n\nError:\n{{error}}\n\nComponent:\n{{component}}",
    model_target: "CLAUDE",
    visibility: "PRIVATE",
    category_slug: "debugging",
    tags: ["nextjs", "react", "debugging"],
    variables: [
      { name: "error" },
      { name: "component" },
    ],
  },
  {
    title: "Bundle size investigation",
    description: "Find what is bloating a Next.js client bundle.",
    content:
      "Given the following bundle analyzer output and component tree, identify the top 3 sources of bundle bloat. For each: name the package or module, estimate KB saved, and propose a fix (dynamic import, server-only, smaller alternative, tree-shake-friendly import).\n\nAnalyzer output:\n{{analyzer}}\n\nRelevant components:\n{{components}}",
    model_target: "CLAUDE",
    visibility: "PRIVATE",
    category_slug: "performance",
    tags: ["nextjs", "performance"],
    variables: [
      { name: "analyzer" },
      { name: "components" },
    ],
  },
  {
    title: "REST endpoint → Server Action",
    description: "Replace a REST API call with a typed Server Action.",
    content:
      "Convert the following REST endpoint + client `fetch` call into a Next.js Server Action using `next-safe-action`. Move validation server-side with Zod, remove the client `fetch`, and call the action directly from the form/component. Show: the new action, the updated client component, and the deleted route.\n\nExisting endpoint:\n{{endpoint}}\n\nClient call site:\n{{client}}",
    model_target: "CLAUDE",
    visibility: "PRIVATE",
    category_slug: "server-actions",
    tags: ["nextjs", "server-actions", "refactor"],
    variables: [
      { name: "endpoint" },
      { name: "client" },
    ],
  },
  {
    title: "Stack decision ADR",
    description: "Write an Architecture Decision Record for a stack choice.",
    content:
      "Write an Architecture Decision Record for the following choice. Sections: Context, Decision, Consequences (positive and negative), Alternatives considered (at least 2, with one-line tradeoff each). Keep each section under 5 sentences.\n\nDecision to record: {{decision}}",
    model_target: "CLAUDE",
    visibility: "PRIVATE",
    category_slug: "documentation",
    tags: ["documentation"],
    variables: [{ name: "decision", default: "Adopt Server Actions instead of REST routes for internal mutations" }],
  },
];

function slug(s: string) {
  return slugify(s, { lower: true, strict: true });
}

async function main() {
  console.log(`Looking up user ${TARGET_EMAIL}...`);
  const user = await db.user.findUnique({ where: { email: TARGET_EMAIL } });
  if (!user) {
    console.error(
      `No user found with email ${TARGET_EMAIL}. Register that account first, then re-run this seed.`,
    );
    process.exit(1);
  }

  console.log(`Removing existing prompts for ${user.email}...`);
  const existing = await db.prompt.findMany({
    where: { user_id: user.id },
    select: { id: true },
  });
  if (existing.length) {
    const ids = existing.map((p) => p.id);
    await db.promptTag.deleteMany({ where: { prompt_id: { in: ids } } });
    await db.prompt.deleteMany({ where: { id: { in: ids } } });
  }

  console.log("Upserting categories...");
  const categoryBySlug = new Map<string, string>();
  for (const root of CATEGORY_TREE) {
    const rootSlug = slug(root.name);
    const rootCat = await db.category.upsert({
      where: { slug: rootSlug },
      update: {},
      create: { name: root.name, slug: rootSlug, depth: 0 },
    });
    categoryBySlug.set(rootSlug, rootCat.id);

    for (const childName of root.children) {
      const childSlug = slug(childName);
      const childCat = await db.category.upsert({
        where: { slug: childSlug },
        update: { parent_id: rootCat.id, depth: 1 },
        create: {
          name: childName,
          slug: childSlug,
          parent_id: rootCat.id,
          depth: 1,
        },
      });
      categoryBySlug.set(childSlug, childCat.id);
    }
  }

  console.log("Upserting tags...");
  const tagBySlug = new Map<string, string>();
  for (const name of TAG_NAMES) {
    const tagSlug = slug(name);
    const tag = await db.tag.upsert({
      where: { slug: tagSlug },
      update: {},
      create: { name, slug: tagSlug },
    });
    tagBySlug.set(tagSlug, tag.id);
  }

  console.log(`Seeding ${PROMPTS.length} prompts...`);
  for (const p of PROMPTS) {
    const categoryId = p.category_slug
      ? categoryBySlug.get(p.category_slug)
      : undefined;
    if (p.category_slug && !categoryId) {
      console.warn(`  [warn] unknown category_slug: ${p.category_slug}`);
    }

    const tagIds = (p.tags ?? [])
      .map((t) => tagBySlug.get(slug(t)))
      .filter((x): x is string => Boolean(x));

    await db.prompt.create({
      data: {
        user_id: user.id,
        title: p.title,
        description: p.description,
        content: p.content,
        model_target: p.model_target,
        visibility: p.visibility,
        category_id: categoryId,
        variables: (p.variables ?? []) as unknown as Prisma.InputJsonValue,
        tags: tagIds.length
          ? { create: tagIds.map((tag_id) => ({ tag_id })) }
          : undefined,
      },
    });

    if (categoryId) {
      await db.category.update({
        where: { id: categoryId },
        data: { prompt_count: { increment: 1 } },
      });
    }
    for (const tag_id of tagIds) {
      await db.tag.update({
        where: { id: tag_id },
        data: { usage_count: { increment: 1 } },
      });
    }
  }

  console.log("Done.");
  console.log(
    `User ${user.email}: ${PROMPTS.length} prompts, ${categoryBySlug.size} categories touched, ${tagBySlug.size} tags touched.`,
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
