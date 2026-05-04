import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;

// ---------- Prompt domain enums ----------

export const modelTargetSchema = z.enum([
  "CHATGPT",
  "CLAUDE",
  "MIDJOURNEY",
  "GEMINI",
  "DALLE",
  "STABLE_DIFFUSION",
  "UNIVERSAL",
]);

export const visibilitySchema = z.enum(["PUBLIC", "PRIVATE", "UNLISTED"]);

export const pieceTypeSchema = z.enum([
  "PERSONA",
  "FORMAT",
  "CONSTRAINT",
  "CONTEXT",
  "TONE",
  "CUSTOM",
]);

const variableSchema = z.object({
  name: z.string().min(1),
  label: z.string().optional(),
  default: z.string().optional(),
});

// ---------- Prompt schemas ----------

export const createPromptSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(500).optional(),
  content: z.string().min(1, "Content is required"),
  model_target: modelTargetSchema,
  visibility: visibilitySchema.default("PRIVATE"),
  category_id: z.string().cuid().nullable().optional(),
  variables: z.array(variableSchema).default([]),
  tag_ids: z.array(z.string().cuid()).default([]),
});

export const updatePromptSchema = createPromptSchema.partial().extend({
  id: z.string().cuid(),
});

export const promptIdSchema = z.object({ id: z.string().cuid() });

export const listPromptsSchema = z.object({
  user_id: z.string().cuid().optional(),
  category_id: z.string().cuid().optional(),
  model_target: modelTargetSchema.optional(),
  visibility: visibilitySchema.optional(),
  tag_slugs: z.array(z.string()).optional(),
  q: z.string().optional(),
  sort: z
    .enum(["newest", "oldest", "top_rated", "most_forked", "most_used"])
    .default("newest"),
  take: z.number().int().min(1).max(100).default(20),
  cursor: z.string().cuid().optional(),
});

export const forkPromptSchema = z.object({
  id: z.string().cuid(),
  visibility: visibilitySchema.default("PRIVATE"),
});

export const ratePromptSchema = z.object({
  id: z.string().cuid(),
  value: z.number().int().min(1).max(5),
});

// ---------- PromptPiece schemas ----------

export const createPieceSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  piece_type: pieceTypeSchema,
  visibility: visibilitySchema.default("PRIVATE"),
  variables: z.array(variableSchema).default([]),
});

export const updatePieceSchema = createPieceSchema.partial().extend({
  id: z.string().cuid(),
});

export const pieceIdSchema = z.object({ id: z.string().cuid() });

export const listPiecesSchema = z.object({
  user_id: z.string().cuid().optional(),
  include_public_with_owned: z.boolean().default(false),
  piece_type: pieceTypeSchema.optional(),
  visibility: visibilitySchema.optional(),
  q: z.string().optional(),
  sort: z
    .enum([
      "newest",
      "oldest",
      "updated",
      "most_used",
      "title_asc",
      "title_desc",
    ])
    .default("newest"),
  take: z.number().int().min(1).max(100).default(20),
  cursor: z.string().cuid().optional(),
});

// ---------- Category schemas ----------

export const createCategorySchema = z.object({
  name: z.string().min(1).max(100),
  parent_id: z.string().cuid().nullable().optional(),
});

export const updateCategorySchema = z.object({
  id: z.string().cuid(),
  name: z.string().min(1).max(100).optional(),
  parent_id: z.string().cuid().nullable().optional(),
});

export const categoryIdSchema = z.object({ id: z.string().cuid() });

// ---------- Tag schemas ----------

export const createTagSchema = z.object({
  name: z.string().min(1).max(50),
});

export const tagIdSchema = z.object({ id: z.string().cuid() });

export const listTagsSchema = z.object({
  q: z.string().optional(),
  take: z.number().int().min(1).max(100).default(50),
});

export const attachTagSchema = z.object({
  prompt_id: z.string().cuid(),
  tag_id: z.string().cuid(),
});

// ---------- Reference domain ----------

export const referenceTypeSchema = z.enum([
  "DOC",
  "SKILL",
  "AGENT",
  "PATTERN",
  "DECISION",
]);

export const createReferenceSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  content: z.string().min(1, "Content is required"),
  description: z.string().max(500).optional(),
  source_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  type: referenceTypeSchema.default("DOC"),
  tag_ids: z.array(z.string().cuid()).default([]),
});

export const updateReferenceSchema = createReferenceSchema.partial().extend({
  id: z.string().cuid(),
});

export const referenceIdSchema = z.object({ id: z.string().cuid() });

export const listReferencesSchema = z.object({
  q: z.string().optional(),
  type: referenceTypeSchema.optional(),
  tag_slug: z.string().optional(),
  page: z.number().int().min(1).default(1),
  take: z.number().int().min(1).max(50).default(20),
});

// ---------- Snippet schemas ----------

export const createSnippetSchema = z.object({
  reference_id: z.string().cuid(),
  title: z.string().min(1, "Title is required").max(200),
  content: z.string().min(1, "Content is required"),
  order: z.number().int().min(0).default(0),
});

export const updateSnippetSchema = createSnippetSchema.partial().extend({
  id: z.string().cuid(),
});

export const snippetIdSchema = z.object({ id: z.string().cuid() });

export const reorderSnippetsSchema = z.object({
  reference_id: z.string().cuid(),
  ordered_ids: z.array(z.string().cuid()),
});

export type ReferenceTypeValue = z.infer<typeof referenceTypeSchema>;
export type CreateReferenceInput = z.infer<typeof createReferenceSchema>;
export type UpdateReferenceInput = z.infer<typeof updateReferenceSchema>;
export type CreateSnippetInput = z.infer<typeof createSnippetSchema>;
export type UpdateSnippetInput = z.infer<typeof updateSnippetSchema>;

// ---------- Settings schemas ----------

export const updateUsernameSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters")
    .regex(/^[a-z0-9_]+$/, "Only lowercase letters, numbers, and underscores"),
});

export const updateEmailSchema = z.object({
  email: z.string().email("Invalid email address"),
  current_password: z.string().min(1, "Current password is required"),
});

export const changePasswordSchema = z
  .object({
    current_password: z.string().min(1, "Current password is required"),
    new_password: z.string().min(8, "Password must be at least 8 characters"),
    confirm_password: z.string(),
  })
  .refine((d) => d.new_password === d.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export const deleteAccountSchema = z.object({
  confirmation: z.literal("delete my account", {
    errorMap: () => ({ message: 'Type "delete my account" to confirm' }),
  }),
  current_password: z.string().min(1, "Password is required"),
});

export type UpdateUsernameInput = z.infer<typeof updateUsernameSchema>;
export type UpdateEmailInput = z.infer<typeof updateEmailSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

// ---------- Contact ----------

export const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;
