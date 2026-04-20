import type { getPromptAction } from "@/lib/actions/prompt.actions";

type GetPromptResult = NonNullable<
  Awaited<ReturnType<typeof getPromptAction>>
>["data"];

export type PromptDetail = NonNullable<NonNullable<GetPromptResult>["prompt"]>;
