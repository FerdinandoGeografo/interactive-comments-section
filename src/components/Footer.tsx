import { motion } from "motion/react";
import { layoutSpring } from "@/lib/motion/transitions";

export default function Footer() {
  return (
    // Follows the new-comment form when the list above it changes height.
    <motion.footer
      layout="position"
      transition={{ layout: layoutSpring }}
      className="pb-8 text-center text-sm leading-5 text-gray-600"
    >
      <p>
        Coded by{" "}
        <a
          href="https://github.com/FerdinandoGeografo"
          className="relative rounded-xs font-medium text-blue-500 outline-offset-2 after:absolute after:inset-x-0 after:bottom-0 after:h-px after:scale-x-0 after:bg-current after:transition-transform after:duration-200 after:ease-out hover:after:scale-x-100 focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:after:scale-x-100 motion-reduce:after:transition-none"
        >
          Ferdinando Geografo
        </a>
      </p>
    </motion.footer>
  );
}
