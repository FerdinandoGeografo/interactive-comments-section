import {
  useEffect,
  useId,
  useRef,
  type ChangeEvent,
  type ComponentProps,
  type KeyboardEvent,
  type SyntheticEvent,
} from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  applyPrefixedChange,
  clampSelection,
  MAX_CONTENT_LENGTH,
  normalizeContent,
} from "@/utils/comment.utils";

const COUNTER_THRESHOLD = 100;

interface CommentTextareaProps extends Omit<
  ComponentProps<typeof Textarea>,
  "value" | "defaultValue" | "onChange"
> {
  label: string;
  value: string;
  onValueChange: (content: string) => void;
  prefix?: string;
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
  prefix = "",
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

  const remaining = MAX_CONTENT_LENGTH - normalizeContent(value).length;
  const isOverLimit = remaining < 0;
  const showCounter = remaining <= COUNTER_THRESHOLD;

  // Native autofocus would leave the caret before the mention.
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!autoFocus || !textarea) return;
    textarea.focus();
    textarea.setSelectionRange(textarea.value.length, textarea.value.length);
  }, [autoFocus]);

  function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
    // A rejected change leaves state untouched, so React restores the value.
    const content = applyPrefixedChange(prefix, e.target.value);
    if (content !== null) onValueChange(content);
  }

  function handleSelect(e: SyntheticEvent<HTMLTextAreaElement>) {
    if (!prefix) return;
    const textarea = e.currentTarget;
    const { selectionStart, selectionEnd } = textarea;
    const [start, end] = clampSelection(
      prefix.length,
      selectionStart,
      selectionEnd,
    );
    if (start !== selectionStart || end !== selectionEnd)
      textarea.setSelectionRange(start, end, textarea.selectionDirection);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Escape" && onCancel) {
      e.preventDefault();
      onCancel();
    }
  }

  return (
    <div className={cn("relative flex w-full flex-col gap-2", className)}>
      <label htmlFor={textareaId} className="sr-only">
        {label}
      </label>
      <Textarea
        ref={textareaRef}
        id={textareaId}
        rows={rows}
        className={textareaClassName}
        value={prefix + value}
        aria-invalid={isOverLimit || undefined}
        aria-describedby={counterId}
        onChange={handleChange}
        onSelect={handleSelect}
        onKeyDown={handleKeyDown}
        {...props}
      />
      {/* Always mounted so screen readers track the live region. */}
      <p
        id={counterId}
        aria-live="polite"
        className={cn(
          "self-end text-sm leading-5",
          !showCounter && "sr-only",
          isOverLimit ? "text-red-500" : "text-gray-600",
        )}
      >
        {showCounter &&
          (isOverLimit
            ? `${characters(-remaining)} over the limit`
            : `${characters(remaining)} left`)}
      </p>
    </div>
  );
}
