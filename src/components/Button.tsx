import type { ReactNode } from "react";

type ButtonVariation = "primary" | "danger";

interface ButtonProps {
  type?: "reset" | "button" | "submit";
  onClick?: () => void;
  variation?: ButtonVariation;
  className?: string;
  outlined?: boolean;
  children: ReactNode;
}

const BTN_VARIATIONS: Record<
  ButtonVariation,
  Record<"outlined" | "filled", string>
> = {
  primary: {
    outlined: "text-blue-500 hover:text-blue-200 focus:text-blue-200",
    filled: "bg-blue-500 hover:bg-blue-200 focus:bg-blue-200",
  },
  danger: {
    outlined: "text-red-500 hover:text-red-200 focus:text-red-200",
    filled: "bg-red-500 hover:bg-red-200 focus:bg-red-200",
  },
};

export default function Button({
  type = "button",
  onClick,
  variation = "primary",
  className = "",
  outlined = false,
  children,
}: ButtonProps) {
  const variantCls =
    BTN_VARIATIONS[variation][outlined ? "outlined" : "filled"];
  return (
    <button
      className={`flex cursor-pointer items-center rounded-lg leading-6 font-medium outline-0 transition-all duration-300 ${outlined ? "gap-2 bg-transparent capitalize" : "px-7.5 py-3 text-white uppercase"} ${variantCls} ${className}`}
      type={type}
      onClick={() => onClick?.()}
    >
      {children}
    </button>
  );
}
