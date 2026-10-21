import { useEffect, useState, type ReactNode } from "react";
import { NowContext } from "@/contexts/now-context";

const TICK_MS = 60_000;

// One shared clock instead of a timer per comment.
export function NowProvider({ children }: { children: ReactNode }) {
  const [now, setNow] = useState(Date.now);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") tick();
    };

    const intervalId = setInterval(tick, TICK_MS);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return <NowContext.Provider value={now}>{children}</NowContext.Provider>;
}
