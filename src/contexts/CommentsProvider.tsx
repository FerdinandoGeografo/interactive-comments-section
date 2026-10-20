import { useReducer, type ReactNode } from "react";
import { CommentsContext } from "@/contexts/comments-context";
import { commentsReducer, initialState } from "@/contexts/commentsReducer";

export function CommentsProvider({ children }: { children: ReactNode }) {
  const [{ currentUser, comments }, dispatch] = useReducer(
    commentsReducer,
    initialState,
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
