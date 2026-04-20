export interface ComposePiece {
  id: string;
  title: string;
  content: string;
  piece_type: string;
}

export type ModelTarget =
  | "CHATGPT"
  | "CLAUDE"
  | "MIDJOURNEY"
  | "GEMINI"
  | "DALLE"
  | "STABLE_DIFFUSION"
  | "UNIVERSAL";

export type Visibility = "PUBLIC" | "PRIVATE" | "UNLISTED";

export const PIECE_TYPES = [
  "PERSONA",
  "FORMAT",
  "CONSTRAINT",
  "CONTEXT",
  "TONE",
  "CUSTOM",
] as const;

export const TYPE_FILTERS = ["ALL", ...PIECE_TYPES] as const;

export const TYPE_COLORS: Record<string, string> = {
  PERSONA:
    "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
  FORMAT: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300",
  CONSTRAINT: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  CONTEXT:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  TONE: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  CUSTOM: "bg-muted text-muted-foreground",
};

export const MODELS: { value: ModelTarget; label: string }[] = [
  { value: "UNIVERSAL", label: "Universal" },
  { value: "CHATGPT", label: "ChatGPT" },
  { value: "CLAUDE", label: "Claude" },
  { value: "GEMINI", label: "Gemini" },
  { value: "MIDJOURNEY", label: "Midjourney" },
  { value: "DALLE", label: "DALL-E" },
  { value: "STABLE_DIFFUSION", label: "Stable Diffusion" },
];

export const VISIBILITIES: { value: Visibility; label: string }[] = [
  { value: "PRIVATE", label: "Private" },
  { value: "PUBLIC", label: "Public" },
  { value: "UNLISTED", label: "Unlisted" },
];
