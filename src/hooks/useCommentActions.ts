import { useState } from "react";
import { useActiveForm } from "@/hooks/useActiveForm";
import { useComments } from "@/hooks/useComments";
import { createId } from "@/lib/id";
import type { CommentEntry, CommentTarget } from "@/models/comment.interface";
import { isAuthoredBy } from "@/utils/comment.utils";

export function useCommentActions(entry: CommentEntry, target: CommentTarget) {
  const { currentUser, dispatch } = useComments();
  const { activeForm, toggleForm, closeForm } = useActiveForm();
  // Kept apart from the active form so cancelling a deletion preserves an
  // open edit draft.
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const isAuthor = isAuthoredBy(entry, currentUser);
  const isReplying = activeForm?.kind === "reply" && activeForm.id === entry.id;
  const isEditing = activeForm?.kind === "edit" && activeForm.id === entry.id;

  const toggleReply = () => toggleForm("reply", entry.id);
  const toggleEdit = () => toggleForm("edit", entry.id);

  const vote = (direction: 1 | -1) =>
    dispatch({ type: "vote", payload: { target, direction } });

  const submitReply = (content: string) => {
    dispatch({
      type: "createReply",
      payload: { target, id: createId(), content, createdAt: "now" },
    });
    closeForm();
  };

  const submitEdit = (content: string) => {
    dispatch({ type: "edit", payload: { target, content } });
    closeForm();
  };

  const confirmDelete = () => dispatch({ type: "delete", payload: { target } });

  return {
    isAuthor,
    isReplying,
    isEditing,
    toggleReply,
    toggleEdit,
    closeForm,
    vote,
    submitReply,
    submitEdit,
    isDeleteOpen,
    setIsDeleteOpen,
    confirmDelete,
  };
}
