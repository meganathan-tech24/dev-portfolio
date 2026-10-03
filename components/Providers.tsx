"use client";

import { LazyMotion, MotionConfig } from "motion/react";
import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";

const loadFeatures = () =>
  import("./motion-features").then((module) => module.default);

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <MotionConfig reducedMotion="user">
        <LazyMotion features={loadFeatures} strict>
          {children}
        </LazyMotion>
      </MotionConfig>
    </ThemeProvider>
  );
}
