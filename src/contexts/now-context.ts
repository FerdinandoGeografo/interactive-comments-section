import { createContext } from "react";

// Current time in ms, shared by every relative time label.
export const NowContext = createContext<number | null>(null);
