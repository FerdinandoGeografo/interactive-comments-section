import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg leading-6 font-medium whitespace-nowrap outline-hidden transition-colors duration-300 select-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-blue-500 text-white uppercase enabled:hover:bg-blue-200",
        secondary:
          "bg-gray-600 text-white uppercase enabled:hover:bg-gray-600/75",
        destructive: "bg-red-500 text-white uppercase enabled:hover:bg-red-200",
        ghost: "text-blue-500 enabled:hover:text-blue-200",
        "ghost-destructive": "text-red-500 enabled:hover:text-red-200",
        vote: "rounded-[10px] text-blue-200 focus-visible:ring-offset-0 focus-visible:ring-inset enabled:hover:text-blue-500 disabled:opacity-100",
      },
      size: {
        default: "px-7.5 py-3",
        inline: "p-0",
        icon: "h-full w-8 sm:h-8.5 sm:w-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button };
