import { useLayoutEffect, useRef, type Ref } from "react";
import { AnimatePresence, motion, useIsPresent } from "motion/react";
import type { CommentEntry, CommentTarget } from "@/models/comment.interface";

import CommentHeader from "@/components/CommentHeader";
import CommentContent from "@/components/CommentContent";
import ScoreCounter from "@/components/ScoreCounter";
import EditCommentForm from "@/components/EditCommentForm";
import CommentActions from "@/components/CommentActions";
import CreateCommentForm from "@/components/CreateCommentForm";
import ReplyList from "@/components/ReplyList";
import DeleteCommentDialog from "@/components/DeleteCommentDialog";
import FormReveal from "@/components/FormReveal";

import { useCommentActions } from "@/hooks/useCommentActions";
import { layoutSpring } from "@/lib/motion/transitions";
import { entryMotion, swapMotion } from "@/lib/motion/variants";
import { focusAfterDelete } from "@/lib/focus";

interface CommentProps {
  entry: CommentEntry;
  target: CommentTarget;
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
  // Exiting entries stay in the DOM while they fade: inert keeps them unusable.
  const isPresent = useIsPresent();
  const replyTriggerRef = useRef<HTMLButtonElement>(null);
  const editTriggerRef = useRef<HTMLButtonElement>(null);
  const articleRef = useRef<HTMLElement>(null);
  const deleteConfirmedRef = useRef(false);

  useLayoutEffect(() => {
    if (!isPresent && deleteConfirmedRef.current) {
      deleteConfirmedRef.current = false;
      focusAfterDelete(articleRef.current);
    }
  }, [isPresent]);

  const { content, user, score, createdAt } = entry;
  const replyingTo = entry.kind === "reply" ? entry.replyingTo : "";

  function closeAndFocus(trigger: HTMLButtonElement | null) {
    closeForm();
    trigger?.focus();
  }

  return (
    <motion.li
      ref={ref}
      layout="position"
      {...entryMotion}
      transition={{ layout: layoutSpring }}
      inert={!isPresent}
      // focus-within:z-10 keeps an open form above siblings sliding past it.
      className="relative flex flex-col gap-4 focus-within:z-10 sm:gap-5"
    >
      <article
        ref={articleRef}
        className="grid grid-cols-[auto_1fr] grid-rows-[auto_auto_auto] items-center gap-4 rounded-lg bg-white p-4 sm:grid-cols-[40px_auto_auto] sm:grid-rows-[auto_auto] sm:items-start sm:gap-x-6 sm:gap-y-3.75 sm:p-6"
      >
        <CommentHeader user={user} createdAt={createdAt} isAuthor={isAuthor} />

        <div className="relative col-span-full sm:col-start-2">
          <AnimatePresence initial={false} mode="popLayout">
            {isEditing ? (
              <motion.div key="edit" {...swapMotion}>
                <EditCommentForm
                  entry={entry}
                  onSubmit={(newContent) => {
                    submitEdit(newContent);
                    editTriggerRef.current?.focus();
                  }}
                  onCancel={() => closeAndFocus(editTriggerRef.current)}
                />
              </motion.div>
            ) : (
              <motion.div key="content" {...swapMotion}>
                <CommentContent content={content} replyingTo={replyingTo} />
              </motion.div>
            )}
          </AnimatePresence>
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

      {/* The negative margin cancels the list gap while the form is collapsed. */}
      <AnimatePresence initial={false}>
        {isReplying && (
          <FormReveal key="reply-form" className="-mt-4 sm:-mt-5">
            <CreateCommentForm
              label="Reply"
              submitLabel="reply"
              replyingTo={user.username}
              autoFocus
              className="mt-2"
              onSubmit={(newContent) => {
                submitReply(newContent);
                replyTriggerRef.current?.focus();
              }}
              onCancel={() => closeAndFocus(replyTriggerRef.current)}
            />
          </FormReveal>
        )}
      </AnimatePresence>

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
        onConfirm={() => {
          deleteConfirmedRef.current = true;
          confirmDelete();
        }}
      />
    </motion.li>
  );
}
