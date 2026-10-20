import { useContext } from "react";
import { CommentsContext } from "@/contexts/comments-context";

export function useComments() {
  const context = useContext(CommentsContext);
  if (context === null)
    throw new Error("CommentsContext was used outside the CommentsProvider");
  return context;
}
