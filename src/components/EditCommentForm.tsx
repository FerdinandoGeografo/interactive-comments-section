import CommentTextarea from "@/components/CommentTextarea";
import { Button } from "@/components/ui/button";
import { useCommentDraft } from "@/hooks/useCommentDraft";
import type { CommentEntry } from "@/models/comment.interface";

interface EditCommentFormProps {
  entry: CommentEntry;
  onSubmit: (content: string) => void;
  onCancel: () => void;
}

export default function EditCommentForm({
  entry,
  onSubmit,
  onCancel,
}: EditCommentFormProps) {
  const replyingTo = entry.kind === "reply" ? entry.replyingTo : undefined;
  const { content, setContent, canSubmit, handleSubmit } = useCommentDraft(
    entry.content,
    replyingTo,
  );

  return (
    <form
      className="flex flex-col items-end gap-4"
      // Unchanged content just closes the form.
      onSubmit={handleSubmit((newContent) =>
        newContent === entry.content ? onCancel() : onSubmit(newContent),
      )}
    >
      <CommentTextarea
        label={replyingTo ? `Edit reply to ${replyingTo}` : "Edit comment"}
        textareaClassName="pb-4"
        replyingTo={replyingTo}
        value={content}
        autoFocus
        onValueChange={setContent}
        onCancel={onCancel}
        rows={4}
      />
      <Button type="submit" className="px-5" disabled={!canSubmit}>
        update
      </Button>
    </form>
  );
}
