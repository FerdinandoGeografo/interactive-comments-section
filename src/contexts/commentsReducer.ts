import type {
  CommentEntry,
  CommentTarget,
  Reply,
  ThreadComment,
} from "@/models/comment.interface";
import type { User } from "@/models/user.interface";
import {
  findEntry,
  getThreadId,
  isAuthoredBy,
  isValidContent,
  nextVote,
  normalizeContent,
} from "@/utils/comment.utils";

export interface CommentsState {
  currentUser: User;
  comments: ThreadComment[];
}

// Author, score and vote are set here so an action cannot forge them.
export type CommentsAction =
  | {
      type: "createComment";
      payload: { id: string; content: string; createdAt: string };
    }
  | {
      type: "createReply";
      payload: {
        target: CommentTarget;
        id: string;
        content: string;
        createdAt: string;
      };
    }
  | {
      type: "edit";
      payload: { target: CommentTarget; content: string };
    }
  | {
      type: "delete";
      payload: { target: CommentTarget };
    }
  | {
      type: "vote";
      payload: { target: CommentTarget; direction: 1 | -1 };
    };

type EntryPatch = Partial<
  Pick<CommentEntry, "content" | "score" | "currentUserVote">
>;

function patchEntry(
  comments: ThreadComment[],
  target: CommentTarget,
  patch: EntryPatch,
): ThreadComment[] {
  const threadId = getThreadId(target);
  return comments.map((comment) => {
    if (comment.id !== threadId) return comment;
    if (target.kind === "comment") return { ...comment, ...patch };
    return {
      ...comment,
      replies: comment.replies.map((reply) =>
        reply.id === target.id ? { ...reply, ...patch } : reply,
      ),
    };
  });
}

// Invalid actions return the previous state unchanged.
export function commentsReducer(
  state: CommentsState,
  action: CommentsAction,
): CommentsState {
  switch (action.type) {
    case "createComment": {
      const { id, createdAt } = action.payload;
      const content = normalizeContent(action.payload.content);
      if (!isValidContent(content)) return state;

      const comment: ThreadComment = {
        kind: "comment",
        id,
        content,
        createdAt,
        score: 0,
        currentUserVote: 0,
        user: state.currentUser,
        replies: [],
      };
      return { ...state, comments: [...state.comments, comment] };
    }
    case "createReply": {
      const { target, id, createdAt } = action.payload;
      const content = normalizeContent(action.payload.content);
      const recipient = findEntry(state.comments, target);
      if (!recipient || !isValidContent(content)) return state;

      const reply: Reply = {
        kind: "reply",
        id,
        content,
        createdAt,
        score: 0,
        currentUserVote: 0,
        user: state.currentUser,
        replyingTo: recipient.user.username,
      };
      const threadId = getThreadId(target);
      return {
        ...state,
        comments: state.comments.map((comment) =>
          comment.id === threadId
            ? { ...comment, replies: [...comment.replies, reply] }
            : comment,
        ),
      };
    }
    case "edit": {
      const { target } = action.payload;
      const content = normalizeContent(action.payload.content);
      const entry = findEntry(state.comments, target);
      if (
        !entry ||
        !isAuthoredBy(entry, state.currentUser) ||
        !isValidContent(content) ||
        content === entry.content
      )
        return state;

      return {
        ...state,
        comments: patchEntry(state.comments, target, { content }),
      };
    }
    case "delete": {
      const { target } = action.payload;
      const entry = findEntry(state.comments, target);
      if (!entry || !isAuthoredBy(entry, state.currentUser)) return state;

      if (target.kind === "comment")
        return {
          ...state,
          comments: state.comments.filter(
            (comment) => comment.id !== target.id,
          ),
        };
      return {
        ...state,
        comments: state.comments.map((comment) =>
          comment.id === target.threadId
            ? {
                ...comment,
                replies: comment.replies.filter(
                  (reply) => reply.id !== target.id,
                ),
              }
            : comment,
        ),
      };
    }
    case "vote": {
      const { target, direction } = action.payload;
      const entry = findEntry(state.comments, target);
      if (!entry || isAuthoredBy(entry, state.currentUser)) return state;

      const vote = nextVote(entry.currentUserVote, direction);
      return {
        ...state,
        comments: patchEntry(state.comments, target, {
          currentUserVote: vote,
          score: entry.score - entry.currentUserVote + vote,
        }),
      };
    }
    default: {
      action satisfies never;
      return state;
    }
  }
}
