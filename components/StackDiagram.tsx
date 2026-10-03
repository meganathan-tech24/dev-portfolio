import { DiagramLayer } from "@/components/DiagramLayer";
import { TraceController } from "@/components/TraceController";
import { Reveal, loadStep } from "@/components/ui/Reveal";
import { skillGroups } from "@/data/skills";
import { cn } from "@/lib/utils";

/** Technologies named in each layer of the diagram */
const TECH_PER_LAYER = 4;

// SVG user units. The viewBox scales with the container, so text scales too.
const WIDTH = 400;
const HEIGHT = 72;
const NAME_X = 16;
const TECH_X = [148, 282];
const TECH_Y = [30, 54];

export function StackDiagram({ className }: { className?: string }) {
  return (
    <figure className={cn("m-0", className)}>
      {/* Four layers, interface at the top, infrastructure at the bottom.
          `data-trace` is flipped by TraceController to pause the request trace. */}
      <div className="glass rounded-lg p-3 sm:p-4">
        <div
          role="group"
          aria-label="My stack, from the interface down to the infrastructure. Select a layer to highlight its tags on the page."
          data-trace="running"
          className="stack-trace flex flex-col gap-3"
        >
          {skillGroups.map((group, index) => (
            <Reveal key={group.layer} step={index} className="relative">
              <DiagramLayer
                layer={group.layer}
                label={`${group.label} layer: ${group.skills
                  .slice(0, TECH_PER_LAYER)
                  .map((skill) => skill.name)
                  .join(", ")}`}
              >
                <svg
                  viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
                  className="block h-auto w-full"
                  aria-hidden="true"
                  focusable="false"
                >
                  <rect
                    className="layer-shape"
                    x={1}
                    y={1}
                    width={WIDTH - 2}
                    height={HEIGHT - 2}
                    rx={8}
                  />
                  <text
                    className="layer-text fill-current font-display font-bold"
                    x={NAME_X}
                    y={42}
                    fontSize={16}
                  >
                    {group.label}
                  </text>
                  {group.skills.slice(0, TECH_PER_LAYER).map((skill, i) => (
                    <text
                      key={skill.name}
                      className="fill-neutral-700 font-display dark:fill-neutral-300"
                      x={TECH_X[i % 2]}
                      y={TECH_Y[Math.floor(i / 2)]}
                      fontSize={14}
                    >
                      {skill.name}
                    </text>
                  ))}
                </svg>
                {/* Brightens as the request trace passes through this layer */}
                <span aria-hidden="true" className={`layer-pulse trace-pulse-${index + 1}`} />
              </DiagramLayer>
              {/* Line from this layer towards the page edge, drawn once after the layers land */}
              <span
                aria-hidden="true"
                data-layer={group.layer}
                className={cn("layer-line load-draw", loadStep(index))}
              />
            </Reveal>
          ))}

          {/* The request trace: a small dot travelling down through the layers and back up */}
          <span aria-hidden="true" className="trace-dot" />
          <TraceController />
        </div>
      </div>
    </figure>
  );
}
