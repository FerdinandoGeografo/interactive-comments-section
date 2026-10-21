import type { Transition } from "motion/react";

export const spring = {
  type: "spring",
  bounce: 0,
  visualDuration: 0.3,
} satisfies Transition;

export const layoutSpring = {
  type: "spring",
  bounce: 0,
  visualDuration: 0.35,
} satisfies Transition;

export const leave = { duration: 0.2, ease: "easeOut" } satisfies Transition;
export const reveal = { duration: 0.25, ease: "easeOut" } satisfies Transition;
export const fade = { duration: 0.15, ease: "easeOut" } satisfies Transition;
export const pulse = { duration: 0.25, ease: "easeOut" } satisfies Transition;
export const instant = { duration: 0 } satisfies Transition;
