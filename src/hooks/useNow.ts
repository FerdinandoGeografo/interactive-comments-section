import { useSyncExternalStore } from "react";

const TICK_MS = 60_000;

// One clock shared by every relative time label: a single interval runs
// while at least one component is subscribed.
let now = Date.now();
const listeners = new Set<() => void>();
let intervalId: ReturnType<typeof setInterval> | undefined;

function tick() {
  now = Date.now();
  listeners.forEach((listener) => listener());
}

function handleVisibilityChange() {
  if (document.visibilityState === "visible") tick();
}

function subscribe(listener: () => void) {
  if (listeners.size === 0) {
    now = Date.now();
    intervalId = setInterval(tick, TICK_MS);
    document.addEventListener("visibilitychange", handleVisibilityChange);
  }
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    }
  };
}

function getSnapshot() {
  return now;
}

export function useNow() {
  return useSyncExternalStore(subscribe, getSnapshot);
}
