"use client";

import { useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ratePromptAction } from "@/lib/actions/prompt.actions";

interface PromptRatingWidgetProps {
  promptId: string;
  avgRating: number;
  ratingCount: number;
}

export function PromptRatingWidget({
  promptId,
  avgRating,
  ratingCount,
}: PromptRatingWidgetProps) {
  const [hovered, setHovered] = useState(0);
  const [display, setDisplay] = useState({ avg: avgRating, count: ratingCount });

  const alreadyRated = display.count > 0;

  const { execute, isPending } = useAction(ratePromptAction, {
    onSuccess: ({ data }) => {
      if (!data || "error" in data) {
        toast.error(data && "error" in data ? (data as { error: string }).error : "Failed to save rating");
        return;
      }
      setDisplay({ avg: data.avg_rating, count: data.rating_count });
      toast.success("Rating saved");
    },
    onError: () => toast.error("Failed to save rating"),
  });

  const filledStars = alreadyRated ? Math.round(display.avg) : hovered;

  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-3">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        Your Rating
      </p>

      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={alreadyRated || isPending}
            onMouseEnter={() => !alreadyRated && setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => !alreadyRated && execute({ id: promptId, value: star })}
            className={cn(
              "transition-transform",
              alreadyRated ? "cursor-default" : "cursor-pointer hover:scale-110 disabled:cursor-default"
            )}
            aria-label={`Rate ${star} out of 5`}
          >
            <Star
              className={cn(
                "size-5 transition-colors",
                star <= filledStars
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-none text-muted-foreground/40"
              )}
            />
          </button>
        ))}
      </div>

      {alreadyRated ? (
        <p className="text-xs text-muted-foreground">
          You rated this prompt {display.avg}/5
        </p>
      ) : (
        <p className="text-xs text-muted-foreground">Click a star to rate</p>
      )}
    </div>
  );
}
