import { createContext } from "react";

export type ActiveFormKind = "reply" | "edit";

// Only one reply/edit form is open at a time across the whole list.
export type ActiveForm = { kind: ActiveFormKind; id: string } | null;

export interface ActiveFormContextValue {
  activeForm: ActiveForm;
  toggleForm: (kind: ActiveFormKind, id: string) => void;
  closeForm: () => void;
}

export const ActiveFormContext = createContext<ActiveFormContextValue | null>(
  null,
);
