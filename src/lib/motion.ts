import { MotionGlobalConfig, type Transition } from "motion/react";

export const transitions = {
  enter: { type: "spring", visualDuration: 0.3, bounce: 0 },
  exit: { duration: 0.2, ease: "easeOut" },
  layout: { type: "spring", visualDuration: 0.35, bounce: 0 },
  reveal: { duration: 0.25, ease: "easeOut" },
  fade: { duration: 0.15, ease: "easeOut" },
  pulse: { duration: 0.25, ease: "easeOut" },
} satisfies Record<string, Transition>;

// The element that replaces another in place (comment text ↔ edit form)
// fades in; the one it replaces leaves at once.
export const swapMotion = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: transitions.fade },
  exit: { opacity: 0, transition: { duration: 0 } },
};

// Entries (comments, replies, reply lists) fade and rise in, fade out.
export const entryMotion = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: transitions.enter },
  exit: { opacity: 0, scale: 0.98, transition: transitions.exit },
};

export type AnimationMode = "animated" | "static";

// "static" (build with `--mode static`, see .env.static) renders every
// change at once, for screenshots. "animated" respects the user's
// reduced-motion preference through MotionConfig.
export const ANIMATION_MODE: AnimationMode =
  import.meta.env.VITE_ANIMATION_MODE === "static" ? "static" : "animated";

// Runs once before the first render. Static mode skips Motion animations and,
// through the data attribute (see index.css), CSS transitions and animations.
export function applyAnimationMode() {
  if (ANIMATION_MODE !== "static") return;
  MotionGlobalConfig.skipAnimations = true;
  document.documentElement.dataset.animation = "static";
}
