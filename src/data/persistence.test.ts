import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { commentsReducer } from "@/contexts/commentsReducer";
import {
  BACKUP_KEY,
  loadState,
  saveState,
  STORAGE_KEY,
} from "@/data/persistence";
import { createInitialState } from "@/data/seed";

const NOW = Date.parse("2026-10-20T12:00:00.000Z");

function createStorage(initial: Record<string, string> = {}) {
  const items = new Map(Object.entries(initial));
  return {
    items,
    getItem: (key: string) => items.get(key) ?? null,
    setItem: (key: string, value: string) => void items.set(key, value),
  };
}

let warn: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  warn = vi.spyOn(console, "warn").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("loadState", () => {
  it("starts from the seed with ISO timestamps when nothing is stored", () => {
    const state = loadState(createStorage(), NOW);

    expect(state).toEqual(createInitialState(NOW));
    expect(state.comments[0].createdAt).toBe("2026-09-20T12:00:00.000Z");
    expect(warn).not.toHaveBeenCalled();
  });

  it("restores a saved state, including an empty list", () => {
    const storage = createStorage();
    const edited = [
      {
        type: "vote",
        payload: { target: { kind: "comment", id: "1" }, direction: 1 },
      },
      {
        type: "createReply",
        payload: {
          target: { kind: "reply", threadId: "2", id: "3" },
          id: "new",
          content: "Reply",
          createdAt: "2026-10-20T11:59:00.000Z",
        },
      },
      {
        type: "delete",
        payload: { target: { kind: "reply", threadId: "2", id: "4" } },
      },
    ] as const;
    const state = edited.reduce(commentsReducer, createInitialState(NOW));

    saveState(state, storage);
    expect(loadState(storage, NOW + 1000)).toEqual(state);

    const empty = { ...state, comments: [] };
    saveState(empty, storage);
    expect(loadState(storage, NOW)).toEqual(empty);
  });

  const valid = () => ({ version: 1, state: createInitialState(NOW) });
  const withRoot = (patch: object) => {
    const data = valid();
    Object.assign(data.state.comments[0], patch);
    return data;
  };

  it.each([
    ["invalid JSON", "{not json"],
    ["an unsupported version", JSON.stringify({ ...valid(), version: 2 })],
    ["a missing currentUser", JSON.stringify({ version: 1, state: {} })],
    ["an invalid vote", JSON.stringify(withRoot({ currentUserVote: 2 }))],
    ["a non-ISO timestamp", JSON.stringify(withRoot({ createdAt: "now" }))],
    ["empty content", JSON.stringify(withRoot({ content: " " }))],
    ["duplicate IDs", JSON.stringify(withRoot({ id: "2" }))],
  ])("backs up %s and starts from the seed", (_, raw) => {
    const storage = createStorage({ [STORAGE_KEY]: raw });

    expect(loadState(storage, NOW)).toEqual(createInitialState(NOW));
    expect(storage.items.get(BACKUP_KEY)).toBe(raw);
    expect(storage.items.get(STORAGE_KEY)).toBe(raw);
    expect(warn).toHaveBeenCalledOnce();
  });

  it("falls back to the seed when storage throws or is unavailable", () => {
    const failing = {
      getItem: () => {
        throw new Error("SecurityError");
      },
      setItem: () => {
        throw new Error("QuotaExceededError");
      },
    };

    expect(loadState(failing, NOW)).toEqual(createInitialState(NOW));
    expect(loadState(null, NOW)).toEqual(createInitialState(NOW));
    expect(() => saveState(createInitialState(NOW), failing)).not.toThrow();
    expect(warn).toHaveBeenCalledTimes(3);
  });
});
