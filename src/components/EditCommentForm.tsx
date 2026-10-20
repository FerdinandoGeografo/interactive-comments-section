import { useState, type KeyboardEvent } from "react";
import CommentTextarea from "@/components/CommentTextarea";
import { Button } from "@/components/ui/button";
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
  const replyingTo = entry.kind === "reply" ? entry.replyingTo : "";
  const prefix = replyingTo ? `@${replyingTo} ` : "";
  const [content, setContent] = useState(`${prefix}${entry.content}`);

  function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    const cleanContent = content.replace(prefix, "").trim().slice(0, 1000);
    if (!cleanContent) return;
    onSubmit(cleanContent);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Escape") {
      e.preventDefault();
      onCancel();
    }
  }

  return (
    <form className="flex flex-col items-end gap-4" onSubmit={handleSubmit}>
      <CommentTextarea
        label="Edit comment"
        className="pb-4"
        value={content}
        autoFocus
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={4}
      />
      <Button type="submit" className="px-5">
        update
      </Button>
    </form>
  );
}
