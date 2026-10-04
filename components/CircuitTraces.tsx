import { loadStep } from "@/components/ui/Reveal";
import type { Layer } from "@/data/types";
import { cn } from "@/lib/utils";

/**
 * PCB-style traces that leave the left corner of each plate of the exploded stack and run
 * towards the left, staying inside the stage (the layer cards use the right side). SVG
 * fragments in the stack's own coordinates, so they are drawn inside `StackDiagram`.
 *
 * Every path uses `pathLength="1"`, which makes the draw-in and the data pulses plain
 * `stroke-dashoffset` animations (see `.circuit-*` in globals.css). Paths run horizontally and
 * bend only at 45 degrees. Each layer stays inside its own band of 120 units, so traces of
 * different layers cannot cross.
 *
 * - `primary`: starts at the plate's left corner (x = 44); the pulse travels along a copy of it
 * - `secondary`: starts on the plate's lower left edge and ends at a different length
 * - `split`: leaves the primary trace and joins it again a little further on
 * - pads are open circles at the end of a trace
 *
 * `y` is the plate's centre. All coordinates are relative to it and shifted with a transform.
 */
type Pad = { x: number; y: number };
type Trace = { primary: string; secondary: string; split?: string; pads: Pad[] };

const TRACES: Record<Layer, Trace> = {
  interface: {
    primary: "M44 0H32L16 -16H-24",
    secondary: "M66 11H40L24 27H-6",
    pads: [
      { x: -28, y: -16 },
      { x: -10, y: 27 },
    ],
  },
  application: {
    primary: "M44 0H-30",
    secondary: "M66 11H38L24 25H-14",
    split: "M26 0L14 -12H-4L-16 0",
    pads: [
      { x: -34, y: 0 },
      { x: -18, y: 25 },
    ],
  },
  data: {
    primary: "M44 0H30L14 16H-20",
    secondary: "M66 11H48L34 -3H-8L-20 -15",
    pads: [
      { x: -24, y: 16 },
      { x: -22, y: -17 },
    ],
  },
  infrastructure: {
    primary: "M44 0H28L12 -16H-12",
    secondary: "M66 11H34L18 27H-22",
    pads: [
      { x: -16, y: -16 },
      { x: -26, y: 27 },
    ],
  },
};

const LAYERS = Object.keys(TRACES) as Layer[];

type Props = {
  /** Plate centres, y, in the stack's coordinates */
  centres: number[];
  /** Layer being hovered or focused, or -1 */
  hover: number;
  /** Per layer, how many times the request has arrived (a new value restarts the pulse) */
  pulses: number[];
};

/** Decorative: the same layers are already described in text next to the stack */
export function CircuitTraces({ centres, hover, pulses }: Props) {
  return (
    <g aria-hidden="true" className="max-md:hidden">
      {LAYERS.map((layer, step) => {
        const { primary, secondary, split, pads } = TRACES[layer];

        return (
          <g
            key={layer}
            data-layer={layer}
            data-hot={hover === step}
            transform={`translate(0 ${centres[step]})`}
            className={cn("circuit", loadStep(step))}
          >
            <path className="circuit-trace" pathLength={1} d={primary} />
            {/* Tablets keep one trace per layer */}
            <path className="circuit-trace max-lg:hidden" pathLength={1} d={secondary} />
            {split ? (
              <path className="circuit-trace max-lg:hidden" pathLength={1} d={split} />
            ) : null}
            {pads.map((pad, index) => (
              <circle
                key={`${pad.x}-${pad.y}`}
                className={cn("circuit-pad", index > 0 && "max-lg:hidden")}
                cx={pad.x}
                cy={pad.y}
                r={5}
              />
            ))}
            {/* A short bright segment that travels along the primary trace each time the
                request arrives at this layer (and keeps going while the layer is hovered) */}
            <path
              key={pulses[step]}
              className={cn("circuit-pulse", pulses[step] > 0 && "circuit-pulse-fire")}
              pathLength={1}
              d={primary}
            />
          </g>
        );
      })}
    </g>
  );
}
