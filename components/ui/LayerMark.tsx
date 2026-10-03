import { skillGroups } from "@/data/skills";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

/** First letters of the name, e.g. "MP" */
export const INITIALS = site.name
  .split(" ")
  .map((word) => word[0])
  .join("");

/**
 * My mark: four short stacked bars in the layer colours, an echo of the stack diagram,
 * with the initials beside them (the footer and the favicon). The header shows the bars
 * alone, next to my first name. Decorative: the text next to it always carries the name.
 */
export function LayerMark({
  className,
  showInitials = true,
}: {
  className?: string;
  showInitials?: boolean;
}) {
  return (
    <span aria-hidden="true" className={cn("inline-flex shrink-0 items-center gap-2", className)}>
      {showInitials ? (
        <span className="font-display text-lg leading-none font-extrabold font-stretch-expanded">
          {INITIALS}
        </span>
      ) : null}
      <span className="flex flex-col gap-0.5">
        {skillGroups.map((group) => (
          <span key={group.layer} data-layer={group.layer} className="layer-fill block h-0.5 w-4" />
        ))}
      </span>
    </span>
  );
}
