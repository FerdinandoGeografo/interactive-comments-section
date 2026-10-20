import type { BaseComment, Comment } from "../models/comment.interface";

import CommentHeader from "./CommentHeader";
import CommentContent from "./CommentContent";
import ScoreCounter from "./ScoreCounter";
import EditCommentForm from "./EditCommentForm";
import CommentActions from "./CommentActions";
import CreateCommentForm from "./CreateCommentForm";
import ReplyList from "./ReplyList";

import { useCommentActions } from "../hooks/useCommentActions";
import { useComments } from "../contexts/CommentsContext";
import { isComment, isReply } from "../utils/comment.utils";
import DeleteCommentDialog from "./DeleteCommentDialog";

interface CommentProps {
  comment: BaseComment;
  parentId?: number;
}

export default function Comment({ comment, parentId }: CommentProps) {
  const { currentUser } = useComments();
  const {
    mode,
    setMode,
    handleVote,
    handleEdit,
    handleDeleteConfirmed,
    handleReplySubmitted,
  } = useCommentActions(comment, parentId);

  const { content, user, score, createdAt } = comment;

  const isTopLevel = parentId === undefined;
  const isAuthor = user.username === currentUser.username;
  const replies = isComment(comment) ? comment.replies : [];
  const replyingTo = isReply(comment) ? comment.replyingTo : "";

  return (
    <li className="contents">
      <article className="grid grid-cols-[auto_auto] grid-rows-[auto_auto_auto] items-center gap-4 rounded-lg bg-white p-4 sm:grid-cols-[40px_auto_auto] sm:grid-rows-[auto_auto] sm:items-start sm:gap-x-6 sm:gap-y-3.75 sm:p-6">
        <CommentHeader user={user} createdAt={createdAt} isAuthor={isAuthor} />

        <div className="col-span-full sm:col-start-2">
          {mode === "edit" ? (
            <EditCommentForm comment={comment} onSubmit={handleEdit} />
          ) : (
            <CommentContent content={content} replyingTo={replyingTo} />
          )}
        </div>

        <ScoreCounter score={score} onVote={handleVote} />

        <CommentActions
          isAuthor={isAuthor}
          onDelete={() => setMode("delete")}
          onEdit={() => setMode("edit")}
          onReply={() => setMode("reply")}
        />
      </article>
      {isTopLevel && (
        <>
          {replies.length > 0 && (
            <ReplyList
              replies={replies}
              parentId={comment.id}
              replyForm={
                mode === "reply" ? (
                  <CreateCommentForm
                    parentId={comment.id}
                    replyingTo={comment.user.username}
                    onSubmitted={() => handleReplySubmitted}
                  />
                ) : null
              }
            />
          )}
          {replies.length === 0 && mode === "reply" && (
            <CreateCommentForm
              parentId={comment.id}
              replyingTo={comment.user.username}
              onSubmitted={handleReplySubmitted}
            />
          )}
        </>
      )}
      <DeleteCommentDialog
        isOpen={mode === "delete"}
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setMode("idle")}
      />
    </li>
  );
}
