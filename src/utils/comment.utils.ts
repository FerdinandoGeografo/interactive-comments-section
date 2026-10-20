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

// Roots by descending score; toSorted is stable, so equal scores keep the
// insertion order (oldest first). Replies are never reordered.
export function sortRootComments(comments: readonly ThreadComment[]) {
  return comments.toSorted((a, b) => b.score - a.score);
}

// The mention shown in reply/edit textareas is metadata (replyingTo), not
// part of the content, and cannot be edited.
export function mentionPrefix(username: string) {
  return `@${username} `;
}

// Content part of a prefixed textarea value, or null when the change
// touched the prefix and must be rejected.
export function applyPrefixedChange(prefix: string, nextValue: string) {
  return nextValue.startsWith(prefix) ? nextValue.slice(prefix.length) : null;
}

// Keeps the caret and selection after the prefix.
export function clampSelection(
  prefixLength: number,
  start: number,
  end: number,
): [number, number] {
  return [Math.max(start, prefixLength), Math.max(end, prefixLength)];
}

// Pressing the active vote removes it; the opposite vote replaces it.
export function nextVote(current: Vote, direction: 1 | -1): Vote {
  return current === direction ? 0 : direction;
}
