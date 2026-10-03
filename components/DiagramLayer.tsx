"use client";

import type { ReactNode } from "react";
import { useLayerHighlight } from "@/components/LayerHighlightProvider";
import type { Layer } from "@/data/types";

type DiagramLayerProps = {
  layer: Layer;
  /** Accessible name, e.g. "Interface layer: React, Next.js" */
  label: string;
  children: ReactNode;
};

/**
 * One layer of the stack diagram. Hovering or focusing it highlights it and
 * dims the others (CSS); activating it highlights that layer's tags across the page.
 */
export function DiagramLayer({ layer, label, children }: DiagramLayerProps) {
  const { selected, toggle } = useLayerHighlight();

  return (
    <button
      type="button"
      data-layer={layer}
      aria-pressed={selected === layer}
      aria-label={label}
      onClick={() => toggle(layer)}
      className="diagram-layer"
    >
      {children}
    </button>
  );
}
