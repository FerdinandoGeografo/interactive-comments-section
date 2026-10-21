import type { CommentsState } from "@/contexts/commentsReducer";
import { createInitialState } from "@/data/seed";

const STORAGE_KEY = "interactive-comments:state";
const STORAGE_VERSION = 1;

// Missing, unreadable or outdated data starts again from the seed.
export function loadState(now = Date.now()): CommentsState {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
    if (stored?.version === STORAGE_VERSION) return stored.state;
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
