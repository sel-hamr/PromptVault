import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, type Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import slugify from "slugify";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const db = new PrismaClient({ adapter });

const PASSWORD = "password123";

const USERS = [
  { username: "alice_codes", email: "alice@example.com" },
  { username: "bob_writes", email: "bob@example.com" },
  { username: "carol_designs", email: "carol@example.com" },
];

const CATEGORY_TREE: Array<{ name: string; children?: string[] }> = [
  { name: "Marketing", children: ["Email", "Social Media", "SEO"] },
  { name: "Coding", children: ["Code Review", "Debugging", "Documentation"] },
  { name: "Writing", children: ["Blog Posts", "Fiction"] },
  { name: "Design", children: ["Midjourney", "Branding"] },
];

const TAG_NAMES = [
  "copywriting",
  "seo",
  "midjourney-v6",
  "coding",
  "refactor",
  "summarization",
  "email",
  "brainstorm",
  "education",
  "analysis",
];

const PIECES: Array<{
  title: string;
  content: string;
  piece_type: "PERSONA" | "FORMAT" | "CONSTRAINT" | "CONTEXT" | "TONE" | "CUSTOM";
}> = [
  {
    title: "Senior marketing strategist",
    content:
      "Act as a senior marketing strategist with 15 years of experience in B2B SaaS.",
    piece_type: "PERSONA",
  },
  {
    title: "Staff software engineer",
    content:
      "Act as a staff software engineer fluent in TypeScript, React, and distributed systems.",
    piece_type: "PERSONA",
  },
  {
    title: "Markdown table output",
    content:
      "Output the response as a markdown table with columns: Feature, Benefit, Example.",
    piece_type: "FORMAT",
  },
  {
    title: "JSON only",
    content:
      "Respond with a single JSON object. Do not include prose, markdown, or code fences.",
    piece_type: "FORMAT",
  },
  {
    title: "Word limit 200",
    content: "Keep the response under 200 words. Do not use jargon.",
    piece_type: "CONSTRAINT",
  },
  {
    title: "No hallucinations",
    content:
      "If you are uncertain about a fact, say so explicitly rather than guessing.",
    piece_type: "CONSTRAINT",
  },
  {
    title: "US small business audience",
    content:
      "The target audience is small business owners in the US aged 30-50 with limited technical background.",
    piece_type: "CONTEXT",
  },
  {
    title: "Friendly conversational tone",
    content:
      "Use a friendly, conversational tone. Avoid corporate speak. Write like you are talking to a colleague.",
    piece_type: "TONE",
  },
  {
    title: "Formal academic tone",
    content: "Use a formal academic tone with precise terminology and citations where relevant.",
    piece_type: "TONE",
  },
  {
    title: "Step-by-step reasoning",
    content: "Think step by step and show your reasoning before giving the final answer.",
    piece_type: "CUSTOM",
  },
];

type PromptSeed = {
  title: string;
  description: string;
  content: string;
  model_target:
    | "CHATGPT"
    | "CLAUDE"
    | "MIDJOURNEY"
    | "GEMINI"
    | "DALLE"
    | "STABLE_DIFFUSION"
    | "UNIVERSAL";
  visibility: "PUBLIC" | "PRIVATE" | "UNLISTED";
  category_slug?: string;
  tags?: string[];
  variables?: Array<{ name: string; label?: string; default?: string }>;
};

