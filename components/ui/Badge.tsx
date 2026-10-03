import type { ReactNode } from "react";
import type { Layer } from "@/data/types";
import { cn } from "@/lib/utils";

type BadgeProps = {
  /** Colours the badge with its stack layer. Omit for a neutral badge. */
  layer?: Layer;
  className?: string;
  children: ReactNode;
};

export function Badge({ layer, className, children }: BadgeProps) {
  return (
    <span data-layer={layer} className={cn("badge", className)}>
      {children}
    </span>
  );
}
