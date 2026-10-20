import { useRef, type Ref } from "react";
import { AnimatePresence, useIsPresent } from "motion/react";
import * as m from "motion/react-m";
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
import { entryMotion, transitions } from "@/lib/motion";

interface CommentProps {
  entry: CommentEntry;
  target: CommentTarget;
  /** Set by AnimatePresence (popLayout measures the exiting element). */
  ref?: Ref<HTMLLIElement>;
}

export default function Comment({ entry, target, ref }: CommentProps) {
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
  // An entry that is fading out stays in the DOM: inert keeps it out of
  // focus, pointer and assistive technology so it cannot be used twice.
  // While siblings slide (layout animations), the entry holding focus stays
  // on top so a moving sibling never covers an open form.
  const isPresent = useIsPresent();
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
    <m.li
      ref={ref}
      layout="position"
      {...entryMotion}
      transition={{ layout: transitions.layout }}
      inert={!isPresent}
      className="relative flex flex-col gap-4 focus-within:z-10 sm:gap-5"
    >
      <article className="grid grid-cols-[auto_1fr] grid-rows-[auto_auto_auto] items-center gap-4 rounded-lg bg-white p-4 sm:grid-cols-[40px_auto_auto] sm:grid-rows-[auto_auto] sm:items-start sm:gap-x-6 sm:gap-y-3.75 sm:p-6">
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

      <AnimatePresence initial={false} mode="popLayout">
        {entry.kind === "comment" && entry.replies.length > 0 && (
          <ReplyList
            key="replies"
            replies={entry.replies}
            threadId={entry.id}
          />
        )}
      </AnimatePresence>

      <DeleteCommentDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={confirmDelete}
      />
    </m.li>
  );
}
