import { useReducer, type ReactNode } from "react";
import { CommentsContext } from "@/contexts/comments-context";
import { commentsReducer } from "@/contexts/commentsReducer";
import { createInitialState } from "@/data/seed";

export function CommentsProvider({ children }: { children: ReactNode }) {
  const [{ currentUser, comments }, dispatch] = useReducer(
    commentsReducer,
    undefined,
    createInitialState,
  );

  return (
    <CommentsContext.Provider
      value={{
        currentUser,
        comments,
        dispatch,
      }}
    >
      {children}
    </CommentsContext.Provider>
  );
}
