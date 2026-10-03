import { Badge } from "@/components/ui/Badge";
import { TechIcon } from "@/components/ui/TechIcon";
import type { IconKey, Layer } from "@/data/types";
import { iconKeyFor } from "@/lib/tech";

type TechBadgeProps = {
  name: string;
  layer: Layer;
  /** Defaults to the icon stored for this technology in data/skills.ts */
  icon?: IconKey;
};

/** A layer-coloured badge with the technology's logo before its name */
export function TechBadge({ name, layer, icon }: TechBadgeProps) {
  return (
    <Badge layer={layer}>
      <TechIcon icon={icon ?? iconKeyFor(name)} layer={layer} />
      {name}
    </Badge>
  );
}
