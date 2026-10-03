import { skillGroups } from "@/data/skills";
import type { NavItem } from "@/data/types";
import { cn } from "@/lib/utils";

type SectionMarkProps = {
  mark: NavItem["mark"];
  /** "horizontal" is the underline under a link; "vertical" is the marker in the menu */
  direction: "horizontal" | "vertical";
  className?: string;
};

/**
 * A section's colour marker: one bar in a layer colour (sky when none is set), or four
 * stripes, one per layer, for "all". Decorative: the section is always named in text.
 */
export function SectionMark({ mark, direction, className }: SectionMarkProps) {
  const row = direction === "horizontal";

  if (mark === "all") {
    return (
      <span
        aria-hidden="true"
        className={cn("flex", row ? "h-0.5 w-full" : "h-7 w-1.5 flex-col", className)}
      >
        {skillGroups.map((group) => (
          <span key={group.layer} data-layer={group.layer} className="layer-fill flex-1" />
        ))}
      </span>
    );
  }

  return (
    <span
      aria-hidden="true"
      data-layer={mark ?? "interface"}
      className={cn("layer-fill block", row ? "h-0.5 w-full" : "h-7 w-1.5", className)}
    />
  );
}
