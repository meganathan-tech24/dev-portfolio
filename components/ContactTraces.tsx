import { loadStep } from "@/components/ui/Reveal";
import type { Layer } from "@/data/types";
import { cn } from "@/lib/utils";

/** Same technique as CircuitTraces: 45 degree bends, `pathLength="1"`, a short dash that travels */
const TRACES: { layer: Layer; d: string }[] = [
  { layer: "interface", d: "M0 32H240L272 8H420" },
  { layer: "application", d: "M300 56H520L548 32H700" },
  { layer: "data", d: "M620 8H820L848 32H960" },
  { layer: "infrastructure", d: "M900 56H1080L1104 32H1180" },
];

/** Decorative traces in the four layer colours along the bottom of the Contact section */
export function ContactTraces() {
  return (
    <svg viewBox="0 0 1180 64" aria-hidden="true" focusable="false" className="contact-traces">
      {TRACES.map((trace, index) => (
        <g key={trace.layer} data-layer={trace.layer}>
          <path className="contact-trace" d={trace.d} />
          <path className={cn("contact-trace-pulse", loadStep(index))} pathLength={1} d={trace.d} />
        </g>
      ))}
    </svg>
  );
}
