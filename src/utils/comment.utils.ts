import type {
  CommentEntry,
  CommentTarget,
  ThreadComment,
  Vote,
} from "@/models/comment.interface";
import type { User } from "@/models/user.interface";

export const MAX_CONTENT_LENGTH = 1000;

export function normalizeContent(content: string) {
  return content.trim();
}

export function isValidContent(content: string) {
  const normalized = normalizeContent(content);
  return normalized.length > 0 && normalized.length <= MAX_CONTENT_LENGTH;
}

export function getThreadId(target: CommentTarget) {
  return target.kind === "comment" ? target.id : target.threadId;
}

export function findEntry(
  comments: ThreadComment[],
  target: CommentTarget,
): CommentEntry | undefined {
  const thread = comments.find((comment) => comment.id === getThreadId(target));
  if (target.kind === "comment") return thread;
  return thread?.replies.find((reply) => reply.id === target.id);
}

export function isAuthoredBy(entry: CommentEntry, user: User) {
  return entry.user.username === user.username;
}

export function sortRootComments(comments: readonly ThreadComment[]) {
  return comments.toSorted((a, b) => b.score - a.score);
}

export function nextVote(current: Vote, direction: 1 | -1): Vote {
  return current === direction ? 0 : direction;
}
