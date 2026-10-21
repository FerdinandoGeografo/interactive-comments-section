import type { ReactNode, Ref } from "react";
import { motion, useIsPresent, useReducedMotionConfig } from "motion/react";
import { cn } from "@/lib/utils";
import { reveal } from "@/lib/motion/transitions";

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
    <motion.div
      ref={ref}
      initial={collapsed}
      animate={{ opacity: 1, height: "auto", transition: reveal }}
      exit={{ ...collapsed, transition: reveal }}
      inert={!isPresent}
      className={cn("flex flex-col overflow-clip", className)}
    >
      {children}
    </motion.div>
  );
}
