const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const UNITS = [
  ["year", 365 * DAY],
  ["month", 30 * DAY],
  ["week", 7 * DAY],
  ["day", DAY],
  ["hour", HOUR],
  ["minute", MINUTE],
] as const satisfies readonly [Intl.RelativeTimeFormatUnit, number][];

type Unit = (typeof UNITS)[number][0];

const UNIT_LENGTH = Object.fromEntries(UNITS) as Record<Unit, number>;

const relativeFormat = new Intl.RelativeTimeFormat("en", { numeric: "always" });
const exactFormat = new Intl.DateTimeFormat("en", {
  dateStyle: "long",
  timeStyle: "short",
});

export function formatRelativeTime(createdAt: string, now: number) {
  const elapsed = now - Date.parse(createdAt);
  for (const [unit, length] of UNITS) {
    if (elapsed >= length)
      return relativeFormat.format(-Math.floor(elapsed / length), unit);
  }
  return "just now";
}

export function formatExactDate(createdAt: string) {
  return exactFormat.format(Date.parse(createdAt));
}

const LABEL_PATTERN = /^(\d+) (year|month|week|day|hour|minute)s? ago$/;

export function parseRelativeLabel(label: string, now: number) {
  const match = LABEL_PATTERN.exec(label.trim());
  const offset = match ? Number(match[1]) * UNIT_LENGTH[match[2] as Unit] : 0;
  return new Date(now - offset).toISOString();
}
