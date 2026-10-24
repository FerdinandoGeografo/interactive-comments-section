import {
  useEffect,
  useId,
  useRef,
  useState,
  type ComponentProps,
  type KeyboardEvent,
} from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { MAX_CONTENT_LENGTH, stripMention } from "@/utils/comment.utils";

const COUNTER_THRESHOLD = 100;
const ANNOUNCEMENT_DELAY = 1000;

interface CommentTextareaProps extends Omit<
  ComponentProps<typeof Textarea>,
  "value" | "defaultValue" | "onChange"
> {
  label: string;
  value: string;
  onValueChange: (content: string) => void;
  // Only for counting: the leading mention is not stored as content.
  replyingTo?: string;
  onCancel?: () => void;
  textareaClassName?: string;
}

function characters(count: number) {
  return `${count} character${count === 1 ? "" : "s"}`;
}

export default function CommentTextarea({
  label,
  value,
  onValueChange,
  replyingTo,
  onCancel,
  id,
  rows = 3,
  autoFocus,
  className,
  textareaClassName,
  ...props
}: CommentTextareaProps) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;
  const counterId = `${textareaId}-counter`;
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const remaining = MAX_CONTENT_LENGTH - stripMention(value, replyingTo).length;
  const isOverLimit = remaining < 0;
  const showCounter = remaining <= COUNTER_THRESHOLD;
  const counterMessage = showCounter
    ? isOverLimit
      ? `${characters(-remaining)} over the limit`
      : `${characters(remaining)} left`
    : "";

  // Announce the counter once typing pauses, not over every keystroke.
  const [announcement, setAnnouncement] = useState(counterMessage);
  useEffect(() => {
    const timeout = setTimeout(
      () => setAnnouncement(counterMessage),
      ANNOUNCEMENT_DELAY,
    );
    return () => clearTimeout(timeout);
  }, [counterMessage]);

  // Native autofocus would leave the caret before the mention.
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!autoFocus || !textarea) return;
    textarea.focus();
    textarea.setSelectionRange(textarea.value.length, textarea.value.length);
  }, [autoFocus]);

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Escape" && !e.nativeEvent.isComposing && onCancel) {
      e.preventDefault();
      onCancel();
    }
  }

  return (
    <div
      className={cn("relative flex w-full min-w-0 flex-col gap-2", className)}
    >
      <label htmlFor={textareaId} className="sr-only">
        {label}
      </label>
      <Textarea
        ref={textareaRef}
        id={textareaId}
        rows={rows}
        className={textareaClassName}
        value={value}
        aria-invalid={isOverLimit || undefined}
        aria-describedby={counterId}
        onChange={(event) => onValueChange(event.target.value)}
        onKeyDown={handleKeyDown}
        {...props}
      />
      <p
        id={counterId}
        className={cn(
          "self-end text-sm leading-5",
          !showCounter && "sr-only",
          isOverLimit ? "text-error" : "text-gray-600",
        )}
      >
        {counterMessage}
      </p>
      <p aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </p>
    </div>
  );
}
