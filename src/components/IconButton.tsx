import type { ReactNode } from "react";

interface IconButtonProps {
  children: ReactNode;
  onClick?: () => void;
}

export default function IconButton({ children, onClick }: IconButtonProps) {
  return (
    <button
      className="flex h-full w-8 cursor-pointer items-center justify-center text-blue-200 outline-0 transition-colors duration-300 hover:bg-gray-200 hover:text-blue-500 focus:bg-gray-200 focus:text-blue-500 sm:h-8.5 sm:w-full"
      onClick={() => onClick?.()}
    >
      {children}
    </button>
  );
}
