import type { CommentsState } from "@/contexts/commentsReducer";
import { createInitialState } from "@/data/seed";

const STORAGE_KEY = "interactive-comments:state";
const STORAGE_VERSION = 1;

type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === "object" && value !== null;

const isString = (value: unknown): value is string => typeof value === "string";

function isUser(value: unknown) {
  return (
    isRecord(value) &&
    isString(value.username) &&
    isRecord(value.image) &&
    isString(value.image.png) &&
    isString(value.image.webp)
  );
}

function isEntry(
  value: unknown,
  kind: "comment" | "reply",
): value is UnknownRecord {
  return (
    isRecord(value) &&
    value.kind === kind &&
    isString(value.id) &&
    isString(value.content) &&
    isString(value.createdAt) &&
    !Number.isNaN(Date.parse(value.createdAt)) &&
    Number.isFinite(value.score) &&
    [-1, 0, 1].includes(value.currentUserVote as number) &&
    isUser(value.user)
  );
}

// Checks the fields the page reads, so stored data can't break rendering.
function isCommentsState(value: unknown): value is CommentsState {
  return (
    isRecord(value) &&
    isUser(value.currentUser) &&
    Array.isArray(value.comments) &&
    value.comments.every(
      (comment) =>
        isEntry(comment, "comment") &&
        Array.isArray(comment.replies) &&
        comment.replies.every(
          (reply) => isEntry(reply, "reply") && isString(reply.replyingTo),
        ),
    )
  );
}

// Missing, unreadable, outdated or incomplete data starts again from the seed.
export function loadState(now = Date.now()): CommentsState {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
    if (stored?.version === STORAGE_VERSION && isCommentsState(stored.state))
      return stored.state;
  } catch {
    // Invalid JSON or blocked storage.
  }
  return createInitialState(now);
}

export function saveState(state: CommentsState) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: STORAGE_VERSION, state }),
    );
  } catch {
    // Blocked storage or full quota: the app keeps working in memory.
  }
}
