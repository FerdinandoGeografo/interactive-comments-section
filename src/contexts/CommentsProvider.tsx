import { useEffect, useReducer, type ReactNode } from "react";
import { CommentsContext } from "@/contexts/comments-context";
import { commentsReducer } from "@/contexts/commentsReducer";
import { loadState, saveState } from "@/data/persistence";

export function CommentsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(commentsReducer, undefined, () =>
    loadState(),
  );
  const { currentUser, comments } = state;

  // On a first visit the first run stores the seed.
  useEffect(() => {
    saveState(state);
  }, [state]);

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
