import { PromptListRow } from "../../prompts/_components/prompt-list-row";
import type { PromptWithRelations } from "./types";

interface ExploreListRowProps {
  prompt: PromptWithRelations;
}

export function ExploreListRow({ prompt }: ExploreListRowProps) {
  return <PromptListRow prompt={prompt} />;
}
