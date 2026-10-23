import Avatar from "@/components/Avatar";
import CommentTextarea from "@/components/CommentTextarea";
import { Button } from "@/components/ui/button";
import { useCommentDraft } from "@/hooks/useCommentDraft";
import { useComments } from "@/hooks/useComments";
import { cn } from "@/lib/utils";
import { mentionPrefix } from "@/utils/comment.utils";

interface CreateCommentFormProps {
  label: string;
  textareaId?: string;
  submitLabel: string;
  replyingTo?: string;
  autoFocus?: boolean;
  className?: string;
  onSubmit: (content: string) => void;
  onCancel?: () => void;
  onDraftChange?: () => void;
}

export default function CreateCommentForm({
  label,
  textareaId,
  submitLabel,
  replyingTo,
  autoFocus,
  className,
  onSubmit,
  onCancel,
  onDraftChange,
}: CreateCommentFormProps) {
  const { currentUser } = useComments();
  const { content, setContent, canSubmit, handleSubmit } = useCommentDraft();

  return (
    <form
      className={cn(
        "flex flex-wrap items-center justify-between gap-4 rounded-lg bg-white px-4 pt-4 pb-3.25 sm:items-start sm:px-6 sm:pt-6 sm:pb-6",
        className,
      )}
      onSubmit={handleSubmit((newContent) => {
        onSubmit(newContent);
        setContent("");
      })}
    >
      <Avatar user={currentUser} size="large" className="sm:mt-1" />

      <CommentTextarea
        id={textareaId}
        label={label}
        className="-order-1 sm:order-0 sm:flex-1"
        placeholder="Add a comment…"
        prefix={replyingTo ? mentionPrefix(replyingTo) : ""}
        value={content}
        autoFocus={autoFocus}
        onValueChange={(value) => {
          setContent(value);
          onDraftChange?.();
        }}
        onCancel={onCancel}
      />

      <Button
        type="submit"
        disabled={!canSubmit}
        focusableWhenDisabled={!replyingTo}
      >
        {submitLabel}
      </Button>
    </form>
  );
}
