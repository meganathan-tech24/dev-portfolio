"use client";

import { useHero } from "@/components/HeroState";
import { skillGroups } from "@/data/skills";
import { site } from "@/data/site";

/**
 * The role label above the name: a mini four-bar layer meter, my role, and `/ layer` in that
 * layer's colour. The meter and the layer word follow the active layer (the layer the request
 * is in, or the one being hovered in the stack). The role is plain text; the rest is decoration.
 */
export function RoleBlock({ className }: { className?: string }) {
  const { active } = useHero();
  const shown = skillGroups[active];

  return (
    <div className={className}>
      <span aria-hidden="true" className="role-meter">
        {skillGroups.map((group, index) => (
          <span
            key={group.layer}
            data-layer={group.layer}
            data-on={index === active}
            className="role-meter-bar"
          />
        ))}
      </span>
      <span className="role-title">{site.role}</span>
      <span aria-hidden="true" data-layer={shown.layer} className="role-layer max-sm:hidden">
        / <span className="layer-text">{shown.label.toLowerCase()}</span>
      </span>
    </div>
  );
}
