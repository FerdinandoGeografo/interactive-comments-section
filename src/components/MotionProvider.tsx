import type { ReactNode } from "react";
import { LazyMotion, MotionConfig } from "motion/react";

const loadFeatures = () =>
  import("@/lib/motion-features").then((module) => module.default);

// `m` components render without animating until the features load; nothing
// depends on an animation finishing. `strict` rejects the full `motion`
// component, which would bundle every feature up front.
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
