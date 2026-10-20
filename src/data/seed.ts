import data from "@/data/data.json";
import type { CommentsState } from "@/contexts/commentsReducer";
import type { Reply, ThreadComment } from "@/models/comment.interface";
import type { User } from "@/models/user.interface";
import { parseRelativeLabel } from "@/utils/time.utils";

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

// The seed's relative labels ("2 weeks ago") become ISO timestamps relative
// to the initialization time.
export function createInitialState(now = Date.now()): CommentsState {
  return {
    currentUser: seed.currentUser,
    comments: seed.comments.map(
      ({ replies, id, createdAt, ...comment }): ThreadComment => ({
        ...comment,
        kind: "comment",
        id: String(id),
        createdAt: parseRelativeLabel(createdAt, now),
        currentUserVote: 0,
        replies: replies.map(
          ({ id: replyId, createdAt: replyCreatedAt, ...reply }): Reply => ({
            ...reply,
            kind: "reply",
            id: String(replyId),
            createdAt: parseRelativeLabel(replyCreatedAt, now),
            currentUserVote: 0,
          }),
        ),
      }),
    ),
  };
}
