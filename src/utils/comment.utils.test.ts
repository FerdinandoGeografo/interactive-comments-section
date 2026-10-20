import { describe, expect, it } from "vitest";
import { createInitialState } from "@/data/seed";
import type { ThreadComment } from "@/models/comment.interface";
import {
  applyPrefixedChange,
  clampSelection,
  isValidContent,
  MAX_CONTENT_LENGTH,
  mentionPrefix,
  nextVote,
  sortRootComments,
} from "@/utils/comment.utils";

describe("nextVote", () => {
  it.each([
    [0, 1, 1],
    [0, -1, -1],
    [1, 1, 0],
    [-1, -1, 0],
    [1, -1, -1],
    [-1, 1, 1],
  ] as const)(
    "from %i pressing %i gives %i",
    (current, direction, expected) => {
      expect(nextVote(current, direction)).toBe(expected);
    },
  );
});

describe("isValidContent", () => {
  it("requires non-blank content within the limit after trimming", () => {
    expect(isValidContent("")).toBe(false);
    expect(isValidContent(" \n\t ")).toBe(false);
    expect(isValidContent("a")).toBe(true);
    expect(isValidContent(` ${"a".repeat(MAX_CONTENT_LENGTH)} `)).toBe(true);
    expect(isValidContent("a".repeat(MAX_CONTENT_LENGTH + 1))).toBe(false);
  });
});

describe("sortRootComments", () => {
  const [base] = createInitialState().comments;
  const root = (id: string, score: number): ThreadComment => ({
    ...base,
    id,
    score,
  });

  it("orders by descending score, keeping insertion order on ties", () => {
    const comments = [root("a", 1), root("b", 5), root("c", 1), root("d", 5)];
    expect(sortRootComments(comments).map((c) => c.id)).toEqual([
      "b",
      "d",
      "a",
      "c",
    ]);
  });

  it("returns a new array and leaves the input and replies untouched", () => {
    const comments = Object.freeze([root("a", 1), root("b", 2)]);
    const sorted = sortRootComments(comments);
    expect(sorted).not.toBe(comments);
    expect(comments.map((c) => c.id)).toEqual(["a", "b"]);
    expect(sorted[0].replies).toBe(comments[1].replies);
  });
});

describe("locked mention prefix", () => {
  const prefix = mentionPrefix("ramsesmiron");

  it("builds the prefix from the recipient", () => {
    expect(prefix).toBe("@ramsesmiron ");
  });

  it("returns the content for edits after the prefix", () => {
    expect(applyPrefixedChange(prefix, "@ramsesmiron ")).toBe("");
    expect(applyPrefixedChange(prefix, "@ramsesmiron Hi there")).toBe(
      "Hi there",
    );
  });

  it.each([
    ["deleting the trailing space", "@ramsesmiron"],
    ["deleting a character inside", "@ramsesmion Hi"],
    ["typing before it", "x@ramsesmiron Hi"],
    ["replacing everything", "Hi"],
  ])("rejects %s", (_, value) => {
    expect(applyPrefixedChange(prefix, value)).toBeNull();
  });

  it("keeps the selection after the prefix", () => {
    expect(clampSelection(13, 0, 0)).toEqual([13, 13]);
    expect(clampSelection(13, 0, 20)).toEqual([13, 20]);
    expect(clampSelection(13, 15, 18)).toEqual([15, 18]);
  });

  it("is a no-op without a prefix", () => {
    expect(applyPrefixedChange("", "anything")).toBe("anything");
    expect(clampSelection(0, 0, 3)).toEqual([0, 3]);
  });
});
