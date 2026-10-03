import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const MAX_STEP = 5;

/** Global class that delays an animation by `step` x 100ms (see globals.css) */
export function loadStep(step: number) {
  return `load-step-${Math.min(Math.max(step, 0), MAX_STEP)}`;
}

type RevealProps = {
  children: ReactNode;
  /** Position in a sequence: step N starts N x 100ms after step 0 */
  step?: number;
  className?: string;
};

/**
 * Drops in from above once on first load. Reserved for the stack diagram
 * layers. It is plain CSS (`.load-drop`), so the content is in the page and
 * visible without JavaScript, and with reduced motion nothing animates.
 */
export function Reveal({ children, step = 0, className }: RevealProps) {
  return <div className={cn("load-drop", loadStep(step), className)}>{children}</div>;
}
