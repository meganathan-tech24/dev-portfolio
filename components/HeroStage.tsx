"use client";

import { Pause, Play } from "lucide-react";
import { useHero } from "@/components/HeroState";
import { StackDiagram } from "@/components/StackDiagram";
import { useLayerHighlight } from "@/components/LayerHighlightProvider";
import { loadStep } from "@/components/ui/Reveal";
import { skillGroups } from "@/data/skills";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

/** Technologies named on each card; the visually hidden summary lists all of them */
const TECH_ON_CARD = 4;

/** From xl the cards sit beside the stack, level with their plates (1/5 to 4/5 of its height) */
const CARD_TOP = ["xl:top-1/5", "xl:top-2/5", "xl:top-3/5", "xl:top-4/5"];

/**
 * The right half of the hero: a glass panel with a blueprint grid that bleeds off the right edge
 * of the screen from `lg`. A top bar shows the request trace (tag, "Layer N of 4", Pause), the
 * body holds the exploded stack and one card per layer, and the footer a hint and the legend.
 * Every part reads the active layer from HeroState.
 */
export function HeroStage() {
  const { active, hover, setHover, direction, paused, togglePaused } = useHero();
  const { selected, toggle } = useLayerHighlight();
  const { stage } = site.hero;

  return (
    <div
      data-dim={hover >= 0}
      data-paused={paused || undefined}
      className="hero-in hero-in-stage glass stage-panel"
    >
      <div className="stage-bar">
        <p className="stage-title">
          <span className="stage-trace">{stage.trace}</span> {stage.title}
        </p>
        <span aria-hidden="true" data-layer={skillGroups[active].layer} className="stage-phase">
          {direction === "request" ? stage.request : stage.response}
        </span>
        <span aria-hidden="true" className="stage-steps">
          {stage.layerWord} {active + 1} {stage.ofWord} {skillGroups.length}
        </span>
        {/* Nothing moves under reduced motion, so there is nothing to pause */}
        <button
          type="button"
          aria-pressed={paused}
          onClick={togglePaused}
          className="stage-toggle motion-reduce:hidden"
        >
          {paused ? (
            <Play aria-hidden="true" className="size-3" fill="currentColor" />
          ) : (
            <Pause aria-hidden="true" className="size-3" fill="currentColor" />
          )}
          {paused ? stage.play : stage.pause}
        </button>
      </div>

      <div className="stage-body">
        <StackDiagram />

        <div className="stage-cards">
          {skillGroups.map((group, index) => (
            <button
              key={group.layer}
              type="button"
              data-layer={group.layer}
              data-on={active === index}
              aria-pressed={selected === group.layer}
              onClick={() => toggle(group.layer)}
              onMouseEnter={() => setHover(index)}
              onMouseLeave={() => setHover(-1)}
              onFocus={() => setHover(index)}
              onBlur={() => setHover(-1)}
              className={cn("layer-card", CARD_TOP[index], loadStep(index))}
            >
              <span className="layer-card-name">
                {group.label}
                <span className="layer-card-step">{String(index + 1).padStart(2, "0")}</span>
              </span>
              <span className="layer-card-sentence">{group.requestStep}</span>
              <span className="layer-card-tech">
                {group.skills
                  .slice(0, TECH_ON_CARD)
                  .map((skill) => skill.name)
                  .join(", ")}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="stage-foot">
        <p className="stage-hint">{stage.hint}</p>
        <span aria-hidden="true" className="stage-legend">
          {skillGroups.map((group) => (
            <span key={group.layer} data-layer={group.layer} className="layer-fill" />
          ))}
        </span>
      </div>

      {/* Text alternative for the stack: every layer, its step and all of its technologies */}
      <ul className="sr-only">
        {skillGroups.map((group, index) => (
          <li key={group.layer}>
            Step {index + 1}, {group.label}: {group.requestStep}. Technologies:{" "}
            {group.skills.map((skill) => skill.name).join(", ")}.
          </li>
        ))}
      </ul>
    </div>
  );
}
