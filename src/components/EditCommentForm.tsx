import { useState } from "react";
import Button from "@/components/Button";
import CommentTextarea from "@/components/CommentTextarea";
import type { BaseComment } from "@/models/comment.interface";
import { isReply } from "@/utils/comment.utils";

interface EditCommentFormProps {
  comment: BaseComment;
  onSubmit: (content: string) => void;
}

export default function EditCommentForm({
  comment,
  onSubmit,
}: EditCommentFormProps) {
  const replyingTo = isReply(comment) ? comment.replyingTo : "";
  const prefix = replyingTo ? `@${replyingTo} ` : "";
  const [content, setContent] = useState(`${prefix}${comment.content}`);

  function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    const cleanContent = content.replace(prefix, "").trim().slice(0, 1000);
    if (!cleanContent) return;
    onSubmit(cleanContent);
  }

  return (
    <form className="flex flex-col items-end gap-4" onSubmit={handleSubmit}>
      <CommentTextarea
        id={`edit-${comment.id}`}
        className="flex px-6 pt-3 pb-4"
        value={content}
        setContent={setContent}
        rows={4}
      ></CommentTextarea>
      <Button type="submit" className="px-5!">
        <span>update</span>
      </Button>
    </form>
  );
}
