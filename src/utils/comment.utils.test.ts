import { describe, expect, it } from "vitest";
import {
  isValidContent,
  MAX_CONTENT_LENGTH,
  nextVote,
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
