import type { User } from "@/models/user.interface";

export type Vote = -1 | 0 | 1;

interface CommentEntryBase {
  id: string;
  content: string;
  createdAt: string;
  score: number;
  currentUserVote: Vote;
  user: User;
}

export interface ThreadComment extends CommentEntryBase {
  kind: "comment";
  replies: Reply[];
}

export interface Reply extends CommentEntryBase {
  kind: "reply";
  replyingTo: string;
}

export type CommentEntry = ThreadComment | Reply;

export type CommentTarget =
  | { kind: "comment"; id: string }
  | { kind: "reply"; threadId: string; id: string };
