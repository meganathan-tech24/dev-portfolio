import type { Layer, Tech } from "@/data/types";

/** Top to bottom, the order used everywhere a tie has to be broken */
const LAYER_ORDER: Layer[] = ["interface", "application", "data", "infrastructure"];

/**
 * The layer with the most technologies in a stack (ties go to the higher layer).
 * Computed from the project data, so adding a project needs no extra field.
 */
export function mainLayer(stack: Tech[]): Layer {
  const counts = new Map<Layer, number>();
  for (const tech of stack) counts.set(tech.layer, (counts.get(tech.layer) ?? 0) + 1);

  return LAYER_ORDER.reduce((best, layer) =>
    (counts.get(layer) ?? 0) > (counts.get(best) ?? 0) ? layer : best,
  );
}

/**
 * The four colours a project's animated border (.border-flow) cycles through, as
 * data-flow-1 to data-flow-4 attributes. A project only uses the layers in its own stack;
 * with fewer than four, the list repeats so the sweep still has four stops.
 */
export function flowAttributes(stack: Tech[]) {
  const own = LAYER_ORDER.filter((layer) => stack.some((tech) => tech.layer === layer));
  const layers = own.length > 0 ? own : LAYER_ORDER;
  return {
    "data-flow-1": layers[0],
    "data-flow-2": layers[1 % layers.length],
    "data-flow-3": layers[2 % layers.length],
    "data-flow-4": layers[3 % layers.length],
  };
}
