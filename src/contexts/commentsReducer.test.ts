import { beforeEach, describe, expect, it } from "vitest";
import {
  commentsReducer,
  type CommentsAction,
  type CommentsState,
} from "@/contexts/commentsReducer";
import { createInitialState } from "@/data/seed";
import type { CommentTarget } from "@/models/comment.interface";
import { findEntry, MAX_CONTENT_LENGTH } from "@/utils/comment.utils";

// Seed: root "1" amyrobson (no replies), root "2" maxblagun with replies
// "3" ramsesmiron and "4" juliusomo (the current user).
const ROOT_1: CommentTarget = { kind: "comment", id: "1" };
const ROOT_2: CommentTarget = { kind: "comment", id: "2" };
const REPLY_3: CommentTarget = { kind: "reply", threadId: "2", id: "3" };
const REPLY_4: CommentTarget = { kind: "reply", threadId: "2", id: "4" };

function deepFreeze<T>(value: T): T {
  if (value && typeof value === "object") {
    Object.values(value).forEach(deepFreeze);
    Object.freeze(value);
  }
  return value;
}

let state: CommentsState;

function run(...actions: CommentsAction[]) {
  return actions.reduce(
    (current, action) => commentsReducer(deepFreeze(current), action),
    state,
  );
}

beforeEach(() => {
  state = deepFreeze(createInitialState());
});

describe("createComment", () => {
  it("appends a root comment authored by the current user", () => {
    const next = run({
      type: "createComment",
      payload: { id: "new", content: "  Hello  ", createdAt: "now" },
    });

    const created = next.comments.at(-1);
    expect(created).toEqual({
      kind: "comment",
      id: "new",
      content: "Hello",
      createdAt: "now",
      score: 0,
      currentUserVote: 0,
      user: state.currentUser,
      replies: [],
    });
  });

  it.each([
    ["empty", ""],
    ["whitespace only", "   \n "],
    ["over the limit", "a".repeat(MAX_CONTENT_LENGTH + 1)],
  ])("rejects %s content", (_, content) => {
    const next = run({
      type: "createComment",
      payload: { id: "new", content, createdAt: "now" },
    });
    expect(next).toBe(state);
  });

  it("accepts content exactly at the limit", () => {
    const next = run({
      type: "createComment",
      payload: {
        id: "new",
        content: "a".repeat(MAX_CONTENT_LENGTH),
        createdAt: "now",
      },
    });
    expect(next.comments).toHaveLength(3);
  });
});

describe("createReply", () => {
  it("replies to a root comment inside its thread", () => {
    const next = run({
      type: "createReply",
      payload: { target: ROOT_1, id: "r", content: "Hi", createdAt: "now" },
    });

    const thread = next.comments.find((comment) => comment.id === "1");
    expect(thread?.replies).toEqual([
      expect.objectContaining({
        kind: "reply",
        id: "r",
        replyingTo: "amyrobson",
        user: state.currentUser,
      }),
    ]);
  });

  it("replies to a reply at the end of the same root thread", () => {
    const next = run({
      type: "createReply",
      payload: { target: REPLY_3, id: "r", content: "Hi", createdAt: "now" },
    });

    const thread = next.comments.find((comment) => comment.id === "2");
    expect(thread?.replies.map((reply) => reply.id)).toEqual(["3", "4", "r"]);
    expect(thread?.replies.at(-1)?.replyingTo).toBe("ramsesmiron");
    expect(next.comments).toHaveLength(2);
  });

  it("ignores missing targets and invalid content", () => {
    const missing: CommentTarget = { kind: "reply", threadId: "2", id: "x" };
    expect(
      run({
        type: "createReply",
        payload: { target: missing, id: "r", content: "Hi", createdAt: "now" },
      }),
    ).toBe(state);
    expect(
      run({
        type: "createReply",
        payload: { target: ROOT_1, id: "r", content: " ", createdAt: "now" },
      }),
    ).toBe(state);
  });
});

describe("edit", () => {
  it("updates the current user's entry and keeps createdAt", () => {
    const next = run({
      type: "edit",
      payload: { target: REPLY_4, content: " Updated " },
    });

    const entry = findEntry(next.comments, REPLY_4);
    expect(entry?.content).toBe("Updated");
    expect(entry?.createdAt).toBe(
      findEntry(state.comments, REPLY_4)?.createdAt,
    );
  });

  it("rejects foreign entries, invalid and unchanged content", () => {
    const original = findEntry(state.comments, REPLY_4)?.content ?? "";
    for (const action of [
      { target: REPLY_3, content: "Not mine" },
      { target: REPLY_4, content: "" },
      { target: REPLY_4, content: ` ${original} ` },
    ]) {
      expect(run({ type: "edit", payload: action })).toBe(state);
    }
  });
});

describe("delete", () => {
  it("removes only the current user's reply", () => {
    const next = run({ type: "delete", payload: { target: REPLY_4 } });

    const thread = next.comments.find((comment) => comment.id === "2");
    expect(thread?.replies.map((reply) => reply.id)).toEqual(["3"]);
    expect(next.comments).toHaveLength(2);
  });

  it("removes a root comment together with its replies", () => {
    const own: CommentTarget = { kind: "comment", id: "mine" };
    const next = run(
      {
        type: "createComment",
        payload: { id: "mine", content: "Root", createdAt: "now" },
      },
      {
        type: "createReply",
        payload: {
          target: own,
          id: "child",
          content: "Reply",
          createdAt: "now",
        },
      },
      { type: "delete", payload: { target: own } },
    );

    expect(next.comments.map((comment) => comment.id)).toEqual(["1", "2"]);
    expect(findEntry(next.comments, own)).toBeUndefined();
  });

  it("rejects foreign and missing entries", () => {
    for (const target of [
      ROOT_2,
      REPLY_3,
      { kind: "comment", id: "x" } as const,
    ]) {
      expect(run({ type: "delete", payload: { target } })).toBe(state);
    }
  });
});

it("never mutates the previous state", () => {
  const snapshot = structuredClone(state);
  run(
    {
      type: "createComment",
      payload: { id: "a", content: "A", createdAt: "now" },
    },
    {
      type: "createReply",
      payload: { target: REPLY_3, id: "b", content: "B", createdAt: "now" },
    },
    { type: "edit", payload: { target: REPLY_4, content: "Edited" } },
    { type: "vote", payload: { target: ROOT_1, delta: 1 } },
    { type: "delete", payload: { target: REPLY_4 } },
  );
  expect(state).toEqual(snapshot);
});
