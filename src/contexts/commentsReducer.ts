import { COMMENTS, type Comment, type Reply } from "@/models/comment.interface";
import { CURRENT_USER, type User } from "@/models/user.interface";

export interface CommentsState {
  currentUser: User;
  comments: Comment[];
}

export type CommentsAction =
  | {
      type: "vote";
      payload: { id: number; parentId?: number; delta: 1 | -1 };
    }
  | {
      type: "edit";
      payload: { id: number; parentId?: number; content: string };
    }
  | {
      type: "delete";
      payload: { id: number; parentId?: number };
    }
  | {
      type: "createComment";
      payload: { comment: Comment };
    }
  | {
      type: "createReply";
      payload: { reply: Reply; parentId: number };
    };

export const initialState: CommentsState = {
  currentUser: CURRENT_USER,
  comments: COMMENTS,
};

export function commentsReducer(
  state: CommentsState,
  action: CommentsAction,
): CommentsState {
  switch (action.type) {
    case "vote": {
      const { id, parentId, delta } = action.payload;
      return {
        ...state,
        comments: state.comments.map((comment) => {
          if (!parentId && comment.id === id)
            return { ...comment, score: comment.score + delta };
          if (parentId && comment.id === parentId)
            return {
              ...comment,
              replies: comment.replies.map((r) =>
                r.id === id ? { ...r, score: r.score + delta } : r,
              ),
            };
          return comment;
        }),
      };
    }
    case "edit": {
      const { id, parentId, content } = action.payload;
      return {
        ...state,
        comments: state.comments.map((comment) => {
          if (!parentId && comment.id === id) return { ...comment, content };
          if (parentId && comment.id === parentId)
            return {
              ...comment,
              replies: comment.replies.map((r) =>
                r.id === id ? { ...r, content } : r,
              ),
            };
          return comment;
        }),
      };
    }
    case "delete": {
      const { id, parentId } = action.payload;
      if (!parentId)
        return {
          ...state,
          comments: state.comments.filter((c) => c.id !== id),
        };
      return {
        ...state,
        comments: state.comments.map((comment) =>
          comment.id === parentId
            ? {
                ...comment,
                replies: comment.replies.filter((r) => r.id !== id),
              }
            : comment,
        ),
      };
    }
    case "createComment":
      return {
        ...state,
        comments: [...state.comments, action.payload.comment],
      };
    case "createReply":
      return {
        ...state,
        comments: state.comments.map((comment) =>
          comment.id === action.payload.parentId
            ? {
                ...comment,
                replies: [...comment.replies, action.payload.reply],
              }
            : comment,
        ),
      };
    default:
      throw new Error("action type is unknown");
  }
}
