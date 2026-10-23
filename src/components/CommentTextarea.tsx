import {
  useEffect,
  useId,
  useRef,
  type ComponentProps,
  type KeyboardEvent,
} from "react";
import { useIsPresent } from "motion/react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { MAX_CONTENT_LENGTH, normalizeContent } from "@/utils/comment.utils";

const COUNTER_THRESHOLD = 100;

interface CommentTextareaProps extends Omit<
  ComponentProps<typeof Textarea>,
  "value" | "defaultValue" | "onChange"
> {
  label: string;
  value: string;
  onValueChange: (content: string) => void;
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
  "aria-describedby": describedBy,
  ...props
}: CommentTextareaProps) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;
  const counterId = `${textareaId}-counter`;
  const recipientId = `${textareaId}-recipient`;
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const previousValueRef = useRef(value);
  const lastAnnouncementRef = useRef("");
  const announcementRef = useRef<HTMLParagraphElement>(null);
  const isPresent = useIsPresent();

  const remaining = MAX_CONTENT_LENGTH - normalizeContent(value).length;
  const isOverLimit = remaining < 0;
  const showCounter = remaining <= COUNTER_THRESHOLD;
  const counterMessage = showCounter
    ? isOverLimit
      ? `${characters(-remaining)} over the limit`
      : `${characters(remaining)} left`
    : "";

  useEffect(() => {
    const region = announcementRef.current;
    if (region) region.textContent = "";
    const changed = previousValueRef.current !== value;
    previousValueRef.current = value;
    if (!isPresent || !counterMessage) {
      lastAnnouncementRef.current = "";
      return;
    }
    if (!changed || lastAnnouncementRef.current === counterMessage) return;

    const timer = window.setTimeout(() => {
      const textarea = textareaRef.current;
      if (!textarea || textarea.closest("[inert]") || textarea.value !== value)
        return;
      lastAnnouncementRef.current = counterMessage;
      if (region) region.textContent = counterMessage;
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [value, counterMessage, isPresent]);

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
      {replyingTo && (
        <p
          id={recipientId}
          className="text-sm leading-5 wrap-anywhere text-gray-600"
        >
          Replying to{" "}
          <span className="font-medium text-blue-500">@{replyingTo}</span>
        </p>
      )}
      <Textarea
        ref={textareaRef}
        id={textareaId}
        rows={rows}
        className={textareaClassName}
        value={value}
        aria-invalid={isOverLimit || undefined}
        aria-describedby={[
          replyingTo ? recipientId : undefined,
          counterId,
          describedBy,
        ]
          .filter(Boolean)
          .join(" ")}
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
      <p
        ref={announcementRef}
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />
    </div>
  );
}
