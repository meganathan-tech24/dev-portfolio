import { loadStep } from "@/components/ui/Reveal";
import type { Layer } from "@/data/types";
import { cn } from "@/lib/utils";

/**
 * PCB-style traces that run from the right edge of one stack-diagram layer towards the page
 * edge. Hand-written paths on a 384 x 84 grid (one layer plus half the gap above and below),
 * so traces of different layers can never cross. Every path uses `pathLength="1"`, which
 * makes the draw-in and the data pulses plain `stroke-dashoffset` animations (see
 * `.circuit-*` in globals.css). Paths bend only at 45 degrees.
 *
 * - `primary`: the trace that also carries the data pulses (kept at 4 duplicate paths in all)
 * - `extra`: more traces, shown from `lg` (tablets keep one trace per layer)
 * - pads are open circles at the end of a trace
 */
type Trace = { d: string; pad?: { x: number; y: number } };

const TRACES: Record<Layer, { primary: Trace; extra: Trace[] }> = {
  interface: {
    primary: { d: "M0 42H64L84 22H176L196 42H292", pad: { x: 296, y: 42 } },
    extra: [{ d: "M0 52H50L70 72H150L166 56H236", pad: { x: 240, y: 56 } }],
  },
  application: {
    primary: { d: "M0 42H150L166 58H240L256 42H340", pad: { x: 344, y: 42 } },
    // splits off the primary trace and joins it again a little further on
    extra: [{ d: "M40 42L56 26H126L142 42" }],
  },
  data: {
    primary: { d: "M0 42H48L68 62H160L176 46H250L270 26H316", pad: { x: 320, y: 26 } },
    extra: [{ d: "M0 30H90L104 16H210", pad: { x: 214, y: 16 } }],
  },
  infrastructure: {
    primary: { d: "M0 42H110L126 26H200L216 42H284L300 58H350", pad: { x: 354, y: 58 } },
    extra: [{ d: "M0 54H70L82 66H180", pad: { x: 184, y: 66 } }],
  },
};

const PULSE_CLASS: Record<Layer, string> = {
  interface: "circuit-pulse-1",
  application: "circuit-pulse-2",
  data: "circuit-pulse-3",
  infrastructure: "circuit-pulse-4",
};

type CircuitTracesProps = {
  layer: Layer;
  /** Position of the layer in the diagram (0 = top): the traces are drawn layer by layer */
  step: number;
};

/** Decorative: the same layers are already listed in text next to the diagram */
export function CircuitTraces({ layer, step }: CircuitTracesProps) {
  const { primary, extra } = TRACES[layer];
  const pads = [primary, ...extra].flatMap((trace) =>
    trace.pad ? [{ ...trace.pad, extra: trace !== primary }] : [],
  );

  return (
    <svg
      viewBox="0 0 384 84"
      aria-hidden="true"
      focusable="false"
      data-layer={layer}
      className={cn(
        "circuit pointer-events-none absolute top-1/2 left-full hidden h-21 w-96 -translate-y-1/2 md:block",
        loadStep(step),
      )}
    >
      <path className="circuit-trace" pathLength={1} d={primary.d} />
      {extra.map((trace) => (
        <path key={trace.d} className="circuit-trace max-lg:hidden" pathLength={1} d={trace.d} />
      ))}
      {pads.map((pad) => (
        <circle
          key={`${pad.x}-${pad.y}`}
          className={cn("circuit-pad", pad.extra && "max-lg:hidden")}
          cx={pad.x}
          cy={pad.y}
          r={4}
        />
      ))}
      {/* A short bright segment that travels along the primary trace */}
      <path className={cn("circuit-pulse", PULSE_CLASS[layer])} pathLength={1} d={primary.d} />
    </svg>
  );
}
