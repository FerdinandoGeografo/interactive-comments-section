import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Custom @theme tokens in index.css, so they replace the defaults instead of piling up.
const twMerge = extendTailwindMerge({
  extend: { theme: { radius: ["score"], text: ["badge"] } },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
