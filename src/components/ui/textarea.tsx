import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "w-full resize-none rounded-lg border border-gray-200 bg-transparent px-6 py-3 leading-6 text-gray-700 caret-blue-500 outline-hidden transition-[border-color] duration-300 placeholder:text-gray-600 hover:border-blue-500 focus-visible:border-blue-500 focus-visible:ring-1 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
