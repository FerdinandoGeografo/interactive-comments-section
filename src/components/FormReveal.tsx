import type { ReactNode, Ref } from "react";
import { useIsPresent, useReducedMotionConfig } from "motion/react";
import * as m from "motion/react-m";
import { cn } from "@/lib/utils";
import { transitions } from "@/lib/motion";

interface FormRevealProps {
  className?: string;
  children: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

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
      inert={!isPresent}
      className={cn("flex flex-col overflow-clip", className)}
    >
      {children}
    </m.div>
  );
}
