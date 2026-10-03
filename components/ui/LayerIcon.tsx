import { Cloud, Database, Monitor, Server, type LucideIcon } from "lucide-react";
import type { Layer } from "@/data/types";
import { cn } from "@/lib/utils";

/** One lucide icon per stack layer, from the interface down to the infrastructure */
export const LAYER_ICONS: Record<Layer, LucideIcon> = {
  interface: Monitor,
  application: Server,
  data: Database,
  infrastructure: Cloud,
};

/** Decorative: the layer is always named in text next to it */
export function LayerIcon({ layer, className }: { layer: Layer; className?: string }) {
  const Icon = LAYER_ICONS[layer];
  return <Icon aria-hidden="true" className={cn("size-5 shrink-0", className)} />;
}
