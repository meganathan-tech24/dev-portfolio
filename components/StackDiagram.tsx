import { Reveal } from "@/components/ui/Reveal";
import { skillGroups } from "@/data/skills";
import { cn } from "@/lib/utils";

/** Technologies named in each layer of the diagram */
const TECH_PER_LAYER = 4;

/** Seconds between one layer starting and the next; four layers finish in about 600ms */
const STAGGER = 0.1;

// SVG user units. The viewBox scales with the container, so text scales too.
const WIDTH = 400;
const HEIGHT = 72;
const NAME_X = 16;
const TECH_X = [148, 282];
const TECH_Y = [30, 54];

export function StackDiagram({ className }: { className?: string }) {
  return (
    <figure className={cn("m-0", className)}>
      {/* Visual: four layers, interface at the top, infrastructure at the bottom */}
      <div aria-hidden="true" className="flex flex-col gap-3">
        {skillGroups.map((group, index) => (
          <Reveal key={group.layer} delay={index * STAGGER}>
            <svg
              viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
              className="block h-auto w-full"
              data-layer={group.layer}
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
                  key={skill}
                  className="fill-neutral-700 font-display dark:fill-neutral-300"
                  x={TECH_X[i % 2]}
                  y={TECH_Y[Math.floor(i / 2)]}
                  fontSize={14}
                >
                  {skill}
                </text>
              ))}
            </svg>
          </Reveal>
        ))}
      </div>

      {/* Text alternative: the same layers as a list */}
      <figcaption className="sr-only">
        <p>My stack, from the interface down to the infrastructure:</p>
        <ul>
          {skillGroups.map((group) => (
            <li key={group.layer}>
              {group.label}: {group.skills.slice(0, TECH_PER_LAYER).join(", ")}
            </li>
          ))}
        </ul>
      </figcaption>
    </figure>
  );
}
