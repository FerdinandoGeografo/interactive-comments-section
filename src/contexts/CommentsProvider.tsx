import { useEffect, useReducer, type ReactNode } from "react";
import { CommentsContext } from "@/contexts/comments-context";
import { commentsReducer } from "@/contexts/commentsReducer";
import type { PersistedState } from "@/data/persistence";

interface CommentsProviderProps {
  /** Loaded once before rendering (see main.tsx), so reads always precede saves. */
  persistence: PersistedState;
  children: ReactNode;
}

export function CommentsProvider({
  persistence,
  children,
}: CommentsProviderProps) {
  const [state, dispatch] = useReducer(commentsReducer, persistence.state);
  const { currentUser, comments } = state;

  // Idempotent, so StrictMode double invocations are harmless.
  useEffect(() => {
    persistence.save(state);
  }, [persistence, state]);

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
