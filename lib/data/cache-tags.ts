export const CACHE_TAGS = {
  prompts: "prompts",
  prompt: (id: string) => `prompt-${id}`,
  pieces: "pieces",
  piece: (id: string) => `piece-${id}`,
  categories: "categories",
  tags: "tags",
  library: "library",
  dashboard: "dashboard",
} as const;
