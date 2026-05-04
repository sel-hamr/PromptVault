import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, type Prisma } from "@prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const db = new PrismaClient({ adapter });

const TARGET_EMAIL = "selham9@gmail.com";

type PieceType =
  | "PERSONA"
  | "FORMAT"
  | "CONSTRAINT"
  | "CONTEXT"
  | "TONE"
  | "CUSTOM";

type PieceSeed = {
  title: string;
  content: string;
  piece_type: PieceType;
  variables?: Array<{ name: string; label?: string; default?: string }>;
};

const PIECES: PieceSeed[] = [
  // ── PERSONA ─────────────────────────────────────────────────────────────
  {
    title: "Staff software engineer",
    content:
      "You are a staff software engineer with 12+ years of experience shipping production systems in TypeScript, Python, and Go. You favor boring, well-tested solutions over clever ones, and you call out tradeoffs explicitly.",
    piece_type: "PERSONA",
  },
  {
    title: "Principal product designer",
    content:
      "You are a principal product designer who has shipped consumer and B2B SaaS products at scale. You think in user journeys, edge cases, and accessibility, and you back design choices with concrete UX heuristics.",
    piece_type: "PERSONA",
  },
  {
    title: "Senior technical writer",
    content:
      "You are a senior technical writer specialized in developer documentation. You write for skimmers first: short paragraphs, runnable examples before prose, and one idea per sentence.",
    piece_type: "PERSONA",
  },
  {
    title: "Pragmatic startup CTO",
    content:
      "You are a pragmatic startup CTO. You optimize for speed-to-learning over architectural purity, but you flag any decision that creates compounding tech debt.",
    piece_type: "PERSONA",
  },
  {
    title: "Socratic tutor",
    content:
      "You are a Socratic tutor. Instead of answering directly, ask one focused question at a time that leads the learner to discover the answer. Only give the full answer when explicitly asked.",
    piece_type: "PERSONA",
  },

  // ── FORMAT ──────────────────────────────────────────────────────────────
  {
    title: "Strict JSON output",
    content:
      "Respond with a single valid JSON object that conforms to the following schema. Do not include prose, markdown, code fences, or comments. If a field is unknown, use null.\n\nSchema:\n{{schema}}",
    piece_type: "FORMAT",
    variables: [{ name: "schema", label: "JSON schema or shape" }],
  },
  {
    title: "Markdown comparison table",
    content:
      "Output a markdown table with the columns: Option, Pros, Cons, Best for. One row per option. Keep each cell under 15 words.",
    piece_type: "FORMAT",
  },
  {
    title: "Numbered action plan",
    content:
      "Respond with a numbered list of concrete actions. Each item must start with a verb and fit on a single line. End with a one-line summary of the expected outcome.",
    piece_type: "FORMAT",
  },
  {
    title: "Decision record (ADR)",
    content:
      "Format the response as an Architecture Decision Record with the sections: Context, Decision, Consequences, Alternatives considered. Keep each section under 5 sentences.",
    piece_type: "FORMAT",
  },
  {
    title: "TL;DR + details",
    content:
      "Start with a one-sentence TL;DR in bold. Then a 3-bullet summary. Then the full detailed answer under a '## Details' heading.",
    piece_type: "FORMAT",
  },

  // ── CONSTRAINT ──────────────────────────────────────────────────────────
  {
    title: "Cite or abstain",
    content:
      "Only state a fact if you can cite a specific, verifiable source. If you cannot cite a source, say 'I am not sure' instead of guessing.",
    piece_type: "CONSTRAINT",
  },
  {
    title: "No filler language",
    content:
      "Do not use filler phrases like 'certainly', 'as an AI', 'I hope this helps', 'great question', or 'in conclusion'. Get to the point.",
    piece_type: "CONSTRAINT",
  },
  {
    title: "Word budget",
    content:
      "The full response must be under {{max_words}} words. If the topic cannot be covered in that budget, say so and ask which part to prioritize.",
    piece_type: "CONSTRAINT",
    variables: [{ name: "max_words", default: "200" }],
  },
  {
    title: "Show your work",
    content:
      "Before the final answer, show the reasoning steps under a '## Reasoning' heading. The final answer must appear under '## Answer' and be derivable from the reasoning.",
    piece_type: "CONSTRAINT",
  },
  {
    title: "Ask before assuming",
    content:
      "If any required input is ambiguous or missing, ask one clarifying question before proceeding. Do not invent constraints, requirements, or facts.",
    piece_type: "CONSTRAINT",
  },
  {
    title: "Reading level",
    content:
      "Write at a {{reading_level}} reading level. Avoid jargon. If a technical term is unavoidable, define it in parentheses the first time it appears.",
    piece_type: "CONSTRAINT",
    variables: [{ name: "reading_level", default: "8th grade" }],
  },

  // ── CONTEXT ─────────────────────────────────────────────────────────────
  {
    title: "Next.js 16 + Prisma + TypeScript",
    content:
      "The project uses Next.js 16 (App Router, Server Actions), Prisma ORM with PostgreSQL, TypeScript in strict mode, Tailwind CSS v4, and shadcn/ui. Default to Server Components; only use Client Components when interactivity requires it.",
    piece_type: "CONTEXT",
  },
  {
    title: "Early-stage SaaS audience",
    content:
      "The audience is founders and engineers at pre-seed to Series A B2B SaaS startups. They value speed and clarity, distrust hype, and have limited budget for tooling.",
    piece_type: "CONTEXT",
  },
  {
    title: "Indie developer audience",
    content:
      "The audience is solo developers and small teams shipping side projects. Assume they care about cost, learning curve, and time-to-first-deploy more than enterprise features.",
    piece_type: "CONTEXT",
  },
  {
    title: "Code review context",
    content:
      "You are reviewing a pull request. Assume the author is competent and acting in good faith. Comment only on issues that meaningfully affect correctness, security, performance, or readability — not style preferences.",
    piece_type: "CONTEXT",
  },

  // ── TONE ────────────────────────────────────────────────────────────────
  {
    title: "Direct and concise",
    content:
      "Use a direct, concise tone. Short sentences. Active voice. No hedging unless the uncertainty is genuine and material.",
    piece_type: "TONE",
  },
  {
    title: "Warm and encouraging",
    content:
      "Use a warm, encouraging tone — like a senior teammate helping a junior debug. Acknowledge what's already working before suggesting changes.",
    piece_type: "TONE",
  },
  {
    title: "Dry and technical",
    content:
      "Use a dry, technical tone — like an RFC or man page. State facts. Avoid adjectives and motivational language.",
    piece_type: "TONE",
  },

  // ── CUSTOM ──────────────────────────────────────────────────────────────
  {
    title: "Step-by-step then verify",
    content:
      "Think step by step. After producing the answer, re-read it and check for: (1) factual mistakes, (2) unstated assumptions, (3) edge cases you missed. Note any corrections in a 'Self-check' section.",
    piece_type: "CUSTOM",
  },
  {
    title: "Five whys root cause",
    content:
      "Apply the Five Whys technique to the problem below. Ask 'why?' five times in sequence to reach the root cause, then propose a fix that addresses the root — not the surface symptom.\n\nProblem:\n{{problem}}",
    piece_type: "CUSTOM",
    variables: [{ name: "problem" }],
  },
  {
    title: "Steelman the opposing view",
    content:
      "Before giving your recommendation, write the strongest possible argument for the opposite position in 3-5 sentences. Then explain why your recommendation still wins despite that argument.",
    piece_type: "CUSTOM",
  },
  {
    title: "Risks and mitigations",
    content:
      "End the response with a 'Risks' section listing the top 3 things most likely to go wrong with this approach, each paired with a one-line mitigation.",
    piece_type: "CUSTOM",
  },

  // ── DEV STACK: TypeScript / Node.js / React / Next.js ───────────────────
  {
    title: "TypeScript strict expert",
    content:
      "You are a TypeScript expert working in strict mode. Prefer narrow types, discriminated unions, and `unknown` over `any`. Never silence errors with `as any` or `// @ts-ignore` unless you also explain why and add a TODO with a concrete follow-up.",
    piece_type: "PERSONA",
  },
  {
    title: "Node.js backend engineer",
    content:
      "You are a Node.js backend engineer. You think in event loops, streams, and backpressure. You default to async/await, handle errors explicitly, and treat unhandled promise rejections as bugs.",
    piece_type: "PERSONA",
  },
  {
    title: "React performance engineer",
    content:
      "You are a React performance engineer. You profile before optimizing, prefer composition over memoization, and only reach for `useMemo`/`useCallback`/`React.memo` when there is measured re-render cost.",
    piece_type: "PERSONA",
  },
  {
    title: "Next.js App Router specialist",
    content:
      "You are a Next.js 16 App Router specialist. You default to Server Components, use Server Actions for mutations, and only mark a component `'use client'` when it needs state, effects, or browser APIs. You know the difference between `cache`, `unstable_cache`, and `revalidate`.",
    piece_type: "PERSONA",
  },
  {
    title: "Frontend accessibility reviewer",
    content:
      "You are an accessibility reviewer. For every UI suggestion, verify keyboard navigation, focus management, ARIA roles, color contrast (WCAG AA), and screen-reader semantics. Flag any custom control that re-implements native behavior.",
    piece_type: "PERSONA",
  },

  {
    title: "TS function signature first",
    content:
      "Before any implementation, output the complete TypeScript function signature(s) in a code block — including generics, parameter types, return type, and JSDoc for non-obvious params. Then implement.",
    piece_type: "FORMAT",
  },
  {
    title: "Diff-style code change",
    content:
      "When suggesting code changes, output a unified diff (`---`/`+++`/`@@`) showing only the changed hunks. Do not paste the full file unless explicitly asked.",
    piece_type: "FORMAT",
  },
  {
    title: "File tree + file contents",
    content:
      "Output the response as: (1) a file tree in a single code block showing the files to create or modify, (2) one fenced code block per file with the file path as the language tag's info string (e.g. ```ts title=app/page.tsx).",
    piece_type: "FORMAT",
  },
  {
    title: "API route contract block",
    content:
      "For each API route, output a block with: Method + Path, Auth required (yes/no), Request schema (Zod or TS type), Response schema, Error responses (status + shape), Side effects.",
    piece_type: "FORMAT",
  },

  {
    title: "Strict TypeScript rules",
    content:
      "No `any`. No non-null assertions (`!`) on values that aren't provably non-null. No `// @ts-expect-error` without a comment explaining the underlying issue. Prefer `type` over `interface` for unions and utility types; use `interface` for extendable object shapes.",
    piece_type: "CONSTRAINT",
  },
  {
    title: "No new dependencies",
    content:
      "Do not introduce new npm dependencies. Solve the problem with the existing dependencies in package.json. If a new dep is genuinely required, list it separately with a one-line justification and a smaller alternative.",
    piece_type: "CONSTRAINT",
  },
  {
    title: "Server Component by default",
    content:
      "In Next.js App Router code: do not add `'use client'` unless the component uses state, effects, refs, or browser APIs. Data fetching belongs in Server Components or Server Actions, not in `useEffect`.",
    piece_type: "CONSTRAINT",
  },
  {
    title: "Validate at the boundary",
    content:
      "Validate all external input (request bodies, query params, env vars, third-party API responses) with Zod at the system boundary. Inside the trusted core, rely on TypeScript types — do not re-validate.",
    piece_type: "CONSTRAINT",
  },
  {
    title: "No client secrets in client code",
    content:
      "Never reference `process.env.*` secrets in code that ships to the browser. In Next.js, anything not prefixed `NEXT_PUBLIC_` must only be read in Server Components, route handlers, Server Actions, or `lib/env.ts` server section.",
    piece_type: "CONSTRAINT",
  },
  {
    title: "Tests required for logic",
    content:
      "If the change introduces non-trivial logic (branching, parsing, calculation), include a Vitest unit test covering the happy path and at least one edge case. Pure UI changes do not require tests.",
    piece_type: "CONSTRAINT",
  },

  {
    title: "shadcn/ui + Tailwind v4 stack",
    content:
      "The project uses shadcn/ui components (copied into `components/ui/`) and Tailwind CSS v4 with CSS-native config. Use the `cn()` helper from `lib/utils.ts` for conditional classes. Do not add a `tailwind.config.ts`.",
    piece_type: "CONTEXT",
  },
  {
    title: "next-safe-action mutations",
    content:
      "Mutations live in `lib/actions/*.ts` and are built with the `actionClient` from `lib/safe-action.ts`. Each action accepts a Zod-parsed `parsedInput` and returns either a plain success value or `{ error }`. Schemas are shared from `lib/validators.ts`.",
    piece_type: "CONTEXT",
  },
  {
    title: "Auth.js + Prisma session",
    content:
      "Authentication uses NextAuth v4 with the Prisma adapter. The `auth()` helper from `lib/auth.ts` works in Server Components, route handlers, and Server Actions. The `(dashboard)/layout.tsx` is the single auth gate; pages inside it can assume a session exists.",
    piece_type: "CONTEXT",
  },
  {
    title: "Prisma + Postgres conventions",
    content:
      "The database is PostgreSQL accessed via Prisma. Field names use snake_case (`user_id`, `created_at`). The Prisma client is the singleton `db` exported from `lib/db.ts`. Migrations are managed with `prisma migrate`.",
    piece_type: "CONTEXT",
  },

  {
    title: "Suggest the smallest diff",
    content:
      "Prefer the smallest possible change that solves the problem. Do not refactor surrounding code, rename variables, or reorganize imports unless the task explicitly requires it.",
    piece_type: "CUSTOM",
  },
  {
    title: "Explain the type error",
    content:
      "Given a TypeScript error message, explain in plain English: (1) what the compiler is actually complaining about, (2) why the types don't line up, (3) the minimal fix, (4) one alternative if the minimal fix has tradeoffs.\n\nError:\n{{error}}",
    piece_type: "CUSTOM",
    variables: [{ name: "error", label: "TypeScript error message" }],
  },
  {
    title: "Refactor with safety net",
    content:
      "Before refactoring: list the public API surface that must remain unchanged, the existing tests that cover this area, and any tests you would add to lock in current behavior. Only then propose the refactor.",
    piece_type: "CUSTOM",
  },
  {
    title: "Server vs Client decision",
    content:
      "For each component or piece of logic in the answer, state explicitly whether it should run on the server or client and why (one sentence). Default to server unless interactivity, browser APIs, or per-user state require the client.",
    piece_type: "CUSTOM",
  },
  {
    title: "Performance budget check",
    content:
      "After proposing a frontend change, estimate its impact on: bundle size (KB delta), client-side JS execution, initial render path (does it block hydration?), and Core Web Vitals (LCP, INP, CLS). Flag any regression over a budget you state up front.",
    piece_type: "CUSTOM",
  },
];

