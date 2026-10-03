"use client";

import { useEffect, useRef } from "react";
import { skillGroups } from "@/data/skills";
import { site } from "@/data/site";

/** The line of the viewport (share of its height) where a section counts as reached */
const REACHED_AT = 0.4;

const clamp = (value: number) => Math.min(1, Math.max(0, value));

/**
 * The 4px strip on the header's top edge: four equal segments in the layer colours. Each is
 * dim by default. The segment(s) of the section in view brighten (Stack lights all four), and
 * a full-strength fill grows through them as you scroll through that section, so the strip is
 * also the scroll-progress indicator. Decorative: the sections are named in the links below.
 */
export function LayerStrip({ activeId }: { activeId: string | null }) {
  const strip = useRef<HTMLDivElement>(null);
  const mark = site.nav.find((item) => item.id === activeId)?.mark ?? "interface";
  const lit = activeId !== null;
  const all = lit && mark === "all";

  useEffect(() => {
    const element = strip.current;
    const section = activeId ? document.getElementById(activeId) : null;
    if (!element || !section) return;
    // No scroll-linked fill with reduced motion; CSS shows the lit segments at full strength
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const box = section.getBoundingClientRect();
      // 0 when the section's top reaches the "reached" line, 1 when its bottom does
      const progress = clamp((window.innerHeight * REACHED_AT - box.top) / box.height);
      element.style.setProperty("--p", progress.toFixed(4));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
      element.style.removeProperty("--p");
    };
  }, [activeId]);

  return (
    <div ref={strip} aria-hidden="true" className="layer-strip" data-all={all || undefined}>
      {skillGroups.map((group) => (
        <span
          key={group.layer}
          data-layer={group.layer}
          data-lit={all || (lit && mark === group.layer) || undefined}
        />
      ))}
    </div>
  );
}
