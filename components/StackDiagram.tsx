"use client";

import { useAnimationFrame, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { CircuitTraces } from "@/components/CircuitTraces";
import { useHero } from "@/components/HeroState";
import { useLayerHighlight } from "@/components/LayerHighlightProvider";
import { skillGroups } from "@/data/skills";
import type { Layer } from "@/data/types";
import type { KeyboardEvent } from "react";

// SVG user units. The viewBox scales with the column, so everything scales together. The left
// 40 units are for the circuit traces; the layer cards sit beside the SVG, not inside it.
const VIEW_LEFT = -40;
const WIDTH = 480;
const HEIGHT = 800;
const CX = 220;
const HALF_WIDTH = 176;
const HALF_HEIGHT = 86;
const THICKNESS = 18;
/** Plate centres, y, exploded. They sit at 1/5 to 4/5 of the height, which is where the cards go. */
export const PLATE_CENTRES = [160, 320, 480, 640];

/** The request dot starts when the plates have separated and the traces are being drawn */
const DOT_START_MS = 2400;
const DOT_SECONDS_PER_WAY = 3.4;
const DOT_PAUSE_SECONDS = 0.6;
const DOT_RANGE = PLATE_CENTRES[3] - PLATE_CENTRES[0];
/** How close (user units) the dot must be to a plate centre to count as inside it */
const NEAR = 16;

const diamond = (halfHeight: number, inset = 0) =>
  `${CX},${-halfHeight + inset} ${CX + HALF_WIDTH - inset * 2},0 ${CX},${halfHeight - inset} ${CX - HALF_WIDTH + inset * 2},0`;

/** What you see of one plate: shadow, thickness, top face, inner outline and the corner node */
function PlateVisual({ index, layer }: { index: number; layer: Layer }) {
  const { active, hover } = useHero();

  return (
    <g
      data-layer={layer}
      data-tint={active === index}
      data-hot={hover === index}
      className="stack-plate"
    >
      <g className={`plate-sep plate-sep-${index}`}>
        <g className={`plate-drop plate-drop-${index}`}>
          <polygon
            className="plate-shadow"
            filter="url(#stack-shadow)"
            points={`${CX},${-HALF_HEIGHT + 44} ${CX + HALF_WIDTH},44 ${CX},${HALF_HEIGHT + 44} ${CX - HALF_WIDTH},44`}
          />
          <polygon
            className="plate-side"
            points={`${CX - HALF_WIDTH},0 ${CX},${HALF_HEIGHT} ${CX},${HALF_HEIGHT + THICKNESS} ${CX - HALF_WIDTH},${THICKNESS}`}
          />
          <polygon
            className="plate-side plate-side-right"
            points={`${CX},${HALF_HEIGHT} ${CX + HALF_WIDTH},0 ${CX + HALF_WIDTH},${THICKNESS} ${CX},${HALF_HEIGHT + THICKNESS}`}
          />
          <polygon className="plate-top" points={diamond(HALF_HEIGHT)} />
          <polygon className="plate-inner" points={diamond(HALF_HEIGHT, 18)} />
          <circle className="plate-node" cx={CX + HALF_WIDTH} cy={0} r={4} />
        </g>
      </g>
    </g>
  );
}

/**
 * The exploded isometric stack: four plates drawn as 2D polygons in one inline SVG (no CSS 3D).
 * A request dot travels down the axis and back up, with a short pause at each end. It only
 * reports the layer it is in (`arrive`); everything that shows the active layer reads it from
 * HeroState. Hovering or focusing a plate pulls the dot into it and fades the other plates;
 * selecting a plate highlights that layer's tags across the page.
 */
export function StackDiagram() {
  const { active, hover, setHover, setDirection, arrive, pulses, isRunning } = useHero();
  const { selected, toggle } = useLayerHighlight();
  const reduceMotion = useReducedMotion();
  const dot = useRef<SVGCircleElement>(null);
  const hoverRef = useRef(hover);
  const progress = useRef({ t: 0, direction: 1, hold: DOT_PAUSE_SECONDS, layer: -1 });

  useEffect(() => {
    hoverRef.current = hover;
  }, [hover]);

  useAnimationFrame((time, delta) => {
    const element = dot.current;
    if (!element || reduceMotion || time < DOT_START_MS || !isRunning()) return;

    const state = progress.current;
    const step = Math.min(delta, 100) / 1000; // a long frame (tab was hidden) must not make the dot jump
    const hovered = hoverRef.current;
    let y = PLATE_CENTRES[0] + state.t * DOT_RANGE;

    if (hovered >= 0) {
      // hovering a plate pulls the dot into it; leaving lets it carry on from there
      y += (PLATE_CENTRES[hovered] - y) * Math.min(1, step * 12);
      state.t = (y - PLATE_CENTRES[0]) / DOT_RANGE;
    } else if (state.hold > 0) {
      state.hold -= step;
    } else {
      state.t += (state.direction * step) / DOT_SECONDS_PER_WAY;
      if (state.t >= 1 || state.t <= 0) {
        state.t = Math.min(1, Math.max(0, state.t));
        state.direction = -state.direction;
        state.hold = DOT_PAUSE_SECONDS;
        setDirection(state.direction > 0 ? "request" : "response");
      }
      y = PLATE_CENTRES[0] + state.t * DOT_RANGE;
    }

    const near = PLATE_CENTRES.findIndex((centre) => Math.abs(centre - y) < NEAR);
    if (near >= 0 && near !== state.layer) {
      state.layer = near;
      arrive(near);
    }

    element.setAttribute("cy", String(y));
    element.setAttribute("opacity", "1");
  });

  const activate = (event: KeyboardEvent, layer: Layer) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggle(layer);
    }
  };

  return (
    <svg
      viewBox={`${VIEW_LEFT} 0 ${WIDTH} ${HEIGHT}`}
      role="group"
      aria-label="My stack in four layers. Select a layer to highlight its tags on the page."
      data-dim={hover >= 0}
      className="stack-iso"
    >
      <defs>
        <filter id="stack-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="16" />
        </filter>
        <filter id="stack-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <CircuitTraces centres={PLATE_CENTRES} hover={hover} pulses={pulses} />

      {/* Decorative: the layers are listed in text beside the stack. Back to front, so the
          top plate covers the ones below it. */}
      <g aria-hidden="true">
        <line className="stack-axis" x1={CX} y1={28} x2={CX} y2={HEIGHT - 28} />
        {skillGroups
          .map((group, index) => ({ group, index }))
          .reverse()
          .map(({ group, index }) => (
            <g key={group.layer} transform={`translate(0 ${PLATE_CENTRES[index]})`}>
              <PlateVisual index={index} layer={group.layer} />
            </g>
          ))}
        <circle
          ref={dot}
          data-layer={skillGroups[active].layer}
          className="stack-dot stack-glow"
          cx={CX}
          cy={PLATE_CENTRES[0]}
          r={7}
          opacity={0}
        />
      </g>

      {/* What you reach: an invisible area over each plate, top to bottom, so Tab goes down the stack */}
      <g>
        {skillGroups.map((group, index) => (
          <g
            key={group.layer}
            transform={`translate(0 ${PLATE_CENTRES[index]})`}
            data-layer={group.layer}
            role="button"
            tabIndex={0}
            aria-pressed={selected === group.layer}
            aria-label={`${group.label} layer`}
            className="plate-hit"
            onMouseEnter={() => setHover(index)}
            onMouseLeave={() => setHover(-1)}
            onFocus={() => setHover(index)}
            onBlur={() => setHover(-1)}
            onClick={() => toggle(group.layer)}
            onKeyDown={(event) => activate(event, group.layer)}
          >
            <polygon points={diamond(HALF_HEIGHT - 4)} />
          </g>
        ))}
      </g>
    </svg>
  );
}
