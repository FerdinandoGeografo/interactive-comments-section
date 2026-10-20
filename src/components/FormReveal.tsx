import type { ReactNode, Ref } from "react";
import { useIsPresent, useReducedMotionConfig } from "motion/react";
import * as m from "motion/react-m";
import { cn } from "@/lib/utils";
import { transitions } from "@/lib/motion";

interface FormRevealProps {
  className?: string;
  children: ReactNode;
  /** Set by AnimatePresence. */
  ref?: Ref<HTMLDivElement>;
}

// Opens and closes a form by growing its height, so the content below moves
// with it instead of jumping. Use as a direct child of AnimatePresence.
// overflow: clip (unlike hidden) is not a scroll container, so focusing the
// textarea on mount cannot scroll the clipped content. Under reduced motion
// only the opacity changes.
export default function FormReveal({
  className,
  children,
  ref,
}: FormRevealProps) {
  const isPresent = useIsPresent();
  const shouldReduceMotion = useReducedMotionConfig();
  const collapsed = shouldReduceMotion
    ? { opacity: 0 }
    : { opacity: 0, height: 0 };

  return (
    <m.div
      ref={ref}
      initial={collapsed}
      animate={{ opacity: 1, height: "auto", transition: transitions.reveal }}
      exit={{ ...collapsed, transition: transitions.reveal }}
      // A closing form cannot be focused or submitted again.
      inert={!isPresent}
      className={cn("flex flex-col overflow-clip", className)}
    >
      {children}
    </m.div>
  );
}
