import type { Variants } from "motion/react";
import { fade, instant, leave, pulse, spring } from "@/lib/motion/transitions";

export const entryMotion = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: spring },
  exit: { opacity: 0, scale: 0.98, transition: leave },
};

// The replaced element leaves at once, so text and edit form never overlap.
export const swapMotion = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: fade },
  exit: { opacity: 0, transition: instant },
};

const scorePulse = { scale: [1, 1.25, 1], transition: pulse };

// Twin variants replay the pulse on each vote without remounting the live region.
export const scoreVariants: Variants = { even: scorePulse, odd: scorePulse };

export const votePress = { scale: 0.85 };
