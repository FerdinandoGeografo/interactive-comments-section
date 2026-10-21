import { createContext } from "react";

export type ActiveFormKind = "reply" | "edit";

export type ActiveForm = { kind: ActiveFormKind; id: string } | null;

export interface ActiveFormContextValue {
  activeForm: ActiveForm;
  toggleForm: (kind: ActiveFormKind, id: string) => void;
  closeForm: () => void;
}

export const ActiveFormContext = createContext<ActiveFormContextValue | null>(
  null,
);
