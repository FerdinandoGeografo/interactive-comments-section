import { describe, expect, it } from "vitest";
import { formatRelativeTime, parseRelativeLabel } from "@/utils/time.utils";

const NOW = Date.parse("2026-10-20T12:00:00.000Z");
const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const ago = (ms: number) => new Date(NOW - ms).toISOString();

describe("formatRelativeTime", () => {
  it.each([
    [0, "just now"],
    [59 * SECOND, "just now"],
    [MINUTE, "1 minute ago"],
    [59 * MINUTE, "59 minutes ago"],
    [HOUR, "1 hour ago"],
    [23 * HOUR, "23 hours ago"],
    [DAY, "1 day ago"],
    [6 * DAY, "6 days ago"],
    [7 * DAY, "1 week ago"],
    [29 * DAY, "4 weeks ago"],
    [30 * DAY, "1 month ago"],
    [364 * DAY, "12 months ago"],
    [365 * DAY, "1 year ago"],
    [800 * DAY, "2 years ago"],
  ])("%i ms ago → %s", (elapsed, label) => {
    expect(formatRelativeTime(ago(elapsed), NOW)).toBe(label);
  });

  it("shows future timestamps as just now", () => {
    expect(formatRelativeTime(ago(-5 * MINUTE), NOW)).toBe("just now");
  });
});

describe("parseRelativeLabel", () => {
  it.each(["1 month ago", "2 weeks ago", "1 week ago", "2 days ago"])(
    "round-trips the seed label %s",
    (label) => {
      expect(formatRelativeTime(parseRelativeLabel(label, NOW), NOW)).toBe(
        label,
      );
    },
  );

  it("maps unrecognized labels to now", () => {
    expect(parseRelativeLabel("yesterday", NOW)).toBe(ago(0));
  });
});
