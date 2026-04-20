import { PromptCard } from "../../prompts/_components/prompt-card";
import type { PromptWithRelations } from "./types";

interface ExploreCardProps {
  prompt: PromptWithRelations;
}

export function ExploreCard({ prompt }: ExploreCardProps) {
  return <PromptCard prompt={prompt} />;
}
