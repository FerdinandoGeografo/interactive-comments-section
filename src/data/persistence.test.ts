import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { commentsReducer } from "@/contexts/commentsReducer";
import {
  BACKUP_KEY,
  loadPersistedState,
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

describe("loadPersistedState", () => {
  it("starts from the seed with ISO timestamps when nothing is stored", () => {
    const storage = createStorage();
    const { status, state, save } = loadPersistedState(storage, NOW);

    expect(status).toBe("missing");
    expect(state).toEqual(createInitialState(NOW));
    expect(state.comments[0].createdAt).toBe("2026-09-20T12:00:00.000Z");
    expect(warn).not.toHaveBeenCalled();

    save(state);
    expect(loadPersistedState(storage, NOW + 1000).state).toEqual(state);
  });

  it("restores a saved state", () => {
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
    const loaded = loadPersistedState(storage, NOW + 1000);
    expect(loaded.status).toBe("restored");
    expect(loaded.state).toEqual(state);
  });

  it("keeps an empty list empty across saves and reloads", () => {
    const storage = createStorage();
    const empty = { ...createInitialState(NOW), comments: [] };
    saveState(empty, storage);

    const first = loadPersistedState(storage, NOW);
    expect(first).toMatchObject({ status: "restored", state: empty });
    first.save(first.state);
    expect(loadPersistedState(storage, NOW + 1000).state).toEqual(empty);
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
    const { status, state } = loadPersistedState(storage, NOW);

    expect(status).toBe("recovered");
    expect(state).toEqual(createInitialState(NOW));
    expect(storage.items.get(BACKUP_KEY)).toBe(raw);
    expect(storage.items.get(STORAGE_KEY)).toBe(raw);
    expect(warn).toHaveBeenCalledOnce();
  });

  it("saves over unrecognized data only after backing it up", () => {
    const storage = createStorage({ [STORAGE_KEY]: "{not json" });
    const { state, save } = loadPersistedState(storage, NOW);

    save(state);
    expect(storage.items.get(BACKUP_KEY)).toBe("{not json");
    expect(loadPersistedState(storage, NOW).status).toBe("restored");
  });

  it("never overwrites unrecognized data that could not be backed up", () => {
    const storage = createStorage({ [STORAGE_KEY]: "{not json" });
    const setItem = storage.setItem;
    // The backup fails (e.g. quota) while the main key stays writable.
    storage.setItem = (key, value) => {
      if (key === BACKUP_KEY) throw new Error("QuotaExceededError");
      setItem(key, value);
    };
    const { status, state, save } = loadPersistedState(storage, NOW);

    expect(status).toBe("backupFailed");
    expect(state).toEqual(createInitialState(NOW));
    save(state);
    save(
      commentsReducer(state, {
        type: "delete",
        payload: { target: { kind: "comment", id: "1" } },
      }),
    );
    expect(storage.items.get(STORAGE_KEY)).toBe("{not json");
    expect(storage.items.has(BACKUP_KEY)).toBe(false);
  });

  it("never writes when the stored value could not be read", () => {
    const storage = createStorage({ [STORAGE_KEY]: "saved" });
    storage.getItem = () => {
      throw new Error("SecurityError");
    };
    const { status, state, save } = loadPersistedState(storage, NOW);

    expect(status).toBe("readFailed");
    expect(state).toEqual(createInitialState(NOW));
    save(state);
    expect(storage.items.get(STORAGE_KEY)).toBe("saved");
    expect(warn).toHaveBeenCalledOnce();
  });

  it("works in memory when storage is unavailable or saving throws", () => {
    const { status, state, save } = loadPersistedState(null, NOW);
    expect(status).toBe("unavailable");
    expect(state).toEqual(createInitialState(NOW));
    expect(() => save(state)).not.toThrow();

    const failing = {
      getItem: () => null,
      setItem: () => {
        throw new Error("QuotaExceededError");
      },
    };
    expect(() => saveState(state, failing)).not.toThrow();
    expect(warn).toHaveBeenCalledTimes(2);
  });
});
