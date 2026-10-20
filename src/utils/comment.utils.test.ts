import { describe, expect, it } from "vitest";
import { createInitialState } from "@/data/seed";
import type { ThreadComment } from "@/models/comment.interface";
import {
  isValidContent,
  MAX_CONTENT_LENGTH,
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