const PROMPTS: PromptSeed[] = [
  {
    title: "Cold outreach email",
    description: "Generate a short, personalized cold outreach email.",
    content:
      "Write a cold outreach email to {{recipient_role}} at {{company}}. Goal: {{goal}}. Keep it under 120 words and include one specific hook relevant to their industry.",
    model_target: "CHATGPT",
    visibility: "PUBLIC",
    category_slug: "email",
    tags: ["copywriting", "email"],
    variables: [
      { name: "recipient_role", label: "Recipient role", default: "Head of Marketing" },
      { name: "company", label: "Company" },
      { name: "goal", label: "Goal", default: "book a 15-min intro call" },
    ],
  },
  {
    title: "SEO meta description",
    description: "Write a 155-character SEO meta description.",
    content:
      "Write an SEO meta description for a page titled '{{page_title}}'. Target keyword: {{keyword}}. Must be under 155 characters, include the keyword once, and end with a clear call to action.",
    model_target: "CHATGPT",
    visibility: "PUBLIC",
    category_slug: "seo",
    tags: ["seo", "copywriting"],
    variables: [
      { name: "page_title" },
      { name: "keyword" },
    ],
  },
  {
    title: "Code review checklist",
    description: "Review a pull request against a structured checklist.",
    content:
      "Review the following diff as a staff engineer. Check for: correctness, error handling, security, performance, readability, and test coverage. Output a markdown table of issues with severity (low/med/high) and a suggested fix.\n\nDiff:\n{{diff}}",
    model_target: "CLAUDE",
    visibility: "PUBLIC",
    category_slug: "code-review",
    tags: ["coding", "refactor"],
    variables: [{ name: "diff", label: "Git diff" }],
  },
  {
    title: "Explain this stack trace",
    description: "Debug a stack trace in plain English.",
    content:
      "Explain what caused this error, list the most likely root causes ordered by probability, and suggest a minimal fix. Stack trace:\n{{stack_trace}}",
    model_target: "CLAUDE",
    visibility: "PUBLIC",
    category_slug: "debugging",
    tags: ["coding"],
    variables: [{ name: "stack_trace" }],
  },
  {
    title: "Blog post outline",
    description: "Generate a structured outline for a blog post.",
    content:
      "Create a blog post outline about {{topic}} for {{audience}}. Include: hook, 5 H2 sections with 2-3 bullet subpoints each, and a conclusion with a call to action.",
    model_target: "CHATGPT",
    visibility: "PUBLIC",
    category_slug: "blog-posts",
    tags: ["copywriting", "brainstorm"],
    variables: [
      { name: "topic" },
      { name: "audience", default: "indie hackers" },
    ],
  },
  {
    title: "Cinematic portrait (Midjourney)",
    description: "Cinematic portrait prompt tuned for Midjourney v6.",
    content:
      "Cinematic portrait of {{subject}}, {{lighting}} lighting, shot on {{camera}}, 85mm lens, shallow depth of field, hyperrealistic, ultra-detailed --ar 3:4 --v 6",
    model_target: "MIDJOURNEY",
    visibility: "PUBLIC",
    category_slug: "midjourney",
    tags: ["midjourney-v6"],
    variables: [
      { name: "subject", default: "a weathered fisherman" },
      { name: "lighting", default: "golden hour" },
      { name: "camera", default: "Arri Alexa" },
    ],
  },
  {
    title: "Summarize a meeting transcript",
    description: "Condense a long meeting transcript into decisions and action items.",
    content:
      "Summarize the following meeting transcript. Output three sections: (1) Key decisions, (2) Action items with owners and dates, (3) Open questions. Transcript:\n{{transcript}}",
    model_target: "CLAUDE",
    visibility: "PUBLIC",
    tags: ["summarization", "analysis"],
    variables: [{ name: "transcript" }],
  },
  {
    title: "Lesson plan generator",
    description: "Generate a 45-minute lesson plan for a given topic.",
    content:
      "Create a 45-minute lesson plan for teaching {{topic}} to {{grade_level}} students. Include: learning objectives, warm-up activity, main activity, assessment, and homework.",
    model_target: "UNIVERSAL",
    visibility: "PUBLIC",
    tags: ["education"],
    variables: [
      { name: "topic" },
      { name: "grade_level", default: "9th grade" },
    ],
  },
  {
    title: "Personal journal reflection",
    description: "Private prompt — daily journaling.",
    content:
      "Reflect on the following journal entry. Identify recurring themes, emotional patterns, and one question I should sit with this week.\n\nEntry:\n{{entry}}",
    model_target: "CLAUDE",
    visibility: "PRIVATE",
    variables: [{ name: "entry" }],
  },
  {
    title: "Unlisted: beta feature spec",
    description: "Shared via link with the design team only.",
    content:
      "Draft a one-page product spec for {{feature}}. Include: problem, target user, success metric, and a rough UX flow in 3-5 steps.",
    model_target: "CHATGPT",
    visibility: "UNLISTED",
    variables: [{ name: "feature" }],
  },
];

