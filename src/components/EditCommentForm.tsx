import CommentTextarea from "@/components/CommentTextarea";
import { Button } from "@/components/ui/button";
import { useCommentDraft } from "@/hooks/useCommentDraft";
import type { CommentEntry } from "@/models/comment.interface";
import { mentionPrefix } from "@/utils/comment.utils";

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
  const { content, setContent, canSubmit, handleSubmit } = useCommentDraft(
    entry.content,
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
        label="Edit comment"
        textareaClassName="pb-4"
        prefix={entry.kind === "reply" ? mentionPrefix(entry.replyingTo) : ""}
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
