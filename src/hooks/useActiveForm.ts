import { useContext } from "react";
import { ActiveFormContext } from "@/contexts/active-form-context";

export function useActiveForm() {
  const context = useContext(ActiveFormContext);
  if (context === null)
    throw new Error(
      "ActiveFormContext was used outside the ActiveFormProvider",
    );
  return context;
}
