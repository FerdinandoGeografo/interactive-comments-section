import { useState } from "react";
import type { Comment, Reply } from "@/models/comment.interface";
import Avatar from "@/components/Avatar";
import Button from "@/components/Button";
import CommentTextarea from "@/components/CommentTextarea";
import { useComments } from "@/contexts/CommentsContext";

interface CreateCommentFormProps {
  parentId?: number;
  replyingTo?: string;
  onSubmitted?: () => void;
}

export default function CreateCommentForm({
  parentId,
  replyingTo,
  onSubmitted,
}: CreateCommentFormProps) {
  const prefix = replyingTo ? `@${replyingTo} ` : "";
  const submitLabel = parentId !== undefined ? "reply" : "send";

  const { currentUser, dispatch } = useComments();
  const [content, setContent] = useState(prefix);

  function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();

    const cleanContent = content.replace(prefix, "").trim().slice(0, 1000);
    if (!cleanContent) return;

    const base = {
      id: Date.now(),
      content: cleanContent,
      user: currentUser,
      createdAt: "now",
      score: 0,
    };

    if (parentId !== undefined) {
      const reply: Reply = { ...base, replyingTo: replyingTo! };
      dispatch({ type: "createReply", payload: { reply, parentId } });
    } else {
      const comment: Comment = { ...base, replies: [] };
      dispatch({ type: "createComment", payload: { comment } });
    }

    setContent(prefix);
    onSubmitted?.();
  }

  return (
    <form
      className="mt-auto flex flex-wrap items-center justify-between gap-4 rounded-lg bg-white px-4 pt-4 pb-3.25 sm:items-start sm:px-6 sm:pt-6 sm:pb-6"
      onSubmit={handleSubmit}
    >
      <Avatar user={currentUser} size="large" className="sm:mt-1" />

      <CommentTextarea
        id="new-comment"
        className="-order-1 px-6 py-3 sm:order-0 sm:flex-1"
        placeholder="Add a comment..."
        value={content}
        setContent={setContent}
      ></CommentTextarea>

      <Button type="submit">
        <span>{submitLabel}</span>
      </Button>
    </form>
  );
}
