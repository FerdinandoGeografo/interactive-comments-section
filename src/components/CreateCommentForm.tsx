import { useState, type KeyboardEvent } from "react";
import Avatar from "@/components/Avatar";
import CommentTextarea from "@/components/CommentTextarea";
import { Button } from "@/components/ui/button";
import { useComments } from "@/hooks/useComments";
import { cn } from "@/lib/utils";

interface CreateCommentFormProps {
  label: string;
  submitLabel: string;
  replyingTo?: string;
  autoFocus?: boolean;
  className?: string;
  onSubmit: (content: string) => void;
  onCancel?: () => void;
}

export default function CreateCommentForm({
  label,
  submitLabel,
  replyingTo,
  autoFocus,
  className,
  onSubmit,
  onCancel,
}: CreateCommentFormProps) {
  const prefix = replyingTo ? `@${replyingTo} ` : "";

  const { currentUser } = useComments();
  const [content, setContent] = useState(prefix);

  function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();

    const cleanContent = content.replace(prefix, "").trim().slice(0, 1000);
    if (!cleanContent) return;

    onSubmit(cleanContent);
    setContent(prefix);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Escape" && onCancel) {
      e.preventDefault();
      onCancel();
    }
  }

  return (
    <form
      className={cn(
        "flex flex-wrap items-center justify-between gap-4 rounded-lg bg-white px-4 pt-4 pb-3.25 sm:items-start sm:px-6 sm:pt-6 sm:pb-6",
        className,
      )}
      onSubmit={handleSubmit}
    >
      <Avatar user={currentUser} size="large" className="sm:mt-1" />

      <CommentTextarea
        label={label}
        className="-order-1 sm:order-0 sm:flex-1"
        placeholder="Add a comment…"
        value={content}
        autoFocus={autoFocus}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      <Button type="submit">{submitLabel}</Button>
    </form>
  );
}
