import { skillGroups } from "@/data/skills";

/**
 * One fixed layer behind the whole page: four very soft colour fields in the layer colours.
 * They are what the glass surfaces (.glass, .glass-strong) blur, so cards look like frosted
 * glass instead of flat white. The fields drift very slowly (transform only) and stand
 * still with reduced motion. Purely decorative.
 */
export function GlassBackground() {
  return (
    <div aria-hidden="true" className="glass-bg">
      {skillGroups.map((group) => (
        <div key={group.layer} className="glass-drift">
          <div data-layer={group.layer} className="glass-field" />
        </div>
      ))}
    </div>
  );
}
