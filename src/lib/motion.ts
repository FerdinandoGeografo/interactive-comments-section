import { MotionGlobalConfig } from "motion/react";

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
