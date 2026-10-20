import { createContext, type Dispatch } from "react";
import type { CommentsAction, CommentsState } from "@/contexts/commentsReducer";

export interface CommentsContextValue extends CommentsState {
  dispatch: Dispatch<CommentsAction>;
}

export const CommentsContext = createContext<CommentsContextValue | null>(null);