async function main() {
  console.log("Clearing existing data...");
  await db.promptTag.deleteMany();
  await db.prompt.deleteMany();
  await db.promptPiece.deleteMany();
  await db.tag.deleteMany();
  // Categories must be deleted leaves-first due to self-FK.
  for (let pass = 0; pass < 5; pass++) {
    const leaves = await db.category.findMany({
      where: { children: { none: {} } },
      select: { id: true },
    });
    if (leaves.length === 0) break;
    await db.category.deleteMany({
      where: { id: { in: leaves.map((c) => c.id) } },
    });
  }
  await db.user.deleteMany();

  console.log("Seeding users...");
  const password_hash = await bcrypt.hash(PASSWORD, 10);
  const users = await Promise.all(
    USERS.map((u) =>
      db.user.create({ data: { ...u, password_hash } }),
    ),
  );

  console.log("Seeding categories...");
  const categoryBySlug = new Map<string, { id: string; depth: number }>();
  for (const root of CATEGORY_TREE) {
    const rootSlug = slugify(root.name, { lower: true, strict: true });
    const rootCat = await db.category.create({
      data: { name: root.name, slug: rootSlug, depth: 0 },
    });
    categoryBySlug.set(rootSlug, { id: rootCat.id, depth: 0 });

    for (const childName of root.children ?? []) {
      const childSlug = slugify(childName, { lower: true, strict: true });
      const childCat = await db.category.create({
        data: {
          name: childName,
          slug: childSlug,
          parent_id: rootCat.id,
          depth: 1,
        },
      });
      categoryBySlug.set(childSlug, { id: childCat.id, depth: 1 });
    }
  }

  console.log("Seeding tags...");
  const tagBySlug = new Map<string, string>();
  for (const name of TAG_NAMES) {
    const slug = slugify(name, { lower: true, strict: true });
    const tag = await db.tag.create({ data: { name, slug } });
    tagBySlug.set(slug, tag.id);
  }

  console.log("Seeding prompt pieces...");
  for (const piece of PIECES) {
    const owner = users[Math.floor(Math.random() * users.length)];
    await db.promptPiece.create({
      data: {
        user_id: owner.id,
        title: piece.title,
        content: piece.content,
        piece_type: piece.piece_type,
        visibility: "PUBLIC",
        variables: [] as unknown as Prisma.InputJsonValue,
        use_count: Math.floor(Math.random() * 50),
      },
    });
  }

  console.log("Seeding prompts...");
  const createdPrompts: Array<{ id: string; visibility: string }> = [];
  for (const [i, p] of PROMPTS.entries()) {
    const owner = users[i % users.length];
    const category = p.category_slug
      ? categoryBySlug.get(p.category_slug)
      : undefined;
    const tagIds = (p.tags ?? [])
      .map((t) => tagBySlug.get(slugify(t, { lower: true, strict: true })))
      .filter((x): x is string => Boolean(x));

    const prompt = await db.prompt.create({
      data: {
        user_id: owner.id,
        title: p.title,
        description: p.description,
        content: p.content,
        model_target: p.model_target,
        visibility: p.visibility,
        category_id: category?.id,
        variables: (p.variables ?? []) as unknown as Prisma.InputJsonValue,
        avg_rating: p.visibility === "PUBLIC" ? 3.5 + Math.random() * 1.5 : 0,
        rating_count: p.visibility === "PUBLIC" ? Math.floor(Math.random() * 40) : 0,
        use_count: Math.floor(Math.random() * 200),
        tags: tagIds.length
          ? { create: tagIds.map((tag_id) => ({ tag_id })) }
          : undefined,
      },
    });
    createdPrompts.push({ id: prompt.id, visibility: prompt.visibility });

    if (category) {
      await db.category.update({
        where: { id: category.id },
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

  console.log("Creating one fork to exercise lineage...");
  const publicPrompt = createdPrompts.find((p) => p.visibility === "PUBLIC");
  if (publicPrompt) {
    const source = await db.prompt.findUnique({
      where: { id: publicPrompt.id },
      include: { tags: true },
    });
    if (source && users[2]) {
      await db.prompt.create({
        data: {
          user_id: users[2].id,
          title: `${source.title} (forked)`,
          description: source.description,
          content: source.content,
          model_target: source.model_target,
          visibility: "PRIVATE",
          forked_from_id: source.id,
          variables: source.variables as Prisma.InputJsonValue,
          tags: source.tags.length
            ? { create: source.tags.map((t) => ({ tag_id: t.tag_id })) }
            : undefined,
        },
      });
      await db.prompt.update({
        where: { id: source.id },
        data: { fork_count: { increment: 1 } },
      });
    }
  }

  console.log("Done.");
  console.log(
    `Created ${users.length} users, ${categoryBySlug.size} categories, ${tagBySlug.size} tags, ${PIECES.length} pieces, ${PROMPTS.length} prompts.`,
  );
  console.log(`Login with any seeded email and password: "${PASSWORD}"`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
