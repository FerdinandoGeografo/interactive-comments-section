import { useState } from "react";
import { useReducedMotionConfig } from "motion/react";
import * as m from "motion/react-m";
import { Button } from "@/components/ui/button";
import type { Vote } from "@/models/comment.interface";
import { cn } from "@/lib/utils";
import { transitions } from "@/lib/motion";

// Each vote switches between two identical variants, which replays the pulse
// without remounting the live region (its announcement stays the score).
const pulse = { scale: [1, 1.25, 1], transition: transitions.pulse };
const scoreVariants = { even: pulse, odd: pulse };
const tap = { scale: 0.85 };

interface ScoreCounterProps {
  score: number;
  currentUserVote: Vote;
  disabled: boolean;
  author: string;
  onVote: (direction: 1 | -1) => void;
}

export default function ScoreCounter({
  score,
  currentUserVote,
  disabled,
  author,
  onVote,
}: ScoreCounterProps) {
  const [votes, setVotes] = useState(0);
  const shouldReduceMotion = useReducedMotionConfig();

  function handleVote(direction: 1 | -1) {
    setVotes((count) => count + 1);
    onVote(direction);
  }

  // Disabled buttons keep pointer events (cursor-not-allowed), so the press
  // feedback is only attached to enabled ones. Reduced motion would still
  // jump to the pressed scale, so it is left out there too.
  const voteButton = (
    <m.button whileTap={disabled || shouldReduceMotion ? undefined : tap} />
  );

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
        aria-pressed={currentUserVote === 1}
        disabled={disabled}
        className={cn(currentUserVote === 1 && "text-blue-500")}
        render={voteButton}
        onClick={() => handleVote(1)}
      >
        <svg className="size-2" aria-hidden="true">
          <use href="/icons.svg#plus"></use>
        </svg>
      </Button>
      <m.span
        aria-live="polite"
        variants={scoreVariants}
        initial={false}
        animate={votes % 2 === 0 ? "even" : "odd"}
        className={cn(
          "leading-4.75 font-medium",
          score >= 0 ? "text-blue-500" : "text-red-500",
        )}
      >
        {score}
      </m.span>
      <Button
        variant="vote"
        size="icon"
        aria-label={`Downvote comment by ${author}`}
        aria-pressed={currentUserVote === -1}
        disabled={disabled}
        className={cn(currentUserVote === -1 && "text-blue-500")}
        render={voteButton}
        onClick={() => handleVote(-1)}
      >
        <svg className="size-2" aria-hidden="true">
          <use href="/icons.svg#minus"></use>
        </svg>
      </Button>
    </div>
  );
}
