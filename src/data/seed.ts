import data from "@/data/data.json";
import type { CommentsState } from "@/contexts/commentsReducer";
import type { Reply, ThreadComment } from "@/models/comment.interface";
import type { User } from "@/models/user.interface";

interface SeedEntry {
  id: number;
  content: string;
  createdAt: string;
  score: number;
  user: User;
}

interface SeedData {
  currentUser: User;
  comments: (SeedEntry & { replies: (SeedEntry & { replyingTo: string })[] })[];
}

// Type-checked assignment (not a cast) of the bundled challenge dataset.
const seed: SeedData = data;

export function createInitialState(): CommentsState {
  return {
    currentUser: seed.currentUser,
    comments: seed.comments.map(
      ({ replies, id, ...comment }): ThreadComment => ({
        ...comment,
        kind: "comment",
        id: String(id),
        currentUserVote: 0,
        replies: replies.map(({ id: replyId, ...reply }): Reply => ({
          ...reply,
          kind: "reply",
          id: String(replyId),
          currentUserVote: 0,
        })),
      }),
    ),
  };
}
