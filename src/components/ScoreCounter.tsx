import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ScoreCounterProps {
  score: number;
  author: string;
  onVote: (delta: 1 | -1) => void;
}

export default function ScoreCounter({
  score,
  author,
  onVote,
}: ScoreCounterProps) {
  return (
    <div
      role="group"
      aria-label="Comment score"
      className="flex h-10 w-25 items-center justify-between overflow-hidden rounded-[10px] bg-gray-100 sm:col-span-[1_2] sm:row-span-full sm:h-25 sm:w-10 sm:flex-col"
    >
      <Button
        variant="vote"
        size="icon"
        aria-label={`Upvote comment by ${author}`}
        onClick={() => onVote(+1)}
      >
        <svg className="size-2" aria-hidden="true">
          <use href="/icons.svg#plus"></use>
        </svg>
      </Button>
      <span
        aria-live="polite"
        className={cn(
          "leading-4.75 font-medium",
          score >= 0 ? "text-blue-500" : "text-red-500",
        )}
      >
        {score}
      </span>
      <Button
        variant="vote"
        size="icon"
        aria-label={`Downvote comment by ${author}`}
        onClick={() => onVote(-1)}
      >
        <svg className="size-2" aria-hidden="true">
          <use href="/icons.svg#minus"></use>
        </svg>
      </Button>
    </div>
  );
}
