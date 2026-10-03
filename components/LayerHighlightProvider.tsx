"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { Layer } from "@/data/types";

type State = { selected: Layer | null; message: string };

type LayerHighlight = {
  selected: Layer | null;
  /** Select a layer, or clear the selection if it is already selected */
  toggle: (layer: Layer) => void;
  /** Select a layer; choosing the one that is already selected keeps it selected */
  select: (layer: Layer) => void;
};

const LayerHighlightContext = createContext<LayerHighlight | null>(null);

/**
 * Holds which stack layer is highlighted. It is plain client state (not in the
 * URL). The wrapper sets `data-highlight` so globals.css can dim the tags of
 * the other layers anywhere on the page without re-rendering them.
 */
export function LayerHighlightProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>({ selected: null, message: "" });

  const toggle = useCallback((layer: Layer) => {
    setState((current) =>
      current.selected === layer
        ? { selected: null, message: "Highlight cleared" }
        : { selected: layer, message: `Highlighting ${layer} layer tags` },
    );
  }, []);

  const select = useCallback((layer: Layer) => {
    setState((current) =>
      current.selected === layer
        ? current
        : { selected: layer, message: `Highlighting ${layer} layer tags` },
    );
  }, []);

  const value = useMemo(
    () => ({ selected: state.selected, toggle, select }),
    [state.selected, toggle, select],
  );

  return (
    <LayerHighlightContext value={value}>
      <div className="contents" data-highlight={state.selected ?? undefined}>
        {children}
      </div>
      {/* The dimming is visual only, so say what changed */}
      <p role="status" aria-live="polite" className="sr-only">
        {state.message}
      </p>
    </LayerHighlightContext>
  );
}

export function useLayerHighlight() {
  const context = useContext(LayerHighlightContext);
  if (!context) {
    throw new Error("useLayerHighlight must be used inside LayerHighlightProvider");
  }
  return context;
}
