import { domMax } from "motion/react";

// Loaded asynchronously by MotionProvider. domMax is needed for layout
// animations (thread reordering, siblings moving when entries change).
export default domMax;
