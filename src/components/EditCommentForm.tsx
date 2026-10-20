import { useState } from "react";
import CommentTextarea from "@/components/CommentTextarea";
import { Button } from "@/components/ui/button";
import type { CommentEntry } from "@/models/comment.interface";
import {
  isValidContent,
  mentionPrefix,
  normalizeContent,
} from "@/utils/comment.utils";

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
  const [content, setContent] = useState(entry.content);
  const canSubmit = isValidContent(content);

  function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    const normalized = normalizeContent(content);
    // Unchanged content just closes the form.
    if (normalized === entry.content) onCancel();
    else onSubmit(normalized);
  }

  return (
    <form className="flex flex-col items-end gap-4" onSubmit={handleSubmit}>
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
