import { useState } from "react";
import { useComments } from "@/hooks/useComments";
import type { BaseComment } from "@/models/comment.interface";

type CommentMode = "idle" | "edit" | "reply";

export function useCommentActions(comment: BaseComment, parentId?: number) {
  const { dispatch } = useComments();
  const [mode, setMode] = useState<CommentMode>("idle");
  // Kept apart from `mode` so cancelling a deletion preserves an open edit draft.
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const resetMode = () => setMode("idle");

  const handleVote = (delta: 1 | -1) =>
    dispatch({ type: "vote", payload: { id: comment.id, parentId, delta } });

  const handleEdit = (content: string) => {
    dispatch({ type: "edit", payload: { id: comment.id, parentId, content } });
    resetMode();
  };

  const handleDeleteConfirmed = () =>
    dispatch({ type: "delete", payload: { id: comment.id, parentId } });

  const handleReplySubmitted = () => {
    resetMode();
  };

  return {
    mode,
    setMode,
    isDeleteOpen,
    setIsDeleteOpen,
    handleVote,
    handleEdit,
    handleDeleteConfirmed,
    handleReplySubmitted,
  };
}
