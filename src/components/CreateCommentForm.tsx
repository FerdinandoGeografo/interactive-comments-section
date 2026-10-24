import { useState } from "react";
import Avatar from "@/components/Avatar";
import CommentTextarea from "@/components/CommentTextarea";
import { Button } from "@/components/ui/button";
import { useCommentDraft } from "@/hooks/useCommentDraft";
import { useComments } from "@/hooks/useComments";
import { cn } from "@/lib/utils";

interface CreateCommentFormProps {
  label: string;
  textareaId?: string;
  submitLabel: string;
  statusMessage?: string;
  replyingTo?: string;
  autoFocus?: boolean;
  className?: string;
  onSubmit: (content: string) => void;
  onCancel?: () => void;
}

export default function CreateCommentForm({
  label,
  textareaId,
  submitLabel,
  statusMessage,
  replyingTo,
  autoFocus,
  className,
  onSubmit,
  onCancel,
}: CreateCommentFormProps) {
  const { currentUser } = useComments();
  const { content, setContent, canSubmit, handleSubmit } = useCommentDraft(
    "",
    replyingTo,
  );
  const [status, setStatus] = useState("");

  return (
    <form
      className={cn(
        "flex flex-wrap items-center justify-between gap-4 rounded-lg bg-white px-4 pt-4 pb-3.25 sm:items-start sm:px-6 sm:pt-6 sm:pb-6",
        className,
      )}
      onSubmit={handleSubmit((newContent) => {
        onSubmit(newContent);
        setContent("");
        if (statusMessage) setStatus(statusMessage);
      })}
    >
      <Avatar user={currentUser} size="large" className="sm:mt-1" />

      <CommentTextarea
        id={textareaId}
        label={label}
        className="-order-1 sm:order-0 sm:flex-1"
        placeholder="Add a comment…"
        replyingTo={replyingTo}
        value={content}
        autoFocus={autoFocus}
        onValueChange={(value) => {
          setContent(value);
          // Clearing lets the same message be announced again next time.
          setStatus("");
        }}
        onCancel={onCancel}
      />

      {/* Clearing the draft disables SEND: it must keep focus meanwhile. */}
      <Button type="submit" disabled={!canSubmit} focusableWhenDisabled>
        {submitLabel}
      </Button>

      {statusMessage && (
        <p role="status" aria-atomic="true" className="sr-only">
          {status}
        </p>
      )}
    </form>
  );
}
