import { useRef } from "react";
import type { CommentEntry, CommentTarget } from "@/models/comment.interface";

import CommentHeader from "@/components/CommentHeader";
import CommentContent from "@/components/CommentContent";
import ScoreCounter from "@/components/ScoreCounter";
import EditCommentForm from "@/components/EditCommentForm";
import CommentActions from "@/components/CommentActions";
import CreateCommentForm from "@/components/CreateCommentForm";
import ReplyList from "@/components/ReplyList";
import DeleteCommentDialog from "@/components/DeleteCommentDialog";

import { useCommentActions } from "@/hooks/useCommentActions";

interface CommentProps {
  entry: CommentEntry;
  target: CommentTarget;
}

export default function Comment({ entry, target }: CommentProps) {
  const {
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
  } = useCommentActions(entry, target);
  const replyTriggerRef = useRef<HTMLButtonElement>(null);
  const editTriggerRef = useRef<HTMLButtonElement>(null);

  const { content, user, score, createdAt } = entry;
  const replyingTo = entry.kind === "reply" ? entry.replyingTo : "";

  // Closing a form (submit, Escape) returns focus to the button that opened it.
  function closeAndFocus(trigger: HTMLButtonElement | null) {
    closeForm();
    trigger?.focus();
  }

  return (
    <li className="contents">
      <article className="grid grid-cols-[auto_auto] grid-rows-[auto_auto_auto] items-center gap-4 rounded-lg bg-white p-4 sm:grid-cols-[40px_auto_auto] sm:grid-rows-[auto_auto] sm:items-start sm:gap-x-6 sm:gap-y-3.75 sm:p-6">
        <CommentHeader user={user} createdAt={createdAt} isAuthor={isAuthor} />

        <div className="col-span-full sm:col-start-2">
          {isEditing ? (
            <EditCommentForm
              entry={entry}
              onSubmit={(newContent) => {
                submitEdit(newContent);
                editTriggerRef.current?.focus();
              }}
              onCancel={() => closeAndFocus(editTriggerRef.current)}
            />
          ) : (
            <CommentContent content={content} replyingTo={replyingTo} />
          )}
        </div>

        <ScoreCounter
          score={score}
          currentUserVote={entry.currentUserVote}
          disabled={isAuthor}
          author={user.username}
          onVote={vote}
        />

        <CommentActions
          isAuthor={isAuthor}
          isReplying={isReplying}
          isEditing={isEditing}
          replyTriggerRef={replyTriggerRef}
          editTriggerRef={editTriggerRef}
          onDelete={() => setIsDeleteOpen(true)}
          onEdit={toggleEdit}
          onReply={toggleReply}
        />
      </article>

      {isReplying && (
        <CreateCommentForm
          label={`Reply to ${user.username}`}
          submitLabel="reply"
          replyingTo={user.username}
          autoFocus
          className="-mt-2 sm:-mt-3"
          onSubmit={(newContent) => {
            submitReply(newContent);
            replyTriggerRef.current?.focus();
          }}
          onCancel={() => closeAndFocus(replyTriggerRef.current)}
        />
      )}

      {entry.kind === "comment" && entry.replies.length > 0 && (
        <ReplyList replies={entry.replies} threadId={entry.id} />
      )}

      <DeleteCommentDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={confirmDelete}
      />
    </li>
  );
}
