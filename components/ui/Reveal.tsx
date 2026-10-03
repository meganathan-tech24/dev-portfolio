"use client";

import { useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** Seconds to wait before this element animates in */
  delay?: number;
  className?: string;
};

/**
 * Fade and rise on first load. Reserved for the stack diagram layers:
 * it is the only automatic animation on the site, not a scroll effect.
 * With reduced motion the content simply appears.
 */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  const reduceMotion = useReducedMotion();

  return (
    <m.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay, ease: "easeOut" }}
    >
      {children}
    </m.div>
  );
}
