import { useState, type ReactNode } from "react";
import {
  ActiveFormContext,
  type ActiveForm,
  type ActiveFormKind,
} from "@/contexts/active-form-context";

export function ActiveFormProvider({ children }: { children: ReactNode }) {
  const [activeForm, setActiveForm] = useState<ActiveForm>(null);

  const toggleForm = (kind: ActiveFormKind, id: string) =>
    setActiveForm((current) =>
      current?.kind === kind && current.id === id ? null : { kind, id },
    );
  const closeForm = () => setActiveForm(null);

  return (
    <ActiveFormContext.Provider value={{ activeForm, toggleForm, closeForm }}>
      {children}
    </ActiveFormContext.Provider>
  );
}
