import { useState } from "react";
import Avatar from "@/components/Avatar";
import CommentTextarea from "@/components/CommentTextarea";
import { Button } from "@/components/ui/button";
import { useComments } from "@/hooks/useComments";
import { cn } from "@/lib/utils";
import {
  isValidContent,
  mentionPrefix,
  normalizeContent,
} from "@/utils/comment.utils";

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
  const { currentUser } = useComments();
  const [content, setContent] = useState("");
  const canSubmit = isValidContent(content);

  function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    onSubmit(normalizeContent(content));
    setContent("");
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
        prefix={replyingTo ? mentionPrefix(replyingTo) : ""}
        value={content}
        autoFocus={autoFocus}
        onValueChange={setContent}
        onCancel={onCancel}
      />

      <Button type="submit" disabled={!canSubmit}>
        {submitLabel}
      </Button>
    </form>
  );
}