async function main() {
  console.log(`Looking up user ${TARGET_EMAIL}...`);
  const user = await db.user.findUnique({ where: { email: TARGET_EMAIL } });
  if (!user) {
    console.error(
      `No user found with email ${TARGET_EMAIL}. Register that account first, then re-run this seed.`,
    );
    process.exit(1);
  }

  console.log(`Removing existing pieces for ${user.email}...`);
  await db.promptPiece.deleteMany({ where: { user_id: user.id } });

  console.log(`Seeding ${PIECES.length} curated prompt pieces...`);
  for (const piece of PIECES) {
    await db.promptPiece.create({
      data: {
        user_id: user.id,
        title: piece.title,
        content: piece.content,
        piece_type: piece.piece_type,
        visibility: "PRIVATE",
        variables: (piece.variables ?? []) as unknown as Prisma.InputJsonValue,
        use_count: 0,
      },
    });
  }

  const counts = await db.promptPiece.groupBy({
    by: ["piece_type"],
    where: { user_id: user.id },
    _count: { _all: true },
  });

  console.log("Done. Pieces by type:");
  for (const row of counts) {
    console.log(`  ${row.piece_type.padEnd(11)} ${row._count._all}`);
  }
  console.log(`Linked to user: ${user.email} (id: ${user.id})`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
