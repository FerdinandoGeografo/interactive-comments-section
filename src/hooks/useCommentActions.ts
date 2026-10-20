import { useState } from "react";
import { useComments } from "@/hooks/useComments";
import type { CommentTarget } from "@/models/comment.interface";

type CommentMode = "idle" | "edit" | "reply";

export function useCommentActions(target: CommentTarget) {
  const { dispatch } = useComments();
  const [mode, setMode] = useState<CommentMode>("idle");
  // Kept apart from `mode` so cancelling a deletion preserves an open edit draft.
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const resetMode = () => setMode("idle");

  const handleVote = (delta: 1 | -1) =>
    dispatch({ type: "vote", payload: { target, delta } });

  const handleEdit = (content: string) => {
    dispatch({ type: "edit", payload: { target, content } });
    resetMode();
  };

  const handleDeleteConfirmed = () =>
    dispatch({ type: "delete", payload: { target } });

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
