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
import { useComments } from "@/hooks/useComments";

interface CommentProps {
  entry: CommentEntry;
  target: CommentTarget;
}

export default function Comment({ entry, target }: CommentProps) {
  const { currentUser } = useComments();
  const {
    mode,
    setMode,
    isDeleteOpen,
    setIsDeleteOpen,
    handleVote,
    handleEdit,
    handleDeleteConfirmed,
    handleReplySubmitted,
  } = useCommentActions(target);

  const { content, user, score, createdAt } = entry;

  const isAuthor = user.username === currentUser.username;
  const replyingTo = entry.kind === "reply" ? entry.replyingTo : "";

  return (
    <li className="contents">
      <article className="grid grid-cols-[auto_auto] grid-rows-[auto_auto_auto] items-center gap-4 rounded-lg bg-white p-4 sm:grid-cols-[40px_auto_auto] sm:grid-rows-[auto_auto] sm:items-start sm:gap-x-6 sm:gap-y-3.75 sm:p-6">
        <CommentHeader user={user} createdAt={createdAt} isAuthor={isAuthor} />

        <div className="col-span-full sm:col-start-2">
          {mode === "edit" ? (
            <EditCommentForm entry={entry} onSubmit={handleEdit} />
          ) : (
            <CommentContent content={content} replyingTo={replyingTo} />
          )}
        </div>

        <ScoreCounter
          score={score}
          currentUserVote={entry.currentUserVote}
          disabled={isAuthor}
          author={user.username}
          onVote={handleVote}
        />

        <CommentActions
          isAuthor={isAuthor}
          onDelete={() => setIsDeleteOpen(true)}
          onEdit={() => setMode("edit")}
          onReply={() => setMode("reply")}
        />
      </article>
      {entry.kind === "comment" && (
        <>
          {entry.replies.length > 0 && (
            <ReplyList
              replies={entry.replies}
              threadId={entry.id}
              replyForm={
                mode === "reply" ? (
                  <CreateCommentForm
                    target={target}
                    replyingTo={user.username}
                    onSubmitted={() => handleReplySubmitted}
                  />
                ) : null
              }
            />
          )}
          {entry.replies.length === 0 && mode === "reply" && (
            <CreateCommentForm
              target={target}
              replyingTo={user.username}
              onSubmitted={handleReplySubmitted}
            />
          )}
        </>
      )}
      <DeleteCommentDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={handleDeleteConfirmed}
      />
    </li>
  );
}
