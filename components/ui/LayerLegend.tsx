import { skillGroups } from "@/data/skills";

/** Names the layer behind each tag colour, so colour is never the only signal */
export function LayerLegend() {
  return (
    <div className="type-small mt-4 flex flex-wrap items-center gap-x-4 gap-y-1">
      <p>Tag colour shows the stack layer:</p>
      <ul className="flex flex-wrap gap-x-4 gap-y-1">
        {skillGroups.map((group) => (
          <li
            key={group.layer}
            data-layer={group.layer}
            className="layer-text font-medium"
          >
            {group.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
