import type { ReactNode } from "react";
import { LazyMotion, MotionConfig } from "motion/react";
import { ANIMATION_MODE } from "@/lib/motion";

const loadFeatures = () =>
  import("@/lib/motion-features").then((module) => module.default);

// `m` components render without animating until the features load; nothing
// depends on an animation finishing. `strict` rejects the full `motion`
// component, which would bundle every feature up front. In static mode
// "always" also turns off what is not an animation, such as the press
// state; skipAnimations (see lib/motion.ts) stops everything else.
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig
        reducedMotion={ANIMATION_MODE === "static" ? "always" : "user"}
      >
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}
