"use client";

import { useLayerHighlight } from "@/components/LayerHighlightProvider";
import { skillGroups } from "@/data/skills";

/**
 * Names the layer behind each tag colour, so colour is never the only signal.
 * Selecting a layer highlights its tags everywhere on the page; selecting it again clears it.
 */
export function LayerLegend() {
  const { selected, toggle } = useLayerHighlight();

  return (
    <div className="type-small mt-4 flex flex-wrap items-center gap-x-4 gap-y-1">
      <p>Tag colour shows the stack layer. Select a layer to highlight its tags:</p>
      <ul className="flex flex-wrap gap-x-2 gap-y-1">
        {skillGroups.map((group) => (
          <li key={group.layer} data-layer={group.layer}>
            <button
              type="button"
              aria-pressed={selected === group.layer}
              onClick={() => toggle(group.layer)}
              className="layer-toggle"
            >
              {group.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
