import { useEffect, useReducer, type ReactNode } from "react";
import { CommentsContext } from "@/contexts/comments-context";
import { commentsReducer } from "@/contexts/commentsReducer";
import { loadState, saveState } from "@/data/persistence";

export function CommentsProvider({ children }: { children: ReactNode }) {
  // Storage is read in the lazy initializer, before the first save; both
  // are idempotent, so StrictMode double invocations are harmless.
  const [state, dispatch] = useReducer(commentsReducer, undefined, () =>
    loadState(),
  );
  const { currentUser, comments } = state;

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
