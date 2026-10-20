import { useContext } from "react";
import { NowContext } from "@/contexts/now-context";

export function useNow() {
  const now = useContext(NowContext);
  if (now === null)
    throw new Error("NowContext was used outside the NowProvider");
  return now;
}
