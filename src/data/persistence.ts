import type { CommentsState } from "@/contexts/commentsReducer";
import { createInitialState } from "@/data/seed";
import type { Reply, ThreadComment, Vote } from "@/models/comment.interface";
import type { User } from "@/models/user.interface";
import { isValidContent, normalizeContent } from "@/utils/comment.utils";

export const STORAGE_KEY = "interactive-comments:state";
export const BACKUP_KEY = "interactive-comments:backup";
const SCHEMA_VERSION = 1;

type StorageLike = Pick<Storage, "getItem" | "setItem">;

// Accessing localStorage itself can throw (blocked storage, sandboxed
// frames); the app then keeps its state in memory only.
export function getStorage(): StorageLike | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

// Runtime validation of stored data: anything accepted here satisfies the
// same invariants the reducer enforces.

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isIsoTimestamp(value: unknown): value is string {
  return (
    isString(value) &&
    !Number.isNaN(Date.parse(value)) &&
    new Date(value).toISOString() === value
  );
}

function isVote(value: unknown): value is Vote {
  return value === -1 || value === 0 || value === 1;
}

function isUser(value: unknown): value is User {
  return (
    isRecord(value) &&
    isString(value.username) &&
    isRecord(value.image) &&
    isString(value.image.png) &&
    isString(value.image.webp)
  );
}

function hasEntryFields(value: UnknownRecord) {
  return (
    isString(value.id) &&
    isString(value.content) &&
    isValidContent(value.content) &&
    value.content === normalizeContent(value.content) &&
    isIsoTimestamp(value.createdAt) &&
    Number.isInteger(value.score) &&
    isVote(value.currentUserVote) &&
    isUser(value.user)
  );
}

function isReply(value: unknown): value is Reply {
  return (
    isRecord(value) &&
    value.kind === "reply" &&
    isString(value.replyingTo) &&
    hasEntryFields(value)
  );
}

function isThreadComment(value: unknown): value is ThreadComment {
  return (
    isRecord(value) &&
    value.kind === "comment" &&
    hasEntryFields(value) &&
    Array.isArray(value.replies) &&
    value.replies.every(isReply)
  );
}

export function parseStoredState(value: unknown): CommentsState | null {
  if (!isRecord(value) || value.version !== SCHEMA_VERSION) return null;

  const { state } = value;
  if (
    !isRecord(state) ||
    !isUser(state.currentUser) ||
    !Array.isArray(state.comments) ||
    !state.comments.every(isThreadComment)
  )
    return null;

  const comments: ThreadComment[] = state.comments;
  const ids = comments.flatMap((comment) => [
    comment.id,
    ...comment.replies.map((reply) => reply.id),
  ]);
  if (new Set(ids).size !== ids.length) return null;

  return { currentUser: state.currentUser, comments };
}

function parseJson(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    return undefined;
  }
}

export type LoadStatus =
  | "missing"
  | "restored"
  | "recovered"
  | "backupFailed"
  | "readFailed"
  | "unavailable";

export interface PersistedState {
  status: LoadStatus;
  state: CommentsState;
  /** Saves the state, or does nothing when saving could destroy data. */
  save: (state: CommentsState) => void;
}

// Reads, validates and recovers the stored state once per page load, before
// React renders. Missing data starts from the seed. Unrecognized data
// (invalid JSON, unknown schema or version) is copied to BACKUP_KEY before
// the seed is used. When the stored value cannot be read or backed up,
// the app keeps working in memory and never writes over it.
export function loadPersistedState(
  storage = getStorage(),
  now = Date.now(),
): PersistedState {
  const save = (state: CommentsState) => saveState(state, storage);
  const inMemory = (status: LoadStatus): PersistedState => ({
    status,
    state: createInitialState(now),
    save: () => {},
  });

  if (!storage) {
    console.warn("Storage is unavailable; comments will not be saved.");
    return inMemory("unavailable");
  }

  let raw: string | null;
  try {
    raw = storage.getItem(STORAGE_KEY);
  } catch (error) {
    console.warn(
      "Saved comments could not be read; changes will not be saved.",
      error,
    );
    return inMemory("readFailed");
  }
  if (raw === null)
    return { status: "missing", state: createInitialState(now), save };

  const state = parseStoredState(parseJson(raw));
  if (state) return { status: "restored", state, save };

  try {
    storage.setItem(BACKUP_KEY, raw);
  } catch (error) {
    console.warn(
      "Saved comments were not recognized and could not be backed up; they are left untouched and changes will not be saved.",
      error,
    );
    return inMemory("backupFailed");
  }
  console.warn(
    `Saved comments were not recognized and have been moved to "${BACKUP_KEY}"; starting from the sample data.`,
  );
  return { status: "recovered", state: createInitialState(now), save };
}

export function saveState(state: CommentsState, storage = getStorage()) {
  if (!storage) return;
  try {
    storage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: SCHEMA_VERSION, state }),
    );
  } catch (error) {
    console.warn("Comments could not be saved.", error);
  }
}
