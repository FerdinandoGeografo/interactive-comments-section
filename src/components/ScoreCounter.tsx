import IconButton from "@/components/IconButton";

interface ScoreCounterProps {
  score: number;
  onVote: (delta: 1 | -1) => void;
}

export default function ScoreCounter({ score, onVote }: ScoreCounterProps) {
  return (
    <div className="flex h-10 w-25 items-center justify-between overflow-hidden rounded-[10px] bg-gray-100 sm:col-span-[1_2] sm:row-span-full sm:h-25 sm:w-10 sm:flex-col">
      <IconButton onClick={() => onVote(+1)}>
        <svg className="size-2" role="presentation" aria-hidden="true">
          <use href="/icons.svg#plus"></use>
        </svg>
      </IconButton>
      <span
        className={`leading-4.75 font-medium ${score >= 0 ? "text-blue-500" : "text-red-500"}`}
      >
        {score}
      </span>
      <IconButton onClick={() => onVote(-1)}>
        <svg className="size-2" role="presentation" aria-hidden="true">
          <use href="/icons.svg#minus"></use>
        </svg>
      </IconButton>
    </div>
  );
}
